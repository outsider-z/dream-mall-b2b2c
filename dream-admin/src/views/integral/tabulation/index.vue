<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item prop="dateSearchType">
        <el-radio-group v-model="queryParams.dateSearchType" size="medium">
          <el-radio v-for="(item, index) in dateSearchTypeOptions" :key="index" :label="item.value"
            :disabled="item.disabled">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="customsj">
        <el-date-picker v-model="customsj" type="daterange" @change="timeChange" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="shopperList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户昵称" prop="userName" align="center" />
      <el-table-column label="头像" prop="photoUrl" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" width="180" trigger="hover">
            <img :src="`${imgHost}` + scope.row.photoUrl" alt="" style="width: 150px;height: 150px">
            <img slot="reference" :src="`${imgHost}` + scope.row.photoUrl" style="max-height: 40px;max-width: 40px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="签到积分数" prop="signTotal" align="center" />
      <el-table-column label="签到天数" prop="continueDays" align="center" />
      <el-table-column label="最后签到时间" prop="lastSignDate" align="center" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>
<script>
  import {
    listUserSign
  } from "@/api/system/point";
  import {
    getAllProduct
  } from "@/api/product/product";
  export default {
    name: 'Manage',
    inheritAttrs: false,
    components: {},
    props: [],
    data() {
      return {
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
        formData: {},
        rules: {},
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        customsj: [],
        showSearch: true,
        swiperOptions: [],
        dateSearchTypeOptions: [{
          "label": "昨日",
          "value": 1
        }, {
          "label": "今日",
          "value": 2
        }, {
          "label": "最近七日",
          "value": 3
        }, {
          "label": "自定义时间段",
          "value": 4,
          'disabled': true
        }],
        searchWithdrawStatusOptions: [{
          "label": "全部",
          "value": 1
        }, {
          "label": "未处理",
          "value": 2
        }],
        productList: [],
        productOptions: [],
        productName: '',
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
        listUserSign(this.queryParams).then(response => {
          this.shopperList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.productOptions = this.productList.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.productOptions = [];
        }
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      reset() {
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
        this.title = "添加社区";
      },
      /** 查看详情操作 */
      handleUpdate(row) {
        this.$router.push({
          path: '/comment/commentDetails',
          query: row,
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {},
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
      timeChange(val) {
        this.queryParams.dateSearchType = 0
      },
    }
  }
</script>
<style>
</style>
