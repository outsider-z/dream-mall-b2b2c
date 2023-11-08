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
      <!-- <el-form-item label="商品名称" prop="productName">
        <el-select v-model="productName" filterable remote reserve-keyword placeholder="请输入关键词" clearable
          :remote-method="remoteMethod" :loading="loading" @change="selectChange" :style="{width: '100%'}">
          <el-option v-for="item in productOptions" :key="item.value" :label="item.label" :value="item">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="shopperList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="总评" prop="sharedTotal" align="center" />
      <el-table-column label="好评" prop="likeTotal" align="center" />
      <el-table-column label="差评" prop="unlikeTotal" align="center" />
      <el-table-column label="带图评论" prop="photoTotal" align="center" />
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:shopper:edit']">查看评论</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:shopper:remove']">删除评论</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>
<script>
  import {
    queryCommentSummaryList
  } from "@/api/order/comment";
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
          subjectId: '',
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
        let para = {
          pageNum: 1,
          pageSize: 1000000,
        }
        // getAllProduct(para).then(response => {
        //   this.productList = response.data.map(item => {
        //     return {
        //       value: `${item.mallProductEntity.id}`,
        //       label: `${item.mallProductEntity.productName}`
        //     };
        //   });
        // });
        queryCommentSummaryList(this.queryParams).then(response => {
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
        this.formData = {
            communalName: '',
            contactName: '',
            mobileNo: '',
            merchantAddress: '',
            deliveryFromLongitude: '',
            deliveryFromLatitude: '',
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
        this.title = "添加社区";
      },
      /** 查看详情操作 */
      handleUpdate(row) {
        this.$router.push({
          path: '/comment/videoComDetail',
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
      selectChange(val) {
        this.queryParams.subjectId = val.value
        this.productName = val.label
      },
    }
  }
</script>
<style>
</style>
