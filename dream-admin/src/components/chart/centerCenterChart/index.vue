<template>
  <div>
    <Chart :cdata="cdata" />
  </div>
</template>

<script>
import {
  queryOrderStatisticGroupMonth
} from "@/api/large";
import Chart from './chart.vue'
export default {
  data() {
    return {
      cdata: {
        category: [
          "一月",
          "二月",
          "三月",
          "四月",
          "五月",
          "六月",
          "七月",
          "八月",
          "九月",
          "十月",
          "十一月",
          "十二月",
        ],
        barData1: [
          // 4600,
          // 5000,
          // 5500,
          // 6500,
          // 7500,
          // 8500,
          // 9900,
          // 12500,
          // 14000,
          // 21500,
          // 23200,
          // 0,
        ],
        barData2: [
          // 18092,
          // 20728,
          // 24045,
          // 28348,
          // 32808,
          // 36097,
          // 39867,
          // 44715,
          // 48444,
          // 50415,
          // 56061,
          // 62677,
        ],
        lineData1: [
          // 18092,
          // 20728,
          // 24045,
          // 28348,
          // 32808,
          // 36097,
          // 39867,
          // 44715,
          // 48444,
          // 50415,
          // 56061,
          // 0,
        ],
        lineData2: [
          // 12334,
          // 23311,
          // 24045,
          // 23453,
          // 26433,
          // 23423,
          // 39867,
          // 44765,
          // 43222,
          // 45666,
          // 32222,
          // 0,
        ],
      },
      statisticType: ""
    };
  },
  components: {
    Chart,
  },
  mounted() {
    this.get();
  },
  methods: {
    // 根据自己的业务情况修改
    setData() {
      // for (let i = 0; i < this.cdata.barData.length - 1; i++) {
      //   let rate = this.cdata.barData[i] / this.cdata.lineData[i];
      //   this.cdata.rateData.push(rate.toFixed(2));
      // }
    },
    get() {
      let that = this;
      this.statisticType =new Date().getFullYear();
      queryOrderStatisticGroupMonth(this.statisticType).then(response => {
        response.data.forEach(element => {
          //商城销售额
          that.cdata.barData1.push(element.mallMonthlySalesAmount);
          //商城增长率
          that.cdata.lineData1.push(element.mallMonthlySalesAmount);
          //社区销售额
          that.cdata.barData2.push(element.communityMonthlySalesAmount);
          //社区销增长率
          that.cdata.lineData2.push(element.communityMonthlySalesAmount);

        });
        this.cdata = { ...this.cdata };

      });
    }



  }
};
</script>

<style lang="scss" scoped></style>
