<template>
  <div  class="pad">
    <!-- <Chart :cdata="cdata" /> -->
    <div class="content u-flex-colum u-gap">
      <div class="u-font-weight">商户统计</div>
      <div class="u-flex">
        <div class="text-color-1 font-size-32">{{ total }}</div>
        <div>总数</div>
      </div>
      <div class="u-flex-grid" >
        
        <div >
          <div class="text-color-2">{{ platforInfo.communityMerchantTotal }}</div>
          <div>社区商户</div>
        </div>
        <div>
          <div class="text-color-2">{{ platforInfo.communityMerchantDayTotal }}</div>
          <div>今日新增</div>
        </div>
        <div >
          <div class="text-color-2">{{ platforInfo.mallMerchantTotal }}</div>
          <div>商城商户</div>
        </div>
        <div>
          <div class="text-color-2">{{ platforInfo.mallMerchantDayTotal }}</div>
          <div>今日新增</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from './chart.vue';
import {
  queryPlatformMemberInfo
} from "@/api/large";
export default {
  data () {
    return {
      cdata: {
        indicatorData: [
          { name: "data1", max: 300 },
          { name: "data2", max: 250 },
          { name: "data3", max: 300 },
          { name: "data4", max: 5},
          { name: "data5", max: 200 },
          { name: "data6", max: 100 }
        ],
        dataBJ: [
          [94, 69, 114, 2.08, 73, 39, 22],
          [99, 73, 110, 2.43, 76, 48, 23],
          [31, 12, 30, 0.5, 32, 16, 24],
          [42, 27, 43, 1, 53, 22, 25],
          [154, 117, 157, 3.05, 92, 58, 26],
          [234, 185, 230, 4.09, 123, 69, 27],
          [160, 120, 186, 2.77, 91, 50, 28]
        ],
        dataGZ: [
          [84, 94, 140, 2.238, 68, 18, 22],
          [93, 77, 104, 1.165, 53, 7, 23],
          [99, 130, 227, 3.97, 55, 15, 24],
          [146, 84, 139, 1.094, 40, 17, 25],
          [113, 108, 137, 1.481, 48, 15, 26],
          [81, 48, 62, 1.619, 26, 3, 27],
          [56, 48, 68, 1.336, 37, 9, 28]
        ],
        dataSH: [
          [91, 45, 125, 0.82, 34, 23, 1],
          [65, 27, 78, 0.86, 45, 29, 2],
          [83, 60, 84, 1.09, 73, 27, 3],
          [109, 81, 121, 1.28, 68, 51, 4],
          [106, 77, 114, 1.07, 55, 51, 5],
          [109, 81, 121, 1.28, 68, 51, 6],
          [106, 77, 114, 1.07, 55, 51, 7]
        ]
      },
      platforInfo: {},
      timer: '',
      total:0
    }
  },
  components: {
    Chart,
  },
  created() {
    // this.setTime();
    this.queryPlatformMemberInfo();
  },
  beforeDestroy() {
    clearInterval(this.timer);　　// 清除定时器
    this.timer = null;
  },
  methods: {
    setTime() {
      //每隔一分钟运行一次保存方法
      this.timer = setInterval(() => {
        this.queryPlatformMemberInfo();
      }, 60000)
    },
    //查询平台人员数量统计
    queryPlatformMemberInfo() {
      queryPlatformMemberInfo().then(response => {
        let that=this;
        this.total=0;
        this.platforInfo = response.data;
        this.total=response.data.mallMerchantTotal+response.data.communityMerchantTotal

      });
    }
  }
}
</script>
<style lang="scss" scoped>
.pad {
  padding: 20px;
}
.content {
  text-align: center;
  color: #fff;
}
.u-font-weight{
  font-weight: bold;
}
.u-flex-colum {

  display: flex;
  flex-direction: column;
  justify-content: center;
}

.u-flex {

  display: flex;
  flex-direction: row;
  justify-content: center;
}

.u-flex-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 190px);
  grid-gap: 20px;
}
.u-gap{
  gap: 20px;
}
.font-size-32{
  font-size: 32px;
}
.text-color-0{

color:#06153b


}

.text-color-1{

color:#3ceae2


}
.text-color-2{

color:#f46827


}
.text-color-3{

color:#da2f00


}

</style>