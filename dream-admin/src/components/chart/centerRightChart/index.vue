<template>
  <div id="scroll-board">
    <dv-scroll-board :config="config" />
  </div>
</template>

<script>
import {
  queryMerchantProductSalesStatistic
} from "@/api/large";
  export default {
    name: 'ScrollBoard',
    data() {
      return {
        config: {
          header: ['商家名称','归属' ,'售出数量'],
          columnWidth: [50, 120, 100, 80],
          data: [
            // ['sensen', '与冗余', '1000'],
            // ['sensen', '与冗余', '1000'],
            // ['sensen', '与冗余', '1000'],
            // ['sensen', '与冗余', '1000'],
            // ['sensen', '与冗余', '1000'],
            // ['sensen', '与冗余', '1000'],
            // ['sensen', '与冗余', '1000'],
            // ['sensen', '与冗余', '1000'],
            // ['sensen', '与冗余', '1000'],
            // ['sensen', '与冗余', '1000'],
            // ['sensen', '与冗余', '1000'],
            // ['森森服饰', 'qwweq', '1000'],
            
          ],
          index: true,
          align: ['center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center'],
          rowNum: 10,
          headerBGC: 'rgba(0, 44, 81, 0.8)',
          headerHeight: 45,
          oddRowBGC: 'rgba(0, 44, 81, 0.8)',
          evenRowBGC: 'rgba(10, 29, 50, 0.8)'
        },
        timer: {}
      }
    },
    methods: {
        get() {
          let that=this;
          queryMerchantProductSalesStatistic().then(response => {
            response.data.forEach(element => {
              let data=[element.merchantName,element.merchantAttribute==='COMMUNITY_MERCHANT'?'社区商户':'商城商户',element.soldUnit]
              that.config.data.push(data)
            });

          this.config={...this.config}



        });
      }
    },
    mounted() {
      let that = this
      this.get();
      // 定时请求数据
      // this.timer = setInterval(this.get, 1000 * 60 * 30)
    },
    beforeDestroy() {
      clearInterval(this.timer)
    }
  }
</script>

<style scoped>
  #scroll-board {
    width: 100%;
    /* box-sizing: border-box; */
    margin-left: 20px;
    height: 100%;
    overflow: hidden;
    /* padding-right: 10px; */
  }
</style>
