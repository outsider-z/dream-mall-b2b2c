<template>
  <div class="app-container" id="nbprint">
    <el-row>
      <el-button type="primary" v-print="printOption">打印</el-button>
      <div>
        <el-divider content-position="left">基础信息</el-divider>
      </div>
      <el-form ref="elForm" :model="orderList" :rules="rules" size="medium" label-width="120px">
        <el-col :span="8">
          <el-form-item label="订单编号:" prop="orderNo">
            {{orderList.orderNo}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="下单日期:" prop="createTime">
            {{orderList.createTime}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="下单会员:" prop="deliveryName">
            {{orderList.deliveryName}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单状态:" prop="orderStatus">
            {{orderList.orderStatus == 'WAITING_PAY' ? '待支付' : (orderList.orderStatus == 'WAITING_DELIVERY' ? '待发货' : (orderList.orderStatus == 'WAITING_RECEIPT' ? '待收货' : (orderList.orderStatus == 'WAITING_COMMENT' ? '待评价' : (orderList.orderStatus == 'TRANSACTION_CLOSED' ? '已取消-交易关闭' : (orderList.orderStatus == 'TRANSACTION_COMPLETED' ? '已完成' : '售后中')))))}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="支付方式:" prop="payType">
            {{orderList.payType == 'ALIPAY' ? '支付宝' :(orderList.payType == 'WECHAT' ? '微信' :(orderList.payType == 'BALANCE' ? '余额' :'电子卡'))}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品数量:" prop="productUnit">
            {{orderList.productUnit}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品金额:" prop="totalAmount">
            {{orderList.totalAmount}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="优惠券抵扣金额:" prop="couponAmount">
            {{orderList.couponAmount}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="会员折扣:" prop="userLevelAmount">
              ￥{{orderList.userLevelAmount}}
            </el-form-item>
          </el-col>
        <el-col :span="8">
          <el-form-item label="积分抵扣金额:" prop="integrationAmount">
            {{orderList.integrationAmount}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运费:" prop="freightAmount">
            {{orderList.freightAmount}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实付金额:" prop="payAmount">
            <span class="paid">￥{{orderList.payAmount}}</span>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <div>
        <el-divider content-position="left">商品</el-divider>
      </div>
      <el-table v-loading="loading" :data="productList"  table-layout="auto" :border="true">
        <el-table-column label="商品名称" prop="productName" align="center" />
        <el-table-column label="实付金额" prop="actualAmount" align="center" />
        <el-table-column label="商品数量" prop="productUnit" align="center" />
        <el-table-column label="单价" align="center" prop="productUnitPrice" />
        <el-table-column label="商品金额" prop="productAmount" align="center" />
        <el-table-column label="商品图片" prop="productImageUrl" align="center">
          <template slot-scope="scope">
            <el-popover placement="right" trigger="hover">
              <img :src="`${imgHost}` +scope.row.productImageUrl" alt=""
                style="width: 150px;height: 100px">
              <img slot="reference" :src="`${imgHost}` + scope.row.productImageUrl"
                style="height: 40px;width: 60px">
            </el-popover>
          </template>
        </el-table-column>
        
      </el-table>
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
    <el-row>
      <div>
        <el-divider content-position="left">收货人信息（快递配送）</el-divider>
      </div>
      <el-form ref="elForm" :model="orderList" :rules="rules" size="medium" label-width="100px">
        <el-col :span="6">
          <el-form-item label="姓名:" prop="deliveryName">
            {{orderList.deliveryName}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系电话:" prop="deliveryContactNo">
            {{orderList.deliveryContactNo}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="地址:" prop="deliveryStreet">
            {{orderList.deliveryStreet}}
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <div>
        <el-divider content-position="left">买家备注</el-divider>
      </div>
      <el-form ref="elForm" :model="orderList" :rules="rules" size="medium" label-width="100px">
        <el-col :span="24">
          <el-form-item label="备注:" prop="memo">
            {{orderList.memo}}
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
  import {
    getProduct,
  } from "@/api/order/order";
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
        srcList:[],
        total: 0,
        invoiceInfo:{},
        productList:[],
        printOption: {
          id: 'nbprint', // 打印元素的id 不需要携带#号
          popTitle: '', // 页眉标题 默认浏览器标题 空字符串时显示undefined 使用html语言
          extraCss: "", // 打印可引入外部的一个 css 文件
          extraHead: "", // 打印头部文字
        }
      }
    },
    computed: {},
    watch: {},
    created() {
      // this.getDictType()
      this.getList()
    },
    mounted() {},
    methods: {
      /** 查询列表 */
      getList() {
        this.loading = true;
        getProduct(this.$route.query.id).then(response => {
          this.orderList = response.data;
          this.printOption.popTitle=this.orderList.orderNo;
          this.productList = response.data.orderProductEntityList;
          if(response.data.invoicesInfoEntity){
            this.invoiceInfo = response.data.invoicesInfoEntity
            this.srcList.push(this.imgHost + response.data.invoicesInfoEntity.invoiceContent)
          }
          this.total = response.total;
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
</style>
