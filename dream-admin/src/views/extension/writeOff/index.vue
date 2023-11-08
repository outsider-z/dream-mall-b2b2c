<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
     <el-form-item label="卡券名称" prop="name">
       <el-input v-model="queryParams.name" placeholder="请输入卡券名称" clearable style="width: 240px"
         @keyup.enter.native="handleQuery" />
     </el-form-item>
     <el-form-item label="核销码" prop="name">
       <el-input v-model="queryParams.name" placeholder="请输入核销码" clearable style="width: 240px"
         @keyup.enter.native="handleQuery" />
     </el-form-item>
     <el-form-item label="商家名称" prop="name">
       <el-input v-model="queryParams.name" placeholder="请输入商家名称" clearable style="width: 240px"
         @keyup.enter.native="handleQuery" />
     </el-form-item>
     <el-form-item label="商家手机号码" prop="name">
       <el-input v-model="queryParams.name" placeholder="请输入商家手机号码" clearable style="width: 240px"
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
          v-hasPermi="['system:configuration:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:configuration:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:configuration:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="modularList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商家名称" prop="showLocationName" width="250" align="center" />
      <el-table-column label="卡券名称" align="center" prop="customizedModuleName" width="250" />
      <el-table-column label="核销码" prop="moduleSort" width="250" align="center" />
      <el-table-column label="领取时间" prop="moduleSort" width="250" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效期" prop="moduleSort" width="250" align="center" />
      <el-table-column label="状态" prop="moduleSort" width="250" align="center" />
      <el-table-column label="使用时间" prop="moduleSort" width="250" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用须知" prop="moduleSort" width="250" align="center" />
      <el-table-column label="操作" width="200" align="center" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:configuration:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:configuration:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="展示位置" prop="showLocation">
          <el-select v-model="formData.showLocation" placeholder="请选择展示位置" clearable :style="{width: '100%'}">
            <el-option id="0" label="首页" value="0">首页</el-option>
            <el-option v-for="(item, index) in showLocationOptions" :key="index" :label="item.moduleName"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模块类型" prop="customizedModuleId">
          <el-select v-model="formData.customizedModuleId" placeholder="请选择模块类型" clearable :style="{width: '100%'}">
            <el-option v-for="(item, index) in modularTypeOptions" :key="index" :label="item.moduleName"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="moduleSort">
          <el-input-number v-model="formData.moduleSort" placeholder="排序" controls-position=right></el-input-number>
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
    listConfiguration,
    getConfiguration,
    addConfiguration,
    updateConfiguration,
    delConfiguration,
    getModuleSettings
  } from "@/api/system/configuration";
  export default {
    name: 'Configuration',
    dicts: ['sys_modular_type'],
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
          showLocation: undefined,
          customizedModuleId: undefined,
          moduleSort: 0,
        },
        rules: {
          showLocation: [{
            required: true,
            message: '请选择展示位置',
            trigger: 'change'
          }],
          customizedModuleId: [{
            required: true,
            message: '请选择模块类型',
            trigger: 'change'
          }],
          moduleSort: [{
            required: true,
            message: '请输入排序',
            trigger: 'blur'
          }],
        },
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        showSearch: true,
        showLocationOptions: [],
        modularTypeOptions: []
      }
    },
    computed: {},
    watch: {},
    created() {
      this.getSettings()
      this.getList()
    },
    mounted() {},
    methods: {
      /** 查询列表 */
      getList() {
        this.loading = true;
        listConfiguration(this.queryParams).then(response => {
          this.modularList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      //查询展示位置和模块类型
      getSettings() {
        this.queryParams.status = 0;
        getModuleSettings(this.queryParams).then(response => {
          this.modularTypeOptions = response.data
          this.showLocationOptions = response.data

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
            showLocation: undefined,
            customizedModuleId: undefined,
            moduleSort: 0,
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
        this.title = "添加模块配置";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const modularId = row.id || this.ids
        getConfiguration(modularId).then(response => {
          this.formData = response.data;
          this.open = true;
          this.title = "修改模块配置";
        });
      },
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            if (this.formData.id != undefined) {
              updateConfiguration(this.formData).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addConfiguration(this.formData).then(response => {
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
        this.$modal.confirm('是否确认删除该模块类型？').then(function() {
          return delConfiguration(modularIds);
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
    }
  }
</script>
<style>
</style>
