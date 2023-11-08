<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="商户归属" prop="merchantAttribute">
              <el-select v-model="queryParams.merchantAttribute" placeholder="请选择商户归属" clearable :style="{ width: '100%' }">
                <el-option v-for="(item, index) in merchantAttribute" :key="index" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="手机号" prop="phoneNo">
                <el-input v-model="queryParams.phoneNo" placeholder="请输入手机号" clearable style="width: 240px"
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="商家名称" prop="merchantName">
                <el-input v-model="queryParams.merchantName" placeholder="请输入商家名称" clearable style="width: 240px"
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="商户类型" prop="merchantType">
              <el-select v-model="queryParams.merchantType" placeholder="请选择商户类型" clearable :style="{ width: '100%' }">
                <el-option v-for="(item, index) in merchantType" :key="index" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审核状态" prop="approveStatus">
                <el-select v-model="queryParams.approveStatus" placeholder="请选择审核状态" clearable :style="{ width: '100%' }">
                    <el-option v-for="(item, index) in approveStatusOptions" :key="index" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="modularList" border>
            <el-table-column label="申请时间" prop="createTime" width="200" align="center">
                <template slot-scope="scope">
                    {{ scope.row.mallMerchantEntity.createTime }}
                </template>
            </el-table-column>
            <el-table-column prop="merchantType" label="商户类型" width="120" align="center">
                <template slot-scope="scope">
                    {{ scope.row.mallMerchantEntity.merchantType == 'ORG' ? '企业' : (scope.row.mallMerchantEntity.merchantType
                        == 'PERSON' ? '个人' : '个体') }}
                </template>
            </el-table-column>
            <el-table-column label="商家名称" prop="merchantName" width="300" align="center">
                <template slot-scope="scope">
                    {{ scope.row.mallMerchantEntity.merchantName }}
                </template>
            </el-table-column>
            <el-table-column label="商家归属" prop="merchantName" width="200" align="center">
                <template slot-scope="scope">
                    {{ scope.row.mallMerchantEntity.merchantAttribute=='MALL_MERCHANT'?'商城商户':'社区商户' }}
                </template>
            </el-table-column>
            <el-table-column label="商家电话" prop="phoneNo" width="200" align="center">
                <template slot-scope="scope">
                    {{ scope.row.mallMerchantEntity.phoneNo }}
                </template>
            </el-table-column>
            <el-table-column label="审核状态" prop="approveStatus" width="120" align="center">
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.mallMerchantEntity.approveStatus == 'APPROVING' ? 'info' : (scope.row.mallMerchantEntity.approveStatus == 'APPROVED' ? 'success' : 'danger')">
                        {{ scope.row.mallMerchantEntity.approveStatus == 'APPROVING' ? '审核中' :
                            (scope.row.mallMerchantEntity.approveStatus == 'APPROVED' ? '审核通过' : '审核失败') }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="账户状态" prop="status" width="120" align="center">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.mallMerchantEntity.status == '0' ? '' : 'danger'">
                        {{ scope.row.mallMerchantEntity.status == '0' ? '正常' : '冻结' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="失败原因" prop="failReason" width="300" align="center">
                <template slot-scope="scope">
                    {{ scope.row.mallMerchantEntity.failReason }}
                </template>
            </el-table-column>
            <!-- <el-table-column label="排序" prop="sort" width="300" sortable align="center" /> -->
            <el-table-column label="操作" width="300" align="center" fixed="right" class-name="small-padding fixed-width">
                <template slot-scope="scope" v-if="scope.row.id !== 1">
                    <el-button type="text" size="small" icon="el-icon-view" @click="handlePreview(scope.row)">详情</el-button>
                    <el-button :style="scope.row.mallMerchantEntity.approveStatus=='APPROVING'?'color: #67C23A;':''"  :disabled="scope.row.mallMerchantEntity.approveStatus=='APPROVING'?false:true" size="mini" type="text" icon="el-icon-check" @click="handleCheck(scope.row)"
                        v-hasPermi="['system:merchant:edit']">同意</el-button>
                    <el-button :style="scope.row.mallMerchantEntity.approveStatus=='APPROVING'? 'color:#E6A23C':''" :disabled="scope.row.mallMerchantEntity.approveStatus=='APPROVING'?false:true" size="mini" type="text" icon="el-icon-close" @click="handleClose(scope.row)"
                        v-hasPermi="['system:merchant:edit']">拒绝</el-button>
                    <!-- <el-button size="mini" type="text" icon="el-icon-link" @click="handleLink(scope.row)"
              v-hasPermi="['system:merchant:edit']">配置客服链接</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

            <el-dialog title="商户详情" :visible.sync="open">
            <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="150px">
                <el-form-item label="商家名称:" prop="merchantName">
                    <span>{{ formData.merchantName }}</span>
                </el-form-item>
                <el-form-item label="邀请人电话:" prop="inviteesId" v-if="formData.inviteesId != null">
                    <span>{{ formData.inviteesId }}</span>
                </el-form-item>
                <el-form-item label="申请时间:" prop="createTime">
                    <span>{{ formData.createTime }}</span>
                </el-form-item>
                <el-form-item label="商户类型:" prop="merchantType">
                    <span>{{ formData.merchantType == 'ORG' ? '企业' :
                        (formData.merchantType == 'PERSON' ? '个人' : '个体') }}</span>
                </el-form-item>
                <el-form-item label="商家电话:" prop="phoneNo">
                    <span>{{ formData.phoneNo }}</span>
                </el-form-item>
                <el-form-item label="商家地址:" prop="merchantAddress">
                    <span>{{ formData.merchantAddress }}</span>
                </el-form-item>
                <el-form-item label="商家LOGO:" prop="logo">
                    <el-image style="width: 100px; height: 100px" :src="`${imgHost}`+formData.logo"
                        :preview-src-list="[`${imgHost}`+formData.logo]">
                    </el-image>
                </el-form-item>
                <el-row :gutter="15">
                    <el-col :span="8">
                        <el-form-item label="管理人身份证正面:" prop="adminFrontIdCard">
                            <el-image style="width: 100px; height: 100px"
                                :src="`${imgHost}`+formData.mallMerchantQualificationEntity.adminFrontIdCard"
                                :preview-src-list="[`${imgHost}`+formData.mallMerchantQualificationEntity.adminFrontIdCard]">
                            </el-image>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="管理人身份证反面:" prop="adminReverseIdCard">
                            <el-image style="width: 100px; height: 100px"
                                :src="`${imgHost}`+formData.mallMerchantQualificationEntity.adminReverseIdCard"
                                :preview-src-list="[`${imgHost}`+formData.mallMerchantQualificationEntity.adminReverseIdCard]">
                            </el-image>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="法人身份证正面:" prop="legalFrontIdCard"
                            v-if="formData.merchantType == 'ORG'">
                            <el-image style="width: 100px; height: 100px"
                                :src="`${imgHost}`+formData.mallMerchantQualificationEntity.legalFrontIdCard"
                                :preview-src-list="[`${imgHost}`+formData.mallMerchantQualificationEntity.legalFrontIdCard]">
                            </el-image>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="15">
                    <el-col :span="8">
                        <el-form-item label="法人身份证反面:" prop="legalReverseIdCard"
                            v-if="formData.merchantType == 'ORG'">
                            <el-image style="width: 100px; height: 100px"
                                :src="`${imgHost}`+formData.mallMerchantQualificationEntity.legalReverseIdCard"
                                :preview-src-list="[`${imgHost}`+formData.mallMerchantQualificationEntity.legalReverseIdCard]">
                            </el-image>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="三证合一:" prop="threeCertificate"
                            v-if="formData.merchantType == 'ORG' || formData.merchantType == 'INDIVIDUAL'">
                            <el-image style="width: 100px; height: 100px"
                                :src="`${imgHost}`+formData.mallMerchantQualificationEntity.threeCertificate"
                                :preview-src-list="[`${imgHost}`+formData.mallMerchantQualificationEntity.threeCertificate]">
                            </el-image>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer">
                <el-button @click="open=false">取消</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import {
    listMerchant,
    queryMerchantDetailById,
    changeStatus,
} from "@/api/mall-merchant/merchant";
import store from '@/store'
export default {
    name: 'Application-list',
    dicts: ['sys_modular_type', 'sys_job_status'],
    inheritAttrs: false,
    components: {},
    props: [],
    data() {
        return {
            headers: {
                Authorization: "Bearer " + store.getters.token
            },
            modularList: [],
            open: false,
            total: 0,
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/upload",
            formData: {
                mallMerchantQualificationEntity:{}
            },
            adminFrontList: [],
            logoList: [],
            adminReverList: [],
            legalFrontList: [],
            legalReverList: [],
            threeList: [],
            orgList: [],
            registList: [],
            rules: {},
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                phoneNo: '',
                merchantName: '',
                approveStatus: '',
                merchantAttribute: 'MALL_MERCHANT',
                merchantType: ''
            },
            showSearch: true,
            approveStatusOptions: [{
                label: '审核中',
                value: 'APPROVING'
            },
            {
                label: '审核通过',
                value: 'APPROVED'
            },
            {
                label: '审核失败',
                value: 'FAIL'
            }
            ],
          merchantAttribute: [{
            label: '商城商户',
            value: 'MALL_MERCHANT'
          },
            {
              label: '社区商户',
              value: 'COMMUNITY_MERCHANT'
            }
          ],
          merchantType: [{
            label: '个人',
            value: 'PERSON'
          },
            {
              label: '个体',
              value: 'INDIVIDUAL'
            },
            {
              label: '企业',
              value: 'ORG'
            }
          ]
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
            listMerchant(this.queryParams).then(response => {
                this.modularList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        reset() {
            this.formData = {

            },
                this.resetForm("formData");
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
        // 取消按钮
        cancel() {
            this.open = false;
        },
        //预览
        handlePreview(row) {
            this.open = true;
            //   this.formData = row
            //   this.logoList[0] = row.mallMerchantEntity.logo
            //   this.adminFrontList[0] = row.mallMerchantEntity.adminFrontIdCard
            //   this.adminReverList[0] = row.mallMerchantEntity.adminReverseIdCard
            //   if (row.mallMerchantEntity.legalFrontIdCard != '') {
            //     this.legalFrontList[0] = row.mallMerchantEntity.legalFrontIdCard
            //   }
            //   if (row.mallMerchantEntity.legalReverseIdCard != '') {
            //     this.legalReverList[0] = row.mallMerchantEntity.legalReverseIdCard
            //   }
            //   if (row.mallMerchantEntity.threeCertificate != '') {
            //     this.threeList[0] = row.mallMerchantEntity.threeCertificate
            //   }
            //   if (row.mallMerchantEntity.orgCertificate != '') {
            //     this.orgList[0] = row.mallMerchantEntity.orgCertificate
            //   }
            //   if (row.mallMerchantEntity.registrationCertificate != '') {
            //     this.registList[0] = row.mallMerchantEntity.registrationCertificate
            //   }

            queryMerchantDetailById(row.mallMerchantEntity.id).then(response => {
                this.formData = response.data;
            });

        },
        /** 同意按钮操作 */
        handleCheck(row) {
            this.$modal.confirm('确认通过该审核吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                type: 'warning'
            }).then(() => {
                row.mallMerchantEntity.approveStatus = 'APPROVED'
                changeStatus(row.mallMerchantEntity).then(response => {
                    this.$modal.msgSuccess("审核成功");
                });
            }).catch(() => { });
        },
        /** 拒绝按钮操作 */
        handleClose(row) {
            this.$prompt('请输入拒绝原因', "拒绝", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnClickModal: false,
                type: 'warning'
            }).then(({value}) => {
                row.mallMerchantEntity.failReason = value
                row.mallMerchantEntity.approveStatus = 'FAIL'
                changeStatus(row.mallMerchantEntity).then(response => {
                    this.$modal.msgSuccess("拒绝成功");
                });
            }).catch(() => { });
        },
        /** 配置客服链接 */
        handleLink(row) {
            this.$prompt('请输入商家客服链接', "配置链接", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnClickModal: false,
            }).then(({
                value
            }) => {
                row.mallMerchantEntity.serverLink = value
                changeStatus(row.mallMerchantEntity).then(response => {
                    this.$modal.msgSuccess("配置成功");
                });
            }).catch(() => { });
        },
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
}</style>
