<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="申请人电话" prop="userInfoId">
        <el-select style="width: 240px" v-model="queryParams.userInfoId" clearable :filter-method="searchUserByName"
          filterable placeholder="请输入申请人电话" v-el-select-loadmore="seleLoadmore">
          <el-option v-for="item in userInfoOptions" :key="item.id" :label="item.nickName + '-' + item.phoneNo"
            :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="cardStatus">
        <el-select style="width: 240px" v-model="queryParams.cardStatus" placeholder="请选择状态" clearable>
          <el-option v-for="dict in dict.type.sys_review_type" :label="dict.label" :key="dict.value" :value="dict.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属服务站" prop="merchantId">
        <el-select style="width: 240px" v-model="queryParams.merchantId" clearable :filter-method="searchMerchantByName"
                   filterable placeholder="请输入服务站名称" v-el-select-loadmore="seleLoadmore">
          <el-option v-for="item in merchantInfoOptions" :key="item.id" :label="item.merchantName"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表 -->
    <el-table v-loading="loading" :data="cardList" :border="true">
      <el-table-column label="所属服务站" prop="merchantName" width="200" align="center" />
      <el-table-column label="申请人" prop="userName" width="100" align="center" />
      <el-table-column label="申请人电话" prop="phoneNo" width="200" align="center" />
      <el-table-column prop="img" label="卡片名称" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.cardInfoEntity.cardName }}
        </template>
      </el-table-column>
      <el-table-column prop="img" label="卡片封面" width="100" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" width="180" trigger="hover">
            <img :src="`${imgHost}` + scope.row.cardInfoEntity.cardLogo" alt="" style="width: 150px;height: 150px">
            <img slot="reference" :src="`${imgHost}` + scope.row.cardInfoEntity.cardLogo"
              style="max-height: 40px;max-width: 40px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="实体会员卡号" prop="userCardNo" width="100" show-overflow-tooltip align="center" >
        <template slot-scope="scope">
          <el-tooltip content="查看卡片消费，充值记录" placement="top">
            <span class="receiptsNumStyle"  @click="rechargeCard(scope.row)">{{ scope.row.userCardNo }}</span>
           </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="卡号余额" prop="" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cardBalance }}元</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="100" align="center">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_review_type" :value="scope.row.cardStatus" />
        </template>
      </el-table-column>
      <el-table-column label="申请时间" prop="createTime" width="200" align="center" />
      <el-table-column label="修改时间" prop="updateTime" width="200" align="center" />
<!--      <el-table-column label="所属人员编号" prop="outUserNo" width="200" show-overflow-tooltip align="center" />-->
<!--      <el-table-column label="所属公司" prop="outUserCompany" width="200" align="center" />-->

      <el-table-column label="操作" align="center" width="300" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button v-if="scope.row.cardStatus == 'APPROVING'" type="text"
            :style="scope.row.cardStatus == 'APPROVING' ? 'color:#67C23A' : ''" icon="el-icon-s-check"
            @click="handleApply(scope.row)" v-hasPermi="['system:userCard:audit']">审核</el-button>
          <el-button v-if="scope.row.cardStatus == 'APPROVING'"  type="text"
            :style="scope.row.cardStatus == 'APPROVING' ? 'color:#F56C6C' : ''" icon="el-icon-warning-outline"
            @click="handleReject(scope.row)" v-hasPermi="['system:userCard:audit']">拒绝</el-button>
          <el-button :disabled="scope.row.cardStatus == 'APPROVED' ? false : true" type="text"
            :style="scope.row.cardStatus == 'APPROVED' ? 'color:#67C23A;' : ''" icon="el-icon-s-claim"
            @click="merchantChange(scope.row)" v-hasPermi="['system:userCard:edit']">绑定卡片</el-button>
          <el-button  type="text" icon="el-icon-help"
            @click="handleRechargeCard(scope.row)" v-hasPermi="['system:userCard:amount']">充值</el-button>
            <el-button  type="text" style="color: #F56C6C;" icon="el-icon-refresh-left"
            @click="handleWithdrawalCard(scope.row)" v-hasPermi="['system:userCard:amount']">退卡</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
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

    <el-dialog :title="dialogTitle" :visible.sync="merchantOpen" width="45%">
      <el-form ref="elForm" :model="formData" :rules="rules" :inline="true" size="medium" label-width="100px">
        <el-form-item label="所属服务站">
          <el-select style="width:260px"  v-model="formData.merchantId" clearable
              :filter-method="searchMerchantByName"
              filterable placeholder="请输入服务站名称"
              v-el-select-loadmore="seleLoadmore">
          <el-option v-for="item in merchantInfoOptions" :key="item.id" :label="item.merchantName"
                     :value="item.id" />
        </el-select>
        </el-form-item>
        <el-form-item label="实体卡号" prop="userCardNo">
          <el-input style="width:260px" v-model="formData.userCardNo" placeholder="请输入实体卡号" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <!-- <el-button @click="merchantOpen=false">取消</el-button> -->
        <el-button type="primary" @click="merchantSubmit">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import {
  getUserCardApply,
  modifyUserCardAuditStatus,
  updateCardInfo,
  updateCardAccountInfo
} from "@/api/member/vip-card";
import {
  listInfo
} from "@/api/member/query";
import store from '@/store'
import {listMerchant, queryMerchantInfoList} from "@/api/mall-merchant/merchant";
export default {
  name: 'User-card-apply-list',
  dicts: ['sys_user_card_type', 'sys_review_type'],
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
      headers: {
        Authorization: "Bearer " + store.getters.token
      },
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile/oss",
      cardTypeOptions: [],
      loading: false,
      dialogOpen: false,
      merchantOpen:false,
      dialogTitle: '',
      cardList: [],
      total: 0,
      item: {},
      userInfoOptions: [],
      merchantInfoOptions: [],
      dataItem: {},
      formData: {
        rejectReason: '',
        merchantId:'',
        userCardNo:''
      },
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
  mounted() { },
  directives: {
    //这个是写到data外面 与mounted同级
    "el-select-loadmore": {
      bind(el, binding) {
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
        SELECTWRAP_DOM.addEventListener("scroll", function () {
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
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
      getUserCardApply(this.queryParams).then(response => {
        this.cardList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /**
     * @param {Object} nickName
     */
    searchUserByName(phoneNo) {
      this.userInfoOptions=[];
      this.seleParms.phoneNo = phoneNo;
      this.getUserList();
    },
    /**
     * @param {Object} nickName
     */
    searchMerchantByName(merchantName) {
      this.merchantInfoOptions=[];
      this.seleParms.merchantName = merchantName;
      this.seleParms.merchantAttribute = 'COMMUNITY_MERCHANT';
      this.getCommunityMerchantList();
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
        let userInfoOptions = response.rows;
        if (this.userInfoOptions.length < response.total) {
          this.userInfoOptions = this.userInfoOptions.concat(userInfoOptions);
        }
      });
    },
    /**
     * 查询社区商户信息
     */
    getCommunityMerchantList() {
      queryMerchantInfoList(this.seleParms).then(response => {
        let merchantInfoOptions = response.rows;
        if (this.merchantInfoOptions.length < response.total) {
          this.merchantInfoOptions = this.merchantInfoOptions.concat(merchantInfoOptions);
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
    //新增，修改提交
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (valid) {
          if (this.formData.id) {
            updateCard(this.formData).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.dialogOpen = false;
              this.getList();
            });

          } else {
            addCard(this.formData).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.dialogOpen = false;
              this.getList();
            });

          }
        }

      })
    },
    /** 删除按钮操作 */
    handleReject(row) {
      this.dialogTitle = '拒绝原因';
      this.dialogOpen = true;
      this.dataItem = row;
    },
    //拒绝
    rejectSubmit() {
      this.formData.id = this.item.id;
      this.formData.acceptType = 'REJECT';
      this.$refs['elForm'].validate(valid => {
        if (valid) {
          modifyUserCardAuditStatus(this.formData).then(response => {
            this.$modal.msgSuccess("操作成功");
            this.dialogOpen = false;
            this.getList();
          });
        }

      })
    },
    //绑定实体卡
    merchantChange(row){
      this.seleParms={
        pageNum: 1,
        pageSize: 10
      }
      this.formData.merchantId='';
      this.formData.userCardNo='';
      this.dialogTitle="绑定实体卡";
      this.merchantOpen=true;
      this.dataItem=row;

    },
     //绑定实体卡提交
    merchantSubmit(){
      if(this.formData.merchantId===''){
        this.merchantOpen=true;
        return this.$modal.msgError('请输选择所属服务站');
      }

      if(this.formData.userCardNo===''){
        this.merchantOpen=true;
        return this.$modal.msgError('请输入卡号');
      }
      let params = {
            id: this.dataItem.id,
            outUserCompany: this.dataItem.outUserCompany,
            outUserNo: this.dataItem.outUserNo,
            cardId: this.dataItem.cardId,
            userCardNo: this.formData.userCardNo,
            userInfoId: this.dataItem.userInfoId,
            merchantId:this.formData.merchantId
        }
        updateCardInfo(params).then(response => {
          this.$modal.msgSuccess("绑定成功");
          let index_= this.cardList.findIndex(elment=>elment.id===this.dataItem.id);
          this.cardList[index_].userCardNo=this.formData.userCardNo;
          this.cardList[index_].merchantName=this.seleParms.merchantName;
          this.merchantOpen=false;
        });
    },
    //绑定实体卡
    handleCard(row) {
      this.$prompt('请输入实体会员卡编号', "绑定实体卡", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false
      }).then(({ value }) => {
        row.userCardNo = value;
        let params = {
          id: row.id,
          outUserCompany: row.outUserCompany,
          outUserNo: row.outUserNo,
          cardId: row.cardId,
          userCardNo: value,
          userInfoId: row.userInfoId
        }

        updateCardInfo(params).then(response => {
          this.$modal.msgSuccess("绑定成功");
        });
      }).catch(() => { });

    },
    //充值会员卡
    handleRechargeCard(row) {
      if(row.cardStatus==='FAIL'){
        this.$message.error('已拒绝的会员卡不能充值哦');
         return
      }
      if(row.userCardNo===''){
        this.$message.error('请想绑定会员卡在充值');
         return
      }
      let that =this;
      this.$prompt('请输入充值金额', "充值", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false
      }).then(({ value }) => {
        let isNum = /^([1-9]\d*|[0]{1,1})$/;
        if (isNum.test(value)==false) {
          this.$message.error('请输入正确的金额')
          return false;
        }
        row.cardBalance = value;
        let params = {
          id: row.id,
          availableBalanceNum: value,
          transactionType:'RECHARGE'//交易类型：充值：RECHARGE，消费：SPEND，退款：REFUND，退卡：REFUND_CARD
        }
        updateCardAccountInfo(params).then(response => {
          this.$modal.msgSuccess("充值成功");
        });

      }).catch(() => { });

    },
    //退卡
    handleWithdrawalCard(row){
        let params = {
          id: row.id,
          availableBalanceNum: 0,
          transactionType:'REFUND_CARD'//交易类型：充值：RECHARGE，消费：SPEND，退款：REFUND，退卡：REFUND_CARD
        }
      this.$modal.confirm('退卡后额度为将为0，是否确认退卡？').then(function () {
        return updateCardAccountInfo(params);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("操作成功");
      }).catch(() => { });
    },
    //查看充值消费记录
    rechargeCard(row){

      this.$router.push({
          path: '/card-recharge-list',
          query: {
            cardId: row.id,
            userInfoId:row.userInfoId
          }
        })
    },
    /**
     * @param {Object} row
     * 审核通过
     */
    handleApply(row) {
      // this.formData = row;
      row.acceptType = 'AGREED';
      this.$modal.confirm('是否确认同意该条数据项？').then(function () {
        return modifyUserCardAuditStatus(row);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("操作成功");
      }).catch(() => { });
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
 .receiptsNumStyle {
    cursor: pointer;
    color: #1890ff;
  }
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
