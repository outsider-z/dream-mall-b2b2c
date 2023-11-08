<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="标题" prop="videoTitle">
          <el-input v-model="queryParams.name" placeholder="请输入标题进行搜索" clearable style="width: 240px"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
            v-hasPermi="['system:brand:add']">发布视频</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
            v-hasPermi="['system:brand:edit']">修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
            v-hasPermi="['system:brand:remove']">删除</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
      <!-- 表  -->
      <el-table v-loading="loading" :data="videoActivityList"  border>
        <el-table-column label="标题" prop="videoTitle" width="300" align="center" />
        <el-table-column prop="img" label="活动封面" width="300" align="center">
          <template slot-scope="scope">
            <el-popover placement="right" width="180" trigger="hover">
              <img :src="`${imgHost}`+scope.row.imagePath" alt="" style="width: 150px;height: 150px">
              <img slot="reference" :src="`${imgHost}`+scope.row.imagePath" style="max-height: 80px;max-width: 80px">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="视频分类" align="center" width="150">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_video_courses" :value="scope.row.videoType" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope" v-if="scope.row.id !== 1">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['system:brand:edit']">修改</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
              v-hasPermi="['system:brand:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
        <!-- 新增 -->
      <el-dialog :title="title" :visible.sync="open" width="45%">
        <el-form ref="elForm"  :inline="true" :model="formData" :rules="rules" size="medium" label-width="100px">
          <el-form-item label="视频标题" prop="videoTitle">
            <el-input v-model="formData.videoTitle" placeholder="请输入活动标题" clearable >
            </el-input>
          </el-form-item>
          <el-form-item label="视频地址" prop="videoPath" >
            <el-input v-model="formData.videoPath" placeholder="请输入链接地址" clearable >
            </el-input>
          </el-form-item>
          <el-form-item label="视频分类" prop="videoType" style="width: 100%;" >
            <el-select v-model="formData.videoType" placeholder="视频分类（新增可以去数据字典）" clearable>
                <el-option v-for="dict in dict.type.sys_video_courses"  :label="dict.label" :key="dict.value" :value="dict.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="视频描述" prop="videoDesc" >
            <el-input  type="textarea" v-model="formData.videoDesc" placeholder="请输入视频描述" maxlength="30"
                show-word-limit clearable >
            </el-input>
          </el-form-item>
          <el-form-item label="封面图片" prop="imagePath" style="width: 100%;">
            <el-upload class="avatar-uploader" 
                :action="uploadFileUrl" 
                :show-file-list="false" 
                :headers="headers"
                :on-success="handleAvatarSuccess" 
                :before-upload="beforeAvatarUpload">
              <img v-if="formData.imagePath" :src="`${imgHost}`+formData.imagePath" class="avatar">
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
      getBrand,
      delBrand
    } from "@/api/product/brand";

    import {
        getActivityVideoList,
        AddActiveVideo,
        delActiveVideo,
        updateActiveVideo,
    } from "@/api/community/avtivity-video";

    import store from '@/store'
    export default {
      name: 'Activity',
      dicts: ['sys_video_courses'],
      inheritAttrs: false,
      components: {},
      props: [],
      data() {
        var valiIcon = (rule, value, callback) => {
          // 图片验证
          if (this.formData.coverImageUrl == '') {
            callback(new Error("请上传品牌图标"));
          } else {
            callback();
          }
        }
        return {
          headers: {
            Authorization: "Bearer " + store.getters.token
          },
          uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile/oss",
          videoActivityList: [],
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
          formData: {
            videoTitle: undefined,
            imagePath: undefined,
            videoDesc: '',
            videoPath: "",
            videoTitle: "",
            videoType:''
          },
          rules: {
            articleError: [{
              required: true,
              message: '请输入资讯标题',
              trigger: 'blur'
            }],
            linkType: [{
              required: true,
              message: '内容源不能为空',
              trigger: 'change'
            }],
            coverImageUrl: [{
              required: true,
              validator: valiIcon
            }],
          },
          linkTypeOptions: [{
            "label": "外部链接",
            "value": 1
          }, {
            "label": "自定义内容",
            "value": 2
          }],
          queryParams: {
            pageNum: 1,
            pageSize: 10,
          },
          showSearch: true,
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
          getActivityVideoList(this.queryParams).then(response => {
            this.videoActivityList = response.rows;
            this.total = response.total;
            this.loading = false;
          });
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
          this.ids = selection.map(item => item.id)
          this.single = selection.length != 1
          this.multiple = !selection.length
        },
        reset() {

          this.formData = {
              videoTitle: undefined,
                imagePath: undefined,
                videoDesc: '',
                videoPath: "",
                videoTitle: "",
                videoType:''
            },
            this.resetForm("formData");
        },
        /** 重置按钮操作 */
        resetQuery() {
          this.resetForm("queryForm");
          this.handleQuery();
        },
        /** 新增按钮操作 */
        handleAdd() {
          this.reset();
          this.open = true;
          this.title = "添加活动";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
          this.reset();
          const modularId = row.id || this.ids;
            //   getBrand(modularId).then(response => {
            //     this.formData = response.data;
            //     this.open = true;
            //     this.title = "修改视频课程";
            //   });
            this.open = true;
            this.title = "修改视频课程";
            this.imagePath=row.imagePath;
           this.formData=row;
        },
        submitForm() {
          this.$refs['elForm'].validate(valid => {
            if (valid) {
              if (this.formData.id != undefined) {
                updateActiveVideo(this.formData).then(response => {
                  this.$modal.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                });
              } else {
                AddActiveVideo(this.formData).then(response => {
                  this.$modal.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                });
              }
            }
          })
        },
        /** 删除按钮操作 */
        handleDelete(row) {
          const modularIds = row.id || this.ids;
          this.$modal.confirm('是否确认删除该活动吗？').then(function() {
            return delActiveVideo(modularIds);
          }).then(() => {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          }).catch(() => {});
        },
        /** 搜索按钮操作 */
        handleQuery() {
          this.queryParams.pageNum = 1;
          this.getList();
        },
        // 取消按钮
        cancel() {
          this.open = false;
          this.reset();
        },
        // 状态修改
        handleStatusChange(row) {
          let text = row.status === "0" ? "发布" : "下架";
          // let para = {
          //   id :row.id,
          //   status:row.status
          // }
          this.$modal.confirm('确认要"' + text + '"该活动吗？').then(function() {
            return updateSettings(row);
          }).then(() => {
            this.$modal.msgSuccess(text + "成功");
          }).catch(function() {
            row.status = row.status === "0" ? "1" : "0";
          });
        },
        handleAvatarSuccess(res, file) {
          this.formData.imagePath = res.data.url;
          if (this.formData.imagePath != '') {
            this.$refs.elForm.clearValidate('imagePath') //清除图片校验文字
          }
        },
        beforeAvatarUpload(file) {
          let isAccept = new RegExp('image/*').test(file.type)
          if (!isAccept) {
            this.$message.error('请选择jpg,jpeg或者png格式的图片')
          }
          // const isLt2M = file.size / 1024 / 1024 < 2;
          return isAccept;
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