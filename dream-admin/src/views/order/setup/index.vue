<template>
  <div class="app-container">
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="160px">
      <el-form-item label="订单" prop="orderAutoCancelDays">
        <el-col :span="5">
          <el-input v-model="formData.orderAutoCancelDays" type="number" clearable :style="{width: '100%'}" />
        </el-col>
        <el-col :span="8" class="ml10 colorSet">天不付款自动取消</el-col>
      </el-form-item>
      <el-form-item label="发货后" prop="orderAutoConfirmDays">
        <el-col :span="5">
          <el-input v-model="formData.orderAutoConfirmDays" type="number" clearable :style="{width: '100%'}" />
        </el-col>
        <el-col :span="8" class="ml10 colorSet">天自动收货</el-col>
      </el-form-item>
      <el-form-item label="收货后" prop="orderAutoEvaluateDays">
        <el-col :span="5">
          <el-input v-model="formData.orderAutoEvaluateDays" type="number" clearable :style="{width: '100%'}" />
        </el-col>
        <el-col :span="8" class="ml10 colorSet">天自动评价</el-col>
      </el-form-item>
      <el-form-item label="收货后" prop="orderAfterSaleDays">
        <el-col :span="5">
          <el-input v-model="formData.orderAfterSaleDays" type="number" clearable :style="{width: '100%'}" />
        </el-col>
        <el-col :span="8" class="ml10 colorSet">天内可申请退款(订单涉及的商户资金, 分销奖金, 积分等过售后期方可结算)</el-col>
      </el-form-item>
      <el-form-item label="退款申请" prop="orderAfterSaleProcessDays">
        <el-col :span="5">
          <el-input v-model="formData.orderAfterSaleProcessDays" type="number" clearable :style="{width: '100%'}" />
        </el-col>
        <el-col :span="8" class="ml10 colorSet">天内商家不处理, 系统自动同意退款</el-col>
      </el-form-item>
      <el-form-item label="延长时间" prop="orderDelayedReceiptPeriod">
        <el-col :span="5">
          <el-input v-model="formData.orderDelayedReceiptPeriod" type="number" clearable :style="{width: '100%'}" />
        </el-col>
        <el-col :span="8" class="ml10 colorSet">订单延长收货时间</el-col>
      </el-form-item>
      <el-form-item label="最晚发货时间" prop="orderAfterSaleUserDelivery">
        <el-col :span="5">
          <el-input v-model="formData.orderAfterSaleUserDelivery" type="number" clearable :style="{width: '100%'}" />
        </el-col>
        <el-col :span="8" class="ml10 colorSet">商户同意退货退款后，用户最晚发货时间</el-col>
      </el-form-item>
      <el-form-item label="秒杀订单" prop="spikeOrderAutoCancelMin">
        <el-col :span="5">
          <el-input v-model="formData.spikeOrderAutoCancelMin" type="number" clearable :style="{width: '100%'}" />
        </el-col>
        <el-col :span="8" class="ml10 colorSet">分钟后不付款，系统自动取消订单</el-col>
      </el-form-item>
      <el-form-item label="外卖订单" prop="deliveryOrderAutoConfirm">
        <el-col :span="5">
          <el-input v-model="formData.deliveryOrderAutoConfirm" type="number" clearable :style="{width: '100%'}" />
        </el-col>
        <el-col :span="8" class="ml10 colorSet">天后，系统自动确认收货</el-col>
      </el-form-item>
      <el-form-item label="订单确认收货" prop="orderDelayedSettlement">
        <el-col :span="5">
          <el-input v-model="formData.orderDelayedSettlement" type="number" clearable :style="{width: '100%'}" />
        </el-col>
        <el-col :span="8" class="ml10 colorSet">天后，系统自动结算至商户</el-col>
      </el-form-item>
      <el-form-item label="采买订单确认收货" prop="buyerOrderDelayedSettlement">
        <el-col :span="5">
          <el-input v-model="formData.buyerOrderDelayedSettlement" type="number" clearable :style="{width: '100%'}" />
        </el-col>
        <el-col :span="8" class="ml10 colorSet">天后，系统自动结算至商户</el-col>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {
    inquiryParameter,
    updateSetting,
  } from "@/api/system/orderSet";
  export default {
    name: 'Setup',
    components: {},
    props: [],
    data() {
      return {
        loading: true,
        formData: {
          orderAutoCancelDays: 1,
          orderAutoConfirmDays: 7,
          orderAutoEvaluateDays: 7,
          orderAfterSaleDays: 7,
          orderAfterSaleProcessDays: 3,
          orderDelayedReceiptPeriod: 0,
          orderAfterSaleUserDelivery: 0,
          spikeOrderAutoCancelMin: 2,
          deliveryOrderAutoConfirm: 1,
          orderDelayedSettlement: 7,
          buyerOrderDelayedSettlement: 30,
        },
        rules: {
          orderAutoCancelDays: [{
            required: true,
            message: '请输入自动取消天数',
            trigger: 'blur'
          }],
          orderAutoConfirmDays: [{
            required: true,
            message: '请输入自动收货天数',
            trigger: 'blur'
          }],
          orderAutoEvaluateDays: [{
            required: true,
            message: '请输入自动评价天数',
            trigger: 'blur'
          }],
          orderAfterSaleDays: [{
            required: true,
            message: '请输入可申请退款天数',
            trigger: 'blur'
          }],
          orderAfterSaleProcessDays: [{
            required: true,
            message: '请输入系统自动同意退款天数',
            trigger: 'blur'
          }],
          orderDelayedReceiptPeriod: [{
            required: true,
            message: '请输入订单延长收货后延长时间',
            trigger: 'blur'
          }],
          orderAfterSaleUserDelivery: [{
            required: true,
            message: '请输入商户同意退货退款后，用户最晚发货时间 ',
            trigger: 'blur'
          }],
          spikeOrderAutoCancelMin: [{
            required: true,
            message: '请输入秒杀商品自动取消订单时间 ',
            trigger: 'blur'
          }],
          deliveryOrderAutoConfirm: [{
            required: true,
            message: '请输入外卖订单自动配送完成后自动确认收货时间 ',
            trigger: 'blur'
          }],
          orderDelayedSettlement: [{
            required: true,
            message: '请输入订单自动结算时间',
            trigger: 'blur'
          }],
          buyerOrderDelayedSettlement: [{
            required: true,
            message: '请输入采买订单自动结算时间',
            trigger: 'blur'
          }],
        },
      }
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
      this.getList("ORDER_AUTO_CANCEL");
      this.getList("ORDER_AUTO_CONFIRM");
      this.getList("ORDER_AUTO_EVALUATE");
      this.getList("ORDER_AFTERSALE_PERIOD");
      this.getList("ORDER_AFTERSALE_PROCESS_PERIOD");
      this.getList("ORDER_DELAYED_RECEIPT_PERIOD");
      this.getList("ORDER_AFTER_SALE_USER_DELIVERY");
      this.getList("SPIKE_ORDER_AUTO_CANCEL");
      this.getList("DELIVERY_ORDER_AUTO_CONFIRM");
      this.getList("ORDER_DELAYED_SETTLEMENT");
      this.getList("BUYER_ORDER_DELAYED_SETTLEMENT");
    },
    methods: {
      /** 查询列表 */
      getList(name) {
        this.loading = true;
        let options = {
          settingName: name
        };
        inquiryParameter(options).then(response => {
          if (response.code == 200) {
            if (name === 'ORDER_AUTO_CANCEL')
              this.formData.orderAutoCancelDays = Number(response.data.settingValue);
            if (name === 'ORDER_AUTO_CONFIRM')
              this.formData.orderAutoConfirmDays = Number(response.data.settingValue);
            if (name === 'ORDER_AUTO_EVALUATE')
              this.formData.orderAutoEvaluateDays = Number(response.data.settingValue);
            if (name === 'ORDER_AFTERSALE_PERIOD')
              this.formData.orderAfterSaleDays = Number(response.data.settingValue);
            if (name === 'ORDER_AFTERSALE_PROCESS_PERIOD')
              this.formData.orderAfterSaleProcessDays = Number(response.data.settingValue);
            if (name === 'ORDER_DELAYED_RECEIPT_PERIOD')
              this.formData.orderDelayedReceiptPeriod = Number(response.data.settingValue);
            if (name === 'ORDER_AFTER_SALE_USER_DELIVERY')
              this.formData.orderAfterSaleUserDelivery = Number(response.data.settingValue);
            if (name === 'SPIKE_ORDER_AUTO_CANCEL')
              this.formData.spikeOrderAutoCancelMin = Number(response.data.settingValue);
            if (name === 'DELIVERY_ORDER_AUTO_CONFIRM')
              this.formData.deliveryOrderAutoConfirm = Number(response.data.settingValue);
            if (name === 'ORDER_DELAYED_SETTLEMENT')
              this.formData.orderDelayedSettlement = Number(response.data.settingValue);
            if (name === 'BUYER_ORDER_DELAYED_SETTLEMENT')
              this.formData.buyerOrderDelayedSettlement = Number(response.data.settingValue);
          }
          this.loading = false;
        });
      },
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          let options = {
            settingEntityList: [{
              settingName: "ORDER_AUTO_CANCEL",
              settingValue: this.formData.orderAutoCancelDays,
              settingDesc: '数值改为' + this.formData.orderAutoCancelDays,
            }, {
              settingName: "ORDER_AUTO_CONFIRM",
              settingValue: this.formData.orderAutoConfirmDays,
              settingDesc: '数值改为' + this.formData.orderAutoConfirmDays,
            }, {
              settingName: "ORDER_AUTO_EVALUATE",
              settingValue: this.formData.orderAutoEvaluateDays,
              settingDesc: '数值改为' + this.formData.orderAutoEvaluateDays,
            }, {
              settingName: "ORDER_AFTERSALE_PERIOD",
              settingValue: this.formData.orderAfterSaleDays,
              settingDesc: '数值改为' + this.formData.orderAfterSaleDays,
            }, {
              settingName: "ORDER_AFTERSALE_PROCESS_PERIOD",
              settingValue: this.formData.orderAfterSaleProcessDays,
              settingDesc: '数值改为' + this.formData.orderAfterSaleProcessDays,
            }, {
              settingName: "ORDER_DELAYED_RECEIPT_PERIOD",
              settingValue: this.formData.orderDelayedReceiptPeriod,
              settingDesc: '数值改为' + this.formData.orderDelayedReceiptPeriod,
            }, {
              settingName: "ORDER_AFTER_SALE_USER_DELIVERY",
              settingValue: this.formData.orderAfterSaleUserDelivery,
              settingDesc: '数值改为' + this.formData.orderAfterSaleUserDelivery,
            }, {
              settingName: "SPIKE_ORDER_AUTO_CANCEL",
              settingValue: this.formData.spikeOrderAutoCancelMin,
              settingDesc: '数值改为' + this.formData.spikeOrderAutoCancelMin,
            }, {
              settingName: "DELIVERY_ORDER_AUTO_CONFIRM",
              settingValue: this.formData.deliveryOrderAutoConfirm,
              settingDesc: '数值改为' + this.formData.deliveryOrderAutoConfirm,
            }, {
              settingName: "ORDER_DELAYED_SETTLEMENT",
              settingValue: this.formData.orderDelayedSettlement,
              settingDesc: '数值改为' + this.formData.orderDelayedSettlement,
            }, {
              settingName: "BUYER_ORDER_DELAYED_SETTLEMENT",
              settingValue: this.formData.buyerOrderDelayedSettlement,
              settingDesc: '数值改为' + this.formData.buyerOrderDelayedSettlement,
            }]
          };
          updateSetting(options).then(response => {
            this.$modal.msgSuccess("设置成功");
            this.getList();
          });
        })
      },
    }
  }
</script>
<style>
  .colorSet {
    color: #606266;
  }
</style>
