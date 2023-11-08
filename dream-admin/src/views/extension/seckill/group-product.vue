<template>
  <div class="app-container">
    <el-form :model="spikeQuery" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="选择商家" prop="merchantId">
        <el-select style="width: 240px" v-model="spikeQuery.merchantId" clearable :filter-method="searchHandle" filterable
          placeholder="请选择商家" v-el-select-loadmore="loadmore" @change="selectChange" @keyup.delete.native="deleteHandle">
          <el-option v-for="item in merchantOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称" prop="productName">
        <el-input v-model="spikeQuery.productName" placeholder="请输入商品名称" clearable />
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

    <el-table v-loading="loading" table-layout="auto"  :data="spikeList" :border="true">
      <el-table-column label="商家" prop="merchantName" align="center" />
      <el-table-column label="商品名称" how-overflow-tooltip prop="productName" align="center" />
      <el-table-column label="商品原价" prop="productOriginalPrice" align="center" />
      <el-table-column label="拼团价格" prop="unitPrice" align="center" />
      <el-table-column label="拼团库存" prop="totalUnit" align="center" />
      <el-table-column label="拼团人数" prop="groupNum" align="center" />
      <el-table-column prop="productMainImage" label="图片" align="center">
        <template slot-scope="scope">
          <el-popover placement="right"  trigger="hover">
            <img :src="`${imgHost}` + scope.row.productMainImage" alt="" style="width: 100px;height: 100px">
            <img slot="reference" :src="`${imgHost}` + scope.row.productMainImage"
              style="max-height: 40px;max-width: 40px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="是否上线" prop="status"  align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" @change="handleDefault(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" how-overflow-tooltip prop="createTime" align="center" />
      <el-table-column label="修改时间" how-overflow-tooltip prop="updateTime" align="center" />
      <el-table-column label="操作" align="center" fixed="right"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:swiper:edit']">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="searchTotal > 0" :total="searchTotal" :page.sync="spikeQuery.pageNum"
      :limit.sync="spikeQuery.pageSize" @pagination="spikeProList" />

    <!-- 选择商品 -->
    <el-dialog title="选择商品" :visible.sync="open" width="60%">
      <el-form ref="elForm" :model="queryParams" :rules="rules" :inline="true" size="small" label-width="100px">
        <el-form-item label="选择商家" prop="merchantName">
          <el-select style="width: 240px;" v-model="merchantName"  :filter-method="searchHandle" filterable placeholder="请选择商家"
            v-el-select-loadmore="loadmore" @change="selectChange" @keyup.delete.native="deleteHandle">
            <el-option v-for="item in merchantOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="queryParams.productName" placeholder="请输入商品名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="proNameQuery">查询</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="productList" :border="true" height="500px">
        <el-table-column label="商品" prop="productName" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.mallProductEntity.productName }}</span>
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
        <el-table-column label="商家" prop="productName" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.merchantName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品原价" prop="productName" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.mallProductEntity.unitPrice }} ~ {{ scope.row.mallProductEntity.unitMaxPrice }}</span>
          </template>
        </el-table-column>

        <el-table-column label="成团人数" prop="groupNum" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.mallProductEntity.groupNum" size="mini" clearable type="number"
              @change="sumGroupNum(scope.row)" />
          </template>
        </el-table-column>

        <el-table-column label="商品规格" prop="redPacketNum" align="center">
          <template slot-scope="scope">
            <el-button type="warning" plain @click="selsectSku(scope.row)">选择商品规格</el-button>
          </template>
        </el-table-column>

      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </el-dialog>

    <el-dialog title="商品规格" :visible.sync="dialogTableVisible" width="45%">
      <el-table :data="tableColumnList.tableBodyList" style="width: 100%" :border="true" ref="multipleTable" height="500px">
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
        <el-table-column prop="totalUnit" label="拼团库存" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.totalUnit" size="mini" clearable type="number" />
          </template>
        </el-table-column>
        <el-table-column prop="activePrice" label="拼团价格" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.activePrice" size="mini" clearable type="number"
              @change="sumPlanNum(scope.row.activePrice, scope.row.unitPrice, scope.row.index)" />
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

    <el-dialog title="商品规格" :visible.sync="singleTableVisible" width="50%">
      <el-table :data="singleProList" style="width: 100%" ref="singleTable" :border="true" height="500px">
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
        <el-table-column prop="totalUnit" label="拼团库存" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.totalUnit" size="mini" clearable type="number" />
          </template>
        </el-table-column>
        <el-table-column prop="activePrice" label="拼团价格" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.activePrice" size="mini" clearable type="number"
              @change="sumPlanNum(scope.row.activePrice, scope.row.unitPrice, 0)" />
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

    <el-dialog title="修改规格" :visible.sync="editDialog" width="50%">
      <el-table v-loading="loading" :data="editProductList" height="500px" :border="true">
        <el-table-column label="商品" prop="productName" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" prop="redPacketNum" align="center">
          <template slot-scope="scope">
            <el-popover placement="right" width="150" trigger="hover">
              <img :src="`${imgHost}` + scope.row.productMainImage" alt="" style="width: 150px;height: 150px">
              <img slot="reference" :src="`${imgHost}` + scope.row.productMainImage"
                style="max-height: 40px;max-width: 40px">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="成团人数" prop="groupNum" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.groupNum" size="mini" clearable type="number" @input="editGroupNum(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="商品规格" prop="redPacketNum" align="center">
          <template slot-scope="scope">
            <el-button type="warning" plain @click="editSelsectSku(scope.row)">选择商品规格</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="fotterBtn mt20">
        <el-button @click="editDialog = false">取消</el-button>
        <el-button type="primary" @click="submitSku">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  updateData
} from "@/api/system/dict/data";
import {
  searchMerchantList
} from "@/api/mall-merchant/merchant";
import {
  listProduct,
  getProduct,
} from "@/api/product/product";
import {
  addGroupProduct,
  getGroupProductList,
  getGroupProduct,
  updateGroupProduct,
  modifyGroupProductStatus
} from "@/api/market/seckill";
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
      },
      rules: {},
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        shelfFlag: 0,
        productName: ''
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
      singleTableVisible: false,
      rowItem: [],
      spikeQuery: {
        pageNum: 1,
        pageSize: 10,
        merchantId: '',
        groupActiveId: this.$route.query.id,
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
      groupNum: '',
      editDialog: false,
      editProductList: [],
      singleProList: [],
      skuFlag: '0',
      codePage: {
        pageNum: 1,
        pageSize: 10,
      },
      pages: '',
      arr: [],
      seleProduct:{}
    }
  },
  directives: { //注意：这个是写到data外面
    'el-select-loadmore': {
      bind(el, binding) {
        const SELECTWRAP_DOM = el.querySelector(
          '.el-select-dropdown .el-select-dropdown__wrap'
        )
        SELECTWRAP_DOM.addEventListener('scroll', function () {
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
                  obj.pointPrice = 0
                } else {
                  obj.totalUnit = this.proList[j].totalUnit
                }
                obj.unitPrice = this.proList[j].unitPrice
                obj.productWeight = this.proList[j].productWeight
                obj.activeId = this.$route.query.activeId
                obj.activePrice = this.proList[j].activePrice ? this.proList[j].activePrice : ''
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
    this.handleChange(1)
  },
  mounted() { },
  methods: {
    loadmore() {
      this.codePage.pageNum++
      this.handleChange(this.codePage.pageNum)
    },
    handleChange(data) {
      let param = {
        merchantName: this.merchantName,
        pageNum: data,
        approveStatus: 'APPROVED',
        pageSize: this.codePage.pageSize,
      };
      this.searchMerchant(param)
    },
    deleteHandle() { },
    searchHandle(data) {
      this.arr = []
      let param = {
        merchantName: data,
        pageNum: 1,
        approveStatus: 'APPROVED',
        pageSize: this.codePage.pageSize,
      };
      this.searchMerchant(param)
    },
    searchMerchant(param) {
      searchMerchantList(param).then(res => {
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
          console.log(this.merchantOptions)
          this.pages = res.total
        } else {
          this.$message({
            message: res.message,
            type: "error",
          });
        }
      });
    },
    spikeProList() {
      getGroupProductList(this.spikeQuery).then(res => {
        this.spikeList = res.rows
        this.searchTotal = res.total;
      })
    },
    resetForm() {
      this.merchantName=""
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
    selectChange(val) {
      this.formData.merchantId = val
      this.formData.merchantName = this.merchantName
      this.getList()
    },
    proNameQuery() {
      this.getList()
    },
    /** 查询商品列表 */
    getList() {
      this.loading = true;
      this.queryParams.merchantId = this.formData.merchantId
      if (this.queryParams.merchantId || this.queryParams.productName) {
        listProduct(this.queryParams).then(response => {
          for (var i = 0; i < response.rows.length; i++) {
            response.rows[i].mallProductEntity.groupNum = ''
          }
          this.productList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      } else if (this.queryParams.merchantId == '' && this.queryParams.productName == '') {
        this.productList = []
        this.loading = false;
      }
    },
    selsectSku(val) {
      if (val.mallProductEntity.groupNum == '') {
        this.$message.error('请先输入成团人数')
        return;
      }
      this.status = 'add'
      this.changeProductId = val.mallProductEntity.id
      this.spikeMainImage = val.mallProductEntity.productMainImage
      this.spikeName = val.mallProductEntity.productName
      this.groupNum = val.mallProductEntity.groupNum
      this.seleProduct=val;
      if (val.mallProductEntity.skuFlag == '1') {
        this.skuFlag = '1'
        this.singleTableVisible = true
      } else {
        this.dialogTableVisible = true
        this.skuFlag = '0'
      }
      getProduct(val.mallProductEntity.id).then(response => {
        if (val.mallProductEntity.skuFlag == '0') {
          this.productSkuAttrRequestList = response.data.productSkuAttrResponseList
          this.proList = response.data.productSkuResponseList
          this.rowItem = response.data.productSkuResponseList
          this.cateAttrFlag = response.data.mallProductEntity.skuFlag
        } else {
          let arr = response.data.productSkuResponseList
          arr.forEach(item => {
            item.activeId = this.$route.query.activeId
            item.totalUnit = ''
            item.pointPrice = 0
            item.cateAttrFlag = response.data.mallProductEntity.skuFlag
            this.$set(item, 'activePrice', '')
          })
          this.singleProList = arr
        }

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
      if (this.skuFlag == '0') {
        for (var i = 0; i < this.tableColumnList.tableBodyList.length; i++) {
          if (this.tableColumnList.tableBodyList[i].activePrice == '' || this.tableColumnList.tableBodyList[i]
            .totalUnit == '') {
            this.$message.error('请输入拼团价格或者拼团库存')
            return;
          }
        }
        this.dialogTableVisible = false
        this.open = false
      } else {
        for (var i = 0; i < this.singleProList.length; i++) {
          if (this.singleProList[i].activePrice == '' || this.singleProList[i]
            .totalUnit == '') {
            this.$message.error('请输入拼团价格或者拼团库存')
            return;
          }
        }
        this.singleTableVisible = false
        this.open = false
      }
      if (this.status == 'add') {
        let para = {
          activeId: this.$route.query.activeId,
          groupActiveId: this.$route.query.id,
          merchantId: this.seleProduct.mallProductEntity.merchantId,
          merchantName: this.seleProduct.merchantName,
          productId: this.changeProductId,
          productMainImage: this.spikeMainImage,
          productName: this.spikeName,
          groupNum: this.groupNum,
        }
        if (this.skuFlag == '0') {
          para.activeProductSkuRequestList = this.tableColumnList.tableBodyList
        } else {
          para.activeProductSkuRequestList = this.singleProList
        }
        addGroupProduct(para).then(response => {
          if (response.code == 200) {
            this.$modal.msgSuccess("配置成功");
            this.spikeProList()
          } else {
            this.$modal.msgError(response.msg);
          }
        });
      } else if (this.status == 'edit') {
        let para = {
          activeId: this.$route.query.activeId,
          groupActiveId: this.$route.query.id,
          id: this.keyId,
          merchantId: this.seleProduct.merchantId,
          merchantName: this.seleProduct.merchantName,
          productId: this.changeProductId,
          productMainImage: this.spikeMainImage,
          productName: this.spikeName,
          groupNum: this.groupNum,
          // activeProductSkuRequestList: this.tableColumnList.tableBodyList
        }
        if (this.skuFlag == '0') {
          para.activeProductSkuRequestList = this.tableColumnList.tableBodyList
        } else {
          para.activeProductSkuRequestList = this.singleProList
        }
        updateGroupProduct(para).then(response => {
          if (response.code == 200) {
            this.editDialog = false
            this.$modal.msgSuccess("配置成功");
            this.skuFlag = '0'
            this.spikeProList()
          } else {
            this.$modal.msgError(response.msg);
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
    sumPlanNum(a, b, index) {
      if (a > b) {
        this.$message.error('活动价格不能大于原价')
        if (this.skuFlag == '0') {
          this.tableColumnList.tableBodyList[index].activePrice = ''
        } else {
          this.singleProList[index].activePrice = ''
        }
        return;
      }
    },
    handleUpdate(row) {
      this.status = 'edit'
      this.editProductList = []
      getGroupProduct(row.id).then(response => {
        this.seleProduct=response.data;
        this.formData.merchantName = response.data.merchantName
        this.editProductList.push(response.data);
        this.groupNum = response.data.groupNum
        this.productSkuAttrRequestList = response.data.mallProductResponse.productSkuAttrResponseList
        this.proList = response.data.mallProductResponse.activeProductSkuEntityList
        this.rowItem = response.data.mallProductResponse.activeProductSkuEntityList
        this.cateAttrFlag = response.data.mallProductResponse.mallProductEntity.skuFlag
        this.queryParams.merchantId = response.data.merchantId
        this.changeProductId = response.data.productId
        this.spikeMainImage = response.data.productMainImage
        this.spikeName = response.data.productName
        this.keyId = response.data.id
        if (response.data.mallProductResponse.mallProductEntity.skuFlag == '1') {
          this.skuFlag = '1'
          this.singleProList = response.data.mallProductResponse.activeProductSkuEntityList
        } else {
          this.skuFlag = '0'
        }
        this.editDialog = true
      });
    },
    editSelsectSku(val) {
      if (val.mallProductResponse.mallProductEntity.skuFlag == '0') {
        this.dialogTableVisible = true
        this.skuFlag = '0'
      } else {
        this.singleTableVisible = true
        this.skuFlag = '1'
      }
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
      this.$refs['queryForm'].resetFields()
      this.handleQuery();
    },
    // 修改状态
    handleDefault(row) {
      let text = row.status === "0" ? "上线" : "下线";
      this.$modal.confirm('确认要' + text + '"' + row.productName + '"该商品吗？').then(function () {
        let para = {
          id: row.id,
          status: row.status
        }
        return modifyGroupProductStatus(para);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function () {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    sumGroupNum(a) {
      this.groupNum = a.groupNum
      if (a.mallProductEntity.groupNum > 5) {
        this.$message.error('成团人数最多5人')
        a.mallProductEntity.groupNum = ''
        return;
      }
    },

    editGroupNum(a) {
      this.groupNum = a.groupNum
      console.log(111, this.groupNum)
      // this.editProductList[0].groupNum = a.groupNum
      // this.$forceUpdate()
      if (a.groupNum > 5) {
        this.$message.error('成团人数最多5人')
        a.groupNum = ''
        return;
      }
    },
    addClick() {
      this.open = true
      this.productList = []
      this.merchantName = ''
    },
    // submitSingle(){

    // },
  }
}
</script>
