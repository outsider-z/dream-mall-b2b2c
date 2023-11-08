<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="交易类型" prop="transactionType">
                <el-select v-model="queryParams.transactionType" placeholder="交易类型" clearable style="width: 240px">
                    <el-option v-for="dict in transactionTypList" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="会员昵称" prop="userInfoId">
                <el-select
                    style="width: 240px"
                    v-model="queryParams.userInfoId"
                    clearable
                    :filter-method="getListByName"
                    filterable
                    placeholder="请输入会员昵称"
                    v-el-select-loadmore="seleLoadmore">
                <el-option v-for="item in userInfoOptions" :key="item.id" :label="item.nickName + '-' + item.phoneNo" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="订单来源" prop="transactionAttribute">
                <el-select v-model="queryParams.transactionAttribute" placeholder="订单来源" clearable style="width: 240px">
                    <el-option v-for="dict in dict.type.sys_transaction_attribute" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="交易渠道" prop="transactionChannel">
                <el-select v-model="queryParams.transactionChannel" placeholder="订单来源" clearable style="width: 240px">
                    <el-option v-for="dict in dict.type.sys_transaction_channel" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                </el-select>
            </el-form-item>

            <el-form-item label="创建时间">
                <el-tooltip content="选择时间不能相差超过31天" placement="top">
                <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
                    range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-tooltip>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                    v-hasPermi="['system:userStatement:export']">导出</el-button>
            </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="getParamsList" @selection-change="handleSelectionChange" :border="true">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="编号" prop="userInfoId" width="200" />
            <el-table-column label="会员" prop="userName" width="200" />
            <el-table-column label="交易之前(元)" prop="balanceBefore" width="100" />
            <el-table-column label="交易之后(元)" prop="balanceAfter" width="100" />
            <el-table-column label="交易金额(元)" prop="transactionAmount" width="100" />
            <el-table-column label="商户名称" prop="merchantName" :show-overflow-tooltip="true" width="200">
                <template slot-scope="scope">
                    <span v-if="scope.row.merchantName">{{ scope.row.merchantName }}</span>
                    <span v-else >--</span>
                </template>
            </el-table-column>
            <el-table-column label="交易类型" align="center" width="100">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.sys_transaction_type" :value="scope.row.transactionType" />
                </template>
            </el-table-column>
            <el-table-column label="交易类型" align="center" width="100">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.sys_transaction_channel" :value="scope.row.transactionChannel" />
                </template>
            </el-table-column>
            <!-- <el-table-column label="商户电话" prop="merchantPhoneNo" :show-overflow-tooltip="true" width="150" /> -->
            <el-table-column label="备注" prop="transactionDesc" :show-overflow-tooltip="true" width="200" />

            <el-table-column label="创建时间" prop="createTime" width="200" />
            <el-table-column label="操作" width="200" fixed="right" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-view" @click="handleDetails(scope.row)"
                        v-hasPermi="['system:userStatement:query']">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
            @pagination="getList" />
        <!-- 详情对话框 -->
        <el-dialog :title="title" :visible.sync="openDetails" width="650px" append-to-body>
            <el-form ref="form" :model="formDetails" size="medium" label-width="100px">
                <el-form-item label="会员名称" style="width: 100%;">
                    <span>{{ formDetails.userName }}</span>
                </el-form-item>
                <el-form-item label="交易之前">
                    <span>{{ formDetails.balanceBefore }}(元)</span>
                </el-form-item>
                <el-form-item label="交易之后">
                    <span>{{ formDetails.balanceAfter }}(元)</span>
                </el-form-item>
                <el-form-item label="交易金额">
                    <span>{{ formDetails.transactionAmount }}(元)</span>
                </el-form-item>
                <el-form-item label="商户名称">
                    <span>{{ formDetails.merchantName || '-'}}</span>
                </el-form-item>
                <el-form-item label="商户电话">
                    <span>{{ formDetails.merchantPhoneNo || '-'}}</span>
                </el-form-item>
                <el-form-item label="订单来源">
                    <dict-tag :options="dict.type.sys_transaction_attribute" :value="formDetails.transactionAttribute" />
                </el-form-item>
                <el-form-item label="交易类型">
                    <dict-tag :options="dict.type.sys_transaction_type" :value="formDetails.transactionType" />
                </el-form-item>
                <el-form-item label="交易渠道">
                    <dict-tag :options="dict.type.sys_transaction_channel" :value="formDetails.transactionChannel" />
                </el-form-item>
                <el-form-item label="创建时间">
                    <span>{{ formDetails.createTime }}</span>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { addPost, updatePut, deletes, getLists, getDetails } from "@/api/finance/recharge-list";
import {listInfo} from "@/api/member/query";
export default {
    name: "Recharge-list",
    dicts: ['sys_transaction_type', 'sys_transaction_attribute', 'sys_transaction_channel'],
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
            userInfoOptions: [],
            getParamsList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            openDetails: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10
            },
            // 下拉框查询数据
            seleParms: {
                pageNum: 1,
                pageSize: 10
            },
            // 表单参数
            form: {},
            formDetails: {},
            transactionTypList: [
                {
                    label: '充值',
                    value: 'RECHARGE'
                },
                {
                    label: '消费',
                    value: 'SPEND'
                },
                {
                    label: '退款',
                    value: 'REFUND'
                }
            ],
            // 日期范围
            dateRange: [],
            // 表单校验
            rules: {
                taskName: [
                    { required: true, message: "任务名称不能为空", trigger: "blur" }
                ],
                platformId: [
                    { required: true, message: "所属平台不能为空", trigger: "blur" }
                ],
                taskType: [
                    { required: true, message: "任务类型不能为空", trigger: "blur" }
                ]
            },

        };
    },
    created() {
        this.getList();
    },
    directives: {
        //这个是写到data外面 与mounted同级
        "el-select-loadmore": {
            bind(el, binding) {
                const SELECTWRAP_DOM = el.querySelector(
                    ".el-select-dropdown .el-select-dropdown__wrap"
                );
                SELECTWRAP_DOM.addEventListener("scroll", function () {
                    const condition =
                        this.scrollHeight - this.scrollTop <= this.clientHeight;
                    if (condition) {
                        binding.value();
                    }
                });
            },
        },
    },
    methods: {
        /** 查询任务列表 */
        getList() {
            this.loading = true;
            this.queryParams.fundType = "CASH";//资金类型：积分：POINT，现金：CASH
            // this.queryParams.rechargeAccountType="CARD";//充值账户类型：余额：BALANCE，电子卡：CARD
            // this.queryParams.transactionChannel="CARD";//交易渠道：微信：WECHAT，支付宝：ALIPAY，余额：BALANCE，电子卡：CARD
            // this.queryParams.transactionAttribute="FOOD_EQUIPMENT";//订单来源 商城订单：MALL、社区订单：COMMUNITY、点餐设备：FOOD_EQUIPMENT、充值业务：RECHARGE
            if (this.dateRange.length > 0) {
                this.queryParams.startTime = this.dateRange[0];
                this.queryParams.stopTime = this.dateRange[1];
            }
            getLists(this.queryParams).then(response => {
                this.getParamsList = response.rows;
                this.total = response.total;
                 });
            this.loading = false;

        },
        //通过名称查询平台
        getListByName(val) {
            this.userInfoOptions = [];
            this.seleParms.nickName = val;
            this.getuserList();
        },
        //选择框加载更多
        seleLoadmore() {
            this.seleParms.pageNum++;
            this.getuserList();
        },
        /** 查询平台列表 */
        getuserList() {
            listInfo(this.seleParms).then(response => {
                let userInfoOptions = response.rows;
                if (this.userInfoOptions.length < response.total) {
                    this.userInfoOptions = this.userInfoOptions.concat(userInfoOptions);
                }
            });

        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                taskType: '',
                taskName: '',
                platformId: '',
                taskName: ''
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange=[];
            this.queryParams={
                pageNum: 1,
                pageSize: 10
            };
            this.resetForm("queryForm");
            this.handleQuery();
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
            this.title = "添加任务";
            this.getPlatformList();
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            this.getPlatformList();
            const id = row.id || this.ids
            getDetails(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改任务";
            });
        },

        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != undefined) {
                        updatePut(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addPost(this.form).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const id = row.id || this.ids;
            this.$modal.confirm('是否确认删任务"' + id + '"的数据项？').then(function () {
                return deletes(id);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => { });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('order/admin/user/statement/export', {
                ...this.queryParams
            }, `user_fund_${new Date().getTime()}.xlsx`)
        },
        //详情
        handleDetails(row) {
            getDetails(row.id).then(response => {
                this.formDetails = response.data;
                this.openDetails = true;
                this.title = "详情";
            });
        }
    }
};
</script>
