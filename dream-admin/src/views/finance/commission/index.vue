<template>
  <div class="app-container">
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="200px">
      <el-form-item label="会员提现手续费率: %" prop="taxRate">
        <el-col :span="5">
          <el-input v-model="formData.taxRate" type="number" clearable :style="{width: '100%'}" />
        </el-col>
        <el-col :span="8" class="ml10 colorSet">设置为0表示不收取手续费</el-col>
      </el-form-item>
      <el-form-item label="商家提现手续费率: %" prop="merchantTaxRate">
        <el-col :span="5">
          <el-input v-model="formData.merchantTaxRate" type="number" clearable :style="{width: '100%'}" />
        </el-col>
        <el-col :span="8" class="ml10 colorSet">设置为0表示不收取手续费</el-col>
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
    name: 'Commission',
    components: {},
    props: [],
    data() {
      return {
        loading: true,
        formData: {
          taxRate: '',
          merchantTaxRate: '',
        },
        rules: {
          taxRate: [{
            required: true,
            message: '请输入会员提现手续费率',
            trigger: 'blur'
          }],
          merchantTaxRate: [{
            required: true,
            message: '请输入商家提现手续费率',
            trigger: 'blur'
          }],
        },
      }
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
      this.getList("TAX_RATE");
      this.getList("TAX_RATE_MERCHANT");
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
            if (name === 'TAX_RATE')
              this.formData.taxRate = Number(response.data.settingValue);
              console.log( this.formData.taxRate)
            if (name === 'TAX_RATE_MERCHANT')
              this.formData.merchantTaxRate = Number(response.data.settingValue);
          }
          this.loading = false;
        });
      },
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            let options = {
              settingEntityList: [
                {
                  settingName: "TAX_RATE",
                  settingValue: this.formData.taxRate
                },
                {
                  settingName: "TAX_RATE_MERCHANT",
                  settingValue: this.formData.merchantTaxRate
                }
              ]
            };
            updateSetting(options).then(response => {
              this.$modal.msgSuccess("设置成功");
              this.getList();
            });
          }
        })
      },
    }
  }
</script>
<style>
  .colorSet {
    color: #C0C4CC;
  }
</style>
