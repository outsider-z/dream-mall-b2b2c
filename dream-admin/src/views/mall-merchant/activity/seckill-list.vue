<template>
  <div class="app-container">
    
    <el-table v-loading="loading" :data="seckillList" @selection-change="handleSelectionChange" :border="true">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="活动开始时间" align="center" prop="beginTime">
        <template slot-scope="scope">
          <span>{{scope.row.beginTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动结束时间" align="center" prop="endTime">
        <template slot-scope="scope">
          <span>{{scope.row.endTime}}</span>
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
            v-hasPermi="['merchant:activity:product']">配置商品</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
   
    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="elForm" :model="formData" :rules="rules" label-width="150px" size="mini">
        <el-form-item label-width="150px" label="日期范围" prop="time" required>
          <el-date-picker type="datetimerange" v-model="formData.time" format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss" :style="{width: '50%'}" start-placeholder="开始日期" end-placeholder="结束日期"
            range-separator="至" clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label-width="150px" label="商品数" prop="maxProductNum" required>
          <el-input-number v-model="formData.maxProductNum" placeholder="商品数" :style="{width: '50%'}" :min="0" controls-position=right></el-input-number>
        </el-form-item>
        <el-form-item label-width="150px" label="积分数量" prop="point" required>
          <el-input-number v-model="formData.point" placeholder="积分数量" :min="0" :style="{width: '50%'}" controls-position=right></el-input-number>
        </el-form-item>
        <el-form-item label-width="150px" label="红包数量" prop="redPacketNum" required>
          <el-input-number v-model="formData.redPacketNum" placeholder="积分数量" :min="0" :style="{width: '50%'}" controls-position=right> </el-input-number>
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
import {
    merchantQuerySpikeTimeList
  } from "@/api/mall-merchant/active";

  export default {
    components: {transferPage},
    data() {
      return {
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          activeId:this.$route.query.id
        },
        total:0,
        open: false,
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        showSearch: true,
        addProductFlag:false,
        loading: false,
        title: '',
        formData: {
          time:[],
          maxProductNum:'',
          point:'',
          redPacketNum:'',
        },
        seckillList:[],
        rules:{
          time:[{
            required: true,
            message: '请选择时间段',
            trigger: 'change'
          }],
          maxProductNum:[
            {
              required: true,
              message: '请输入最大商品数',
              trigger: 'change'
            }
          ],
          point:[{
            required: true,
            message: '请输入积分',
            trigger: 'change'
          }],
          redPacketNum:[{
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
        merchantQuerySpikeTimeList(this.queryParams).then(response => {
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
        this.reset();
        this.open = true;
        this.title = "添加活动";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        let id = row.id;
        let that=this;
        getDetailsSpikeTime(id).then(response => {
          this.formData = response.data;
          this.formData.time=[];
          this.formData.time[0] = response.data.beginTime
          this.formData.time[1] = response.data.endTime
            console.log('formData',that.formData);
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
      cancel(){
        this.open = false;
        this.reset();
      },
      //弹窗提交
      submitForm(){
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
              this.formData.beginTime = this.formData.time[0];
              this.formData.endTime = this.formData.time[1];
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

      handleProduct(row){
          this.$router.push({
            path: '/mall-merchant/avtivity/seckill-product-list',
            query: row,
          })
      },
      reset() {
        this.formData = {
            time:[],
            maxProductNum:'',
            point:'',
            redPacketNum:'',
          },
          this.resetForm("formData");
      },

    }

  }
</script>

<style>
</style>
