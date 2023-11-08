<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="输入姓名" prop="merchantId">
        <el-input v-model="queryParams.name" placeholder="请输入输入姓名" clearable style="width: 240px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['cm-merchant:shipper:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
            <el-button 
            type="danger" 
            plain 
            icon="el-icon-delete" 
            size="mini" 
            :disabled="multiple" 
            @click="handleDelete"
            >删除</el-button>
        </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="shipperList" :border="true" table-layout="auto"  @selection-change="handleSelectionChange">
      <el-table-column type="selection"  align="center" />
      <el-table-column label="姓名"  align="center">
        <template slot-scope="scope">
          <span class="receiptsNumStyle"
            @click="receiptsNumClick(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像"  align="center">
        <template slot-scope="scope">
          <el-popover placement="right" trigger="hover">
            <img :src="`${imgHost}` +scope.row.avatar" alt="" style="width: 150px;height: 100px">
            <img slot="reference" :src="`${imgHost}` + scope.row.avatar"
              style="height: 40px;width: 60px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="电话"  align="center">
        <template slot-scope="scope">
         {{scope.row.phoneNo}}
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          {{scope.row.sex=='0'?'男':'女'}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" />
      <el-table-column label="修改时间" prop="updateTime" align="center" />
      <el-table-column label="操作"   class-name="small-padding fixed-width" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['cm-merchant:shipper:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['cm-merchant:shipper:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
      
    <el-dialog :title="title" :visible.sync="open" :before-close="cancel" width="45%">
      <el-form ref="elForm" :inline="true" :model="formData" :rules="rules" size="medium" label-width="100px"
        label-position="right">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phoneNo">
          <el-input v-model="formData.phoneNo" placeholder="联系电话" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">

          <el-radio-group v-model="formData.sex" size="medium">
            <el-radio v-for="(item, index) in sexOptions" :key="item.value" :label="item.value">
              {{item.label}}
            </el-radio>
          </el-radio-group>

        </el-form-item>
        <el-form-item label="头像" prop="avatar" style="width: 100%;">
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
  import store from '@/store';
  import{
    addMerchantShopper,
    merchantDeleteShopperInfo,
    merchantModifyShopperinfo,
    queryMerchantShopperList
} from"@/api/cm-merchant/cm-product";
  export default {
    data() {
      var moneyrule = /^[1-9]{1}[0-9]*(\.[0-9]{1,2})?$/;
      return {
        formData: {
          id:'',
          merchantId:  store.getters.merchantId,
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
          phoneNo: [{
            required: true,
            message: '请输入电话号码',
            trigger: 'blur'
          }],
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
          merchantId: store.getters.merchantId,
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
        queryMerchantShopperList(this.queryParams).then(response => {
          this.shipperList = response.rows;
          this.total = response.total;
          this.loading = false;
        });

      },
      
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
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      reset() {
        this.formData = {
            merchantId:  store.getters.merchantId,
            merchantName: '',
            merchantAttribute: 'COMMUNITY_MERCHANT',
            avatar: '',
            name: '',
            sex: '',
            phoneNo: ''
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
        this.formData.id = response.id
        this.formData.merchantId = response.merchantId;
        this.formData.merchantName = response.merchantName;
        this.formData.name = response.name;
        this.formData.avatar = response.avatar;
        this.formData.sex = response.sex;
        this.formData.phoneNo = response.phoneNo;
        this.open = true;
      },
      //提交
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          console.log('valid', valid);
          if (valid) {
            if (this.formData.id != undefined) {
              merchantModifyShopperinfo(this.formData).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addMerchantShopper(this.formData).then(response => {
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
        if (row.id) {
          modularIds = row.id;
        } else {
          modularIds = this.ids;
        }
        this.$modal.confirm('是否确认删除配送人员？').then(function() {
          return merchantDeleteShopperInfo(modularIds);
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
