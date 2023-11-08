<template>
  <div class="app-container">
    <el-row>
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="秒杀商品" label-width="130px" prop="productId">
          <el-input v-model="formData.productDTO" disabled clearable :style="{width: '40%'}"></el-input>
        </el-form-item>
        <el-form-item label-width="130px" label="日期范围" prop="time">
          <el-date-picker type="datetimerange" v-model="formData.time" format="yyyy-MM-dd HH:mm:ss" disabled
            value-format="yyyy-MM-dd HH:mm:ss" :style="{width: '40%'}" start-placeholder="开始日期" end-placeholder="结束日期"
            range-separator="至" clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label-width="130px" label="商品库存" prop="stock">
          <el-input-number v-model="formData.stock" placeholder="商品库存" disabled controls-position=right>
          </el-input-number>
        </el-form-item>
        <el-form-item label-width="130px" label="秒杀价格" prop="unitPrice">
          <el-input-number v-model="formData.unitPrice" disabled placeholder="秒杀价格" controls-position=right>
          </el-input-number>
        </el-form-item>
        <el-form-item label-width="130px" label="红包数量" prop="redPacketNum">
          <el-input-number v-model="formData.redPacketNum" disabled placeholder="红包数量" controls-position=right>
          </el-input-number>
        </el-form-item>
        <el-form-item label-width="130px" label="积分红包总额度" prop="redPacketLimit">
          <el-input-number v-model="formData.redPacketLimit" disabled placeholder="积分红包总额度" controls-position=right>
          </el-input-number>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table v-loading="loading" :data="popupList">
        <el-table-column label="下单时间" prop="productName" width="300" align="center" />
        <el-table-column label="订单号" prop="redPacketNum" width="200" align="center" />
        <el-table-column label="会员信息" prop="redPacketLimit" width="200" align="center" />
        <el-table-column label="秒杀开始时间" align="center" prop="startTime" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.startTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="秒杀结束时间" align="center" prop="endTime" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.endTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品数量" prop="stock" width="200" align="center" />
        <el-table-column label="商品金额" prop="unitPrice" width="200" align="center" />
        <el-table-column label="实付金额" prop="unitPrice" width="200" align="center" />
        <el-table-column label="订单状态" prop="unitPrice" width="200" align="center" />
        <el-table-column label="买家备注" prop="unitPrice" width="200" align="center" />
        <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
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
    </el-row>
  </div>
</template>
<script>
  import {
    getDicts,
    updateData
  } from "@/api/system/dict/data";
  import {
    listConfig
  } from "@/api/system/popup";
  export default {
    name: 'Logistics',
    components: {},
    props: [],
    data() {
      return {
        popupList: [],
        formData: {
          dictValue: undefined,
        },
        rules: {
          dictValue: [{
            required: true,
            message: '购买快递物流服务后获取的AppCode',
            trigger: 'blur'
          }],
        },
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        total: 0,
      }
    },
    computed: {},
    watch: {},
    created() {
      this.getDictType()
      this.getList()
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
      },
      getDictType() {
        getDicts('sys_logistics_set').then(res => {
          if (res.data.length > 0) {
            this.formData = res.data[0]
          }
        });
      },

      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            updateData(this.formData).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getDictType();
            });
          }
        })
      },
      resetForm() {
        this.$refs['elForm'].resetFields()
      },
    }
  }
</script>
<style>
  .el-row {
    padding: 20px;
    margin-bottom: 20px;
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>
