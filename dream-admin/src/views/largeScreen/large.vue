<template>
  <dv-full-screen-container style=" background: radial-gradient(#0a1f53,#020f2f,#000c28);">
    <dv-border-box-11 title="拎玩网可视化数据平台">
      <div class="box-content" :style="{height:screenHeight+'px'}">
        <el-row :gutter="20">
          <el-col :span="6">
            <dv-border-box-12 style="height:250px;">
              <topLeftChart />
            </dv-border-box-12>
          </el-col>
          <el-col :span="12">
            <dv-border-box-1 style="height:250px;">
              <topCenter></topCenter>
            </dv-border-box-1>
          </el-col>
          <el-col :span="6">
            <dv-border-box-12 style="height:250px;">
              <topRightChart />
            </dv-border-box-12>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <dv-border-box-7 style="height:430px;">
              <centerLeftChart />
            </dv-border-box-7>
          </el-col>
          <el-col :span="12"><centerCenterChart /></el-col>
          <el-col :span="6">
            <dv-border-box-7 style="height:430px;">
              <centerRightChart />
            </dv-border-box-7>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <dv-border-box-12 style="height:250px;">
              <bottomLeftChart />
            </dv-border-box-12>
          </el-col>
          <el-col :span="12">
            <dv-border-box-12 style="height:250px;">
              <bottomCenterChart />
            </dv-border-box-12>
          </el-col>
          <el-col :span="6">
            <dv-border-box-12 style="height:250px;">
              <bottomRightChart />
            </dv-border-box-12>
          </el-col>
        </el-row>
      </div>
    </dv-border-box-11>
  </dv-full-screen-container>
</template>

<script>
  import topLeftChart from '@/components/chart/topLeftChart'
  import topCenter from '@/components/chart/topCenter'
  import topRightChart from '@/components/chart/topRightChart'
  import centerLeftChart from '@/components/chart/centerLeftChart'
  import centerCenterChart from '@/components/chart/centerCenterChart'
  import centerRightChart from '@/components/chart/centerRightChart'
  import bottomLeftChart from '@/components/chart/bottomLeftChart'
  import bottomRightChart from '@/components/chart/bottomRightChart'
  import bottomCenterChart from '@/components/chart/bottomCenterChart'
  export default {
    //组件需要注入到对象中
    components: {
      topLeftChart,
      topCenter,
      topRightChart,
      centerLeftChart,
      centerCenterChart,
      centerRightChart,
      bottomLeftChart,
      bottomCenterChart,
      bottomRightChart,
    },
    data() {
      return {
        // 设定屏幕分辨率高度的初始值
        screenHeight: 1080
      };
    },
   
    //方法
    methods: {
      // 设置方法获取屏幕分辨率的高度
      getScreenHeight() {
        let screenHeight = window.screen.height
        this.screenHeight = screenHeight
      },
     
    },
    //挂载完成
    mounted() {
      // 调用方法获取数据
      this.getScreenHeight()
    },
  }
</script>

<style scoped>
  .box-content {
    box-sizing: border-box;
    padding: 55px 15px 15px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
</style>
