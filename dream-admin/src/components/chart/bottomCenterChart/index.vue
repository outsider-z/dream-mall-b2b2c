<template>
  <div id="scroll-board">
    <dv-conical-column-chart :config="config" style="width: 100%; height:200px;" />
  </div>
</template>

<script>
import {
  queryProductNumStatistic
} from "@/api/large";
  export default {
    name: 'ScrollBoard',
    data() {
      return {
        config: {
          data: [
             
            ],
            showValue: true
        },
        timer: {}
      }
    },
    methods: {
      get() {
        queryProductNumStatistic(this.orderAttribute).then(response => {

          let mallProductTotal = {
            name: '商城商品总览',
            value: response.data.mallProductTotal
          }
          this.config.data.push(mallProductTotal);

          let communityProductTotal = {
            name: '社区商品总数',
            value: response.data.communityProductTotal
          }
          this.config.data.push(communityProductTotal);

          let videoTotal = {
            name: '视频总数',
            value: response.data.videoTotal
          }
          this.config.data.push(videoTotal);

        });
        this.config = { ...this.config }
      }
    },
    mounted() {
      let that = this
      that.get()
      // 定时请求数据
      this.timer = setInterval(this.get, 1000 * 60 * 30)
    },
    beforeDestroy() {
      clearInterval(this.timer)
    }
  }
</script>

<style scoped>
  #scroll-board {
    box-sizing: border-box;
    height: 100%;
    overflow: hidden;
    padding: 20px;
  }
</style>
