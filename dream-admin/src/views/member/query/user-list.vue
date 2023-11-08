<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="会员名称" prop="nickName">
        <el-input v-model="queryParams.nickName" placeholder="请输入会员名称" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="电话号码" prop="phoneNo">
        <el-input v-model="queryParams.phoneNo" placeholder="请输入电话号码" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="注册时间" prop="taskType">
                <el-date-picker
                    v-model="dateRange"
                    style="width: 240px"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
            </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:info:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:info:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:info:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['system:role:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" table-layout="auto" @selection-change="handleSelectionChange" :border="true">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="注册时间" prop="createTime" how-overflow-tooltip  align="center" />
      <el-table-column prop="img" label="头像"  align="center">
        <template slot-scope="scope">
          <el-popover placement="right"  trigger="hover">
            <img :src="`${imgHost}` + scope.row.photoUrl" alt="" style="width: 150px;height: 150px">
            <img slot="reference" :src="`${imgHost}` + scope.row.photoUrl" style="max-height: 40px;max-width: 40px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="sex"  align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.sex == '0' ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column label="是否为采购员" show-overflow-tooltip prop="buyerFlag"  align="center">
        <template slot-scope="scope">
          {{ scope.row.buyerFlag == '0' ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" prop="nickName"  show-overflow-tooltip align="center" >
        <template slot-scope="scope">
           <span class="ml10 receiptsNumStyle"  @click="chatChange(scope.row)" >{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出生日期" prop="birthday" show-overflow-tooltip  align="center" />
      <el-table-column label="电话号码" prop="phoneNo" show-overflow-tooltip  align="center" />
      <el-table-column label="会员等级" prop="userLevelEntity" show-overflow-tooltip  align="center">
        <template slot-scope="scope">
          {{ scope.row.userLevelEntity.levelName }}
        </template>
      </el-table-column>
      <el-table-column label="是否有上级" prop="invitationId"  align="center" >
          <template slot-scope="scope">
            <span :style="scope.row.invitationId==null?'color:#F56C6C ':'color:#67C23A'"> {{ scope.row.invitationId==null?'否':'是' }}</span>
          </template>
      </el-table-column>
      <el-table-column label="个性签名" prop="signature" show-overflow-tooltip align="center"/>
      <el-table-column label="操作" align="center" width="200" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" style="color:#67C23A" icon="el-icon-view" @click="handleDetails(scope.row)"
            v-hasPermi="['system:info:edit']">查看</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:info:edit']">修改</el-button>
          <el-button size="mini" type="text" style="color:#F56C6C" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:info:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <el-dialog :title="title" :visible.sync="open" width="45%" height="45%">
      <el-form ref="elForm" :model="formData" :rules="rules" :inline="true" size="medium" label-width="100px" :disabled="disabledFlag">
        <el-form-item label="会员姓名" prop="nickName">
          <el-input v-model="formData.nickName" placeholder="请输入姓名" clearable :style="{ width: '100%' }"></el-input>
        </el-form-item>
        <el-form-item label="会员性别" prop="sex">
          <el-radio-group v-model="formData.sex" size="medium">
            <el-radio v-for="(item, index) in sexOptions" :key="index" :label="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="手机号码" prop="phoneNo">
          <el-input v-model="formData.phoneNo" placeholder="请输入手机号码" :maxlength="11" show-word-limit clearable
            :style="{ width: '100%' }"></el-input>
        </el-form-item>

        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker v-model="formData.birthday" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date"
            placeholder="选择日期" :style="{ width: '100%' }">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="直邀人" prop="invitationId">
          <el-select v-model="formData.invitationId"
                filterable remote clearable
                reserve-keyword placeholder="请输入邀请人手机号码"
               :remote-method="findUserList" :loading="loading">
            <el-option v-for="item in userOptions" :key="item.id" :label="item.nickName+' - '+item.phoneNo" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="个性签名" prop="signature" :style="{ width: '100%' }">
          <el-input v-model="formData.signature" placeholder="请输入个性签名" clearable  show-word-limit
            maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="会员级别" prop="userLevelId" v-if="title == '修改会员信息'">
          <el-select v-model="formData.userLevelId" placeholder="请选择会员级别" clearable :style="{ width: '100%' }">
            <el-option v-for="(item, index) in levelList" :key="index" :label="item.levelName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级会员" prop="supervisorId" v-if="title == '修改会员信息'">
          <el-input v-model="formData.supervisorId" placeholder="请输入上级会员" clearable :style="{ width: '100%' }"></el-input>
        </el-form-item>
        <el-form-item label="采购标识" style="width: 100%;">
          <el-switch v-model="formData.buyerFlag" active-color="#13ce66" inactive-color="#909399" active-value="0"
            inactive-value="1">
          </el-switch>
        </el-form-item>
        <el-form-item label="用户头像" prop="photoUrl">
          <el-upload class="avatar-uploader" :action="uploadFileUrl" :show-file-list="false" :headers="headers"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="formData.photoUrl" :src="`${imgHost}` + formData.photoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="!disabledFlag">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
    <!-- <el-row>
      <el-button type="primary" icon="el-icon-service" circle @click="chatChange"></el-button>
    </el-row> -->
  </div>
</template>
<script>
import {
  listInfo, getInfo, delInfo, addInfo, updateInfo
} from "@/api/member/query";
import {
  listLevel
} from "@/api/member/level";
import store from '@/store'
export default {
  name: 'User-list',
  inheritAttrs: false,
  props: [],
  data() {
    return {
      headers: {
        Authorization: "Bearer " + store.getters.token
      },
      infoList: [],
      levelList: [],
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
      dateRange:[],
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile/oss",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        phoneNo: '',
        nickName: '',
      },
      showSearch: true,
      formData: {
        nickName: '',
        birthday: '',
        phoneNo: '',
        photoUrl: '',
        sex: '0',
        signature: '',
        invitationId: '',
      },
      sexOptions: [{
        "label": "男",
        "value": "0"
      }, {
        "label": "女",
        "value": "1"
      }],
      rules: {
        nickName: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }],
        phoneNo: [{
          required: true,
          message: '请输入手机号码',
          trigger: 'blur'
        }, {
          pattern: /^1(3|4|5|7|8|9)\d{9}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }],
        sex: [{
          required: true,
          message: '性别不能为空',
          trigger: 'change'
        }],
        // birthday: [{
        //   required: true,
        //   message: '请选择出生日期',
        //   trigger: 'change'
        // }],
      },
      userLevelUuidOptions: [{
        "label": "选项一",
        "value": 1
      }, {
        "label": "选项二",
        "value": 2
      }],
      userOptions: [],
      disabledFlag:false
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getList()
    this.getLevel()
  },
  mounted() { },
  methods: {

    /** 导出按钮操作 */
    handleExport() {
      if(this.dateRange!=null && this.dateRange.length>0){
            this.queryParams.startTime=this.dateRange[0];
            this.queryParams.stopTime=this.dateRange[1];
        }else{
          this.$modal.msgSuccess("请输入导出时间段，时间段限制一个月");
        }
      this.download('member/info/export', {
        ...this.queryParams
      }, `userInfo_${new Date().getTime()}.xlsx`)
    },
    //查询直接邀请人
    findUserList(phoneNo) {
      let params={
        phoneNo:phoneNo,
        pageNum: 1,
        pageSize: 10
      }
      listInfo(params).then(response => {
        this.userOptions = response.rows;
      });
    },

    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      if(this.dateRange!=null && this.dateRange.length>0){
            this.queryParams.startTime=this.dateRange[0];
            this.queryParams.stopTime=this.dateRange[1];
        }else{
            this.queryParams.startTime="";
            this.queryParams.stopTime="";
        }
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
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
      this.formData = {
        nickName: '',
        birthday: '',
        phoneNo: '',
        photoUrl: '',
        sex: '0',
        signature: '',
        invitationId: '',
      };
      this.disabledFlag=false;
      this.resetForm("elForm");
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.postId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加会员信息";
    },
    /**查看 */
    handleDetails(row){
      this.disabledFlag=true;
      const levelId = row.id || this.ids
      getInfo(levelId).then(response => {
        this.formData = response.data;
        //有上级在查询
        if(this.formData.invitationEntity){
           this.findUserList(this.formData.invitationEntity.phoneNo);
        }
        this.open = true;
        this.title = "会员信息";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const levelId = row.id || this.ids
      getInfo(levelId).then(response => {
        this.formData = response.data;
        //有上级在查询
        if(this.formData.invitationEntity){
           this.findUserList(this.formData.invitationEntity.phoneNo);
        }
        this.open = true;
        this.title = "修改会员信息";
      });
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (valid) {
          if (this.formData.id != undefined) {
            updateInfo(this.formData).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.linkOpen = false;
              this.open = false;
              this.getList();
            });
          } else {
            addInfo(this.formData).then(response => {
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
      this.$modal.confirm('是否确认删除该条数据项？').then(function () {
        return delInfo(levelIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 状态修改
    handleStatusChange(row) {
      let text = row.defaultFlag === "0" ? "使用" : "关闭";
      this.$modal.confirm('确认要默认"' + text + '"该会员等级吗？').then(function () {
        return updateInfo(row);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function () {
        row.defaultFlag = row.defaultFlag === "0" ? "1" : "0";
      });
    },
    handleAvatarSuccess(res, file) {
      this.formData.photoUrl = res.data.url;
    },
    beforeAvatarUpload(file) {
      let isAccept = new RegExp('image/*').test(file.type)
      if (!isAccept) {
        this.$message.error('请选择jpg,jpeg或者png格式的图片')
      }
      // const isLt2M = file.size / 1024 / 1024 < 2;
      return isAccept;
    },
    // 团队
    chatChange(row) {
      this.$router.push({
          path: '/user-team-list',
          query: {
            id: row.id
          }
      })

    },
  }
}
</script>
<style >
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
.receiptsNumStyle {
  cursor: pointer;
  color: #1890ff;
}
</style>
