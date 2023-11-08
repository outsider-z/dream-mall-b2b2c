<template>
  <div class="app-container">
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
      <el-row :gutter="15">
        <el-col :span="3">
          <el-form-item label-width="150px" label="赠送积分" prop="pointEnabled" required>
            <el-switch v-model="formData.pointEnabled" :active-value='0' :inactive-value='1'></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="赠送积分数" prop="pointGiven">
            <el-input-number v-model="formData.pointGiven" placeholder="赠送积分数" controls-position=right>
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="3">
          <el-form-item label-width="150px" label="赠送优惠券" prop="couponEnabled" required>
            <el-switch v-model="formData.couponEnabled" :active-value='0' :inactive-value='1'></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label-width="-1px" label="" prop="">
            <el-button type="warning" size="medium" @click="addCoupon">添加优惠券</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="14" :offset="3">
          <el-table v-loading="loading" :data="couponList" @selection-change="handleSelectionChange" class="mb20">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="商家" prop="showLocation" width="250" align="center" />
            <el-table-column label="优惠券名称" align="center" prop="customizedModuleUuid" width="250" />
            <el-table-column label="赠送数量" prop="moduleSort" width="250" align="center" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope" v-if="scope.row.modularId !== 1">
                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                  v-hasPermi="['system:settings:remove']">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="3">
          <el-form-item label-width="150px" label="享受专属低价商品" prop="productEnabled" required>
            <el-switch v-model="formData.productEnabled" :active-value='0' :inactive-value='1'></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label-width="-1px" label="" prop="">
            <el-button type="warning" size="medium" @click="addProduct">添加商品</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="14" :offset="3">
          <el-table v-loading="loading" :data="couponList" @selection-change="handleSelectionChange" class="mb20">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="商家" prop="showLocation" width="250" align="center" />
            <el-table-column label="优惠券名称" align="center" prop="customizedModuleUuid" width="250" />
            <el-table-column label="赠送数量" prop="moduleSort" width="250" align="center" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope" v-if="scope.row.modularId !== 1">
                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                  v-hasPermi="['system:settings:remove']">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-form-item size="large">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
	<el-dialog :title="title" :visible.sync="open">
	  <el-table v-loading="loading" :data="couponList" @selection-change="handleSelectionChange">
	    <el-table-column type="selection" width="55" align="center" />
	    <el-table-column label="优惠券所属" prop="belongType" width="150" align="center">
	      <template slot-scope="scope">
	        {{scope.row.couponEntity.belongType=='PLATFORM' ? '平台' : '商家'}}
	      </template>
	    </el-table-column>
	    <el-table-column label="商家名称" prop="merchantId" width="300" align="center">
	      <template slot-scope="scope">
	        {{scope.row.couponEntity.merchantId}}
	      </template>
	    </el-table-column>
	    <el-table-column label="可用类型" prop="benefitType" width="150" align="center">
	      <template slot-scope="scope">
	        {{scope.row.couponEntity.benefitType=='0' ? '全场通用' : '指定商品'}}
	      </template>
	    </el-table-column>
	    <el-table-column label="适用范围" prop="applyRange" width="150" align="center">
	      <template slot-scope="scope">
	        {{scope.row.couponEntity.applyRange=='NEWCOMER' ? '新人专享' : '所有人'}}
	      </template>
	    </el-table-column>
	    <el-table-column label="优惠券名称" prop="couponName" width="150" align="center">
	      <template slot-scope="scope">
	        {{scope.row.couponEntity.couponName}}
	      </template>
	    </el-table-column>
	    <el-table-column prop="imageUrl" label="优惠券图片" width="180" align="center">
	      <template slot-scope="scope">
	        <el-popover placement="right" width="200" trigger="hover">
	          <img :src="scope.row.couponEntity.imageUrl" alt="" style="width: 150px;height: 80px">
	          <img slot="reference" :src="scope.row.couponEntity.imageUrl" style="max-height: 100px;max-width: 40px">
	        </el-popover>
	      </template>
	    </el-table-column>
	  </el-table>
	  <pagination v-show="couponTotal>0" :total="couponTotal" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
	    @pagination="getCouponList" />
	  <div slot="footer">
	    <el-button @click="cancel">取消</el-button>
	    <el-button type="primary" @click="submitForm">确定</el-button>
	  </div>
	</el-dialog>
  <el-dialog :title="title" :visible.sync="productOpen">
    <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商家名称" prop="merchantName" width="200" align="center"/>
      <el-table-column label="商品类目" prop="productCateEntity" width="200" align="center">
        <template slot-scope="scope">
            {{scope.row.productCateEntity.cateName}}
          </template>
        </el-table-column>
      <el-table-column label="品牌" prop="productBrandEntity" width="200" align="center">
        <template slot-scope="scope">
            {{scope.row.productBrandEntity.name}}
          </template>
        </el-table-column>
      <el-table-column label="商品名称" prop="productName" width="200" align="center">
        <template slot-scope="scope">
            {{scope.row.mallProductEntity.productName}}
          </template>
        </el-table-column>
      <el-table-column prop="img" label="图片" width="180" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" width="200" trigger="hover">
            <img :src="scope.row.productRotagramEntityList[0].imgUrl" alt="" style="width: 150px;height: 100px">
            <img slot="reference" :src="scope.row.productRotagramEntityList[0].imgUrl" style="height: 40px;width: 60px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="价格" prop="unitPrice" width="200" align="center">
        <template slot-scope="scope">
            {{scope.row.mallProductEntity.productName}}
          </template>
        </el-table-column>
    </el-table>
    <pagination v-show="productTotal>0" :total="productTotal" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getProductList" />
    <div slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
  import {
    listBenefits,
    getBenefits,
    addBenefits,
    updateBenefits,
    delBenefits
  } from "@/api/system/benefits";
  import {
    listCoupon
  } from "@/api/system/coupon";
  import {
    listProduct
  } from "@/api/product/product";
export default {
  name:'Welfare',
  components: {},
  props: [],
  data() {
    return {
      formData: {
        pointEnabled: 1,
        pointGiven: 0,
        couponEnabled: 1,
        productEnabled: 1,
      },
      open: false,
      productOpen:false,
      title: '',
      total: 0,
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      welfare:[],
      couponList:[],
      productList:[],
      loading: true,
      couponTotal:0,
      productTotal:0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      rules: {
        pointGiven: [{
          required: true,
          message: '赠送积分数',
          trigger: 'blur'
        }],
      },
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getList()
    this.getCouponList()
    this.getProductList()
  },
  mounted() {},
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      listBenefits(this.queryParams).then(response => {
        if(response.rows.length > 0){
          this.welfare = response.rows;
        }
        // this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询列表 */
    getCouponList() {
      this.loading = true;
      listCoupon(this.queryParams).then(response => {
        this.couponList = response.rows;
        this.couponTotal = response.total;
        this.loading = false;
      });
    },
    //查询商品
    getProductList() {
      this.loading = true;
      listProduct(this.queryParams).then(response => {
        this.productList = response.rows;
        this.productTotal = response.total;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    reset() {
      this.formData = {
        id:undefined,
        showLocation: undefined,
        customizedModuleUuid: undefined,
        moduleSort: 0,
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
      this.title = "添加模块设置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const modularId = row.id || this.ids
      getBenefits(modularId).then(response => {
        this.formData = response.data;
        this.open = true;
        this.title = "修改模块设置";
      });
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (valid){
          if (this.formData.id != undefined) {
            updateBenefits(this.formData).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBenefits(this.formData).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      })
    },


    /** 删除按钮操作 */
    handleDelete(row) {
      const modularIds = row.modularId || this.ids;
      this.$modal.confirm('是否确认删除模块名称为"' + row.showLocation + '"的数据项？').then(function() {
        return delBenefits(modularIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
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
    addCoupon(){
      this.open = true;
    },
    addProduct(){
      this.productOpen = true;
    },
  }
}

</script>
<style>
</style>
