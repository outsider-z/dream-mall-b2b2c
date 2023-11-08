<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="手机号" prop="phoneNo">
        <el-input v-model="queryParams.phoneNo" placeholder="请输入手机号" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable style="width: 240px"
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
          v-hasPermi="['system:shopper:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:shopper:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:shopper:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="shopperList" @selection-change="handleSelectionChange" :border="true">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商家名称" prop="merchantName" align="center" />
      <el-table-column prop="img" label="头像" width="150" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" width="100" trigger="hover">
            <img :src="`${imgHost}` + scope.row.avatar" alt="" style="width: 100px;height: 100px">
            <img slot="reference" :src="`${imgHost}` + scope.row.avatar" style="height: 60px;width: 60px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" width="200" align="center">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="sex" width="200" align="center">
        <template slot-scope="scope">
          {{scope.row.sex == '0' ? '男' : '女'}}
        </template>
      </el-table-column>
      <el-table-column label="手机号码" prop="phoneNo" width="250" align="center">
        <template slot-scope="scope">
          {{scope.row.phoneNo}}
        </template>
      </el-table-column>
      <el-table-column label="是否启用" align="center" width="300">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enableFlag" active-value="0" inactive-value="1"
            @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="200" align="center" />
      <el-table-column label="修改时间" prop="updateTime" width="200" align="center" />
      <el-table-column label="操作" align="center" fixed="right" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:shopper:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:shopper:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="140px">
        <el-form-item label="商家名称" prop="merchantName">
          <el-select v-model="formData.merchantName" filterable remote reserve-keyword placeholder="请输入关键词"
            :remote-method="remoteMethod" :loading="loading" @change="selectChange" :style="{width: '100%'}">
            <el-option v-for="item in merchantOptions" :key="item.value" :label="item.label" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入姓名" clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNo">
          <el-input v-model="formData.phoneNo" placeholder="请输入手机号" :maxlength="11" show-word-limit clearable
            prefix-icon='el-icon-mobile' :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="formData.sex" size="medium">
            <el-radio v-for="(item, index) in sexOptions" :key="index" :label="item.value">
              {{item.label}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-upload class="avatar-uploader" :action="uploadFileUrl" :show-file-list="false" :headers="headers"
            :on-success="handleAvatarSuccess" :before-upload="urlBeforeUpload">
            <img v-if="formData.avatar" :src="`${imgHost}` + formData.avatar" class="avatar">
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
    listShopper,
    getShopper,
    addShopper,
    updateShopper,
    delShopper
  } from "@/api/mall-merchant/shopper";
  import {
    getAllMallMerchant
  } from "@/api/mall-merchant/merchant";
  import store from '@/store'
  export default {
    name: 'Distribution',
    inheritAttrs: false,
    components: {},
    props: [],
    data() {
      var valiIcon = (rule, value, callback) => {
        // 图片验证
        if (this.formData.avatar == '') {
          callback(new Error("请上传头像"));
        } else {
          callback();
        }
      }
      return {
        headers: {
          Authorization: "Bearer " + store.getters.token
        },
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile/oss",
        shopperList: [],
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
          merchantId: undefined,
          merchantName:'',
          avatar: '',
          name: undefined,
          sex: undefined,
          phoneNo: undefined,
        },
        rules: {
          merchantId: [{
            required: true,
            message: '请选择商家',
            trigger: 'change'
          }],
          avatar: [{
            required: true,
            validator: valiIcon
          }],
          sex: [{
            required: true,
            message: '性别不能为空',
            trigger: 'change'
          }],
          name: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          phoneNo: [{
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }, {
            pattern: /^1(3|4|5|7|8|9)\d{9}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }],
        },
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          merchantId: store.getters.merchantId
        },
        showSearch: true,
        swiperOptions: [],
        sexOptions: [{
          "label": "男",
          "value": "0"
        }, {
          "label": "女",
          "value": "1"
        }],
        merchantOptions: [],
        list:[],
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
          this.shopperList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      //查询商家
      getMerchant() {
        let para = {
          approveStatus: 'APPROVED',
        }
        getAllMallMerchant(para).then(response => {
          this.list = response.data.map(item => {
            return {
              value: `${item.mallMerchantEntity.id}`,
              label: `${item.mallMerchantEntity.merchantName}`
            };
          });
        });
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
        this.formData.merchantId = val.value
        this.formData.merchantName = val.label
        // this.merchantClick(this.formData.merchantId)
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      reset() {
        this.formData = {
            merchantId: undefined,
            merchantName:'',
            avatar: '',
            name: undefined,
            sex: undefined,
            phoneNo: undefined,
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
        this.title = "添加配送人员设置";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const swiperId = row.id || this.ids
        getShopper(swiperId).then(response => {
          this.formData = response.data.merchantShopperEntity;
          this.formData.merchantName = response.data.merchantName
          this.open = true;
          this.title = "修改配送人员设置";
        });
      },
      submitForm() {
        this.$refs['elForm'].validate(valid => {
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
        const swiperIds = row.id || this.ids;
        this.$modal.confirm('是否确认删除该配送人员信息？').then(function() {
          return delShopper(swiperIds);
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
        this.formData.avatar = res.data.url;
        if (this.formData.avatar != '') {
          this.$refs.elForm.clearValidate('avatar') //清除图片校验文字
        }
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
