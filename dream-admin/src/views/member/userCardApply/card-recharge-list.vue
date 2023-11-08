<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="任务名称" prop="roleName">
                <el-input v-model="queryParams.roleName" placeholder="请输入任务名称" clearable style="width: 240px"
                    @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item label="交易类型" prop="transactionType">
                <el-select v-model="queryParams.transactionType" placeholder="交易类型" clearable style="width: 240px">
                    <el-option v-for="dict in transactionTypList" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                    v-hasPermi="['system:role:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
                    v-hasPermi="['system:role:edit']">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                    v-hasPermi="['system:role:remove']">删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                    v-hasPermi="['system:role:export']">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row> -->

        <el-table v-loading="loading" :data="getParamsList"  :border="true">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="设备id" prop="deviceId" width="200" />
            <el-table-column label="资金类型" prop="fundType" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="商户手机号" prop="merchantPhoneNo" :show-overflow-tooltip="true" width="200" />
            <el-table-column label="交易类型" align="center" width="200">
                <template slot-scope="scope">
                    <span>{{ scope.row.transactionType=='RECHARGE'?'充值':( scope.row.transactionType=='SPEND'?'消费':'退款') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="现有余额" prop="balanceAfter" :show-overflow-tooltip="true" width="200" />
            <el-table-column label="消费之前" prop="balanceBefore" :show-overflow-tooltip="true" width="200" />
            <el-table-column label="消费金额" prop="transactionAmount" :show-overflow-tooltip="true" width="200" />
            <el-table-column label="描述" prop="transactionDesc" :show-overflow-tooltip="true" width="200" />
            <el-table-column label="创建时间" prop="createTime" width="200" />
            
            <el-table-column label="修改时间" prop="updateTime" width="200">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.updateTime) }}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope" v-if="scope.row.roleId !== 1">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['system:role:edit']">修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" style="color: #F56C6C;"
                        @click="handleDelete(scope.row)" v-hasPermi="['system:role:remove']">删除</el-button>
                </template>
            </el-table-column> -->
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
            @pagination="getList" />
        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="任务名称" prop="taskName">
                    <el-input v-model="form.taskName" placeholder="请输入平台名称" />
                </el-form-item>
                <el-form-item label="所属平台" prop="platformId">
                    <el-select v-model="form.platformId" filterable placeholder="请选择" v-el-select-loadmore="seleLoadmore"
                        style="width: 360px">
                        <el-option v-for="item in platformList" :key="item.id" :label="item.platformName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务类型" prop="taskType">
                    <el-radio-group v-model="form.taskType">
                        <el-radio v-for="dict in dict.type.manage_task" :key="dict.value" :label="dict.value">{{ dict.label
                        }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="任务描述" prop="content">
                    <el-input v-model="form.content" type="textarea" placeholder="请输入任务描述" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
  
<script>
import { addPost, updatePut, deletes, getLists, getDetails, getPlatformLists } from "@/api/finance/recharge-list";
export default {
    name: "Task-list",
    dicts: ['manage_task'],
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
            platformList: [],
            getParamsList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
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
            transactionTypList:[
                {
                    label:'充值',
                    value:'RECHARGE'
                },
                {
                    label:'消费',
                    value:'SPEND'
                },
                {
                    label:'退款',
                    value:'REFUND'
                }
            ],
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
            }
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
            // this.queryParams.fundType="CASH";//资金类型：积分：POINT，现金：CASH
            // this.queryParams.rechargeAccountType="CARD";//充值账户类型：余额：BALANCE，电子卡：CARD
            // this.queryParams.transactionChannel="CARD";//交易渠道：微信：WECHAT，支付宝：ALIPAY，余额：BALANCE，电子卡：CARD
            // this.queryParams.transactionAttribute="RECHARGE";//订单来源 商城订单：MALL、社区订单：COMMUNITY、点餐设备：FOOD_EQUIPMENT、充值业务：RECHARGE
            this.queryParams.userCardId=this.$route.query.cardId;
            this.queryParams.userInfoId=this.$route.query.userInfoId;
            getLists(this.queryParams).then(response => {
                this.getParamsList = response.rows;
                this.total = response.total;
                this.loading = false;
            }
            );
        },
        //选择框加载更多
        seleLoadmore() {
            this.seleParms.pageNum++;
            this.getPlatformList();
        },
        /** 查询平台列表 */
        getPlatformList() {
            getPlatformLists(this.seleParms).then(response => {
                let platformList = response.rows;
                if (this.platformList.length < response.total) {
                    this.platformList = this.platformList.concat(platformList);
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
            this.download('task/info/export', {
                ...this.queryParams
            }, `task_${new Date().getTime()}.xlsx`)
        }
    }
};
</script>