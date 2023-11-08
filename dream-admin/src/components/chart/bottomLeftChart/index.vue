<template>
  <div id="scroll-board">
    <dv-capsule-chart :config="config" style="height:230px" />
  </div>
</template>

<script>
import {
  queryPendingOrderInfo
} from "@/api/large";
export default {
  name: 'ScrollBoard',
  data() {
    return {
      config: {
        data: [],
        showValue: true
      },
      timer: {},
      orderAttribute: 'MALL'
    }
  },
  methods: {
    //查询平台人员数量统计
    get() {
      queryPendingOrderInfo(this.orderAttribute).then(response => {
        let afterSaleWaitingAuditOrderTotal = {
          name: '退款待审核',
          value: response.data.afterSaleWaitingAuditOrderTotal
        }
        this.config.data.push(afterSaleWaitingAuditOrderTotal);
        let withdrawalWaitingAuditOrderTotal = {
          name: '提现待审核',
          value: response.data.withdrawalWaitingAuditOrderTotal
        }
        this.config.data.push(withdrawalWaitingAuditOrderTotal);

        let waitingPayOrderTotal = {
          name: '订单待付款',
          value: response.data.waitingPayOrderTotal
        }
        this.config.data.push(waitingPayOrderTotal);

        let waitingDeliveryOrderTotal = {
          name: '订单待发货',
          value: response.data.waitingDeliveryOrderTotal
        }
        this.config.data.push(waitingDeliveryOrderTotal);

        this.config = { ...this.config }

      });
    },
    setTime() {
      //每隔一分钟运行一次保存方法
      this.timer = setInterval(() => {
        this.get();
      }, 60000)
    },
  },
  mounted() {
    this.get()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
#scroll-board {
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  padding: 10px 30px 10px 10px;
}
</style>
