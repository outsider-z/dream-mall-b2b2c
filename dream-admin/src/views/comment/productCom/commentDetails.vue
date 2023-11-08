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
      <el-form-item label="商品名称" prop="productName">
        <el-select v-model="productName" filterable remote reserve-keyword placeholder="请输入关键词" clearable
          :remote-method="remoteMethod" :loading="loading" @change="selectChange" :style="{width: '100%'}">
          <el-option v-for="item in productOptions" :key="item.value" :label="item.label" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="shopperList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="评论时间" prop="createTime" align="center" />
      <el-table-column label="评论者名称" prop="commentUserName" align="center" />
      <el-table-column prop="commentUserPhoto" label="用户头像" width="300" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" width="100" trigger="hover">
            <img :src="`${imgHost}` + scope.row.commentUserPhoto" alt="" style="width: 80px;height: 80px">
            <img slot="reference" :src="`${imgHost}` + scope.row.commentUserPhoto"
              style="max-height: 50px;max-width: 50px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="评论内容" prop="commentContent" :show-overflow-tooltip="true" align="center" />
      <el-table-column prop="commentImageFirst" label="评论图片" width="300" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" width="100" trigger="hover" v-if="scope.row.commentImageFirst">
            <img :src="`${imgHost}` + scope.row.commentImageFirst" alt="" style="width: 80px;height: 80px">
            <img slot="reference" :src="`${imgHost}` + scope.row.commentImageFirst"
              style="max-height: 50px;max-width: 50px">
          </el-popover>
          <span v-else>暂无图片</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:shopper:edit']">评论详情</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:shopper:remove']">删除评论</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <el-dialog title="评论详情" :visible.sync="open" :before-close="cancel">
      <el-form ref="elForm" :model="rowInfo" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="评论时间" prop="createTime">
          {{rowInfo.createTime}}
        </el-form-item>
        <el-form-item label="评论者名称" prop="commentUserName">
          {{rowInfo.commentUserName}}
        </el-form-item>
        <el-form-item label="评论者头像" prop="commentUserPhoto">
          <img :src="`${imgHost}` + rowInfo.commentUserPhoto" class="avatar">
        </el-form-item>
        <el-form-item label="评论内容" prop="commentContent">
          {{rowInfo.commentContent}}
        </el-form-item>
        <el-form-item label="评论图片" prop="rowInfo" v-if="rowInfo.commentImageFirst">
          <el-row :gutter="20">
            <el-col :span="3"><img :src="`${imgHost}` + rowInfo.commentImageFirst" class="avatar"></el-col>
            <el-col :span="3" v-if="rowInfo.commentImageSecond"><img :src="`${imgHost}` + rowInfo.commentImageSecond" class="avatar"></el-col>
            <el-col :span="3" v-if="rowInfo.commentImageThird"><img :src="`${imgHost}` + rowInfo.commentImageThird" class="avatar"></el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="open=false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    commentList
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
          subjectId: this.$route.query.subjectId,
          commentType: 'MALL_ORDER',
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
        rowInfo:{}
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
        getAllProduct(para).then(response => {
          this.productList = response.data.map(item => {
            return {
              value: `${item.mallProductEntity.id}`,
              label: `${item.mallProductEntity.productName}`
            };
          });
        });
        commentList(this.queryParams).then(response => {
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
      /**  */
      handleUpdate(row) {
        this.open = true
        this.rowInfo = row
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
      // 默认
      handleDefault(row) {
        let text = row.defaultFlag === "0" ? "默认" : "关闭";
        this.$modal.confirm('确认要' + text + '"' + row.merchantName + '"该模板吗？').then(function() {
          return updateDelivery(row);
        }).then(() => {
          this.$modal.msgSuccess(text + "成功");
        }).catch(function() {
          row.defaultFlag = row.defaultFlag === "0" ? "1" : "0";
        });
      },
      selectChange(val) {
        this.queryParams.subjectId = val.value
        this.productName = val.label
      },
    }
  }
</script>
<style scoped>
  .avatar{
    width: 80px;
    height: 80px;
  }
</style>
