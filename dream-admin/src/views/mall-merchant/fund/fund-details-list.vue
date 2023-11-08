<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item prop="" label="申请时间">
        <el-date-picker v-model="dateRange" type="daterange" range-separator="至"  value-format="yyyy-MM-dd"
          start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="transactionType" label="交易类型">
        <el-select v-model="queryParams.transactionType" placeholder="请选择交易类型" clearable :style="{ width: '100%' }">
          <el-option v-for="(item, index) in dict.type.mall_transaction_type" :key="index" :label="item.label"
            :value="item.value" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="withdrawalChannel" label="交易渠道">
        <el-select v-model="queryParams.withdrawalChannel" placeholder="请选择交易渠道" clearable :style="{ width: '100%' }">
          <el-option v-for="(item, index) in dict.type.mall_withdrawal_channel" :key="index" :label="item.label"
            :value="item.value" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表单 -->
    <el-table v-loading="loading" :data="fundDetailsList" :border="true" table-layout="auto">
      <el-table-column label="日期" align="center" prop="withdrawTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.withdrawTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请金额" prop="userName" align="center" />
      <el-table-column label="综合税费" prop="withdrawAmount" align="center" />
      <el-table-column label="实付金额" prop="taxAmount" align="center" />
      <el-table-column label="账户类型" prop="paymentAmount" align="center" />
      <el-table-column label="提现账户" prop="paymentAmount" align="center" />
      <el-table-column label="提现银行" prop="paymentAmount" align="center" />
      <el-table-column label="审核状态" prop="paymentAmount" align="center" />
      <el-table-column label="打款状态" prop="paymentAmount" align="center" />
      <el-table-column label="备注" prop="mome" align="center" />
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>
<script>
import store from '@/store'
import {
  queryMerchantStatementInfoList,

} from "@/api/mall-merchant/fund-details";

export default {
  dicts: ['mall_transaction_type', 'mall_withdrawal_channel'],
  name: 'Manage',
  inheritAttrs: false,
  props: [],
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
      open: false,
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

      },
      dateRange: [],
      rules: {
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        merchantId: store.getters.merchantId,
        startTime:'',
        stopTime:''
      },
      fundDetailsList: []

    }
  },
  computed: {},
  watch: {},
  created() {
    this.getList()
  },
  mounted() { },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      if (this.dateRange != null && this.dateRange.length > 0) {
        this.queryParams.startTime = this.dateRange[0];
        this.queryParams.stopTime = this.dateRange[1];
      } else {
        this.queryParams.startTime = "";
        this.queryParams.stopTime = "";
      }
      queryMerchantStatementInfoList(this.queryParams).then(response => {
        this.fundDetailsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    resetQuery() {
      this.queryParams.merchantId = store.getters.merchantId;
      this.queryParams.transactionType = '';
      this.queryParams.withdrawalChannel = '';
      this.dateRange = [];
      this.getList()
    },
    handleQuery() {
      this.getList();
    },
    timeChange() {

    }
  }
}
</script>
<style>
.moneyStyle {
  color: red
}
</style>
