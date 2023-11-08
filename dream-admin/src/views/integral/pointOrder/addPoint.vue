<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="选择商家" prop="merchantId">
        <el-select 
          v-model="queryParams.merchantId" 
            style="width: 240px" filterable remote 
             reserve-keyword
              placeholder="请输入商家名称" 
              :remote-method="searchMerchantByName"
            :loading="loading">
          <el-option v-for="item in merchantOptions" :value="item.mallMerchantEntity.id" :key="item.mallMerchantEntity.id" :label="item.mallMerchantEntity.merchantName">
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addClick()"
          v-hasPermi="['system:swiper:add']">新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="spikeProList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="spikeList" border>
      
      <el-table-column label="商品名称" prop="productName" align="center" />
      <el-table-column prop="productMainImage" label="图片" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" width="100" trigger="hover">
            <img :src="`${imgHost}` + scope.row.productMainImage" alt="" style="width: 100px;height: 100px">
            <img slot="reference" :src="`${imgHost}` + scope.row.productMainImage"
              style="max-height: 40px;max-width: 40px">
          </el-popover>
        </template>
      </el-table-column>
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
        <el-table-column label="兑换价格" prop="productCashPrice" align="center" >
          <template slot-scope="scope">
            <span>{{ scope.row.productCashPrice }}</span>
          </template>
        </el-table-column>
      
      <el-table-column label="创建时间" prop="createTime" align="center" />
      <el-table-column label="修改时间" prop="updateTime" align="center" />
      <!-- <el-table-column label="是否上线" prop="status" width="200" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" @change="handleDefault(scope.row)">
          </el-switch>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" fixed="right" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:swiper:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:swiper:remove']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="spikeProList" />

    <!-- 选择商品 -->
    <el-dialog title="选择商品" :visible.sync="open">
      <el-form ref="elForm" :model="chooseParam" :rules="rules" :inline="true" size="medium">
        <el-form-item label="选择商家" prop="merchantId">
          <el-select style="width: 240px" 
          v-model="chooseParam.merchantId" 
          filterable remote reserve-keyword
            placeholder="请输入关键词" 
            :remote-method="searchMerchantByName">
            <el-option v-for="item in merchantOptions" :value="item.mallMerchantEntity.id" :key="item.mallMerchantEntity.id" :label="item.mallMerchantEntity.merchantName">
          </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="chooseParam.productName" placeholder="请输入商品名称" clearable style="width: 240px"
            @keyup.enter.native="handleQuery" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuerProduct">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="chooseLoading" :data="productList" border  height="500">
        <el-table-column label="商品名称" prop="productName" align="center" >
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
              <img :src="`${imgHost}` + scope.row.mallProductEntity.productMainImage" alt=""
                style="width: 150px;height: 150px">
              <img slot="reference" :src="`${imgHost}` + scope.row.mallProductEntity.productMainImage"
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
      <pagination v-show="chooseTotal > 0" :total="chooseTotal" :page.sync="chooseParam.pageNum"
        :limit.sync="chooseParam.pageSize" @pagination="getList" />
    </el-dialog>

    <!-- 规格选择 -->
    <el-dialog title="商品规格" :visible.sync="singleTableVisible">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-radio v-model="formData.amountMethod" label="POINT" border>积分</el-radio>
          <el-radio v-model="formData.amountMethod" label="POINT_CASH" border>积分+现金</el-radio>
        </el-col>
     </el-row>
      <el-table :data="singleProList" ref="singleTable" height="500px" :border="true">
        <el-table-column prop="productCode" label="编码" align="center">
          <template slot-scope="scope">
            {{ scope.row.productCode }}
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" label="价格" align="center">
          <template slot-scope="scope">
            {{ scope.row.unitPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="productCostPrice" label="成本价" align="center">
          <template slot-scope="scope">
            {{ scope.row.productCostPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="totalUnit" width="150"  label="活动库存" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.totalUnit" size="mini" clearable type="number" />
          </template>
        </el-table-column>
        <el-table-column prop="pointPrice" width="150"  label="积分数量" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.pointPrice" size="mini" clearable type="number" />
          </template>
        </el-table-column>
        <el-table-column prop="activePrice" width="150"  label="现金价格" align="center" v-if="formData.amountMethod == 'POINT_CASH'">
          <template slot-scope="scope">
            <el-input v-model="scope.row.activePrice" size="mini" clearable type="number" />
          </template>
        </el-table-column>
        <el-table-column prop="productAttrImg" label="图片" align="center">
          <template slot-scope="scope">
            <el-popover placement="right" width="100" trigger="hover">
              <img :src="`${imgHost}` + scope.row.productAttrImg" alt="" style="width: 100px;height: 100px">
              <img slot="reference" :src="`${imgHost}` + scope.row.productAttrImg"
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

    <!-- 修改 -->
    <el-dialog title="商品规格" :visible.sync="dialogTableVisible">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-radio v-model="formData.amountMethod" label="POINT" border>积分</el-radio>
          <el-radio v-model="formData.amountMethod" label="POINT_CASH" border>积分+现金</el-radio>
        </el-col>
     </el-row>
      <el-table :data="tableColumnList.tableBodyList" :border="true"  ref="multipleTable" height="500">
        <el-table-column :label="item.propName" :property="item.prop" v-for="item in tableColumnList.tableHeaderList"
          :key="item.prop" align="center" fixed="left">
          <template slot-scope="scope">
            <span>{{ scope.row[scope.column.property] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productCode" label="编码" align="center">
          <template slot-scope="scope">
            {{ scope.row.productCode }}
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" label="价格" align="center">
          <template slot-scope="scope">
            {{ scope.row.unitPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="productCostPrice" label="成本价" align="center">
          <template slot-scope="scope">
            {{ scope.row.productCostPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="totalUnit" width="150" label="活动库存" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.totalUnit" size="mini" clearable type="number" />
          </template>
        </el-table-column>
        <el-table-column prop="pointPrice" width="150" label="积分数量" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.pointPrice" size="mini" clearable type="number" />
          </template>
        </el-table-column>
        <el-table-column prop="activePrice" width="150" label="现金价格" align="center" v-if="formData.amountMethod == 'POINT_CASH'">
          <template slot-scope="scope">
            <el-input v-model="scope.row.activePrice" size="mini" clearable type="number" />
          </template>
        </el-table-column>
        <el-table-column prop="productAttrImg" label="图片" align="center">
          <template slot-scope="scope">
            <el-popover placement="right" width="100" trigger="hover">
              <img :src="`${imgHost}` + scope.row.productAttrImg" alt="" style="width: 100px;height: 100px">
              <img slot="reference" :src="`${imgHost}` + scope.row.productAttrImg"
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
  searchMerchantList
  
} from "@/api/mall-merchant/merchant";
import {
  listProduct,
  getProduct
} from "@/api/product/product";
import {
  addPoint,
  pointList,
  getDetailsPoint,
  updatePoint,
  delPoint
  // modifySpikeTimeProductStatus
} from "@/api/market/point";
export default {
  name: 'Logistics',
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
        activeId: ''
      },
      chooseParam: {
        pageNum: 1,
        pageSize: 10,
        merchantId: '',
        productName: ''
      },
      chooseTotal: 0,
      total: 0,
      merchantOptions: [],
      merchantValue: '',
      list: [],
      states: [],
      merchantName: '',
      loading: false,
      chooseLoading: false,
      skuData: [],
      dialogTableVisible: false,
      rowItem: [],
      spikeQuery: {
        pageNum: 1,
        pageSize: 10,
        merchantId: '',

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
      total: 0,
      singleTableVisible: false,
      singleProList: [],
      skuFlag: '0',
      productCateId: '',
      seleProduct:{}
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
  methods: {
    spikeProList() {
      this.queryParams.activeId = this.$route.query.id
      pointList(this.queryParams).then(res => {
        this.spikeList = res.rows
        this.total = res.total;
      })
    },
   

    
    //查询商家
    loadmore() {
      this.chooseParam.pageNum++
      this.searchMerchantByName()
    },
    /**
     * @param {Object} data
     * 通过名称查询商户
     */
    searchMerchantByName(data) {
      let param = {
        merchantName: data,
        pageNum: this.chooseParam.pageNum,
        approveStatus: 'APPROVED',
        merchantAttribute: 'MALL',
        pageSize: this.chooseParam.pageSize,
      };
      this.searchMerchantList(param);
    },

    /**
     * @param {Object} param
     * 查询商户
     */
    searchMerchantList(param) {
      searchMerchantList(param).then(res => {
        if (res.code == 200) {
          this.merchantOptions = res.rows;
          this.pages = res.total;
        } else {
          this.$message({
            message: res.message,
            type: "error",
          });
        }
      });
    },
    
    /** 查询商品列表 */
    getList() {
      this.chooseLoading = true;
      listProduct(this.chooseParam).then(response => {
        this.productList = response.rows;
        this.chooseTotal = response.total;
        this.chooseLoading = false;
      });
    },
    //选择规格
    selsectSku(val) {

      this.status = 'add'
      this.changeProductId = val.mallProductEntity.id
      this.spikeMainImage = val.mallProductEntity.productMainImage
      this.spikeName = val.mallProductEntity.productName
      this.seleProduct = val;



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
        // this.productSkuAttrRequestList = response.data.productSkuAttrResponseList
        // this.proList = response.data.productSkuResponseList
        // this.rowItem = response.data.productSkuResponseList
        // this.cateAttrFlag = response.data.mallProductEntity.skuFlag
      });
    },
    cancel() { },
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
      if(this.formData.amountMethod == 'POINT_CASH'){
        //积分加现金
          if (this.skuFlag == '0') {
          for (var i = 0; i < this.tableColumnList.tableBodyList.length; i++) {
            if (this.tableColumnList.tableBodyList[i].pointPrice == '' || this.tableColumnList.tableBodyList[i].totalUnit == '' || this.singleProList[i].activePrice=='') {

              this.$message.error('请输入积分数量或者活动库存,现金价格')
              return;
            }
          }
          this.dialogTableVisible = false
          this.open = false
        } else {

          for (var i = 0; i < this.singleProList.length; i++) {
            if (this.singleProList[i].pointPrice == '' || this.singleProList[i].totalUnit == '' || this.singleProList[i].activePrice=='') {
              this.$message.error('请输入积分数量或者活动库存,现金价格')
              return;
            }
          }
          this.singleTableVisible = false
          this.open = false
        }
      }else{
        if (this.skuFlag == '0') {
          for (var i = 0; i < this.tableColumnList.tableBodyList.length; i++) {
            if (this.tableColumnList.tableBodyList[i].pointPrice == '' || this.tableColumnList.tableBodyList[i].totalUnit == '' ) {

              this.$message.error('请输入积分数量或者活动库存')
              return;
            }
          }
          this.dialogTableVisible = false
          this.open = false
        } else {

          for (var i = 0; i < this.singleProList.length; i++) {
            if (this.singleProList[i].pointPrice == '' || this.singleProList[i].totalUnit == '' ) {
              this.$message.error('请输入积分数量或者活动库存')
              return;
            }
          }
          this.singleTableVisible = false
          this.open = false
        }

      }
      if (this.status == 'add') {
        let para = {
              activeId: this.$route.query.id,
              merchantId:  this.seleProduct.mallProductEntity.merchantId,
              merchantName:  this.seleProduct.merchantName,
              amountMethod: this.formData.amountMethod,
              productId: this.changeProductId,
              productMainImage: this.spikeMainImage,
              productName: this.spikeName,
              productCateId: this.productCateId,
              activeProductSkuRequestList:[]
        }
        if (this.skuFlag == '0') {
          para.activeProductSkuRequestList = this.tableColumnList.tableBodyList
        } else {
          para.activeProductSkuRequestList = this.singleProList
        }
        addPoint(para).then(response => {
          if (response.code == 200) {
            this.$modal.msgSuccess("配置成功");
            this.spikeProList()
          }
        });
      } else if (this.status == 'edit') {
        let para = {
          activeId: this.$route.query.id,
          id: this.keyId,
          merchantId: this.seleProduct.merchantId,
          merchantName: this.seleProduct.merchantName,
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
        updatePoint(para).then(response => {
          if (response.code == 200) {
            this.$modal.msgSuccess("配置成功");
            this.spikeProList()
          }
        });
      }
    },
    // sumPlanIncome(a, index) {
    //   if (a > this.rowItem[index].totalUnit) {
    //     this.$message.error('秒杀库存不能大于实际库存')
    //     this.tableColumnList.tableBodyList[index].totalUnit = ''
    //     return;
    //   }
    // },
    handleUpdate(row) {
      this.status = 'edit'
      getDetailsPoint(row.id).then(response => {
        this.seleProduct =response.data;
        this.productCateId=response.data.mallProductResponse.mallProductEntity.productCateId
        this.productSkuAttrRequestList = response.data.mallProductResponse.productSkuAttrResponseList
        this.proList = response.data.mallProductResponse.activeProductSkuEntityList
        this.rowItem = response.data.mallProductResponse.activeProductSkuEntityList
        this.cateAttrFlag = response.data.mallProductResponse.mallProductEntity.skuFlag
        // this.queryParams.merchantId = response.data.merchantId
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
      const centreIds = row.id || this.ids;
      this.$modal.confirm('是否确认删除该商品？').then(function () {
        return delPoint(centreIds);
      }).then(() => {
        this.spikeProList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.spikeProList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.pageSize = 10;
      this.queryParams.merchantId = '';
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //商品选择重置
    resetQuerProduct(){
      this.chooseParam.pageNum=1;
      this.$refs['elForm'].resetFields()
    },
    // 修改状态
    handleDefault(row) {
      let text = row.status === "0" ? "上线" : "下线";
      this.$modal.confirm('确认要' + text + '"' + row.productName + '"该商品吗？').then(function () {
        let para = {
          id: row.id,
          status: row.status
        }
        return modifySpikeTimeProductStatus(para);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function () {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    addClick() {
      this.open = true
      this.merchantName = ''
      this.productList = []
    },
  }
}
</script>
<style scoped></style>
