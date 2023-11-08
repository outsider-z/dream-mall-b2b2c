<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:swiper:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:swiper:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:swiper:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="popupList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="活动名称" prop="productName" width="300" align="center" />
      <el-table-column label="开始时间" align="center" prop="startTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成团人数" prop="redPacketNum" width="200" align="center" />
      <el-table-column label="成团时间" prop="redPacketLimit" width="200" align="center" />
      <el-table-column label="是否启用" align="center" width="200">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-value="0" inactive-value="1"
            @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="stock" width="200" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDetail(scope.row)"
            v-hasPermi="['system:swiper:edit']">秒杀详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:swiper:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:swiper:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="秒杀商品" label-width="130px" prop="productId">
          <el-select v-model="formData.productDTO" filterable placeholder="请选择秒杀商品" clearable :style="{width: '100%'}">
            <el-option v-for="(item, index) in productOptions" :key="index" :label="item.mallProductEntity.productName"
              :value="item.mallProductEntity.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="130px" label="日期范围" prop="time">
          <el-date-picker type="datetimerange" v-model="formData.time" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
            :style="{width: '100%'}" start-placeholder="开始日期" end-placeholder="结束日期" range-separator="至" clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label-width="130px" label="商品库存" prop="stock">
          <el-input-number v-model="formData.stock" placeholder="商品库存" controls-position=right>
          </el-input-number>
        </el-form-item>
        <el-form-item label-width="130px" label="秒杀价格" prop="unitPrice">
          <el-input-number v-model="formData.unitPrice" placeholder="秒杀价格" controls-position=right>
          </el-input-number>
        </el-form-item>
        <el-form-item label-width="130px" label="红包数量" prop="redPacketNum">
          <el-input-number v-model="formData.redPacketNum" placeholder="红包数量" controls-position=right>
          </el-input-number>
        </el-form-item>
        <el-form-item label-width="130px" label="积分红包总额度" prop="redPacketLimit">
          <el-input-number v-model="formData.redPacketLimit" placeholder="积分红包总额度" controls-position=right>
          </el-input-number>
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
    listConfig,
    getConfig,
    addConfig,
    updateConfig,
    delConfig,
  } from "@/api/system/popup";
  import store from '@/store';
  import {
    getAllProduct
  } from "@/api/product/product";
  import {
    getDicts
  } from "@/api/system/dict/data";
  export default {
    name: 'Popup',
    inheritAttrs: false,
    components: {},
    props: [],
    dicts: ['sys_popup_type'],
    data() {
      var valiIcon = (rule, value, callback) => {
        // 图片验证
        if (this.formData.url == '') {
          callback(new Error("请上传弹窗图片"));
        } else {
          callback();
        }
      }
      return {
        headers: {
          Authorization: "Bearer " + store.getters.token
        },
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/upload",
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
          productDTO: undefined,
          time: ["2022-08-25", "2022-09-22"],
          stock: undefined,
          unitPrice: undefined,
          redPacketNum: undefined,
          redPacketLimit: undefined,
        },
        rules: {
          productDTO: [{
            required: true,
            message: '请选择秒杀商品',
            trigger: 'change'
          }],
          time: [{
            required: true,
            type: 'array',
            message: '请至少选择一个time',
            trigger: 'change'
          }],
          stock: [{
            required: true,
            message: '商品库存',
            trigger: 'blur'
          }],
          unitPrice: [{
            required: true,
            message: '秒杀价格',
            trigger: 'blur'
          }],
          redPacketNum: [{
            required: true,
            message: '红包数量',
            trigger: 'blur'
          }],
          redPacketLimit: [{
            required: true,
            message: '积分红包总额度',
            trigger: 'blur'
          }],
        },
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        showSearch: true,
        popupList: [],
        popupOptions: [],
        productOptions: [],
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
          this.popupList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
        getAllProduct().then(response => {
          this.productOptions = response.data
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
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      reset() {
        this.formData = {
            url: '',
            popupType: undefined,
            clickConnection: undefined,
            enable: 1,
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
        this.title = "添加秒杀活动";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const swiperId = row.id || this.ids
        getConfig(swiperId).then(response => {
          this.formData = response.data;
          this.open = true;
          this.title = "修改团购活动";
        });
      },
      /*详情*/
      handleDetail(){
        this.$router.push({
          path: '/seckollDetail',
        })
      },
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
                this.open = false;W
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
      urlBeforeUpload(file) {
        let isAccept = new RegExp('image/*').test(file.type)
        if (!isAccept) {
          this.$message.error('应该选择image/*类型的文件')
        }
        return isAccept
      },
      handleAvatarSuccess(res, file) {
        this.formData.url = res.data.url;
        if (this.formData.url != '') {
          this.$refs.elForm.clearValidate('url') //清除图片校验文字
        }
      },
      // 状态修改
      handleStatusChange(row) {
        let text = row.grantFlag === "0" ? "显示" : "关闭";
        this.$modal.confirm('确认要"' + text + '"该弹窗吗？').then(function() {
          return updateConfig(row);
        }).then(() => {
          this.$modal.msgSuccess(text + "成功");
        }).catch(function() {
          row.grantFlag = row.grantFlag === "0" ? "1" : "0";
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
</style>
