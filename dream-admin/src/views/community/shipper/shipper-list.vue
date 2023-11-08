<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="选择商家" prop="merchantId">
        <el-select v-model="queryParams.merchantName" clearable :filter-method="searchHandle" filterable
          placeholder="请选择商家" v-el-select-loadmore="loadmore" @change="searchTopMerchant"
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
          v-hasPermi="['system:brand:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:brand:edit']">修改</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="shipperList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="姓名" width="200" align="center">
        <template slot-scope="scope">
          <span class="receiptsNumStyle"
            @click="receiptsNumClick(scope.row)">{{scope.row.merchantShopperEntity.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="300" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" width="200" trigger="hover">
            <img :src="`${imgHost}` +scope.row.merchantShopperEntity.avatar" alt="" style="width: 150px;height: 100px">
            <img slot="reference" :src="`${imgHost}` + scope.row.merchantShopperEntity.avatar"
              style="height: 40px;width: 60px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="电话" width="300" align="center">
        <template slot-scope="scope">
          <sapn>{{scope.row.merchantShopperEntity.phoneNo}}</sapn>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="200" align="center">
        <template slot-scope="scope">
          {{scope.row.merchantShopperEntity.sex=='0'?'男':'女'}}
        </template>
      </el-table-column>
      <el-table-column label="商家名称" prop="merchantName" width="300" align="center" />
      <el-table-column label="操作" fixed="right" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:brand:edit']">修改</el-button>
          <el-button size="mini" style="color:#F56C6C" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:brand:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
      <!-- 新增 -->
    <el-dialog :title="title" :visible.sync="open" :before-close="cancel" width="45%">
      <el-form ref="elForm" :inline="true" :model="formData" :rules="rules" size="medium" label-width="100px"
        label-position="right">
        <el-form-item label="商家名称" prop="merchantName">
          <el-select v-model="formData.merchantName" clearable :filter-method="searchHandle" filterable
            placeholder="请选择商家" v-el-select-loadmore="loadmore" @change="searchDialogMerchant"
            @keyup.delete.native="deleteHandle">
            <el-option v-for="item in merchantOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phoneNo">
          <el-input v-model="formData.phoneNo" placeholder="联系电话" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="formData.sex" size="medium">
            <el-radio v-for="(item, index) in sexOptions" :key="index" :label="item.value">
              {{item.label}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="头像" prop="avatar" style="width:100%">
          <el-upload class="main-uploader" :action="uploadFileUrl" :show-file-list="false" :headers="headers"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="formData.avatar" :src="`${imgHost}` + formData.avatar" class="minAvatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
    searchMerchantList
  } from "@/api/mall-merchant/merchant";
  import {
    getDeliveryDetails,
  } from "@/api/community/delivery";
  
  import store from '@/store';
  import {
    getAllCommonityMerchant,
  } from "@/api/community/product-cate"
  import {
    addShopper,
    listShopper,
    updateShopper,
    delShopper
  } from "@/api/system/shopper";
  export default {
    inheritAttrs: false,
    components: {},
    props: [],
    data() {
      let phoneNo =  /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      var phoneNValidate = (rule, value, callback) => {
        if (!phoneNo.test(value) ){
          callback(new Error('请输入正确的电话号码'));
        }else {
          callback();
        }
      };
      return {
        formData: {
          id:'',
          merchantId: "",
          merchantName: '',
          merchantAttribute: 'COMMUNITY_MERCHANT',
          avatar: '',
          name: '',
          sex: "0",
          phoneNo: ''
        },
        sexOptions: [
        {
          "label": "男",
          "value": "0"
        }, {
          "label": "女",
          "value": "1"
        }],
        rules: {
          merchantName: [
          {
            required: true,
            message: '请选择商家名称',
            trigger: 'change'
          }],
          name: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          avatar: [{
            required: true,
            message: '请输上传头像',
            trigger: 'blur'
          }],
          phoneNo: [
          { validator: phoneNValidate, trigger: 'blur' }
          ],
          sex: [{
            required: true,
            message: '请输选择性别',
            trigger: 'blur'
          }]
        },
        merchantOptions: [],
        areaIdsOptions: [],
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          merchantId: '',
          merchantAttribute: 'COMMUNITY_MERCHANT'
        },
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
        shipperList: [],
        showSearch: true,
        list: [],
        disabled: false,
        codePage: {
          pageNum: 1,
          pageSize: 10,
        },
        pages: '',
        arr: [],
        headers: {
          Authorization: "Bearer " + store.getters.token
        },
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile/oss",
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
    },
    mounted() {},
    methods: {
      /** 查询列表 */
      getList() {
        this.loading = true;
        listShopper(this.queryParams).then(response => {
          this.shipperList = response.rows;
          this.total = response.total;
          this.loading = false;
        });

      },
      //加载更多商家
      loadmore() {
        this.codePage.pageNum++
        this.handleChange(this.codePage.pageNum)
      },
      handleChange(data) {
        let param = {
          merchantName: this.formData.merchantName,
          pageNum: data,
          approveStatus: 'APPROVED',
          merchantAttribute: 'COMMUNITY_MERCHANT',
          pageSize: this.codePage.pageSize,
        };
        this.getAllCommonityMerchant(param)
      },
      deleteHandle() {},
      /**
       * @param {Object} data
       * 搜索按钮
       */
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
      //商户下拉选择选中触发
      searchTopMerchant(val) {
        this.queryParams.merchantId = val;
        this.getList();
      },
      //添加时，商户下拉选择选中触发
      searchDialogMerchant(val) {
        this.formData.merchantId = val;
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

      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.freightTemplateEntity.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      reset() {
        this.formData = {
            merchantId: "",
            merchantName: '',
            merchantAttribute: 'COMMUNITY_MERCHANT',
            avatar: '',
            name: '',
              sex: "0",
            phoneNo: ''
          },
          this.resetForm("formData");
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams.merchantName='';
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "新增配送人员";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.disabled = true
        this.title = "修改运费模板";
        let modularId = [];
        if (row.id) {
          modularId = row.id
        } else {
          modularId = this.ids
        }
        this.getShipperDetails(row)
      },
      /**
       * @param {Object} response
       * 详情组装
       */
      getShipperDetails(response) {
        this.formData.id = response.merchantShopperEntity.id
        this.formData.merchantId = response.merchantShopperEntity.merchantId;
        this.formData.merchantName = response.merchantName;
        this.formData.name = response.merchantShopperEntity.name;
        this.formData.avatar = response.merchantShopperEntity.avatar;
        this.formData.sex = response.merchantShopperEntity.sex;
        this.formData.phoneNo = response.merchantShopperEntity.phoneNo;
        this.open = true;
      },
      //提交
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          console.log('valid', valid);
          if (valid) {
            if (this.formData.id != undefined) {
              updateShopper(this.formData).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addShopper(this.formData).then(response => {
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
        let modularIds = []
        if (row.merchantShopperEntity.id) {
          modularIds = row.merchantShopperEntity.id;
        } else {
          modularIds = this.ids;
        }
        this.$modal.confirm('是否确认删除配送人员？').then(function() {
          return delShopper(modularIds);
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
      /**
       * @param {Object} row
       * 模板查看
       */
      receiptsNumClick(row) {
        this.reset();
        this.detailsOpen = true,
          this.title = "查看运费模板";
        let modularId = [];
        if (row.freightTemplateEntity) {
          modularId = row.freightTemplateEntity.id
        } else {
          modularId = this.ids
        }
        this.getDeliveryDetails(row)
      },
      /**
       * 头像上传成功后
       */
      handleAvatarSuccess(res, file) {
        this.formData.avatar = res.data.url;
        this.$forceUpdate();
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
    }
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
