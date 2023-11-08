<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" >
      <el-form-item label="申请商户" prop="userName">
        <el-input v-model="queryParams.userName" placeholder="请输入申请商户名称" clearable  />
      </el-form-item>
      <el-form-item label="状态" prop="withdrawStatus">
        <el-select v-model="queryParams.withdrawStatus" placeholder="审核状态" clearable>
          <el-option v-for="dict in dict.type.sys_review_type"  :label="dict.label" :key="dict.value" :value="dict.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="dateRange" label="申请时间">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="-"
          @change="timeChange"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:role:export']">导出</el-button>
      </el-form-item>
    </el-form>
     <!-- 表 -->
    <el-table v-loading="loading" :data="cardList" border>
      <el-table-column label="申请时间" prop="createTime" width="200" align="center" />
      <el-table-column label="会员名称" prop="userName" width="200" align="center" />
      <el-table-column label="提现金额" prop="withdrawalAmount" width="200" align="center" />
      <el-table-column label="提现方式"  width="200" align="center" >
        <template slot-scope="scope">
          {{scope.row.withdrawalMethod=='WECHAT'?'微信':(scope.row.withdrawalMethod=='ALIPAY'?'支付宝':'银行卡')}}
        </template>
      </el-table-column>
      <el-table-column label="支付宝账号"  width="200" prop="alipayId" align="center" />
      <el-table-column label="银行卡卡号"  width="200" prop="bankAccountName" align="center"/>
      <el-table-column label="银行"  width="200" prop="bankAccountNo" align="center"/>
      <el-table-column label="状态"  width="200" align="center" >
        <template slot-scope="scope">
          <dict-tag :style="scope.row.withdrawStatus == 'APPROVING'?'color: #67C23A':''" :options="dict.type.sys_review_type" :value="scope.row.withdrawStatus" />       
         </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope" v-if="scope.row.id !== 1">
            <el-button type="text" :style="scope.row.withdrawStatus=='APPROVING'?'color: #67C23A;':'' " icon="el-icon-check"  :disabled="scope.row.withdrawStatus=='APPROVING'?false:true"  size="mini "  @click="handleApply(scope.row)"
              v-hasPermi="['system:info:remove']">审核</el-button>
            <el-button style="color: #E6A23C;" icon="el-icon-close" :disabled="scope.row.withdrawStatus=='APPROVING'?false:true" type="text" size="mini "  @click="handleReject(scope.row)"
              v-hasPermi="['system:info:remove']">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <el-dialog :title="dialogTitle" :visible.sync="dialogOpen" width="45%">
        <el-form ref="elForm" :model="formData" :rules="rules" :inline="true" size="medium" label-width="100px">
          <el-form-item label="拒绝原因" prop="rejectReason">
            <el-input v-model="formData.rejectReason" placeholder="请输入拒绝原因" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="rejectSubmit">确定</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
  import {
    getwithdrawalList,
    addCard,
    auditUserWithdrawalInfo
  } from "@/api/member/withdrawal";
  import store from '@/store'
  export default {
    dicts: ['sys_review_type'],
    data() {
      return {
          queryParams: {
            pageNum: 1,
            pageSize: 10,
            startTime: '',
            stopTime: '',
            withdrawalUserType:'MERCHANT'
          },
          headers: {
            Authorization: "Bearer " + store.getters.token
          },
          uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile/oss",
          dialogTitle:'',
          dialogOpen:false,
          cardTypeOptions:[],
          loading:false,
          cardList:[],
          dateRange:[],
          total:0,
          formData:{
            cardName:'',
            cardType:'',
            cardLogo:''
          },
          rules:{
            rejectReason:[
              {
                required: true,
                message: '请输入拒绝原因',
                trigger: 'change'
              }
            ]
          },

      }
    },
    created() {
      this.getList()
    },
    mounted() {
    },
    methods: {
      timeChange(val) {
        this.queryParams.startTime=val[0];
        this.queryParams.stopTime=val[1];
       },
        getList(){
          this.loading = true;
          // this.queryParams.startTime=this.dateRange[0];
          // this.queryParams.stopTime=this.dateRange[1];
          getwithdrawalList(this.queryParams).then(response => {
            this.cardList = response.rows;
            this.total = response.total;
            this.loading = false;
          });
        },
        /** 导出按钮操作 */
        handleExport() {
          if(this.queryParams.startTime===undefined || this.queryParams.stopTime===undefined){
            this.$modal.msgSuccess("请输入导出时间");
            return
          }
         
          this.download('merchant/merchant/withdrawal/export', {
            ...this.queryParams
          }, `/merchant-withdrawal-list_${new Date().getTime()}.xlsx`)
        },

       /**
        * @param {Object} nickName
        */
       searchUserByName(nickName){
         this.queryParams.nickName=nickName;
         this.getUserList();
       },
       //用户加载更多
       loadmore(){
         this.getUserList();
       },
       /**
        * 查询用户信息
        */
       getUserList() {
         this.loading = true;
         listInfo(this.queryParams).then(response => {
           this.userInfoOptions = response.rows;
           this.userInfToTal = response.total;
           this.loading = false;
         });
       },
       /**
        * 搜索按钮事件
        */
       searchQuery() {
         this.getList();
       },
       // 新增取消
       cancel() {
         this.resetQuery();
         this.dialogOpen = false;
       },
       /** 拒绝按钮操作 */
       handleReject(row) {
         this.dialogTitle='拒绝原因';
         this.dialogOpen = true;
         this.item=row;
       },
       //拒绝
       rejectSubmit(){
         this.formData.id=this.item.id;
         this.formData.acceptType='REJECT';
         this.$refs['elForm'].validate(valid => {
           if (valid) {
            auditUserWithdrawalInfo(this.formData).then(response => {
               this.$modal.msgSuccess("新增成功");
               this.dialogOpen = false;
               this.getList();
             });
           }

         })
       },
       /**
        * @param {Object} row
        * 审核通过
        */
       handleApply(row) {
         // this.formData = row;
         row.acceptType='AGREED';
         this.$modal.confirm('是否确认同意该条数据项？').then(function() {
           return auditUserWithdrawalInfo(row);
         }).then(() => {
           this.getList();
           this.$modal.msgSuccess("操作成功");
         }).catch(() => {});
       },
       //参数重置
       resetQuery() {
         this.resetForm("queryForm");
         this.resetForm("elForm");
         this.formData = {
           rejectReason: ''
         },
          this.queryParams={
            pageNum: 1,
            pageSize: 10,
            startTime: undefined,
            stopTime: undefined,
            withdrawalUserType:'MERCHANT'
          },
         this.dateRange=[];
       }

    }
  }
</script>
<style>
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>