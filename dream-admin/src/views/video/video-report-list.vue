<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="审核状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="请选择审核状态" clearable :style="{ width: '100%' }">
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
        <el-table v-loading="loading" :data="reportList" border>
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="举报日期" prop="createTime" align="center" />
            <el-table-column label="举报内容" prop="commentContent" align="center" />
            <el-table-column label="评论主题" prop="photoTotal" align="center">
                <template slot-scope="scope">
                    {{ scope.row.commentType == 'VIDEO' ? '短视频' : (scope.row.commentType == 'MALL_ORDER' ? '商城订单' : '社区订单') }}
                </template>
            </el-table-column>
            <el-table-column label="评论信息类型" prop="commentMessageType" align="center">
                <template slot-scope="scope">
                    {{ scope.row.reportSubject == 'VIDEO' ? '视频' : '评论' }}
                </template>
            </el-table-column>
            <el-table-column label="举报图片1" prop="reportImageFirst" align="center">
                <template slot-scope="scope">
                    <el-popover v-if="scope.row.reportImageFirst" placement="right" width="200" trigger="hover">
                        <img :src="`${imgHost}` + scope.row.reportImageFirst" alt="" style="width: 150px;height: 100px">
                        <img slot="reference" :src="`${imgHost}` + scope.row.reportImageFirst"
                            style="height: 40px;width: 60px">
                    </el-popover>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column label="举报图片2" prop="reportImageSecond" align="center">
                <template slot-scope="scope">
                    <el-popover v-if="scope.row.reportImageSecond" placement="right" width="200" trigger="hover">
                        <img :src="`${imgHost}` + scope.row.reportImageSecond" alt="" style="width: 150px;height: 100px">
                        <img slot="reference" :src="`${imgHost}` + scope.row.reportImageSecond"
                            style="height: 40px;width: 60px">
                    </el-popover>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column label="举报图片3" prop="reportImageThird" align="center">
                <template slot-scope="scope">
                    <el-popover v-if="scope.row.reportImageThird" placement="right" width="200" trigger="hover">
                        <img :src="`${imgHost}` + scope.row.reportImageThird" alt="" style="width: 150px;height: 100px">
                        <img slot="reference" :src="`${imgHost}` + scope.row.reportImageThird"
                            style="height: 40px;width: 60px">
                    </el-popover>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column label="审核状态" prop="status" width="200" align="center">
                <template slot-scope="scope">
                    <span :style="scope.row.status == 'APPROVED' ? 'color: #67C23A' : ''">
                        {{ scope.row.status == 'APPROVING' ? '待审核' : (scope.row.status == 'APPROVED' ? '审核通过' :
                            (scope.row.verifyStatus == 'FAIL' ? '审核未通过' : '审核中')) }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="200" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDetails(scope.row)"
                        v-hasPermi="['system:replay:list']">查看视频</el-button>
                    <el-button size="mini" style="color: #67C23A;" type="text" icon="el-icon-check"
                        @click="handleCheck(scope.row)" v-if="scope.row.status == 'APPROVING'"
                        v-hasPermi="['merchant:order:shipped']">审核</el-button>
                    <el-button size="mini" type="text" icon="el-icon-close" style="color: #E6A23C;"
                        @click="handleClose(scope.row)" v-if="scope.row.status == 'APPROVING'"
                        v-hasPermi="['system:order:Logistic']">拒绝</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
            @pagination="getList" />

        <el-dialog title="视频播放" :visible.sync="videoOpen" width="45%">
            <video width="40%" ref="myVideo" :src="myVideoUrl" id="video" oncontextmenu="return false"
                controlslist="nodownload" class="video" autoplay="autoplay"></video>
            <div slot="footer">
                <el-button @click="cancelVideo">取消</el-button>
                <!-- <el-button type="primary" @click="rejectSubmit">确定</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    commentReportList,
    auditCommentReportInfo,
    commentReportDetail

} from "@/api/comment/report";
export default {
    name: 'Manage',
    inheritAttrs: false,
    components: {},
    props: [],
    data() {
        return {
            reportList: [],
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
            formData: {},
            rules: {},
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                // subjectId: '',
                reportSubject: 'VIDEO'

            },
            customsj: [],
            showSearch: true,
            commentTypeOptions: [
                {
                    "label": "短视频",
                    "value": 'VIDEO'
                }, {
                    "label": "商城订单",
                    "value": 'MALL_ORDER'
                }, {
                    "label": "社区订单",
                    "value": 'COMMUNITY_ORDER'
                }

            ],
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
            productList: [],
            productOptions: [],
            productName: '',
            videoOpen: false,
            myVideoUrl: '',
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
            commentReportList(this.queryParams).then(response => {
                this.reportList = response.rows;
                this.total = response.total;
                this.loading = false;
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
                auditCommentReportInfo({
                    id: row.id,
                    acceptType: 'AGREED'
                }).then(response => {
                    this.$modal.msgSuccess("审核成功");
                    row.status = 'APPROVED'
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
            }).then(({
                value
            }) => {
                auditCommentReportInfo({
                    id: row.id,
                    acceptType: 'REJECT',
                    rejectReason: value
                }).then(response => {
                    this.$modal.msgSuccess("拒绝成功");
                    row.status = 'FAIL'
                });

            }).catch(() => { });
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.single = selection.length != 1
            this.multiple = !selection.length
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },

        /** 查看详情操作 */
        handleDetails(row) {
            //   this.$router.push({
            //     path: '/comment/commentDetails',
            //     query: row,
            //   })
            commentReportDetail(row.id).then(response => {
                this.videoOpen = true;
                this.myVideoUrl =response.data.videoInfoEntity.videoPath;
                let media = document.getElementById("video");
                //监听视频准备完毕马上播放，不需要可以注释
                 media.play()
            });

        },
      cancelVideo(){
        this.videoOpen=false;
        let media = document.getElementById("video");
        //监听视频准备完毕马上播放，不需要可以注释
        media.pause();

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
    }
}
</script>
<style></style>
  