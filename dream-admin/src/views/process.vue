<template>
  <div class="settle">
    <el-form ref="elForm" size="medium" label-width="100px" class="settle-form">
      <h2 class="title">入驻选择</h2>
      <el-form-item size="large" class="buttonCenter">
        <el-button type="primary" @click="mallSettle">商城入驻</el-button>
        <el-button type="success" @click="communitySettle">社区入驻</el-button>
        <el-button type="" @click="goBack">返回登录</el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-settle-footer">
      <span>Copyright © 2018-2022 dream.vip All Rights Reserved.</span>
    </div>
    <!-- <gaoDeMap @updateLocation="updateLocation" ref="gaoDeMap"></gaoDeMap> -->
  </div>
</template>

<script>
  import {
    getCodeImg
  } from "@/api/login";
  import Cookies from "js-cookie";
  import {
    encrypt,
    decrypt
  } from '@/utils/jsencrypt'
  import gaoDeMap from "@/components/gaodeMap/index";
  import store from '@/store'
  export default {
    name: "Settle",
    components: {
      gaoDeMap
    },
    data() {

      return {
        }
    },
    watch: {},
    created() {

    },
    methods: {
      goBack(){
          this.$router.push('/login')
      },
      mallSettle() {
        this.$router.push('/settle')
      },

      communitySettle() {
      this.$router.push('/communtiy')
      },

    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .settle {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url("../assets/images/login-background.jpg");
    background-size: cover;
  }

  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
  }

  .settle-form {
    border-radius: 6px;
    background: #ffffff;
    width: 50%;
    padding: 90px;
    .el-input {
      height: 38px;

      input {
        height: 38px;
      }
    }

    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }
  }

  .settle-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }

  .el-settle-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
  }
  .buttonCenter{
    text-align: center;
  }
  .buttonCenter .el-form-item__content{
    margin-left: 0 !important
  }
</style>
