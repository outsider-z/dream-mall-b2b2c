<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item prop="daterange" label="时间">
        <el-date-picker 
          v-model="daterange" 
          type="daterange" 
          @change="timeChange" 
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="开票状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择" clearable>
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          >导出</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="invoiceList" table-layout="auto" :border="true" >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="订单号" prop="orderId" align="center" />
      <el-table-column label="发票抬头" prop="invoiceTitle" align="center" />
      <el-table-column label="邮箱" prop="emailAddress" align="center" />
      <el-table-column label="开票金额" prop="emailAddress" align="center" />
      <el-table-column label="发票类型" prop="invoiceType" align="center">
        <template slot-scope="scope">
          {{scope.row.invoiceType == 'PERSONAL' ? '个人' : '企业'}}
        </template>
      </el-table-column>
      <el-table-column label="开票状态" prop="status" align="center">
        <template slot-scope="scope">
          {{scope.row.status == 'INVOICING' ? '开票中' : '已开票'}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" />
      <el-table-column label="修改时间" prop="updateTime" align="center" />
      <!-- <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
         
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:shopper:edit']">上传发票</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>
<script>
  import {
    merchantQueryInvoiceList
  } from "@/api/mall-merchant/invoice";
  import {
    getAllProduct
  } from "@/api/product/product";
  import store from '@/store'
  export default {
    name: 'Manage',
    inheritAttrs: false,
    components: {},
    props: [],
    data() {
      return {
        invoiceList: [],
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
        daterange: [],
        showSearch: true,
        swiperOptions: [],
        
        statusOptions: [{
          "label": "开票中",
          "value": 'INVOICING'
        }, {
          "label": "已开票",
          "value": 'INVOICED'
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
        this.queryParams.merchantId=store.getters.merchantId;
        merchantQueryInvoiceList(this.queryParams).then(response => {
          this.invoiceList = response.rows;
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
    
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
        this.daterange=[];
        this.queryParams={
          pageNum: 1,
          pageSize: 10,
          merchantId:'',
          startTime:'',
          stopTime:''
        }
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.open = true;
        this.title = "添加社区";
      },
      /** 上传发票操作 */
      handleUpdate(row) {
        this.$router.push({
          path: '/merchant/invoiceIndex',
          query: row,
        })
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
      timeChange(val) {
        this.queryParams.startTime = val[0]
        this.queryParams.stopTime = val[1]

      },
      /** 导出按钮操作 */
      handleExport() {
        if (this.queryParams.startTime ===undefined || this.queryParams.stopTime ===undefined) {
          this.$modal.msgSuccess("请输入导出条件");
          return
        }
        this.download('order/merchant/invoice/export', {
          ...this.queryParams
        }, `invoiceInfo_${new Date().getTime()}.xlsx`)
      },
    }
  }
</script>
<style>
</style>
