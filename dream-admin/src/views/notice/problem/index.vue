<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="问题标题" prop="articleTitle">
        <el-input v-model="queryParams.articleTitle" placeholder="请输入标题进行搜索" clearable style="width: 240px"
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
          v-hasPermi="['system:brand:add']">发布问题</el-button>
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
    <el-table v-loading="loading" :data="modularList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="问题标题" prop="articleTitle" width="300" align="center" />
      <el-table-column label="发布日期" prop="time" width="300" align="center" />
      <el-table-column label="发布状态" align="center" width="150">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-value="0" inactive-value="1"
            @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="分类" align="center" width="150" :filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]" :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.tag === '家' ? 'primary' : 'success'" disable-transitions>{{scope.row.tag}}</el-tag>
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
    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="问题分类" prop="tagName">
          <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
            @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 管理分类</el-button>
        </el-form-item>
        <el-form-item label="问题标题" prop="articleTitle">
          <el-input v-model="formData.articleTitle" placeholder="请输入问题标题" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="内容源" prop="qaSource">
          <el-radio-group v-model="formData.qaSource" size="medium">
            <el-radio v-for="(item, index) in linkTypeOptions" :key="index" :label="item.value"
              :disabled="item.disabled">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="公众号链接" prop="previewUrl" v-if="formData.qaSource == '1'">
          <el-input v-model="formData.previewUrl" placeholder="请输入公众号链接" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="自定义内容" prop="moduleDescription" v-if="formData.qaSource == '2'">
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
  import store from '@/store'
  export default {
    name: 'Problem',
    dicts: ['sys_modular_type', 'sys_job_status'],
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
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/upload",
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
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        formData: {
         tagName:'',
         articleTitle:'',
         qaSource:'',
         previewUrl:'',
         moduleDescription:'',
        },
        rules: {
          articleTitle: [{
            required: true,
            message: '请输入问题标题',
            trigger: 'blur'
          }],
          qaSource: [{
            required: true,
            message: '内容源不能为空',
            trigger: 'change'
          }],
        },
        linkTypeOptions: [{
          "label": "公众号链接",
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
            tagName:'',
            articleTitle:'',
            qaSource:'',
            previewUrl:'',
            moduleDescription:'',
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
        this.title = "添加问题";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const modularId = row.id || this.ids
        getBrand(modularId).then(response => {
          this.formData = response.data;
          this.open = true;
          this.title = "修改问题";
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
        this.$modal.confirm('是否确认删除该问题吗？').then(function() {
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
        // let para = {
        //   id :row.id,
        //   status:row.status
        // }
        this.$modal.confirm('确认要"' + text + '"该问题吗？').then(function() {
          return updateSettings(row);
        }).then(() => {
          this.$modal.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
      },
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      filterTag(value, row) {
        return row.tag === value;
      },
    }
  }
</script>
<style>
  .el-tag+.el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
