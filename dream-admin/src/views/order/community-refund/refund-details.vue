<template>
  <div class="app-container">
    <el-row>
      <div>
        <el-divider content-position="left">基础信息</el-divider>
      </div>
      <el-form ref="elForm" :model="orderList" :rules="rules" size="medium" label-width="120px">
        <el-col :span="8">
          <el-form-item label="原订单号:" prop="orderNo">
            {{orderList.orderNo}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="售后单号:" prop="orderNo">
            {{orderList.saleNo}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="下单日期:" prop="createTime">
            {{orderList.createTime}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请日期:" prop="createTime">
            {{orderList.timeApplication}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单状态:" prop="orderType">
            {{orderList.status == 'MERCHANT_REJECT' ? '商家拒绝' : (orderList.status == 'WAITING_MERCHANT_CONFIRM'?'商家待审核':'商家拒绝')}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请方式:" prop="deliveryName">
            {{orderList.afterSaleMethod=='ALL_PRODUCT'?'全部商品':'部分商品'}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商家:" prop="deliveryName">
            {{orderList.merchantName}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="退款金额:" prop="payAmount">
            <span class="paid">￥{{orderList.afterSaleAmount}}</span>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <div>
        <el-divider content-position="left">退货商品</el-divider>
      </div>
      <el-table v-loading="loading" :data="orderList.afterSaleOrderProductList">
        <el-table-column label="商品名称" prop="productName" align="center" />
        <el-table-column label="商品图片" prop="productImageUrl" align="center">
          <template slot-scope="scope">
            <el-popover placement="right" trigger="hover">
              <img :src="`${imgHost}` +scope.row.productImageUrl" alt="" style="width: 150px;height: 100px">
              <img slot="reference" :src="`${imgHost}` + scope.row.productImageUrl" style="height: 40px;width: 60px">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="规格" align="center" prop="productSkuDesc" />
        <el-table-column label="单价" align="center" prop="productUnitPrice" />
        <el-table-column label="商品数量" prop="productUnit" align="center" />
        <el-table-column label="商品金额" prop="productAmount" align="center" />
        <!-- <el-table-column label="实付金额" prop="actualAmount" align="center" /> -->
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </el-row>

    <el-row v-if="orderList.invoicesInfoEntity">
      <div>
        <el-divider content-position="left">发票信息</el-divider>
      </div>
      <el-form ref="elForm" :model="invoiceInfo" :rules="rules" size="medium" label-width="100px">
        <el-col :span="8">
          <el-form-item label="发票类型:" prop="invoiceType">
            {{invoiceInfo.invoiceType == 'PERSONAL' ? '个人' : '企业'}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发票抬头:" prop="invoiceTitle">
            {{invoiceInfo.invoiceTitle}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收件邮箱:" prop="emailAddress">
            {{invoiceInfo.emailAddress}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="税号:" prop="taxCode">
            {{invoiceInfo.taxCode}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开票状态:" prop="status">
            {{invoiceInfo.status == 'INVOICING' ? '开票中' : '已开票'}}
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="invoiceInfo.status == 'INVOICED'">
          <el-form-item label="发票:" prop="invoiceContent">
            <el-image style="width: 100px; height: 100px" :src="`${imgHost}` + invoiceInfo.invoiceContent" :preview-src-list="srcList">
            </el-image>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

    <el-row v-if="orderList.orderMethod=='DELIVERY' ||  orderList.orderMethod=='VISIT_SERVER'">
      <div>
        <el-divider content-position="left">收货人信息（商家服务）</el-divider>
      </div>
      <el-form ref="elForm" :model="orderList" :rules="rules" size="medium" label-width="100px">
        <el-col :span="4">
          <el-form-item label="姓名:" prop="deliveryName">
            {{orderList.deliveryName}}
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="联系电话:" prop="deliveryContactNo">
            {{orderList.deliveryContactNo}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="地址:" prop="deliveryStreet">
            {{orderList.deliveryStreet}}
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="预约人数:" prop="reserveNo">
            {{orderList.reserveNo}}个
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="预约时间:" prop="reserveTime">
            {{orderList.reserveTime}}
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

    <el-row v-if="orderList.orderMethod=='DELIVERY' ||  orderList.orderMethod=='VISIT_SERVER'">
      <div>
        <el-divider content-position="left">{{orderList.orderMethod=='DELIVERY'?'配送人信息':'上门服务人信息'}}</el-divider>
      </div>
      <el-form ref="elForm" :model="orderList" :rules="rules" size="medium" label-width="100px">
        <el-col :span="4">
          <el-form-item label="姓名:" prop="shopperName">
            {{orderList.shopperName}}
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="联系电话:" prop="shopperPhone">
            {{orderList.shopperPhone}}
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <div>
        <el-divider content-position="left">申请理由</el-divider>
      </div>
      <el-form ref="elForm" :model="orderList" :rules="rules" size="medium" label-width="100px">
        <el-col :span="24">
          <el-form-item label="理由:" prop="memo">
            {{orderList.refundReason}}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注:" prop="memo">
            {{orderList.afterSaleDescription}}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="凭证1:" prop="memo">
            <el-image style="width: 100px; height: 100px" :src="`${imgHost}` + orderList.refundImage1" :preview-src-list="srcList">
            </el-image>
          </el-form-item>
          <el-form-item label="凭证2:" prop="memo">
            <el-image style="width: 100px; height: 100px" :src="`${imgHost}` + orderList.refundImage2" :preview-src-list="srcList">
            </el-image>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <div>
        <el-divider content-position="left">拒绝原因</el-divider>
      </div>
      <el-form ref="elForm" :model="orderList" :rules="rules" size="medium" label-width="100px">
        <el-col :span="24">
          <el-form-item label="原因:" prop="memo">
            {{orderList.rejectReason==''?'无':orderList.rejectReason}}
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>

  import {
    refundOrder,
  } from "@/api/community/order-list";

  export default {
    name: 'OrderList',
    components: {},
    props: [],
    data() {
      return {
        orderList: {
          product: []
        },
        formData: {
          dictValue: undefined,
        },
        rules: {},
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        total: 0,
        productList: [],
        orderType: '',
        scrabbleList: [],
        invoiceInfo:{},
        srcList:[]
      }
    },
    computed: {},
    watch: {},
    created() {
      // this.getDictType()
      this.getList()
      this.orderType = this.$route.query.orderType
    },
    mounted() {},
    methods: {
      /** 查询列表 */
      getList() {
        this.loading = true;
        refundOrder(this.$route.query.id).then(response => {
          this.orderList = response.data;
          this.productList = response.data.orderProductEntityList;
          if(response.data.groupInitiationEntity){
            this.scrabbleList = response.data.groupInitiationEntity.groupUserEntityList
          }
          if(response.data.invoicesInfoEntity){
            this.invoiceInfo = response.data.invoicesInfoEntity
            this.srcList.push(this.imgHost + response.data.invoicesInfoEntity.invoiceContent)
          }
          // this.total = response.total;
          this.loading = false;
        });
      },
      resetForm() {
        this.$refs['elForm'].resetFields()
      },
    }
  }
</script>
<style scoped>
  .el-row {
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    &:last-child {
      margin-bottom: 0;
    }
  }

  .paid {
    color: #ed3f14;
    font-size: 25px;
  }
  .grounpNum{
    color: #ed3f14;
    font-size: 18px;
    padding: 0 5px;
  }
</style>
