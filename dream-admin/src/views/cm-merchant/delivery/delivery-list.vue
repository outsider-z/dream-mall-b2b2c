<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['cm-merchant:delivery:add']">新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="freightList" border>
      <el-table-column label="商家名称"  width="300" align="center" />
      <el-table-column label="模板名称"  width="300" align="center">
        <template slot-scope="scope">
          <span class="receiptsNumStyle" @click="receiptsNumClick(scope.row)">{{scope.row.templateName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="配送范围" width="300" align="center">
        <template slot-scope="scope">
          {{scope.row.deliveryConditionAmount +'km'}}
        </template>
      </el-table-column>
      <el-table-column label="免费配送距离" width="300" align="center">
        <template slot-scope="scope">
          {{scope.row.firstDistance}}
        </template>
      </el-table-column>
      <el-table-column label="详细地址"  width="300" align="center">
        <template slot-scope="scope">
          {{scope.row.deliveryFromDetail}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['cm-merchant:delivery:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['cm-merchant:delivery:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <el-dialog :title="title" :visible.sync="open" :before-close="cancel" width="45%">
      <el-form ref="elForm" :inline="true" :model="formData" :rules="rules" size="medium" label-width="100px"
        label-position="right">
        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="formData.templateName" placeholder="请输入模板名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="所在省份" prop="deliveryFromProvince">
          <el-input v-model="formData.deliveryFromProvince" placeholder="地址所在省" clearable></el-input>
        </el-form-item>
        <el-form-item label="所在城市" prop="deliveryFromCity">
          <el-input v-model="formData.deliveryFromCity" placeholder="所在城市" clearable></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="deliveryFromDetail">
          <el-input v-model="formData.deliveryFromDetail" placeholder="起送地址详细地址" clearable></el-input>
        </el-form-item>
        <el-form-item label="配送范围" prop="deliveryConditionAmount">
          <el-input v-model="formData.deliveryConditionAmount" placeholder="最远配送距离" clearable></el-input>
        </el-form-item>
        <el-form-item label="起送金额" prop="deliveryConditionDistance">
          <el-input v-model="formData.deliveryConditionDistance" placeholder="订单起送金额" clearable></el-input>
        </el-form-item>
        <el-form-item label="免费距离" prop="firstDistance">
          <el-input v-model="formData.firstDistance" placeholder="该距离内配送免费(必须小于配送距离)" clearable></el-input>
        </el-form-item>
        <el-form-item label="起步价" prop="firstPrice">
          <el-input v-model="formData.firstPrice" placeholder="超出距离起步价" clearable></el-input>
        </el-form-item>
        <el-form-item label="增加公里数" prop="nextDistance">
          <el-input v-model="formData.nextDistance" placeholder="超出公里数后,每增加公里数" clearable></el-input>
        </el-form-item>
        <el-form-item label="增加费用" prop="nextPrice">
          <el-input v-model="formData.nextPrice" placeholder="每增加公里数的价格" clearable></el-input>
        </el-form-item>
        <el-form-item label="模板说明" prop="description">
          <el-input type="textarea" v-model="formData.description" show-word-limit placeholder="请输入配送模板说明"
            maxlength="100" clearable></el-input>
        </el-form-item>
        <el-form-item label="地址经度" prop="deliveryFromLongitude">
          <el-input v-model="formData.deliveryFromLongitude" placeholder="起送地址详细地址" clearable>
            <el-button slot="append" icon="el-icon-search"><a href="http://jingweidu.757dy.com/"
                target="_blank">经度查询</a></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="地址维度" prop="deliveryFromLatitude">
          <el-input v-model="formData.deliveryFromLatitude" placeholder="起送地址详细地址" clearable>
            <el-button slot="append" icon="el-icon-search"><a href="http://jingweidu.757dy.com/"
                target="_blank">维度查询</a></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="detailsOpen == false">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    delDelivery
  } from "@/api/community/delivery";

  import{
    merchantAddCityDelivery,
    merchantModifyCityDelivery,
    merchantQueryCityDelivery
} from"@/api/cm-merchant/cm-product";

import store from '@/store'
  export default {
    data() {
      var moneyrule = /^[1-9]{1}[0-9]*(\.[0-9]{1,2})?$/;
      return {
        formData: {
          defaultFlag: '0',
          merchantId: store.getters.merchantId,
          merchantName: '',
          deliveryConditionAmount: 0,
          deliveryConditionDistance: "",
          deliveryFromAddress: '0',
          deliveryFromCity: "",
          deliveryFromDetail: "",
          deliveryFromDistrict: "",
          deliveryFromLatitude: 0,
          deliveryFromLongitude: 0,
          deliveryFromProvince: '',
          description: '',
          enableFlag: '',
          firstDistance: '',
          firstPrice: '',
          nextDistance: '',
          nextPrice: '',
          templateName: '',
          merchantAttribute: 'COMMUNITY_MERCHANT'
        },
        rules: {
          merchantName: [{
            required: true,
            message: '请选择商家名称',
            trigger: 'change'
          }],
          templateName: [{
            required: true,
            message: '请输入模板名称',
            trigger: 'blur'
          }],
          deliveryFromProvince: [{
            required: true,
            message: '请输入所在省',
            trigger: 'blur'
          }],
          deliveryFromCity: [{
            required: true,
            message: '请输入所在市',
            trigger: 'blur'
          }],
          deliveryFromDetail: [{
            required: true,
            message: '请输入地址详情',
            trigger: 'blur'
          }],
          deliveryConditionAmount: [{
              required: true,
              message: '请输入配送距离',
              trigger: 'blur'
            },
            {
              required: true,
              trigger: 'change',
              validator: (rule, value, callback) => {
                if (!moneyrule.test(value)) {
                  callback(new Error('请输入正确配送范围'));
                } else {
                  callback();
                }
              }
            }
          ],
          deliveryConditionDistance: [{
              required: true,
              message: '请输入起送金额',
              trigger: 'blur'
            },
            {
              required: true,
              trigger: 'change',
              validator: (rule, value, callback) => {
                if (!moneyrule.test(value)) {
                  callback(new Error('请输入正确金额值'));
                } else {
                  callback();
                }
              }
            }

          ],
          firstDistance: [{
              required: true,
              message: '请输入免费距离',
              trigger: 'blur'
            },
            {
              required: true,
              trigger: 'change',
              validator: (rule, value, callback) => {
                if (!moneyrule.test(value)) {
                   callback(new Error('请输入正确是的免费距离'));
                } else {
                  if(this.formData.deliveryConditionAmount){
                    if(this.formData.deliveryConditionAmount < value){
                      return callback(new Error('免费距离应该小于配送范围'));
                    }
                  }
                  callback();
                }
              }
            }
          ],
          firstPrice: [{
              required: true,
              message: '请输入起步价',
              trigger: 'blur'
            },
            {
              required: true,
              trigger: 'change',
              validator: (rule, value, callback) => {
                if (!moneyrule.test(value)) {
                  callback(new Error('请输入正确是的起步价'));
                } else {
                  callback();
                }
              }
            }

          ],
          nextDistance: [{
              required: true,
              message: '请输入增加公里数',
              trigger: 'blur'
            },
            {
              required: true,
              trigger: 'change',
              validator: (rule, value, callback) => {
                if (!moneyrule.test(value)) {
                  callback(new Error('请输入正确是的公里数'));
                } else {
                  callback();
                }
              }
            }

          ],
          nextPrice: [{
              required: true,
              message: '请输入增加费用',
              trigger: 'blur'
            },
            {
              required: true,
              trigger: 'change',
              validator: (rule, value, callback) => {
                if (!moneyrule.test(value)) {
                  callback(new Error('请输入正确是的费用'));
                } else {
                  callback();
                }
              }
            }
          ],
          deliveryFromLongitude: [{
              required: true,
              message: '请输入地址经度',
              trigger: 'blur'
            }

          ],
          deliveryFromLatitude: [{
            required: true,
            message: '请输入地址维度',
            trigger: 'change'
          }, ]
        },
        merchantOptions: [],
        areaIdsOptions: [],
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          merchantId: store.getters.merchantId,
          merchantAttribute: 'COMMUNITY_MERCHANT'
        },
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
        freightList: [],
        showSearch: true,
        list: [],
        detailsOpen: false,
        disabled: false,
        codePage: {
          pageNum: 1,
          pageSize: 10,
        },
        pages: '',
        arr: [],
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
        merchantQueryCityDelivery(this.queryParams).then(response => {
          this.freightList=[];
          this.freightList.push(response.data) 
          this.total = 1;
          this.loading = false;
        });

      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.freightTemplateEntity.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      reset() {
        this.formData = {
            defaultFlag: '0',
            merchantId: store.getters.merchantId,
            merchantName: '',
            deliveryConditionAmount: "",
            deliveryConditionDistance: "",
            deliveryFromAddress: '',
            deliveryFromCity: "",
            deliveryFromDetail: "",
            deliveryFromDistrict: "",
            deliveryFromLatitude: "",
            deliveryFromLongitude: "",
            deliveryFromProvince: '',
            description: '',
            enableFlag: '',
            firstDistance: '',
            firstPrice: '',
            nextDistance: '',
            nextPrice: '',
            templateName: '',
            merchantAttribute: 'COMMUNITY_MERCHANT'
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
        this.title = "添加配送模板";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.detailsOpen = false
        this.disabled = true
        this.title = "修改运费模板";
        let modularId = [];
        if (row.id) {
          modularId = row.id
        } else {
          modularId = this.ids
        }
        this.getDeliveryDetails(row)
      },
      /**
       * @param {Object} response
       * 详情组装
       */
      getDeliveryDetails(response) {
        this.formData.id = response.id
        this.formData.merchantId = response.merchantId;
        this.formData.merchantName = response.merchantName;
        this.formData.templateName = response.templateName;
        this.formData.deliveryConditionAmount = response.deliveryConditionAmount;
        this.formData.deliveryConditionDistance = response.deliveryConditionDistance;
        this.formData.deliveryFromAddress = response.deliveryFromAddress;
        this.formData.deliveryFromCity = response.deliveryFromCity;
        this.formData.deliveryFromDetail = response.deliveryFromDetail;
        this.formData.deliveryFromDistrict = response.deliveryFromDistrict;
        this.formData.deliveryFromLatitude = response.deliveryFromLatitude;
        this.formData.deliveryFromLongitude = response.deliveryFromLongitude;
        this.formData.deliveryFromProvince = response.deliveryFromProvince;
        this.formData.description = response.description;
        this.formData.enableFlag = response.enableFlag;
        this.formData.firstDistance = response.firstDistance;
        this.formData.firstPrice = response.firstPrice;
        this.formData.nextDistance = response.nextDistance;
        this.formData.nextPrice = response.nextPrice;
        this.open = true;
      },
      //提交
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          console.log('valid', valid);
          if (valid) {
            if (this.formData.id != undefined) {
              merchantModifyCityDelivery(this.formData).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              merchantAddCityDelivery(this.formData).then(response => {
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
        let modularIds = []
        if (row.id) {
          modularIds = row.id;
        } else {
          modularIds = this.ids;
        }
        this.$modal.confirm('是否确认删除该运费模板？').then(function() {
          return delDelivery(modularIds);
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
        this.$refs.elForm.resetFields()
      },
      /**
       * @param {Object} row
       * 模板查看
       */
      receiptsNumClick(row) {
        this.reset();
        this.detailsOpen = true,
          this.title = "查看运费模板";
        let modularId = [];
        if (row.freightTemplateEntity) {
          modularId = row.freightTemplateEntity.id
        } else {
          modularId = this.ids
        }
        this.getDeliveryDetails(row)
      },
    }
  }
</script>
<style scoped>
  .receiptsNumStyle {
    cursor: pointer;
    color: #1890ff;
  }
</style>
