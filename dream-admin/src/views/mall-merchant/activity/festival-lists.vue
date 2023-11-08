<template>
    <div class="app-container">
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                    v-hasPermi="['system:swiper:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
                    v-hasPermi="['system:swiper:edit']">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="single" @click="handleDelete"
                    v-hasPermi="['system:swiper:remove']">删除</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" table-layout="auto" :data="seckillList" @selection-change="handleSelectionChange" :border="true">
            <el-table-column type="selection"  align="center" />
            <el-table-column label="开始时间" align="center" prop="beginTime">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.beginTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="结束时间" align="center" prop="endTime">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.endTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="活动名称" align="center" prop="activityName">
                <template slot-scope="scope">
                    <span>{{ scope.row.activityName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="activityName">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="修改时间" align="center" prop="activityName">
                <template slot-scope="scope">
                    <span>{{ scope.row.updateTime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
                <template slot-scope="scope" >
                    <el-button size="mini" type="text" icon="el-icon-menu" @click="handleProduct(scope.row)"
                        >配置商品</el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['system:swiper:edit']">修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                        v-hasPermi="['system:swiper:remove']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
@pagination="getList" />

        <el-dialog :title="title" :visible.sync="open">
            <el-form ref="elForm" :model="formData" :rules="rules" label-width="150px" size="mini">
                <el-form-item label-width="150px" label="日期范围" prop="time" required>
                    <el-date-picker v-model="formData.time" type="daterange" format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" @input="timeChange"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label-width="150px" label="活动名称" prop="activityName" required>
                    <el-input v-model="formData.activityName" placeholder="拼团活动名称" :style="{ width: '50%' }"></el-input>
                </el-form-item>
                <!-- <el-form-item label-width="150px" label="成团有效期(天)" prop="maxTranDays" required>
                    <el-input-number v-model="formData.maxTranDays" placeholder="成团有效期" :min="0" :style="{ width: '50%' }"
                        controls-position=right></el-input-number>
                </el-form-item> -->
            </el-form>
            <div slot="footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="submitForm">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import transferPage from '@/components/transfer-page/transfer-page';
import {
    getHolidayActiveList,
    addHolidayActive,
    getHolidayActiveDetails,
    updateHolidayActive,
    delHolidayActive

} from "@/api/mall-merchant/festival-list";



export default {
    components: { transferPage },
    name:'Festival-lists',
    data() {
        return {
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                activeId: this.$route.query.id
            },
            open: false,
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            showSearch: true,
            addProductFlag: false,
            loading: false,
            title: '',
            formData: {
                time: [],
                activityName: '',
                maxTranDays: '',
                activeId: this.$route.query.id
            },
            seckillList: [],
            rules: {
                time: [{
                    required: true,
                    message: '请选择时间段',
                    trigger: 'change'
                }],
                activityName: [
                    {
                        required: true,
                        message: '请输入拼团活动名称',
                        trigger: 'change'
                    }
                ],
                maxTranDays: [{
                    required: true,
                    message: '请输入成团有效期',
                    trigger: 'change'
                }],
            },
            total: 0
        }
    },
    created() {
        this.getList()
        // this.getDictType()
    },
    mounted() { },
    methods: {
        /** 查询列表 */
        getList() {
            this.loading = true;
            this.queryParams.activeId=this.$route.query.id
            getHolidayActiveList(this.queryParams).then(response => {
                this.seckillList = response.rows;
                this.total = response.total;
                this.loading = false;
            });

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
            this.title = "添加活动";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            let id = row.id || this.ids;
            // this.formData =row;
            // this.open = true;
            // this.title = "修改活动";
            // this.formData.time = [];
            // this.formData.time[0] = row.beginTime;
            // this.formData.time[1] = row.endTime;
            getHolidayActiveDetails(id).then(response => {
                this.formData = response.data;
                this.formData.time=[];
                this.formData.time[0] = response.data.beginTime
                this.formData.time[1] = response.data.endTime
                this.open = true;
                this.title = "修改活动";
             });

        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const swiperIds = row.id
            this.$modal.confirm('是否确认删除该条数据项？').then(function () {
                return delHolidayActive(swiperIds);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => { });
        },
        cancel() {
            this.open = false;
            this.reset();
        },
        timeChange(time) {
            this.formData.time = time;
            this.formData.beginTime = time[0];
            this.formData.endTime = time[1];
        },
        //弹窗提交
        submitForm() {
            this.$refs['elForm'].validate(valid => {
                if (valid) {

                    if (this.formData.id != undefined) {
                        updateHolidayActive(this.formData).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            // this.linkOpen = false;
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        this.formData.activeId = this.$route.query.id;
                        addHolidayActive(this.formData).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            })
        },
        handleProduct(row) {
            // this.addProductFlag = true;
            this.$router.push({
                path: '/mall-merchant/avtivity/festival-product-list',
                query: row,
            })
        },
        reset() {
            this.formData={
                beginTime: "",
                endTime:"",
                activityName: '',
                activeId: this.$route.query.id
            },
           this.resetForm("elForm");
        },
    }
}
</script>
  
<style></style>
  