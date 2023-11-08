<template>
  <div id="scroll-board">
    <div class="titleStyle">订单概览（{{ text }}）</div>
    <dv-scroll-ranking-board :config="config" style="height:300px"  />
  </div>
</template>

<script>
import {
  queryOrderStatisticInfo
} from "@/api/large";
export default {
  name: 'ScrollBoard',
  data() {
    return {
      config: {
        data: [
        ],
        waitTime:6000,
        rowNum:5,
        carousel: 'single'
      },
      valueFormatter({ value }) {
        console.warn(arguments)
        const reverseNumber = (value + '').split('').reverse()
        let valueStr = ''

        while (reverseNumber.length) {
          const seg = reverseNumber.splice(0, 3).join('')
          valueStr += seg
          if (seg.length === 3) valueStr += ','
        }

        return valueStr.split('').reverse().join('')
      },
      timer: {},
      text:"今日",
      statisticType:'ANNUAL'
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);　　// 清除定时器
    this.timer = null;
  },
  methods: {
    setTime() {
      //每隔一分钟运行一次保存方法
      this.timer = setInterval(() => {
        this.queryOrderStatisticInfo(this.statisticType);
      }, 60000)
    },
    //查询平台人员数量统计
    queryOrderStatisticInfo() {
      queryOrderStatisticInfo('statisticType='+this.statisticType).then(response => {
        this.config.data=[];
        let mallOrderTotal = {
          name: '商城订单',
          value: response.data.mallOrderTotal
        }
        this.config.data.push(mallOrderTotal);

        let communityOrderTotal = {
          name: '社区订单',
          value: response.data.communityOrderTotal
        }
        this.config.data.push(communityOrderTotal);

        let mallOrderAmount = {
          name: '商城付款订单',
          value: response.data.mallOrderAmount
        }
        this.config.data.push(mallOrderAmount);

        let communityOrderAmount = {
          name: '社区付款金额',
          value: response.data.communityOrderAmount
        }
        this.config.data.push(communityOrderAmount);

        let withdrawalAmount =  {
          name: '提现金额',
          value: response.data.withdrawalAmount
        }
        this.config.data.push(withdrawalAmount);

         this.config = { ...this.config };
        console.log('====== this.config.data====', this.config.data);
        if(this.statisticType==='ANNUAL'){
          this.statisticType='MONTH';
          this.text="今年";

        }else if(this.statisticType==='TODAY'){
          this.statisticType='ANNUAL';
          this.text="今日";
          
        }else if(this.statisticType==='MONTH'){
          this.statisticType='TODAY';
          this.text="本月";
        }
      });
    }
  },
  created() {
    this.setTime();
  },
  mounted() {
    this.queryOrderStatisticInfo(this.statisticType);

  }
}
</script>

<style scoped>
#scroll-board {
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  padding: 10px;
}

.titleStyle {
  color: #fff;
  text-align: center;
  padding: 12px 0;
  font-weight: bold;
}
</style>
