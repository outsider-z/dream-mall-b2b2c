<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="模块名称" prop="moduleName">
        <el-input v-model="queryParams.moduleName" placeholder="请输入模块名称" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="" prop="status">
        <el-select v-model="queryParams.status" placeholder="选择状态" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.sys_job_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:moduleSettings:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['system:moduleSettings:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:moduleSettings:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!-- 表-->
    <el-table v-loading="loading" :data="modularList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="模块名称" prop="moduleName" width="200" align="center" />
      <el-table-column label="模块类型" align="center" prop="moduleType" width="200">
        <template slot-scope="scope"  >
          <a v-if="scope.row.moduleType=='COMMUNITY_SERVICE'"  @click="setCommunitService(scope.row)">
            <dict-tag  :options="dict.type.sys_modular_type" :value="scope.row.moduleType" style="color: crimson;" />
          </a>
          <dict-tag v-else :options="dict.type.sys_modular_type" :value="scope.row.moduleType" />
        </template>
      </el-table-column>
      <el-table-column label="模块等级" align="center" prop="moduleLevel" width="200">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_module_level" :value="scope.row.moduleLevel" />
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" width="100" sortable align="center" />
      <el-table-column label="状态" align="center" width="150">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == '1' ? 'danger' : ''">{{scope.row.status == '0' ? '启用' : '关闭'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:moduleSettings:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:moduleSettings:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    
      <!-- 新增弹窗 -->
    <el-dialog :title="title" :visible.sync="open" :before-close="cancel" width="45%">
      <el-form ref="elForm" :inline="true" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="模块名称" prop="moduleName">
          <el-input v-model="formData.moduleName" placeholder="请输入模块名称" clearable >
          </el-input>
        </el-form-item>
        <el-form-item label="模块类型" prop="moduleType">
          <el-select v-model="formData.moduleType" placeholder="请选择模块类型" clearable >
            <el-option v-for="dict in dict.type.sys_modular_type" :key="dict.value" :label="dict.label"
              :value="dict.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择活动" prop="activeName" v-if="formData.moduleType=='COMMUNITY_ACTIVE'">
          <el-input v-model="formData.activeName" placeholder="请选择活动" clearable @focus="activeFoucs"></el-input>
        </el-form-item>
        <el-form-item label="模块等级" prop="moduleLevel">
          <el-select v-model="formData.moduleLevel" placeholder="请选择模块等级" clearable  disabled>
            <el-option v-for="dict in dict.type.sys_module_level" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="一级行业" prop="primaryName">
          <el-select  v-model="formData.primaryName" clearable :filter-method="searchHandle" filterable placeholder="请选择一级行业" v-el-select-loadmore="loadmore" @change="industryChange"
            @keyup.delete.native="deleteHandle">
            <el-option v-for="item in primaryOption" :key="item.value" :label="item.label" :value="item" />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="二级行业" prop="secondaryId" v-if="formData.moduleLevel == 'SECOND'">
          <el-select v-model="formData.secondaryId" placeholder="请选择二级行业" clearable >
            <el-option v-for="item in secondaryOption" :key="item.id" :label="item.industryName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="排序" prop="sort" style="width: 100%;">
          <el-input-number v-model="formData.sort" placeholder="排序" controls-position=right></el-input-number>
        </el-form-item>
        <!-- <el-form-item label="广告图" prop="moduleIcon" v-if="formData.moduleType=='TO_MALL'">
          <el-upload class="avatar-uploader" :action="uploadFileUrl" :show-file-list="false" :headers="headers"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="formData.moduleIcon" :src="`${imgHost}`+ formData.moduleIcon" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> -->
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择活动" :visible.sync="activeOpen">
      <el-table v-loading="loading" ref="multipleTableOne" :data="popupList" @select="handleActiveChange"
        @select-all="selectAll">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="activeType" label="活动类型" width="180" align="center">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_market_type" :value="scope.row.activeType" />
          </template>
        </el-table-column>
        <el-table-column prop="activeName" label="活动名称" width="180" align="center">
          <template slot-scope="scope">
            {{scope.row.activeName}}
          </template>
        </el-table-column>
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
        <el-table-column label="最大商品数" prop="merchantMaxProduct" align="center" />
        <el-table-column label="活动状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status =='NOT_STARTED'">未开始</span>
            <span v-if="scope.row.status =='IN_PROGRESS'">进行中</span>
            <span v-if="scope.row.status =='CLOSED'">已结束</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="activeTotal>0" :total="activeTotal" :page.sync="activeParams.pageNum"
        :limit.sync="activeParams.pageSize" @pagination="getAcitveList" />
      <div slot="footer">
        <el-button @click="activeOpen =false">取消</el-button>
        <el-button type="primary" @click="submitActive">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    listSettings,
    getSettings,
    addSettings,
    updateSettings,
    delSettings
  } from "@/api/system/setting";
  import {
    queryAllIndustryList,
    listIndustry
  } from "@/api/system/industry";
  import {
    listCentreCenter,
  } from "@/api/market/centre";
  import store from '@/store'
  export default {
    name: 'Modular',
    dicts: ['sys_modular_type', 'sys_job_status', 'sys_module_level', 'sys_market_type'],
    inheritAttrs: false,
    components: {},
    props: [],
    data() {
      var valiIcon = (rule, value, callback) => {
        // 图片验证
        if (this.formData.moduleIcon == '') {
          callback(new Error("请上传模块图标"));
        } else {
          callback();
        }
      }
      return {
        headers: {
          Authorization: "Bearer " + store.getters.token
        },
        modularList: [],
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
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile/oss",
        formData: {
          moduleName: undefined,
          moduleType: undefined,
          industryId: undefined,
          sort: 0,
          moduleIcon: '',
          moduleDescription: '',
          moduleLevel: 'HOME',//默认一级
          activeId: '',
          moduleAttribute: 'COMMUNITY',
          status: '0',
          secondaryId: '',
          activeName: '',
          primaryName: '',
          primaryId:'',
          parentModuleId:0
        },
        primaryId: '',
        rules: {
          moduleName: [{
            required: true,
            message: '请输入模块名称',
            trigger: 'blur'
          }],
          moduleType: [{
            required: true,
            message: '请选择模块类型',
            trigger: 'change'
          }],
          activeName: [{
            required: true,
            message: '请选择活动',
            trigger: 'change'
          }],
          sort: [{
            required: true,
            message: '请输入排序',
            trigger: 'blur'
          }],

        },
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          moduleAttribute: 'COMMUNITY',
          moduleLevel:'HOME'
        },
        showSearch: true,
        primaryOption: [],
        secondaryOption: [],

        popupList: [],
        activeOpen: false,
        activeParams: {
          pageNum: 1,
          pageSize: 1000,
        },
        activeTotal: 0,
        multipleSelection: [],
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
      this.handleChange(1)
    },
    mounted() {},
    methods: {
      /** 查询列表 */
      getList() {
        this.loading = true;
        listSettings(this.queryParams).then(response => {
          this.modularList = response.rows;
          this.total = response.total;
          this.loading = false;
        });

      },
      //查询商家
      loadmore() {
        this.codePage.pageNum++
        this.handleChange(this.codePage.pageNum)
      },
      handleChange(data) {
        let param = {
          industryName: this.industryName,
          industryParentId: '0',
          pageNum: data,
          pageSize: this.codePage.pageSize,
        };
        this.searchIndustry(param)
      },
      deleteHandle() {},
      searchHandle(data) {
        this.arr = []
        let param = {
          industryName: data,
          industryParentId: '0',
          pageNum: 1,
          pageSize: this.codePage.pageSize,
        };
        this.searchIndustry(param)
      },
      searchIndustry(param) {
        listIndustry(param).then(res => {
          if (res.code == 200) {
            for (let index in res.rows) {
              this.arr.push({
                label: res.rows[index].industryName,
                value: res.rows[index].id,
              })
            }
            let obj = {};
            this.primaryOption = this.arr.reduce((cur, next) => {
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
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      reset() {
        this.formData = {
            id: undefined,
            moduleName: undefined,
            moduleType: undefined,
            industryId: undefined,
            sort: 0,
            moduleIcon: '',
            moduleDescription: '',
            moduleLevel: 'HOME',
            activeId: '',
            moduleAttribute: 'COMMUNITY',
            status: '0',
            secondaryId: '',
            activeName: '',
            parentModuleId:0
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
      /**选择等级**/
      industryChange(val) {
        this.primaryId = val.value
        this.formData.primaryName = val.label
        if (this.formData.moduleLevel == '') {
          this.$modal.msgWarning("请先选择模块等级");
          this.formData.secondaryId = ''
          return;
        } else if (this.formData.moduleLevel == 'SECOND') {
          let para = {
            industryParentId: val.value
          }
          queryAllIndustryList(para).then(response => {
            this.secondaryOption = response.data
          });
        }
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const modularId = row.id || this.ids
        getSettings(modularId).then(response => {
          this.formData = response.data;
          this.primaryId = response.data.firstIndustryId
          this.formData.primaryName = response.data.firstIndustryName
          if (response.data.moduleLevel == 'SECOND') {
            this.formData.secondaryId = response.data.secondIndustryId
            let para = {
              industryParentId: this.primaryId
            }
            queryAllIndustryList(para).then(response => {
              this.secondaryOption = response.data
            });
          }
          this.formData.activeName = response.data.activeName
          this.open = true;
          this.title = "修改模块设置";
        });
      },
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            if (this.formData.moduleLevel == 'SECOND') {
              this.formData.industryId = this.formData.secondaryId
            } else if (this.formData.moduleLevel == 'FIRST') {
              this.formData.industryId = this.primaryId
            }
            if (this.formData.id != undefined) {
              updateSettings(this.formData).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              if (this.formData.moduleLevel == 'SECOND') {
                this.formData.industryId = this.formData.secondaryId
              } else if (this.formData.moduleLevel == 'FIRST') {
                this.formData.industryId = this.primaryId
              }
              addSettings(this.formData).then(response => {
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
        const modularIds = row.id || this.ids;
        this.$modal.confirm('是否确认删除模块名称为"' + row.moduleName + '"的数据项？').then(function() {
          return delSettings(modularIds);
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
      handleAvatarSuccess(res, file) {
        this.formData.moduleIcon = res.data.url;
        if (this.formData.moduleIcon != '') {
          this.$refs.elForm.clearValidate('moduleIcon') //清除图片校验文字
        }
      },
      beforeAvatarUpload(file) {
        let isAccept = new RegExp('image/*').test(file.type)
        if (!isAccept) {
          this.$message.error('请选择jpg,jpeg或者png格式的图片')
        }
        // const isLt2M = file.size / 1024 / 1024 < 2;
        return isAccept;
      },
      // 状态修改
      handleStatusChange(row) {
        let text = row.status === "0" ? "启用" : "停用";
        // let para = {
        //   id :row.id,
        //   status:row.status
        // }
        this.$modal.confirm('确认要"' + text + '""' + row.moduleName + '"模块吗？').then(function() {
          return updateSettings(row);
        }).then(() => {
          this.$modal.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
        this.$refs.elForm.resetFields()
      },
      //选择活动
      handleActiveChange(selection, row) {
        this.$refs.multipleTableOne.clearSelection()
        if (selection.length == 0) {
          return
        }
        this.$refs.multipleTableOne.toggleRowSelection(row, true)
        this.multipleSelection = selection
      },
      selectAll() {
        this.$refs.multipleTableOne.clearSelection()
      },
      submitActive() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            message: '请选择活动',
            type: 'warning'
          });
        } else if (this.multipleSelection[0].status == 'CLOSED') {
          this.$message({
            message: '请选择未开始或者进行中的活动',
            type: 'warning'
          });
        } else {
          this.activeOpen = false
          this.formData.activeId = this.multipleSelection[0].id
          this.formData.activeName = this.multipleSelection[0].activeName
        }
      },
      /**
       * 选择活动
       */
      activeFoucs() {
        this.activeOpen = true,
          this.getAcitveList()
      },
      /**
       * 查询活动
       */
      getAcitveList() {
        listCentreCenter(this.activeParams).then(response => {
          this.popupList = response.rows;
          this.activeTotal = response.total;
          this.loading = false;
        });
      },
      /**
       * @param {Object} row
       * 设置服务
       */
      setCommunitService(row){
        this.$router.push({
          path: '/serviceList',
          query: {
            data: row.id
          }
        })

      }
    }
  }
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
