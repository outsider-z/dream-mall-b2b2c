<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-row>
      <el-col :span="10">
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10">
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="user.confirmPassword" placeholder="请确认密码" type="password" show-password/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10">
        <el-form-item label="电话号码" prop="phoneNo">
          <el-input v-model="user.phonenumber" placeholder="请确认密码" type="number" disabled>
          </el-input>
      </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10">
        <el-form-item label="验证码" prop="verifyCode">
          <div class="input-code">
           　　<el-input v-model="user.verifyCode" placeholder="输入验证码" />
              <div  v-if="!codeFlag" class="code-text"  @click="getVerifyCode"><span>获取验证码</span></div>
              <div  v-else  class="code-text" style="width:80%;">{{second}}秒后重新获取</div>
          </div>
          </el-form-item>
      </el-col>
    </el-row>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { modifyMerchantPhoneNoAndPassword, verifyCode} from "@/api/system/user";

export default {
  props: {
    user: {
      type: Object
    }
  },
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      // user: {
      //   oldPassword: undefined,
      //   newPassword: undefined,
      //   confirmPassword: undefined,
      // },
      codeFlag:false,
        second:0,
      btnTxt:"获取验证码",
      disabled:false,
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let parameter={
              merchantId:this.user.merchantId,
              loginPwd:this.user.newPassword,
              // phoneNo:this.user.phoneNo,
              verifyCode:this.user.verifyCode

          }
          modifyMerchantPhoneNoAndPassword(parameter).then(response => {
            this.$modal.msgSuccess("修改成功");
          });
        }
      });
    },
    close() {
      this.$tab.closePage();
    },
    // 获取验证码
    getVerifyCode() {
      
      if (this.disabled) {
        return;
      }
      
      verifyCode(this.user.phonenumber).then(response => {
              this.codeFlag = true;
							this.second = 60;
							let interval = setInterval(() => {
								this.second--;
								if (this.second <= 0) {
									 this.codeFlag =false;
									// if (this.value.lenth != 4) {
									// 	this.error = true;
									// }
									clearInterval(interval);
								}
						}, 1000);

        this.$modal.msgSuccess("发送成功");
      }); 

    }
  
  }

};
</script>
<style>

  
    .input-code{
      display: flex;
    }
    .code-text{
      background-color: #409EFF;
      color: aliceblue;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      padding: 0px 10px;
      width:40%;
      &.active{
        background-color: #fff;
        color: #409EFF;
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
      }
    }
</style>
