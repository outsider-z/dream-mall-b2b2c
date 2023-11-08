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

    <el-table v-loading="loading" :data="shopperList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="申请时间" align="center" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="售后订单" prop="saleNo" width="250" align="center" />
      <el-table-column label="订单号" prop="orderNo" width="200" align="center" />
      <el-table-column label="售后类型" prop="afterSaleType" width="200" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.afterSaleType == 'ONLY_REFUND' ? '仅退款' : '退款退货'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="售后状态" prop="status" width="200" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.status == 'WAITING_MERCHANT_CONFIRM' ? '待商家同意' : (scope.row.status == 'MERCHANT_REJECT' ? '拒绝售后' : (scope.row.status == 'WAITING_DELIVERY' ? '待发货' : (scope.row.status == 'WAITING_RECEIPT' ? '商家待收货' : (scope.row.status == 'REFUND_CLOSED' ? '取消售后' : '交易关闭'))) )}}</span>
        </template>
      </el-table-column>
      <el-table-column label="退货物流" prop="courierName" width="200" align="center" />
      <el-table-column label="物流单号" prop="courierNo" width="200" align="center" />
      <el-table-column label="会员信息" prop="receiveMan" width="200" align="center" />
      <el-table-column label="商家名称" prop="merchantName" width="200" align="center" />
      <el-table-column label="退款金额" prop="afterSaleAmount" width="200" align="center" />
      <el-table-column label="退货原因" prop="refundReason" width="200" align="center" />
      <el-table-column label="操作" fixed="right" width="200" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-check" @click="handleUpdate(scope.row)" :disabled="scope.row.status == 'WAITING_MERCHANT_CONFIRM' ? false : true"
            v-hasPermi="['system:shopper:edit']">同意</el-button>
          <el-button size="mini"  :class="scope.row.status == 'WAITING_MERCHANT_CONFIRM' ? 'redColor' : 'greyColor'" type="text" icon="el-icon-close" :disabled="scope.row.status == 'WAITING_MERCHANT_CONFIRM' ? false : true"
            @click="handleRefuse(scope.row)" v-hasPermi="['system:shopper:edit']">拒绝</el-button>
            <el-button size="mini" :class="scope.row.status == 'WAITING_RECEIPT' ? 'greenColor' : 'greyColor'" type="text" icon="el-icon-finished" :disabled="scope.row.status == 'WAITING_RECEIPT' ? false : true"
              @click="handleReceipt(scope.row)" v-hasPermi="['system:shopper:edit']">确认收货</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="会员名称" prop="communalName">
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
    addShopper,
    updateShopper,
    delShopper
  } from "@/api/system/shopper";
  import {
    refundOrderList,
    merchantAcceptAfterSaleOrder,
    merchantConfirmRefundOrder
  } from "@/api/order/order";

  export default {
    name: 'Refund',
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
          orderAttribute:'MALL'
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
        refundOrderList(this.queryParams).then(response => {
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
        // 角色状态修改
        this.$modal.confirm('确定同意该退货申请吗？').then(function() {
          let para = {
            acceptType: 'AGREED',
            saleOrderId: row.id
          }
          return merchantAcceptAfterSaleOrder(para);
        }).then(() => {
          this.$modal.msgSuccess( "操作成功");
          row.status='REFUND_COMPLETED';
        }).catch(function() {});
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
      /**拒绝操作**/
      handleRefuse(row) {
        this.$prompt('请输入拒绝原因', "拒绝", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: 'warning'
        }).then(({
          value
        }) => {
          let para = {
            acceptType:'REJECT',
            rejectReason:value,
            saleOrderId:row.id
          }
          merchantAcceptAfterSaleOrder(para).then(response => {
            this.$modal.msgSuccess("拒绝成功");
            this.getList()
          });
        }).catch(() => {});
      },
      /**确认收货**/
      handleReceipt(row){
        // 角色状态修改
        this.$modal.confirm('确认收货吗？').then(function() {
          let para = {
            saleOrderId: row.id
          }
          return merchantConfirmRefundOrder(para);
        }).then(() => {
          this.$modal.msgSuccess("操作成功");
          this.getList()
        }).catch(function() {});
      },
    }
  }
</script>
<style scoped>
  .redColor{
    color:#F56C6C
  }
  .greenColor{
    color:#67C23A
  }
  .greyColor{
    color:#C0C4CC
  }
</style>
