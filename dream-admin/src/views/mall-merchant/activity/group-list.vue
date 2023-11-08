<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="seckillList" :border="true">
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
      <el-table-column label="拼团活动名称" align="center" prop="activityName">
        <template slot-scope="scope">
          <span>{{scope.row.activityName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="成团有效期(天)" align="center" prop="maxTranDays">
        <template slot-scope="scope">
          <span>{{scope.row.maxTranDays}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime"/>
      <el-table-column label="修改时间" align="center" prop="updateTime"/>
      <el-table-column label="操作" align="center" fixed="right" width="500" class-name="small-padding fixed-width">
        <template slot-scope="scope" >
          <el-button size="mini" type="text" icon="el-icon-menu" @click="handleProduct(scope.row)"
          >配置商品</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="elForm" :model="formData" :rules="rules" label-width="150px" size="mini">
        <el-form-item label-width="150px" label="日期范围" prop="time" required>
          <el-date-picker type="datetimerange" v-model="formData.time" format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss" :style="{width: '50%'}" start-placeholder="开始日期" end-placeholder="结束日期"
            range-separator="至" clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label-width="150px" label="拼团活动名称" prop="activityName" required>
          <el-input v-model="formData.activityName" placeholder="拼团活动名称" :style="{width: '50%'}"></el-input>
        </el-form-item>
        <el-form-item label-width="150px" label="成团有效期(天)" prop="maxTranDays" required>
          <el-input-number v-model="formData.maxTranDays" placeholder="成团有效期" :min="0" :style="{width: '50%'}" controls-position=right></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import transferPage from '@/components/transfer-page/transfer-page'
  import {
   groupActiveList,
   addGroupActive,
   getGroupDetail,
   updateGroupActive,
   delSpikeTime
  } from "@/api/market/seckill";

  import {
    queryGroupActiveList,
  } from "@/api/mall-merchant/active";
  import store from '@/store';
  export default {
    components: {transferPage},
    data() {
      return {
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          merchantId: store.getters.merchantId,
          activeId:this.$route.query.id
        },
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
          activityName:'',
          maxTranDays:'',
        },
        seckillList:[],
        rules:{
          time:[{
            required: true,
            message: '请选择时间段',
            trigger: 'change'
          }],
          activityName:[
            {
              required: true,
              message: '请输入拼团活动名称',
              trigger: 'change'
            }
          ],
          maxTranDays:[{
            required: true,
            message: '请输入成团有效期',
            trigger: 'change'
          }],
        },
      }
    },
    created() {
      this.getList()
    },
    mounted() {},
    methods: {

      /** 查询列表 */
      getList() {
        this.loading = true;
        queryGroupActiveList(this.queryParams).then(response => {
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
        getGroupDetail(id).then(response => {
          this.formData = response.data;
          this.formData.time=[];
          this.formData.time[0] = response.data.beginTime
          this.formData.time[1] = response.data.endTime
          this.open = true;
          this.title = "修改拼团活动";
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
              updateGroupActive(this.formData).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              this.formData.beginTime = this.formData.time[0];
              this.formData.endTime = this.formData.time[1];
              this.formData.activeId = this.$route.query.id;
              addGroupActive(this.formData).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        })
      },
      //配置商品
      handleProduct(row){
          this.$router.push({
            path: '/mall-merchant/activity/group-product-list',
            query: row,
          })
      },
      reset() {
        this.formData = {
            time:[],
            activityName:'',
            maxTranDays:'',
          },
          this.resetForm("formData");
      },
    }
  }
</script>

<style>
</style>
