<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="活动名称" prop="activeName">
        <el-input v-model="queryParams.activeName" placeholder="请输入活动名称" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="活动类型" prop="activeType">
        <el-select v-model="queryParams.activeType" placeholder="请选择活动类型" clearable>
          <el-option v-for="dict in dict.type.sys_market_type" :key="dict.value" :label="dict.label"
            :value="dict.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表单 -->
    <el-table v-loading="loading" :data="popupList" border>
      <el-table-column prop="activeType" label="活动类型" width="180" align="center">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_market_type" :value="scope.row.activeType"/>
        </template>
      </el-table-column>
      <el-table-column prop="activeName" label="活动名称" width="180" align="center" />
      <el-table-column label="活动开始时间" align="center" prop="beginTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.beginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动结束时间" align="center" prop="endTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最大商品数" prop="merchantMaxProduct" align="center" />
      <el-table-column label="活动状态" align="center">
        <template slot-scope="scope">
            <span v-if="scope.row.status =='NOT_STARTED'">未开始</span>
            <span v-if="scope.row.status =='IN_PROGRESS'">进行中</span>
            <span v-if="scope.row.status =='CLOSED'">已结束</span>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" align="center" fixed="right" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-circle-plus" @click="handleProduct(scope.row)"
            v-hasPermi="['merchant:join']">参加活动</el-button>
        </template>
      </el-table-column>
    </el-table>

  <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
  </div>
</template>
<script>
  import {
    queryActiveCentreList,
  } from "@/api/mall-merchant/active";
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
          activeType: undefined,
          beginTime: '',
          endTime: '',
          merchantMaxProduct: undefined,
          activeName:'',
        },
        rules: {},
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          activeType:'',
          activename:'',
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
        queryActiveCentreList(this.queryParams).then(response => {
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
          },
          this.resetForm("formData");
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
      // 取消按钮
      cancel() {
        this.open = false;
        this.linkOpen = false;
        this.reset();
      },
      handleProduct(row) {

        if(row.activeType == 'SPIKE'){

          this.$router.push({
            path: '/mall-merchant/activity/seckill-list',
            query: row,
          })

        }else if(row.activeType == 'GROUP'){

          this.$router.push({
            path: '/mall-merchant/activity/group-list',
            query: row,
          })

        }else if(row.activeType == 'POINT'){

          this.$router.push({
            path: '/mall-merchant/activity/point-product-list',
            query: row,
          })

        }else if(row.activeType == 'FESTIVAL'){

          this.$router.push({
            path: '/mall-merchant/avtivity/festival-lists',
            query: row,
          })


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
