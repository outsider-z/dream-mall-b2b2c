<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:swiper:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:swiper:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:swiper:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="seckillList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="活动开始时间" align="center" prop="beginTime">
        <template slot-scope="scope">
          <span>{{ scope.row.beginTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动结束时间" align="center" prop="endTime">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最大商品数量" align="center" prop="maxProductNum">
        <template slot-scope="scope">
          <span>{{scope.row.maxProductNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="红包数量" align="center" prop="redPacketNum">
        <template slot-scope="scope">
          <span>{{scope.row.redPacketNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="积分数量" align="center" prop="point">
        <template slot-scope="scope">
          <span>{{scope.row.point}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="500" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-menu" @click="handleProduct(scope.row)"
            v-hasPermi="['system:swiper:edit']">配置商品</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-tickets" @click="handleDetail(scope.row)"
            v-hasPermi="['system:swiper:edit']">秒杀详情</el-button> -->
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:swiper:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:swiper:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    <el-dialog :title="title" :visible.sync="open" :before-close="cancel">
      <el-form ref="elForm" :model="formData" :rules="rules" label-width="150px" size="mini">
        <el-row :gutter="15">
          <el-col :span="10">
            <el-form-item label="时间范围" prop="beginTime">
              <el-time-select placeholder="起始时间" v-model="formData.beginTime" :picker-options="{
                    start: '00:00',
                    step: '00:60',
                    end: '24:00'
                  }">
              </el-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label-width="-1px" label="" prop="endTime">
              <el-time-select placeholder="结束时间" v-model="formData.endTime" :picker-options="{
                    start: '00:00',
                    step: '00:60',
                    end: '24:00',
                    minTime: formData.beginTime
                  }">
              </el-time-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label-width="150px" label="商品数" prop="maxProductNum">
          <el-input-number v-model="formData.maxProductNum" placeholder="商品数" :style="{width: '59.5%'}" :min="0"
            controls-position=right></el-input-number>
        </el-form-item>
        <el-form-item label-width="150px" label="积分数量" prop="point">
          <el-input-number v-model="formData.point" placeholder="积分数量" :min="0" :style="{width: '59.5%'}"
            controls-position=right></el-input-number>
        </el-form-item>
        <el-form-item label-width="150px" label="红包数量" prop="redPacketNum">
          <el-input-number v-model="formData.redPacketNum" placeholder="积分数量" :min="0" :style="{width: '59.5%'}"
            controls-position=right> </el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加商品" :visible.sync="addProductFlag" width="800px">
      <transfer-page></transfer-page>
    </el-dialog>
  </div>
</template>
<script>
  import transferPage from '@/components/transfer-page/transfer-page'
  import {
    spikeTimeList,
    addSpikeTime,
    getDetailsSpikeTime,
    updateSpikeTime,
    delSpikeTime
  } from "@/api/market/seckill";


  export default {
    components: {
      transferPage
    },
    data() {
      return {
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          activeId: this.$route.query.id
        },
        open: false,
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        showSearch: true,
        addProductFlag: false,
        loading: false,
        title: '',
        formData: {
          beginTime: '',
          endTime: '',
          maxProductNum: '',
          point: '',
          redPacketNum: '',
        },
        seckillList: [],
        rules: {
          beginTime: [{
            required: true,
            message: '请选择开始时间',
            trigger: 'change'
          }],
          endTime: [{
            required: true,
            message: '请选择结束时间',
            trigger: 'change'
          }],
          maxProductNum: [{
            required: true,
            message: '请输入最大商品数',
            trigger: 'change'
          }],
          point: [{
            required: true,
            message: '请输入积分',
            trigger: 'change'
          }],
          redPacketNum: [{
            required: true,
            message: '请输入红包数量',
            trigger: 'change'
          }]
        }
      }
    },
    created() {
      this.getList()
      // this.getDictType()
    },
    methods: {
      /** 查询列表 */
      getList() {
        this.loading = true;
        // this.queryParams.activeId=this.$route.query.id
        spikeTimeList(this.queryParams).then(response => {
          this.seckillList = response.rows;
          this.total = response.total;
          this.loading = false;
        });

      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.open = true;
        this.title = "添加活动";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        let id = row.id;
        let that = this;
        getDetailsSpikeTime(id).then(response => {
          this.formData = response.data;
          this.open = true;
          this.title = "修改秒杀活动";
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const swiperIds = row.id
        this.$modal.confirm('是否确认删除该条数据项？').then(function() {
          return delSpikeTime(swiperIds);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      cancel() {
        this.open = false;
        this.reset();
        this.$refs.elForm.resetFields()
      },
      //弹窗提交
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            if (this.formData.id != undefined) {
              updateSpikeTime(this.formData).then(response => {
                this.$modal.msgSuccess("修改成功");
                // this.linkOpen = false;
                this.open = false;
                this.getList();
              });
            } else {
              this.formData.activeId = this.$route.query.id;
              addSpikeTime(this.formData).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        })
      },
      //admin 配置商品
      handleProduct(row) {
        this.$router.push({
          path: 'seckil/seckill-product',
          query: row,
        })
      },
      reset() {
        this.formData = {
            maxProductNum: '',
            point: '',
            redPacketNum: '',
          },
          this.resetForm("formData");
      },
    }

  }
</script>

<style>
</style>
