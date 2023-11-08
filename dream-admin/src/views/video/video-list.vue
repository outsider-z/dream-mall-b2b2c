<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="视频标题" prop="realName">
        <el-input v-model="queryParams.realName" placeholder="请输入用户姓名" clearable />
      </el-form-item>
      <el-form-item label="视频分类" prop="realName">
        <el-input v-model="queryParams.realName" placeholder="请输入用户姓名" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option v-for="dict in dict.type.sys_review_type"  :label="dict.label" :key="dict.value" :value="dict.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          size="mini"
          :disabled="single"
          @click="handApproved"
        >批量审核</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!-- 表 -->
    <el-table  ref="multipleTable" v-loading="loading" :data="videoList" border @selection-change="handleSelectionChange">
      <el-table-column
      type="selection"
      width="55">
    </el-table-column>
      <el-table-column label="视频标题" prop="videoTitle" width="200" align="center" />
      <el-table-column label="视频分类" prop="videoType" width="200" align="center" />
      <el-table-column label="上传时间" prop="updateTime" width="200" align="center" />
      <el-table-column label="视频封面" prop="coverPath" width="200" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <el-popover placement="right" width="180" trigger="hover" style="margin-right: 20px;">
            <img :src="scope.row.coverPath" alt="" style="width: 240px;height: 150px" />
            <img slot="reference" :src="scope.row.coverPath" style="max-height: 40px;max-width: 40px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="视频" prop="coverPath" width="200" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <el-button type="success" size="small " plain @click="playVideo(scope.row)"
            v-hasPermi="['system:info:remove']">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="300" align="center">
        <template slot-scope="scope">
          {{scope.row.status==='APPROVING'?'审核中':(scope.row.status==='APPROVED'?'已审核':'已拒绝')}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button :disabled="scope.row.status==='APPROVING'?false:true" type="success" size="small " plain
            @click="handleApply(scope.row)" v-hasPermi="['system:info:remove']">审核</el-button>
          <el-button :disabled="scope.row.status==='APPROVING'?false:true" type="warning" size="small " plain
            @click="handleReject(scope.row)" v-hasPermi="['system:info:remove']">拒绝</el-button>
          <el-button type="danger" size="small " plain @click="handledDele(scope.row)"
            v-hasPermi="['system:info:remove']">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <el-dialog :title="dialogTitle" :visible.sync="dialogOpen" width="45%">
      <el-form ref="elForm" :model="formData" :rules="rules" :inline="true" size="medium" label-width="100px">
        <el-form-item label="拒绝原因" prop="rejectReason">
          <el-input v-model="formData.rejectReason" placeholder="请输入拒绝原因" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="rejectSubmit">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="视频播放" :visible.sync="videoOpen" width="45%">
        <video
          width="40%"
          ref="myVideo" :src="myVideoUrl"
          id="video" oncontextmenu="return false"
            controlslist="nodownload"
            class="video" autoplay="autoplay"></video>
      <div slot="footer">
        <el-button @click="cancelVideo">取消</el-button>
        <!-- <el-button type="primary" @click="rejectSubmit">确定</el-button> -->
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import {
    modifyUserCertificationAuditStatus,
    getRealNameDetails,

    getVideoList,
    getVideoDetails,
    modifyVideoAuditStatus,
    delVideo

  } from "@/api/video/video";
  import store from '@/store'
  export default {
    dicts: ['sys_user_card_type','sys_review_type'],
    data() {
      return {
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        cardTypeOptions: [],
        loading: false,
        videoList: [],
        total: 0,
        item: {},
        formData: {
          rejectReason: ''
        },
        dialogOpen: false,
        videoOpen: false,
        myVideoUrl: '',
        dialogTitle: '',
        item: {},
        rules: {
          rejectReason: [{
            required: true,
            message: '请输入拒绝原因',
            trigger: 'change'
          }]
        },
        multipleSelection:[]
      }
    },
    created() {
      this.getList()
    },
    mounted() {},
    methods: {

      getList() {
        this.loading = true;
        getVideoList(this.queryParams).then(response => {
          this.videoList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection=val;
      },
      //批量审核
      handApproved(){

          if(this.multipleSelection.length==0){
            this.$message.error('请选择要审核的视频');
            return;
          }

          let parameter={
            acceptType:'AGREED',
            videoIdList:[]
          }
          this.multipleSelection.forEach(val=>{
            parameter.videoIdList.push(val.id);
          })
          modifyVideoAuditStatus(parameter).then(response => {
              this.$modal.msgSuccess("操作成功");
              this.dialogOpen = false;
              this.multipleSelection=[];
              this.getList();
            });

      },
      /**
       * 搜索按钮事件
       */
      searchQuery() {
        this.getList();
      },
      // 新增取消
      cancel() {
        this.resetQuery();
        this.dialogOpen = false;
      },

      /** 拒绝按钮操作 */
      handleReject(row) {
        this.resetQuery();
        this.dialogTitle = '拒绝原因';
        this.dialogOpen = true;
        this.item = row;
      },
      //拒绝
      rejectSubmit() {
        this.formData.acceptType = 'REJECT';
        this.formData.id = this.item.id;
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            modifyVideoAuditStatus(this.formData).then(response => {
              this.$modal.msgSuccess("操作成功");
              this.dialogOpen = false;
              this.getList();
            });
          }

        })
      },
      /**
       * @param {Object} row
       * 审核通过
       */
      handleApply(row) {
        // this.formData = row;
        row.acceptType = 'AGREED';
       
        this.$modal.confirm('是否确认同意该条数据项？').then(function() {
          let list=[];
          list.push(row.id)
          row.videoIdList=list;
          return modifyVideoAuditStatus(row);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("操作成功");
        }).catch(() => {});
      },
      //参数重置
      resetQuery() {
        this.resetForm("queryForm");
        this.resetForm("elForm");
        this.formData = {
          rejectReason: ''
        }
      },
      //删除
      handledDele(row) {
        this.$modal.confirm('是否删除该条数据项？').then(function() {
          return delVideo(row.id);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});

      },
      playVideo(row) {
        this.videoOpen = true;
        this.myVideoUrl = row.videoPath;
        let media = document.getElementById("video");
        //监听视频准备完毕马上播放，不需要可以注释
        media.play()
      },
      cancelVideo(){
        this.videoOpen=false;
        let media = document.getElementById("video");
        //监听视频准备完毕马上播放，不需要可以注释
        media.pause();


      }

    }
  }
</script>
<style>
  .vide-div{
    display: flex;
    align-items: center;
  }
  .video {
    object-fit: fill;
  }
</style>
