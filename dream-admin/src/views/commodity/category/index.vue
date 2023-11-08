<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="类目名称" prop="cateName">
        <el-input v-model="queryParams.cateName" placeholder="请输入类目名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:cate:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-if="refreshTable" v-loading="loading" :data="menuList" row-key="id" :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}" :border="true" table-layout="auto">
      <el-table-column prop="cateName" label="类目名称" :show-overflow-tooltip="true" ></el-table-column>
      <el-table-column prop="catePicUrl" label="类目封面"  align="center">
        <template slot-scope="scope">
          <el-popover placement="right"  trigger="hover">
            <img :src="`${imgHost}` + scope.row.catePicUrl" alt="" style="width: 150px;height: 150px">
            <img slot="reference" :src="`${imgHost}` + scope.row.catePicUrl" style="max-height: 50px;max-width: 50px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" sortable  align="center"></el-table-column>
      <el-table-column prop="displayedHomeFlag" label="首页显示" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.displayedHomeFlag" active-value="0" inactive-value="1"
            @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" >
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:cate:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)"
            v-hasPermi="['system:cate:add']" v-if="scope.row.parentCateId==='0'">新增</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:cate:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
<pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body :before-close="cancel">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="类目名称" prop="cateName">
              <el-input v-model="form.cateName" placeholder="请输入类目名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="类目封面" prop="catePicUrl">
              <el-upload class="avatar-uploader" :action="uploadFileUrl" :show-file-list="false" :headers="headers"
                :on-success="handleAvatarSuccess" :before-upload="urlBeforeUpload">
                <img v-if="form.catePicUrl" :src="`${imgHost}` + form.catePicUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首页显示" prop="displayedHomeFlag" required>
              <el-switch v-model="form.displayedHomeFlag" :active-value='0' :inactive-value='1'></el-switch>
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
    listCate,
    getCate,
    delCate,
    addCate,
    updateCate
  } from "@/api/product/category";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import IconSelect from "@/components/IconSelect";
  import store from '@/store'

  export default {
    name: "Category",
    dicts: ['sys_show_hide', 'sys_normal_disable'],
    components: {
      Treeselect,
      IconSelect
    },
    data() {
      var valiIcon = (rule, value, callback) => {
        // 图片验证
        if (this.form.catePicUrl == '') {
          callback(new Error("请上传类目封面"));
        } else {
          callback();
        }
      }
      return {
        headers: {
          Authorization: "Bearer " + store.getters.token
        },
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile/oss",
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 菜单表格树数据
        menuList: [],
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
          pageSize: 1000,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          cateName: [{
            required: true,
            message: "类目名称不能为空",
            trigger: "blur"
          }],
          sort: [{
            required: true,
            message: "类目顺序不能为空",
            trigger: "blur"
          }],
          path: [{
            required: true,
            message: "路由地址不能为空",
            trigger: "blur"
          }],
          catePicUrl: [{
            required: true,
            validator: valiIcon
          }],
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询菜单列表 */
      getList() {
        this.loading = true;
        listCate(this.queryParams).then(response => {
          this.menuList = this.handleTree(response.rows, 'id', 'parentCateId');
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
        this.$refs.form.resetFields()
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          parentCateId: 0,
          cateName: undefined,
          sort: undefined,
          catePicUrl: '',
          displayedHomeFlag: 1,
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
          this.form.parentCateId = row.id;
        } else {
          this.form.parentCateId = 0;
        }
        this.open = true;
        this.title = "添加商品类目";
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
        getCate(row.id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改商品类目";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateCate(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addCate(this.form).then(response => {
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
        this.$modal.confirm('是否确认删除类目名称为"' + row.cateName + '"的数据项？').then(function() {
          return delCate(row.id);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      urlBeforeUpload(file) {
        let isAccept = new RegExp('image/*').test(file.type)
        let isRightSize = file.size / 1024 / 1024 < 20
        if (!isAccept) {
          this.$message.error('应该选择image/*类型的文件')
          return isAccept
        } else if (!isRightSize) {
          this.$message.error('文件大小超过 20MB')
          return isRightSize
        }
      },
      handleAvatarSuccess(res, file) {
        this.form.catePicUrl = res.data.url;
        if (this.form.catePicUrl != '') {
          this.$refs.form.clearValidate('catePicUrl') //清除图片校验文字
        }
      },
      // 状态修改
      handleStatusChange(row) {
        let text = row.displayedHomeFlag === "0" ? "显示" : "停用";
        this.$modal.confirm('确认要"' + text + '""' + row.cateName + '"类目吗？').then(function() {
          return updateCate(row);
        }).then(() => {
          this.$modal.msgSuccess(text + "成功");
        }).catch(function() {
          row.displayedHomeFlag = row.displayedHomeFlag === "0" ? "1" : "0";
        });
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
