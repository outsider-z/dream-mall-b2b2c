<template>
  <el-form ref="form" :model="FormData" :rules="rules" label-width="80px">
    <el-form-item label="经营时间" prop="time">
       <el-time-picker
          is-range
          v-model="FormData.time"
          value-format="HH:mm:ss"
          default-value=""
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围" @change="changeTime">
        </el-time-picker>


    </el-form-item>
    <el-form-item label="经营状态" prop="businessStatus	">
       <el-radio-group v-model="FormData.businessStatus">
            <el-radio-button label="营业中"></el-radio-button>
            <el-radio-button label="停业中"></el-radio-button>
          </el-radio-group>
    </el-form-item>
    <el-form-item label="退货地址" prop="refundAddress	">
      <el-input v-model="FormData.refundAddress" placeholder="请输入退货地址" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { modifyStoreBusinessCycleInfo } from "@/api/system/user";

export default {
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      
      FormData:{
        id:'',
        businessStatus:'营业中',
        time:[new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      },
      format:'yyyy-MM-dd HH:mm:ss',
      btnTxt:"获取验证码",
      disabled:false,
      // 表单校验
      rules: {
        time: [
          { required: true, message: "经营时间不能为空", trigger: "blur" }
        ],
        businessStatus: [
          { required: true, message: "经营状态不能为空", trigger: "blur" }
        ],
        refundAddress: [
          { required: true, message: "退货地址不能为空", trigger: "blur" }
        ],

      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.FormData.id=this.user.merchantId
          this.FormData.beginTime=this.FormData.time[0]
          this.FormData.endTime=this.FormData.time[1]
          modifyStoreBusinessCycleInfo({
            id:this.user.merchantId,
            beginTime:this.FormData.time[0],
            endTime:this.FormData.time[1],
            businessStatus:'0',
            businessCycle:'周一到周五',
            refundAddress:this.FormData.refundAddress
          }).then(response => {
            this.$modal.msgSuccess("修改成功");
          });
        }
      });
    },
    close() {
      this.$tab.closePage();
    },
    changeTime(e){
      console.log('-------------------',e);

    }
  }
};
</script>

<style>
</style>
