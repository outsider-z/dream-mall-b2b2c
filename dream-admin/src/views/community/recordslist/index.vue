<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="姓名" prop="inquiryUserName">
        <el-input v-model="queryParams.inquiryUserName" placeholder="请输入姓名" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="archivesList">
      <el-table-column label="姓名" prop="inquiryUserName" width="300" align="center" />
      <el-table-column label="手机号" prop="inquiryUserPhone" width="300" align="center" />
      <el-table-column label="性别" prop="sex" width="300" align="center" />
      <el-table-column label="出生日期" prop="birthday" width="300" align="center" />
      <el-table-column label="年龄" prop="age" width="300" align="center" />
      <el-table-column label="建档来源" prop="healthRecordType" width="300" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:shopper:edit']">监测记录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-table v-loading="loading" :data="recordList">
        <el-table-column label="监测时间" prop="createDate" width="300" align="center" />
        <el-table-column label="体重" prop="weight" width="300" align="center" />
        <el-table-column label="身高" prop="height" width="300" align="center" />
        <el-table-column label="心率" prop="heartRate" width="300" align="center" />
        <el-table-column label="血压" prop="bloodPressure" width="300" align="center" />
        <el-table-column label="视力" prop="eyesight" width="300" align="center" />
        <el-table-column label="睡眠" prop="sleep" width="300" align="center" />
        <el-table-column label="饮食" prop="biteSup" width="300" align="center" />
        <el-table-column label="运动量" prop="amountExercise" width="300" align="center" />
      </el-table>
      <pagination v-show="recordTotal>0" :total="recordTotal" :page.sync="recordParams.pageNum" :limit.sync="recordParams.pageSize"
        @pagination="getRecord" />
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
        form: {
        },
        // 表单校验
        rules: {},
        archivesList:[],
        recordList:[],
        recordParams:{
          pageNum: 1,
          pageSize: 10,
        },
        recordTotal:0,
      };
    },
    created() {
      // this.getList();
    },
    methods: {
      /** 查询菜单列表 */
      getList() {
        // this.loading = true;
        // listIndustry(this.queryParams).then(response => {
        //   this.archivesList = response.rows
        //   this.total = response.total;
        //   this.loading = false;
        // });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
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

      /** 展开/折叠操作 */
      toggleExpandAll() {
        this.refreshTable = false;
        this.isExpandAll = !this.isExpandAll;
        this.$nextTick(() => {
          this.refreshTable = true;
        });
      },

      //监测记录
      getRecord(){

      },
      handleUpdate(row){
        this.$router.push({
          path: '/community/monitoringRecords',
          query: row,
        })
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
