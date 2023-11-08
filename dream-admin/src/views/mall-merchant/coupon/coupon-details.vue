<template>
    <div class="app-container">
      <el-row>
        <div>
          <el-divider content-position="left">优惠券商品</el-divider>
        </div>
        <el-table v-loading="loading" :data="productList" border>
          <el-table-column label="商品名称" prop="productName" align="center">
            <template slot-scope="scope">
              {{scope.row.mallProductEntity.productName}}
            </template>
          </el-table-column>
          <el-table-column label="商品图片" prop="productMainImage" align="center">
            <template slot-scope="scope">
              <el-popover placement="right" width="200" trigger="hover">
                <img :src="`${imgHost}` + scope.row.mallProductEntity.productMainImage" alt=""
                  style="width: 150px;height: 80px">
                <img slot="reference" :src="`${imgHost}` + scope.row.mallProductEntity.productMainImage"
                  style="max-height: 100px;max-width: 40px">
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="单价" align="center" prop="unitPrice">
            <template slot-scope="scope">
              {{scope.row.mallProductEntity.unitPrice}}
            </template>
          </el-table-column>
          <el-table-column label="市场价" prop="marketPrice" align="center">
            <template slot-scope="scope">
              {{scope.row.mallProductEntity.marketPrice}}
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
          @pagination="getList" />
      </el-row>
      <el-row>
        <div>
          <el-divider content-position="left">优惠券领取详情</el-divider>
        </div>
        <el-table v-loading="loading" :data="receiveList">
          <el-table-column label="会员名称" prop="productName" align="center" />
          <el-table-column label="手机号码" prop="redPacketNum" align="center" />
          <el-table-column label="领取时间" prop="redPacketLimit" align="center" />
          <el-table-column label="是否使用" align="center" prop="startTime"></el-table-column>
          <el-table-column label="使用时间" prop="stock" align="center" />
        </el-table>
        <pagination v-show="receiveTotal>0" :total="receiveTotal" :page.sync="receiveParams.pageNum"
          :limit.sync="receiveParams.pageSize" @pagination="getList" />
      </el-row>
    </div>
  </template>
  <script>
    import {
      getCouponList,
      queryUserCouponList
    } from "@/api/system/coupon";

import store from '@/store';
  import {
    
    merchantQueryCouponProductList,

  } from "@/api/mall-merchant/coupon-list";
    export default {
      name: 'Logistics',
      components: {},
      props: [],
      data() {
        return {
          productList: [],
          formData: {
            dictValue: undefined,
          },
          rules: {},
          queryParams: {
            pageNum: 1,
            pageSize: 10,
            merchantId:store.getters.merchantId
          },
          total: 0,
          receiveList: [],
          receiveTotal: 0,
          receiveParams: {
            pageNum: 1,
            pageSize: 10,
          },
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
          this.queryParams.couponId = this.$route.query.id
          merchantQueryCouponProductList(this.queryParams).then(response => {
            this.productList = response.rows;
            this.total = response.total;
            this.loading = false;
          });
        //   this.receiveParams.couponId = this.$route.query.id
        //   queryUserCouponList(this.receiveParams).then(response => {
        //     this.receiveList = response.rows;
        //     this.receiveTotal = response.total;
        //     this.loading = false;
        //   });
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
  