<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="所属公司" prop="deviceCompany">
        <el-input v-model="queryParams.nickName" placeholder="请输入会员名称" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="机身号" prop="fuselageNumber">
        <el-input v-model="queryParams.phoneNo" placeholder="请输入机身号" clearable style="width: 240px"
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
          v-hasPermi="['system:brand:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:brand:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:brand:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!-- 表单 -->
    <el-table v-loading="loading" :data="deviceList"  border>
      <el-table-column label="所属公司" prop="deviceCompany" width="300" align="center" />
      <el-table-column label="设备号" prop="printerNo" width="300" align="center" />
      <el-table-column label="设备状态" prop="printerNo" width="300" align="center" >
        <template slot-scope="scope">
          <el-tag  :type="scope.row.deviceStatus==='ONLINE'?'success':'danger'">{{ scope.row.deviceStatus==='ONLINE'?'在线':'离线'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" prop="approveStatus" width="300" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.approveStatus==='APPROVING'?' 审核中':(scope.row.approveStatus==='APPROVED'?' 审核通过':'拒绝')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属档口" prop="deviceStall" width="300" align="center" />
      <el-table-column label="设备类型" prop="deviceType" width="300" align="center" />
      <el-table-column label="机身号" prop="fuselageNumber" width="300" align="center" />
      <el-table-column label="商户手机号" prop="merchantNo" width="300" align="center" />
      <el-table-column label="脱机最大限额" prop="offlineMaxLimit" width="300" align="center" />
      <el-table-column label="脱机最大次数" prop="offlineMaxTimes" width="300" align="center" />
      <el-table-column label="设备号" prop="deviceNumber" width="300" align="center" />
      <el-table-column label="操作" align="center" width="300" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:brand:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:brand:remove']">删除</el-button>

            <el-button v-if="scope.row.approveStatus==='APPROVING'" size="mini" type="text" icon="el-icon-check" @click="handleApply(scope.row)"
            v-hasPermi="['system:brand:remove']">通过</el-button>

            <el-button v-if="scope.row.approveStatus==='APPROVING'" size="mini" type="text" icon="el-icon-close" @click="handleReject(scope.row)"
            v-hasPermi="['system:brand:remove']">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
      <!-- 新增 -->
    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="elForm" :model="formData" :rules="rules" :inline="true" size="medium" label-width="120px">

        <el-form-item label="所属公司" prop="deviceCompany">
          <el-input v-model="formData.deviceCompany" placeholder="请输入所属公司"   clearable ></el-input>
        </el-form-item>

        <el-form-item label="设备号" prop="deviceNumber">
          <el-input v-model="formData.deviceNumber" placeholder="请输入设备号"  clearable ></el-input>
        </el-form-item>

        <el-form-item label="所属档口" prop="deviceStall">
          <el-input v-model="formData.deviceStall" placeholder="请输入所属档口"  clearable ></el-input>
        </el-form-item>

        <el-form-item label="设备类型" prop="deviceType">
          <el-input v-model="formData.deviceType" placeholder="请输入设备类型"  clearable ></el-input>
        </el-form-item>

        <el-form-item label="机身号" prop="fuselageNumber">
          <el-input v-model="formData.fuselageNumber" placeholder="请输入机身号" clearable ></el-input>
        </el-form-item>

        <el-form-item label="商户手机号" prop="merchantNo" >
          <el-input v-model="formData.merchantNo" placeholder="请输入商户手机号" clearable :maxlength="11" ></el-input>
        </el-form-item>

        <el-form-item label="最大限额" prop="offlineMaxLimit">
          <el-input v-model="formData.offlineMaxLimit" placeholder="请输入脱机最大限额"  clearable></el-input>
        </el-form-item>
        
        <el-form-item label="最大次数" prop="offlineMaxTimes">
          <el-input v-model="formData.offlineMaxTimes" placeholder="请输入脱机最大次数" clearable :maxlength="11" ></el-input>
        </el-form-item>
        
        <el-form-item label="打印机编号" prop="printerNo">
          <el-input v-model="formData.printerNo" placeholder="请输入打印机编号" :maxlength="11" clearable></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="拒绝原因" :visible.sync="dialogOpen" width="45%">
      <el-form ref="elformRejec" :model="formReject" :rules="rules" :inline="true" size="medium" label-width="100px">
        <el-form-item label="拒绝原因" prop="rejectReason">
          <el-input v-model="formData.rejectReason" placeholder="请输入拒绝原因" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="rejectSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

  import {
    listLevel
  } from "@/api/member/level";

  import {
    addDeviceInfo,
    updateDeviceInfo,
    getDeviceList,
    delDeviceInfo,
    getDeviceInfoDetails,
    auditDeviceStatusInfo
  } from "@/api/hardware/equipmentinfo-list";

  import store from '@/store'
  export default {
    name: 'Query',
    inheritAttrs: false,
    components: {},
    props: [],
    data() {
      return {
        headers: {
          Authorization: "Bearer " + store.getters.token
        },
        deviceList: [],
        levelList:[],
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
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile/oss",
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          phoneNo:'',
          nickName:'',
        },
        showSearch: true,
        formData: {
          deviceCompany:'',//所属公司
          deviceNumber:'',//设备号
          deviceStall:'',//所属档口
          deviceType:'',//设备类型
          fuselageNumber:'',//机身号
          merchantNo:'',//商户手机号
          offlineMaxLimit:'',//脱机最大限额
          offlineMaxTimes:'',//脱机最大次数
          printerNo:''//打印机编号

        },
        formReject:{

        },
        dialogOpen:false,
        rules: {
          deviceNumber:[
          {
            required: true,
            message: '请输入设备号',
            trigger: 'blur'
          }
          ],
          deviceCompany: [
            {
            required: true,
            message: '请输入所属公司',
            trigger: 'blur'
          }],
          merchantNo: [{
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          }, {
            pattern: /^1(3|4|5|7|8|9)\d{9}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }],
          offlineMaxLimit:[
          {
            required: true,
            message: '请输入脱机最大限额',
            trigger: 'blur'
          }
          ],
          offlineMaxTimes:[
          {
            required: true,
            message: '请输入脱机最大次数',
            trigger: 'blur'
          }
          ],





         
        },
        
      }
    },
    computed: {},
    watch: {},
    created() {
      this.getList()
      this.getLevel()
    },
    mounted() {},
    methods: {
      /** 查询设备列表 */
      getList() {
        this.loading = true;
        getDeviceList(this.queryParams).then(response => {
          this.deviceList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      /** 查询会员等级 */
      getLevel() {
        let para = {
          pageNum: 1,
          pageSize: 1000,
        }
        listLevel(para).then(response => {
          this.levelList = response.rows;
        });
      },
      // 表单重置
      reset() {
        this.form = {
          deviceCompany:'',//所属公司
          deviceNumber:'',//设备号
          deviceStall:'',//所属档口
          deviceType:'',//设备类型
          fuselageNumber:'',//机身号
          merchantNo:'',//商户手机号
          offlineMaxLimit:'',//脱机最大限额
          offlineMaxTimes:'',//脱机最大次数
          printerNo:''//打印机编号
        };
        this.resetForm("form");
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加设备信息";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const levelId = row.id 
        getDeviceInfoDetails(levelId).then(response => {
          this.formData = response.data;
          this.open = true;
          this.title = "修改设备信息";
        });
      },
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            if (this.formData.id != undefined) {
              updateDeviceInfo(this.formData).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.linkOpen = false;
                this.open = false;
                this.getList();
              });
            } else {
              addDeviceInfo(this.formData).then(response => {
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
        const levelIds = row.id || this.ids;
        this.$modal.confirm('是否确认删除该条数据项？').then(function() {
          return delDeviceInfo(levelIds);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 状态修改
      handleStatusChange(row) {
        let text = row.approveStatus === "AGREED" ? "使用" : "关闭";
        this.$modal.confirm('确认要默认"' + text + '"该会员等级吗？').then(function() {
          return updateDeviceInfo(row);
        }).then(() => {
          this.$modal.msgSuccess(text + "成功");
        }).catch(function() {
          row.defaultFlag = row.defaultFlag === "0" ? "1" : "0";
        });
      },
        /**
       * @param {Object} row
       * 审核通过
       */
       handleApply(row) {
        // this.formData = row;
        let para={
          acceptType:"AGREED",
          id:row.id
        }
        this.$modal.confirm('是否确认同意该条数据项？').then(function() {
          return auditDeviceStatusInfo(para);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("操作成功");
        }).catch(() => {});
      },
         /**
       * @param {Object} row
       * 拒绝通过
       */
      handleReject(row){
        this.dialogOpen=true;
        this.formReject.id=row.id;
        this.formReject.acceptType="REJECT";
      },
      //拒绝
      rejectSubmit(){
        if(this.formReject.rejectReason===''){

          this.$modal.msgError("输入拒绝原因");
        }
        auditDeviceStatusInfo(this.formReject).then(response => {
              this.$modal.msgSuccess("操作成功");
              this.dialogOpen = false;
              this.getList();
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
