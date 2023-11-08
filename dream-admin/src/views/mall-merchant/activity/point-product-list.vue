<template>
  <div class="app-container">
    <el-form :model="spikeQuery" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="选择商品" prop="productName">
        <el-input v-model="spikeQuery.productName" placeholder="请输入商品名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addClick()">新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="spikeProList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="spikeList" :border="true">
      <el-table-column label="商品名称" prop="productName" align="center" />
      <el-table-column label="商品原价" prop="productOriginalPrice" align="center" />
        <el-table-column label="商家" prop="productName" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.merchantName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品库存" prop="totalUnit" align="center" />
        <el-table-column label="方式" prop="productName" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.amountMethod=='POINT'?'积分兑换':'积分兑换+金额' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="兑换积分" prop="pointPrice" align="center" >
          <template slot-scope="scope">
            <span>{{ scope.row.pointPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="兑换价格" prop="pointPrice" align="center" >
          <template slot-scope="scope">
            <span>{{ scope.row.productCashPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="方式" prop="productName" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.amountMethod=='POINT'?'积分兑换':'积分兑换+金额' }}</span>
          </template>
        </el-table-column>
      <el-table-column prop="productMainImage" label="图片" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" width="100" trigger="hover">
            <img :src="`${imgHost}`+ scope.row.productMainImage" alt="" style="width: 100px;height: 100px">
            <img slot="reference" :src="`${imgHost}`+ scope.row.productMainImage"
              style="max-height: 40px;max-width: 40px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" />
      <el-table-column label="修改时间" prop="updateTime" align="center" />
      <el-table-column label="操作" align="center" fixed="right" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
           >修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="searchTotal>0" :total="searchTotal" :page.sync="spikeQuery.pageNum"
      :limit.sync="spikeQuery.pageSize" @pagination="spikeProList" />

    <el-dialog title="选择商品" :visible.sync="open" width="45%">
      <el-form ref="elForm" :model="queryParams" :rules="rules" size="medium" label-width="100px">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="选择商品" label-width="130px" prop="productName">
              <el-input v-model="queryParams.productName" placeholder="请输入商品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" label-width="5px">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table v-loading="loading" :data="productList" :border="true" height="500px">
        <el-table-column label="商品名称" prop="productName" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.mallProductEntity.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品商家" prop="productName" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.merchantName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品原价" prop="productName" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.mallProductEntity.unitPrice }}  ~ {{ scope.row.mallProductEntity.unitMaxPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" prop="redPacketNum" align="center">
          <template slot-scope="scope">
            <el-popover placement="right" width="150" trigger="hover">
              <img :src="`${imgHost}`+ scope.row.mallProductEntity.productMainImage" alt=""
                style="width: 150px;height: 150px">
              <img slot="reference" :src="`${imgHost}`+ scope.row.mallProductEntity.productMainImage"
                style="max-height: 40px;max-width: 40px">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="商品规格" prop="redPacketNum" align="center">
          <template slot-scope="scope">
            <el-button type="warning" plain @click="selsectSku(scope.row)">选择商品规格</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </el-dialog>

    <el-dialog title="商品规格" :visible.sync="singleTableVisible">
      
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
        <el-radio v-model="formData.amountMethod" label="POINT" border>积分</el-radio>
            <el-radio v-model="formData.amountMethod" label="POINT_CASH" border>积分+现金</el-radio>
        </el-col>
     </el-row>
      <el-table :data="singleProList" style="width: 100%" ref="singleTable" :border="true">
        <el-table-column prop="productCode" label="编码" align="center">
          <template slot-scope="scope">
            {{scope.row.productCode}}
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" label="价格" align="center">
          <template slot-scope="scope">
            {{scope.row.unitPrice}}
          </template>
        </el-table-column>
        <el-table-column prop="productCostPrice" label="成本价" align="center">
          <template slot-scope="scope">
            {{scope.row.productCostPrice}}
          </template>
        </el-table-column>
        <el-table-column prop="totalUnit" label="活动库存" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.totalUnit" size="mini" clearable type="number" />
          </template>
        </el-table-column>
        <el-table-column prop="pointPrice" label="积分数量" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.pointPrice" size="mini" clearable type="number" />
          </template>
        </el-table-column>
        <el-table-column prop="activePrice" label="现金价格" align="center" v-if="formData.amountMethod == 'POINT_CASH'">
          <template slot-scope="scope">
            <el-input v-model="scope.row.activePrice" size="mini" clearable type="number" />
          </template>
        </el-table-column>
        <el-table-column prop="productAttrImg" label="图片" align="center">
          <template slot-scope="scope">
            <el-popover placement="right" width="100" trigger="hover">
              <img :src="`${imgHost}`+ scope.row.productAttrImg" alt="" style="width: 100px;height: 100px">
              <img slot="reference" :src="`${imgHost}`+ scope.row.productAttrImg"
                style="max-height: 40px;max-width: 40px">
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
     
      <div class="fotterBtn mt20">
        <el-button @click="singleTableVisible = false">取消</el-button>
        <el-button type="primary" @click="submitSku">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="商品规格" :visible.sync="dialogTableVisible">
      <el-row :gutter="10" class="mb8">
        <div class="">
          <el-radio v-model="formData.amountMethod" label="POINT" border>积分</el-radio>
          <el-radio v-model="formData.amountMethod" label="POINT_CASH" border>积分+现金</el-radio>
        </div>
      </el-row>
      <el-table :data="tableColumnList.tableBodyList" style="width: 100%" ref="multipleTable" :border="true">
        <el-table-column :label="item.propName" :property="item.prop" v-for="item in tableColumnList.tableHeaderList"
          :key="item.prop" align="center" fixed="left">
          <template slot-scope="scope">
            <span>{{ scope.row[scope.column.property] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productCode" label="编码" align="center">
          <template slot-scope="scope">
            {{scope.row.productCode}}
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" label="价格" align="center">
          <template slot-scope="scope">
            {{scope.row.unitPrice}}
          </template>
        </el-table-column>
        <el-table-column prop="productCostPrice" label="成本价" align="center">
          <template slot-scope="scope">
            {{scope.row.productCostPrice}}
          </template>
        </el-table-column>
        <el-table-column prop="totalUnit" label="活动库存" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.totalUnit" size="mini" clearable type="number" />
          </template>
        </el-table-column>
        <el-table-column prop="pointPrice" label="积分数量" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.pointPrice" size="mini" clearable type="number" />
          </template>
        </el-table-column>
        <el-table-column prop="activePrice" label="现金价格" align="center" v-if="formData.amountMethod == 'POINT_CASH'">
          <template slot-scope="scope">
            <el-input v-model="scope.row.activePrice" size="mini" clearable type="number" />
          </template>
        </el-table-column>
        <el-table-column prop="productAttrImg" label="图片" align="center">
          <template slot-scope="scope">
            <el-popover placement="right" width="100" trigger="hover">
              <img :src="`${imgHost}`+ scope.row.productAttrImg" alt="" style="width: 100px;height: 100px">
              <img slot="reference" :src="`${imgHost}`+ scope.row.productAttrImg"
                style="max-height: 40px;max-width: 40px">
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
     
      <div class="fotterBtn mt20">
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="submitSku">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    getAllMallMerchant
  } from "@/api/mall-merchant/merchant";

  import {
    listProduct,
    getProduct
  } from "@/api/product/product";

  import {
    merchantAddPointProduct,
    merchantQueryPointProduct,
    queryPointProductDetail,
    merchantModifyPointProduct,
    merchantRemovePointProduct
  } from "@/api/mall-merchant/active";
  
  import store from '@/store';

  export default {
    name: 'Point-product-list',
    components: {},
    props: [],
    data() {
      return {
        tableColumnList: {
          tableHeaderList: [],
          tableBodyList: []
        },
        proList: [],
        productSkuAttrRequestList: [],
        productList: [],
        formData: {
          merchantName: undefined,
          merchantId: '',
          amountMethod: 'POINT'
        },
        rules: {},
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          merchantId: '',
          shelfFlag: 0,
        },
        total: 0,
        merchantOptions: [],
        merchantValue: '',
        list: [],
        states: [],
        merchantName: '',
        loading: false,
        skuData: [],
        dialogTableVisible: false,
        rowItem: [],
        spikeQuery: {
          pageNum: 1,
          pageSize: 10,
          productName: ''
        },
        open: false,
        changeProductId: '',
        spikeMainImage: '',
        spikeName: '',
        spikeList: [],
        showSearch: true,
        cateAttrFlag: '',
        status: '',
        keyId: '',
        searchTotal: 0,
        singleTableVisible: false,
        singleProList: [],
        skuFlag: '0',
        productCateId: '',
      }
    },
    computed: {
      // 计算规格
      calculateAttribute() {
        // 初始化
        let obj = {}
        this.productSkuAttrRequestList.forEach((item) => {
          // 判断有没有输入规格名
          if (item.productAttrName) {
            //规格名:规格值     //'颜色':'尺寸'
            obj[item.productAttrName] = item.skuAttrValueRequestList
          }
        })
        return obj
      }
    },
    watch: {
      // 监听规格数据
      calculateAttribute(newVal) {
        let cloneNewVal = JSON.parse(JSON.stringify(newVal))
        let attrName = [] //规格名数组
        let attrValue = [] //规格值数组
        for (let key in cloneNewVal) {
          attrName.push(key)
          attrValue.push(cloneNewVal[key])
        }

        // 表格内容数据（笛卡尔积算法）
        let finalArr = this.cartesianProductOf(...attrValue)

        let tableObj = {
          tableBodyList: [],
          tableHeaderList: []
        }
        // 表格内容
        tableObj.tableBodyList = finalArr.map((item, index) => {
          let obj = {
            price: 0,
            stock: 0,
            low_stock: 0,
            index: index,
            productAttrValueId: '',
          }
          let items = ''
          let ids = ''
          for (let i = 0; i < item.length; i++) {
            obj[attrName[i]] = item[i].productAttrValue
            items += item[i].productAttrValue + (',')
            obj.productAttrValueId = items.substring(0, items.length - 1);
            if (item[i].id) {
              ids += item[i].id + (',')
              obj.skuId = ids.substring(0, ids.length - 1);
            }
            if (this.proList.length > 0) {
              for (var j = 0; j < this.proList.length; j++) {
                if (obj.skuId == this.proList[j].productAttrValueId) {
                  console.log(this.proList[j])
                  obj.id = this.proList[j].id
                  obj.productAttrImg = this.proList[j].productAttrImg
                  obj.marketPrice = this.proList[j].marketPrice
                  obj.productAttrValueId = this.proList[j].productAttrValueId
                  obj.productCode = this.proList[j].productCode
                  obj.productCostPrice = this.proList[j].productCostPrice
                  obj.productId = this.proList[j].productId
                  obj.promotePrice = this.proList[j].promotePrice
                  if (this.status == 'add') {
                    obj.totalUnit = ''
                    obj.pointPrice = ''
                  } else {
                    obj.totalUnit = this.proList[j].totalUnit
                    obj.pointPrice = this.proList[j].pointPrice
                  }
                  obj.unitPrice = this.proList[j].unitPrice
                  obj.productWeight = this.proList[j].productWeight
                  obj.activeId = this.$route.query.id
                  obj.activePrice = this.proList[j].activePrice ? this.proList[j].activePrice : '0'
                  obj.cateAttrFlag = this.cateAttrFlag
                }
              }
            }
          }
          return obj
        })
        this.tableColumnList.tableBodyList = tableObj.tableBodyList //表格内容数据
        // 表头
        let skuTableArr = Object.keys(newVal)
        tableObj.tableHeaderList = skuTableArr.map((item) => {
          return {
            prop: item,
            propName: item
          }
        })
        this.tableColumnList.tableHeaderList = tableObj.tableHeaderList // 表头

      }
    },
    created() {
      this.spikeProList()
    },
    mounted() {
      let para = {
        merchantName: this.merchantName
      }
      getAllMallMerchant(para).then(response => {
        this.states = response.data;
        this.list = this.states.map(item => {
          return {
            value: `${item.mallMerchantEntity.id}`,
            label: `${item.mallMerchantEntity.merchantName}`
          };
        });
      });
    },
    methods: {

      spikeProList() {
        this.spikeQuery.activeId = this.$route.query.id
        this.spikeQuery.merchantId= store.getters.merchantId
        merchantQueryPointProduct(this.spikeQuery).then(res => {
          this.spikeList = res.rows
          this.searchTotal = res.total;
        })
      },
      resetForm() {
        this.$refs['elForm'].resetFields()
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.merchantOptions = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.merchantOptions = [];
        }
      },
      /** 查询商品列表 */
      getList() {
        this.loading = true;
        this.queryParams.merchantId = store.getters.merchantId
        listProduct(this.queryParams).then(response => {
          this.productList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },

      selsectSku(val) {
        this.status = 'add'
        this.changeProductId = val.mallProductEntity.id
        this.spikeMainImage = val.mallProductEntity.productMainImage
        this.spikeName = val.mallProductEntity.productName
        if (val.mallProductEntity.skuFlag == '1') {
          this.skuFlag = '1'
          this.singleTableVisible = true
        } else {
          this.dialogTableVisible = true
          this.skuFlag = '0'
        }
        getProduct(val.mallProductEntity.id).then(response => {
          this.productCateId = response.data.mallProductEntity.productParentCateId
          if (val.mallProductEntity.skuFlag == '0') {
            this.productSkuAttrRequestList = response.data.productSkuAttrResponseList
            this.proList = response.data.productSkuResponseList
            this.rowItem = response.data.productSkuResponseList
            this.cateAttrFlag = response.data.mallProductEntity.skuFlag
          } else {
            let arr = response.data.productSkuResponseList
            arr.forEach(item => {
              item.activeId = this.$route.query.id
              item.totalUnit = ''
              // item.pointPrice = ''
              item.cateAttrFlag = response.data.mallProductEntity.skuFlag
              this.$set(item, 'activePrice', '0')
            })
            this.singleProList = arr
          }
        });
      },
      cancel() {},
      // 笛卡尔积算法
      cartesianProductOf(...args) {
        return args.reduce(
          (total, current) => {
            let ret = []
            total.forEach((a) => {
              current.forEach((b) => {
                ret.push(a.concat([b]))
              })
            })
            return ret
          },
          [
            []
          ]
        )
      },
      submitSku() {
        if (this.skuFlag == '0') {
          for (var i = 0; i < this.tableColumnList.tableBodyList.length; i++) {
            if (this.tableColumnList.tableBodyList[i].pointPrice == '' || this.tableColumnList.tableBodyList[i]
              .totalUnit == '') {
              this.$message.error('请输入积分数量或者活动库存')
              return;
            }
          }
          this.dialogTableVisible = false
          this.open = false
        } else {
          for (var i = 0; i < this.singleProList.length; i++) {
            if (this.singleProList[i].pointPrice == '' || this.singleProList[i]
              .totalUnit == '') {
              this.$message.error('请输入积分数量或者活动库存')
              return;
            }
          }
          this.singleTableVisible = false
          this.open = false
        }
        if (this.status == 'add') {
          let para = {
            activeId: this.$route.query.id,
            // merchantId: this.queryParams.merchantId,
            merchantId: '74082296197545984',
            // merchantName: this.formData.merchantName,
            merchantName: '森森服饰',
            amountMethod: this.formData.amountMethod,
            productId: this.changeProductId,
            productMainImage: this.spikeMainImage,
            productName: this.spikeName,
            productCateId: this.productCateId,
            // activeProductSkuRequestList: this.tableColumnList.tableBodyList
          }
          if (this.skuFlag == '0') {
            para.activeProductSkuRequestList = this.tableColumnList.tableBodyList
          } else {
            para.activeProductSkuRequestList = this.singleProList
          }
          merchantAddPointProduct(para).then(response => {
            if (response.code == 200) {
              this.$modal.msgSuccess("配置成功");
              this.spikeProList()
            }
          });
        } else if (this.status == 'edit') {
          let para = {
            activeId: this.$route.query.id,
            id: this.keyId,
            merchantId: this.queryParams.merchantId,
            merchantName: this.formData.merchantName,
            amountMethod: this.formData.amountMethod,
            productId: this.changeProductId,
            productMainImage: this.spikeMainImage,
            productName: this.spikeName,
            productCateId: this.productCateId,
            activeProductSkuRequestList: this.tableColumnList.tableBodyList
          }
          if (this.skuFlag == '0') {
            para.activeProductSkuRequestList = this.tableColumnList.tableBodyList
          } else {
            para.activeProductSkuRequestList = this.singleProList
          }
          merchantModifyPointProduct(para).then(response => {
            if (response.code == 200) {
              this.$modal.msgSuccess("配置成功");
              this.spikeProList()
            }
          });
        }
      },
      handleUpdate(row) {
        this.status = 'edit'
        // this.dialogTableVisible = true
        let para = {
          id:row.id
        }
        queryPointProductDetail(para).then(response => {
          this.productSkuAttrRequestList = response.data.mallProductResponse.productSkuAttrResponseList
          this.proList = response.data.mallProductResponse.activeProductSkuEntityList
          this.rowItem = response.data.mallProductResponse.activeProductSkuEntityList
          this.cateAttrFlag = response.data.mallProductResponse.mallProductEntity.skuFlag
          this.queryParams.merchantId = response.data.merchantId
          this.changeProductId = response.data.productId
          this.spikeMainImage = response.data.productMainImage
          this.spikeName = response.data.productName
          this.keyId = response.data.id
          this.formData.merchantName = response.data.merchantName
          this.formData.amountMethod = response.data.amountMethod
          if (response.data.mallProductResponse.mallProductEntity.skuFlag == '1') {
            this.skuFlag = '1'
            this.singleTableVisible = true
            this.singleProList = response.data.mallProductResponse.activeProductSkuEntityList
          } else {
            this.skuFlag = '0'
            this.dialogTableVisible = true
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        let para = {
          id:row.id
        }
        this.$modal.confirm('是否确认删除该商品？').then(function() {
          return merchantRemovePointProduct(para);
        }).then(() => {
          this.spikeProList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.spikeQuery.pageNum = 1;
        this.spikeProList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.spikeQuery.pageSize = 10,
          this.spikeQuery.merchantId = ''
        this.resetForm("queryForm");
        this.handleQuery();
      },
      addClick() {
        this.open = true
        this.getList()
      },
    }
  }
</script>
<style scoped>

</style>
