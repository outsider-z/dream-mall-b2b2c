<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item>
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入活动名称" clearable></el-input>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:brand:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:brand:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:brand:add']">查看报名商家</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="activityList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商家名称"  width="100" align="center" />
      <el-table-column label="活动名称"  width="200" align="center">
        <template slot-scope="scope">
          <span class="receiptsNumStyle" @click="receiptsNumClick(scope.row)">{{scope.row.templateName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动海报"  width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.deliveryFromDetail}}
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="200" align="center">
        <template slot-scope="scope">
          <sapn>{{scope.row.deliveryConditionAmount +'km'}}</sapn>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="200" align="center">
        <template slot-scope="scope">
          {{scope.row.firstDistance}}
        </template>
      </el-table-column>
      <el-table-column label="计划活动商品数量"  width="200" align="center">
        <template slot-scope="scope">
          {{scope.row.deliveryFromDetail}}
        </template>
      </el-table-column>
      <el-table-column label="计划商家数量"  width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.deliveryFromDetail}}
        </template>
      </el-table-column>
      <el-table-column label="是否启动"  width="200" align="center">
        <template slot-scope="scope">
          {{scope.row.deliveryFromDetail}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="200" class-name="small-padding fixed-width">
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
      <!-- 活动弹窗 -->
    <el-dialog :visible.sync="open" :title="title" :before-close="cancel" width="45%">
      <el-row :gutter="24">
        <el-form ref="elForm" :inline="true" :model="formData" :rules="rules" size="medium" label-width="100px">
          <el-form-item label="活动名称" prop="couponName">
            <el-input v-model="formData.couponName" placeholder="请输入优惠券名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="商家数量" prop="couponName">
            <el-input v-model="formData.couponName" placeholder="活动计划商家数量" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="couponName">
            <el-input v-model="formData.couponName" placeholder="活动报名商家商品数量" clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="日期范围" prop="timeData" style="width: 100%;">
            <el-date-picker type="daterange" v-model="timeData" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              start-placeholder="开始日期" end-placeholder="结束日期" range-separator="至" clearable>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="活动海报" prop="imageUrl">
            <el-upload class="avatar-uploader" :action="uploadFileUrl" :show-file-list="false" :headers="headers"
              :on-success="handleAvatarSuccess" :before-upload="urlBeforeUpload">
              <img v-if="formData.imageUrl" :src="`${imgHost}` + formData.imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">请上传700X300的jpg/png/jpeg文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="活动描述" prop="memo" style="width:100%;">
            <el-input v-model="formData.memo" type="textarea" placeholder="报名后消息发送商家"
              :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import store from '@/store'
  export default {
    data() {
      return {
        headers: {
          Authorization: "Bearer " + store.getters.token
        },
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile/oss",
        formData: {

        },
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: ''
        },
        rules: {

        },
        codePage: {
          pageNum: 1,
          pageSize: 10,
        },
        pages: '',
        arr: [],
        showSearch: true,
        open: false,
        title: '',
        total: 0,
        loading: false,
        activityList:[]
      }
    },
    methods: {
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
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加活动";
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.freightTemplateEntity.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      // 弹窗取消按钮
      cancel() {
        this.open = false;
        this.reset();
        this.$refs.elForm.resetFields()
      },
      reset(){

      },
      getList(){

      },
    },
  }
</script>

<style>
</style>
