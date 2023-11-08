<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="所属" prop="popupAttribute">
        <el-select v-model="queryParams.popupAttribute" placeholder="请选择弹窗所属" clearable>
          <el-option v-for="(item, index) in popupAttributeOptions" :key="index" :label="item.label"
            :value="item.value">
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
          v-hasPermi="['system:popupconfig:add']">新增</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="popupList" border>
      <el-table-column prop="url" label="归属" width="180" align="center">
        <template slot-scope="scope">
          {{scope.row.popupAttribute==='MALL'?'商城':'社区'}}
        </template>
      </el-table-column>
      <el-table-column prop="photoUrl" label="弹窗图片" width="180" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" width="300" trigger="hover">
            <img :src="`${imgHost}`+scope.row.photoUrl" alt="" style="width: 140px;height: 100px">
            <img slot="reference" :src="`${imgHost}`+ scope.row.photoUrl" style="height: 50px;width: 90px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="弹窗内容" prop="popupType" width="300" align="center">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_popup_type" :value="scope.row.popupType" />
        </template>
      </el-table-column>
      <el-table-column label="是否显示" align="center" width="200">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enableFlag" active-value="0" inactive-value="1"
            @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:popupconfig:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:coupon:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 新增弹窗 -->
    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="弹窗归属" prop="popupAttribute" required="">
          <el-radio-group v-model="formData.popupAttribute" size="medium">
            <el-radio-button label="MALL">商城</el-radio-button>
            <el-radio-button label="COMMUNITY">社区</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="弹窗图片" prop="photoUrl">
          <el-upload
             ref="upload"
            :action="uploadFileUrl"
            :headers="headers"
            list-type="picture-card"
            :before-upload="urlBeforeUpload"
            :file-list="fileList"
            :limit="1" :on-success="handleAvatarSuccess">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">建议上传封面600X1080以内，大小不能超5M(首张用于商品封面)</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="链接内容" prop="popupType">
          <!-- <el-radio-group v-model="formData.popupType" size="mini" @input="radioFunction">
            <el-radio-button v-for="(item, index) in popupOptions" :key="index"
              :label="item.dictValue">{{item.dictLabel}}</el-radio-button>
          </el-radio-group> -->
            <el-select v-model="formData.popupType" filterable placeholder="请选择链接内容" :clearable="true" @change="selectFunction">
              <el-option
                v-for="item in popupOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="第三方地址" prop="link" v-if="formData.popupType==='THIRD_LINK'">
          <el-input v-model="formData.link" placeholder="跳转第三方地址,例如: https://www.baidu.com/">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>

    <!-- 商品选择 -->
    <el-dialog title="商品选择" :visible.sync="productOpen">
      <el-form :model="chooseParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="商家名称" prop="merchantName">
          <el-select v-model="chooseParams.merchantId" clearable :filter-method="searchMerchantByName" filterable
            placeholder="请选择商家" v-el-select-loadmore="loadmore">
            <el-option v-for="item in merchantOptions" :key="item.mallMerchantEntity.id"
              :label="item.mallMerchantEntity.merchantName" :value="item.mallMerchantEntity.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="chooseParams.productName" placeholder="请输入商品名称" clearable style="width: 240px"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getProductList">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetChooseParams">重置</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="setCurrent()">取消选择</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="singleTable" v-loading="chooseLoading" :data="productList" border height="500"
        highlight-current-row  @row-click="handleCurrentChange">
        <el-table-column align="center" width="200" label="选择">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="templateSelection" :label="scope.row.mallProductEntity.id">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="商家名称" prop="merchantName" width="200" align="center" />
        <el-table-column label="商品上传时间" prop="createTime" width="200" align="center">
          <template slot-scope="scope">
            {{scope.row.mallProductEntity.createTime}}
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="productName" width="300" align="center">
          <template slot-scope="scope">
            <span class="receiptsNumStyle"
              @click="receiptsNumClick(scope.row)">{{scope.row.mallProductEntity.productName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="img" label="图片" width="220" align="center">
          <template slot-scope="scope">
            <el-popover placement="right" width="200" trigger="hover">
              <img :src="`${imgHost}` +scope.row.mallProductEntity.productMainImage" alt=""
                style="width: 150px;height: 100px">
              <img slot="reference" :src="`${imgHost}` + scope.row.mallProductEntity.productMainImage"
                style="height: 40px;width: 60px">
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="chooseTotal>0" :total="chooseTotal" :page.sync="chooseParams.pageNum"
        :limit.sync="chooseParams.pageSize" @pagination="getProductList" />
      <div slot="footer">
        <el-button @click="productOpen=false">取消</el-button>
        <el-button type="primary" @click="chooseSubmit">确定</el-button>
      </div>
    </el-dialog>

    <!-- 优惠券选择 -->
    <el-dialog title="优惠券选择" :visible.sync="couponOpen">
      <el-form :model="chooseParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="商家名称" prop="merchantName">
          <el-select v-model="chooseParams.merchantId" clearable :filter-method="searchMerchantByName" filterable
            placeholder="请选择商家" v-el-select-loadmore="loadmore">
            <el-option v-for="item in merchantOptions" :key="item.mallMerchantEntity.id"
              :label="item.mallMerchantEntity.merchantName" :value="item.mallMerchantEntity.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input v-model="chooseParams.couponName" placeholder="请输入优惠券名称" clearable style="width: 240px"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getCouponList">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetChooseParams">重置</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="setCurrent()">取消选择</el-button>
        </el-form-item>
      </el-form>

      <el-table ref="singleTable" v-loading="chooseLoading" :data="couponList" border height="500" highlight-current-row
        @row-click="handleCurrentChange">
        <el-table-column align="center" width="200" label="选择">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="templateSelection" :label="scope.row.couponEntity.id">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="优惠券所属" prop="belongType" width="150" align="center">
          <template slot-scope="scope">
            {{scope.row.couponEntity.belongType=='PLATFORM' ? '平台' : '商家'}}
          </template>
        </el-table-column>
        <el-table-column label="商家名称" prop="merchantName" width="200" align="center">
          <template slot-scope="scope">
            {{scope.row.merchantName}}
          </template>
        </el-table-column>
        <el-table-column label="价额" width="300" align="center">
          <template slot-scope="scope">
            {{scope.row.couponEntity.discountType == 'FULL_DISCOUNT' ? scope.row.couponEntity.benefitCash +'元（满'+ scope.row.couponEntity.conditionAmount+'元可用）' : '折扣率'+scope.row.couponEntity.benefitDiscount+'%（满'+ scope.row.couponEntity.conditionAmount + '元可用）' }}
          </template>
        </el-table-column>
        <el-table-column label="可用类型" prop="benefitType" width="150" align="center">
          <template slot-scope="scope">
            {{scope.row.couponEntity.benefitType=='0' ? '全场通用' : '指定商品'}}
          </template>
        </el-table-column>
        <el-table-column label="适用范围" prop="applyRange" width="150" align="center">
          <template slot-scope="scope">
            {{scope.row.couponEntity.applyRange=='NEWCOMER' ? '新人专享' : '所有人'}}
          </template>
        </el-table-column>
        <el-table-column label="优惠券名称" prop="couponName" width="150" align="center">
          <template slot-scope="scope">
            {{scope.row.couponEntity.couponName}}
          </template>
        </el-table-column>
        <el-table-column label="有效日期" prop="validType" width="300" align="center">
          <template slot-scope="scope">
            {{scope.row.couponEntity.validType == 'ASSIGN' ? scope.row.couponEntity.validStartDate + '至' + scope.row.couponEntity.validEndDate : scope.row.couponEntity.validDays + '天'}}
          </template>
        </el-table-column>
        <el-table-column label="优惠券数量" prop="issuedQuantity" width="150" align="center">
          <template slot-scope="scope">
            {{scope.row.couponEntity.issuedQuantity}}
          </template>
        </el-table-column>
        <el-table-column label="每人限领" prop="limitPerUser" width="150" align="center">
          <template slot-scope="scope">
            {{scope.row.couponEntity.limitPerUser}}
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="chooseTotal>0" :total="chooseTotal" :page.sync="chooseParams.pageNum"
        :limit.sync="chooseParams.pageSize" @pagination="getProductList" />
      <div slot="footer">
        <el-button @click="couponOpen=false">取消</el-button>
        <el-button type="primary" @click="chooseSubmit">确定</el-button>
      </div>
    </el-dialog>


    <!-- 活动选择 -->
    <el-dialog title="活动选择" :visible.sync="activeOpen">
      <el-table ref="singleTable" v-loading="chooseLoading" :data="activeList" border height="500" highlight-current-row
        @row-click="handleCurrentChange">
        <el-table-column align="center" width="200" label="选择">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="templateSelection" :label="scope.row.id">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="activeType" label="活动类型" width="180" align="center">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_market_type" :value="scope.row.activeType" />
          </template>
        </el-table-column>
        <el-table-column prop="activeName" label="活动名称" width="180" align="center" />
        <el-table-column label="活动开始时间" align="center" width="200" prop="beginTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.beginTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动结束时间" align="center" width="200" prop="endTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.endTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最大商品数" prop="merchantMaxProduct" align="center" />
        <el-table-column label="红包数量" prop="redEnvelopeNum" align="center" />
        <el-table-column label="红包金额" prop="redEnvelopeAmount" align="center" />
      </el-table>
      <pagination v-show="chooseTotal>0" :total="chooseTotal" :page.sync="chooseParams.pageNum"
        :limit.sync="chooseParams.pageSize" @pagination="getProductList" />
      <div slot="footer">
        <el-button @click="activeOpen=false">取消</el-button>
        <el-button type="primary" @click="chooseSubmit">确定</el-button>
      </div>
    </el-dialog>



  </div>
</template>
<script>
  import {
    listConfig,
    getConfig,
    addConfig,
    updateConfig,
    delConfig,
  } from "@/api/system/popup";
  import store from '@/store';
  import {
    getDicts
  } from "@/api/system/dict/data";


  import {
    listCentreCenter
  } from "@/api/market/centre";
  import {
    listProduct,
  } from "@/api/product/product";
  import {
    findProductList,
  } from "@/api/community/products";
  import {
    searchMerchantList
  } from "@/api/mall-merchant/merchant";
  import {
    listCoupon
  } from "@/api/system/coupon";
  export default {
    name: 'Popup',
    inheritAttrs: false,
    components: {},
    props: [],
    dicts: ['sys_popup_type','sys_market_type'],
    data() {
      var valiIcon = (rule, value, callback) => {
        // 图片验证
        if (this.formData.photoUrl == '') {
          callback(new Error("请上传弹窗图片"));
        } else {
          callback();
        }
      }
      return {
        headers: {
          Authorization: "Bearer " + store.getters.token
        },
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile/oss",
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
          popupType: undefined,
          link: undefined,
          enableFlag: "",
          popupAttribute: 'MALL',
          link: '',
          photoUrl: '',
          contentId: '',
        },
        fileList:[],
        popupAttributeOptions: [{
          "label": "商户",
          "value": "MALL"
        }, {
          "label": "社区",
          "value": "COMMUNITY"
        }],
        rules: {
          popupType: [{
            required: true,
            message: '链接内容不能为空',
            trigger: 'blur'
          }],
          link: [{
            required: true,
            message: '请输入第三方链接',
            trigger: 'blur'
          }],
          photoUrl: [{
            required: true,
            validator: valiIcon
          }],

        },
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        chooseParams: {
          pageNum: 1,
          pageSize: 10,
          merchantId: '',
          productName: '',
          couponAttribute: ''
        },
        merchantParams: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        chooseLoading: false,
        chooseTotal: 0,
        showSearch: true,
        popupList: [],
        popupOptions: [],
        productOpen: false,
        couponOpen: false,
        activeOpen: false,
        currentRow: null,
        templateSelection:'',
        productList: [],
        couponList: [],
        activeList: [],
        merchantOptions: []
      }
    },
    computed: {},
    watch: {},
    created() {
      this.getList()
      this.getDictType()
    },
    mounted() {},
    methods: {
      /** 查询列表 */
      getList() {
        this.loading = true;
        listConfig(this.queryParams).then(response => {
          if (response.rows.length > 0) {
            this.popupList = response.rows;
          }
          this.total = response.total;
          this.loading = false;
        });
      },
      //查询商品
      getProductList() {
        this.chooseLoading = true;
        listProduct(this.chooseParams).then(response => {
          this.productList = response.rows;
          this.chooseTotal = response.total;
          this.chooseLoading = false;
          this.productOpen = true;
        });
      },
      //查询优惠券
      getCouponList() {
        this.chooseLoading = true;
        listCoupon(this.chooseParams).then(response => {
          this.couponList = response.rows;
          this.chooseTotal = response.total;
          this.chooseLoading = false;
          this.couponOpen = true;
        });
      },
      /** 查询活动列表 */
      listCentreCenter() {
        this.chooseLoading = true;
        listCentreCenter(this.chooseParams).then(response => {
          this.activeList = response.rows;
          this.chooseTotal = response.total;
          this.chooseLoading = false;
        });
      },
      /**
       * @param {Object} e
       * 链接内容选择事件
       */
      selectFunction(e) {
        this.resetChooseParams();
        if (e === 'PRODUCT_DETAIL') {
          //商品详情
          this.productList = [];
          this.getProductList();
        } else if (e === 'ACCEPT_COUPON') {
          //单个优惠券
          if (this.formData.popupAttribute === 'MALL') {
            this.chooseParams.couponAttribute = 'MALL'
          } else {
            this.chooseParams.couponAttribute = 'COMMUNITY'
          }
          this.couponList = [];
          this.getCouponList();
        } else if (['SPIKE', 'GROUP', 'ACTIVE_PRODUCT'].includes(e)) {
          this.activeList=[];
          this.listCentreCenter();
          this.activeOpen=true;
        }

      },
      /**
       * @param {Object} row
       * 取消,选中
       */
      setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row);
      },
      //选择商品
      handleCurrentChange(val) {
        
        if (this.formData.popupType === 'ACCEPT_COUPON') {
          this.formData.contentId = val.couponEntity.id;
          this.templateSelection = val.couponEntity.id;
        } else if (this.formData.popupType === 'PRODUCT_DETAIL') {
          this.formData.contentId = val.mallProductEntity.id;
          this.templateSelection = val.mallProductEntity.id;
        }else if (['ACTIVE_PRODUCT','GROUP','SPIKE'].includes(this.formData.popupType)) {
          this.formData.contentId = val.id;
          this.templateSelection = val.id;
        }

      },
      //确认选择商品
      chooseSubmit() {
        if (this.formData.contentId === '') {
          let text_tip = ""
          if (this.formData.popupType === 'ACCEPT_COUPON') {
            text_tip = '请选择优惠券';
            this.couponOpen = true;
          }else if(['ACTIVE_PRODUCT','GROUP','SPIKE'].includes(this.formData.popupType)){
            text_tip = '请选择活动';
            this.activeOpen = true;
          } else {
            text_tip = '请选择商品';
            this.productOpen = true;
          }
          this.$message({
            message: text_tip,
            type: "error",
          });
          return
        }
        this.productOpen = false;
        this.couponOpen = false;
        this.activeOpen =false;
        this.merchantOptions = [];
        this.productList = [];
        this.couponList = [];
        this.activeList=[];
        this.resetChooseParams();
      },

      //查询商家
      loadmore() {
        this.merchantParams.pageNum++
        this.searchMerchantByName()
      },
      /**
       * @param {Object} data
       * 通过名称查询商户
       */
      searchMerchantByName(data) {
        let param = {
          merchantName: data,
          pageNum: this.merchantParams.pageNum,
          approveStatus: 'APPROVED',
          merchantAttribute: 'MALL',
          pageSize: this.merchantParams.pageSize,
        };
        this.searchMerchantList(param);
      },
      //重置参数
      resetChooseParams() {
        this.chooseParams = {
          pageNum: 1,
          pageSize: 10,
          merchantId: '',
          productName: '',
          couponName: ''
        };
      },
      /**
       * @param {Object} param
       * 查询商户
       */
      searchMerchantList(param) {
        searchMerchantList(param).then(res => {
          if (res.code == 200) {
            this.merchantOptions = res.rows;
            this.merchantParams.total = res.total;
          } else {
            this.$message({
              message: res.message,
              type: "error",
            });
          }
        });
      },
      //查询弹窗类型
      getDictType() {
        getDicts('sys_popup_type').then(res => {
          if (res.data.length > 0) {
            this.popupOptions = res.data
          }
        });
      },

      reset() {
        this.formData = {
            popupType: '',
            link: '',
            enableFlag: "",
            popupAttribute: 'MALL',
            link: '',
            photoUrl: '',
            contentId: ''
          },
          this.resetForm("formData");
          this.fileList=[];
          this.$nextTick(()=>{
             this.$refs.elForm.clearValidate();
          });
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.resetChooseParams()
        this.open = true;
        this.title = "添加弹窗设置";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const swiperId = row.id || this.ids
        getConfig(swiperId).then(response => {
          this.formData = response.data;
          this.fileList=[{url: this.imgHost+ this.formData.photoUrl}]

          this.open = true;
          this.title = "修改弹窗设置";
        });
      },
      //新建提交
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            if (this.formData.id != undefined) {
              updateConfig(this.formData).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.linkOpen = false;
                this.open = false;
                this.getList();
              });
            } else {
              addConfig(this.formData).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const swiperIds = row.id || this.ids;
        this.$modal.confirm('是否确认删除该条数据项？').then(function() {
          return delConfig(swiperIds);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.linkOpen = false;
        this.reset();
      },
      /**
       * @param {Object} file
       * 图片类型校验
       */
      urlBeforeUpload(file) {
        let isAccept = new RegExp('image/*').test(file.type);
        const isLt1M = file.size / 1024 / 1024 < 5
        if (!isAccept) {
          this.$message.error('图只能是 png、jpg、jpeg、gif格式!')
        }
        if (!isLt1M) {
          this.$message.error('上传图片大小不能超过 1MB!')
          return reject(false)
        }
        // this.limitFileWH(400, 400, file).then((res) => {
        //   file.isFlag = res
        //   if (file.isFlag) {
        //     return resolve(true)
        //   } else {
        //     return reject(false)
        //   }
        // })
        return isAccept
      },

      /**
       * @param {Object} res
       * @param {Object} file
       * 图片上传成功后事件
       */
      handleAvatarSuccess(res, file) {
        this.formData.photoUrl = res.data.url;
        if (this.formData.photoUrl != '') {
          this.$refs.elForm.clearValidate('url') //清除图片校验文字
        }
      },
      /**
       * @param {Object} row
       * 状态修改
       */
      handleStatusChange(row) {
        let text = row.enableFlag === "0" ? "显示" : "关闭";
        this.$modal.confirm('确认要"' + text + '"该弹窗吗？').then(function() {
          return updateConfig(row);
        }).then(() => {
          this.$modal.msgSuccess(text + "成功");
        }).catch(function() {});
      },
    }
  }
</script>
<style>

</style>
