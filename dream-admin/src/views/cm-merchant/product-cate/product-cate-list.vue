<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="分类名称" prop="cateName">
        <el-input v-model="queryParams.cateName" placeholder="请输入商品分类名称" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['cm-merchant:product-cate-add']">新增</el-button>
      </el-col>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="cateList" border>
      <el-table-column label="创建时间" prop="createTime" width="200" align="center">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="品类名称" prop="merchantName" width="" align="center">
        <template slot-scope="scope">
          {{scope.row.cateName}}
        </template>
      </el-table-column>
      <el-table-column label="商户" prop="merchantName" width="200" align="center">
        <template slot-scope="scope">
          {{scope.row.merchantName}}
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="merchantName" width="200" align="center">
        <template slot-scope="scope">
          {{scope.row.sort}}
        </template>
      </el-table-column>
      <el-table-column label="品类图标" prop="phoneNo" width="120" align="center">
        <template slot-scope="scope">
          <img :src="`${imgHost}` + scope.row.cateIcon" class="icon-style">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" align="center" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="getProductDdetails(scope.row.id)"
            v-hasPermi="['cm-merchant:product-cate-update']">修改</el-button>
          <!-- <el-button size="mini" type="text" @click="handleClose(scope.row)" v-hasPermi="['cm-merchant:product-cate-remove']">删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />



    <!-- 弹窗 -->
    <el-dialog title="新增社区商品分类" :visible.sync="dialogFlag">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="120px">
        <el-form-item label="品类名称" prop="cateName">
          <el-input v-model="formData.cateName" placeholder="请输入品类名称" autocomplete="off" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number :min="1" v-model="formData.sort" placeholder="排序" controls-position=right></el-input-number>
        </el-form-item>
        <el-form-item label="品类图标:" prop="cateIcon">
          <el-upload class="main-uploader" :action="uploadFileUrl" :show-file-list="false" :headers="headers"
            :on-success="handleIConSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="formData.cateIcon" :src="`${imgHost}` + formData.cateIcon" class="minAvatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFlag=false">取消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import{
    merchantQueryCommunityProductCateList,
    merchantAddCommunityProductCate,
    merchantModifyCommunityProductCate,
    merchantDeleteCommunityProductCate,
    productCate

} from"@/api/cm-merchant/cm-product";

  import store from '@/store';
  export default {
    name: 'Brand',
    dicts: ['sys_modular_type', 'sys_job_status'],
    inheritAttrs: false,
    components: {},
    props: [],
    data() {
      return {
        headers: {
          Authorization: "Bearer " + store.getters.token
        },
        showSearch: true,
        loading: true,
        dialogFlag: false,
        total: 0,
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile/oss",
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          merchantId: store.getters.merchantId
        },
        cateList: [],
        formData: {
          cateName: '',
          cateIcon: '',
          merchantId: store.getters.merchantId,
        },
        rules: {
          cateName: [{
              required: true,
              message: '请输入品类名称',
              trigger: 'blur'
            },
            {
              max: 20,
              message: '长度在 20个字符',
              trigger: 'blur'
            }
          ],
          sort: [{
            required: true,
            message: '请输入品类排序',
            trigger: 'blur'
          }]
        },

        merchantName: '',
        merchantOptions: [],
        codePage: {
          pageNum: 1,
          pageSize: 10,
          merchantId: store.getters.merchantId,
        },
        editFlag: false,
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
      reset() {
        this.formData = {
          id: undefined,
          cateName: "",
        };
        this.merchantName = '';
        this.resetForm("form");
      },
      /**
       * @param {Object} res
       * @param {Object} file
       * 图片上传成功后
       */
      handleIConSuccess(res, file) {
        this.formData.cateIcon = res.data.url;
        this.$forceUpdate();
        // this.$set(this.formData, 'cateIcon', res.data.url);
        // this.$refs.elForm.clearValidate('cateIcon') //清除图片校验文字
      },
      /**
       * @param {Object} file
       * 图片校验
       */
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
      /**
       * 初始化列表
       */
      getList() {
        this.loading = false;
        merchantQueryCommunityProductCateList(this.queryParams).then(response => {
          this.cateList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      //新增弹窗
      handleAdd() {
        this.reset();
        this.dialogFlag = true;
        this.searchHandle('三桥社区');
      },
      //新增提交
      submitForm() {
        let parameter = {
          cateName: this.formData.cateName,
          cateIcon: this.formData.cateIcon,
          merchantId: store.getters.merchantId,
          sort: this.formData.sort
        }
        if (this.editFlag) {
          parameter.id = this.formData.id;
          console.log('修改参数');
          merchantModifyCommunityProductCate(parameter).then(response => {
            if (response.code == 200) {
              this.$modal.msgSuccess("修改成功");
              this.getList();
              this.editFlag = false;
            }
          });
        } else {
          merchantAddCommunityProductCate(parameter).then(response => {
            if (response.code == 200) {
              this.$modal.msgSuccess("添加成功");
              this.getList()
            }
          });
        }
        this.dialogFlag = false;
      },
      //查询详情
      getProductDdetails(id) {
        this.editFlag = true;
        productCate(id).then(response => {
          if (response.code == 200) {
            this.formData = response.data;
            this.dialogFlag = true;
          }
        });
      },
    },
  }
</script>

<style>
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

  .icon-style {
    width: 40px;
    height: 40rpx;
  }
</style>
