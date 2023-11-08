<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="团队类型" prop="teamType">
                <el-select v-model="queryParams.teamType" placeholder="任务类型" clearable style="width: 240px">
                    <el-option v-for="dict in dict.type.sys_team_type" 
                        :key="dict.value" 
                        :label="dict.label"
                        :value="dict.value" />
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="用户名称" prop="userId">
                <el-select v-model="queryParams.userId" filterable clearable placeholder="请选择用户"
                    v-el-select-loadmore="seleLoadmore"
                    :filter-method="getListByName"
                    style="width: 240px">
                    <el-option v-for="item in userInfoOptions" :key="item.id" :label="item.nickName + '-' + item.phoneNo" :value="item.id"/>
                </el-select>
            </el-form-item> -->

            <el-form-item label="创建时间">
                <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
                    range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                    v-hasPermi="['system:task:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
                    v-hasPermi="['system:task:edit']">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                    v-hasPermi="['system:task:remove']">删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                    v-hasPermi="['system:task:export']">导出</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport"
                    v-hasPermi="['system:user:import']">导入</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row> -->
        <el-table v-loading="loading" :data="taskList" table-layout="auto"  @selection-change="handleSelectionChange" :border="true">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="编号" prop="id" align="center"   />
            <el-table-column label="用户名称" align="center" prop="nickName" :show-overflow-tooltip="true" />
            <el-table-column label="电话号码" align="center" prop="phoneNo" :show-overflow-tooltip="true"  />
            <el-table-column label="头像" align="center" >
                <template slot-scope="scope">
                    <el-popover placement="right" width="180" trigger="hover">
                        <img :src="`${imgHost}` + scope.row.photoUrl" alt="" style="width: 150px;height: 150px">
                        <img slot="reference" :src="`${imgHost}` + scope.row.photoUrl" style="max-height: 40px;max-width: 40px">
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="上级id" align="center" prop="invitationId" :show-overflow-tooltip="true" />
            <el-table-column label="创建时间" align="center" prop="createTime"  />
            <el-table-column label="修改时间" align="center" prop="updateTime" />
            <!-- <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width" >
                <template slot-scope="scope" >
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['system:task:edit']">修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" style="color: #F56C6C;"
                        @click="handleDelete(scope.row)" v-hasPermi="['system:task:remove']">删除</el-button>
                </template>
            </el-table-column> -->
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
            @pagination="getList" />
        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="执行时间" prop="executionTime">
                    <el-date-picker v-model="form.executionTime" type="datetime" placeholder="选择开始时间" align="right"
                        value-format="yyyy-MM-dd HH:mm:ss" style="width: 360px">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 用户导入对话框 -->
        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
          
        </el-dialog>
    </div>
</template>

<script>
import { addPost, updatePut, deletes, getLists, getDetails } from "@/api/member/user-team-list";
import { listInfo} from "@/api/member/query";
import { getToken } from "@/utils/auth";
export default {
    name: "User-team-list",
    dicts: ['sys_team_type'],
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
            taskList: [],
            // 日期范围
            dateRange: [],
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
            upload: {
                // 是否显示弹出层（用户导入）
                open: false,
                // 弹出层标题（用户导入）
                title: "",
                // 是否禁用上传
                isUploading: false,
                // 是否更新已经存在的用户数据
                userTaskId: 0,
                // 设置上传的请求头部
                headers: { Authorization: "Bearer " + getToken() },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + "/executionPlan/importUserExecutionPlan"
            },
            // 表单校验
            rules: {
                // taskName: [
                //     { required: true, message: "任务名称不能为空", trigger: "blur" }
                // ],
                // platformId: [
                //     { required: true, message: "所属平台不能为空", trigger: "blur" }
                // ],
                // taskType: [
                //     { required: true, message: "任务类型不能为空", trigger: "blur" }
                // ]
            }
        };
    },
    created() {
        this.queryParams.userId = this.$route.query.id
        this.queryParams.teamType = 'DISTRIBUTION_TEAM'
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
            if (this.dateRange.length > 0) {
                this.queryParams.startTime = this.dateRange[0];
                this.queryParams.stopTime = this.dateRange[1];
            }
            getLists(this.queryParams).then(response => {
                this.taskList = response.rows;
                this.total = response.total;
                this.loading = false;
            }
            );
        },
          //通过名称查询平台
        getListByName(val) {
            this.platformList = [];
            this.seleParms.platformName = val;
            this.getUserList();
        },

        //选择框加载更多
        seleLoadmore() {
            this.seleParms.pageNum++;
            this.getUserList();
        },
        /** 查询用户列表 */
        getUserList() {
            listInfo(this.seleParms).then(response => {
                debugger
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
                executionTime: '',
                taskId: this.$route.query.taskId,
                userTaskId: this.$route.query.id
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
            this.title = "添加任务计划";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids
            getDetails(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改任务计划";
            });
        },
          // 文件上传中处理
        handleFileUploadProgress(event, file, fileList) {
             this.upload.isUploading = true;
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
            this.upload.open = false;
            this.upload.isUploading = false;
            this.$refs.upload.clearFiles();
            this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
            this.getList();
        },
        // 提交上传文件
        submitFileForm() {
            this.$refs.upload.submit();
        },
        /** 导入按钮操作 */
        handleImport() {
            this.upload.title = "计划导入";
            this.upload.userTaskId=this.$route.query.id
            this.upload.open = true;
        },
        /** 下载模板操作 */
        importTemplate() {
            this.download('executionPlan/importUserExecutionPlanTemplate', {
            }, `user_task_plan_${new Date().getTime()}.xlsx`)
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
            this.$modal.confirm('是否确认删"' + id + '"的数据项？').then(function () {
                return deletes(id);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => { });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('executionPlan/export', {
                ...this.queryParams
            }, `task_plan_${new Date().getTime()}.xlsx`)
        }
    }
};
</script>
