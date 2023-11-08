<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="资讯标题" prop="name">
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
          v-hasPermi="['system:notice:add']">发布资讯</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:notice:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:notice:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="modularList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="资讯标题" prop="name" width="300" align="center" />
      <el-table-column label="状态" prop="sort" width="300" sortable align="center" />
      <el-table-column label="发布日期" prop="description" width="300" align="center" />
      <el-table-column label="发布状态" align="center" width="150">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-value="0" inactive-value="1"
            @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:notice:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:notice:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="资讯标题" prop="articleTitle">
          <el-input v-model="formData.articleTitle" placeholder="请输入资讯标题" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="内容源" prop="linkType">
          <el-radio-group v-model="formData.linkType" size="medium">
            <el-radio v-for="(item, index) in linkTypeOptions" :key="index" :label="item.value"
              :disabled="item.disabled">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="链接地址" prop="linkUrl" v-if="formData.linkType == '1'">
          <el-input v-model="formData.linkUrl" placeholder="请输入链接地址" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="自定义内容" prop="moduleDescription" v-if="formData.linkType == '2'">
          <editor v-model="formData.moduleDescription" :min-height="192" />
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
    listBrand,
    getBrand,
    addBrand,
    updateBrand,
    delBrand
  } from "@/api/product/brand";
  export default {
    name: 'Information',
    dicts: ['sys_modular_type', 'sys_job_status'],
    inheritAttrs: false,
    components: {},
    props: [],
    data() {
      return {
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
        formData: {
          name: undefined,
          description: undefined,
          logoUrl: '',
          sort: 0,
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
        listBrand(this.queryParams).then(response => {
          this.modularList = response.rows;
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
            id: undefined,
            name: undefined,
            description: undefined,
            logoUrl: '',
            sort: 0,
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
        this.title = "添加品牌设置";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const modularId = row.id || this.ids
        getBrand(modularId).then(response => {
          this.formData = response.data;
          this.open = true;
          this.title = "修改品牌设置";
        });
      },
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            if (this.formData.id != undefined) {
              updateBrand(this.formData).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addBrand(this.formData).then(response => {
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
        this.$modal.confirm('是否确认删除品牌名称为"' + row.name + '"的数据项？').then(function() {
          return delBrand(modularIds);
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
        this.$modal.confirm('确认要"' + text + '"该资讯吗？').then(function() {
          return updateSettings(row);
        }).then(() => {
          this.$modal.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
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
