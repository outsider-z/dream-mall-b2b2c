<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="模块归属" prop="location">
        <el-select v-model="queryParams.moduleAttribute" placeholder="请选择模块归属"
          clearable>
          <el-option v-for="dict in dict.type.sys_module_attribution" :key="dict.value" :label="dict.label"
            :value="dict.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="展示位置" prop="location">
        <el-select v-model="queryParams.location" placeholder="请选择展示位置" clearable :style="{width: '100%'}">
          <el-option v-for="dict in dict.type.sys_swiper_location" :key="dict.value" :label="dict.label"
            :value="dict.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getSettings(queryParams.moduleAttribute)">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:swiper:add']">新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!-- 表单 -->
    <el-table v-loading="loading" :data="swiperList" border>
      <el-table-column label="模块归属" prop="moduleAttribute" width="150" align="center">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_module_attribution" :value="scope.row.moduleAttribute" />
        </template>
      </el-table-column>
      <el-table-column label="轮播图模块" prop="swiperModuleName" width="200" sortable align="center" />
      <el-table-column label="展示位置" prop="location" width="200" align="center">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_swiper_location" :value="scope.row.location" />
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" width="150" sortable align="center" />
      <el-table-column prop="img" label="轮播图" width="180" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" width="200" trigger="hover">
            <img :src="`${imgHost}` + scope.row.url" alt="" style="width: 150px;height: 100px">
            <img slot="reference" :src="`${imgHost}` + scope.row.url" style="height: 40px;width: 60px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:swiper:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:swiper:remove']">删除</el-button>
          <el-button size="mini" type="text" icon="el-icon-link" @click="linkUpdate(scope.row)"
            v-hasPermi="['system:swiper:edit']">配置链接</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 轮播图新增 -->
    <el-dialog :title="title" :visible.sync="open" :before-close="cancel" width="45%">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="140px" :inline="true">
        <el-form-item label="归属" prop="moduleAttribute" style="width: 100%;">
          <el-radio-group v-model="formData.moduleAttribute" size="medium" @input="attributeChange(formData.moduleAttribute)">
            <el-radio-button v-for="dict in dict.type.sys_module_attribution":label="dict.value">
              {{dict.label}}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="展示位置" prop="location">
          <el-select v-model="formData.location" placeholder="请选择展示位置" clearable :style="{width: '100%'}">
            <el-option v-for="dict in dict.type.sys_swiper_location" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" placeholder="排序"></el-input-number>
        </el-form-item>

        <el-form-item label="轮播图片" prop="url" style="width: 100%;">
          <el-upload class="avatar-uploader" :action="uploadFileUrl" :show-file-list="false" :headers="headers"
            :on-success="handleAvatarSuccess" :before-upload="urlBeforeUpload">
            <img v-if="formData.url" :src="`${imgHost}` + formData.url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="链内容">
          <el-select v-model="formData.linkType" filterable placeholder="请选择链接内容" :clearable="true"
            @change="selectFunction">
            <el-option v-for="item in swiperOptions" :key="item.dictValue" :label="item.dictLabel"
              :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="外部链接" prop="sort" v-if="formData.linkType == 'link'" style="width: 100%;">
          <el-input v-model="formData.content" placeholder="请输入外部网页链接" clearable :style="{width: '100%'}" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>

    <!-- 商城商品选择 -->
    <el-dialog title="商城商品选择" :visible.sync="productOpen">
      <el-form :model="chooseParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="商家名称" prop="merchantName">
          <el-select v-model="chooseParams.merchantId" clearable :filter-method="searchMerchantList" filterable
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
        </el-form-item>
      </el-form>

      <el-table ref="singleTable" v-loading="chooseLoading" :data="productList" border height="500"
        highlight-current-row @row-click="handleCurrentChange">
        <el-table-column align="center" width="200" label="选择">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="templateSelection"
              :label="scope.row.mallProductEntity.id">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="商家名称" prop="merchantName" width="200" align="center" />
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
        <el-table-column label="商品名称" prop="productName" width="300" align="center">
          <template slot-scope="scope">
            <span class="receiptsNumStyle"
              @click="receiptsNumClick(scope.row)">{{scope.row.mallProductEntity.productName}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="商品上传时间" prop="createTime" width="200" align="center">
          <template slot-scope="scope">
            {{scope.row.mallProductEntity.createTime}}
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

    <!-- 社区商品选择 -->
    <el-dialog title="社区商品选择" :visible.sync="communityProductOpen">
      <el-form :model="chooseParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="商家名称" prop="merchantName">
          <el-select v-model="chooseParams.merchantId" clearable :filter-method="getAllCommonityMerchant" filterable
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
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getcommunityList()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetChooseParams">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table ref="singleTable" v-loading="chooseLoading" :data="communityProductList" border height="500"
        highlight-current-row @row-click="handleCurrentChange">
        <el-table-column align="center" width="200" label="选择">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="templateSelection" :label="scope.row.id">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="商家名称" prop="merchantName" width="200" align="center" />
        <el-table-column label="商品上传时间" prop="createTime" width="200" align="center">
          <template slot-scope="scope">
            {{scope.row.createTime}}
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="productName" width="300" align="center">
          <template slot-scope="scope">
            <span class="receiptsNumStyle" @click="receiptsNumClick(scope.row)">{{scope.row.productName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="img" label="图片" width="200" align="center">
          <template slot-scope="scope">
            <el-popover placement="right" width="200" trigger="hover">
              <img :src="`${imgHost}` +scope.row.productMainImage" alt="" style="width: 150px;height: 100px">
              <img slot="reference" :src="`${imgHost}` + scope.row.productMainImage" style="height: 40px;width: 60px">
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="chooseTotal>0" :total="chooseTotal" :page.sync="chooseParams.pageNum"
        :limit.sync="chooseParams.pageSize" @pagination="getProductList" />
      <div slot="footer">
        <el-button @click="communityProductOpen=false">取消</el-button>
        <el-button type="primary" @click="chooseSubmit">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import {
    listSwiper,
    getSwiper,
    addSwiper,
    updateSwiper,
    delSwiper
  } from "@/api/market/swiper";
  import {
    getDicts
  } from "@/api/system/dict/data";
  import {
    listProduct
  } from "@/api/product/product";
  import {
    getModuleSettings
  } from "@/api/system/configuration";
  import {
    searchMerchantList
  } from "@/api/mall-merchant/merchant";
  import {
    findProductList,
    getAllCommonityMerchant
  } from "@/api/community/products";

  import store from '@/store'
  export default {
    name: 'Swiper',
    dicts: ['sys_swiper_location', 'sys_module_attribution'],
    inheritAttrs: false,
    components: {},
    props: [],
    data() {
      var valiIcon = (rule, value, callback) => {
        // 图片验证
        if (this.formData.url == '') {
          callback(new Error("请上传图片"));
        } else {
          callback();
        }
      }
      return {
        headers: {
          Authorization: "Bearer " + store.getters.token
        },
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile/oss",
        swiperList: [],
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
          location: undefined,
          url: null,
          sort: 1,
          swiperModuleId: '',
          productCateId: '',
          moduleAttribute: '',
          linkType: '',
          content: ''
        },
        rules: {
          moduleAttribute: [{
            required: true,
            message: '请选择模块归属',
            trigger: 'change'
          }],
          location: [{
            required: true,
            message: '请选择展示位置',
            trigger: 'change'
          }],
          swiperModuleId: [{
            required: true,
            message: '请选择轮播图模块',
            trigger: 'change'
          }],
          url: [{
            required: true,
            validator: valiIcon
          }],
        },
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          moduleAttribute: 'MALL',
          swiperModuleId: ''
        },
        merchantParams: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        merchantOptions: [],
        showSearch: true,
        swiperOptions: [],
        productOpen: false,
        activeOpen: false,
        communityProductOpen: false,
        productList: [],
        communityProductList: [],
        chooseParams: {
          pageNum: 1,
          pageSize: 10
        },
        chooseTotal: 0,
        chooseLoading: false,
        activeList: [],
        productCateName: '',
        multipleSelection: [],
        templateSelection: '',
      }
    },
    computed: {},
    watch: {},
    created() {
      this.getDictType();
      this.getSettings('MALL');
    },
    mounted() {},
    methods: {
      /** 查询列表 */
      getList() {
        this.loading = true;
        listSwiper(this.queryParams).then(response => {
          this.swiperList = response.rows;
          this.total = response.total;
          this.loading = false;
        });

      },

      //查询模块位置
      getSettings(val) {
        this.queryParams.status = 0;
        if(this.queryParams.moduleAttribute==='COMMUNITY'){
          this.queryParams.moduleLevel="HOME";
        }
        getModuleSettings(this.queryParams).then(response => {
          let id = '';
          response.data.forEach(item => {
              if (item.moduleAttribute === 'MALL') {
                if (item.moduleType === 'MALL_HOME') {
                  id = item.id;
                }
              } else if (item.moduleAttribute === 'COMMUNITY') {
                if (item.moduleType === 'COMMUNITY_BANNER') {
                  id = item.id;
                }
              }
          });
          this.queryParams.swiperModuleId = id;
          this.formData.swiperModuleId = id;
          this.getList(id);
        });

      },

      /**
       *链接内容选择
       */
      selectFunction(e) {

        if (e === 'PRODUCT_DETAIL') {
          //商城商品
          if (this.formData.moduleAttribute == 'COMMUNITY') {
            this.$message.error('归属选择社区模式下，请选社区商品')
            return
          }
          this.productList = [];
          this.getProductList();
          this.productOpen = true;
        } else if (['SPIKE', 'GROUP', 'ACTIVE_PRODUCT'].includes(e)) {
          this.activeList = [];
          this.listCentreCenter();
          this.activeOpen = true;
        } else if (e === 'COMMUNITY-PRODUCT') {
          //社区商品
          if (this.formData.moduleAttribute == 'MALL') {
            this.$message.error('归属选择商城模式下，请选择商城商品')
            return
          }
          this.communityProductList = [];
          this.getcommunityList();
          this.communityProductOpen = true;
        }

      },
      /**
       * 选择商、活动提交
       */
      chooseSubmit() {
        if (this.formData.content === '') {
          let text_tip = ""
          if (['ACTIVE_PRODUCT', 'GROUP', 'SPIKE'].includes(this.formData.linkType)) {
            text_tip = '请选择活动';
            this.activeOpen = true;
          } else if (this.formData.linkType === 'COMMUNITY-PRODUCT') {
            text_tip = '请选择商城商品';
            this.productOpen = true;
          } else if (this.formData.linkType === 'PRODUCT_DETAIL') {
            text_tip = '请选择商城商品';
            this.communityProductOpen = true;
          }
          this.$message({
            message: text_tip,
            type: "error",
          });
          return
        }
        this.productOpen = false;
        this.activeOpen = false;
        this.communityProductOpen = false;
        this.merchantOptions = [];
        this.productList = [];
        this.activeList = [];
        this.resetChooseParams();
      },
      //表格选择商城商品，社区商品
      handleCurrentChange(val) {

        if (this.formData.linkType === 'PRODUCT_DETAIL') {
          this.formData.content = val.mallProductEntity.id;
          this.templateSelection = val.mallProductEntity.id;
        } else if (['ACTIVE_PRODUCT', 'GROUP', 'SPIKE'].includes(this.formData.linkType)) {
          this.formData.content = val.id;
          this.templateSelection = val.id;
        } else if (this.formData.linkType === 'COMMUNITY-PRODUCT') {
          this.formData.content = val.id;
          this.templateSelection = val.id;
        }

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
        this.templateSelection = '';
      },

      //查询商家
      loadmore() {
        this.merchantParams.pageNum++
        this.searchMerchantList();
      },
      /**
       * @param {Object} param
       * 查询商城商户
       */
      searchMerchantList(merchantName) {
        let param = {
          merchantName: merchantName,
          pageNum: this.merchantParams.pageNum,
          approveStatus: 'APPROVED',
          merchantAttribute: 'MALL',
          pageSize: this.merchantParams.pageSize,
        };
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
      //查询社区商户
      getAllCommonityMerchant(merchantName) {
        let param = {
          merchantName: merchantName,
          pageNum: this.merchantParams.pageNum,
          approveStatus: 'APPROVED',
          pageSize: this.merchantParams.pageSize,
          merchantAttribute: 'COMMUNITY_MERCHANT'
        };
        getAllCommonityMerchant(param).then(res => {
          if (res.code == 200) {
            this.merchantOptions = res.rows;
            this.merchantParams.total = res.total;
          }
        });
      },
      //查询swiperOptions
      getDictType() {
        getDicts('sys_swiper_link').then(res => {
          if (res.data.length > 0) {
            this.swiperOptions = res.data
          }
        });
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      reset() {
        this.formData = {
            location: '',
            url: '',
            sort: 1,
            swiperModuleId: '',
            productCateId: '',
            moduleAttribute: 'MALL',
            linkType: '',
            content: ''
          },
          this.resetForm("formData");
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.resetChooseParams();
        this.reset();
        this.open = true;
        this.title = "添加轮播图设置";
        this.getSettings('MALL')
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const swiperId = row.id || this.ids
        getSwiper(swiperId).then(response => {
          this.formData = response.data;
          this.open = true;
          this.title = "修改轮播图设置";
        });
      },
      /**配置链接**/
      linkUpdate(row) {
        this.reset();
        const swiperId = row.id || this.ids
        getSwiper(swiperId).then(response => {
          this.formData = response.data;
          this.title = "修改轮播图设置";
        });
      },
      //新增提交
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            if (this.formData.id != undefined) {
              updateSwiper(this.formData).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addSwiper(this.formData).then(response => {
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
          return delSwiper(swiperIds);
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
        this.reset();
        this.$refs.elForm.resetFields()
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
        this.formData.url = res.data.url;
        if (this.formData.url != '') {
          this.$refs.elForm.clearValidate('applicationLogo') //清除图片校验文字
        }
      },

      //查询商城商品
      getProductList() {
        this.productOpen = true,
          this.chooseLoading = true;
        listProduct(this.chooseParams).then(response => {
          this.productList = response.rows;
          this.chooseTotal = response.total;
          this.chooseLoading = false;
        });
      },
      //查社区商品
      getcommunityList() {
        this.chooseLoading = true;
        findProductList(this.chooseParams).then(response => {
          this.communityProductList = response.rows;
          this.chooseTotal = response.total;
          this.chooseLoading = false;
        });
      },
      //选择商品
      selectAll() {
        this.$refs.multipleTableOne.clearSelection()
      },
      // 归属选择
      attributeChange(val) {
        let para={
          moduleAttribute: val,
          pageNum: 1,
          pageSize: 20,
          status: 0,
          moduleLevel: "HOME"
        }
        getModuleSettings(para).then(response => {
          let id = '';
          response.data.forEach(item => {
            if (item.moduleAttribute === 'MALL') {
              if (item.moduleType === 'MALL_HOME') {
                id = item.id;
              }
            } else if (item.moduleAttribute === 'COMMUNITY') {
              if (item.moduleType === 'COMMUNITY_BANNER') {
                id = item.id;
              }
            }
          });
          this.formData.swiperModuleId = id;
        });

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

  .el-table__body-wrapper::-webkit-scrollbar {
    width: 8px;
    /*滚动条宽度*/
    height: 8px;
    /*滚动条高度*/
  }

  .el-table__body-wrapper::-webkit-scrollbar-track {
    border-radius: 10px;
    /*滚动条的背景区域的圆角*/
    -webkit-box-shadow: inset 0 0 6px rgba(238, 238, 238, 0.3);
    background-color: #eeeeee;
    /*滚动条的背景颜色*/
  }

  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 10px;
    /*滚动条的圆角*/
    -webkit-box-shadow: inset 0 0 6px rgba(145, 143, 0143, 0.3);
    background-color: rgb(145, 143, 143);
    /*滚动条的背景颜色*/
  }
</style>
