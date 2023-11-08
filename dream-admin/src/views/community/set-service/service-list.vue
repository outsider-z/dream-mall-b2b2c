<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="展示位置" prop="showLocation">
        <el-select v-model="queryParams.showLocation" placeholder="请选择展示位置" clearable :style="{ width: '100%' }">
          <el-option id="0" label="首页" value="0">首页</el-option>
          <el-option v-for="(item, index) in showLocationOptions" :key="index" :label="item.moduleName"
            :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模块等级" prop="moduleLevel">
        <el-select v-model="queryParams.moduleLevel" placeholder="请选择模块等级" clearable>
          <el-option v-if="dict.value != 'HOME'" v-for="dict in dict.type.sys_module_level" :key="dict.value"
            :label="dict.label" :value="dict.value"></el-option>
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
          v-hasPermi="['system:moduleConfiguration:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:moduleConfiguration:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:moduleConfiguration:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="modularList" @selection-change="handleSelectionChange" :border="true">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="模块名称" prop="moduleName" width="250" align="center" />
      <el-table-column label="模块等级" prop="moduleSort" width="250" sortable align="center">
        <template slot-scope="scope">
          {{ scope.row.moduleLevel == 'FIRST' ? '一级' : '二级' }}
        </template>
      </el-table-column>
      <el-table-column label="图标" prop="moduleSort" width="250" sortable align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.moduleIcon" :src="`${imgHost}` + scope.row.moduleIcon" class="moduleIcon">
        </template>
      </el-table-column>
      <el-table-column label="是否展示首页" prop="moduleSort" width="250" sortable align="center">
        <template slot-scope="scope">
          {{ scope.row.homeFlag == '0' ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="moduleSort" width="250" sortable align="center">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column label="首页排序" prop="moduleSort" width="250" sortable align="center">
        <template slot-scope="scope">
          {{ scope.row.homeSort }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:moduleConfiguration:edit']">修改</el-button>
          <el-button style="color: red;" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:moduleConfiguration:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 新增修改 -->
    <el-dialog :title="title" :visible.sync="open" :before-close="cancel">
      <el-form ref="elForm" :inline="true" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="模块名称" prop="moduleName">
          <el-input v-model="formData.moduleName" placeholder="请输入模块名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="模块等级" prop="moduleLevel">
          <el-select v-model="formData.moduleLevel" placeholder="请选择模块等级" clearable>
            <el-option v-if="dict.value != 'HOME'" v-for="dict in dict.type.sys_module_level" :key="dict.value"
              :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="一级行业" prop="firstIndustryId">
          <el-select v-model="formData.firstIndustryId" clearable :filter-method="searchHandle" filterable
            placeholder="请选择一级行业" v-el-select-loadmore="loadmore" @change="industryChange"
            @keyup.delete.native="deleteHandle">
            <el-option v-for="item in primaryOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="二级行业" prop="secondIndustryId" v-if="formData.moduleLevel == 'SECOND'">
          <el-select v-model="formData.secondIndustryId" placeholder="请选择二级行业" clearable>
            <el-option v-for="item in secondaryOption" :key="item.id" :label="item.industryName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="展示首页" prop="homeFlag" style="width: 100%;">
          <el-switch v-model="formData.homeFlag"></el-switch>
        </el-form-item>
        <el-form-item label="首页排序" prop="homeSort" v-if="formData.homeFlag">
          <el-input-number v-model="formData.homeSort" placeholder="排序" controls-position=right></el-input-number>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" placeholder="排序" controls-position=right></el-input-number>
        </el-form-item>
        <el-form-item label="自定义类型" prop="customType">
          <el-input v-model="formData.customType" placeholder="请输入自定义类型" clearable></el-input>
        </el-form-item>
        <el-form-item label="展示图标" prop="moduleIcon" style="width: 100%;">
          <el-upload class="avatar-uploader" :action="uploadFileUrl" :show-file-list="false" :headers="headers"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="formData.moduleIcon" :src="`${imgHost}` + formData.moduleIcon" class="avatar">
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
  listSettings,
  getSettings,
  addSettings,
  updateSettings,
  delSettings
} from "@/api/system/setting";

import {
  queryAllIndustryList,
  listIndustry
} from "@/api/system/industry";

import store from '@/store';
export default {
  name: 'Configuration',
  dicts: ['sys_modular_type', 'sys_module_level'],
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
        moduleAttribute: 'COMMUNITY',
        homeSort: 1,
        homeFlag: false,
        sort: '',
        firstIndustryId: '',
        secondIndustryId: '',
        moduleType: 'COMMUNITY_SERVICE',
        parentModuleId: '0'
      },
      rules: {

      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        moduleAttribute: 'COMMUNITY',
        parentModuleId: this.ModuleId
      },
      showSearch: true,
      showLocationOptions: [],
      modularTypeOptions: [],
      updateFlag: false,
      primaryOption: [],
      secondaryOption: [],
      codePage: {
        pageNum: 1,
        pageSize: 10,
      },
      arr: [],
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile/oss",
      headers: {
        Authorization: "Bearer " + store.getters.token
      },
    }
  },
  computed: {},
  watch: {},
  created() {
    this.ModuleId = this.$route.query.data
    this.formData.parentModuleId = this.ModuleId;
    this.queryParams.parentModuleId = this.ModuleId;
    this.getList()
    this.handleChange(1)
  },
  mounted() { },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      listSettings(this.queryParams).then(response => {
        this.modularList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.moduleConfigurationEntity.id)
      this.single = selection.length != 1
      this.multiple = !selection.length;
    },
    reset() {
      // this.$refs.elForm.resetFields()
      this.formData = {
        id: undefined,
        showLocation: undefined,
        moduleAttribute: 'COMMUNITY',
        homeSort: 1,
        homeFlag: false,
        sort: '',
        firstIndustryId: '',
        secondIndustryId: '',
        moduleType: 'COMMUNITY_SERVICE',
        parentModuleId: this.ModuleId
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.resetQuery();
      this.open = true;
      this.title = "新增服务配置";
      this.updateFlag = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      
      this.reset();
      const modularId = row.id || this.ids;
      this.formData = row;
      this.formData.homeFlag = row.homeFlag == '0' ? true : false;
      this.open = true;
      this.title = "修改模块配置";
      this.updateFlag = true;
      if (this.formData.moduleLevel == 'SECOND') {
        this.queryAllIndustryList(this.formData.firstIndustryId);
      }
    },
    /**
     * 提交
     */
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (valid) {
          this.formData.homeFlag = this.formData.homeFlag == true ? '0' : '1';
          if (this.updateFlag) {
            updateSettings(this.formData).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSettings(this.formData).then(response => {
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
      const modularIds = row.id || this.ids;
      this.$modal.confirm('是否确认删除该模块类型？').then(function () {
        return delSettings(modularIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    // 取消按钮
    cancel() {
      this.open = false;
      // this.reset();
      // this.$refs.elForm.resetFields();
    },

    /**
     * @param {Object} data
     */
    searchHandle(data) {
      this.arr = []
      let param = {
        industryName: data,
        industryParentId: '0',
        pageNum: 1,
        pageSize: this.codePage.pageSize,
      };
      this.searchIndustry(param)
    },
    /**
     * @param {Object} param
     *
     */
    searchIndustry(param) {

      listIndustry(param).then(res => {
        if (res.code == 200) {
          for (let index in res.rows) {
            this.arr.push({
              label: res.rows[index].industryName,
              value: res.rows[index].id,
            })
          }
          let obj = {};
          this.primaryOption = this.arr.reduce((cur, next) => {
            obj[next.value] ? "" : obj[next.value] = true && cur.push(next);
            return cur;
          }, [])
          this.pages = res.total
        } else {
          this.$message({
            message: res.message,
            type: "error",
          });
        }
      });
    },
    /**一级选择**/
    industryChange(val) {

      this.formData.firstIndustryId = val;
      if (this.formData.moduleLevel == '') {
        this.$modal.msgWarning("请先选择模块等级");
        this.formData.secondaryId = '';
        return;
      } else if (this.formData.moduleLevel == 'FIRST') {
        this.formData.homeFlag = true;
      } else if (this.formData.moduleLevel == 'SECOND') {
        this.queryAllIndustryList(val);

      }
    },
    //
    /**
     *
     * @param {Object} id
     * 查询二级
     *
     */
    queryAllIndustryList(id) {
      let para = {
        industryParentId: id
      }
      queryAllIndustryList(para).then(response => {
        this.secondaryOption = response.data;
      });
    },
    //加载更多，查询行业
    loadmore() {
      this.codePage.pageNum++
      this.handleChange(this.codePage.pageNum)
    },
    handleChange(data) {
      let param = {
        industryName: this.industryName,
        industryParentId: '0',
        pageNum: data,
        pageSize: this.codePage.pageSize,
      };
      this.searchIndustry(param)
    },
    /**
     * @param {Object} res
     * @param {Object} file
     * 图标上传成功
     */
    handleAvatarSuccess(res, file) {
      this.formData.moduleIcon = res.data.url;
      if (this.formData.moduleIcon != '') {
        this.$refs.elForm.clearValidate('moduleIcon') //清除图片校验文字
      }
      this.$forceUpdate()
    },
    /**
     * @param {Object} file
     * 图片上上传之前
     */
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
<style >
.el-form-item__content {
  width: 200px;
}

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

.moduleIcon {
  width: 80px;

  height: 80px;
}
</style>
