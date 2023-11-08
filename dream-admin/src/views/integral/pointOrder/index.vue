<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="活动名称" prop="activeName">
        <el-input v-model="queryParams.activeName" placeholder="请输入活动名称" clearable
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
          v-hasPermi="['system:pointProduct:add']">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:swiper:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:swiper:remove']">删除</el-button> -->
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="popupList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column prop="activeType" label="活动类型" width="180" align="center">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_market_type" :value="scope.row.activeType"/>
        </template>
      </el-table-column> -->
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
      <el-table-column label="活动状态" align="center">
        <template slot-scope="scope">
            <span v-if="scope.row.status =='NOT_STARTED'">未开始</span>
            <span v-if="scope.row.status =='IN_PROGRESS'">进行中</span>
            <span v-if="scope.row.status =='CLOSED'">已结束</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="500" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-time" @click="handleProduct(scope.row)"
            v-hasPermi="['system:swiper:edit']">设置活动</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" :disabled="scope.row.status == 'NOT_STARTED' ? false : true"
            v-hasPermi="['system:pointProduct:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" :disabled="scope.row.status == 'NOT_STARTED' ? false : true"
            v-hasPermi="['system:pointProduct:remove']">删除</el-button>
          <el-button v-if="scope.row.status =='NOT_STARTED' ||scope.row.status =='CLOSED' " size="mini" type="text" icon="el-icon-circle-check" @click="handleStatusChange(scope.row)"
            v-hasPermi="['system:pointProduct:open']">启用</el-button>
          <el-button v-if="scope.row.status =='IN_PROGRESS'" size="mini" type="text" icon="el-icon-circle-close" @click="handleStatusChange(scope.row)"
              v-hasPermi="['system:pointProduct:open']">关闭</el-button>
        </template>
      </el-table-column>
    </el-table>

  <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    <el-dialog :title="title" :visible.sync="open" :before-close="cancel">
      <el-form ref="elForm" :model="formData" :rules="rules" size="mini" label-width="150px">
        <!-- <el-form-item label-width="150px" label="活动类型" prop="activeType" required>
            <el-select v-model="formData.activeType" placeholder="请选择活动类型" clearable :style="{width: '50%'}">
              <el-option v-for="dict in dict.type.sys_market_type" :key="dict.value" :label="dict.label"
                :value="dict.value"></el-option>
            </el-select>
        </el-form-item> -->
        <el-form-item label="活动名称" prop="activeName">
          <el-input v-model="formData.activeName" placeholder="请输入活动名称" :style="{width: '50%'}" />
        </el-form-item>
        <el-form-item label-width="150px" label="日期范围">
          <el-date-picker type="datetimerange" v-model="time" format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss" :style="{width: '50%'}" start-placeholder="开始日期" end-placeholder="结束日期"
            range-separator="至" clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label-width="150px" label="商户最大参与商品数" prop="merchantMaxProduct">
          <el-input-number v-model="formData.merchantMaxProduct" :style="{width: '50%'}" placeholder="商户最大参与商品数" controls-position=right :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label-width="150px" label="红包数量" prop="redEnvelopeNum">
          <el-input-number v-model="formData.redEnvelopeNum" :style="{width: '50%'}" placeholder="红包数量" controls-position=right :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label-width="150px" label="积分红包总额度" prop="redEnvelopeAmount">
          <el-input-number v-model="formData.redEnvelopeAmount" :style="{width: '50%'}" placeholder="积分红包总额度" controls-position=right :min="0"></el-input-number>
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
    listCentreCenter,
    getCentreCenter,
    addCentreCenter,
    updateCentreCenter,
    delCentreCenter,
    updateStatus
  } from "@/api/market/centre";
  import store from '@/store';
  import {
    getDicts
  } from "@/api/system/dict/data";
  export default {
    name: 'Popup',
    inheritAttrs: false,
    components: {},
    props: [],
    dicts: ['sys_popup_type', 'sys_market_type'],
    data() {
      var valiIcon = (rule, value, callback) => {
        // 图片验证
        if (this.formData.url == '') {
          callback(new Error("请上传弹窗图片"));
        } else {
          callback();
        }
      };
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
        time: [],
        formData: {
          activeType: 'POINT',
          beginTime: '',
          endTime: '',
          merchantMaxProduct: undefined,
          activeName:'',
          redEnvelopeAmount:'',
          redEnvelopeNum:''
        },
        rules: {
          activeName: [{
            required: true,
            message: '请选择活动名称',
            trigger: 'blur'
          }],
          activeType: [{
            required: true,
            message: '请选择活动类型',
            trigger: 'change'
          }],
          time: [{
            required: true,
            type: 'array',
            message: '请选择时间',
            trigger: 'change'
          }],
          merchantMaxProduct: [{
            required: true,
            message: '请输入商品最大数',
            trigger: 'blur'
          }],
          redEnvelopeNum: [{
            required: true,
            message: '请输入红包数量',
            trigger: 'blur'
          }],
          redEnvelopeAmount: [{
            required: true,
            message: '请输入红包最大金额',
            trigger: 'blur'
          }],
        },
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          activeType:'POINT',
          activeName:'',
        },
        showSearch: true,
        popupList: [],
        popupOptions: [],
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
        listCentreCenter(this.queryParams).then(response => {
          this.popupList = response.rows;
          this.total = response.total;
          this.loading = false;
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
            activeType: undefined,
            beginTime: '',
            endTime: '',
            merchantMaxProduct: undefined,
            activeName:'',
            redEnvelopeAmount:'',
            redEnvelopeNum:''
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
        this.title = "添加活动";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const centreId = row.id || this.ids
        getCentreCenter(centreId).then(response => {
          this.formData = response.data;
          this.$set(this.time,0,response.data.beginTime)
          this.$set(this.time,1,response.data.endTime)
          console.log(this.time)
          this.open = true;
          this.title = "修改活动";
        });
      },
      /*详情*/
      handleDetail() {
        this.$router.push({
          path: '/seckollDetail',
        })
      },
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            if (this.formData.id != undefined) {
              this.formData.beginTime = this.time[0]
              this.formData.endTime = this.time[1]
              updateCentreCenter(this.formData).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.linkOpen = false;
                this.open = false;
                this.getList();
              });
            } else {
              this.formData.beginTime = this.time[0]
              this.formData.endTime = this.time[1]
              addCentreCenter(this.formData).then(response => {
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
        const centreIds = row.id || this.ids;
        this.$modal.confirm('是否确认删除该条数据项？').then(function() {
          return delCentreCenter(centreIds);
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
        this.$refs.elForm.resetFields()
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
        let text = row.status == "NOT_STARTED" ||  row.status =="CLOSED" ? "开启" : "关闭";
        let para = {}
        this.$modal.confirm('确认要"' + text + '"该活动吗？').then(function() {
          if (row.status === "NOT_STARTED") {
            para = {
              status: 'IN_PROGRESS',
              id: row.id
            }
          } else if (row.status === "IN_PROGRESS") {
            para = {
              status: 'CLOSED',
              id: row.id
            }
          } else {
            para = {
              status: 'IN_PROGRESS',
              id: row.id
            }
          }

          return updateStatus(para);
        }).then(() => {
          row.status =para.status;
          this.$modal.msgSuccess(text + "成功");
          this.getList()
           this.$forceUpdate();
        }).catch(function() {
        });
      },
      handleProduct(row) {
        this.$router.push({
          path: '/integral/addPoint',
          query: row,
        })
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
