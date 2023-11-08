<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:shopper:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:shopper:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:shopper:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="shopperList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商家名称" prop="merchantName" width="300" align="center" />
      <el-table-column label="配送名称" prop="templateName" width="300" align="center" />
      <el-table-column label="发货地址" prop="deliveryFromAddress" show-overflow-tooltip width="300" align="center" />
      <el-table-column label="起送金额" prop="firstPrice" width="300" align="center" />
      <el-table-column label="是否启用" align="center" width="200">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enableFlag" active-value="0" inactive-value="1"
            @change="handleEnable(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:shopper:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:shopper:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="商家名称" prop="merchantName">
          <el-select v-model="formData.merchantName" filterable remote reserve-keyword placeholder="请输入关键词"
            :remote-method="remoteMethod" :loading="loading" @change="selectChange" :style="{width: '100%'}">
            <el-option v-for="item in merchantOptions" :key="item.value" :label="item.label" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配送名称" prop="templateName">
          <el-input v-model="formData.templateName" placeholder="例如山西路门店配送" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="配送说明" prop="description">
          <el-input v-model="formData.description" type="textarea" placeholder="例如周一至周五，上午9点到下午5点配送"
            :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="发货地址" prop="deliveryFromAddress">
          <el-input v-model="formData.deliveryFromAddress" @focus="OpenMap()" suffix-icon='el-icon-map-location'
            clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="配送范围" prop="deliveryConditionDistance">
          <el-input v-model="formData.deliveryConditionDistance" clearable :style="{width: '100%'}">
            <template slot="prepend">发货地址</template>
            <template slot="append"> 公里范围内, 超过该范围不能配送</template>
          </el-input>
        </el-form-item>
        <el-form-item label="起送金额:" prop="deliveryConditionAmount">
          <el-col :span="8">
            <el-input v-model="formData.deliveryConditionAmount" type="number" clearable :style="{width: '100%'}" />
          </el-col>
          <el-col :span="8" class="ml10">元, 订单金额少于起送金额不能配送</el-col>
        </el-form-item>
        <el-form-item label="计费方式" prop="firstDistance">
          <el-col :span="3">
            <el-input v-model="formData.firstDistance" type="number" clearable :style="{width: '100%'}" />
          </el-col>
          <el-col :span="6" class="ml10">公里内免费配送,超出后起步价</el-col>
          <el-col :span="3">
            <el-input v-model="formData.firstPrice" type="number" clearable :style="{width: '100%'}" />
          </el-col>
          <el-col :span="2" class="ml10">元,每增加</el-col>
          <el-col :span="3">
            <el-input v-model="formData.nextDistance" type="number" clearable :style="{width: '100%'}" />
          </el-col>
          <el-col :span="6" class="ml10">公里(不够1公里按1公里计算)，</el-col>
        </el-form-item>
        <el-form-item label="增加费用">
          <el-col :span="3">
            <el-input v-model="formData.nextPrice" type="number" clearable :style="{width: '100%'}" />
          </el-col>
          <el-col :span="2" class="ml10">元</el-col>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
    <gaoDeMap @updateLocation="updateLocation" ref="gaoDeMap"></gaoDeMap>
  </div>
</template>
<script>
  import {
    listDelivery,
    getDelivery,
    addDelivery,
    updateDelivery,
    delDelivery,
    modifyCityDeliveryActiveFlag
  } from "@/api/system/delivery";
  import {
    getAllMallMerchant
  } from "@/api/mall-merchant/merchant";
  import gaoDeMap from "@/components/gaodeMap/index";
  export default {
    name: 'Charge',
    components: {
      gaoDeMap
    },
    props: [],
    data() {
      var address = (rule, value, callback) => {
        // 地址验证
        if (this.formData.deliveryFromAddress == undefined) {
          callback(new Error("请选择发货地址"));
        } else {
          callback();
        }
      }
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
        showSearch: true,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        merchantOptions: [],
        formData: {
          merchantId: undefined,
          merchantName:undefined,
          templateName: undefined,
          description: undefined,
          deliveryFromAddress: undefined,
          deliveryConditionDistance: undefined,
          deliveryConditionAmount: undefined,
          firstDistance: undefined,
          firstPrice: undefined,
          nextDistance: undefined,
          nextPrice: undefined,
          deliveryFromLongitude: undefined,
          deliveryFromLatitude: undefined,
        },
        rules: {
          merchantId: [{
            required: true,
            message: '请选择商家名称',
            trigger: 'change'
          }],
          templateName: [{
            required: true,
            message: '请输入配送名称',
            trigger: 'blur'
          }],
          deliveryConditionDistance: [{
            required: true,
            message: '请输入配送范围',
            trigger: 'blur'
          }],
          deliveryFromAddress: [{
            required: true,
            validator: address,
          }],
          deliveryConditionAmount: [{
            required: true,
            message: '请输入起送金额',
            trigger: 'blur'
          }],
          firstDistance: [{
            required: true,
            message: '请输入计费方式',
            trigger: 'blur'
          }],
          firstPrice: [{
            required: true,
            message: '请输入计费方式',
            trigger: 'blur'
          }],
          nextDistance: [{
            required: true,
            message: '请输入计费方式',
            trigger: 'blur'
          }],
          nextPrice: [{
            required: true,
            message: '请输入计费方式',
            trigger: 'blur'
          }],
        },
        list:[],
      }
    },
    computed: {},
    watch: {},
    created() {
      this.getList()
      this.getMerchant()
    },
    mounted() {},
    methods: {
      /** 查询列表 */
      getList() {
        this.loading = true;
        listDelivery(this.queryParams).then(response => {
          this.shopperList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      //查询商家
      getMerchant() {
        let para = {
          approveStatus: 'APPROVED'
        }
        getAllMallMerchant(para).then(response => {
          this.list = response.data.map(item => {
            return {
              value: `${item.mallMerchantEntity.id}`,
              label: `${item.mallMerchantEntity.merchantName}`
            };
          });
        });
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.merchantOptions = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.merchantOptions = [];
        }
      },
      selectChange(val) {
        this.formData.merchantId = val.value
        this.formData.merchantName = val.label
        // this.merchantClick(this.formData.merchantId)
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      reset() {
        this.formData = {
            merchantId: undefined,
            merchantName:undefined,
            templateName: undefined,
            description: undefined,
            deliveryFromAddress: undefined,
            deliveryConditionDistance: undefined,
            deliveryConditionAmount: undefined,
            firstDistance: undefined,
            firstPrice: undefined,
            nextDistance: undefined,
            nextPrice: undefined,
            deliveryFromLongitude: undefined,
            deliveryFromLatitude: undefined,
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
        this.title = "添加收费模板";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const swiperId = row.id || this.ids
        getDelivery(swiperId).then(response => {
          this.formData = response.data;
          this.open = true;
          this.title = "修改收费模板";
        });
      },
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            if (this.formData.id != undefined) {
              updateDelivery(this.formData).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addDelivery(this.formData).then(response => {
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
        const swiperIds = row.id || this.ids;
        this.$modal.confirm('是否确认删除该收费模板信息？').then(function() {
          return delDelivery(swiperIds);
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
      urlBeforeUpload(file) {
        let isAccept = new RegExp('image/*').test(file.type)
        if (!isAccept) {
          this.$message.error('应该选择image/*类型的文件')
        }
        return isAccept
      },
      handleAvatarSuccess(res, file) {
        this.formData.avatar = res.data.url;
        if (this.formData.avatar != '') {
          this.$refs.elForm.clearValidate('avatar') //清除图片校验文字
        }
      },
      //打开地图
      OpenMap() {
        this.$refs.gaoDeMap.open();
      },
      updateLocation(Addr) {
        // console.log(Addr)
        this.formData.deliveryFromAddress = Addr.orgAddr
        this.formData.deliveryFromLongitude = Addr.lon;
        this.formData.deliveryFromLatitude = Addr.lat;
      },
      // 状态修改
      handleEnable(row) {
        let text = row.enableFlag === "0" ? "启用" : "停用";
        this.$modal.confirm('确认要' + text + '"' + row.merchantName + '"该模板吗？').then(function() {
          let para = {
            enableFlag:row.enableFlag,
            cityDeliveryId:row.id
          }
          return modifyCityDeliveryActiveFlag(para);
        }).then(() => {
          this.$modal.msgSuccess(text + "成功");
        }).catch(function() {
          row.enableFlag = row.enableFlag === "0" ? "1" : "0";
        });
      },
    }
  }
</script>
<style>
</style>
