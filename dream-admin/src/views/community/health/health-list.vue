<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="姓名" prop="userName">
        <el-input v-model="queryParams.userName" placeholder="请输入姓名" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button icon="el-icon-download" type="warning" size="mini" @click="handleExport">导出</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:cate:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->
    
    <el-table v-loading="loading" :data="healthUserList" border >
      <el-table-column label="姓名" prop="userName" width="300" align="center" show-overflow-tooltip />
      <el-table-column label="性别" prop="sex" width="300" align="center" show-overflow-tooltip />
      <el-table-column label="生日" prop="birthday" width="300" align="center" />
      <el-table-column label="身高" prop="height" width="300" align="center" />
      <el-table-column label="体重" prop="weight" width="300" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:sho  pper:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:shopper:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="form" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="检测类型" prop="detectionType">
          <el-select v-model="formData.detectionType" placeholder="请选择检测类型" clearable :style="{width: '100%'}">
            <el-option v-for="dict in dict.type.sys_testing_type" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="formData.sex" placeholder="请选择性别" clearable :style="{width: '100%'}">
            <el-option v-for="dict in dict.type.sys_sex_type" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最高值" prop="highestValue">
          <el-input v-model="formData.highestValue" placeholder="请输入最高值" />
        </el-form-item>
        <el-form-item label="最低值" prop="minimumValue">
          <el-input v-model="formData.minimumValue" placeholder="请输入最低值" />
        </el-form-item>
        <el-form-item label="标准值" prop="standardValue">
          <el-input v-model="formData.standardValue" placeholder="请输入标准值" />
        </el-form-item>
        <el-form-item label="健康状况" prop="indicationStatus">
          <el-input v-model="formData.indicationStatus" placeholder="请输入健康状况" />
        </el-form-item>
        <el-form-item label="当前指标的健康建议" prop="indicationHealthSuggest">
          <el-input type="textarea" v-model="formData.indicationHealthSuggest" placeholder="请输入当前指标的健康建议" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listIndustry,
    getIndustry,
    delIndustry,
    addIndustry,
    updateIndustry
  } from "@/api/system/industry";

  import {
    gethealthList,
    getHeathDetails
  } from "@/api/community/heath";


  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import IconSelect from "@/components/IconSelect";
  import store from '@/store'

  export default {
    name: "Industry",
    dicts: ['sys_testing_type','sys_sex_type'],
    components: {
      Treeselect,
      IconSelect
    },
    data() {
      return {
        headers: {
          Authorization: "Bearer " + store.getters.token
        },
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/upload",
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 菜单表格树数据
        menuList: [],
        healthUserList: [],
        // 菜单树选项
        menuOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        total: 0,
        // 是否展开，默认全部折叠
        isExpandAll: false,
        // 重新渲染表格状态
        refreshTable: true,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          industryParentId: '0'
        },
        // 表单参数
        formData: {
          detectionType:'',
          sex:'',
          highestValue:'',
          minimumValue:'',
          standardValue:'',
          indicationStatus:'',
          indicationHealthSuggest:'',
        },
        // 表单校验
        rules: {
          detectionType: [{
            required: true,
            message: "检测类型不能为空",
            trigger: "change"
          }],
          sex: [{
            required: true,
            message: "性别不能为空",
            trigger: "change"
          }],
          highestValue: [{
            required: true,
            message: "最高值不能为空",
            trigger: "blur"
          }],
          minimumValue: [{
            required: true,
            message: "最低值不能为空",
            trigger: "blur"
          }],
          standardValue: [{
            required: true,
            message: "标准值不能为空",
            trigger: "blur"
          }],
          indicationStatus: [{
            required: true,
            message: "健康状况不能为空",
            trigger: "blur"
          }],
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询列表 */
      getList() {
        this.loading = true;
        gethealthList(this.queryParams).then(response => {
          this.healthUserList = response.rows
          this.total = response.total;
          this.loading = false;
        });
      },
      //导出
      handleExport(){
        this.download('market/admin/healthRecord/export', {
                ...this.queryParams
            }, `user_health_${new Date().getTime()}.xlsx`)
      },
      /** 转换菜单数据结构 */
      // normalizer(node) {
      //   if (node.children && !node.children.length) {
      //     delete node.children;
      //   }
      //   return {
      //     id: node.id,
      //     label: node.industryName,
      //     children: node.children
      //   };
      // },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          detectionType:'',
          sex:'',
          highestValue:'',
          minimumValue:'',
          standardValue:'',
          indicationStatus:'',
          indicationHealthSuggest:'',
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 新增按钮操作 */
      handleAdd(row) {
        this.reset();
        if (row != null && row.id) {
          this.form.industryParentId = row.id;
        } else {
          this.form.industryParentId = 0;
        }
        this.open = true;
        this.title = "添加行业";
      },
      /** 展开/折叠操作 */
      toggleExpandAll() {
        this.refreshTable = false;
        this.isExpandAll = !this.isExpandAll;
        this.$nextTick(() => {
          this.refreshTable = true;
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        getIndustry(row.id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改行业信息";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateIndustry(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addIndustry(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        this.$modal.confirm('是否确认删除行业名称为"' + row.industryName + '"的数据项？').then(function() {
          return delIndustry(row.id);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
    }
  };
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
