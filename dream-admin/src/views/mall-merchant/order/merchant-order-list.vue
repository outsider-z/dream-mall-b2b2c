<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <!-- <el-form-item prop="dateSearchType">
        <el-radio-group v-model="queryParams.dateSearchType" size="medium">
          <el-radio v-for="(item, index) in dateSearchTypeOptions" :key="index" :label="item.value"
                    :disabled="item.disabled">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item prop="daterange" label="下单时间">
        <el-date-picker 
          v-model="daterange" 
          type="daterange" 
          start-placeholder="开始日期" 
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd" 
          @change="timeChange">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          >导出</el-button>
      </el-form-item>


    </el-form>
    <el-row :gutter="15">
      <div style="margin-bottom: 10px;">
        <el-radio-group v-model="queryParams.orderStatus" size="small" @change="getList">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="WAITING_PAY">待付款</el-radio-button>
          <el-radio-button label="WAITING_DELIVERY">待发货</el-radio-button>
          <el-radio-button label="WAITING_RECEIPT">待收货</el-radio-button>
          <el-radio-button label="WAITING_COMMENT">待评价</el-radio-button>
          <el-radio-button label="TRANSACTION_CLOSED">已取消</el-radio-button>
          <el-radio-button label="TRANSACTION_COMPLETED ">已完成</el-radio-button>
          <el-radio-button label="AFTER_SALES ">售后中</el-radio-button>
        </el-radio-group>
      </div>
    </el-row>
    <el-table v-loading="loading" :data="shopperList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="下单时间" align="center" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" prop="orderNo" width="300" align="center">
        <template slot-scope="scope">
          <el-tag :class="scope.row.orderType == '1' ? 'success' : (scope.row.orderType == '2' ? 'warning' : '')">
            {{ scope.row.orderType == '0' ? '普通' : (scope.row.orderType == '1' ? '秒杀' : (scope.row.orderType == '2' ? '团购'
              : '积分')) }}
          </el-tag>
          <span class="ml10 receiptsNumStyle" @click="handleDetail(scope.row)">{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商家名称" prop="merchantName" width="200" align="center" />
      <el-table-column label="商品数量" prop="productUnit" width="200" align="center" />
      <el-table-column label="商品金额" prop="totalAmount" width="200" align="center" />
      <el-table-column label="商品类型" prop="productType" width="100" align="center">
        <template slot-scope="scope">
          <span style="color:#67C23A" v-if="scope.row.productType == '1'">实物商品</span>
          <span style="color:#F56C6C" v-if="scope.row.productType == '2'">虚拟商品</span>
          <span style="color:#E6A23C" v-if="scope.row.productType == '3'">核销商品</span>
        </template>
      </el-table-column>
      <el-table-column label="运费" prop="freightAmount" width="200" align="center" />
      <el-table-column label="实付金额" prop="payAmount" width="200" align="center" />
      <el-table-column label="订单状态" prop="orderStatus" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderStatus == 'WAITING_PAY' ? '待支付' : (scope.row.orderStatus == 'WAITING_DELIVERY' ? '待发货' :
            (scope.row.orderStatus == 'WAITING_RECEIPT' ? '待收货' : (scope.row.orderStatus == 'WAITING_COMMENT' ? '待评价' :
              (scope.row.orderStatus == 'TRANSACTION_CLOSED' ? '已取消' : (scope.row.orderStatus == 'TRANSACTION_COMPLETED' ?
                '已完成' : '售后中'))))) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="发票状态" prop="replayContent" width="200" align="center" /> -->
      <el-table-column label="结算状态" prop="replayContent" width="200" align="center" />
      <el-table-column label="收货类型" prop="deliveryType" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.deliveryType == '1' ? '快递配送' : (scope.row.deliveryType == '2' ? '同城配送' : '门店自提') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货人" prop="deliveryName" width="200" align="center" />
      <el-table-column label="电话号码" prop="deliveryContactNo" width="200" align="center" />
      <el-table-column label="收货地址" prop="deliveryStreet" width="200" align="center" />
      <el-table-column label="物流公司(快递)" prop="courierName" width="200" align="center" />
      <el-table-column label="物流单号(快递)" prop="courierNo" width="200" align="center" />
      <el-table-column label="操作" fixed="right" align="center" width="360" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" style="color: #67C23A;" type="text" icon="el-icon-truck"
            @click="handleDeliver(scope.row)" v-if="scope.row.orderStatus == 'WAITING_DELIVERY'"
            v-hasPermi="['merchant:order:shipped']">发货</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" style="color: #E6A23C;" @click="handleUpdate(scope.row)"
            v-if="scope.row.orderStatus == 'WAITING_RECEIPT'" v-hasPermi="['system:order:Logistic']">物流信息</el-button>
          <el-button v-if="scope.row.productType == '1'" size="mini" type="text" style="color:#F56C6C"
            icon="el-icon-edit-outline" @click="handleReceipt(scope.row)"
            v-hasPermi="['system:order:edit']">收货地址</el-button>
          <el-button size="mini" type="text" icon="el-icon-document-add" @click="handleMemo()"
            v-hasPermi="['system:order:edit']">备注</el-button>
          <el-button v-if="scope.row.productType == '3' && scope.row.orderStatus == 'PENDING_EXPENSES'" size="mini"
            style="color: #E6A23C;" type="text" icon="el-icon-view" @click="handleCheck(scope.row)">核销</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="物流公司" prop="courierName">
          <el-select v-model="formData.courierName" placeholder="物流公司" clearable style="width: 100%">
            <el-option v-for="item in logisticsCompanyOptions" :key="item.id" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="courierNo">
          <el-input v-model="formData.courierNo" placeholder="请输入物流单号" clearable :style="{ width: '100%' }"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="open = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="receiptOpen">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="订单号" prop="orderNo">
          {{ formData.orderNo }}
        </el-form-item>
        <el-form-item label="所在地区" prop="region">
          <el-input v-model="region" @focus="OpenMap()" suffix-icon='el-icon-map-location' :style="{ width: '100%' }">
          </el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="deliveryStreet">
          <el-input v-model="formData.deliveryStreet" placeholder="请输入详细地址" clearable :style="{ width: '100%' }">
          </el-input>
        </el-form-item>
        <el-form-item label="收货人" prop="deliveryName">
          <el-input v-model="formData.deliveryName" placeholder="请输入收货人" clearable :style="{ width: '100%' }"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="deliveryContactNo">
          <el-input v-model="formData.deliveryContactNo" placeholder="请输入联系电话" clearable :style="{ width: '100%' }">
          </el-input>
        </el-form-item>
        <el-form-item label="邮编" prop="deliveryZipcode">
          <el-input v-model="formData.deliveryZipcode" placeholder="请输入邮编" clearable :style="{ width: '100%' }">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="receiptOpen = false">取消</el-button>
        <el-button type="primary" @click="receiptForm">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="memoOpen">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="备注" prop="memo">
          <el-input type="textarea" v-model="formData.memo" clearable :style="{ width: '100%' }"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="memoOpen = false">取消</el-button>
        <el-button type="primary" @click="receiptForm">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="deliverOpen">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="物流公司" prop="courierName">
          <el-select v-model="formData.courierName" placeholder="物流公司" clearable style="width: 100%">
            <el-option v-for="item in logisticsCompanyOptions" :key="item.id" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="courierNo">
          <el-input v-model="formData.courierNo" placeholder="请输入物流单号" clearable :style="{ width: '100%' }"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="deliverOpen = false">取消</el-button>
        <el-button type="primary" @click="deliverForm">确定</el-button>
      </div>
    </el-dialog>
    <gaoDeMap @updateLocation="updateLocation" ref="gaoDeMap"></gaoDeMap>
  </div>
</template>
<script>
import gaoDeMap from "@/components/gaodeMap/index";
import {
  listOrder,
  getProduct,
  adminModifyLogisticInfo,
  adminModifyDeliveryAddress,
  merchantOrderShipped,
  merchantVerificationOrder
} from "@/api/mall-merchant/order";
import {
  getAllLogisticsCompany,
} from "@/api/system/template";

import store from "@/store";
export default {
  name: 'Merchant-order-list',
  inheritAttrs: false,
  components: {
    gaoDeMap,

  },
  props: [],
  data() {
    var address = (rule, value, callback) => {
      // 地址验证
      if (this.formData.merchantAddress == undefined) {
        callback(new Error("请选择订单地址"));
      } else {
        callback();
      }
    }
    return {
      shopperList: [],
      open: false,
      receiptOpen: false,
      title: '',
      total: 0,
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      formData: {},
      logisticsCompanyOptions: [],
      rules: {
        courierName: [{
          required: true,
          message: '请选择物流公司',
          trigger: 'blur'
        }],
        courierNo: [{
          required: true,
          message: '请输入物流编号',
          trigger: 'blur'
        }],
        deliveryName: [{
          required: true,
          message: '请输入收货人姓名',
          trigger: 'blur'
        }],
        deliveryZipcode: [{
          required: true,
          message: '请输入邮编',
          trigger: 'blur'
        }],
        deliveryContactNo: [{
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
        startTime:'',
        stopTime:''
      },
      daterange: [],
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
      radio2: '全部',
      region: '',
      memoOpen: false,
      deliverOpen: false,
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getList()
  },
  mounted() { },
  methods: {
    /** 核销操作 */
    handleCheck(row) {
      this.$prompt('请输入核销码', "订单核销", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
      }).then(({ value }) => {
        merchantVerificationOrder({
          orderId: row.id,
          verificationCode: value
        }).then(response => {
          row.orderStatus = "WAITING_COMMENT";

          this.$modal.msgSuccess("核销成功");
        });
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      if (this.queryParams.startTime == '' || this.queryParams.stopTime == '') {
        this.$modal.msgSuccess("请输入导出条件");
        return
      }
      this.download('order/merchant/order/export', {
        ...this.queryParams
      }, `orderInfo_${new Date().getTime()}.xlsx`)
    },

    /** 查询列表 */
    getList() {
      this.loading = true;
      this.queryParams.merchantId = store.getters.merchantId;
      listOrder(this.queryParams).then(response => {
        this.shopperList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      getAllLogisticsCompany().then(res => {
        this.logisticsCompanyOptions = res.data
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    reset() {
      this.formData = {},
        this.resetForm("formData");
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
      this.daterange = [];
      this.queryParams={
          pageNum: 1,
          pageSize: 10,
          merchantId:'',
          startTime:'',
          stopTime:''
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加订单";
    },
    /** 修改物流操作 */
    handleUpdate(row) {
      this.reset();
      const orderId = row.id || this.ids
      getProduct(orderId).then(response => {
        this.formData = response.data;
        this.open = true;
        this.title = "修改物流信息";
      });
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (valid) {
          if (this.formData.id != undefined) {
            let para = {
              orderId: this.formData.id,
              courierName: this.formData.courierName,
              courierNo: this.formData.courierNo
            }
            adminModifyLogisticInfo(para).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          }
        }
      })
    },
    /** 修改收货地址操作 */
    handleReceipt(row) {
      this.reset();
      const orderId = row.id || this.ids
      getProduct(orderId).then(response => {
        this.formData = response.data;
        this.region = response.data.deliveryProvince + response.data.deliveryCity + response.data.deliveryArea
        this.receiptOpen = true;
        this.title = "修改收货地址";
      });
    },
    receiptForm() {
      this.$refs['elForm'].validate(valid => {
        if (valid) {
          if (this.formData.id != undefined) {
            let paras = {
              orderId: this.formData.id,
              merchantId: store.getters.getMerchantId,
              deliveryProvince: this.formData.deliveryProvince,
              deliveryCity: this.formData.deliveryCity,
              deliveryArea: this.formData.deliveryArea,
              deliveryStreet: this.formData.deliveryStreet,
              deliveryContactNo: this.formData.deliveryContactNo,
              deliveryName: this.formData.deliveryName,
              deliveryZipcode: this.formData.deliveryZipcode,
            }
            adminModifyDeliveryAddress(paras).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          }
        }
      })
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
      this.region = Addr.province + Addr.city + Addr.district;
      this.formData.deliveryStreet = Addr.orgAddr;
      this.formData.deliveryProvince = Addr.province;
      this.formData.deliveryCity = Addr.city;
      this.formData.deliveryArea = Addr.district;
    },
    timeChange(val) {
      // this.queryParams.dateSearchType = 4;
      this.queryParams.startTime = val[0];
      this.queryParams.stopTime = val[1];
    },
    // 默认
    handleDefault(row) {
      let text = row.defaultFlag === "0" ? "默认" : "关闭";
      this.$modal.confirm('确认要' + text + '"' + row.merchantName + '"该模板吗？').then(function () {
        return updateDelivery(row);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function () {
        row.defaultFlag = row.defaultFlag === "0" ? "1" : "0";
      });
    },
    handleDetail(row) {
      this.$router.push({
        path: '/mall-merchant/orderDetails',
        query: row
      })
    },
    handleMemo() {
      this.reset();
      this.title = "备注";
      this.memoOpen = true
    },
    handleDeliver(row) {
      this.reset();
      const orderId = row.id || this.ids
      getProduct(orderId).then(response => {
        this.formData = response.data;
        this.deliverOpen = true;
        this.title = "填写物流信息";
      });
    },
    deliverForm() {
      this.$refs['elForm'].validate(valid => {
        if (valid) {
          if (this.formData.id != undefined) {
            let para = {
              orderId: this.formData.id,
              courierName: this.formData.courierName,
              courierNo: this.formData.courierNo
            }
            merchantOrderShipped(para).then(response => {
              this.$modal.msgSuccess("发货成功");
              this.deliverOpen = false;
              this.getList();
            });
          }
        }
      })
    },
  }
}
</script>
<style scoped>
.receiptsNumStyle {
  cursor: pointer;
  color: #1890ff;
}
</style>
