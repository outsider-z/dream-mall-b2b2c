<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        
        <el-form-item prop="dateRange" label="时间">
          <el-date-picker v-model="customsj" type="daterange" @change="timeChange" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期">
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
        </el-form-item>
      </el-form>
  
      <el-table v-loading="loading" :data="shopperList" @selection-change="handleSelectionChange" :border="true" table-layout="auto">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="申请时间" align="center" prop="createTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="售后订单" prop="orderNo" align="center" >
          <template slot-scope="scope">
           <span class="ml10 receiptsNumStyle" @click="handleDetail(scope.row)">{{scope.row.saleNo}}</span>
           </template>
         </el-table-column>
        <el-table-column label="售后类型" prop="afterSaleType"  align="center">
          <template slot-scope="scope">
            <span>{{scope.row.afterSaleType == 'ONLY_REFUND' ? '仅退款' : '退款退货'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="售后状态" prop="status" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.status == 'WAITING_MERCHANT_CONFIRM' ? '待商家同意' : (scope.row.status == 'MERCHANT_REJECT' ? '拒绝售后' : (scope.row.status == 'WAITING_DELIVERY' ? '待发货' : (scope.row.status == 'WAITING_RECEIPT' ? '商家待收货' : (scope.row.status == 'REFUND_CLOSED' ? '取消售后' : '交易关闭'))) )}}</span>
          </template>
        </el-table-column>
        <el-table-column label="会员信息" prop="receiveMan"  align="center" />
        <el-table-column label="商家名称" prop="merchantName" align="center" />
        <el-table-column label="退款金额" prop="afterSaleAmount"  align="center" />
        <el-table-column label="退货原因" prop="refundReason" align="center" />
        <el-table-column label="操作" fixed="right" width="200" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope" >
            <el-button size="mini" 
              :style="scope.row.status == 'WAITING_MERCHANT_CONFIRM'? 'color: #67C23A':''"  
              type="text" icon="el-icon-check"
              @click="handleUpdate(scope.row)" :disabled="scope.row.status == 'WAITING_MERCHANT_CONFIRM' ? false : true"
                >同意</el-button>
            <el-button size="mini" 
              :class="scope.row.status == 'WAITING_MERCHANT_CONFIRM' ? 'redColor' : 'greyColor'"
              type="text" 
              icon="el-icon-close" :disabled="scope.row.status == 'WAITING_MERCHANT_CONFIRM' ? false : true"
              @click="handleRefuse(scope.row)" >拒绝</el-button>
              <el-button size="mini" :class="scope.row.status == 'WAITING_RECEIPT' ? 'greenColor' : 'greyColor'" type="text" icon="el-icon-finished" :disabled="scope.row.status == 'WAITING_RECEIPT' ? false : true"
                @click="handleReceipt(scope.row)" >确认收货</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </div>
  </template>
  <script>
    import{
      orderRefundList,
      merchantAcceptAfterSaleOrder,
      merchantConfirmRefundOrder
    } from "@/api/cm-merchant/cm-order";

    import store from '@/store';
    export default {
      name: 'Community-refund',
      inheritAttrs: false,
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
            orderAttribute:'COMMUNITY'
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
          this.queryParams.merchantId =store.getters.merchantId
          orderRefundList(this.queryParams).then(response => {
            this.shopperList = response.rows;
            this.total = response.total;
            this.loading = false;
          });
        },
  
        /**
         * @param {Object} row
         * 查看详情
         */
        handleDetail(row) {
          this.$router.push({
            path: '/cm-merchant/order/cm-refund-details',
            query: row
          })
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
  
       /**
        * @param {Object} row
        * 同意处理
        */
        handleUpdate(row) {
          this.$modal.confirm('确定同意该退货申请吗？').then(function() {
            let para = {
              acceptType: 'AGREED',
              saleOrderId: row.id
            }
            return merchantAcceptAfterSaleOrder(para);
          }).then(() => {
            this.$modal.msgSuccess("操作成功");
            // this.getList()
            row.status='REFUND_COMPLETED';
          }).catch(function() {});
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
              row.status='MERCHANT_REJECT';
            });
          }).catch(() => {});
        },
        /**
         * @param {Object} row
         * 确认收货
         *
         */
        handleReceipt(row){
          // 角色状态修改
          this.$modal.confirm('确认收货吗？').then(function() {
            let para = {
              saleOrderId: row.id,
              merchantId:'',
            }
            return merchantConfirmRefundOrder(para);
          }).then(() => {
            this.$modal.msgSuccess(text + "成功");
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
    .receiptsNumStyle {
      cursor: pointer;
      color: #1890ff;
    }
  </style>
  