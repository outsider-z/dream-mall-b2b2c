<template>
  <div class="app-container">
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
      <el-form-item label-width="160px" label="奖励签到" prop="enableFlag" required>
        <el-switch v-model="formData.enableFlag" active-value='0' inactive-value='1'></el-switch>
      </el-form-item>
      <el-row :gutter="15">
        <el-col :span="6">
          <el-form-item label-width="160px" label="连续签到1天奖励积分" prop="oneDayPoint">
            <el-input-number v-model="formData.oneDayPoint" placeholder="连续签到1天奖励积分" controls-position=right>
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label-width="160px" label="连续签到2天奖励积分" prop="twoDayPoint">
            <el-input-number v-model="formData.twoDayPoint" placeholder="连续签到2天奖励积分" controls-position=right>
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="6">
          <el-form-item label-width="160px" label="连续签到3天奖励积分" prop="threeDayPoint">
            <el-input-number v-model="formData.threeDayPoint" placeholder="连续签到3天奖励积分" controls-position=right>
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label-width="160px" label="连续签到4天奖励积分" prop="fourDayPoint">
            <el-input-number v-model="formData.fourDayPoint" placeholder="连续签到4天奖励积分" controls-position=right>
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="6">
          <el-form-item label-width="160px" label="连续签到5天奖励积分" prop="fiveDayPoint">
            <el-input-number v-model="formData.fiveDayPoint" placeholder="连续签到5天奖励积分" controls-position=right>
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label-width="160px" label="连续签到6天奖励积分" prop="sixDayPoint">
            <el-input-number v-model="formData.sixDayPoint" placeholder="连续签到6天奖励积分" controls-position=right>
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="6">
          <el-form-item label-width="160px" label="连续签到7天奖励积分" prop="sevenDayPoint">
            <el-input-number v-model="formData.sevenDayPoint" placeholder="连续签到7天奖励积分" controls-position=right>
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="签到奖励背景图" label-width="160px" prop="backgroundUrl">
        <el-upload class="avatar-uploader" :action="uploadFileUrl" :show-file-list="false" :headers="headers"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="formData.backgroundUrl" :src="`${imgHost}` +formData.backgroundUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="活动规则" label-width="160px" prop="ruleUrl">
        <el-upload class="avatar-uploader" :action="uploadFileUrl" :show-file-list="false"
          :on-success="handleBannerSuccess" :headers="headers" :before-upload="beforeAvatarUpload">
          <img v-if="formData.ruleUrl" :src="`${imgHost}` +formData.ruleUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" v-hasPermi="['system:signSetting:edit']" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import store from '@/store'
  import {
    signSetting,
    getSignSetting,
  } from "@/api/system/point";
  export default {
    name: 'Sign',
    components: {},
    props: [],
    data() {
      var backgroundUrl = (rule, value, callback) => {
        // 图片验证
        if (this.formData.backgroundUrl == '') {
          callback(new Error("请上传签到奖励背景图"));
        } else {
          callback();
        }
      }
      var ruleUrl = (rule, value, callback) => {
        // 图片验证
        if (this.formData.ruleUrl == '') {
          callback(new Error("请上传活动规则图"));
        } else {
          callback();
        }
      }
      return {
        headers: {
          Authorization: "Bearer " + store.getters.token
        },
        modularList: [],
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
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile/oss",
        formData: {
          enableFlag: '1',
          oneDayPoint: undefined,
          twoDayPoint: undefined,
          threeDayPoint: undefined,
          fourDayPoint: undefined,
          fiveDayPoint: undefined,
          sixDayPoint: undefined,
          sevenDayPoint: undefined,
          backgroundUrl: '',
          ruleUrl: '',
        },
        rules: {
          oneDayPoint: [{
            required: true,
            message: '连续签到1天奖励积分',
            trigger: 'blur'
          }],
          twoDayPoint: [{
            required: true,
            message: '连续签到2天奖励积分',
            trigger: 'blur'
          }],
          threeDayPoint: [{
            required: true,
            message: '连续签到3天奖励积分',
            trigger: 'blur'
          }],
          fourDayPoint: [{
            required: true,
            message: '连续签到4天奖励积分',
            trigger: 'blur'
          }],
          fiveDayPoint: [{
            required: true,
            message: '连续签到5天奖励积分',
            trigger: 'blur'
          }],
          sixDayPoint: [{
            required: true,
            message: '连续签到6天奖励积分',
            trigger: 'blur'
          }],
          sevenDayPoint: [{
            required: true,
            message: '连续签到7天奖励积分',
            trigger: 'blur'
          }],
          backgroundUrl: [{
            required: true,
            validator: backgroundUrl
          }],
          ruleUrl: [{
            required: true,
            validator: ruleUrl
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
        getSignSetting().then(response => {
          if (response.code == 200) {
            this.formData = response.data
          }
          this.loading = false;
        });
      },
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            signSetting(this.formData).then(response => {
              this.$modal.msgSuccess("设置成功");
              this.open = false;
              this.getList();
            });
          }
        })
      },

      handleAvatarSuccess(res, file) {
        this.formData.backgroundUrl = res.data.url;
        if (this.formData.backgroundUrl) {
          this.$refs.elForm.clearValidate('backgroundUrl') //清除图片校验文字
        }
      },
      beforeAvatarUpload(file) {
        let isAccept = new RegExp('image/*').test(file.type)
        if (!isAccept) {
          this.$message.error('请选择jpg,jpeg或者png格式的图片')
        }
        return isAccept;
      },
      handleBannerSuccess(res, file) {
        this.formData.ruleUrl = res.data.url;
        if (this.formData.ruleUrl) {
          this.$refs.elForm.clearValidate('ruleUrl') //清除图片校验文字
        }
      },
    }
  }
</script>
<style>
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
