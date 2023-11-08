<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="优惠券所属" prop="belongType">
        <el-select v-model="queryParams.belongType" placeholder="请选择优惠券所属" @change="belongTypeChange" clearable
          :style="{width: '100%'}">
          <el-option v-for="(item, index) in belongTypeOptions" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择商家" prop="merchantId" >
        <el-select
          v-model="queryParams.merchantId"
          clearable
          :filter-method="searchMerchantByName"
          filterable placeholder="请选择"
          v-el-select-loadmore="loadmore">
          <el-option v-for="item in merchantOptions" :key="item.mallMerchantEntity.id" :label="item.mallMerchantEntity.merchantName" :value="item.mallMerchantEntity.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="优惠券名称" prop="couponName">
        <el-input v-model="queryParams.couponName" placeholder="请输入优惠券名称" clearable :style="{width: '100%'}">
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:coupon:add']">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:coupon:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:coupon:remove']">删除</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>


    <el-table v-loading="loading" :data="couponList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="优惠券所属" prop="belongType" width="150" align="center">
        <template slot-scope="scope">
          {{scope.row.couponEntity.belongType=='PLATFORM' ? '平台' : '商家'}}
        </template>
      </el-table-column>
      <el-table-column label="商家名称" prop="merchantName" width="300" align="center">
        <template slot-scope="scope">
          {{scope.row.merchantName}}
        </template>
      </el-table-column>
      <el-table-column label="是否发放" align="center" width="150">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.couponEntity.grantFlag" active-value="0" inactive-value="1"
            @change="handleStatusChange(scope.row.couponEntity)"></el-switch>
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
      <el-table-column label="优惠类型" prop="discountType" width="150" align="center">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_coupon_type" :value="scope.row.couponEntity.discountType" />
        </template>
      </el-table-column>
      <el-table-column label="价额" width="300" align="center">
        <template slot-scope="scope">
          {{scope.row.couponEntity.discountType == 'FULL_DISCOUNT' ? scope.row.couponEntity.benefitCash +'元（满'+ scope.row.couponEntity.conditionAmount+'元可用）' : '折扣率'+scope.row.couponEntity.benefitDiscount+'%（满'+ scope.row.couponEntity.conditionAmount + '元可用）' }}
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
      <el-table-column label="可用数量" prop="availableQuantity" width="150" align="center">
        <template slot-scope="scope">
          {{scope.row.couponEntity.availableQuantity}}
        </template>
      </el-table-column>
      <el-table-column label="优惠券描述" prop="memo" align="center" width="200">
        <template slot-scope="scope">
          {{scope.row.couponEntity.memo}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-document" @click="handleDetails(scope.row.couponEntity)">领取详情
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:coupon:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:coupon:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />


   <!-- 新增弹窗 -->
    <el-dialog :visible.sync="open" :title="title" :before-close="cancel"  width="45%">
        <el-form ref="elForm" :model="formData" :rules="rules" :inline="true"  size="medium" label-width="100px">
            <el-form-item label="优惠所属" prop="belongType" style="width: 100%;">
              <el-radio-group v-model="formData.belongType" size="medium" @input="inputBelongType">
                <el-radio v-for="(item, index) in belongTypeOptions" :key="index" :label="item.value"
                  :disabled="item.disabled">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="选择商家" prop="merchantName" v-if="formData.belongType == 'BUSINESS'" style="width: 100%;">
              <el-select
              v-model="formData.merchantId"
              clearable :filter-method="searchMerchantByName" filterable placeholder="请选择商家"
                v-el-select-loadmore="loadmore" >
                <el-option v-for="item in merchantOptions" :key="item.mallMerchantEntity.id" :label="item.mallMerchantEntity.merchantName" :value="item.mallMerchantEntity.id" />
              </el-select>
            </el-form-item>

             <el-form-item label="可用类型" prop="benefitType" v-if="formData.belongType == 'PLATFORM'">
               <el-radio-group v-model="formData.benefitType" size="medium" @input="belongTypeFuntion">
                 <el-radio v-for="(item, index) in platformOptions" :key="index" :label="item.value"
                   :disabled="item.disabled">{{item.label}}</el-radio>
               </el-radio-group>
             </el-form-item>

            <el-form-item label="可用类型" prop="benefitType" v-if="formData.belongType == 'BUSINESS'">
              <el-radio-group v-model="formData.benefitType" size="medium" @input="belongTypeFuntion">
                <el-radio v-for="(item, index) in businessOptions" :key="index" :label="item.value"
                  :disabled="item.disabled" >{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="选择商品" prop="productId" style="width: 100%;" v-if="formData.belongType == 'BUSINESS' && formData.benefitType == '1'">
              <el-select v-model="productIds" @change="productClick" multiple placeholder="请选择选择商品" clearable style="width: 100%;">
                <el-option v-for="(item, index) in productOptions" :key="index"
                  :label="item.mallProductEntity.productName" :value="item.mallProductEntity.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="适用范围" prop="applyRange" style="width: 100%;">
              <el-radio-group v-model="formData.applyRange" size="medium">
                <el-radio v-for="(item, index) in applyRangeOptions" :key="index" :label="item.value"
                  :disabled="item.disabled">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="优惠名称" prop="couponName">
              <el-input v-model="formData.couponName" placeholder="请输入优惠券名称" clearable>
              </el-input>
            </el-form-item>

            <el-form-item label="优惠类型" prop="discountType">
              <el-select v-model="formData.discountType" placeholder="请选择优惠类型" clearable disabled>
                <el-option v-for="dict in dict.type.sys_coupon_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="优惠金额" prop="benefitCash" v-if="formData.discountType=='CASH' || formData.discountType=='FULL_DISCOUNT'">
              <el-input v-model.number="formData.benefitCash" type="number" min="0" placeholder="请输入优惠金额" clearable>
              </el-input>
            </el-form-item>

            <el-form-item label="满足金额" prop="conditionAmount">
              <el-input v-model.number="formData.conditionAmount" type="number" min="0" placeholder="满减多少元可用" clearable >
              </el-input>
            </el-form-item>

            <el-form-item label="发行总量" prop="issuedQuantity">
              <el-input v-model.number="formData.issuedQuantity" type="number" min="1" placeholder="优惠券数量" clearable >
              </el-input>
            </el-form-item>

            <el-form-item label="有效期" prop="validType">
              <el-radio-group v-model="formData.validType" size="medium">
                <el-radio v-for="(item, index) in validTypeOptions" :key="index" :label="item.value"
                  :disabled="item.disabled">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="日期范围" prop="timeData" v-if="formData.validType == 'ASSIGN'" style="width: 100%;">
              <el-date-picker type="daterange" size="medium" v-model="timeData" format="yyyy-MM-dd" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" range-separator="至" clearable>
              </el-date-picker>
            </el-form-item>

            <el-form-item label="有效天数" prop="validDays" v-else>
              <el-input v-model.number="formData.validDays" type="number" min="1" placeholder="请输入有效天数" clearable >
              </el-input>
            </el-form-item>

            <el-form-item label="优惠描述" prop="memo" style="width: 100%;">
              <el-input v-model="formData.memo" type="textarea" placeholder="请输入优惠券描述"
                :autosize="{minRows: 4, maxRows: 4}" maxlength="100"
                   show-word-limit :style="{width: '100%'}"></el-input>
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
    listCoupon,
    getCoupon,
    addCoupon,
    updateCoupon,
    delCoupon,
    modifyCouponGrantFlag
  } from "@/api/system/coupon";
  import {
    getAllProduct,
    merchantQueryMallProductList
  } from "@/api/product/product";
  import {
    searchMerchantList
  } from "@/api/mall-merchant/merchant";
  import store from '@/store'
  export default {
    name: 'Coupon',
    dicts: ['sys_coupon_type'],
    inheritAttrs: false,
    components: {},
    props: [],
    data() {
      var valiIcon = (rule, value, callback) => {
        // 图片验证
        if (this.formData.imageUrl == '') {
          callback(new Error("请上传优惠券图片"));
        } else {
          callback();
        }
      }
      var dataTime = (rule, value, callback) => {
        // 图片验证
        if (this.timeData.length == 0) {
          callback(new Error("请选择有效期"));
        } else {
          callback();
        }
      }
      return {
        headers: {
          Authorization: "Bearer " + store.getters.token
        },
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile/oss",
        couponList: [],
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
        showSearch: true,
        timeData: [],
        merchantOptions: [],
        productOptions: [],
        productIds: [],
        formData: {
          belongType: 'BUSINESS',
          merchantId: undefined,
          merchantName: '',
          benefitType: '0',
          addCouponProductRequestList: [],
          applyRange: 'OWNER',
          couponName: undefined,
          discountType: 'FULL_DISCOUNT',
          benefitCash: undefined,
          conditionAmount: undefined,
          benefitDiscount: undefined,
          validType: 'ASSIGN',
          validDays: undefined,
          issuedQuantity: undefined,
          limitPerUser: 1,
          memo: undefined,
          imageUrl: '',
          grantFlag: '1',
          couponAttribute:'MALL'
        },
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          merchantId: ''
        },
        rules: {
          belongType: [{
            required: true,
            message: '优惠卷所属不能为空',
            trigger: 'change'
          }],
          merchantId: [{
            required: true,
            message: '请选择选择商家',
            trigger: 'change'
          }],
          benefitType: [{
            required: true,
            message: '可用类型不能为空',
            trigger: 'change'
          }],
          productOptions: [{
            required: true,
            message: '请选择选择商品',
            trigger: 'change'
          }],
          applyRange: [{
            required: true,
            message: '适用范围不能为空',
            trigger: 'change'
          }],
          couponName: [{
            required: true,
            message: '请输入优惠券名称',
            trigger: 'blur'
          }],
          discountType: [{
            required: true,
            message: '请选择优惠券类型',
            trigger: 'change'
          }],
          benefitCash: [{
            required: true,
            message: '请输入优惠金额',
            trigger: 'blur'
          }],
          conditionAmount: [{
            required: true,
            message: '请输入金额',
            trigger: 'blur'
          }],
          benefitDiscount: [{
            required: true,
            message: '如设置为90%表示9折',
            trigger: 'blur'
          }],
          validType: [{
            required: true,
            message: '有效期不能为空',
            trigger: 'change'
          }],
          timeData: [{
            required: true,
            validator: dataTime
          }],
          validDays: [{
            required: true,
            message: '请输入有效天数',
            trigger: 'blur'
          }],
          issuedQuantity: [{
            required: true,
            message: '请输入优惠券数量',
            trigger: 'blur'
          }],
          // limitPerUser: [{
          //   required: true,
          //   message: '请输入限领张数',
          //   trigger: 'blur'
          // }],
          imageUrl: [{
            required: true,
            validator: valiIcon
          }]
        },
        belongTypeOptions: [{
          "label": "平台",
          "value": "PLATFORM"
        }, {
          "label": "指定商家",
          "value": "BUSINESS"
        }],
        merchantIdOptions: [{
          "label": "选项一",
          "value": '1'
        }, {
          "label": "选项二",
          "value": '2'
        }],
        platformOptions: [{
          "label": "全场通用",
          "value": '0'
        }],
        businessOptions: [{
          "label": "全场通用",
          "value": '0'
        }, {
          "label": "指定商品",
          "value": '1'
        }],
        applyRangeOptions: [{
          "label": "新人专享",
          "value": "NEWCOMER",
          "disabled":true
        }, {
          "label": "所有人",
          "value": "OWNER",
          "disabled":false
        }],
        validTypeOptions: [{
          "label": "指定有效期",
          "value": "ASSIGN"
        }, {
          "label": "领取后几天内有效",
          "value": "EFFECTIVE_DAYS"
        }],
        list: [],
        codePage: {
          pageNum: 1,
          pageSize: 10,
        },
        pages: '',
        arr:[],
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
    computed: {},
    watch: {},
    created() {
      this.getList()
      // this.handleChange(1)
    },
    mounted() {},
    methods: {
      /** 查询列表 */
      getList() {
        this.loading = true;
        listCoupon(this.queryParams).then(response => {
          this.couponList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      /**
       * 优惠券所属选择
       */
      inputBelongType(e){
          //商户下选择所有人
          if(e==='BUSINESS'){
            this.formData.applyRange='OWNER';
            this.applyRangeOptions[0].disabled=true;
          }else{

            this.applyRangeOptions[0].disabled=false;
            this.applyRangeOptions[1].disabled=false;
          }

      },
      //查询商家
      loadmore() {
        this.codePage.pageNum++
        this.searchMerchantByName()
      },
      /**
       * @param {Object} data
       * 通过名称查询商户
       */
      searchMerchantByName(data){
        let param = {
          merchantName: data,
          pageNum: this.codePage.pageNum,
          approveStatus:'APPROVED',
          merchantAttribute:'MALL',
          pageSize: this.codePage.pageSize,
        };
        this.searchMerchantList(param);
      },
      /**
       * @param {Object} param
       * 查询商户
       */
      searchMerchantList(param){
        searchMerchantList(param).then(res => {
          if (res.code == 200) {
            this.merchantOptions=res.rows;
            this.pages = res.total;
          } else {
            this.$message({
              message: res.message,
              type: "error",
            });
          }
        });
      },
      // 可用类型选择
      belongTypeFuntion(businessOptionsIndex){
          if(businessOptionsIndex==='1'){
            //指定商品
            if(this.formData.merchantId){
              this.getMerchantProduct(this.formData.merchantId);
            }else{
              this.$message.error('请选择商户')
            }

          }
      },
      //查询商城商品
      getMerchantProduct(merchantId) {
        let para = {
              merchantId: merchantId,
              pageNum:1,
              pageSize:10
        }
        merchantQueryMallProductList(para).then(response => {
          this.productOptions = response.rows
        });
      },
      productClick(ids) {
        this.formData.addCouponProductRequestList = ids.map((item) => {
          if (item.id) {
            return {
              productId: item.productId,
            }
          } else {
            return {
              productId: item,
            }
          }
        })
      },
      reset() {
        this.formData = {
            belongType: 'BUSINESS',
            merchantId: undefined,
            merchantName: '',
            benefitType: '0',
            addCouponProductRequestList: [],
            applyRange: 'OWNER',
            couponName: undefined,
            discountType: 'FULL_DISCOUNT',
            benefitCash: undefined,
            conditionAmount: undefined,
            benefitDiscount: undefined,
            validType: 'ASSIGN',
            validDays: undefined,
            issuedQuantity: undefined,
            limitPerUser: 1,
            memo: undefined,
            imageUrl: '',
            grantFlag: '1',
          },
          this.timeData = []
        this.resetForm("formData");
      },
      /** 重置按钮操作 */
      resetQuery() {
       this.resetForm("queryForm");
       this.handleQuery();
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加优惠券设置";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.productIds = []
        let that = this
        const couponId = row.couponEntity.id || this.ids
        getCoupon(couponId).then(response => {
          that.formData = response.data;
          that.$set(this.timeData, 0, this.formData.validStartDate)
          that.$set(this.timeData, 1, this.formData.validEndDate)
          that.formData.couponProductEntityList.forEach(item => {
            that.productIds.push(item.productId)
            that.productIds = Array.from(new Set(that.productIds))
          })
          that.formData.addCouponProductRequestList = this.formData.couponProductEntityList;
          that.searchMerchantByName(row.merchantName);
          if(row.couponEntity.benefitType==='1'){
            //指定商品查询商户商品
            that.getMerchantProduct(row.couponEntity.merchantId);
          }
          that.open = true;
          that.title = "修改优惠券设置";
        });
      },
      submitForm() {
        if (this.timeData.length > 0) {
          this.formData.validStartDate = this.timeData[0]
          this.formData.validEndDate = this.timeData[1]
        }
        this.formData.couponAttribute='MALL';
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            if (this.formData.id != undefined) {
              delete this.formData.couponProductEntityList;
              updateCoupon(this.formData).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addCoupon(this.formData).then(response => {
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
        const couponIds = row.couponEntity.id || this.ids;
        this.$modal.confirm('是否确认删除优惠券名称为"' + row.couponEntity.couponName + '"的数据项？').then(function() {
          return delCoupon(couponIds);
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
      urlBeforeUpload(file) {
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
      handleAvatarSuccess(res, file) {
        this.formData.imageUrl = res.data.url;
        if (this.formData.imageUrl != '') {
          this.$refs.elForm.clearValidate('imageUrl') //清除图片校验文字
        }
      },
      // 状态修改
      handleStatusChange(row) {
        let text = row.grantFlag === "0" ? "发放" : "停用";
        this.$modal.confirm('确认要"' + text + '""' + row.couponName + '"优惠券吗？').then(function() {
          let para = {
            id: row.id,
            grantFlag: row.grantFlag
          }
          return modifyCouponGrantFlag(para);
        }).then(() => {
          this.$modal.msgSuccess(text + "成功");
        }).catch(function() {
          row.grantFlag = row.grantFlag === "0" ? "1" : "0";
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.productIds = []
        this.reset();
        this.$refs.elForm.resetFields()
      },
      handleDetails(row) {
        this.$router.push({
          path: '/extension/couponDetail',
          query: row,
        })
      },
      belongTypeChange(val) {
        if (val == 'PLATFORM') {
          this.queryParams.merchantId = ''
        }
      },

      handleEdit(e) {
        let value = e.replace(/[^\d.]/g, '') // 只能输入数字和.
        value = value.replace(/^\./g, '') //第一个字符不能是.
        value = value.replace(/\.{2,}/g, '.') // 不能连续输入.
        value = value.replace(/(\.\d+)\./g, '$1') // .后面不能再输入.
        value = value.replace(/^0+(\d)/, '$1') // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
        value = value.replace(/(\d{15})\d*/, '$1') // 最多保留15位整数
        value = value.replace(/(\.\d{2})\d*/, '$1') // 最多保留2位小数
      },
    }
  }
</script>
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
