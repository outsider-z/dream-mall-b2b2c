<template>
  <div class="settle">
    <el-form ref="elForm"   :model="formData" :rules="rules" size="medium" label-width="100px" class="settle-form">
      <h3 class="title">社区入驻</h3>
      <el-form-item label="商户名称" label-width="140px" prop="merchantName">
        <el-input v-model="formData.merchantName" prefix-icon='el-icon-s-shop' placeholder="请输入社区名称" clearable
          :style="{width: '100%'}">
        </el-input>
      </el-form-item>
      <el-form-item label="行业选择" label-width="140px" prop="industryType">
           <el-radio-group v-model="formData.industryType" >
              <el-radio-button label="CATERING" >餐饮行业</el-radio-button>
              <el-radio-button label="SERVICE" >服务行业</el-radio-button>
              <el-radio-button label="CONSULTING">咨询行业</el-radio-button>
            </el-radio-group>
      </el-form-item>
      <el-form-item label="运营方式" label-width="140px" prop="businessMethod" v-if="formData.industryType=='CATERING'">
         <el-radio-group v-model="formData.businessMethod" size="mini" >
              <el-radio-button label="ONLINE">线上</el-radio-button>
              <el-radio-button label="OFFLINE">线下</el-radio-button>
              <el-radio-button  label="CURRENCY">线上线下</el-radio-button>
            </el-radio-group>
      </el-form-item>
      <el-form-item label="联系人" label-width="140px" prop="contactName">
        <el-input v-model="formData.contactName" prefix-icon='el-icon-s-custom' placeholder="请输入联系人" clearable
          :style="{width: '100%'}">
        </el-input>
      </el-form-item>
      <el-form-item label="联系电话" label-width="140px" prop="phoneNo">
        <el-input v-model="formData.phoneNo" @change="phoneClick(formData.phoneNo)" :maxlength="11" show-word-limit
          prefix-icon='el-icon-phone' placeholder="请输入联系电话" clearable :style="{width: '100%'}">
        </el-input>
      </el-form-item>
      <el-form-item label="邀请人手机号" label-width="140px" prop="inviteesId">
        <el-input v-model="formData.inviteesId" :maxlength="11" show-word-limit prefix-icon='el-icon-phone'
          placeholder="请输入邀请人手机号" clearable :style="{width: '100%'}">
        </el-input>
      </el-form-item>
      <!-- <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="商家所在省" label-width="140px" prop="province">
            <el-input v-model="formData.province" clearable placeholder="请输入商家所在省"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商家所在市" label-width="140px" prop="city">
            <el-input v-model="formData.city"  clearable placeholder="请输入商家所在市"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商家所在区(县)" label-width="140px" prop="district">
            <el-input v-model="formData.district"  clearable
            placeholder="请输入商家所在区(县)"></el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="商家地址经度" label-width="140px" prop="longitude">
            <el-input v-model="formData.longitude" clearable placeholder="请输入商家所在省"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="纬度" label-width="140px" prop="latitude">
            <el-input v-model="formData.latitude"  clearable placeholder="请输入商家所在市"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="参考地图" label-width="100px">
            <a href="http://jingweidu.757dy.com/" target="_blank">http://jingweidu.757dy.com/</a>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- <el-form-item label="详细地址" label-width="140px" prop="merchantAddress">
        <el-input v-model="formData.merchantAddress"  suffix-icon='el-icon-map-location' clearable
          :style="{width: '100%'}"></el-input>
      </el-form-item> -->
      <el-form-item label="详细地址" label-width="140px" prop="merchantAddress">
        <el-input v-model="formData.merchantAddress" @focus="OpenMap()" suffix-icon='el-icon-map-location' clearable
          :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label="商户类型" label-width="140px" prop="merchantType">
        <el-select v-model="formData.merchantType" placeholder="请选择商户类型" clearable :style="{width: '100%'}">
          <el-option v-for="(item, index) in merchantTypeOptions" :key="index" :label="item.label" :value="item.value"
            :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="一级行业" label-width="140px" prop="firstIndustryId">
            <el-select v-model="formData.firstIndustryId" placeholder="请选择一级行业" clearable :style="{width: '100%'}" @change="industryClick">
              <el-option v-for="(item, index) in industryChangeList" :key="index" :label="item.industryName"
                :value="item.id" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="sonIndustryChangeOptions.length > 0">
          <el-form-item label="二级行业" label-width="140px" prop="secondIndustryId">
            <el-select v-model="formData.secondIndustryId" placeholder="请选择二级行业" clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in sonIndustryChangeOptions" :key="index" :label="item.industryName"
                :value="item.id" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="描述" label-width="140px" prop="merchantDescription">
        <el-input v-model="formData.merchantDescription" type="textarea" placeholder="请输入社区描述"
          :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label="LOGO" label-width="140px" prop="logo">
        <el-upload class="avatar-uploader" :action="uploadFileUrl" :show-file-list="false" :headers="headers"
          :on-success="handleLogoSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="formData.logo" :src="`${imgHost}` + formData.logo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-row :gutter="24">
        <el-col :span="5">
          <el-form-item label="" label-width="50px" prop="adminFrontIdCard">
            <div class="colorTxt">管理人身份证正面</div>
            <el-upload class="avatar-uploader" :action="uploadFileUrl" :show-file-list="false" :headers="headers"
              :on-success="handleAdminfSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="formData.addMerchantQualificationRequest.adminFrontIdCard"
                :src="`${imgHost}` + formData.addMerchantQualificationRequest.adminFrontIdCard" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="" label-width="10px" prop="adminReverseIdCard">
            <div class="colorTxt">管理人身份证反面</div>
            <el-upload class="avatar-uploader" :action="uploadFileUrl" :show-file-list="false" :headers="headers"
              :on-success="handleAdminrSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="formData.addMerchantQualificationRequest.adminReverseIdCard"
                :src="`${imgHost}` + formData.addMerchantQualificationRequest.adminReverseIdCard" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="4" v-if="formData.merchantType == 'ORG'">
          <el-form-item label="" label-width="10px" prop="legalFrontIdCard">
            <div class="colorTxt">法人身份证正面</div>
            <el-upload class="avatar-uploader" :action="uploadFileUrl" :show-file-list="false" :headers="headers"
              :on-success="handleLegalfSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="formData.addMerchantQualificationRequest.legalFrontIdCard"
                :src="`${imgHost}` + formData.addMerchantQualificationRequest.legalFrontIdCard" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="4" v-if="formData.merchantType == 'ORG'">
          <el-form-item label="" label-width="10px" prop="legalReverseIdCard">
            <div class="colorTxt">法人身份证反面</div>
            <el-upload class="avatar-uploader" :action="uploadFileUrl" :show-file-list="false" :headers="headers"
              :on-success="handleLegalrSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="formData.addMerchantQualificationRequest.legalReverseIdCard"
                :src="`${imgHost}` + formData.addMerchantQualificationRequest.legalReverseIdCard" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="4" v-if="formData.merchantType == 'ORG' || formData.merchantType == 'INDIVIDUAL'">
          <el-form-item label="" label-width="10px" prop="threeCertificate">
            <div class="colorTxt">三证合一</div>
            <el-upload class="avatar-uploader" :action="uploadFileUrl" :show-file-list="false" :headers="headers"
              :on-success="handlethreeCertificateSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="formData.addMerchantQualificationRequest.threeCertificate"
                :src="`${imgHost}` + formData.addMerchantQualificationRequest.threeCertificate" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item size="large" class="buttonCenter">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button type="success" @click="goBack()">返回<router-link class="link-type" :to="'/process'"></router-link></el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>

    </el-form>
    <!--  底部  -->
    <div class="el-settle-footer">
      <span>Copyright © 2018-2022 dream.vip All Rights Reserved.</span>
    </div>
    <gaoDeMap @updateLocation="updateLocation" ref="gaoDeMap"></gaoDeMap>
  </div>
</template>

<script>
  import {
    addMerchant,
    communityMerchantRegister,
    queryMerchantRegisterFailReason,
    queryAllIndustryList
  } from "@/api/mall-merchant/merchant";
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
      var address = (rule, value, callback) => {
        // 地址验证
        if (this.formData.merchantAddress == undefined) {
          callback(new Error("请选择社区地址"));
        } else {
          callback();
        }
      }
      var adminFrontIdCard = (rule, value, callback) => {
        // 图片验证
        if (this.formData.addMerchantQualificationRequest.adminFrontIdCard == '') {
          callback(new Error("请上传管理人身份证正面"));
        } else {
          callback();
        }
      }
      var adminReverseIdCard = (rule, value, callback) => {
        if (this.formData.addMerchantQualificationRequest.adminReverseIdCard == '') {
          callback(new Error("请上传管理人身份证反面"));
        } else {
          callback();
        }
      }
      var legalFrontIdCard = (rule, value, callback) => {
        if (this.formData.addMerchantQualificationRequest.legalFrontIdCard == '') {
          callback(new Error("请上传法人身份证正面"));
        } else {
          callback();
        }
      }
      var legalReverseIdCard = (rule, value, callback) => {
        if (this.formData.addMerchantQualificationRequest.legalReverseIdCard == '') {
          callback(new Error("请上传法人身份证反面面"));
        } else {
          callback();
        }
      }
      var logo = (rule, value, callback) => {
        if (this.formData.logo == '') {
          callback(new Error("请上传社区logo"));
        } else {
          callback();
        }
      }
      var threeCertificate = (rule, value, callback) => {
        if (this.formData.addMerchantQualificationRequest.threeCertificate == '') {
          callback(new Error("请上传三证合一"));
        } else {
          callback();
        }
      }
      // var orgCertificate = (rule, value, callback) => {
      //   if (this.formData.addMerchantQualificationRequest.orgCertificate == '') {
      //     callback(new Error("请上传组织机构代码证"));
      //   } else {
      //     callback();
      //   }
      // }
      // var registrationCertificate = (rule, value, callback) => {
      //   if (this.formData.addMerchantQualificationRequest.registrationCertificate == '') {
      //     callback(new Error("请上传税务登记证"));
      //   } else {
      //     callback();
      //   }
      // }
      return {
        radio1: '餐饮行业',
        radio2: '线上线下',
        headers: {
          Authorization: "Bearer " + store.getters.token
        },
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/public/uploadFile/oss",
        formData: {
          addMerchantQualificationRequest: {
            adminFrontIdCard: '',
            adminReverseIdCard: '',
            legalFrontIdCard: '',
            legalReverseIdCard: '',
            // orgCertificate: '',
            // registrationCertificate: '',
            threeCertificate: '',

          },
          industryType:'CATERING',
          businessMethod:'ONLINE',
          city: '',
          district: '',
          inviteesId: '',
          logo: '',
          province: '',
          merchantDescription: '',
          merchantName: undefined,
          contactName: undefined,
          phoneNo: undefined,
          merchantType: undefined,
          merchantAddress: undefined,
          longitude: undefined,
          latitude: undefined,
          firstIndustryId: '',
          secondIndustryId: '',
        },
        industryChangeList: [],
        sonIndustryChangeOptions: [],
        rules: {
          merchantName: [{
            required: true,
            message: '请输入社区名称',
            trigger: 'blur'
          }],
          contactName: [{
            required: true,
            message: '请输入联系人',
            trigger: 'blur'
          }],
          phoneNo: [{
            required: true,
            message: '请输入联系电话',
            trigger: 'blur'
          }, {
            pattern: /^1(3|4|5|7|8|9)\d{9}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }],
          inviteesId: [],
          merchantType: [{
            required: true,
            message: '请选择社区类型',
            trigger: 'change'
          }],
          firstIndustryId: [{
            required: true,
            message: '请选择一级行业',
            trigger: 'change'
          }],
          secondIndustryId: [{
            required: true,
            message: '请选择二级行业',
            trigger: 'change'
          }],
          merchantAddress: [{
            required: true,
            validator: address
          }],




          province: [{
            required: true,
            message: '请输入商家所在省份',
            trigger: 'blur'
          }],
          city: [{
            required: true,
            message: '请输入商家所在市',
            trigger: 'blur'
          }],
          district: [{
            required: true,
            message: '请输入商家所在区(县)',
            trigger: 'blur'
          }],
          longitude: [{
            required: true,
            message: '请输入商家所在地区经度',
            trigger: 'blur'
          }],
          latitude: [{
            required: true,
            message: '请输入商家所在地区纬度',
            trigger: 'blur'
          }],


          adminFrontIdCard: [{
            required: true,
            validator: adminFrontIdCard
          }],
          adminReverseIdCard: [{
            required: true,
            validator: adminReverseIdCard
          }],
          legalFrontIdCard: [{
            required: true,
            validator: legalFrontIdCard
          }],
          legalReverseIdCard: [{
            required: true,
            validator: legalReverseIdCard
          }],
          threeCertificate: [{
            required: true,
            validator: threeCertificate
          }],
          // orgCertificate: [{
          //   required: true,
          //   validator: orgCertificate
          // }],
          // registrationCertificate: [{
          //   required: true,
          //   validator: registrationCertificate
          // }],
          logo: [{
            required: true,
            validator: logo
          }],
          industryType:[
            {
              required: true,
              message: '请选择二级行业',
              trigger: 'change'
            }
          ],
          businessMethod:[
              {
                required: true,
                trigger: 'change',
                validator: (rule, value, callback) => {
                  if (this.formData.industryType=='CATERING' && value=='') {
                    callback(new Error('请输选择运营模式'));
                  } else {
                    callback();
                  }
                }
              }

          ]
        },
        merchantTypeOptions: [{
          "label": "企业",
          "value": "ORG"
        }, {
          "label": "个人",
          "value": "PERSON"
        }, {
          "label": "个体",
          "value": "INDIVIDUAL"
        }],
      }
    },
    watch: {},
    created() {
      this.getIndustryList()
    },
    methods: {
      goBack(){
        this.$router.push('/process')
      },
      getIndustryList() {
        let para = {
          industryParentId: 0,
          status: 0
        }
        queryAllIndustryList(para).then(res => {
          this.industryChangeList = res.data
        });
      },
      
      /**
       * 提交
       */
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            if(this.formData.industryType!='CATERING'){
                this.formData.businessMethod='CURRENCY';
            }
            communityMerchantRegister(this.formData).then(response => {
              this.$modal.msgSuccess("入驻申请提交成功");
              this.$router.push('/login')
            });
          }
        })
      },
      resetForm() {
        this.$refs['elForm'].resetFields()
      },
      reset() {
        this.formData = {
            addMerchantQualificationRequest: {
              adminFrontIdCard: '',
              adminReverseIdCard: '',
              legalFrontIdCard: '',
              legalReverseIdCard: '',
              threeCertificate: '',
            },
            city: '',
            district: '',
            inviteesId: '',
            logo: '',
            province: '',
            merchantDescription: '',
            merchantName: undefined,
            contactName: undefined,
            phoneNo: undefined,
            merchantType: undefined,
            merchantAddress: undefined,
            longitude: undefined,
            latitude: undefined,
            firstIndustryId: '',
            secondIndustryId: '',
          },
          this.resetForm("formData");
      },
      //打开地图
      OpenMap() {
        this.$refs.gaoDeMap.open();
      },
      updateLocation(Addr) {
        console.log('------Addr--------',Addr);
        this.formData.province = Addr.province;
        this.formData.city = Addr.city==''?Addr.province:Addr.city;
        this.formData.district = Addr.district;
        this.formData.merchantAddress = Addr.orgAddr
        this.formData.longitude = Addr.lon;
        this.formData.latitude = Addr.lat;
      },
      //管理员身份证正面
      handleAdminfSuccess(res, file) {
        this.formData.addMerchantQualificationRequest.adminFrontIdCard = res.data.url;
        if (this.formData.addMerchantQualificationRequest.adminFrontIdCard != '') {
          this.$refs.elForm.clearValidate('adminFrontIdCard') //清除图片校验文字
        }
      },
      //管理员身份证反面
      handleAdminrSuccess(res, file) {
        this.formData.addMerchantQualificationRequest.adminReverseIdCard = res.data.url;
        if (this.formData.addMerchantQualificationRequest.adminReverseIdCard != '') {
          this.$refs.elForm.clearValidate('adminReverseIdCard') //清除图片校验文字
        }
      },
      //法人身份证正面
      handleLegalfSuccess(res, file) {
        this.formData.addMerchantQualificationRequest.legalFrontIdCard = res.data.url;
        if (this.formData.addMerchantQualificationRequest.legalFrontIdCard != '') {
          this.$refs.elForm.clearValidate('legalFrontIdCard') //清除图片校验文字
        }
      },
      //法人身份证正面
      handleLegalrSuccess(res, file) {
        this.formData.addMerchantQualificationRequest.legalReverseIdCard = res.data.url;
        if (this.formData.addMerchantQualificationRequest.legalReverseIdCard != '') {
          this.$refs.elForm.clearValidate('legalReverseIdCard') //清除图片校验文字
        }
      },
      //三证合一
      handlethreeCertificateSuccess(res, file) {
        this.formData.addMerchantQualificationRequest.threeCertificate = res.data.url;
        if (this.formData.addMerchantQualificationRequest.threeCertificate != '') {
          this.$refs.elForm.clearValidate('threeCertificate') //清除图片校验文字
        }
      },
      //logo
      handleLogoSuccess(res, file) {
        this.formData.logo = res.data.url;
        if (this.formData.logo != '') {
          this.$refs.elForm.clearValidate('logo') //清除图片校验文字
        }
      },
      beforeAvatarUpload(file) {
        let isAccept = new RegExp('image/*').test(file.type)
        if (!isAccept) {
          this.$message.error('请选择jpg,jpeg或者png格式的图片')
        }
        return isAccept;
      },
      phoneClick(value) {
        var reg = /^1[3-9]\d{9}$/;
        if (reg.test(value)) {
          let para = {
            phoneNo: value
          }
          queryMerchantRegisterFailReason(para).then(response => {
            if (response.code == 200) {
              this.$modal.msgSuccess(response.msg);
            }
          });
        }
      },
      returnTo() {
        this.$router.push('/login')
      },
      industryClick(val){
        this.formData.secondIndustryId = ''
        let para = {
          industryParentId: val,
          status: 0
        }
        queryAllIndustryList(para).then(res => {
          this.sonIndustryChangeOptions = res.data
        });
      }
    }
  };
</script>

<style scoped rel="stylesheet/scss" lang="scss">
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
    padding: 25px 25px 5px 25px;
    height: 80%;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 4px;
      /* y轴滚动条宽度 */
      height: 4px;
      /* x轴滚动条宽度 */
      background-color: #f5f5f5;
      /*滚动条背景*/
    }

    /* 滑块内阴影+圆角 */
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.2);
    }

    /* 滚动条轨道内阴影+圆角 */
    ::-webkit-scrollbar-track {
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }

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
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
        background: aliceblue;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }

  .buttonCenter {
    // text-align: center;
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .buttonCenter .el-form-item__content {
    margin-left: 0 !important
  }

  .colorTxt {
    color: #606266;
  }
</style>
