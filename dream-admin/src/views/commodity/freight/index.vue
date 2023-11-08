<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="选择商家" prop="merchantId">
        <el-select 
          v-model="queryParams.merchantName" clearable :filter-method="searchHandle" filterable
          placeholder="请选择商家"
           v-el-select-loadmore="loadmore" 
           @change="searchTopMerchant"
          @keyup.delete.native="deleteHandle"
          keyup.enter.native="handleQuery">
          <el-option v-for="item in merchantOptions" :key="item.value" :label="item.label" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:brand:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:brand:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:brand:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="freightList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商家名称" prop="merchantName" width="300" align="center" />
      <el-table-column label="模板名称" prop="templateName" width="300" align="center">
        <template slot-scope="scope">
          <span class="receiptsNumStyle"
            @click="receiptsNumClick(scope.row)">{{scope.row.freightTemplateEntity.templateName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="计费方式" prop="billingMethod" width="300" align="center">
        <template slot-scope="scope">
          {{scope.row.freightTemplateEntity.billingMethod == 0 ? '按件计费' :'按重量计费'}}
        </template>
      </el-table-column>
      <el-table-column label="物流公司" prop="logisticsCompanyId" width="300" align="center">
        <template slot-scope="scope">
          {{scope.row.freightTemplateEntity.templateName}}
        </template>
      </el-table-column>
      <el-table-column label="是否包邮" prop="shippingFreeFlag" width="300" align="center">
        <template slot-scope="scope">
          {{scope.row.freightTemplateEntity.shippingFreeFlag == 0 ? '是' :'否'}}
        </template>
      </el-table-column>
      <el-table-column prop="activeFlag" label="是否启用" width="200" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.freightTemplateEntity.activeFlag" active-value="0" inactive-value="1"
            @change="handleActiveChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:brand:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:brand:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <el-dialog :title="title" :visible.sync="open" :before-close="cancel">
      <el-row :gutter="15">
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
          <el-col :span="24">
            <el-form-item label="商家名称" prop="merchantName">
              <el-select v-model="formData.merchantName" :style="{width: '100%'}" clearable
                :filter-method="searchHandle" filterable placeholder="请选择商家" v-el-select-loadmore="loadmore"
                @change="selectChange" @keyup.delete.native="deleteHandle">
                <el-option v-for="item in merchantOptions" :key="item.value" :label="item.label" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="模板名称" prop="templateName">
              <el-input v-model="formData.templateName" placeholder="请输入模板名称" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="计费方式" prop="billingMethod">
              <el-radio-group v-model="formData.billingMethod" size="medium">
                <el-radio v-for="(item, index) in billingMethodOptions" :key="index" :label="item.value"
                  :disabled="item.disabled">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物流公司" prop="logisticsCompanyId">
              <el-select v-model="formData.logisticsCompanyId" placeholder="物流公司" clearable style="width: 100%">
                <el-option v-for="item in logisticsCompanyOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否包邮" prop="shippingFreeFlag">
              <el-switch v-model="formData.shippingFreeFlag" active-value='0' inactive-value='1'></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="10" v-if="formData.shippingFreeFlag == '0'">
            <el-form-item label="包邮条件" prop="shippingFreeConditionAmount">
              <el-input v-model="formData.shippingFreeConditionAmount" clearable :style="{width: '100%'}">
                <template slot="prepend">满</template>
                <template slot="append">元包邮</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="formData.billingMethod == '0'">
            <el-row type="flex" justify="start" align="top" :gutter="15">
              <el-col :span="7">
                <el-form-item label="计费方式" prop="defaultFirstUnit">
                  <el-input v-model="formData.defaultFirstUnit" clearable :style="{width: '100%'}">
                    <template slot="append">件内</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label-width="-1px" label="" prop="defaultFirstPrice">
                  <el-input v-model="formData.defaultFirstPrice" clearable :style="{width: '100%'}">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="-1px" label="" prop="defaultNextUnit">
                  <el-input v-model="formData.defaultNextUnit" clearable :style="{width: '100%'}">
                    <template slot="prepend">每增加</template>
                    <template slot="append">件</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="-1px" label="" prop="defaultNextPrice">
                  <el-input v-model="formData.defaultNextPrice" clearable :style="{width: '100%'}">
                    <template slot="prepend">增加运费</template>
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" v-if="formData.billingMethod == '1'">
            <el-row type="flex" justify="start" align="top" :gutter="15">
              <el-col :span="7">
                <el-form-item label="计费方式" prop="defaultFirstWeight">
                  <el-input v-model="formData.defaultFirstWeight" clearable :style="{width: '100%'}">
                    <template slot="append">千克内</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label-width="-1px" label="" prop="defaultFirstPrice">
                  <el-input v-model="formData.defaultFirstPrice" clearable :style="{width: '100%'}">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="-1px" label="" prop="defaultNextWeight">
                  <el-input v-model="formData.defaultNextWeight" clearable :style="{width: '100%'}">
                    <template slot="prepend">每增加</template>
                    <template slot="append">千克</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="-1px" label="" prop="defaultNextPrice">
                  <el-input v-model="formData.defaultNextPrice" clearable :style="{width: '100%'}">
                    <template slot="prepend">增加运费</template>
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" label-width="100px">
              <!-- <el-switch v-model="formData.areaFlag" active-value='0' inactive-value='1'></el-switch> -->
              <el-button type="primary" plain @click="addArea()">添加特定地区</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-for="(item,index) in formData.freightDetailRequestList" :key="index">
            <el-row type="flex" justify="start" align="top" :gutter="15">
              <el-col :span="20">
                <el-form-item label="特定地区">
                  <el-autocomplete v-model="item.areaName" :style="{width: '100%'}"
                    :fetch-suggestions="querySearchAsync" @select="handleSelect($event, item)" placeholder="请输入地区名称">
                  </el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-button type="danger" icon="el-icon-delete" circle @click="deleteArea(index)"></el-button>
              </el-col>
            </el-row>
            <el-row type="flex" justify="start" align="top" :gutter="15" v-if="formData.billingMethod == '0'">
              <el-col :span="7">
                <el-form-item label-width="100px" label="">
                  <el-input v-model="item.defaultFirstUnit" clearable :style="{width: '100%'}">
                    <template slot="append">首件</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label-width="-1px" label="">
                  <el-input v-model="item.defaultFirstPrice" clearable :style="{width: '100%'}">
                    <template slot="append">首费(元)</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="-1px" label="">
                  <el-input v-model="item.defaultNextUnit" clearable :style="{width: '100%'}">
                    <template slot="append">续件</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="-1px" label="">
                  <el-input v-model="item.defaultNextPrice" clearable :style="{width: '100%'}">
                    <template slot="append">续费(元)</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="start" align="top" :gutter="15" v-if="formData.billingMethod == '1'">
              <el-col :span="7">
                <el-form-item label-width="100px" label="">
                  <el-input v-model="item.defaultFirstWeight" clearable :style="{width: '100%'}">
                    <template slot="append">首重</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label-width="-1px" label="">
                  <el-input v-model="item.defaultFirstPrice" clearable :style="{width: '100%'}">
                    <template slot="append">首费(元)</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="-1px" label="">
                  <el-input v-model="item.defaultNextWeight" clearable :style="{width: '100%'}">
                    <template slot="append">续重(千克)</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="-1px" label="" prop="defaultNextPrice">
                  <el-input v-model="item.defaultNextPrice" clearable :style="{width: '100%'}">
                    <template slot="append">续费(元)</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" v-if="detailsOpen == false">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    listTemplate,
    getTemplate,
    addTemplate,
    updateTemplate,
    delTemplate,

    getAreas,
    getAllLogisticsCompany,
    modifyFreightTemplateActiveFlag
  } from "@/api/system/template";
  import {
    searchMerchantList
  } from "@/api/mall-merchant/merchant";
  export default {
    name: 'Freight',
    inheritAttrs: false,
    components: {},
    props: [],
    data() {
      return {
        id: '',
        name: '',
        timeout: null,
        formData: {
          merchantId: undefined,
          merchantName: '',
          logisticsCompanyId: undefined,
          templateName: undefined,
          billingMethod: '0',
          shippingFreeFlag: 1,
          shippingFreeConditionAmount: undefined,
          defaultFirstUnit: undefined,
          defaultFirstPrice: undefined,
          defaultNextUnit: undefined,
          defaultNextPrice: undefined,
          defaultFirstWeight: undefined,
          defaultNextWeight: undefined,
          freightDetailRequestList: [],
        },
        logisticsOptions: [],
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
          billingMethod: [{
            required: true,
            message: '计价方式不能为空',
            trigger: 'change'
          }],
          logisticsCompanyId: [{
            required: true,
            message: '请选择物流公司',
            trigger: 'change'
          }],
          shippingFreeConditionAmount: [{
            required: true,
            message: '请输入包邮条件',
            trigger: 'blur'
          }],
          defaultFirstUnit: [{
            required: true,
            message: '请输入件数',
            trigger: 'blur'
          }],
          defaultFirstPrice: [{
            required: true,
            message: '请输入首件/首重费用',
            trigger: 'blur'
          }],
          defaultNextUnit: [{
            required: true,
            message: '请输入增加件数',
            trigger: 'blur'
          }],
          defaultNextPrice: [{
            required: true,
            message: '请输入续重/件费用',
            trigger: 'blur'
          }],
          defaultFirstWeight: [{
            required: true,
            message: '请输入首重',
            trigger: 'blur'
          }],
          defaultFirstPrice: [{
            required: true,
            message: '请输入首重费用',
            trigger: 'blur'
          }],
          defaultNextWeight: [{
            required: true,
            message: '请输入增加重量',
            trigger: 'blur'
          }],
          areaId: [{
            required: true,
            message: '请选择特定地区',
            trigger: 'change'
          }],
        },
        merchantOptions: [],
        billingMethodOptions: [{
          "label": "按件计费",
          "value": "0"
        }, {
          "label": "按重量计费",
          "value": "1"
        }],
        areaIdsOptions: [],
        queryParams: {
          pageNum: 1,
          pageSize: 10,
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
        logisticsCompanyOptions: [],
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
    directives: { //注意：这个是写到data外面
      'el-select-loadmore': {
        bind(el, binding) {
          const SELECTWRAP_DOM = el.querySelector(
            '.el-select-dropdown .el-select-dropdown__wrap'
          )
          SELECTWRAP_DOM.addEventListener('scroll', function() {
            const condition =
              this.scrollHeight - this.scrollTop <= this.clientHeight
            if (condition) {
              binding.value()
            }
          })
        }
      }
    },
    computed: {},
    watch: {},
    created() {
      this.getList()
      // this.handleChange(1)
    },
    mounted() {},
    methods: {
      /** 查询列表 */
      getList() {
        this.loading = true;
        listTemplate(this.queryParams).then(response => {
          this.freightList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
        getAllLogisticsCompany().then(res => {
          this.logisticsCompanyOptions = res.data
        })
      },
      //查询商家
      loadmore() {
        this.codePage.pageNum++
        this.handleChange(this.codePage.pageNum)
      },
      handleChange(data) {
        let param = {
          merchantName: this.formData.merchantName,
          pageNum: data,
          approveStatus: 'APPROVED',
          pageSize: this.codePage.pageSize,
        };
        this.searchMerchant(param)
      },
      deleteHandle(){},
      searchHandle(data) {
        this.arr = []
        let param = {
          merchantName: data,
          pageNum: 1,
          approveStatus: 'APPROVED',
          pageSize: this.codePage.pageSize,
        };
        this.searchMerchant(param)
      },
      searchMerchant(param) {
        searchMerchantList(param).then(res => {
          if (res.code == 200) {
            for (let index in res.rows) {
              this.arr.push({
                label: res.rows[index].mallMerchantEntity.merchantName,
                value: res.rows[index].mallMerchantEntity.id,
              })
            }
            let obj = {};
            this.merchantOptions = this.arr.reduce((cur, next) => {
              obj[next.value] ? "" : obj[next.value] = true && cur.push(next);
              return cur;
            }, [])
            this.pages = res.total
          } else {
            this.$message({
              message: res.message,
              type: "error",
            });
          }
        });
      },
      //搜索选择商户
      searchTopMerchant(val){
        this.queryParams.merchantId = val.value
        this.queryParams.merchantName = val.label
      },
      selectChange(val) {
        this.formData.merchantId = val.value
        this.formData.merchantName = val.label
      },
      querySearchAsync(queryString, cb) {
        clearTimeout(this.timeout);
        var results = []
        if (queryString == '') {
          cb(results);
        } else {
          //掉接口需要的参数
          var find = {
            name: queryString, //上面输入框绑定的数据
          };
          getAreas(find).then(response => {
            // this.areaIdsOptions = response.data;
            if (response.code == 200) {
              var result = response.data
              //循环放到一个远程搜索需要的数组
              for (let i = 0; i < result.length; i++) {
                const element = result[i];
                results.push({
                  value: element.name,
                  id: element.id
                })
              }
              cb(results);
            } else {
              results = []
              cb(results);
            }
          });
        }
      },
      // //点击出现搜索后点击的每一项
      handleSelect(event, item) {
        item.areaId = event.id
        item.areaName = event.value
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.freightTemplateEntity.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      reset() {
        this.formData = {
            merchantId: undefined,
            merchantName: '',
            logisticsCompanyId: undefined,
            templateName: undefined,
            billingMethod: '0',
            shippingFreeFlag: 1,
            shippingFreeConditionAmount: undefined,
            defaultFirstUnit: undefined,
            defaultFirstPrice: undefined,
            defaultNextUnit: undefined,
            defaultNextPrice: undefined,
            defaultFirstWeight: undefined,
            defaultNextWeight: undefined,
            freightDetailRequestList: []
          },
          this.resetForm("formData");
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams.merchantName='';
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加运费模板";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.detailsOpen = false
        this.disabled = true
        this.title = "修改运费模板";
        let modularId = [];
        if (row.freightTemplateEntity) {
          modularId = row.freightTemplateEntity.id
        } else {
          modularId = this.ids
        }
        this.getDetail(modularId)
      },
      getDetail(val) {
        getTemplate(val).then(response => {
          this.formData.id = response.data.freightTemplateEntity.id
          this.formData.merchantId = response.data.freightTemplateEntity.merchantId
          this.formData.merchantName = response.data.merchantName
          this.formData.logisticsCompanyId = response.data.freightTemplateEntity.logisticsCompanyId
          this.formData.templateName = response.data.freightTemplateEntity.templateName
          this.formData.billingMethod = response.data.freightTemplateEntity.billingMethod
          this.formData.shippingFreeFlag = response.data.freightTemplateEntity.shippingFreeFlag
          this.formData.shippingFreeConditionAmount = response.data.freightTemplateEntity
            .shippingFreeConditionAmount
          this.formData.defaultFirstUnit = response.data.freightTemplateEntity.defaultFirstUnit
          this.formData.defaultFirstPrice = response.data.freightTemplateEntity.defaultFirstPrice
          this.formData.defaultNextUnit = response.data.freightTemplateEntity.defaultNextUnit
          this.formData.defaultNextPrice = response.data.freightTemplateEntity.defaultNextPrice
          this.formData.defaultFirstWeight = response.data.freightTemplateEntity.defaultFirstWeight
          this.formData.defaultNextWeight = response.data.freightTemplateEntity.defaultNextWeight
          if (response.data.freightDetailEntityList.length > 0) {
            this.formData.freightDetailRequestList = response.data.freightDetailEntityList
          }
          this.open = true;
        });
      },
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            if (this.formData.id != undefined) {
              updateTemplate(this.formData).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addTemplate(this.formData).then(response => {
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
        if (row.freightTemplateEntity) {
          modularIds = row.freightTemplateEntity.id
        } else {
          modularIds = this.ids
        }
        this.$modal.confirm('是否确认删除该运费模板？').then(function() {
          return delTemplate(modularIds);
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
      //添加特定地区
      addArea() {
        this.formData.freightDetailRequestList.push({
          defaultFirstUnit: undefined,
          defaultFirstPrice: undefined,
          defaultNextUnit: undefined,
          defaultNextPrice: undefined,
          defaultFirstWeight: undefined,
          defaultNextWeight: undefined,
          areaId: '',
        })
        console.log(this.formData.freightDetailRequestList)
      },
      deleteArea(index) {
        this.formData.freightDetailRequestList.splice(index, 1)
      },
      // 是否启用
      handleActiveChange(row) {
        let text = row.freightTemplateEntity.activeFlag === "0" ? "启用" : "停用";
        this.$modal.confirm('确认要' + text + '"' + row.freightTemplateEntity.templateName + '"运费模板吗？').then(function() {
          let para = {
            activeFlag: row.freightTemplateEntity.activeFlag,
            freightTemplateId: row.freightTemplateEntity.id
          }
          return modifyFreightTemplateActiveFlag(para);
        }).then(() => {
          this.$modal.msgSuccess(text + "成功");
        }).catch(function() {
          row.freightTemplateEntity.activeFlag = row.freightTemplateEntity.activeFlag === "0" ? "1" : "0";
        });
      },
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
        this.getDetail(modularId)
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
