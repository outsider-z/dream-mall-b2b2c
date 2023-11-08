<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" >
      <el-form-item label="会员卡名称" prop="cardName">
        <el-input v-model="queryParams.cardName" placeholder="请输入会员卡名称" clearable  />
      </el-form-item>
      <el-form-item label="卡片类型" prop="cardType">
        <el-select v-model="queryParams.cardType" placeholder="请选择卡片类型" clearable>
          <el-option v-for="dict in dict.type.sys_user_card_type"  :label="dict.label" :key="dict.value" :value="dict.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addCard"
          v-hasPermi="['system:info:add']">新增</el-button>
      </el-col>
    </el-row>
     <!-- 表 -->
    <el-table v-loading="loading" :data="cardList" border>
      <el-table-column label="卡片名称" prop="cardName" width="300" align="center" />
      <el-table-column label="卡片类型"  width="300" align="center" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_user_card_type" :value="scope.row.cardType" />
        </template>
      </el-table-column>
      <el-table-column label="卡片简介" prop="cardDesc" show-overflow-tooltip align="center" />
      <el-table-column prop="img" label="卡片封面" width="300" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" width="180" trigger="hover">
            <img :src="`${imgHost}`+ scope.row.cardLogo" alt="" style="width: 150px;height: 150px">
            <img slot="reference" :src="`${imgHost}`+ scope.row.cardLogo" style="max-height: 40px;max-width: 40px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button  type="text" icon="el-icon-edit" size="small "   @click="handleUpdate(scope.row)"
          v-hasPermi="['system:info:remove']">修改</el-button>
           <el-button style="color: #F56C6C" icon="el-icon-delete"  type="text"  size="small "   @click="handleDelete(scope.row)"
          v-hasPermi="['system:info:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <el-dialog :title="dialogTitle" :visible.sync="dialogOpen"  width="45%">

      <el-form ref="elForm" :model="formData" :rules="rules"  :inline="true" size="medium" label-width="100px" >
        <el-form-item label="卡片名称" prop="cardName">
          <el-input v-model="formData.cardName" placeholder="请输入卡片名称" clearable ></el-input>
        </el-form-item>
        <el-form-item label="卡片类型" prop="cardType">
          <el-select v-model="formData.cardType" placeholder="请选择卡片类型" clearable>
            <el-option v-for="dict in dict.type.sys_user_card_type"  :label="dict.label" :key="dict.value" :value="dict.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡片简介" prop="cardDesc">
          <el-input v-model="formData.cardDesc" placeholder="请输入卡片简介" maxlength="50"   show-word-limit :rows="2" clearable type="textarea" ></el-input>
        </el-form-item>
        <el-form-item label="卡片封面" prop="cardLogo" style="width: 100%;">
          <el-upload
             class="avatar-uploader"
             :action="uploadFileUrl"
             :show-file-list="false"
             :headers="headers"
             :on-success="uploadSuccess"
             :before-upload="beforeUpload">
            <img v-if="formData.cardLogo" :src="`${imgHost}` + formData.cardLogo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    getCardList,
    addCard,
    updateCard,
    getCard,
    delCard
  } from "@/api/member/vip-card";
  import store from '@/store'
  export default {
    name:'Vip-card-list',
    dicts: ['sys_user_card_type'],
    data() {
      return {
          queryParams: {
            pageNum: 1,
            pageSize: 10,
          },
          headers: {
            Authorization: "Bearer " + store.getters.token
          },
          uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile/oss",
          dialogTitle:'',
          dialogOpen:false,
          cardTypeOptions:[],
          loading:false,
          cardList:[],
          total:0,
          formData:{
            cardName:'',
            cardType:'',
            cardLogo:''
          },
          rules:{
            cardName:[
              {
                required: true,
                message: '请输入会员卡名称',
                trigger: 'change'
              }
            ],
            cardType:[
              {
                required: true,
                message: '请选择会员卡名称',
                trigger: 'change'
              }
            ],
            cardLogo:[
              {
                required: true,
                message: '请上传会员卡封面',
                trigger: 'change'
              }
            ]
          },

      }
    },
    created() {
      this.getList()
    },
    mounted() {
    },
    methods: {
        getList(){
          this.loading = true;
          getCardList(this.queryParams).then(response => {
            this.cardList = response.rows;
            this.total = response.total;
            this.loading = false;
          });
        },
        /**
         * 搜索按钮事件
         */
        searchQuery(){
            this.getList();

        },
        //新增事件弹窗
        addCard(){
          this.resetQuery();
            this.dialogOpen=true;
        },
        // 新增取消
        cancel(){
          this.resetQuery();
          this.dialogOpen=false;
        },
        //新增，修改提交
        submitForm(){
          this.$refs['elForm'].validate(valid => {
            if (valid) {
              if(this.formData.id){
                updateCard(this.formData).then(response => {
                  this.$modal.msgSuccess("修改成功");
                  this.dialogOpen = false;
                  this.getList();
                });

              }else{
                addCard(this.formData).then(response => {
                  this.$modal.msgSuccess("新增成功");
                  this.dialogOpen = false;
                  this.getList();
                });

              }
            }

          })
        },
        /** 删除按钮操作 */
        handleDelete(row) {
          this.$modal.confirm('是否确认删除该条数据项？').then(function() {
            return delCard(row.id);
          }).then(() => {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          }).catch(() => {});
        },
        /**
         * @param {Object} row
         * 修改
         */
        handleUpdate(row){
          this.formData=row;
          this.dialogOpen = true;
        },
        //参数重置
        resetQuery(){
          this.resetForm("queryForm");
          this.resetForm("elForm");
          this.formData={
              cardName:'',
              cardType:'',
              cardLogo:''
          }

        },
        /**
         * @param {Object} res
         * @param {Object} file
         * 图片上传成功的钩子
         */
        uploadSuccess(res, file){
            this.formData.cardLogo = res.data.url;
            this.$forceUpdate();
            if (this.formData.cardLogo != '') {
              this.$refs.elForm.clearValidate('applicationLogo') //清除图片校验文字
            }
        },
        beforeUpload(file){
          let isAccept = new RegExp('image/*').test(file.type)
          let isRightSize = file.size / 1024 / 1024 < 20
          if (!isAccept) {
            this.$message.error('应该选择image/*类型的文件')
            return isAccept
          } else if (!isRightSize) {
            this.$message.error('文件大小超过 20MB')
            return isRightSize
          }
        }

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
