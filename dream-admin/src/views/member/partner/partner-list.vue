<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="申请人" prop="cardName">
          <el-select v-model="queryParams.userInfoId" clearable :filter-method="searchUserByName" filterable
            placeholder="请选择申请人" v-el-select-loadmore="loadmore">
            <el-option v-for="item in userInfoOptions" :key="item.id" :label="item.nickName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="cardStatus">
          <el-select v-model="queryParams.cardStatus" placeholder="请选择卡片类型" clearable>
            <el-option v-for="dict in dict.type.sys_review_type"  :label="dict.label" :key="dict.value" :value="dict.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="searchQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
  
      <!-- 表 -->
      <el-table v-loading="loading" :data="list" border>
        <el-table-column label="申请人" prop="nickName" width="300" align="center" />
        <el-table-column prop="img" label="头像" width="300" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" width="300" trigger="hover">
            <img :src="`${imgHost}`+ scope.row.photoUrl" alt="" style="width: 150px;height: 150px">
            <img slot="reference" :src="`${imgHost}`+ scope.row.photoUrl" style="max-height: 40px;max-width: 40px">
          </el-popover>
        </template>
      </el-table-column>
        <el-table-column label="申请时间" prop="createTime" width="300" align="center" />
        <el-table-column label="审核状态" width="300" align="center">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_review_type" :value="scope.row.status" />       
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope" v-if="scope.row.id !== 1">
            <el-button :disabled="scope.row.status=='APPROVING'?false:true" type="success" size="small " plain @click="handleApply(scope.row)"
              v-hasPermi="['system:info:remove']">审核</el-button>
            <el-button :disabled="scope.row.status=='APPROVING'?false:true" type="danger" size="small " plain @click="handleReject(scope.row)"
              v-hasPermi="['system:info:remove']">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        <el-dialog :title="dialogTitle" :visible.sync="dialogOpen" width="45%">
        <el-form ref="elForm" :model="formData" :rules="rules" :inline="true" size="medium" label-width="100px">
          <el-form-item label="拒绝原因" prop="rejectReason">
            <el-input v-model="formData.rejectReason" placeholder="请输入拒绝原因" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="rejectSubmit">确定</el-button>
        </div>
      </el-dialog>
  
    </div>
  </template>
  <script>
    import {
      getPartnerList,
      partner
    } from "@/api/member/partner";
    import {
      listInfo
    } from "@/api/member/query";
    import store from '@/store'
    export default {
      dicts: ['sys_user_card_type','sys_review_type'],
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
          cardTypeOptions: [],
          loading: false,
          dialogOpen: false,
          dialogTitle:'',
          list: [],
          total: 0,
          userInfToTal:0,
          item:{},
          userInfoOptions:[],
          formData: {
            rejectReason: ''
          },
          rules: {
            rejectReason: [{
              required: true,
              message: '请输入拒绝原因',
              trigger: 'change'
            }]
          },
  
        }
      },
      created() {
        this.getList()
      },
      mounted() {},
      methods: {
        getList() {
          this.loading = true;
          getPartnerList(this.queryParams).then(response => {
            this.list = response.rows;
            this.total = response.total;
            this.loading = false;
          });
        },
        /**
         * @param {Object} nickName
         */
        searchUserByName(nickName){
          this.queryParams.nickName=nickName;
          this.getUserList();
        },
        //用户加载更多
        loadmore(){
          this.getUserList();
        },
        /**
         * 查询用户信息
         */
        getUserList() {
          this.loading = true;
          listInfo(this.queryParams).then(response => {
            this.userInfoOptions = response.rows;
            this.userInfToTal = response.total;
            this.loading = false;
          });
        },
        /**
         * 搜索按钮事件
         */
        searchQuery() {
          this.getList();
        },
        // 新增取消
        cancel() {
          this.resetQuery();
          this.dialogOpen = false;
        },
        //新增，修改提交
        submitForm() {
          this.$refs['elForm'].validate(valid => {
            if (valid) {
              if (this.formData.id) {
                updateCard(this.formData).then(response => {
                  this.$modal.msgSuccess("修改成功");
                  this.dialogOpen = false;
                  this.getList();
                });
  
              } else {
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
        handleReject(row) {
          this.dialogTitle='拒绝原因';
          this.dialogOpen = true;
          this.item=row;
        },
        //拒绝
        rejectSubmit(){
          this.formData.id=this.item.id;
          this.formData.acceptType='REJECT';
          this.$refs['elForm'].validate(valid => {
            if (valid) {
                partner(this.formData).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.dialogOpen = false;
                this.getList();
              });
            }
  
          })
        },
        /**
         * @param {Object} row
         * 审核通过
         */
        handleApply(row) {
          // this.formData = row;
          row.acceptType='AGREED';
          this.$modal.confirm('是否确认同意该条数据项？').then(function() {
            return partner(row);
          }).then(() => {
            this.getList();
            this.$modal.msgSuccess("操作成功");
          }).catch(() => {});
        },
        //参数重置
        resetQuery() {
          this.resetForm("queryForm");
          this.resetForm("elForm");
          this.formData = {
            rejectReason: ''
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
  