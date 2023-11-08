<template>
  <!-- <Chart :cdata="cdata" /> -->
  <div class="pad">
    <div class="content u-flex-colum u-gap">
      <div class="u-font-weight">用户统计</div>
      <div class="u-flex">
        <div class="text-color-2 font-size-32">{{ total }}</div>
        <div>总</div>
      </div>
      <div class="u-flex-grid">
        <div v-for="(item, index) in platforInfo.memberStatisticResponseList" :key="index">
          <div class="text-color-1">{{ item.memberTotal }}</div>
          <div>{{ item.memberLevel }}</div>
          <div class="text-color-1" style="margin-top: 10px;">{{ item.memberTodayTotal }}</div>
          <div>今日新增</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Chart from './chart.vue';
import {
  queryPlatformMemberInfo
} from "@/api/large";
export default {
  data() {
    return {
      platforInfo: {},
      timer: '',
      total: 0

    }
  },
  components: {
  },
  mounted() {
    // this.setTime();
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
        let that = this;
        this.total = 0;
        this.platforInfo = response.data;
        response.data.memberStatisticResponseList.forEach(element => {
          that.total += element.memberTotal;
        });

      });
    }
  }
}
</script>

<style lang="scss" scoped>
.pad {
  padding: 20px;
  height: 100%;
}

.content {
  text-align: center;
  color: #fff;
}

.u-font-weight {
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
  grid-template-columns: repeat(auto-fill, 65px);
  grid-gap: 20px;
}

.u-gap {
  gap: 20px;
}

.font-size-32 {
  font-size: 32px;
}

.text-color-0 {

  color: #06153b
}

.text-color-1 {

  color: #3ceae2
}

.text-color-2 {

  color: #f46827
}

.text-color-3 {

  color: #da2f00
}
</style>
