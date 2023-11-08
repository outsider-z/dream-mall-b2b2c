<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item prop="dateSearchType">
        <el-radio-group v-model="queryParams.dateSearchType" size="medium">
          <el-radio v-for="(item, index) in dateSearchTypeOptions" :key="index" :label="item.value"
            :disabled="item.disabled">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="customsj">
        <el-date-picker v-model="customsj" type="daterange" @change="timeChange" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="姓名" prop="searchName">
        <el-input v-model="queryParams.searchName" placeholder="姓名" clearable :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item prop="searchWithdrawStatus">
        <el-select v-model="queryParams.searchWithdrawStatus" placeholder="请选择提现状态" clearable :style="{width: '100%'}">
          <el-option v-for="(item, index) in searchWithdrawStatusOptions" :key="index" :label="item.label"
            :value="item.value" :disabled="item.disabled"></el-option>
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
          v-hasPermi="['system:shopper:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:shopper:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:shopper:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="shopperList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="日期" align="center" prop="withdrawTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.withdrawTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提现会员" prop="userName" width="200" align="center" />
      <el-table-column label="申请金额" prop="withdrawAmount" width="200" align="center" />
      <el-table-column label="综合税费" prop="taxAmount" width="200" align="center" />
      <el-table-column label="实付金额" prop="paymentAmount" width="200" align="center" />
      <el-table-column label="账户类型" prop="paymentMethodStr" width="200" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.paymentMethodStr == 'BANK' ? '银行账户' : (scope.row.paymentMethodStr == 'ALIPAY' ? '支付宝' : '微信') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提现账户" prop="accountNo" width="200" align="center" />
      <el-table-column label="提现银行" prop="bankName" width="200" align="center" />
      <el-table-column label="会员编号" prop="userId" width="200" align="center" />
      <el-table-column label="审核状态" prop="withdrawStatus" width="200" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.withdrawStatus == '0' ? '待审核' : (scope.row.withdrawStatus == '2' ? '不通过' : '已通过') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="打款状态" prop="withdrawStatus" width="200" align="center">
        <template slot-scope="scope">
            <span>{{scope.row.withdrawStatus == '3' ? '提现成功' : (scope.row.withdrawStatus == '4' ? '提现失败' : (scope.row.withdrawStatus == '2' ? '已拒绝' : '等待打款' ) ) }}</span>
          </template>
        </el-table-column>
      <el-table-column label="备注" prop="memo" width="300" align="center" />
      <el-table-column label="操作" width="200" fixed="right" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:shopper:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:shopper:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="社区名称" prop="communalName">
          <el-input v-model="formData.communalName" placeholder="请输入社区名称" clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="社区地址" prop="merchantAddress">
          <el-input v-model="formData.merchantAddress" @focus="OpenMap()" suffix-icon='el-icon-map-location' clearable
            :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="communalAddress">
          <el-input v-model="formData.communalAddress" :autosize="{minRows: 4, maxRows: 4}" type="textarea"
            placeholder="请输入详细地址" clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contactName">
          <el-input v-model="formData.contactName" placeholder="请输入联系人" :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobileNo">
          <el-input v-model="formData.mobileNo" placeholder="请输入联系电话" :maxlength="11" show-word-limit clearable
            :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="formData.memo" :autosize="{minRows: 4, maxRows: 4}" type="textarea" placeholder="请输入备注"
            clearable :style="{width: '100%'}"></el-input>
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
    listShopper,
    getShopper,
    addShopper,
    updateShopper,
    delShopper
  } from "@/api/system/shopper";
  export default {
    name: 'Manage',
    inheritAttrs: false,
    components: {
      gaoDeMap
    },
    props: [],
    data() {
      var address = (rule, value, callback) => {
        // 地址验证
        if (this.formData.merchantAddress == undefined) {
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
          communalName: '',
          contactName: '',
          mobileNo: '',
          merchantAddress: '',
          deliveryFromLongitude: '',
          deliveryFromLatitude: '',
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
          merchantAddress: [{
            required: true,
            validator: address
          }],
        },
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          dateSearchType: 1,
          searchName: '',
          searchWithdrawStatus: '',
        },
        customsj: [],
        showSearch: true,
        swiperOptions: [],
        dateSearchTypeOptions: [{
          "label": "昨日",
          "value": 1
        }, {
          "label": "今日",
          "value": 2
        }, {
          "label": "最近七日",
          "value": 3
        }, {
          "label": "自定义时间段",
          "value": 4,
          'disabled': true
        }],
        searchWithdrawStatusOptions: [{
          "label": "全部",
          "value": 1
        }, {
          "label": "未处理",
          "value": 2
        }],
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
        listShopper(this.queryParams).then(response => {
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
            communalName: '',
            contactName: '',
            mobileNo: '',
            merchantAddress: '',
            deliveryFromLongitude: '',
            deliveryFromLatitude: '',
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
        getShopper(swiperId).then(response => {
          this.formData = response.data;
          this.open = true;
          this.title = "修改社区";
        });
      },
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            if (this.formData.id != undefined) {
              updateShopper(this.formData).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addShopper(this.formData).then(response => {
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
          return delShopper(swiperIds);
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
      //打开地图
      OpenMap() {
        this.$refs.gaoDeMap.open();
      },
      updateLocation(Addr) {
        this.formData.merchantAddress = Addr.orgAddr
        this.formData.deliveryFromLongitude = Addr.lng;
        this.formData.deliveryFromLatitude = Addr.lat;
      },
      timeChange(val) {
        this.queryParams.dateSearchType = 0
      },
    }
  }
</script>
<style>
</style>
