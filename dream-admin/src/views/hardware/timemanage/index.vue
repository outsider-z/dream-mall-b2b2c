<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="会员名称" prop="nickName">
        <el-input v-model="queryParams.nickName" placeholder="请输入会员名称" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="电话号码" prop="phoneNo">
        <el-input v-model="queryParams.phoneNo" placeholder="请输入电话号码" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb20">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:brand:add']">新增</el-button>
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
      <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="机号" prop="nickName" width="300" align="center" />
        <el-table-column label="卡类型" prop="birthday" width="300" align="center" />
        <el-table-column label="一时段开始时间" prop="phoneNo" width="300" align="center" />
        <el-table-column label="一时段结束时间" prop="userLevelId" width="300" align="center" />
        <el-table-column label="二时段开始时间" prop="invitationId" width="300" align="center" />
        <el-table-column label="二时段结束时间" prop="supervisorId" width="300" align="center" />
        <el-table-column label="三时段开始时间" prop="signature" width="300" align="center" />
        <el-table-column label="三时段结束时间" prop="signature" width="300" align="center" />
        <el-table-column label="四时段开始时间" prop="signature" width="300" align="center" />
        <el-table-column label="四时段结束时间" prop="signature" width="300" align="center" />
        <el-table-column label="扣款模式" prop="signature" width="300" align="center" />
        <el-table-column label="操作" align="center" width="200" fixed="right" class-name="small-padding fixed-width">
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
    </el-row>
    <el-row :gutter="10" class="mb20">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:brand:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:brand:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:brand:remove']">删除</el-button>
      </el-col>
      <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="机号" prop="nickName" width="300" align="center" />
        <el-table-column label="卡类型" prop="birthday" width="300" align="center" />
        <el-table-column label="一时段消费金额" prop="phoneNo" width="300" align="center" />
        <el-table-column label="一时段二次消费金额" prop="userLevelId" width="300" align="center" />
        <el-table-column label="一时段三次消费金额" prop="invitationId" width="300" align="center" />
        <el-table-column label="折扣" prop="supervisorId" width="300" align="center" />
        <el-table-column label="二时段消费金额" prop="signature" width="300" align="center" />
        <el-table-column label="二时段二次消费金额" prop="signature" width="300" align="center" />
        <el-table-column label="二时段三次消费金额" prop="signature" width="300" align="center" />
        <el-table-column label="折扣" prop="signature" width="300" align="center" />
        <el-table-column label="三时段消费金额" prop="signature" width="300" align="center" />
        <el-table-column label="三时段二次消费金额" prop="signature" width="300" align="center" />
        <el-table-column label="三时段三次消费金额" prop="signature" width="300" align="center" />
        <el-table-column label="折扣" prop="signature" width="300" align="center" />
        <el-table-column label="四时段消费金额" prop="signature" width="300" align="center" />
        <el-table-column label="四时段二次消费金额" prop="signature" width="300" align="center" />
        <el-table-column label="四时段三次消费金额" prop="signature" width="300" align="center" />
        <el-table-column label="折扣" prop="signature" width="300" align="center" />
        <el-table-column label="操作" align="center" width="200" fixed="right" class-name="small-padding fixed-width">
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
    </el-row>
    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="140px">
        <el-form-item label="机号" prop="nickName">
          <el-input v-model="formData.nickName" placeholder="请输入机号" clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="卡类型" prop="userLevelId" v-if="title == '修改卡类型'">
          <el-select v-model="formData.userLevelId" placeholder="请选择卡类型" clearable :style="{width: '100%'}">
            <el-option v-for="(item, index) in levelList" :key="index" :label="item.levelName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-row gutter="15">
          <el-col :span="12">
            <el-form-item label-width="140px" label="一时间段时间范围" prop="field103">
              <el-time-picker v-model="formData.field103" is-range format="HH:mm:ss" value-format="HH:mm:ss"
                :style="{width: '100%'}" start-placeholder="开始时间" end-placeholder="结束时间" range-separator="至" clearable>
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="140px" label="二时间段时间范围" prop="field104">
              <el-time-picker v-model="formData.field104" is-range format="HH:mm:ss" value-format="HH:mm:ss"
                :style="{width: '100%'}" start-placeholder="开始时间" end-placeholder="结束时间" range-separator="至" clearable>
              </el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="15">
          <el-col :span="12">
            <el-form-item label-width="140px" label="三时间段时间范围" prop="field103">
              <el-time-picker v-model="formData.field103" is-range format="HH:mm:ss" value-format="HH:mm:ss"
                :style="{width: '100%'}" start-placeholder="开始时间" end-placeholder="结束时间" range-separator="至" clearable>
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="140px" label="四时间段时间范围" prop="field104">
              <el-time-picker v-model="formData.field104" is-range format="HH:mm:ss" value-format="HH:mm:ss"
                :style="{width: '100%'}" start-placeholder="开始时间" end-placeholder="结束时间" range-separator="至" clearable>
              </el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="扣款模式" prop="userLevelId">
          <el-select v-model="formData.userLevelId" placeholder="请选择扣款模式" clearable :style="{width: '100%'}">
            <el-option v-for="(item, index) in levelList" :key="index" :label="item.levelName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="140px">
        <el-row gutter="15">
          <el-col :span="12">
            <el-form-item label="机号" prop="nickName">
              <el-input v-model="formData.nickName" placeholder="请输入机号" clearable :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="卡类型" prop="userLevelId">
              <el-select v-model="formData.userLevelId" placeholder="请选择卡类型" clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in levelList" :key="index" :label="item.levelName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="15">
          <el-col :span="12">
            <el-form-item label-width="140px" label="一时段消费金额" prop="field103">
              <el-input v-model="formData.name" placeholder="请输入姓名" clearable :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="140px" label="一时段二次金额" prop="field104">
              <el-input v-model="formData.name" placeholder="请输入姓名" clearable :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="15">
          <el-col :span="12">
            <el-form-item label-width="140px" label="一时段三次金额" prop="field103">
              <el-input v-model="formData.name" placeholder="请输入姓名" clearable :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="140px" label="折扣" prop="field104">
              <el-input v-model="formData.name" placeholder="请输入姓名" clearable :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="15">
          <el-col :span="12">
            <el-form-item label-width="140px" label="二时段消费金额" prop="field103">
              <el-input v-model="formData.name" placeholder="请输入姓名" clearable :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="140px" label="二时段二次金额" prop="field104">
              <el-input v-model="formData.name" placeholder="请输入姓名" clearable :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="15">
          <el-col :span="12">
            <el-form-item label-width="140px" label="二时段三次金额" prop="field103">
              <el-input v-model="formData.name" placeholder="请输入姓名" clearable :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="140px" label="折扣" prop="field104">
              <el-input v-model="formData.name" placeholder="请输入姓名" clearable :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="15">
          <el-col :span="12">
            <el-form-item label-width="140px" label="三时段消费金额" prop="field103">
              <el-input v-model="formData.name" placeholder="请输入姓名" clearable :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="140px" label="三时段二次金额" prop="field104">
              <el-input v-model="formData.name" placeholder="请输入姓名" clearable :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="15">
          <el-col :span="12">
            <el-form-item label-width="140px" label="三时段三次金额" prop="field103">
              <el-input v-model="formData.name" placeholder="请输入姓名" clearable :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="140px" label="折扣" prop="field104">
              <el-input v-model="formData.name" placeholder="请输入姓名" clearable :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="15">
          <el-col :span="12">
            <el-form-item label-width="140px" label="四时段消费金额" prop="field103">
              <el-input v-model="formData.name" placeholder="请输入姓名" clearable :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="140px" label="四时段二次金额" prop="field104">
              <el-input v-model="formData.name" placeholder="请输入姓名" clearable :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="15">
          <el-col :span="12">
            <el-form-item label-width="140px" label="四时段三次金额" prop="field103">
              <el-input v-model="formData.name" placeholder="请输入姓名" clearable :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="140px" label="折扣" prop="field104">
              <el-input v-model="formData.name" placeholder="请输入姓名" clearable :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
    listInfo,
    getInfo,
    delInfo,
    addInfo,
    updateInfo
  } from "@/api/member/query";
  import {
    listLevel
  } from "@/api/member/level";
  import store from '@/store'
  export default {
    name: 'Query',
    inheritAttrs: false,
    components: {},
    props: [],
    data() {
      return {
        headers: {
          Authorization: "Bearer " + store.getters.token
        },
        infoList: [],
        levelList: [],
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
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          phoneNo: '',
          nickName: '',
        },
        showSearch: true,
        formData: {
          nickName: '',
          birthday: '',
          phoneNo: '',
          photoUrl: '',
          sex: '',
          signature: '',
          invitationId: '',
        },
        sexOptions: [{
          "label": "男",
          "value": "0"
        }, {
          "label": "女",
          "value": "1"
        }],
        rules: {
          nickName: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          phoneNo: [{
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          }, {
            pattern: /^1(3|4|5|7|8|9)\d{9}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }],
          sex: [{
            required: true,
            message: '性别不能为空',
            trigger: 'change'
          }],
          birthday: [{
            required: true,
            message: '请选择出生日期',
            trigger: 'change'
          }],
        },
        userLevelUuidOptions: [{
          "label": "选项一",
          "value": 1
        }, {
          "label": "选项二",
          "value": 2
        }],
      }
    },
    computed: {},
    watch: {},
    created() {
      this.getList()
      this.getLevel()
    },
    mounted() {},
    methods: {
      /** 查询岗位列表 */
      getList() {
        this.loading = true;
        listInfo(this.queryParams).then(response => {
          this.infoList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      /** 查询会员等级 */
      getLevel() {
        let para = {
          pageNum: 1,
          pageSize: 1000,
        }
        listLevel(para).then(response => {
          this.levelList = response.rows;
        });
      },
      // 表单重置
      reset() {
        this.form = {
          nickName: '',
          birthday: '',
          phoneNo: '',
          photoUrl: '',
          sex: '',
          signature: '',
          invitationId: '',
        };
        this.resetForm("form");
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.postId)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加会员信息";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const levelId = row.id || this.ids
        getInfo(levelId).then(response => {
          this.formData = response.data;
          this.open = true;
          this.title = "修改会员信息";
        });
      },
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            if (this.formData.id != undefined) {
              updateInfo(this.formData).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.linkOpen = false;
                this.open = false;
                this.getList();
              });
            } else {
              addInfo(this.formData).then(response => {
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
        const levelIds = row.id || this.ids;
        this.$modal.confirm('是否确认删除该条数据项？').then(function() {
          return delInfo(levelIds);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 状态修改
      handleStatusChange(row) {
        let text = row.defaultFlag === "0" ? "使用" : "关闭";
        this.$modal.confirm('确认要默认"' + text + '"该会员等级吗？').then(function() {
          return updateInfo(row);
        }).then(() => {
          this.$modal.msgSuccess(text + "成功");
        }).catch(function() {
          row.defaultFlag = row.defaultFlag === "0" ? "1" : "0";
        });
      },
      handleAvatarSuccess(res, file) {
        this.formData.photoUrl = res.data.url;
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
