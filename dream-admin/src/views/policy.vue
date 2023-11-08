<template>
    <div class="login">
      <!-- <el-form ref="loginForm"   class="login-form">
        <h3 class="title">智梦源后台管理系统</h3>
        <el-form-item >
            <div v-html="content"></div>
        </el-form-item>
        
      </el-form> -->
      <div v-html="content"></div>

    </div>
  </template>
  
  <script>
  import { queryAgreementDetail } from "@/api/login";
 
  export default {
    name: "Login",
    data() {
      return {
        content:''
      };
    },
    created() {
        this.queryAgreementDetail();
    },
    methods: {
        queryAgreementDetail() {
            queryAgreementDetail('dictType=sys_agreement_type&dictValue=PRIVACY_AGREEMENT').then(res => {
            this.content = res.data.agreementContent;
            
            });
      },

    }
  };
  </script>
  
  <style rel="stylesheet/scss" lang="scss">
        .login{
            margin: 10px;
        }
  </style>
  