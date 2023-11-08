<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="视频名称" prop="videoTitle">
                <el-input v-model="queryParams.videoTitle" placeholder="请输入视频名称" clearable
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
                    v-hasPermi="['system:brand:add']">新增</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <!-- 表单 -->
        <el-table v-loading="loading" :data="videoLibraryList" border>
            <el-table-column label="视频标题" width="200" align="center" prop="videoTitle" />
            <el-table-column label="视频分类" width="200" align="center" prop="videoType" />
            <!-- <el-table-column label="视频分类" width="200" align="center" prop="videoType">
                <template slot-scope="scope">
                    <el-popover placement="right" width="180" trigger="hover">
                        <img :src="scope.row.imagePath" alt="" style="width: 150px;height: 150px">
                        <img slot="reference" :src="scope.row.imagePath" style="max-height: 80px;max-width: 80px">
                    </el-popover>
                </template>
            </el-table-column> -->
            <el-table-column label="创建时间" prop="createTime" width="200" align="center" />
            <el-table-column label="复制链接" prop="videoPath" width="500" align="center" />
            <el-table-column label="视频查看" width="200" align="center" prop="videoType">
                <template slot-scope="scope">
                    <el-button type="success" size="small " plain @click="playVideo(scope.row)"
                        v-hasPermi="['system:info:remove']">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" align="center" width="350" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                        v-hasPermi="['system:brand:remove']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
            @pagination="getList" />
        <!-- 上传视频-->
        <el-dialog :title="title" :visible.sync="open" :before-close="cancel" width="45%">
            <el-form ref="elForm" :model="formData" :rules="rules" label-width="100px">
                <el-form-item label="历史分类" prop="detectionType" v-if="videoCateList.length > 0">
                    <div class="u-flex">
                        <el-button size="small" v-for="(res, index) in videoCateList" :key="index"
                            @click="tagChange(res)">{{ res }}</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="视频分类" prop="videoType">
                    <el-input v-model="formData.videoType" placeholder="视频分类" />
                </el-form-item>
                <el-form-item label="输入标题" prop="videoTitle">
                    <el-input v-model="formData.videoTitle" placeholder="视频标题" />
                </el-form-item>
                <el-form-item label="" prop="highestValue">
                    <el-row>
                        <el-col :span="24">
                            <label class="status"><span class="span_status" style="color:#585858"></span> <span
                                    id="statusText">{{ statusText }}</span></label>
                        </el-col>
                        <el-col :span="24" v-if="authProgress > 0">
                            <el-progress id="progress" style="margin-left: 10px;" :text-inside="true" :stroke-width="15"
                                :percentage='authProgress' :status='authProgress == 100 ? "success" : "text"'>
                            </el-progress>
                        </el-col>
                        <!--用于计算视频时长-->
                        <el-col :span="24">
                            <audio id="audio_id" hidden controls autoplay loop>Your browser can't support HTML5
                                Audio</audio>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="">
                    <el-row :gutter="20">
                        <el-col :span="20">
                            <!-- <div class="filebox">
                                <input type="file" id="fileUpload" @change="fileChange($event)" ref="referenceUpload" class="filebtn">
                                <div class="flletit">选择视频</div>
                                <div class="filetitle">{{ fileTitle }}</div>
                            </div> -->
                            <el-upload class="upload-demo" ref="upload" :auto-upload="false" :file-list="fileList"
                                accept=".mp4,.flv,.mov,.mp3" action="" :on-change="fileChange" :before-upload="videoBeforeUp"
                                :limit="1">
                                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                                <el-button style="margin-left: 10px;" size="small" type="success"
                                    @click="authUpload">上传到服务器</el-button>
                                <div slot="tip" class="el-upload__tip">注意只能上传.mp4,.flv,.mov,.mp3格式的视频且不超过10Gb</div>
                            </el-upload>
                        </el-col>
                        <!-- <el-col :span="4" v-if="this.uploader">
                            <el-button size="small" type="danger" @click="pauseUpload"
                                :disabled="pauseDisabled">暂停</el-button>
                        </el-col>
                        <el-col :span="4" v-if="this.uploader">
                            <el-button size="small" type="primary" @click="authUpload"
                                :disabled="uploadDisabled">开始上传</el-button>
                        </el-col>
                        <el-col :span="4" :push="1" v-if="this.uploader">
                            <el-button size="small" type="success" :disabled="resumeDisabled"
                                @click="resumeUpload">恢复上传</el-button>
                        </el-col> -->
                    </el-row>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="视频播放" :visible.sync="videoOpen" width="45%">
            <video width="40%" ref="myVideo" :src="myVideoUrl" id="video" oncontextmenu="return false"
                controlslist="nodownload" class="video" autoplay="autoplay"></video>
            <div slot="footer">
                <el-button @click="cancelVideo">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import store from '@/store';
import {
    generatorVideoUploadVoucher,
    videoLibrary,
    getVideoLibraryList,
    delVideoLibrary,
    queryVideoLibraryTypeList
} from "@/api/video/video";

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
                videoPath: '',
                videoTitle: '',
                videoType: ''
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

            },
            fileList: [],
            videoOpen: false,
            queryParams: {
                pageNum: 1,
                pageSize: 10
            },
            chooseParams: {
                pageNum: 1,
                pageSize: 100
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
            videoLibraryList: [],
            showSearch: true,
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
            videoCateList: [],
            //用于父组件传值
            vid: {
                videoUrl: this.videoUrl,
                videoSourceId: '',
                videoTime: 0.0
            },
            //文件上传参数，及按钮进度条参数
            fileTitle: '',
            timeout: '',
            partSize: '',
            parallel: '',
            retryCount: '',
            retryDuration: '',
            region: 'cn-shanghai',
            userId: '1081408272662276',
            file: null,
            authProgress: 0,
            uploadDisabled: true,
            resumeDisabled: true,
            pauseDisabled: true,
            // uploader: null,
            statusText: '',
            myVideoUrl:''

        }
    },
    computed: {},
    watch: {},
    created() {
        this.getList()
        this.queryVideoLibraryTypeList()
    },
    mounted() { },
    methods: {
        /** 查询列表 */
        getList() {
            this.loading = true;
            getVideoLibraryList(this.queryParams).then(response => {
                this.videoLibraryList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        playVideo(row) {
            this.videoOpen = true;
            this.myVideoUrl = row.videoPath;
            let media = document.getElementById("video");
            //监听视频准备完毕马上播放，不需要可以注释
            media.play();
        },
        cancelVideo() {
            this.videoOpen = false;
            let media = document.getElementById("video");
            //监听视频准备完毕马上播放，不需要可以注释
            media.pause();
        },
        tagChange(e) {
            this.formData.videoType = e;
        },
        // 查询分类
        queryVideoLibraryTypeList() {

            queryVideoLibraryTypeList(this.chooseParams).then(response => {
                this.videoCateList = response.rows;
                this.total = response.total;
                this.loading = false;
            });

        },
        reset() {
            this.formData = {
                videoPath: '',
                videoTitle: '',
                videoType: '',
                imagePath: ''
            },
            this.resetForm("formData");
            
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.queryParams.merchantName = '';
            this.resetForm("queryForm");
            this.handleQuery();
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "新增素材视频";

        },
        /**
         * @param {Object} response
         * 详情组装
         */
        getShipperDetails(response) {
            this.formData = response
            this.open = true;
        },
        /** 删除按钮操作 */
        handleDelete(row) {

            this.$modal.confirm('是否确认删除？').then(function () {
                return delVideoLibrary(row.id);
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
            this.initUploadData();
            this.reset();
            this.$refs.elForm.resetFields()
            this.$refs.upload.clearFiles();
        },
        //提交
        submitForm() {
            if (this.formData.videoType == '') {
                this.$message.error('请输入视频分类');
                this.open = true;
                return;
            }
            if (this.formData.videoTitle == '') {
                this.$message.error('请输入视频标题');
                this.open = true;
                return;
            }
            if (this.formData.videoPath == '') {
                this.$message.error('请上传视频到服务器');
                this.open = true;
                return;
            }
            videoLibrary(this.formData).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
            });

        },
        videoBeforeUp(file) {
            //视频上传大小
            const isLt1024M = file.size / 1024 / 1024 < 1024;
            if (['video/mp4', 'video/mp3', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) == -
                1) {
                this.$message.error('请上传正确的视频格式');
                return false;
            }
            if (!isLt1024M) {
                this.$message.error('上传视频大小不能超过1GB哦!');
                return false;
            }
        },



        emitEventVod() {
            this.param.authProgress = 0
            this.fileTitle = ''
            this.statusText = ''
            this.pauseDisabled = true
            this.resumeDisabled = true
            this.uploadDisabled = true
        },
        millisecondToDate(msd) {
            // var time2 = parseFloat(msd) / 1000;
            var time = parseFloat(msd);//先将毫秒转化成秒
            var theTime = parseInt(msd);// 秒
            var middle = 0;// 分
            var hour = 0;// 小时
            if (theTime > 60) {
                middle = parseInt(theTime / 60);
                theTime = parseInt(theTime % 60);
                if (middle > 60) {
                    hour = parseInt(middle / 60);
                    middle = parseInt(middle % 60);
                }
            }
            var result = ''
            if (parseInt(theTime) >= 10) {
                result = "0" + ":" + parseInt(theTime);
            } else {
                result = "0" + ":" + "0" + parseInt(theTime);
            }
            if (middle >= 0 && parseInt(theTime) >= 10) {
                result = parseInt(middle) + ":" + parseInt(theTime);
            } else {
                result = parseInt(middle) + ":" + "0" + parseInt(theTime);
            }
            return result;
        },
        onInputFileChange(file) {
            var url = URL.createObjectURL(file);

            var videos = document.getElementById("audio_id")
            videos.src = url;
            var that = this;
            setTimeout(function () {
                if (videos.readyState > 0) {
                    var minutes = parseInt(videos.duration / 60, 10);
                    var seconds = videos.duration % 60;
                    var a = that.millisecondToDate(videos.duration);
                }

            }, 500)
        },
        //选择文件
        fileChange(e) {
            console.log("e---------------->", e);
            //this.file = e.target.files[0]
            this.file = e.raw;
            console.log("e--------file-------->", this.file);
            //var a = this.onInputFileChange(e.target.files[0]);
            var a = this.onInputFileChange(this.file);
            if (!this.file) {
                this.$message.error('请先选择需要上传的文件!')
                return
            }
            if (this.file.type !== 'video/mp4') {
                this.$message.error('请选择.mp4文件!')
                return
            }
            this.fileTitle = this.file.name
            var userData = '{"Vod":{}}'
            if (this.uploader) {
                this.uploader.stopUpload()
                this.param.authProgress = 0
                this.statusText = ''
            }
            this.uploader = this.createUploader()
            console.log(userData)
            this.uploader.addFile(this.file, null, null, null, userData)
            this.uploadDisabled = false
            this.pauseDisabled = true
            this.resumeDisabled = true

        },
        //开始上传
        authUpload() {
            // 然后调用 startUpload 方法, 开始上传
            if (this.uploader !== null) {
                this.uploader.startUpload()
                this.uploadDisabled = true
                this.pauseDisabled = false
            }
        },
        // 暂停上传
        pauseUpload() {
            if (this.uploader !== null) {
                this.uploader.stopUpload()
                this.resumeDisabled = false
                this.pauseDisabled = true
            }
        },
        // 恢复上传
        resumeUpload() {
            if (this.uploader !== null) {
                this.uploader.startUpload()
                this.resumeDisabled = true
                this.pauseDisabled = false
            }
        },
        createUploader(type) {
            let self = this
            // eslint-disable-next-line
            let uploader = new AliyunUpload.Vod({
                timeout: self.timeout || 60000,
                partSize: self.partSize || 1048576,
                parallel: self.parallel || 5,
                retryCount: self.retryCount || 3,
                retryDuration: self.retryDuration || 2,
                region: self.region,
                userId: self.userId,
                // 添加文件成功
                addFileSuccess: function (uploadInfo) {
                    console.log('uploadInfo----------->', uploadInfo);
                    self.uploadDisabled = false
                    self.resumeDisabled = false
                    self.statusText = '添加文件成功, 等待上传...'
                    console.log('addFileSuccess: ' + uploadInfo.file.name)
                },
                // 开始上传
                onUploadstarted: function (uploadInfo) {
                    console.log('uploadInfo-------uploadInfo---->', uploadInfo);
                    // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
                    // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
                    // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
                    // 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
                    // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
                    // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
                    if (!uploadInfo.videoId) {
                        let title = uploadInfo.file.name.substr(0, uploadInfo.file.name.lastIndexOf('.'))
                        //获取凭证的方法

                        generatorVideoUploadVoucher({ videoPath: uploadInfo.file.name, videoTitle: title }).then(({ data: res }) => {
                            if (res.code !== 0) {
                                // return self.$message.error(res.msg)
                            }
                            let uploadAuth = res.videoAuth;
                            let uploadAddress = res.videoPath;
                            let videoId = res.aliVideoId;
                            self.vid.videoSourceId = res.aliVideoId;
                            self.vid.videoUrl = res.videoPath;
                            self.formData.imagePath = res.coverPath;
                            uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId);
                        })

                        // updateIndustry(this.form).then(response => {
                        //     this.$modal.msgSuccess("修改成功");
                        //     this.open = false;
                        //     this.getList();
                        // });
                        self.statusText = '文件开始上传...'
                        console.log('onUploadStarted:' + uploadInfo.file.name + ', endpoint:' + uploadInfo.endpoint + ', bucket:' + uploadInfo.bucket + ', object:' + uploadInfo.object)
                    } else {
                        // 如果videoId有值，根据videoId刷新上传凭证
                        refreshVideo({ videoId: uploadInfo.videoId }).then(res => {
                            // if (res.data.code != 0) {
                            //   return self.$message.error(res.data.msg)
                            // }
                            let uploadAuth = res.data.UploadAuth;
                            let uploadAddress = res.data.UploadAddress;
                            let videoId = res.data.VideoId;
                            self.vid.videoSourceId = res.data.VideoId;
                            self.vid.videoUrl = res.data.videoUrl;
                            uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
                        })
                    }
                },
                // 文件上传成功
                onUploadSucceed: function (uploadInfo) {
                    console.log('onUploadSucceed: ' + uploadInfo.file.name + ', endpoint:' + uploadInfo.endpoint + ', bucket:' + uploadInfo.bucket + ', object:' + uploadInfo.object)
                    self.statusText = '文件上传成功!'
                    self.formData.videoPath = 'http://video.linwanwang.com/' + uploadInfo.object
                },
                // 文件上传失败
                onUploadFailed: function (uploadInfo, code, message) {
                    console.log('onUploadFailed: file:' + uploadInfo.file.name + ',code:' + code + ', message:' + message)
                    self.statusText = '文件上传失败!'
                },
                // 取消文件上传
                onUploadCanceled: function (uploadInfo, code, message) {
                    console.log('Canceled file: ' + uploadInfo.file.name + ', code: ' + code + ', message:' + message)
                    self.statusText = '文件已暂停上传'
                },
                // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
                onUploadProgress: function (uploadInfo, totalSize, progress) {
                    console.log('onUploadProgress:file:' + uploadInfo.file.name + ', fileSize:' + totalSize + ', percent:' + Math.ceil(progress * 100) + '%')
                    let progressPercent = Math.ceil(progress * 100)
                    self.authProgress = parseInt(progressPercent);
                    self.statusText = '文件上传中...'
                },
                // 上传凭证超时
                onUploadTokenExpired: function (uploadInfo) {
                    // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
                    // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
                    // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
                    self.$http.get('/oss/file/refreshUploadVideo', { params: { videoId: uploadInfo.videoId } }).then(({ data: res }) => {
                        if (res.code !== 0) {
                            return self.$message.error(res.msg)
                        }
                        let uploadAuth = res.data.UploadAuth
                        uploader.resumeUploadWithAuth(uploadAuth)
                        console.log('upload expired and resume upload with uploadauth ' + uploadAuth)
                    })
                    self.statusText = '文件超时...'
                },
                // 全部文件上传结束
                onUploadEnd: function (uploadInfo) {
                    console.log('onUploadEnd: uploaded all the files')
                    self.statusText = '文件上传完毕'
                    self.emitEvent(self.vid)
                }
            })
            return uploader
        },
        emitEvent(vid) {
            this.$emit('my-event', vid)
        },
        //初始化组件参数方法
        initUploadData() {
            this.vid = {
                videoUrl: '',
                videoSourceId: ''
            },
                this.fileTitle = '',
                this.timeout = '',
                this.partSize = '',
                this.parallel = '',
                this.retryCount = '',
                this.retryDuration = '',
                this.region = 'cn-shanghai',
                this.userId = '1081408272662276',
                this.file = undefined,
                this.authProgress = 0,
                this.uploadDisabled = true,
                this.resumeDisabled = true,
                this.pauseDisabled = true,
                this.uploader = null,
                this.statusText = ''
                // this.$refs.referenceUpload.value = null;
                
        }
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



.container {
    text-align: center;
    line-height: 1;
}

.upload-type {
    margin: 15px 0;
}

.filebox {
    width: 80px;
    height: 32px;
    color: #fff;
    background-color: #17B3A3;
    border-color: #17B3A3;
    position: relative;
    border-radius: 3px;
    text-align: center;
    line-height: 32px;
    margin: 0 auto;
}

.filebox .filebtn {
    width: 100%;
    height: 100%;
    border: none;
    background: none;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;

}

.filebox .flletit {
    width: 100%;
    height: 100%;
}

.filetitle {
    margin: 10px 0;
}

.status span {
    color: #FF4C52;
}

.status {
    line-height: 28px;
}

.span_status {
    color: #000000;
    float: left;
    margin-left: 10px;
}

#progress {
    width: 450px;
    margin-left: 32px;
}

.u-flex {

    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.msg_video {}

.videoData-class {
    width: 200px;
    height: 100px;
}
</style>
