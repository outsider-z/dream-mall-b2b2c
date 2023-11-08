<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <p>
          <!-- <el-button type="primary" size="mini" icon="el-icon-cloudy" plain
            @click="goTarget('https://gitee.com/y_project/RuoYi-Cloud')">访问码云</el-button> -->
          <!-- <el-button size="mini" icon="el-icon-s-home" plain @click="goTarget('http://ruoyi.vip')">访问主页</el-button> -->
          <el-button size="mini" v-if="loginType === 'admin'" icon="el-icon-s-home" plain
            @click="goTarget('/large')">大屏展示</el-button>
          <el-button size="mini" v-if="loginType === 'admin'" icon="el-icon-s-custom" plain
            @click="goTarget('http://39.106.46.52:8182')">客服系统</el-button>
        </p>
      </el-col>
    </el-row>
    <el-row :gutter="24" style="padding-bottom: 20px;" v-if="loginType === 'admin'">
      <el-col>
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>平台看板</span>
          </div>
          <div class="body">
            <el-row>
              <el-col :span="6">
                <div class="bg-member box-item">
                  <div class="ivu-row">
                    <div class="text-title">会员总数量</div>
                    <div class="text-value">{{ userTotal }}</div>
                    <!-- <div class="compare">较昨日0.00% </div> -->
                  </div>
                  <i class="el-icon-user t_ic"></i>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="bg-order box-item">
                  <div class="ivu-row">
                    <div class="text-title">商户总数量</div>
                    <div class="text-value">{{ merchantTotal }}</div>
                    <div class="compare">（商城）{{ platforMerchantInfo.communityMerchantTotal }}（社区）{{
                      platforMerchantInfo.mallMerchantTotal }}</div>
                  </div>
                  <i class="el-icon-takeaway-box t_ic"></i>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="bg-amount box-item">
                  <div class="ivu-row">
                    <div class="text-title">{{ year }}年总金额</div>
                    <div class="text-value">{{ platAmount }}</div>
                    <!-- <div class="compare">较昨日0.00% </div> -->
                  </div>
                  <i class="el-icon-coin t_ic"></i>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="bg-member box-item">
                  <div class="ivu-row">
                    <div class="text-title">已发布视频</div>
                    <div class="text-value">{{ productAndvideoInfo.videoTotal }}</div>
                    <!-- <div class="compare">较昨日0.00% </div> -->
                  </div>
                  <i class="el-icon-video-camera t_ic"></i>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="bg-amount box-item">
                  <div class="ivu-row">
                    <div class="text-title">今日注册会员</div>
                    <div class="text-value">{{ todateUserTotal }}</div>
                    <!-- <div class="compare">较昨日0.00% </div> -->
                  </div>
                  <i class="el-icon-user-solid t_ic"></i>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="bg-member box-item">
                  <div class="ivu-row">
                    <div class="text-title">提现金额</div>
                    <div class="text-value">{{ platforOrderInfo.withdrawalAmount }}</div>
                    <!-- <div class="compare">较昨日0.00% </div> -->
                  </div>
                  <i class="el-icon-s-finance t_ic"></i>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="bg-order box-item">
                  <div class="ivu-row">
                    <div class="text-title">商城商品总数</div>
                    <div class="text-value">{{ productAndvideoInfo.mallProductTotal }}</div>
                    <!-- <div class="compare">较昨日0.00% </div> -->
                  </div>
                  <i class="el-icon-shopping-bag-1 t_ic"></i>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="bg-amount box-item">
                  <div class="ivu-row">
                    <div class="text-title">社区商品总数</div>
                    <div class="text-value">{{ productAndvideoInfo.communityProductTotal }}</div>
                    <!-- <div class="compare">较昨日0.00% </div> -->
                  </div>
                  <i class="el-icon-shopping-bag-1 t_ic"></i>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :lg="['MALL_MERCHANT'].includes(loginType) ? 24 : 12" v-if="['MALL_MERCHANT', 'admin'].includes(loginType)">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>商城信息统计</span>
          </div>
          <div class="body">
            <el-row :gutter="24">
              <el-col :span="8">
                <div class="bg-order box-item">
                  <div class="ivu-row">
                    <div class="text-title">今日订单数量</div>
                    <div class="text-value" v-if="platforOrderInfo.mallOrderTotal >= 0">{{ platforOrderInfo.mallOrderTotal
                    }}</div>
                    <div class="text-value" v-if="merchantSummaryInfo.todayOrderNum >= 0">
                      {{ merchantSummaryInfo.todayOrderNum }}</div>
                    <!-- <div class="compare">较昨日0.00% </div> -->
                  </div>
                  <i class="el-icon-s-order t_ic"></i>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="bg-amount box-item">
                  <div class="ivu-row">
                    <div class="text-title">今日付款金额</div>
                    <div class="text-value" v-if="platforOrderInfo.mallOrderAmount >= 0">{{
                      platforOrderInfo.mallOrderAmount }}</div>
                    <div class="text-value" v-if="merchantSummaryInfo.todayPayAmount >= 0">{{
                      merchantSummaryInfo.todayPayAmount }}</div>
                    <!-- <div class="compare">较昨日0.00% </div> -->
                  </div>
                  <i class="el-icon-wallet t_ic"></i>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="bg-member box-item">
                  <div class="ivu-row">
                    <div class="text-title">商家提现金额</div>
                    <div class="text-value" v-if="platforOrderInfo.withdrawalAmount >= 0">{{
                      platforOrderInfo.withdrawalAmount }}</div>
                    <div class="text-value" v-if="merchantSummaryInfo.merchantBalance >= 0">{{
                      merchantSummaryInfo.merchantBalance }}</div>

                    <!-- <div class="compare">较昨日0.00% </div> -->
                  </div>
                  <i class="el-icon-sold-out t_ic"></i>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="8">
                <div class="bg-order box-item">
                  <div class="ivu-row">
                    <div class="text-title">待付款订单数量</div>
                    <div class="text-value" v-if="waittingOrderInfo.waitingPayOrderTotal >= 0">{{
                      waittingOrderInfo.waitingPayOrderTotal }}</div>
                    <div class="text-value" v-if="merchantSummaryInfo.waitingPayOrderNum >= 0">{{
                      merchantSummaryInfo.waitingPayOrderNum }}</div>

                    <!-- <div class="compare">较昨日0.00% </div> -->
                  </div>
                  <i class="el-icon-user-solid t_ic"></i>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="bg-member box-item">
                  <div class="ivu-row">
                    <div class="text-title">待发货订单数量</div>
                    <div class="text-value" v-if="waittingOrderInfo.waitingDeliveryOrderTotal >= 0">{{
                      waittingOrderInfo.waitingDeliveryOrderTotal }}</div>
                    <div class="text-value" v-if="merchantSummaryInfo.waitingDeliveryOrderNum >= 0">{{
                      merchantSummaryInfo.waitingDeliveryOrderNum }}</div>

                    <!-- <div class="compare">较昨日0.00% </div> -->
                  </div>
                  <i class="el-icon-suitcase t_ic"></i>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="bg-amount box-item">
                  <div class="ivu-row">
                    <div class="text-title">待售后</div>
                    <div class="text-value" v-if="waittingOrderInfo.afterSaleWaitingAuditOrderTotal >= 0">{{
                      waittingOrderInfo.afterSaleWaitingAuditOrderTotal }}</div>
                    <div class="text-value" v-if="merchantSummaryInfo.waitingSaleOrderNum >= 0">{{
                      merchantSummaryInfo.waitingSaleOrderNum }}</div>
                    <!-- <div class="compare">较昨日0.00% </div> -->
                  </div>
                  <i class="el-icon-sell t_ic"></i>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="['COMMUNITY_MERCHANT'].includes(loginType) ? 24 : 12"
        v-if="['COMMUNITY_MERCHANT', 'admin'].includes(loginType)">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>社区信息统计</span>
          </div>
          <el-row :gutter="24">
            <el-col :span="8">
              <div class="bg-order box-item">
                <div class="ivu-row">
                  <div class="text-title">今日付款订单</div>
                  <div class="text-value" v-if="platforOrderInfo.communityOrderTotal >= 0">{{
                    platforOrderInfo.communityOrderTotal }}</div>
                  <div class="text-value" v-if="merchantSummaryInfo.todayOrderNum >= 0">{{
                    merchantSummaryInfo.todayOrderNum }}</div>

                  <!-- <div class="compare">较昨日0.00% </div> -->
                </div>
                <i class="el-icon-s-order t_ic"></i>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="bg-amount box-item">
                <div class="ivu-row">
                  <div class="text-title">今日付款金额</div>
                  <div class="text-value" v-if="platforOrderInfo.communityOrderAmount >= 0">{{
                    platforOrderInfo.communityOrderAmount }}</div>
                  <div class="text-value" v-if="merchantSummaryInfo.todayPayAmount >= 0">{{
                    merchantSummaryInfo.todayPayAmount }}</div>

                  <!-- <div class="compare">较昨日0.00% </div> -->
                </div>
                <i class="el-icon-wallet t_ic"></i>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="bg-member box-item">
                <div class="ivu-row">
                  <div class="text-title">商家提现金额</div>
                  <div class="text-value" v-if="platforOrderInfo.withdrawalAmount >= 0">{{
                    platforOrderInfo.withdrawalAmount
                  }}</div>
                  <div class="text-value" v-if="merchantSummaryInfo.merchantBalance >= 0">{{
                    merchantSummaryInfo.merchantBalance }}</div>

                  <!-- <div class="compare">较昨日0.00% </div> -->
                </div>
                <i class="el-icon-sold-out t_ic"></i>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <div class="bg-order box-item">
                <div class="ivu-row">
                  <div class="text-title">待付款订单数量</div>
                  <div class="text-value" v-if="waittingOrderInfo.waitingPayOrderTotal >= 0">{{
                    waittingOrderInfo.waitingPayOrderTotal }}</div>
                  <div class="text-value" v-if="merchantSummaryInfo.waitingPayOrderNum >= 0">{{
                    merchantSummaryInfo.waitingPayOrderNum }}</div>

                  <!-- <div class="compare">较昨日0.00% </div> -->
                </div>
                <i class="el-icon-user-solid t_ic"></i>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="bg-member box-item">
                <div class="ivu-row">
                  <div class="text-title">待发货订单数量</div>
                  <div class="text-value" v-if="waittingOrdercommInfo.waitingDeliveryOrderTotal >= 0">{{
                    waittingOrdercommInfo.waitingDeliveryOrderTotal }}</div>
                  <div class="text-value" v-if="merchantSummaryInfo.waitingDeliveryOrderNum >= 0">{{
                    waittingOrdercommInfo.waitingDeliveryOrderTotal }}</div>

                  <div class="compare">较昨日0.00% </div>
                </div>
                <i class="el-icon-suitcase t_ic"></i>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="bg-amount box-item">
                <div class="ivu-row">
                  <div class="text-title">待售后</div>
                  <div class="text-value" v-if="waittingOrdercommInfo.afterSaleWaitingAuditOrderTotal >= 0">{{
                    waittingOrdercommInfo.afterSaleWaitingAuditOrderTotal }}</div>
                  <div class="text-value" v-if="merchantSummaryInfo.waitingSaleOrderNum >= 0">{{
                    merchantSummaryInfo.waitingSaleOrderNum }}</div>
                  <!-- <div class="compare">较昨日0.00% </div> -->
                </div>
                <i class="el-icon-sell t_ic"></i>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import store from '@/store'
import {
  queryPlatformMemberInfo,
  queryOrderStatisticInfo,
  queryPendingOrderInfo,
  queryProductNumStatistic,
  queryOrderStatisticGroupMonth,
  queryMerchantSummaryInfo
} from "@/api/large";
export default {
  name: "Index",
  data() {
    return {
      // 版本号
      version: "2.0.0",
      loginType: '',
      merchantTotal: 0,
      userTotal: 0,
      todateUserTotal: 0,
      platforMerchantInfo: {},
      platforOrderInfo: {},
      waittingOrderInfo: {},
      waittingOrdercommInfo: {},
      productAndvideoInfo: {},
      platAmount: 0,
      year: '',
      merchantSummaryInfo: ''

    };
  },
  created() {
    this.getRole();
    //查询平台人员数量统计
    this.queryPlatformMemberInfo();

    //查询商品及视频数量统计
    this.queryProductNumStatistic();
    //查询平台订单数据统计信息
    this.queryOrderStatisticGroupMonth();

    
    //this.openSocket();


    this.openGeasy();
  },
  methods: {

    goTarget(href) {
      window.open(href, "_blank");
    },
    getRole() {
      const roles = store.getters && store.getters.roles;
      this.loginType = roles[0];
      if (this.loginType === 'admin') {
        // 查询订单待处理数据统计信息
        this.queryPendingOrderInfo('MALL');
        // 查询订单待处理数据统计信息
        this.queryPendingOrderInfo('COMMUNITY');
        //查询平台订单数据统计信息
        this.queryOrderStatisticInfo();
      } else {
        this.queryMerchantSummaryInfos();
      }
    },
    //查询平台人员数量统计
    queryPlatformMemberInfo() {
      queryPlatformMemberInfo().then(response => {
        if (response.code == 200) {
          let that = this;
          this.platforMerchantInfo = response.data;
          this.merchantTotal = this.platforMerchantInfo.communityMerchantTotal + this.platforMerchantInfo.mallMerchantTotal;
          this.platforMerchantInfo.memberStatisticResponseList.forEach(element => {
            that.userTotal += element.memberTotal;
            that.todateUserTotal += element.memberTodayTotal;

          });

        }
      });

    },
    //查询平台订单数据统计信息
    queryOrderStatisticInfo() {
      queryOrderStatisticInfo('statisticType=TODAY').then(response => {
        if (response.code == 200) {
          let that = this;
          this.platforOrderInfo = response.data;
        }
      });
    },
    //查询订单待处理数据统计信息
    queryPendingOrderInfo(orderAttribute) {
      queryPendingOrderInfo(orderAttribute).then(response => {
        if (response.code == 200) {
          if (orderAttribute == 'MALL') {
            this.waittingOrderInfo = response.data;
          } else {
            this.waittingOrdercommInfo = response.data;

          }
        }
      });
    },
    //查询商品及视频数量统计
    queryProductNumStatistic() {

      queryProductNumStatistic().then(response => {
        if (response.code == 200) {
          this.productAndvideoInfo = response.data;
        }
      });
    },
    //当月销售额度
    queryOrderStatisticGroupMonth() {
      let that = this;
      this.year = new Date().getFullYear();
      let month = new Date().getMonth() + 1;
      queryOrderStatisticGroupMonth(this.year).then(response => {
        response.data.forEach(element => {
          if (element.monthly == month) {
            //商城销售额
            that.platAmount += element.mallMonthlySalesAmount;
          }

        });

      });
    },
    //商户查询营销数据
    queryMerchantSummaryInfos() {
      queryMerchantSummaryInfo({
        merchantId: store.getters.merchantId
      }).then(response => {
        if (response.code == 200) {
          this.merchantSummaryInfo = response.data;
        }
      });
    },

    openSocket() {
      var socket;
      if (typeof (WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
        //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
        //等同于socket = new WebSocket("ws://localhost:8888/xxxx/im/25");
        //var socketUrl="${request.contextPath}/im/"+$("#userId").val();
        var socketUrl = "http://39.106.46.52:443/websocket/105386088";
        socketUrl = socketUrl.replace("https", "ws").replace("http", "ws");
        console.log(socketUrl);
        if (socket != null) {
          socket.close();
          socket = null;
        }
        socket = new WebSocket(socketUrl);
        //打开事件
        socket.onopen = function () {
          console.log("websocket已打开");
          //socket.send("这是来自客户端的消息" + location.href + new Date());
        };
        //获得消息事件
        socket.onmessage = function (msg) {
          console.log(msg.data);
          //发现消息进入    开始处理前端触发逻辑
        };
        //关闭事件
        socket.onclose = function () {
          console.log("websocket已关闭");
        };
        //发生了错误事件
        socket.onerror = function () {
          console.log("websocket发生了错误");
        }
      }
    },
    openGeasy() {
      let that = this;
      let id_goeasy="";
      let channel_id="";
      if (this.loginType === 'admin') {
        id_goeasy='admin_01';
        channel_id='admin_channel';
      } else {
        id_goeasy=store.getters.merchantId;
        channel_id=store.getters.merchantId;
      }
      this.goEasy.connect({
        // id: 'admin_01',
        id: id_goeasy,
        data: { name: '平台账号', avatar: '' },
        onSuccess: function () {  //连接成功
          console.log("GoEasy connect successfully.") //连接成功
        },
        onFailed: function (error) { //连接失败
          console.log("Failed to connect GoEasy, code:" + error.code + ",error:" + error.content);
        },
        onProgress: function (attempts) { //连接或自动重连中
          console.log("GoEasy is connecting", attempts);
        }
      });
      this.goEasy.pubsub.subscribe({
        channel: channel_id,//替换为您自己的channel
        onMessage: function (message) { //收到消息
          that.notification(message.content);;
          console.log("Channel:" + message.channel + " content:" + message.content);
        },
        onSuccess: function () {
          console.log("Channel订阅成功。");
        },
        onFailed: function (error) {
          console.log("Channel订阅失败, 错误编码：" + error.code + " 错误信息：" + error.content)
        }
      });

    },
    notification(content) {
      let that = this;
      if (!("Notification" in window)) {
        console.log("浏览器不支持消息通知");
        return;
      }
      Notification.requestPermission(function (permission) { });
      //声音提醒 
      // that.$refs.audioTip.load();
      // that.$refs.audioTip.play();
      //如果不是当前页面，标题栏闪动+消息提示
      if (document.hidden) {
        var options = {
          body: content,
          silent: true
        }
        var notification = new Notification('消息通知', options);

        notification.onclick = function () {
          window.open(`页面链接`, '_blank');
        }
        //标题栏闪动
        var defaultTitle = document.title;
        if (that.isReceive) {
          return;
        } else {
          that.isReceive = true;
        }
        that.timer = setInterval(function () {
          var title = document.title;
          if (document.hidden && that.isReceive) {
            if (/你有新消息/.test(title) == false) {
              document.title = content;
            } else {
              document.title = defaultTitle;
            }
          } else {
            that.isReceive = false;
            document.title = defaultTitle;
          }
        }, 500);
        that.$modal.notifySuccess(content);
      }else{
        that.$modal.notifySuccess(content);
      }


    }


  },
};
</script>

<style scoped lang="scss">
.t_ic::before {
  font-size: 35px;
  color: #fff;
}

.home {

  .bg-member {
    background-image: linear-gradient(135deg, #ABDCFF 10%, #0396FF 100%) !important;
  }

  .bg-order {
    background-image: linear-gradient(135deg, #FFD3A5 10%, #FD6585 100%) !important;

  }

  .bg-amount {
    background-image: linear-gradient(135deg, #EE9AE5 10%, #5961F9 100%) !important;
  }

  .ivu-row {
    position: relative;
    margin-left: 0;
    margin-right: 0;
    height: auto;
    zoom: 1;
    display: block;
  }

  .box-item {
    display: flex;
    text-align: center;
    height: 130px;
    border-radius: 7px;
    margin: 10px;
    padding: 20px;
    justify-content: center;

    .text-value {
      font-weight: 700;
      font-size: 20px;
      color: #fff;

    }

    .text-title {
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 10px;
    }

    .compare {
      color: #fff;
      font-size: 12px;
      margin-top: 10px;
    }

    .t_ic {
      text-align: right;
      margin-top: 10px;
      width: 30%;
    }

  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }


  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans",
  "Helvetica Neue",
  Helvetica,
  Arial,
  sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>
