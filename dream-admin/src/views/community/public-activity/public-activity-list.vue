<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="活动名称" prop="activeName">
                <el-input v-model="queryParams.activeName" placeholder="请输入活动名称" clearable
                    @keyup.enter.native="handleQuery" />

            </el-form-item>
            <el-form-item label="开始时间" prop="beginTime">
                <el-date-picker v-model="queryParams.beginTime" type="datetime" placeholder="选择开始时间" align="right">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="stopTime">
                <el-date-picker v-model="queryParams.stopTime" type="datetime" placeholder="选择结束时间" align="right">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="请选择活动类型" clearable>
                    <el-option v-for="dict in statusOptions" :key="dict.value" :label="dict.label" :value="dict.value">
                    </el-option>
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
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <!-- 表单 -->
        <el-table v-loading="loading" :data="activityList" table-layout="auto" :border="true">
            <el-table-column label="活动名称"  align="center" :show-overflow-tooltip="true" prop="activeName" />
            <el-table-column label="活动主图"  align="center">
                <template slot-scope="scope">
                    <el-popover placement="right" trigger="hover">
                        <img :src="`${imgHost}` + scope.row.activePhoto" alt="" style="width: 150px;height: 100px">
                        <img slot="reference" :src="`${imgHost}` + scope.row.activePhoto" style="height: 40px;width: 60px">
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="发起单位" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <sapn>{{ scope.row.initiators }}</sapn>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <sapn>{{ scope.row.status === '1' ? '停用' : '启用' }}</sapn>
                </template>
            </el-table-column>
            <el-table-column label="开始时间" prop="beginTime" :show-overflow-tooltip="true"  align="center" />
            <el-table-column label="结束时间" prop="endTime" :show-overflow-tooltip="true" align="center" />
            <el-table-column label="活动简介" prop="activeDesc" :show-overflow-tooltip="true" align="center" />
            <el-table-column label="操作" fixed="right" align="center" width="300" class-name="small-padding fixed-width">
                <template slot-scope="scope" >
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['system:brand:edit']">修改</el-button>
                    <el-button v-if="scope.row.status == '1'" size="mini" type="text" icon="el-icon-edit"
                        @click="handleStatusChange(scope.row)" v-hasPermi="['system:brand:edit']">启动</el-button>
                    <el-button v-if="scope.row.status == '0'" size="mini" type="text" icon="el-icon-edit"
                        @click="handleStatusChange(scope.row)" v-hasPermi="['system:brand:edit']">关闭</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                        v-hasPermi="['system:brand:remove']">删除</el-button>
                    <el-button size="mini" type="text" @click="handleUser(scope.row)"
                        v-hasPermi="['system:brand:remove']">查看报名人</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
            @pagination="getList" />

        <!-- 新增活动 -->
        <el-dialog :title="title" :visible.sync="open" :before-close="cancel" width="45%">
            <el-form ref="elForm" :inline="true" :model="formData" :rules="rules" size="medium" label-width="100px"
                label-position="right">
                <el-form-item label="活动名称" prop="activeName">
                    <el-input v-model="formData.activeName" placeholder="请输入活动名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="发起单位" prop="initiators">
                    <el-input v-model="formData.initiators" placeholder="请输入发起单位" clearable></el-input>
                </el-form-item>
                <el-form-item label="开始时间" prop="beginTime">
                    <el-date-picker v-model="formData.beginTime" type="datetime" placeholder="选择开始时间" align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker v-model="formData.endTime" type="datetime" placeholder="选择结束时间" align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="计划人数" prop="plannedNum">
                    <el-input v-model="formData.plannedNum" placeholder="活动招募人数" clearable></el-input>
                </el-form-item>
                <el-form-item label="活动简介" prop="activeDesc">
                    <el-input v-model="formData.activeDesc" placeholder="活动简介" clearable></el-input>
                </el-form-item>
                <el-form-item label="活动主图" prop="activePhoto" style="width:100%">
                    <el-upload class="main-uploader" :action="uploadFileUrl" :show-file-list="false" :headers="headers"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="formData.activePhoto" :src="`${imgHost}` + formData.activePhoto" class="minAvatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="活动内容" prop="productDesc" style="width: 100%;">
                    <editor v-model="formData.productDesc" :min-height="160" />
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="submitForm">确定</el-button>
            </div>
        </el-dialog>
        <!-- 报名人数 -->
        <el-dialog title="报名人数" :visible.sync="userOpen">
            <el-form :model="chooseParams" ref="userQueryForm" size="small" :inline="true" v-show="showSearch">
                <el-form-item label="报名人" prop="userName">
                    <el-input v-model="chooseParams.userName" placeholder="请输入报名人" clearable style="width: 240px"
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini"
                        @click="getAllCommonityMerchant()">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetChooseParams">重置</el-button>
                    <el-button icon="el-icon-download" type="warning" size="mini" @click="handleExport">导出</el-button>
                </el-form-item>
            </el-form>
            <el-table ref="singleTable" v-loading="chooseLoading" :data="userList" border height="500">
                <el-table-column label="用户姓名" prop="userName" width="200" align="center" />
                <el-table-column label="联系电话" prop="phoneNo" width="300" align="center" />
                <el-table-column label="联系邮箱" prop="emailAddress" width="200" align="center" />
                <el-table-column label="创建时间" prop="createTime" width="200" align="center" />
            </el-table>
            <pagination v-show="chooseTotal > 0" :total="chooseTotal" :page.sync="chooseParams.pageNum"
                :limit.sync="chooseParams.pageSize" @pagination="getCharityUserList" />
        </el-dialog>

    </div>
</template>

<script>
import store from '@/store';

import {
    addCharityActive,
    getCharityActiveList,
    updateCharityActive,
    getCharityUserList,
    delCharityActive
} from "@/api/community/activitys";

export default {
    inheritAttrs: false,
    components: {},
    props: [],
    data() {
        var phoneNValidate = (rule, value, callback) => {
            if (!phoneNo.test(value)) {
                callback(new Error('请输入正确的电话号码'));
            } else {
                callback();
            }
        };
        return {
            formData: {
                id: '',
                merchantId: "",
                merchantName: '',
                merchantAttribute: 'COMMUNITY_MERCHANT',
                avatar: '',
                name: '',
                sex: "0",
                phoneNo: ''
            },
            statusOptions: [
                {
                    "label": "启用",
                    "value": "0"
                }, {
                    "label": "关闭",
                    "value": "1"
                }],
            rules: {
                activeName: [
                    {
                        required: true,
                        message: '请输入活动名称',
                        trigger: 'change'
                    }],
                activeDesc: [{
                    required: true,
                    message: '请输入活动简介',
                    trigger: 'blur'
                }],
                activePhoto: [{
                    required: true,
                    message: '请输上传活动主图',
                    trigger: 'blur'
                }],
                beginTime: [{
                    required: true,
                    message: '请选择开始时间',
                    trigger: 'blur'
                }],
                endTime: [{
                    required: true,
                    message: '请选择结束时间',
                    trigger: 'blur'
                }],
                productDesc: [{
                    required: true,
                    message: '请输入活动内容',
                    trigger: 'blur'
                }],
                initiators: [{
                    required: true,
                    message: '请输入发起单位',
                    trigger: 'blur'
                }]
            },
            queryParams: {
                pageNum: 1,
                pageSize: 10
            },
            chooseParams: {
                pageNum: 1,
                pageSize: 10
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
            activityList: [],
            showSearch: true,
            userOpen: false,
            userList: [],
            list: [],
            disabled: false,
            pages: '',
            arr: [],
            chooseTotal: 0,
            chooseLoading: false,
            headers: {
                Authorization: "Bearer " + store.getters.token
            },
            uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile/oss",
        }
    },
    computed: {},
    watch: {},
    created() {
        this.getList()
    },
    mounted() { },
    methods: {
        /** 查询列表 */
        getList() {
            this.loading = true;
            getCharityActiveList(this.queryParams).then(response => {
                this.activityList = response.rows;
                this.total = response.total;
                this.loading = false;
            });

        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('market/admin/charityUser/export', {
                ...this.queryParams
            }, `user_${new Date().getTime()}.xlsx`)
        },
        resetChooseParams() {
            this.resetForm("userQueryForm");
        },
        // 查询活动报名人
        handleUser(row) {
            this.userOpen = true;
            this.chooseParams.charityActiveId = row.id;
            this.chooseLoading = true;
            getCharityUserList(this.chooseParams).then(response => {
                this.userList = response.rows;
                this.chooseTotal = response.total;
                this.chooseLoading = false;
            });
        },
        getCharityUserList() {
            this.chooseLoading = true;
            getCharityUserList(this.chooseParams).then(response => {
                this.userList = response.rows;
                this.chooseTotal = response.total;
                this.chooseLoading = false;
            });
        },
        // 状态修改
        handleStatusChange(row) {

            let text = row.status == "1" ? "开启" : "关闭";
            let para = row
            this.$modal.confirm('确认要"' + text + '"该活动吗？').then(function () {
                if (row.status === "1") {
                    para.status = '0';//开启
                } else if (row.status === "0") {
                    para.status = '1';//关闭
                }
                return updateCharityActive(para);
            }).then(() => {
                row = para;
                this.$modal.msgSuccess(text + "成功");
                this.$forceUpdate();
            }).catch(function () {
            });
        },
        reset() {
            this.formData = {
                merchantId: "",
                merchantName: '',
                merchantAttribute: 'COMMUNITY_MERCHANT',
                avatar: '',
                name: '',
                sex: "0",
                phoneNo: ''
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
            this.title = "新增公益活动";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            this.disabled = true
            this.title = "修改公益活动";
            this.getShipperDetails(row);
        },
        /**
         * @param {Object} response
         * 详情组装
         */
        getShipperDetails(response) {
            this.formData = response
            this.open = true;
        },
        //提交
        submitForm() {
            this.$refs['elForm'].validate(valid => {
                console.log('valid', valid);
                if (valid) {
                    if (this.formData.id != undefined) {
                        updateCharityActive(this.formData).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addCharityActive(this.formData).then(response => {
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

            this.$modal.confirm('是否确认删除该活动？').then(function () {
                return delCharityActive(row.id);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => { });
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
         * banner上传成功后
         */
        handleAvatarSuccess(res, file) {
            this.formData.activePhoto = res.data.url;
            this.$forceUpdate();
        },
        beforeAvatarUpload(file) {
            let isAccept = new RegExp('image/*').test(file.type)
            let isRightSize = file.size / 1024 / 1024 < 100
            if (!isAccept) {
                this.$message.error('应该选择image/*类型的文件')
                return isAccept
            } else if (!isRightSize) {
                this.$message.error('文件大小超过 100MB')
                return isRightSize
            }
        },
    }
}
</script>
<style>
.main-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background-color: #fbfdff;
}

.main-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
}

.minAvatar {
    width: 148px;
    height: 148px;
    display: block;
}

.icon-style {
    width: 40px;
    height: 40rpx;
}
</style>
  