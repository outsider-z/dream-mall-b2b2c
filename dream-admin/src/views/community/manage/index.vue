<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="社区名称" prop="communalName">
        <el-input v-model="queryParams.communalName" placeholder="请输入社区名称" clearable :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phoneNo">
        <el-input v-model="queryParams.phoneNo" placeholder="请输入手机号" clearable style="width: 240px"
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
          v-hasPermi="['system:community:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:community:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:community:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="shopperList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="社区名称" prop="communalName" width="300" align="center" />
      <el-table-column label="社区地址" prop="communalAddress" width="300" align="center" show-overflow-tooltip />
      <el-table-column label="联系人" prop="contactName" width="300" align="center" />
      <el-table-column label="联系电话" prop="mobileNo" width="300" align="center" />
      <el-table-column label="备注" prop="memo" width="300" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:community:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:community:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <el-dialog :title="title" :visible.sync="open" :before-close="cancel">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="社区名称" prop="communalName">
          <el-input v-model="formData.communalName" placeholder="请输入社区名称" clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="社区地址" prop="communalAddress">
          <el-input v-model="formData.communalAddress" @focus="OpenMap()" suffix-icon='el-icon-map-location' clearable
            :style="{width: '100%'}"></el-input>
        </el-form-item>
        <!-- <el-form-item label="详细地址" prop="communalAddress">
          <el-input v-model="formData.communalAddress" :autosize="{minRows: 4, maxRows: 4}" type="textarea" placeholder="请输入详细地址" clearable :style="{width: '100%'}"></el-input>
        </el-form-item> -->
        <el-form-item label="联系人" prop="contactName">
          <el-input v-model="formData.contactName" placeholder="请输入联系人" :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobileNo">
          <el-input v-model="formData.mobileNo" placeholder="请输入联系电话" :maxlength="11" show-word-limit clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="formData.memo" :autosize="{minRows: 4, maxRows: 4}" type="textarea" placeholder="请输入备注" clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
    <gaoDeMap @updateLocation="updateLocation" ref="gaoDeMap"></gaoDeMap>
  </div>
</template>
<script>
   import gaoDeMap from "@/components/gaodeMap/index";
  import {
    listCommunity,
    getCommunity,
    addCommunity,
    updateCommunity,
    delCommunity
  } from "@/api/system/community";
  export default {
    name: 'Manage',
    inheritAttrs: false,
    components: {gaoDeMap},
    props: [],
    data() {
      var address = (rule, value, callback) => {
        // 地址验证
        if (this.formData.communalAddress == undefined) {
          callback(new Error("请选择社区地址"));
        } else {
          callback();
        }
      }
      return {
        shopperList: [],
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
          province:'',
          city:'',
          district:'',
          communalName: '',
          contactName: '',
          mobileNo: '',
          longitude:'',
          latitude:'',
          communalAddress:'',
        },
        rules: {
          communalName: [{
            required: true,
            message: '请选择社区名称',
            trigger: 'blur'
          }],
          contactName: [{
            required: true,
            message: '请输入联系人',
            trigger: 'blur'
          }],
          mobileNo: [{
            required: true,
            message: '请输入联系电话',
            trigger: 'blur'
          }, {
            pattern: /^1(3|4|5|7|8|9)\d{9}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }],
          communalAddress: [{
            required: true,
            validator: address
          }],
        },
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        showSearch: true,
        swiperOptions: [],
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
        listCommunity(this.queryParams).then(response => {
          this.shopperList = response.rows;
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
            province:'',
            city:'',
            district:'',
            communalName: '',
            contactName: '',
            mobileNo: '',
            longitude:'',
            latitude:'',
            communalAddress:'',
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
        this.title = "添加社区";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const swiperId = row.id || this.ids
        getCommunity(swiperId).then(response => {
          this.formData = response.data;
          this.open = true;
          this.title = "修改社区";
        });
      },
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            if (this.formData.id != undefined) {
              updateCommunity(this.formData).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addCommunity(this.formData).then(response => {
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
        const swiperIds = row.id || this.ids;
        this.$modal.confirm('是否确认删除该社区？').then(function() {
          return delCommunity(swiperIds);
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
        this.$refs.elForm.resetFields()
      },
      //打开地图
      OpenMap() {
        this.$refs.gaoDeMap.open();
      },
      updateLocation(Addr) {
        console.log(Addr)
        this.formData.province =  Addr.province
        this.formData.city =  Addr.city
        this.formData.district =  Addr.district
        this.formData.communalAddress = Addr.orgAddr
        this.formData.longitude = Addr.lon;
        this.formData.latitude = Addr.lat;
      },
    }
  }
</script>
<style>
</style>
