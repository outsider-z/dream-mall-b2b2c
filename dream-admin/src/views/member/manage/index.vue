<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="等级名称" prop="levelName">
        <el-input v-model="queryParams.levelName" placeholder="请输入等级名称" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:userlevel:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:userlevel:edit']">修改</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:level:remove']">删除</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="levelList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="等级名称" align="center" prop="levelName" >
      </el-table-column>
      <el-table-column label="等级排序" prop="depth" width="250" sortable align="center" />
      <el-table-column label="商品折扣" align="center" width="200" prop="productDiscount">
        <template slot-scope="scope">
          {{ scope.row.productDiscount }}%
        </template>
      </el-table-column>
      <el-table-column label="推广状态" align="center" width="200" prop="promotionFlag">
        <template slot-scope="scope">
          <el-tag :type="scope.row.promotionFlag == '0' ? '' : 'danger'">
            {{ scope.row.promotionFlag == '0' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="分销状态" align="center" width="200" prop="distributionFlag">
        <template slot-scope="scope">
          <el-tag :type="scope.row.distributionFlag == '0' ? '' : 'danger'">
            {{ scope.row.distributionFlag == '0' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否默认" align="center" width="200">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.defaultFlag" active-value="0" inactive-value="1"
            @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="标识合伙人" align="center" width="200">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.partnerFlag" active-value="0" inactive-value="1"
            @change="modifyUserLevelPartnerFlag(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="等级条件(会员)" width="200" align="center" prop="requiredByUserFlag">
        <template slot-scope="scope">
          {{ scope.row.requiredByUserFlag == '0' ? '直接邀请会员' + scope.row.requiredUserCountDirect + '人' +
            (scope.row.requiredByUserSymbol == 'AND' ? '并且' : '或者') + '团队会员数达到' + scope.row.requiredUserCountTeam + '人' :
            '无任何条件' }}
        </template>
      </el-table-column>
      <el-table-column label="等级条件(销售额)" width="200" align="center" prop="requiredByAmountFlag">
        <template slot-scope="scope">
          {{ scope.row.requiredByAmountFlag == '0' ? '直接销售额' + scope.row.requiredProductAmountDirect + '元' +
            (scope.row.requiredByAmountSymbol == 'AND' ? '并且' : '或者') + '团队销售额' + scope.row.requiredProductAmountTeam + '元' :
            '无任何条件' }}
        </template>
      </el-table-column>
      <el-table-column label="月销售金额" width="200" align="center" prop="monthlySalesAmount" />
      <el-table-column label="年度团队人数" width="200" align="center" prop="annualTeamNumber" />
      <el-table-column label="年邀请合伙人数" width="200" align="center" prop="annualInvitePartners" />
      <el-table-column label="年邀请商城商户数" width="200" align="center" prop="annualInviteMallMerchants" />
      <el-table-column label="年邀请社区商户数" width="200" align="center" prop="annualInviteCommunityMerchants" />
      <el-table-column label="备注" width="200" align="center" prop="memo" />
      <el-table-column label="操作" width="200" align="center" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:userlevel:edit']">修改</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:level:remove']">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!-- 添加或修改菜单对话框 -->
    <el-dialog v-bind="$attrs" v-on="$listeners" :visible.sync="open" :title="title" :before-close="cancel">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="150px">
        <el-form-item label="等级名称" prop="levelName">
          <el-input v-model="formData.levelName" placeholder="请输入等级名称" show-word-limit clearable
            :style="{ width: '100%' }"></el-input>
        </el-form-item>
        <el-form-item label="等级排序" prop="depth">
          <el-input-number v-model="formData.depth" placeholder="等级排序"></el-input-number>
        </el-form-item>
        <el-form-item label="商品折扣" prop="productDiscount">
          <el-input-number v-model="formData.productDiscount" placeholder="商品折扣" :precision='2'>
          </el-input-number>
        </el-form-item>
        <el-form-item label="推广状态" prop="promotionFlag" required>
          <el-switch v-model="formData.promotionFlag" :active-value='"0"' :inactive-value='"1"'>
          </el-switch>
        </el-form-item>
        <el-form-item label="分销状态" prop="distributionFlag" required>
          <el-switch v-model="formData.distributionFlag" :active-value='"0"' :inactive-value='"1"'>
          </el-switch>
        </el-form-item>
        <el-form-item label="等级条件" prop="requiredByUserFlag" required>
          <el-switch v-model="formData.requiredByUserFlag" active-text="升级至该会员等级条件按会员数量" :active-value='"0"'
            :inactive-value='"1"'></el-switch>
        </el-form-item>
        <el-row type="flex" justify="start" align="top" :gutter="12" v-if="formData.requiredByUserFlag == '0'">
          <el-col :span="9">
            <el-form-item label="直邀会员数达到" prop="requiredUserCountDirect">
              <el-input-number v-model="formData.requiredUserCountDirect" placeholder="直邀会员数">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label-width="40px" label="" prop="requiredByUserSymbol">
              <el-radio-group v-model="formData.requiredByUserSymbol" size="medium">
                <el-radio v-for="(item, index) in requiredByUserSymbolOptions" :key="index" :label="item.value"
                  :disabled="item.disabled">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="团队会员数达到" prop="requiredUserCountTeam">
              <el-input-number v-model="formData.requiredUserCountTeam" placeholder="团队会员数达到">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="等级条件" prop="requiredByAmountFlag" required>
          <el-switch v-model="formData.requiredByAmountFlag" active-text="升级至该会员等级条件按销售金额" :active-value='"0"'
            :inactive-value='"1"'></el-switch>
        </el-form-item>
        <el-row type="flex" justify="start" align="top" :gutter="12" v-if="formData.requiredByAmountFlag == '0'">
          <el-col :span="9">
            <el-form-item label="直接销售额达到" prop="requiredProductAmountDirect">
              <el-input-number v-model="formData.requiredProductAmountDirect" placeholder="直接销售额">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label-width="40px" label="" prop="requiredByAmountSymbol">
              <el-radio-group v-model="formData.requiredByAmountSymbol" size="medium">
                <el-radio v-for="(item, index) in requiredByAmountSymbolOptions" :key="index" :label="item.value"
                  :disabled="item.disabled">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="团队销售额达到" prop="requiredProductAmountTeam">
              <el-input-number v-model="formData.requiredProductAmountTeam" placeholder="团队销售额">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="月销售金额" prop="monthlySalesAmount">
          <el-input-number v-model="formData.monthlySalesAmount" placeholder="月销售金额"></el-input-number>
        </el-form-item>
        <el-form-item label="年度团队人数" prop="annualTeamNumber">
          <el-input-number v-model="formData.annualTeamNumber" placeholder="年度团队人数"></el-input-number>
        </el-form-item>
        <el-form-item label="年邀请合伙人数" prop="annualInvitePartners">
          <el-input-number v-model="formData.annualInvitePartners" placeholder="年邀请合伙人数"></el-input-number>
        </el-form-item>
        <el-form-item label="年邀请商城商户数" prop="annualInviteMallMerchants">
          <el-input-number v-model="formData.annualInviteMallMerchants" placeholder="年邀请商城商户数">
          </el-input-number>
        </el-form-item>
        <el-form-item label="年邀请社区商户数" prop="annualInviteCommunityMerchants">
          <el-input-number v-model="formData.annualInviteCommunityMerchants" placeholder="年邀请社区商户数">
          </el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="formData.memo" type="textarea" placeholder="请输入备注" :autosize="{ minRows: 4, maxRows: 4 }"
            :style="{ width: '100%' }"></el-input>
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
import {
  listLevel,
  getLevel,
  delLevel,
  addLevel,
  updateLevel,
  modifyUserDefaultLevel,
  modifyUserLevelPartnerFlag
} from "@/api/member/level";
export default {
  name: 'Manage',
  inheritAttrs: false,
  components: {},
  props: [],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      levelList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      defaultSort: {
        prop: 'operTime',
        order: 'descending'
      },
      formData: {
        levelName: '',
        depth: 0,
        productDiscount: 0,
        promotionFlag: '1',
        distributionFlag: '1',
        requiredUserCountDirect: undefined,
        requiredByUserSymbol: 'AND',
        requiredUserCountTeam: 0,
        requiredProductAmountDirect: undefined,
        requiredByAmountSymbol: 'AND',
        requiredProductAmountTeam: 0,
        monthlySalesAmount: 0,
        annualTeamNumber: 0,
        annualInvitePartners: 0,
        annualInviteMallMerchants: 0,
        annualInviteCommunityMerchants: 0,
        memo: undefined,
        requiredByUserFlag: '1',
        requiredByAmountFlag: '1',
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        levelName: '',
      },
      rules: {
        levelName: [{
          required: true,
          message: '请输入等级名称',
          trigger: 'blur'
        }],
        depth: [{
          required: true,
          message: '等级排序',
          trigger: 'blur'
        }],
        productDiscount: [{
          required: true,
          message: '商品优惠',
          trigger: 'blur'
        }],
        requiredUserCountDirect: [{
          required: true,
          message: '直邀会员数',
          trigger: 'blur'
        }],
        requiredByUserSymbol: [{
          required: true,
          message: '不能为空',
          trigger: 'change'
        }],
        requiredUserCountTeam: [{
          required: true,
          message: '团队会员数达到',
          trigger: 'blur'
        }],
        requiredProductAmountDirect: [{
          required: true,
          message: '直接销售额',
          trigger: 'blur'
        }],
        requiredByAmountSymbol: [{
          required: true,
          message: '不能为空',
          trigger: 'change'
        }],
        requiredProductAmountTeam: [{
          required: true,
          message: '团队销售额',
          trigger: 'blur'
        }],
        monthlySalesAmount: [{
          required: true,
          message: '月销售金额',
          trigger: 'blur'
        }],
        annualTeamNumber: [{
          required: true,
          message: '年度团队人数',
          trigger: 'blur'
        }],
        annualInvitePartners: [{
          required: true,
          message: '年邀请合伙人数',
          trigger: 'blur'
        }],
        annualInviteMallMerchants: [{
          required: true,
          message: '年邀请商城商户数',
          trigger: 'blur'
        }],
        annualInviteCommunityMerchants: [{
          required: true,
          message: '年邀请社区商户数',
          trigger: 'blur'
        }],
        memo: [],
      },
      requiredByUserSymbolOptions: [{
        "label": "并且",
        "value": "AND"
      }, {
        "label": "或者",
        "value": "OR"
      }],
      requiredByAmountSymbolOptions: [{
        "label": "并且",
        "value": "AND"
      }, {
        "label": "或者",
        "value": "OR"
      }],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getList()
  },
  mounted() { },
  methods: {
    /** 查询会员列表 */
    getList() {
      this.loading = true;
      listLevel(this.queryParams).then(response => {
        this.levelList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 表单重置
    reset() {
      this.form = {
        levelName: '',
        depth: 0,
        productDiscount: 0,
        promotionFlag: '1',
        distributionFlag: '1',
        requiredUserCountDirect: undefined,
        requiredByUserSymbol: 'AND',
        requiredUserCountTeam: 0,
        requiredProductAmountDirect: undefined,
        requiredByAmountSymbol: 'AND',
        requiredProductAmountTeam: 0,
        monthlySalesAmount: 0,
        annualTeamNumber: 0,
        annualInvitePartners: 0,
        annualInviteMallMerchants: 0,
        annualInviteCommunityMerchants: 0,
        memo: undefined,
        requiredByUserFlag: '1',
        requiredByAmountFlag: '1',
      };
      this.resetForm("form");
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.postId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加会员等级设置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const levelId = row.id || this.ids
      getLevel(levelId).then(response => {
        this.formData = response.data;
        this.open = true;
        this.title = "修改会员等级设置";
      });
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (valid) {
          if (this.formData.id != undefined) {
            updateLevel(this.formData).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.linkOpen = false;
              this.open = false;
              this.getList();
            });
          } else {
            addLevel(this.formData).then(response => {
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
      const levelIds = row.id || this.ids;
      this.$modal.confirm('是否确认删除该条数据项？').then(function () {
        return delLevel(levelIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.$refs.elForm.resetFields()
    },
    // 状态修改
    handleStatusChange(row) {
      let text = row.defaultFlag === "0" ? "使用" : "关闭";
      this.$modal.confirm('确认要默认"' + text + '"该会员等级吗？').then(function () {
        let para = {
          id: row.id,
          defaultFlag: row.defaultFlag
        }
        return modifyUserDefaultLevel(para);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
        this.getList()
      }).catch(function () {
        row.defaultFlag = row.defaultFlag === "0" ? "1" : "0";
      });
    },
    // 点亮合伙人标识
    modifyUserLevelPartnerFlag(row) {
      let text = row.partnerFlag === '1' ? "标识" : "否";
      this.$modal.confirm('确认要"' + text + '"该会员等级为合伙人吗？').then(function () {
        if (row.partnerFlag == '1') {
          row.partnerFlag = '0';
        } else {
          row.partnerFlag = '1';
        }
        let para = {
          id: row.id,
          partnerFlag: row.partnerFlag
        }
        return modifyUserLevelPartnerFlag(para);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
        this.getList();
      }).catch(function () {
        // row.defaultFlag = row.partnerFlag === "0" ? "1" : "0";
      });
    },
  }
}
</script>
<style>
</style>
