<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item prop="dateRange" label="时间">
            <el-date-picker 
                v-model="dateRange" 
                style="width: 240px" 
                value-format="yyyy-MM-dd" 
                type="daterange"
                range-separator="-" 
                start-placeholder="开始日期" 
                end-placeholder="结束日期">
            </el-date-picker>
        </el-form-item>
      <el-form-item prop="orderMethod" label="订单类型">
        <el-select v-model="queryParams.orderMethod" placeholder="订单类型" clearable :style="{width: '100%'}">
          <el-option v-for="(item, index) in orderMethodOptions" :key="index" :label="item.label"
            :value="item.value" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['system:role:export']">导出</el-button>
      </el-form-item>
    </el-form>
    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:shopper:edit']">配货单</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->
    <el-row :gutter="15">
      <div style="margin-bottom: 10px;">
        <el-radio-group v-model="queryParams.orderStatus" size="small" @change="changOrderStatus">
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
    <el-table v-loading="loading" :data="shopperList" @selection-change="handleSelectionChange" :border="true">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="下单时间" align="center" show-overflow-tooltip prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" fixed="left" show-overflow-tooltip prop="orderNo" width="250" align="center">
        <template slot-scope="scope">
          <el-tag :class="scope.row.orderType == '1' ? 'success' : (scope.row.orderType == '2' ? 'warning' : '')">
            {{scope.row.orderType == 'GENERAL' ? '普通' : '活动订单'}}
          </el-tag>
          <span class="ml10 receiptsNumStyle" @click="handleDetail(scope.row)">{{scope.row.orderNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商家名称" show-overflow-tooltip width="200" prop="merchantName" align="center" />
      <el-table-column label="订单状态" show-overflow-tooltip width="100" prop="orderStatus"  align="center">
        <template slot-scope="scope">
          <span>{{scope.row.orderStatus == 'PENDING_ORDER' ? '待接单' : (scope.row.orderStatus == 'WAITING_DELIVERY' ? '待配送' : (scope.row.orderStatus == 'DELIVERY_PROGRESS' ? '配送中' : (scope.row.orderStatus == 'PENDING_EXPENSES' ? '待消费' : (scope.row.orderStatus == 'WAITING_COMMENT' ? '待评价' : (scope.row.orderStatus == 'TRANSACTION_CLOSED' ? '关闭-取消' : (scope.row.orderStatus == 'TRANSACTION_COMPLETED' ? '交易成功':(scope.row.orderStatus == 'WAITING_PAY' ? '待支付' :(scope.row.orderStatus == 'PAY_FAILED' ? '支付失败':(scope.row.orderStatus =='IN_STOCK'?'备货中':(scope.row.orderStatus =='WAITING_CONFIRM_RECEIPT'?'配送完成':'售后中'))))))))))}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单类型" show-overflow-tooltip prop="orderMethod"  align="center">
        <template slot-scope="scope">
          <span>{{scope.row.orderMethod == 'DELIVERY' ? '外卖' : (scope.row.orderMethod == 'RESERVE' ? '预约' : (scope.row.orderMethod == 'VISIT_SERVER' ? '上门':'实时'))}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品数量" show-overflow-tooltip prop="productUnit"  align="center" />
      <el-table-column label="商品金额(元)" show-overflow-tooltip prop="totalAmount" align="center" />
      <el-table-column label="运费(元)" show-overflow-tooltip prop="deliveryAmount"  align="center" />
      <el-table-column label="实付金额(元)" show-overflow-tooltip prop="payAmount"  align="center" />
      <el-table-column label="结算状态" show-overflow-tooltip prop="replayContent"  align="center" />
      <el-table-column label="收货人" show-overflow-tooltip prop="deliveryName"  align="center" />
      <el-table-column label="收货人号码" show-overflow-tooltip prop="deliveryContactNo"  align="center" />
      <el-table-column label="收货地址" show-overflow-tooltip prop="deliveryStreet"  align="center" />
      <el-table-column label="配送人" show-overflow-tooltip prop="shopperName"  align="center" />
      <el-table-column label="操作" fixed="right" align="center" width="200"  class-name="small-padding fixed-width">
        <template slot-scope="scope" >
          <el-button  size="mini" type="text" icon="el-icon-view" @click="handleDetail(scope.row)"
             >详情</el-button>
          <el-button v-if="scope.row.orderStatus == 'PENDING_ORDER'" size="mini" type="text" style="color:#F56C6C" icon="el-icon-edit-outline" @click="merchantAcceptOrder(scope.row)"
            v-hasPermi="['system:order:edit']">接单</el-button>

          <el-button size="mini" style="color: #67C23A;" type="text" icon="el-icon-truck" @click="handleDeliver(scope.row)"
            v-if="scope.row.orderStatus == 'IN_STOCK' && (scope.row.orderMethod == 'DELIVERY' || scope.row.orderMethod == 'VISIT_SERVER')" v-hasPermi="['merchant:order:shipped']">{{scope.row.orderMethod == 'DELIVERY'?'配置配送人':'配置服务人'}}</el-button>

         <el-button size="mini" style="color: #F56C6C;" type="text" icon="el-icon-refresh" @click="handleOffCode(scope.row)"
            v-if="scope.row.orderStatus == 'PENDING_EXPENSES'" v-hasPermi="['merchant:order:shipped']">核销</el-button>

          <el-button size="mini" style="color: #F56C6C;" type="text" icon="el-icon-refresh" @click="handleCompleted(scope.row)"
             v-if="scope.row.orderStatus == 'DELIVERY_PROGRESS'" v-hasPermi="['merchant:order:shipped']">配送完成</el-button>

          <el-button v-if="scope.row.orderStatus == 'PENDING_EXPENSES'" size="mini" type="text" icon="el-icon-coin" style="color: #F56C6C;" @click="handleCompleted(scope.row)"
            v-hasPermi="['system:shopper:edit']">结算</el-button>

          <el-button v-if="scope.row.orderMethod == 'DELIVERY' || scope.row.orderMethod == 'VISIT_SERVER'" size="mini" type="text" icon="el-icon-edit" @click="handleReceipt(scope.row)"
            v-hasPermi="['system:shopper:edit']">修改订单</el-button>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 修改配送地址 -->
    <el-dialog :title="title" :visible.sync="receiptOpen" width="30%">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="订单号" >
          {{formData.orderNo}}
        </el-form-item>
        <el-form-item label="所在地区" >
          <el-input v-model="region" @focus="OpenMap()" suffix-icon='el-icon-map-location' :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="formData.deliveryStreet" placeholder="请输入详细地址" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="收货人" >
          <el-input v-model="formData.deliveryName" placeholder="请输入收货人" clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" >
          <el-input v-model="formData.deliveryContactNo" placeholder="请输入联系电话" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="服务人员" >
          <el-select v-model="formData.shopperName" placeholder="服务人员" clearable style="width: 100%">
            <el-option v-for="item in logisticsCompanyOptions" :key="item.id" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务人员" >
          <el-input v-model="formData.shopperPhone" placeholder="请输入备注" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="备注" >
          <el-input v-model="formData.orderComment" placeholder="请输入备注" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="receiptOpen = false">取消</el-button>
        <el-button type="primary" @click="receiptForm">确定</el-button>
      </div>
    </el-dialog>

      <!-- 配送 -->
    <el-dialog :title="title" :visible.sync="deliverOpen" width="30%">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="服务人员" prop="courierNo">
          <el-select v-model="formData.courierNo" placeholder="服务人员" clearable style="width: 100%">
            <el-option v-for="item in logisticsCompanyOptions" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="deliverOpen = false">取消</el-button>
        <el-button type="primary" @click="deliverForm">确定</el-button>
      </div>
    </el-dialog>

    <!-- 输入核销码 -->
    <el-dialog :title="title" :visible.sync="offCodeDialog" width="30%">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="核销码" prop="verificationCode">
          <el-input type="number" v-model="formData.verificationCode" clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="offCodeDialog = false">取消</el-button>
        <el-button type="primary" @click="verificationCodSubmit">确定</el-button>
      </div>
    </el-dialog>
    <gaoDeMap @updateLocation="updateLocation" ref="gaoDeMap"></gaoDeMap>
  </div>
</template>
<script>
  import gaoDeMap from "@/components/gaodeMap/index";
  import {
    listOrder,
    merchantAcceptOrder,
    queryMerchantShopperList,
    merchantStockComplete,
    merchantOrderVerification,
    getOrderDetalis,
    merchantModifyCommunityOrderInfo,
    merchantOrderDeliveryCompleted
  } from "@/api/community/order-list";

  export default {
    name: 'Order-list',
    inheritAttrs: false,
    props: [],
    components: {
      gaoDeMap
    },
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
        offCodeDialog:false,
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
          courierNo: [{
            required: true,
            message: '请选择服务人员',
            trigger: 'blur'
          }],

          verificationCode:[
            {
              required: true,
              message: '请输入核销码',
              trigger: 'blur'
            }
          ]
        },
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          dateSearchType: 1,
          searchName: '',
          searchWithdrawStatus: '',
          orderStatus: '',
        },
        customsj: [],
        showSearch: true,
        swiperOptions: [],
        dateSearchTypeOptions: [
        {
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
        orderMethodOptions: [{
          "label": "预约",
          "value": 'RESERVE'
        }, {
          "label": "外卖",
          "value": 'DELIVERY'
        },
        {
          "label": "实时订单",
          "value":'REAL_TIME'
        },
        {
          "label": "上门服务",
          "value":'VISIT_SERVER'
        }
        ],
        radio2: '上面',
        region: '',
        memoOpen: false,
        deliverOpen: false,
        dateRange:[]

      }
    },
    computed: {},
    watch: {},
    created() {
      this.getList()
    },
    mounted() {},
    methods: {

      /**
       *
       * @param {Object} Addr
       *
       */
      updateLocation(Addr) {
        this.region = Addr.province + Addr.city + Addr.district;
        this.formData.deliveryStreet = Addr.orgAddr;
        this.formData.deliveryProvince = Addr.province;
        this.formData.deliveryCity = Addr.city;
        this.formData.deliveryArea = Addr.district;
        this.formData.deliveryLatitude=Addr.lat;
        this.formData.deliveryLongitude=Addr.lon;

      },
      /** 查询列表 */
      getList() {
        this.loading = true;
        if (this.dateRange != null) {
                this.queryParams.startTime = this.dateRange[0];
                this.queryParams.stopTime = this.dateRange[1];
            }else{
                this.queryParams.startTime = ""
                this.queryParams.stopTime =""
            }
        listOrder(this.queryParams).then(response => {
          this.shopperList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      //订单状态查询
      changOrderStatus(e){
            this.queryParams.orderStatus=e;
            this.getList();
        },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /**
       *重置
       */
      reset() {
          this.formData = {

          },
          this.resetForm("queryForm");
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
        this.dateRange=[]
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
              merchantModifyCommunityOrderInfo(para).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            }
          }
        })
      },
      /**
       * @param {Object} row
       * 修改订单操作
       */
      handleReceipt(row) {
        this.reset();
        const orderId = row.id;
        this.formData = row;
        this.region = row.deliveryProvince + row.deliveryCity + row.deliveryArea;
        this.receiptOpen = true;
        this.title = "修改订单信息";
        let parameter={
              pageNum: 1,
              pageSize: 10,
              merchantId: row.merchantId
        }
        queryMerchantShopperList(parameter).then(response => {
          this.logisticsCompanyOptions=response.rows;
        });
      },
      /**
       * 修改订单提交
       */
      receiptForm() {
        this.$refs['elForm'].validate(valid => {

          if (valid) {
            if (this.formData.id != undefined) {
              let paras = {
                id:this.formData.id,
                orderId: this.formData.orderNo,
                merchantId: this.formData.merchantId,
                deliveryProvince: this.formData.deliveryProvince,
                deliveryCity: this.formData.deliveryCity,
                deliveryArea: this.formData.deliveryArea,
                deliveryStreet: this.formData.deliveryStreet,
                deliveryLatitude:this.formData.deliveryLatitude,
                deliveryLongitude:this.formData.deliveryLongitude,
                deliveryContactNo: this.formData.deliveryContactNo,
                deliveryName: this.formData.deliveryName,
                orderComment:this.formData.orderComment,
                shopperName:this.formData.shopperName
              }
              merchantModifyCommunityOrderInfo(paras).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.receiptOpen = false;
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

      timeChange(val) {
        this.queryParams.dateSearchType = 4;
      },


      /**
       * @param {Object} row
       * 输入核销码
       */
      handleOffCode(row){
        this.reset();
        this.title='输入核销码'
        this.offCodeDialog=true;
        this.formData=row;
        this.formData.verificationCode='';
      },
      /**
       * 核销提交
       */
      verificationCodSubmit(){
            this.$refs['elForm'].validate(valid => {
              if (valid) {
                  let para = {
                    orderId: this.formData.id,
                    verificationCode: this.formData.verificationCode
                  }
                  merchantOrderVerification(para).then(response => {
                    this.$modal.msgSuccess("核销成功");
                    this.offCodeDialog = false;
                    this.getList()
                  });
              }
            })
      },

      /**
       * @param {Object} row
       *订单详情
       */
      handleDetail(row) {
        this.$router.push({
          path: '/order/order-details',
          query: row
        })
      },
      /**
       * @param {Object} row
       * 查询配送人员
       *
       */
      handleDeliver(row) {
          this.reset();
          let parameter={
                pageNum: 1,
                pageSize: 10,
                merchantId: row.merchantId,
          }
          this.deliverOpen = true;
          this.formData=row;
          queryMerchantShopperList(parameter).then(response => {
            this.logisticsCompanyOptions=response.rows;
            this.deliverOpen = true;
            this.title = "填写配送信息";
          });

      },
      /**
       *提交服务人员信息
       */
      deliverForm() {
        this.$refs['elForm'].validate(valid => {
          if (valid) {
              let para = {
                orderId: this.formData.id,
                merchantShopperId: this.formData.courierNo
              }
              merchantStockComplete(para).then(response => {
                this.$modal.msgSuccess("发货成功");
                this.deliverOpen = false;
                this.getList()

              });
          }
        })
      },
      /**
       * @param {Object} row
       * 商家接单
       */
      merchantAcceptOrder(row){
        this.$modal.confirm('确认要接' + row.merchantName + '"该订单吗？').then(function() {
          let para={
            orderId:row.id,
            acceptType:'AGREED'
          }
          return merchantAcceptOrder(para);
        }).then(() => {
          if(row.orderMethod=="RESERVE" ||row.orderMethod=="REAL_TIME" ){
            row.orderStatus ="IN_STOCK";
          }else{
            row.orderStatus ="IN_STOCK";
          }
          this.$modal.msgSuccess("接单成功");
        }).catch(function() {
        });
      },
      /**
       * @param {Object} row
       * 配送完成
       */
      handleCompleted(row){
        this.$modal.confirm('确认要完成' + row.merchantName + '"该订单配送任务吗？').then(function() {
          let para={
            merchantShopperId:'',
            orderId:row.id

          }
          return merchantOrderDeliveryCompleted(para);
        }).then(() => {
          // if(row.orderMethod=="RESERVE" ||row.orderMethod=="REAL_TIME" ){
          //   row.orderStatus ="IN_STOCK";
          // }else{
          //   row.orderStatus ="IN_STOCK";
          // }
          row.orderStatus ="WAITING_COMMENT";
          this.$modal.msgSuccess("配送成功");
        }).catch(function() {
        });
      },
      /** 导出按钮操作 */
    handleExport() {
      if (this.queryParams.stopTime == '' || this.queryParams.startTime == '') {
        this.$modal.msgSuccess("请选择导出时间");
        return
      }

      this.download('order/admin/community/order/export', {
        ...this.queryParams
      }, `community_orderInfo_${new Date().getTime()}.xlsx`)


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
