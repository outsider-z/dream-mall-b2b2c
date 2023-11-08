<template>
  <div class="app-container">
    
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="申请人" prop="userInfoId">
        <el-select style="width: 240px" v-model="queryParams.userInfoId" clearable :filter-method="searchUserByName" filterable
          placeholder="请输入申请人昵称" v-el-select-loadmore="seleLoadmore">
          <el-option v-for="item in userInfoOptions" :key="item.id" :label="item.nickName + '-' + item.phoneNo"
            :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select style="width: 240px" v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option v-for="dict in dict.type.sys_review_type"  :label="dict.label" :key="dict.value" :value="dict.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表 -->
    <el-table v-loading="loading" :data="realNameList" border>
      <el-table-column label="用户昵称" prop="userInfoId" width="200" align="center" />
      <el-table-column label="用户姓名" prop="realName" width="200" align="center" />
      <el-table-column label="提交时间" prop="createTime" width="200" align="center" />
      <el-table-column label="用户类型"  width="200" align="center" >
          <template slot-scope="scope">
              {{scope.row.userType=="PERSONAL"?'个人':(scope.row.userType=="INDIVIDUAL"?'个体':'企业')}}
          </template>
      </el-table-column>

      <el-table-column label="法人身份证" prop="legalFrontIdCard" width="200" show-overflow-tooltip align="center" >
        <template slot-scope="scope">
            <el-popover placement="right" width="180" trigger="hover" style="margin-right: 20px;">
              <img :src="`${imgHost}`+ scope.row.legalFrontIdCard" alt="" style="width: 240px;height: 150px">
              <img slot="reference" :src="`${imgHost}`+ scope.row.legalFrontIdCard" style="max-height: 40px;max-width: 40px">
            </el-popover>
            <el-popover placement="right" width="180" trigger="hover">
              <img :src="`${imgHost}`+ scope.row.legalReverseIdCard" alt="" style="width: 240px;height: 150px">
              <img slot="reference" :src="`${imgHost}`+ scope.row.legalReverseIdCard" style="max-height: 40px;max-width: 40px">
            </el-popover>
          </template>
      </el-table-column>

     <el-table-column label="身份证" prop="adminFrontIdCard" width="200" show-overflow-tooltip align="center" >
        <template slot-scope="scope">
          <el-popover placement="right" width="180" trigger="hover" style="margin-right: 20px;">
            <img :src="`${imgHost}`+ scope.row.adminFrontIdCard" alt="" style="width: 240px;height: 150px; margin-right: 20px;">
            <img slot="reference" :src="`${imgHost}`+ scope.row.adminFrontIdCard" style="max-height: 40px;max-width: 40px">
          </el-popover>
          <el-popover placement="right" width="180" trigger="hover">
            <img :src="`${imgHost}`+ scope.row.adminReverseIdCard" alt="" style="width: 240px;height: 150px">
            <img slot="reference" :src="`${imgHost}`+ scope.row.adminReverseIdCard" style="max-height: 40px;max-width: 40px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column  prop="img" label="营业执照" width="200" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" width="180" trigger="hover" style="margin-right: 20px;">
            <img :src="`${imgHost}`+ scope.row.threeCertificate" alt="" style="width: 240px;height: 150px">
            <img slot="reference" :src="`${imgHost}`+ scope.row.threeCertificate" style="max-height: 40px;max-width: 40px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="300" align="center">
        <template slot-scope="scope">
          {{scope.row.status==='APPROVING'?'审核中':(scope.row.status==='APPROVED'?'已审核':'已拒绝')}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button :disabled="scope.row.status==='APPROVING'?false:true" :style="scope.row.status=='APPROVING'? 'color:#67C23A':''"   type="text" icon="el-icon-s-check"  @click="handleApply(scope.row)"
            v-hasPermi="['system:info:remove']">审核</el-button>
          <el-button :disabled="scope.row.status==='APPROVING'?false:true" :style="scope.row.status=='APPROVING'? 'color:#F56C6C':''"    type="text" icon="el-icon-warning-outline" @click="handleReject(scope.row)"
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
    getRealNameList,
    modifyUserCertificationAuditStatus,
    getRealNameDetails
  } from "@/api/member/real-name";
  import {listInfo} from "@/api/member/query";
  import store from '@/store'
  export default {
    dicts: ['sys_user_card_type','sys_review_type'],
    data() {
      return {
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
          // 下拉框查询数据
        seleParms: {
          pageNum: 1,
          pageSize: 10
        },
        cardTypeOptions: [],
        userInfoOptions: [],
        loading: false,
        realNameList: [],
        total: 0,
        item:{},
        formData: {
          rejectReason: ''
        },
        dialogOpen: false,
        dialogTitle:'',
        item:{},
        rules: {
          rejectReason: [{
            required: true,
            message: '请输入拒绝原因',
            trigger: 'change'
          }]
        },

      }
    },
    created() {
      this.getList()
    },
    mounted() {},
    directives: {
        //这个是写到data外面 与mounted同级
        "el-select-loadmore": {
            bind(el, binding) {
                const SELECTWRAP_DOM = el.querySelector(
                    ".el-select-dropdown .el-select-dropdown__wrap"
                );
                SELECTWRAP_DOM.addEventListener("scroll", function () {
                    const condition =
                        this.scrollHeight - this.scrollTop <= this.clientHeight;
                    if (condition) {
                        binding.value();
                    }
                });
            },
        },
    },
    methods: {

      getList() {
        this.loading = true;
        getRealNameList(this.queryParams).then(response => {
          this.realNameList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
         /**
     * @param {Object} nickName
     */
    searchUserByName(nickName) {
      this.seleParms.nickName = nickName;
      this.getUserList();
    },
    //用户加载更多
    seleLoadmore() {
      this.seleParms.pageNum++;
      this.getUserList();
    },
    /**
     * 查询用户信息
     */
    getUserList() {
      listInfo(this.seleParms).then(response => {
        let　userInfoOptions=response.rows;
        if (this.userInfoOptions.length < response.total) {
              this.userInfoOptions = this.userInfoOptions.concat(userInfoOptions);
          }
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
        this.resetQuery();
        this.dialogTitle='拒绝原因';
        this.dialogOpen = true;
        this.item=row;
      },
      //拒绝
      rejectSubmit(){
        this.formData.acceptType='REJECT';
        this.formData.id=this.item.id;
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            modifyUserCertificationAuditStatus(this.formData).then(response => {
              this.$modal.msgSuccess("操作成功");
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
          return modifyUserCertificationAuditStatus(row);
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
        }
      }


    }
  }
</script>
<style>

</style>
