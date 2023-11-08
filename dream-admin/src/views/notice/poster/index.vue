<template>
  <div class="app-container">
    <h3 class="title">上传首页海报</h3>
    <el-upload :action="uploadFileUrl" list-type="picture-card" :headers="headers"
      :on-preview="handlePictureCardPreview" :on-success="handleAvatarSuccess" :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import store from '@/store'
  export default {
    data() {
      return {
        imageUrl: [],
        dialogImageUrl: '',
        dialogVisible: false,
        headers: {
          Authorization: "Bearer " + store.getters.token
        },
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/upload",
      };
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handleAvatarSuccess(res, file, fileList) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    }
  }
</script>

<style>
  .title {
    margin: 0px auto 30px auto;
    color: #707070;
  }
</style>
