<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="商家名称" prop="merchantName">
          <el-select 
            v-model="queryParams.merchantId" 
            clearable :filter-method="searchHandle" 
            filterable placeholder="请选择商家"
            v-el-select-loadmore="loadmore" 
            @change="selectChange" 
            @keyup.delete.native="deleteHandle">
            <el-option v-for="item in merchantOptions" :key="item.value" :label="item.label" :value="item.value" />
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
          v-hasPermi="['system:shopper:add']">新增</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-table v-loading="loading" :data="cateList" :border="true" table-layout="atuo">
      
      <el-table-column label="品类名称" prop="merchantName" align="center">
        <template slot-scope="scope">
          {{scope.row.cateName}}
        </template>
      </el-table-column>
      <el-table-column label="商户" prop="merchantName"  align="center">
        <template slot-scope="scope">
          {{scope.row.merchantName}}
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="merchantName"  align="center">
        <template slot-scope="scope">
          {{scope.row.sort}}
        </template>
      </el-table-column>
      <el-table-column label="品类图标" prop="phoneNo"  align="center">
        <template slot-scope="scope">
          <img  :src="`${imgHost}` + scope.row.cateIcon" class="icon-style">
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime"  align="center">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="修改时间" prop="updateTime"  align="center">
        <template slot-scope="scope">
          {{scope.row.updateTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作"  align="center" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="getProductDdetails(scope.row.id)" v-hasPermi="['system:merchant:edit']">修改</el-button>
          <el-button  size="mini" type="text"   @click="handleDelete(scope.row)"
            v-hasPermi="['system:merchant:edit']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    <!-- 弹窗 -->
    <el-dialog title="新增社区商品分类" :visible.sync="dialogFlag">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="120px">
        <el-form-item label="选择商家" label-width="120px" prop="merchantName">
          <el-select v-model="formData.merchantId" clearable :filter-method="searchHandle" filterable placeholder="请选择商家"
            v-el-select-loadmore="loadmore" @change="selectChange" @keyup.delete.native="deleteHandle">
            <el-option v-for="item in merchantOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
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
  import {
    list,
    productCate,
    getAllCommonityMerchant,
    getProductDdetails,
    updateProductCate,
    productCateList,
    delProductCate
  } from "@/api/community/product-cate";
  import store from '@/store'
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
        loading: false,
        dialogFlag: false,
        total: 0,
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile/oss",
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          merchantId: ""
        },
        cateList: [],
        formData: {
          cateName: '',
          cateIcon: ''
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
          sort:[{
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
        },
        editFlag:false,
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
      // this.getList()
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
      //商户加载更多
      loadmore() {
        this.codePage.pageNum++;
        this.handleChange(this.codePage.pageNum)
      },
      handleChange(data) {
        let param = {
          merchantName: this.merchantName,
          pageNum: data,
          approveStatus: 'APPROVED',
          merchantAttribute: 'COMMUNITY_MERCHANT',
          pageSize: this.codePage.pageSize,
        };
        this.getAllCommonityMerchant(param)
      },
      deleteHandle() {},
      searchHandle(data) {
        this.arr = []
        let param = {
          merchantName: data,
          pageNum: 1,
          approveStatus: 'APPROVED',
          merchantAttribute: 'COMMUNITY_MERCHANT',
          pageSize: this.codePage.pageSize,
        };
        this.getAllCommonityMerchant(param)
      },
      selectChange(val) {
        this.formData.merchantId = val
        // this.formData.merchantName = this.merchantName
        this.getList()
      },
      /**
       * @param {Object} param
       * 查询商户
       */
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
      /**
       * 初始化列表
       */
      getList() {
        this.loading = false;
        if(this.queryParams.merchantId==''){
          this.$modal.msgError('请选择商家');
          return
        }
        productCateList(this.queryParams).then(response => {
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
          merchantId: this.formData.merchantId,
          sort: this.formData.sort
        }
        if(this.editFlag){
          parameter.id=this.formData.id;
          console.log('修改参数');
          updateProductCate(parameter).then(response => {
            if (response.code == 200) {
              this.$modal.msgSuccess("修改成功");
              this.getList();
              this.editFlag=false;
            }
          });
        }else{
          productCate(parameter).then(response => {
            if (response.code == 200) {
              this.$modal.msgSuccess("添加成功");
              this.getList()
            }
          });
        }
        this.dialogFlag = false;
      },
      //查询详情
      getProductDdetails(id){
        this.editFlag=true;
            getProductDdetails(id).then(response => {
              if (response.code == 200) {
                  this.formData=response.data;
                  this.dialogFlag=true;
              }
            });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        let modularIds = []
        if (row.id) {
          modularIds = row.id;
        } else {
          modularIds = this.ids;
        }
        this.$modal.confirm('是否确认删除该分类？').then(function() {
          return delProductCate(modularIds);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
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
  .icon-style{
    width: 40px;
    height: 40rpx;
  }
</style>
