<template>
  <div  class="app-container">
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
      <el-row :gutter="15">
        <el-col :span="3">
          <el-form-item label-width="130px" label="消费送积分" prop="enableFlag" required>
            <el-switch v-model="formData.enableFlag" active-value='0' inactive-value='1'></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="150px" label="每消费" prop="amount">
            <el-input v-model="formData.amount" clearable :style="{width: '100%'}">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="-1px" label="" prop="point">
            <el-input v-model="formData.point" clearable :style="{width: '100%'}">
              <template slot="prepend">赠送</template>
              <template slot="append">积分</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="3">
          <el-form-item label-width="130px" label="上传视频送积分" prop="videoEnable" required>
            <el-switch v-model="formData.videoEnable" active-value='0' inactive-value='1'></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="150px" label="每上传" prop="videoNum">
            <el-input v-model="formData.videoNum" clearable :style="{width: '100%'}">
              <template slot="append">个视频</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="-1px" label="" prop="videoPoint">
            <el-input v-model="formData.videoPoint" clearable :style="{width: '100%'}">
              <template slot="prepend">赠送</template>
              <template slot="append">积分</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="3">
          <el-form-item label-width="130px" label="积分抵扣现金" prop="deductEnable" required>
            <el-switch v-model="formData.deductEnable" active-value='0' inactive-value='1'></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="150px" label="最高可抵扣毛利润的" prop="grossProfit">
            <el-input v-model="formData.grossProfit" clearable :style="{width: '100%'}">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="-1px" label="" prop="convertPoint">
            <el-input v-model="formData.convertPoint" placeholder="请输入" clearable :style="{width: '100%'}">
              <template slot="prepend">每积分折合现金为</template>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item size="large">
        <el-button type="primary" v-hasPermi="['system:signSetting:edit']" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {
    pointSetting,
    getPointSetting,
  } from "@/api/system/point";
export default {
  name:'Setup',
  components: {},
  props: [],
  data() {
    return {
      formData: {
        enableFlag: '1',
        amount: undefined,
        point: undefined,
        videoEnable: '1',
        videoNum: undefined,
        videoPoint: undefined,
        deductEnable: '1',
        grossProfit: undefined,
        convertPoint: undefined,
      },
      rules: {
        amount: [{
          required: true,
          message: '请输入消费金额',
          trigger: 'blur'
        }],
        point: [{
          required: true,
          message: '请输入赠送积分',
          trigger: 'blur'
        }],
        videoNum: [{
          required: true,
          message: '请输入视频数量',
          trigger: 'blur'
        }],
        videoPoint: [{
          required: true,
          message: '请输入视频积分',
          trigger: 'blur'
        }],
        grossProfit: [{
          required: true,
          message: '请输入毛利率占比',
          trigger: 'blur'
        }],
        convertPoint: [{
          required: true,
          message: '请输入积分折合现金值',
          trigger: 'blur'
        }],
      },
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getList()
  },
  mounted() {},
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      getPointSetting().then(response => {
        if (response.code == 200) {
          this.formData = response.data
        }
        this.loading = false;
      });
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (valid){
          pointSetting(this.formData).then(response => {
            if (response.code == 200) {
              this.$modal.msgSuccess("设置成功");
              this.getList()
            }
          });
        }
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
  }
}

</script>
<style>
</style>
