<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="商品信息" name="first" >
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="商品类型" label-width="130px" prop="productType">
                <el-radio-group v-model="formData.productType" size="medium">
                  <el-radio v-for="(item, index) in productTypeOptions" :key="index" :label="item.value">
                    {{item.label}}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="商家名称" label-width="130px" prop="merchantName">
                <el-input v-model="formData.merchantName" placeholder="请输入商品名称" clearable disabled>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品类目" label-width="130px" prop="productCateId">
                <treeselect v-model="formData.productCateId" :show-count="true" :options="productCateIdOptions"
                  placeholder="请选择商品类目" :normalizer="normalizer" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="商品品牌" prop="productBrandId" label-width="130px">
                <el-select v-model="formData.productBrandId" filterable placeholder="请选择商品品牌" clearable
                  :style="{width: '100%'}">
                  <el-option v-for="(item, index) in selectedProductBrandOptions" :key="index" :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品名称" label-width="130px" prop="productName">
                <el-input v-model="formData.productName" placeholder="请输入商品名称" clearable :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="商品副标题" label-width="130px" prop="productBrief">
                <el-input v-model="formData.productBrief" placeholder="请输入商品副标题" :maxlength="30" clearable
                  :style="{width: '100%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="库存预警" label-width="130px" prop="warnUnit">
                <el-input v-model="formData.warnUnit" placeholder="用于库存警示" type="number" clearable
                  :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-col :span="24" v-if="formData.productType=='1'">
            <el-row :gutter="15">
              <el-col :span="5">
                <el-form-item label-width="130px" label="快递配送" prop="deliveryExpressEnabled">
                  <el-switch v-model="formData.deliveryExpressEnabled" @change="expressChange" active-value="0"
                    inactive-value="1">
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label-width="130px" label="同城配送" prop="deliveryCityEnabled">
                  <el-switch v-model="formData.deliveryCityEnabled" @change="cityChange" active-value='0'
                    inactive-value='1'>
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label-width="130px" label="到店自提" prop="deliveryPickEnabled">
                  <el-switch v-model="formData.deliveryPickEnabled" @change="pickChange" active-value='0'
                    inactive-value='1'>
                  </el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="10" v-if="formData.productType=='1' && formData.deliveryExpressEnabled == '0'">
            <el-form-item label-width="130px" label="运费模板" prop="productFreightId">
              <el-select v-model="formData.productFreightId" placeholder="请选择运费模板" clearable :style="{width: '50%'}">
                <el-option v-for="(item, index) in productFreightIdOptions" :key="index"
                  :label="item.freightTemplateEntity.templateName" :value="item.freightTemplateEntity.id"
                  :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" v-if="formData.productType=='1' && formData.deliveryCityEnabled == '0'">
            <el-form-item label-width="130px" label="同城收费模板" prop="productDeliveryId">
              <el-select v-model="formData.productDeliveryId" placeholder="请选择同城收费模板" clearable :style="{width: '50%'}">
                <el-option v-for="(item, index) in productDeliveryIdOptions" :key="index" :label="item.templateName"
                  :value="item.id" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-row :gutter="15">
              <el-col :span="5">
                <el-form-item label-width="130px" label="是否新品" prop="newProductFlag">
                  <el-switch v-model="formData.newProductFlag" active-value='0' inactive-value='1'>
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label-width="130px" label="是否热销" prop="hotSaleFlag">
                  <el-switch v-model="formData.hotSaleFlag" active-value='0' inactive-value='1'></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label-width="130px" label="是否推荐" prop="recommendFlag">
                  <el-switch v-model="formData.recommendFlag" active-value='0' inactive-value='1'>
                  </el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24">
            <el-row :gutter="15">
              <el-col :span="5">
                <el-form-item label-width="130px" label="七天无理由" prop="noReasonRefund">
                  <el-switch v-model="formData.noReasonRefund" active-value='0' inactive-value='1'>
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label-width="130px" label="是否开具发票" prop="invoiceStatus">
                  <el-switch v-model="formData.invoiceStatus" active-value='0' inactive-value='1'>
                  </el-switch>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="5">
                <el-form-item label-width="130px" label="是否需要邮寄" prop="shippingFlag">
                  <el-switch v-model="formData.shippingFlag" active-value='0' inactive-value='1'>
                  </el-switch>
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="5">
                <el-form-item label-width="130px" label="是否开启分销" prop="distributeFlag">
                  <el-switch v-model="formData.distributeFlag" active-value='0' inactive-value='1'>
                  </el-switch>
                </el-form-item>
              </el-col> -->
            </el-row>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Banner图片" label-width="130px" prop="productRotagramList">
              <el-upload :action="uploadFileUrl" :headers="headers" list-type="picture-card"
                :before-upload="beforeAvatarUpload" :on-preview="handleBannerCardPreview"
                :on-success="handleBnnerSuccess" :on-remove="handleRemoveBanner">
                <i class="el-icon-plus"></i>
                <div slot="tip" class="el-upload__tip">建议上传封面图标分辨率800X800，大小不能超过10M(首张用于商品封面)</div>
              </el-upload>
              <el-dialog :visible.sync="bannerVisible">
                <img width="100%" :src="`${imgHost}` + rotagramList" alt="">
              </el-dialog>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="商品主图" label-width="130px" prop="productMainImage">
              <el-upload 
              class="main-uploader" 
              :action="uploadFileUrl" 
              :show-file-list="false" 
              :headers="headers"
                :on-success="handleMainImageSuccess" :before-upload="beforeAvatarUpload">
                <img v-if="formData.productMainImage" :src="`${imgHost}` + formData.productMainImage" class="minAvatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="详情图片" label-width="130px" prop="productDetailImgList">
              <div style="display: flex;">
                <ul class="el-upload-list el-upload-list--picture-card">
                  <vueDraggable v-model="fileDetailList" @sort="dragSort">
                    <!-- {{formData.productDetailImgList}} -->
                    <li v-for="(item, index) in fileDetailList" :key="item.sort"
                      class="el-upload-list__item is-success animated">
                      <img :src="`${imgHost}` + item.response.data.url" alt="" class="el-upload-list__item-thumbnail ">
                      <i class="el-icon-close"></i>
                      <span class="el-upload-list__item-actions">
                        <!-- 预览 -->
                        <span class="el-upload-list__item-preview" @click="handlePictureCardPreviewFileDetail(item)">
                          <i class="el-icon-zoom-in"></i>
                        </span>
                        <!-- 删除 -->
                        <span class="el-upload-list__item-delete" @click="handleRemoveFileDetail(index)">
                          <i class="el-icon-delete"></i>
                        </span>
                      </span>
                    </li>
                  </vueDraggable>
                </ul>
                <el-upload 
                  :action="uploadFileUrl" 
                  list-type="picture-card" 
                  :headers="headers"
                  :file-list="fileDetailList" 
                  :before-upload="beforeAvatarUpload" 
                  :on-preview="handlePictureCardPreview"
                  :show-file-list="false" 
                  :on-success="handleDetailSuccess" 
                  :on-remove="handleRemove">
                  <i class="el-icon-plus"></i>
                  <!-- <div slot="tip" class="el-upload__tip">建议上传封面图标分辨率375X350，大小不能超过10M(上传图片的顺序代表详情图顺序)</div> -->
                </el-upload>
              </div>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="`${imgHost}` + detailImgList" alt="">
              </el-dialog>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="商品视频" label-width="130px" prop="productDetailVideoList">
              <el-upload 
                :action="uploadFileUrl" 
                :headers="headers" 
                :on-preview="handlePictureVideo"
                :on-success="uploadPictureSuccess" 
                :on-remove="handleRemoveVideo"
                :limit="1" class="videoUpload">
                <!-- <i class="el-icon-plus"></i> -->
                <el-button size="small" type="primary" v-if="formData.productDetailVideoList.length==0">点击上传</el-button>
                <div slot="tip" class="el-upload__tip" v-if="formData.productDetailVideoList.length==0">视频大小不超过10MB</div>
              </el-upload>
              <el-dialog :visible.sync="videoVisible" append-to-body width="45%">
                <video width="100%" controls="controls" :src="`${imgHost}` +videoUrl"></video>
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="商品参数" name="second" >
        <el-form :model="formData" class="demo-form-inline" :rules="rules">
          <el-row :gutter="20">
            <el-form-item label="参数信息" label-width="100px" v-for="(item,index) in formData.productParamsRequestList"
              :key="item.id">
              <el-col :span="8">
                <el-input v-model="item.productParamName" placeholder="请输入参数名"
                  :prop="'productParamsRequestList.' + index + '.productParamName'"></el-input>
              </el-col>
              <el-col :span="8">
                <el-input v-model="item.productParamValue" placeholder="请输入参数值"
                  :prop="'productParamsRequestList.' + index + '.productParamValue'"></el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="danger" icon="el-icon-delete" circle @click.native="delParam(index)"></el-button>
              </el-col>
            </el-form-item>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click.native="addParam()">添加参数</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="规格库存" name="third">
        <el-form :model="formData" class="demo-form-inline" :rules="rules">
          <el-alert v-if="formData.skuFlag=='0'" title="小建议-多规格商品建议先把规格信息设置完再设置价格等信息" type="info" show-icon
            close-text="知道了" class="mb10">
          </el-alert>
          <el-form-item label="多规格商品" prop="skuFlag">
            <el-switch v-model="formData.skuFlag" active-value='0' inactive-value='1'></el-switch>
          </el-form-item>
          <el-row :gutter="20" v-for="(item,index) in formData.productSkuAttrRequestList" :key="index"
            v-if="formData.skuFlag=='0'">
            <el-col :span="6">
              <el-form-item label="规格信息" label-width="80px"
                :rules="{required: true, message: '规格名必填项', trigger: 'blur'}">
                <el-input v-model="item.productAttrName" placeholder="请输入规格名"
                  :prop="'productSkuAttrRequestList.' + index + '.productAttrName'">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label-width="1px">
                <el-tag v-for="(tag,index) in item.skuAttrValueRequestList" :key="index" closable
                  :disable-transitions="false" @close="handleClose(tag, item)">
                  {{ tag.productAttrValue }}
                </el-tag>
                <el-input class="input-new-tag" v-if="item.inputVisible" v-model="item.productAttrValue"
                  :ref="`saveTagInput${index}`" size="small"
                  @keyup.enter.native="handleInputConfirm(item.productAttrValue, item)"
                  @blur="handleInputConfirm(item.productAttrValue, item)">
                </el-input>
                <el-button class="button-new-tag" size="small" @click="addtext(item,index)">+ 添加规格值</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item>
                <el-button type="danger" icon="el-icon-delete" circle @click.native="deltext(index)"></el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="formData.skuFlag=='0'">
            <el-button type="primary" @click.native="additem()">添加规格项</el-button>
          </el-form-item>
          <el-row :gutter="15" v-if="formData.skuFlag=='1'">
            <el-col :span="8">
              <el-form-item label="商品编码">
                <el-input v-model="skuItem.productCode" placeholder="请输入商品编码" clearable :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品单价">
                <el-input v-model="skuItem.unitPrice" type="number" placeholder="请输入商品单价" clearable
                  :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="市场价">
                <el-input v-model="skuItem.marketPrice" type="number" placeholder="请输入市场价" clearable
                  :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品成本价">
                <el-input v-model="skuItem.productCostPrice" type="number" placeholder="请输入商品成本价" clearable
                  :style="{width: '100%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="促销价">
                <el-input v-model="skuItem.promotePrice" type="number" placeholder="请输入促销价" clearable
                  :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="总库存">
                <el-input v-model="skuItem.totalUnit" type="number" placeholder="请输入总库存" clearable
                  :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品重量">
                <el-input v-model="skuItem.productWeight" type="number" placeholder="请输入商品重量" clearable
                  :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
            <!-- 动态数组 -->
          <el-table :data="tableColumnList.tableBodyList" style="width: 100%" ref="multipleTable" v-if="formData.skuFlag=='0'">
            <el-table-column :label="item.propName" :property="item.prop"
              v-for="item in tableColumnList.tableHeaderList" :key="item.prop" align="center" fixed="left">
              <template slot-scope="scope">
                <span>{{ scope.row[scope.column.property] }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="productCode" label="编码" align="center" :render-header="renderHeader">
              <template slot-scope="scope">
                <el-input v-model="scope.row.productCode" size="mini" clearable />
              </template>
            </el-table-column>
            <el-table-column prop="unitPrice" label="价格" align="center" :render-header="renderHeader">
              <template slot-scope="scope">
                <el-input v-model="scope.row.unitPrice" size="mini" clearable type="number" />
              </template>
            </el-table-column>
            <el-table-column prop="marketPrice" label="市场价" align="center" :render-header="renderHeader">
              <template slot-scope="scope">
                <el-input v-model="scope.row.marketPrice" size="mini" clearable type="number" />
              </template>
            </el-table-column>
            <el-table-column prop="productCostPrice" label="成本价" align="center" :render-header="renderHeader">
              <template slot-scope="scope">
                <el-input v-model="scope.row.productCostPrice" size="mini" clearable type="number" />
              </template>
            </el-table-column>
            <el-table-column prop="promotePrice" label="促销价" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.promotePrice" size="mini" clearable type="number" />
              </template>
            </el-table-column>
            <el-table-column prop="totalUnit" label="库存" align="center" :render-header="renderHeader">
              <template slot-scope="scope">
                <el-input v-model="scope.row.totalUnit" size="mini" clearable type="number" />
              </template>
            </el-table-column>
            <el-table-column prop="productWeight" label="重量" align="center" :render-header="renderHeader">
              <template slot-scope="scope">
                <el-input v-model="scope.row.productWeight" size="mini" clearable type="number" />
              </template>
            </el-table-column>
            <el-table-column prop="productAttrImg" label="图片(点击上传)" align="center">
              <template slot-scope="scope">
                <el-upload class="productImg" :action="uploadFileUrl" :show-file-list="false" :headers="headers"
                  :on-success="handleAvatarSuccess.bind(this,scope.row)" :before-upload="beforeAvatarUpload">
                  <img v-if="scope.row.productAttrImg" :src="`${imgHost}` + scope.row.productAttrImg" class="avatar">
                  <i v-else class="el-icon-plus productImg-icon"></i>
                </el-upload>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div class="fotterBtn">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </div>
  </div>
</template>
<script>
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import {
    getAllProductBrand
  } from "@/api/product/brand";
  import {
    addProduct
  } from "@/api/product/product";
  import {
    getAllProductCate
  } from "@/api/product/category";
  import {
    getMerchant
  } from "@/api/mall-merchant/merchant";
  
  import store from '@/store'
  import {
    getFreightTemplate
  } from "@/api/system/template";
  import {
    getCityDelivery
  } from "@/api/system/delivery";
  import vueDraggable from 'vuedraggable';
  export default {
    inheritAttrs: false,
    components: {
      Treeselect,
      vueDraggable
    },
    props: [],
    data() {
      var productRotagramList = (rule, value, callback) => {
        // 图片验证
        if (this.formData.productRotagramList.length < 1) {
           this.activeName='first'
          callback(new Error("请上传商品Banner图片"));
        } else {
          callback();
        }
      }
      var productDetailImgList = (rule, value, callback) => {
        // 图片验证
        if (this.formData.productDetailImgList.length < 1) {
          this.activeName='first'
          callback(new Error("请上传商品详情图"));
        } else {
          callback();
        }
      }
      var productMainImage = (rule, value, callback) => {
        // 图片验证
        if (this.formData.productMainImage.length < 1) {
          this.activeName='first'
          callback(new Error("请上传商品主图"));
        } else {
          callback();
        }
      }
      var promotionTime = (rule, value, callback) => {
        // 图片验证
        if (this.promotionTime.length == 0) {
          callback(new Error("请选择促销时间"));
        } else {
          callback();
        }
      }
      var timeFrame = (rule, value, callback) => {
        // 图片验证
        if (this.timeFrame.length == 0) {
          callback(new Error("请选择有效期"));
        } else {
          callback();
        }
      }
      return {
        tableColumnList: {
          tableHeaderList: [],
          tableBodyList: []
        },
        headers: {
          Authorization: "Bearer " + store.getters.token
        },
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile/oss",
        open: false,
        title: '',
        total: 0,
        loading: true,
        dialogVisible: false,
        bannerVisible: false,
        showSearch: true,
        activeName: 'first',
        promotionTime: [],
        timeFrame: [],
        formData: {
          productRotagramList: [],
          productDetailImgList: [],
          productDetailVideoList: [],
          productType: '1',
          merchantId: undefined,
          merchantName: '',
          productCateId: null,
          productBrandId: undefined,
          productName: undefined,
          productBrief: '',
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
          distributeFlag: undefined,
          validType: '1',
          validDays: undefined,
          productFreightId: undefined,
          productDeliveryId: undefined,
          skuFlag: '1',
          productSkuAttrRequestList: [],
          productSkuRequestList: [],
          productParamsRequestList: [],
          warnUnit: '',
          productMainImage: '',
        },
        skuItem: {
          productCode: '',
          unitPrice: '',
          marketPrice: '',
          productCostPrice: '',
          promotePrice: '',
          totalUnit: '',
          productWeight: '',
        },
        rules: {
          productType: [{
            required: true,
            message: '商品类型不能为空',
            trigger: 'change'
          }],
          merchantId: [{
            required: true,
            message: '请选择商家名称',
            trigger: 'change'
          }],
          productCateId: [{
            required: true,
            message: '请至少选择一个',
            trigger: 'change'
          }],
          productRotagramList: [{
            required: true,
            validator: productRotagramList
          }],
          productDetailImgList: [{
            required: true,
            validator: productDetailImgList
          }],
          productMainImage: [{
            required: true,
            validator: productMainImage
          }],
          productBrandId: [{
            required: true,
            message: '请选择商品品牌',
            trigger: 'change'
          }],
          productName: [{
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }],
          warnUnit: [{
            required: true,
            message: '请输入库存预警',
            trigger: 'blur'
          }],
          productCode: [{
            required: true,
            message: '请输入商品编码',
            trigger: 'blur'
          }],
          unitPrice: [{
            required: true,
            message: '请输入商品单价',
            trigger: 'blur'
          }],
          marketPrice: [{
            required: true,
            message: '请输入市场价',
            trigger: 'blur'
          }],
          productCostPrice: [{
            required: true,
            message: '请输入商品成本价',
            trigger: 'blur'
          }],
          totalUnit: [{
            required: true,
            message: '请输入总库存',
            trigger: 'blur'
          }],
          // promotionTime: [{
          //   required: true,
          //   validator: promotionTime
          // }],
          validType: [{
            required: true,
            message: '有效期类型不能为空',
            trigger: 'change'
          }],
          validDays: [{
            required: true,
            message: '请输入(仅用于电子卡券商品)有效天数',
            trigger: 'blur'
          }],
          timeFrame: [{
            required: true,
            validator: timeFrame
          }],
          productFreightId: [{
            required: true,
            message: '请选择运费模板',
            trigger: 'change'
          }],
          productDeliveryId: [{
            required: true,
            message: '请选择同城收费模板',
            trigger: 'change'
          }],
        },
        productTypeOptions: [{
          "label": "实物商品(物流发货）",
          "value": '1'
        }, {
          "label": "虚拟商品(无需物流)",
          "value": '2'
        }, {
          "label": "线下核销类商品",
          "value": '3'
        }],
        validTypeOptions: [{
          "label": "长期",
          "value": '1'
        }, {
          "label": "有效天内",
          "value": '2'
        }, {
          "label": "时间段",
          "value": '3'
        }],
        productCateIdOptions: [],
        selectedProductBrandOptions: [{
          "label": "选项一",
          "value": '1'
        }, {
          "label": "选项二",
          "value": '2'
        }],
        field102Options: [{
          "label": "快递配送",
          "value": '1'
        }, {
          "label": "同城配送",
          "value": '2'
        }, {
          "label": "门店自提（自提点为商家地址）",
          "value": ""
        }],
        productFreightIdOptions: [],
        productDeliveryIdOptions: [],
        productCateIdProps: {
          "multiple": false
        },
        // baseImgUrl:'https:....',
        hideUpload: false,
        limitCount: 3,
        videoUrl: '',
        videoVisible: false,
        isShow: false,
        skuAttrValue: '',
        saveTagInput: 'saveTagInputa',
        rotagramList: '',
        detailImgList: '',
        list: [],
        fileDetailList: [],
        codePage: {
          pageNum: 1,
          pageSize: 10,
        },
        pages: '',
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
      // 计算规格
      calculateAttribute() {
        // 初始化
        let obj = {}
        this.formData.productSkuAttrRequestList.forEach((item) => {
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
          for (let i = 0; i < item.length; i++) {
            obj[attrName[i]] = item[i].productAttrValue
            items += item[i].productAttrValue + (',')
            obj.productAttrValueId = items.substring(0, items.length - 1);
          }
          return obj
        })
       this.tableColumnList.tableBodyList = tableObj.tableBodyList //表格内容数据
        // window.localStorage.setItem(
        //   "tableBodyList ",
        //   JSON.stringify(tableObj.tableBodyList)
        // );
        // this.tableColumnList.tableBodyList = localStorage.getItem("tableBodyList")
        // 表头
        let skuTableArr = Object.keys(newVal)
        tableObj.tableHeaderList = skuTableArr.map((item) => {
          return {
            prop: item,
            propName: item
          }
        })
        this.tableColumnList.tableHeaderList = tableObj.tableHeaderList // 表头
        console.log('-------tableColumnList-------',this.tableColumnList);
      }
    },
    created() {
      this.getBrand()
      this.getCate()
      this.searchMerchant()
    },
    mounted() {},
    methods: {
      //查询商家
      searchMerchant() {
        getMerchant(store.getters.merchantId).then(res => {
          if (res.code == 200) {
            // this.pages = res.total
            this.formData.merchantName=res.data.merchantName;
            this.formData.merchantId=res.data.id;
            this.merchantChange(this.formData.merchantId)
          } else {
            this.$message({
              message: res.message,
              type: "error",
            });
          }
        });
      },
      expressChange() {
        if (this.formData.deliveryExpressEnabled == '0') {
          this.formData.deliveryCityEnabled = '1'
          this.deliveryPickEnabled = '1'
        }
      },
      cityChange() {
        if (this.formData.deliveryCityEnabled == '0') {
          this.formData.deliveryExpressEnabled = '1'
          this.formData.deliveryPickEnabled = '1'
        }
      },
      pickChange() {
        if (this.formData.deliveryPickEnabled == '0') {
          this.formData.deliveryCityEnabled = '1'
          this.formData.deliveryExpressEnabled = '1'
        }
      },
      //查询商品品牌
      getBrand() {
        let params = {
          pageNum: 1,
          pageSize: 30,
        }
        getAllProductBrand(params).then(response => {
          this.selectedProductBrandOptions = response.data;
        });

        // getCityDelivery(params).then(response => {
        //   this.productDeliveryIdOptions = response.data;
        // });

      },
      //查询商品类目
      getCate() {
        let param = {
          pageNum: 1,
          pageSize: 100,
        }
        getAllProductCate(param).then(response => {
          this.productCateIdOptions = this.handleTree(response.data, 'id', 'parentCateId');
        });
      },
      /** 转换菜单数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.id,
          label: node.cateName,
          children: node.children,
        };
      },
      submitForm() {
        if (this.formData.productParamsRequestList.length < 1) {
          this.$message.error('请填写商品参数')
          return;
        }

        if (this.formData.skuFlag == '1' && (this.skuItem.productCode == '' || this.skuItem.unitPrice == '' ||
            this.skuItem.marketPrice == '' || this.skuItem.productCostPrice == '' || this.skuItem.totalUnit == '' ||
            this.skuItem.productWeight == '')) {
          this.$message.error('请填写商品规格')
          return;
        }

        if (this.formData.skuFlag == '1') {
          this.formData.productSkuRequestList[0] = this.skuItem
          this.formData.productSkuRequestList[0].productAttrImg = this.formData.productMainImage
        }
        if (this.formData.skuFlag == '0' && this.formData.productSkuAttrRequestList.length < 1) {
          this.$message.error('请添加规格项')
          return;
        }
        
        // if (this.formData.skuFlag == '0' && this.formData.productSkuAttrRequestList.length < 1) {
        //   this.$message.error('请添加规格项')
        //   return;
        // }
        if (this.formData.skuFlag == '0') {
          // this.formData.productSkuAttrRequestList = this.productSkuAttrRequestList
          this.formData.productSkuRequestList = this.tableColumnList.tableBodyList
        }
        if(['2','3'].includes(this.productType)){
          //虚拟商品和核销商品
          this.formData.deliveryExpressEnabled=1;
          this.formData.deliveryCityEnabled	=1;
          this.formData.deliveryPickEnabled	=1;
        }
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            if (this.formData.promoteSalesFlag == 0) {
              this.formData.promoteStartDate = this.promotionTime[0]
              this.formData.promoteEndDate = this.promotionTime[1]
            }
            if (this.formData.validType == '3') {
              this.formData.validStartDate = this.timeFrame[0]
              this.formData.validEndDate = this.timeFrame[1]
            }
            addProduct(this.formData).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.closeSelectedTag(this.$route)
            });
          }
        })
      },
      closeSelectedTag(view) {
        this.$store.dispatch('tagsView/delView', view).then(({
          visitedViews
        }) => {
          if (this.isActive(view)) {
            this.toLastView()
          }
        })
      },
      toLastView() {
        this.$router.push({
          path: '/cm-merchant/goods/product-list',
        })
      },
      isActive(route) {
        return route.path === this.$route.path
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      reset() {
        this.formData = {
          productRotagramList: [],
          productDetailImgList: [],
          productDetailVideoList: [],
          productType: '1',
          merchantId: undefined,
          merchantName: '',
          productCateId: null,
          productBrandId: undefined,
          productName: undefined,
          productBrief: '',
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
          distributeFlag: undefined,
          validType: '1',
          validDays: undefined,
          productFreightId: undefined,
          productDeliveryId: undefined,
          skuFlag: '1',
          productSkuAttrRequestList: [],
          productSkuRequestList: [{}],
          warnUnit: '',
          productMainImage: '',
        }
        this.skuItem = {
          productCode: '',
          unitPrice: '',
          marketPrice: '',
          productCostPrice: '',
          promotePrice: '',
          totalUnit: '',
          productWeight: '',
        }
      },
      beforeAvatarUpload(file) {
        let isAccept = new RegExp('image/*').test(file.type)
        let isRightSize = file.size / 1024 / 1024 < 100
        if (!isAccept) {
          this.$message.error('应该选择image/*类型的文件')
          return isAccept
        } else if (!isRightSize) {
          this.$message.error('文件大小超过 100MB')
          return isRightSize
        }
      },
      handleAvatarSuccess(idx, res) {
        this.tableColumnList.tableBodyList[idx.index].productAttrImg = res.data.url
      },
      handleBannerCardPreview(file) {
        this.rotagramList = file.url;
        this.bannerVisible = true;
      },
      handlePictureCardPreview(file) {
        this.detailImgList = file.url;
        this.dialogVisible = true;
      },
      handleBnnerSuccess(res, file, fileList) {
        this.formData.productRotagramList = fileList.map((item, index) => {
          return {
            imgUrl: item.response.data.url,
            sort: index + 1
          }
        })
        if (this.formData.productRotagramList.length > 0) {
          this.$refs.elForm.clearValidate('productRotagramList') //清除图片校验文字
        }
      },
      handleDetailSuccess(res, file, fileList) {
        this.fileDetailList = fileList
        this.formData.productDetailImgList = fileList.map((item, index) => {
          return {
            imgUrl: item.response.data.url,
            sort: index + 1
          }
        })
        if (this.formData.productDetailImgList.length > 0) {
          this.$refs.elForm.clearValidate('productDetailImgList') //清除图片校验文字
        }
      },
      handleRemoveBanner(file, fileList) {
        this.formData.productRotagramList = fileList.map((item, index) => {
          return {
            imgUrl: item.response.data.url,
            sort: index + 1
          }
        })
      },
      handleRemove(file, fileList) {
        this.formData.productDetailImgList = fileList.map((item, index) => {
          return {
            imgUrl: item.response.data.url,
            sort: index + 1
          }
        })
      },
      // 视频上传
      beforeUploadVideo(file) {
        var fileSize = file.size / 1024 / 1024 < 50; //控制大小  修改50的值即可
        if (
          [
            "video/mp4",
            "video/ogg",
            "video/flv",
            "video/avi",
            "video/wmv",
            "video/rmvb",
            "video/mov",
          ].indexOf(file.type) == -1 //控制格式
        ) {
          // layer.msg("请上传正确的视频格式");
          return false;
        }
        if (!fileSize) {
          // layer.msg("视频大小不能超过50MB");
          return false;
        }
      },
      //删除视频
      handleRemoveVideo(file, fileList) {
        this.formData.productDetailVideoList = [];
      },
      handlePictureVideo(file) {
        this.videoUrl = file.response.data.url;
        this.videoVisible = true;
      },
      uploadPictureSuccess(res, file, fileList) {
        var _this = this
        if (file.status == "success") {
          _this.$message({
            message: '上传成功',
            type: 'success'
          })
        }
        this.formData.productDetailVideoList = fileList.map((item, index) => {
          return {
            videoUrl: item.response.data.url,
          }
        })
    

      },
      //主图
      handleMainImageSuccess(res, file) {
        this.formData.productMainImage = res.data.url;
        this.$refs.elForm.clearValidate('productMainImage') //清除图片校验文字
      },
      //tab切换
      handleClick(tab, event) {
         console.log(tab, event);


      },
      //删除商品参数
      delParam(index) {
        this.formData.productParamsRequestList.splice(index, 1);
      },
      //添加商品参数
      addParam() {
        this.formData.productParamsRequestList.push({
          productParamName: "",
          productParamValue: "",
        });
      },
      handleClose(tag, item) {
        item.skuAttrValueRequestList.splice(item.skuAttrValueRequestList.indexOf(tag), 1)
      },
      addtext(attr, index) {
        if (this.formData.productSkuAttrRequestList[index].skuAttrValueRequestList.length >= 10) {
          this.$Message.error("最多有十个规格值");
          return;
        } else {
          attr.inputVisible = true
          this.$nextTick((_) => {
            this.$refs[`saveTagInput${index}`][0].$refs.input.focus()
          })
        }
      },
      del(index, ind) {
        this.formData.productSkuAttrRequestList[index].skuAttrValueRequestList.splice(ind, 1);
      },
      handleInputConfirm(val, attr) {
        if (val) {
          attr.skuAttrValueRequestList.push({
            productAttrValue: val
          })
        }
        attr.inputVisible = false
        attr.productAttrValue = ''
      },
      //删除规格
      deltext(index) {
        this.formData.productSkuAttrRequestList.splice(index, 1);
      },
      //添加规格
      additem() {
        if (this.formData.productSkuAttrRequestList.length >= 3) {
          this.$message.error('最多有三个规格项');
          return;
        } else {
          this.formData.productSkuAttrRequestList.push({
            productAttrName: "",
            inputVisible: false,
            skuAttrValueRequestList: [],
          });
        }
      },
      // 动态表格的某列的必填参数
      renderHeader(cerateElement, {
        column
      }) {
        return cerateElement('div', [
          cerateElement('span', column.label),
          cerateElement('span', {
            domProps: {
              innerHTML: '*'
            },
            style: {
              color: 'red',
              fontSize: '16px',
              marginLeft: '5px'
            }
          })
        ]);
      },
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
      //查询模板
      merchantChange(val) {
        let tempPara = {
          merchantId: val
        }
        getFreightTemplate(tempPara).then(response => {
          this.productFreightIdOptions = response.data;
          if(this.productFreightIdOptions.length==0 && this.formData.productType==='1'){
            this.$Message.error("您还没添加运费模板，请添加运费模板");
          }
        });
      },
      handlePictureCardPreviewFileDetail(file) {
        this.detailImgList = file.response.data.url;
        this.dialogVisible = true;
      },
      // 删除
      handleRemoveFileDetail(index) {
        this.formData.productDetailImgList.splice(index, 1);
        this.fileDetailList.splice(index, 1);
      },
      dragSort() {
        this.formData.productDetailImgList = this.fileDetailList.map((item, index) => {
          return {
            imgUrl: item.response.data.url,
            sort: index + 1
          }
        })
      }
    }
  }
</script>
<style>
  .el-upload__tip {
    color: #E6A23C;
  }

  .el-tag+.el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    margin-bottom: 10px;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
    margin-bottom: 8px;
  }

  .productImg .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .productImg .el-upload:hover {
    border-color: #409EFF;
  }

  .productImg-icon {
    font-size: 28px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }

  .avatar {
    width: 60px;
    height: 60px;
    display: block;
  }

  .fotterBtn {
    margin-top: 20px;
  }

  .main-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background-color: #fbfdff;
  }

  .main-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }

  .minAvatar {
    width: 148px;
    height: 148px;
    display: block;
  }
</style>
