<template>
  <div class="app-container">
    <el-row>
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
            {{orderList.payType == '1' ? '支付宝' :(orderList.payType == '2' ? '微信' :(orderList.payType == '3' ? '银联' :'货到付款'))}}
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
      <el-table v-loading="loading" :data="productList">
        <el-table-column label="商品名称" prop="productName" align="center" />
        <el-table-column label="商品图片" prop="productImageUrl" align="center">
          <template slot-scope="scope">
            <el-popover placement="right" trigger="hover">
              <img :src="`${imgHost}` +scope.row.productImageUrl" alt="" style="width: 150px;height: 100px">
              <img slot="reference" :src="`${imgHost}` + scope.row.productImageUrl" style="height: 40px;width: 60px">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="单价" align="center" prop="productUnitPrice" />
        <el-table-column label="商品数量" prop="productUnit" align="center" />
        <el-table-column label="商品金额" prop="productAmount" align="center" />
        <el-table-column label="实付金额" prop="actualAmount" align="center" />
      </el-table>
    </el-row>
    <el-row>
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
        <el-col :span="8">
          <el-button type="success" @click="open=true" v-if="invoiceInfo.status == 'INVOICING'">上传发票</el-button>
          <el-form-item label="发票:" prop="invoiceContent" v-else>
            <el-image style="width: 100px; height: 100px" :src="`${imgHost}` + invoiceInfo.invoiceContent" :preview-src-list="srcList">
            </el-image>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="上传发票" prop="communalName">
          <el-upload class="avatar-uploader" :action="uploadFileUrl" :show-file-list="false" :headers="headers"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="formData.invoiceContent" :src="`${imgHost}` + formData.invoiceContent" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    getProduct,
  } from "@/api/order/order";

  import {
    merchantModifyInvoiceInfo,
  } from "@/api/mall-merchant/invoice";
  import store from '@/store'
  export default {
    name: 'OrderList',
    components: {},
    props: [],
    data() {
      return {
        headers: {
          Authorization: "Bearer " + store.getters.token
        },
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile/oss",
        orderList: {},
        formData: {
          id: this.$route.query.id,
          invoiceContent: undefined,
        },
        rules: {},
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        total: 0,
        productList: [],
        invoiceInfo: {},
        open: false,
        title: '上传发票',
        srcList:[]
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
        getProduct(this.$route.query.orderId).then(response => {
          this.orderList = response.data;
          this.invoiceInfo = response.data.invoicesInfoEntity
          this.srcList.push(this.imgHost + response.data.invoicesInfoEntity.invoiceContent)
          this.productList = response.data.orderProductEntityList;
          this.total = response.total;
          this.loading = false;
        });
      },
      resetForm() {
        this.$refs['elForm'].resetFields()
      },
      handleAvatarSuccess(res, file) {
        this.formData.invoiceContent = res.data.url;
        if (this.formData.invoiceContent != '') {
          this.$refs.elForm.clearValidate('invoiceContent') //清除图片校验文字
        }
      },
      beforeAvatarUpload(file) {
        let isAccept = new RegExp('image/*').test(file.type)
        let isRightSize = file.size / 1024 / 1024 < 20
        if (!isAccept) {
          this.$message.error('应该选择image/*类型的文件')
          return isAccept
        } else if (!isRightSize) {
          this.$message.error('文件大小超过 20MB')
          return isRightSize
        }
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.formData.invoiceContent = undefined
      },
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            console.log(this.formData)
            merchantModifyInvoiceInfo(this.formData).then(response => {
              this.$modal.msgSuccess("上传成功");
              this.open = false;
              this.getList();
            });
          }
        })
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
