<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="商家名称" prop="merchantName">
        <el-select
            v-model="queryParams.merchantName"
            clearable
            :filter-method="searchHandle"
            filterable placeholder="请选择商家"
            v-el-select-loadmore="loadmore"
            @change="searchTopMerchant"
            @keyup.delete.native="deleteHandle">
          <el-option v-for="item in merchantOptions" :key="item.value" :label="item.label" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称" prop="productName">
        <el-input v-model="queryParams.productName" placeholder="请输入商品名称" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="商品状态" prop="shelfFlag">
        <el-select v-model="queryParams.shelfFlag" placeholder="请选择" clearable>
          <el-option v-for="item in shelfOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
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
          v-hasPermi="['cm-merchant:product:add']">新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>


    <el-table v-loading="loading" :data="productList" border>
      <el-table-column label="商家名称" prop="merchantName" width="200" align="center" />
      <el-table-column label="商品上传时间" prop="createTime" width="200" align="center">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="productName" width="300" align="center">
        <template slot-scope="scope">
          <span class="receiptsNumStyle"
            @click="receiptsNumClick(scope.row)">{{scope.row.productName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="img" label="图片" width="200" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" width="200" trigger="hover">
            <img :src="`${imgHost}` +scope.row.productMainImage" alt=""
              style="width: 150px;height: 100px">
            <img slot="reference" :src="`${imgHost}` + scope.row.productMainImage"
              style="height: 40px;width: 60px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="200">
        <template slot-scope="scope">
          <el-tag :type="scope.row.shelfFlag == '0' ? 'succes' : 'warning'">
            {{scope.row.shelfFlag == '0' ? '上架' : '下架'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" prop="verifyStatus" width="200" align="center">
        <template slot-scope="scope">
          {{scope.row.verifyStatus == 'PENDING_REVIEW' ? '待审核' : (scope.row.verifyStatus == 'APPROVED' ? '审核通过' : (scope.row.verifyStatus == 'FAIL' ? '审核未通过' : '审核中'))}}
        </template>
      </el-table-column>
      <el-table-column label="审核详情" prop="verifyMsg" align="center">
        <template slot-scope="scope">
          {{scope.row.verifyMsg}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="300" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" >
          <el-button size="mini" type="text" icon="el-icon-top-right" 
            v-if="scope.row.shelfFlag =='1'"
            @click="handleAdopt(scope.row)" 
            v-hasPermi="['cm-merchant:product:listing']">上架</el-button>
          <el-button size="mini" type="text" icon="el-icon-bottom-right"
            v-if="scope.row.shelfFlag =='0'" @click="handleAdopt(scope.row)"
            v-hasPermi="['cm-merchant:product:off-shelf']">下架</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit"
            :disabled="scope.row.shelfFlag == '0' ? true : false" @click="handleUpdate(scope.row)"
            v-hasPermi="['cm-merchant:product:update']">修改</el-button>
          <el-button :disabled="scope.row.shelfFlag == '0' ? true : false" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['cm-merchant:product:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
  </div>
</template>
<script>
  import {
    getAllCommonityMerchant,
    delProduct,
  } from "@/api/community/products";
  
import{
  merchantQueryCommunityProductList,
  merchantModifyCommunityProductStatus
  
} from"@/api/cm-merchant/cm-product";
  import store from '@/store';
  export default {
    name:'Product-list',
    inheritAttrs: false,
    props: [],
    data() {
      return {
        productList: [],
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
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          productName: '',
          merchantId: store.getters.merchantId,
          shelfFlag:'',
        },
        showSearch: true,
        productId: '',
        list: [],
        merchantOptions: [],
        merchantName: '',
        shelfOptions: [{
            value: '0',
            label: '上架'
          },
          {
            value: '1',
            label: '下架'
          }
        ],
        codePage: {
          pageNum: 1,
          pageSize: 10,
        },
        pages: '',
        arr: [],
      }
    },
    directives: { //注意：这个是写到data外面
      'el-select-loadmore': {
        bind(el, binding) {
          const SELECTWRAP_DOM = el.querySelector(
            '.el-select-dropdown .el-select-dropdown__wrap'
          )
          SELECTWRAP_DOM.addEventListener('scroll', function() {
            const condition =
              this.scrollHeight - this.scrollTop <= this.clientHeight
            if (condition) {
              binding.value()
            }
          })
        }
      }
    },
    computed: {

    },
    watch: {},
    created() {
      this.getList()
    },
    mounted() {},
    methods: {
      /**
       * @param {Object} row'
       * 上架下架
       * shelfFlag 上下架标识 0-上架,1-下架
       */
      handleAdopt(row) {
        console.log(row);
        let text = '';
        let parameter = {
          id: row.id
        }
        if (row.shelfFlag == '1') {
          text = "确认是否上架商品";
          parameter.shelfFlag = "0"
        } else {
          text = "确认是否下架商品";
          parameter.shelfFlag = "1"

        }
        this.$modal.confirm(text).then(function() {
          return merchantModifyCommunityProductStatus(parameter);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("操作成功");
        }).catch(() => {});
      },
      getList() {
        this.loading = true;
        this.queryParams.merchantId= store.getters.merchantId,
        merchantQueryCommunityProductList(this.queryParams).then(response => {
          this.productList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        if (selection[0].shelfFlag == '0') {
          this.single = false
        }
        this.multiple = !selection.length
        this.productId = selection[0].id
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const swiperIds = row.id || this.ids;
        this.$modal.confirm('是否确认删除商品信息？').then(function() {
          return delProduct(swiperIds);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {

        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.$router.push({
          path: '/cm-merchant/goods/product-add',
        })
      },
      /**
       * @param {Object} row
       * 修改
       */
      handleUpdate(row) {
        let modularId = []
        if (row.id) {
          modularId = row.id
        } else {
          modularId = this.productId
        }
        this.$router.push({
          path: '/cm-merchant/goods/product-add',
          query: {
            data: modularId,
            updateFlag: true,
          }
        })
      },
      reset() {
        this.formData = {
            productRotagramList: [],
            productDetailImgList: [],
            productType: '1',
            merchantId: undefined,
            productCateId: null,
            productBrandId: undefined,
            productName: undefined,
            productBrief: '',
            productCode: '',
            unitPrice: '',
            marketPrice: '',
            productCostPrice: '',
            promotePrice: '',
            totalUnit: '',
            deliveryExpressEnabled: '0',
            deliveryCityEnabled: '1',
            deliveryPickEnabled: '1',
            newProductFlag: undefined,
            hotSaleFlag: undefined,
            promoteSalesFlag: undefined,
            recommendFlag: undefined,
            noReasonRefund: undefined,
            invoiceStatus: undefined,
            shippingFlag: undefined,
            validType: '1',
            validDays: undefined,
            productFreightId: undefined,
            productDeliveryId: undefined,
            skuFlag: '1',
          },
          this.resetForm("formData");
      },
      examineBtn() {
        this.$prompt('请输入拒绝原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({
          value
        }) => {
          this.$message({
            type: 'success',
            message: ''
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      /** 同意按钮操作 */
      handleCheck(row) {
        this.$modal.confirm('确认通过该审核吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          let para = {
            verifyStatus:'APPROVED',
            id:row.mallProductEntity.id
          }
          modifyProductVerifyStatus(para).then(response => {
            this.$modal.msgSuccess("审核成功");
            this.getList()
          });
        }).catch(() => {});
      },
      /** 拒绝按钮操作 */
      handleClose(row) {
        this.$prompt('请输入拒绝原因', "拒绝", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: 'warning'
        }).then(({
          value
        }) => {
          let para = {
            verifyStatus:'FAIL',
            id:row.mallProductEntity.id,
            verifyMsg:value
          }
          modifyProductVerifyStatus(para).then(response => {
            this.$modal.msgSuccess("拒绝成功");
            this.getList()
          });
        }).catch(() => {});
      },
      //查询商家
      loadmore() {
        this.codePage.pageNum++
        this.handleChange(this.codePage.pageNum)
      },
      handleChange(data) {
        let param = {
          merchantName: this.merchantName,
          pageNum: data,
          approveStatus:'APPROVED',
          pageSize: this.codePage.pageSize,
          merchantAttribute: 'COMMUNITY_MERCHANT'
        };
        this.getAllCommonityMerchant(param)
      },
      deleteHandle(){},
      searchHandle(data) {
        this.arr = []
        let param = {
          merchantName: data,
          pageNum: 1,
          approveStatus:'APPROVED',
          pageSize: this.codePage.pageSize,
          merchantAttribute: 'COMMUNITY_MERCHANT'
        };
        this.getAllCommonityMerchant(param)
      },
      getAllCommonityMerchant(param) {
        getAllCommonityMerchant(param).then(res => {
          if (res.code == 200) {
            for (let index in res.rows) {
              this.arr.push({
                label: res.rows[index].mallMerchantEntity.merchantName,
                value: res.rows[index].mallMerchantEntity.id,
              })
            }
            let obj = {};
            this.merchantOptions = this.arr.reduce((cur, next) => {
              obj[next.value] ? "" : obj[next.value] = true && cur.push(next);
              return cur;
            }, [])
            this.pages = res.total
          } else {
            this.$message({
              message: res.message,
              type: "error",
            });
          }
        });
      },
      searchTopMerchant(val) {
        this.queryParams.merchantId = val.value
        this.merchantName = val.label
      },
      receiptsNumClick(row) {
        let modularId = []
        if (row.mallProductEntity) {
          modularId = row.mallProductEntity.id
        } else {
          modularId = this.productId
        }
        this.$router.push({
          path: '/goodsEdit',
          query: {
            data: modularId,
            operation: true,
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
