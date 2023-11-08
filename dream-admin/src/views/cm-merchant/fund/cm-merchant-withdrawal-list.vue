<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item prop="" label="申请时间">
        <el-date-picker v-model="daterange" type="daterange" @change="timeChange" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="withdrawStatus" label="审核状态">
        <el-select v-model="queryParams.withdrawStatus" placeholder="请选择提现状态" clearable :style="{ width: '100%' }">
          <el-option v-for="(item, index) in dict.type.sys_review_type" :key="index" :label="item.label"
            :value="item.value" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
              <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
        </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!-- 表单 -->
    <el-table v-loading="loading" :data="shopperList" @selection-change="handleSelectionChange" border>
      <el-table-column label="日期" align="center" prop="withdrawTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.withdrawTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请金额" prop="withdrawalAmount" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.withdrawalAmount }}元</span>
        </template>
      </el-table-column>
      <el-table-column label="提现方式" prop="paymentAmount" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.withdrawalMethod === 'ALIPAY' ? '支付宝' : (scope.row.withdrawalMethod === 'WECHAT' ? '微信' : '银行卡') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付宝账号" prop="alipayId" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.alipayId===''?'-': scope.row.alipayId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="银行名称" prop="bankName" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.bankName===''?'-': scope.row.bankName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="银行账号" prop="bankAccountNo" align="center" >
        <template slot-scope="scope">
            <span>{{ scope.row.bankAccountNo===''?'-': scope.row.bankAccountNo }}</span>
          </template>
      </el-table-column>
      <el-table-column label="银行账号名" prop="bankAccountName" align="center" >
          <template slot-scope="scope">
            <span>{{ scope.row.bankAccountName===''?'-': scope.row.bankAccountName }}</span>
          </template>
      </el-table-column>
      <el-table-column label="审核状态" prop="withdrawStatus" align="center">
        <template slot-scope="scope">
          <dict-tag :style="scope.row.withdrawStatus=='APPROVED'?'color:#67C23A':'color:#E6A23C'"  :options="dict.type.sys_review_type"
            :value="scope.row.withdrawStatus" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="打款状态" prop="paymentAmount" align="center" /> -->
      <!-- <el-table-column label="备注" prop="mome" align="center" /> -->
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!-- 申请提现 -->
    <el-dialog :title="title" :visible.sync="open" :before-close="cancel" width="45%">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label-width="130px" label="提现金额">
          <span class="moneyStyle">{{ merchantAccount.availableBalance }}元</span>
        </el-form-item>
        <el-form-item label-width="130px" label="提现金额" prop="withdrawalAmount">
          <el-input v-model="formData.withdrawalAmount" clearable :style="{ width: '40%' }" />
          <slot><el-button class="ml10 withdrawal" @click="allAmount">全部提现</el-button></slot>
        </el-form-item>
        <el-form-item label-width="130px" label="提现方式" prop="withdrawalMethod">
          <el-radio-group v-model="formData.withdrawalMethod">
            <el-radio label="ALIPAY">支付宝</el-radio>
            <el-radio label="WECHAT">微信</el-radio>
            <el-radio label="BANK">银行卡</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.withdrawalMethod == 'ALIPAY'" label-width="130px" label="支付宝账号" prop="alipayId">
          <el-input v-model="formData.alipayId" clearable />
        </el-form-item>
        <el-form-item v-if="formData.withdrawalMethod == 'BANK'" label-width="130px" label="银行名称" prop="bankName">
          <el-input v-model="formData.bankName" clearable />
        </el-form-item>
        <el-form-item v-if="formData.withdrawalMethod == 'BANK'" label-width="130px" label="收款人" prop="bankAccountName">
          <el-input v-model="formData.bankAccountName" clearable />
        </el-form-item>
        <el-form-item v-if="formData.withdrawalMethod == 'BANK'" label-width="130px" label="银行卡号" prop="bankAccountNo">
          <el-input v-model="formData.bankAccountNo" clearable />
        </el-form-item>
        <el-form-item label-width="130px" label="">
          <span class="moneyStyle">每笔提现将扣除{{ systemParameter.settingValue }}%手续费！</span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提现实名 （用于商户提现，请谨慎填写）实名认证后不可修改！" :visible.sync="realNameOpen" :before-close="cancel" width="45%">
      <el-form ref="elForm" size="medium" label-width="100px">
        <el-form-item label-width="130px" label="真实姓名" prop="alipayId">
          <el-input v-model="realName" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="realNameOpen=false">取消</el-button>
        <el-button type="primary" @click="realNameSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getShopper,
  addShopper,
  updateShopper,
  delShopper
} from "@/api/system/shopper";
import store from '@/store'

import {
  queryUserWithdrawalList,
  merchantWithdrawalApplication,
  queryMerchantWithdrawalById,
  inquiryParameter,
  queryMerchantAccountInfo,
  queryMerchantDetailById,
  merchantCertificationRealName
} from "@/api/mall-merchant/merchant-withdrawal";

export default {
  dicts: ['sys_review_type'],
  data() {
    var address = (rule, value, callback) => {
      // 地址验证
      if (this.formData.merchantAddress == undefined) {
        callback(new Error("请选择社区地址"));
      } else {
        callback();
      }
    };
    var checkAmount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('提现金额不能为空'));
      }
      setTimeout(() => {
        if (value > this.merchantAccount.availableBalance) {
          callback(new Error('输入金额大于可提现金额'));
        } else {
          callback();
        }
      }, 1000);
    };
    return {
      shopperList: [],
      open: false,
      realNameOpen: false,
      realName: '',
      title: '',
      total: 0,
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      formData: {
        alipayId: '',//支付宝ID
        bankAccountName: '',//银行账户名
        bankAccountNo: '',//银行账号
        bankName: '',//银行名称
        withdrawalAmount: '',//提现金额
        withdrawalMethod: 'ALIPAY',//提现到账方式：微信：WECHAT、支付宝：ALIPAY、银行卡：BANK
        withdrawalUserId: store.getters.merchantId,//提现用户ID
        withdrawalUserType: 'MERCHANT',//商户：MERCHANT、用户：USER
      },
      daterange: [],
      rules: {
        withdrawalAmount: [
          { validator: checkAmount, trigger: 'blur' },
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确额格式' },
        ],
        alipayId: [
          {
            required: true,
            message: '请输入支付宝账号',
            trigger: 'blur'
          }
        ]


      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        withdrawStatus:'',
        withdrawalUserId: store.getters.merchantId,
        withdrawalUserType: 'MERCHANT'
      },
      customsj: [],
      showSearch: true,
      swiperOptions: [],
      searchWithdrawStatusOptions: [{
        "label": "全部",
        "value": 1
      }, {
        "label": "未处理",
        "value": 2
      }],
      backOptions: [],
      merchantAccount: {},
      systemParameter: {},
      merchantInfo: {}
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
    // this.queryMerchantDetailById();
  },
  mounted() { },
  methods: {

    /** 查询列表 */
    getList() {
      this.loading = true;
      queryUserWithdrawalList(this.queryParams).then(response => {
        this.shopperList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //全部提现
    allAmount() {
      this.formData.withdrawalAmount = this.merchantAccount.availableBalance;
    },
    //提现手续会查询
    inquiryParameter() {
      inquiryParameter({
        settingName: 'TAX_RATE_MERCHANT'
      }).then(response => {
        if (response.code == 200) {
          this.systemParameter = response.data
        }
      });

    },
    /**查询商户余额 */
    queryMerchantAccountInfo() {
      queryMerchantAccountInfo({
        merchantId: store.getters.merchantId
      }).then(response => {
        if (response.code == 200) {
          this.merchantAccount = response.data
        }
      });
    },
    //取消实名
    realNameCancel() {

    },
    // 实名提交
    realNameSubmit() {
      merchantCertificationRealName({
        realName: this.realName,
        merchantId: store.getters.merchantId,
      }).then(response => {
        this.$modal.msgSuccess("新增成功");
        this.realNameOpen = false;
        this.queryMerchantDetailById();
      });
    },
    /**查询商户信息 */
    queryMerchantDetailById() {

      queryMerchantDetailById({
        id: store.getters.merchantId
      }).then(response => {
        
        if (response.code == 200) {
          this.merchantInfo = response.data;
          if (response.data.mallMerchantQualificationEntity.realName === '') {
            this.realNameOpen = true;
          }else{
            this.open = true;
            this.title = "申请提现";
          }
        }

      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    reset() {
      this.formData = {
        alipayId: '',//支付宝ID
        bankAccountName: '',//银行账户名
        bankAccountNo: '',//银行账号
        bankName: '',//银行名称
        withdrawalAmount: '',//提现金额
        withdrawalMethod: 'ALIPAY',//提现到账方式：微信：WECHAT、支付宝：ALIPAY、银行卡：BANK
        withdrawalUserId: store.getters.merchantId,//提现用户ID
        withdrawalUserType: 'MERCHANT',//商户：MERCHANT、用户：USER
      },
        this.resetForm("formData");
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.queryMerchantDetailById();
      this.inquiryParameter();
      this.queryMerchantAccountInfo();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const swiperId = row.id || this.ids
      getShopper(swiperId).then(response => {
        this.formData = response.data;
        this.open = true;
        this.title = "修改社区";
      });
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (valid) {
          merchantWithdrawalApplication(this.formData).then(response => {
              this.$modal.msgSuccess("提交成功");
              this.open = false;
              this.getList();
          });
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const swiperIds = row.id || this.ids;
      this.$modal.confirm('是否确认删除该社区？').then(function () {
        return delShopper(swiperIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    //打开地图
    OpenMap() {
      this.$refs.gaoDeMap.open();
    },
    updateLocation(Addr) {
      this.formData.merchantAddress = Addr.orgAddr
      this.formData.deliveryFromLongitude = Addr.lng;
      this.formData.deliveryFromLatitude = Addr.lat;
    },
    timeChange(val) {
      this.queryParams.dateSearchType = 0
    },
  }
}
</script>
<style>
.moneyStyle {
  color: red
}

.tips-text {
  color: #E6A23C;
  font-size: 14px;
  margin-left: 20px;
}
</style>
