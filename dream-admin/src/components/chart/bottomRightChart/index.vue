<template>
  <div id="scroll-board">
    <dv-water-level-pond :config="config" style="width:150px;height:200px" />
  </div>
</template>

<script>
  export default {
    name: 'ScrollBoard',
    data() {
      return {
        config: {
          data: [55],
          shape: 'round'
        },
        timer: {}
      }
    },
    methods: {
      get() {
        //   axios
        //     .get('/datavdemoscrollboard')
        //     .then(response => {
        //       console.log(response)
        //       const {
        //         config
        //       } = this
        //       this.config.data = response.data
        //       this.config = {
        //         ...this.config
        //       }
        //       // console.log(this.config)
        //     })
        //     .catch(function(error) { // 请求失败处理
        //       console.log(error)
        //     })
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
    width: 100%;
    box-sizing: border-box;
    height: 100%;
    overflow: hidden;
    padding: 10px 30px 10px 10px;
  }
</style>
