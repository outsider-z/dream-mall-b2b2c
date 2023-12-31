<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="协议标题" prop="agreementTitle">
        <el-input v-model="queryParams.agreementTitle" placeholder="请输入协议标题" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="类型" prop="agreementTypeId">
        <el-select v-model="queryParams.agreementTypeId" placeholder="请选择协议类型">
          <el-option v-for="item in agreementOptions" :key="item.dictCode" :label="item.dictLabel" :value="item.dictCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:agreement:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:agreement:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:agreement:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="noticeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="协议标题" align="center" prop="agreementTitle" :show-overflow-tooltip="true" />
      <el-table-column label="协议类型" align="center" prop="agreementTypeId" width="200">
        <template slot-scope="scope">
          <el-tag>{{scope.row.agreementTypeName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="200">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_notice_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:agreement:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:agreement:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改协议对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="协议标题" prop="agreementTitle">
              <el-input v-model="form.agreementTitle" placeholder="请输入协议标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="协议类型" prop="agreementTypeId">
              <el-select v-model="form.agreementTypeId" placeholder="请选择协议类型">
                <el-option v-for="item in agreementOptions" :key="item.dictCode" :label="item.dictLabel" :value="item.dictCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in dict.type.sys_notice_status" :key="dict.value" :label="dict.value">
                  {{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容">
              <editor v-model="form.agreementContent" :min-height="192" />
            </el-form-item>
          </el-col>
        </el-row>
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
    listAgreement,
    getAgreement,
    delAgreement,
    addAgreement,
    updateAgreement
  } from "@/api/system/agreement";
  import {
    getDicts
  } from "@/api/system/dict/data";
  export default {
    name: "Agreement",
    dicts: ['sys_notice_status'],
    data() {
      return {
        agreementOptions: [],
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 协议表格数据
        noticeList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          agreementTitle: undefined,
          createBy: undefined,
          status: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          agreementTitle: [{
            required: true,
            message: "协议标题不能为空",
            trigger: "blur"
          }],
          agreementTypeId: [{
            required: true,
            message: "协议类型不能为空",
            trigger: "change"
          }]
        },
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询协议列表 */
      getList() {
        getDicts('sys_agreement_type').then(res => {
          this.agreementOptions = res.data
        })
        this.loading = true;
        listAgreement(this.queryParams).then(response => {
          this.noticeList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          agreementTitle: undefined,
          agreementTypeId: undefined,
          agreementContent: undefined,
          status: "0"
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加协议";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const agreementId = row.id || this.ids
        getAgreement(agreementId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改协议";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateAgreement(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addAgreement(this.form).then(response => {
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
        const agreementIds = row.id || this.ids
        this.$modal.confirm('是否确认删除协议编号为"' + agreementIds + '"的数据项？').then(function() {
          return delAgreement(agreementIds);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      }
    }
  };
</script>
