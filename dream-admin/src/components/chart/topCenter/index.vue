<template>
  <div class="chartNum">
    <div class="titleStyle">
      月销售额
    </div>
    <div class="box-item">
      <li :class="{ 'number-item': !isNaN(item), 'mark-item': isNaN(item) }" v-for="(item, index) in orderNum" :key="index">
        <span v-if="!isNaN(item)">
          <i ref="numberItem">0123456789</i>
        </span>
        <span class="comma" v-else>{{ item }}</span>
      </li>
    </div>
    <div class="titleStyle">元</div>
    <div class="titleStyle"></div>
  </div>
</template>

<script>
import {
  queryOrderStatisticGroupMonth
} from "@/api/large";
export default {
  data() {
    return {
      orderNum: ['0', '0', ',', '0', '0', '0', ',', '0', '0', '0'], // 默认订单总数
      statisticType: ''
    };
  },
  methods: {
    setNumberTransform() {
      const numberItems = this.$refs.numberItem // 拿到数字的ref，计算元素数量
      const numberArr = this.orderNum.filter(item => !isNaN(item))
      // 结合CSS 对数字字符进行滚动,显示订单数量
      for (let index = 0; index < numberItems.length; index++) {
        const elem = numberItems[index]
        elem.style.transform = `translate(-50%, -${numberArr[index] * 10}%)`
      }
    },
    // 处理总订单数字
    toOrderNum(num) {
      num = num.toString()
      // 把订单数变成字符串
      if (num.length < 8) {
        num = '0' + num // 如未满八位数，添加"0"补位
        this.toOrderNum(num) // 递归添加"0"补位
      } else if (num.length === 8) {
        // 订单数中加入逗号
        num = num.slice(0, 2) + ',' + num.slice(2, 5) + ',' + num.slice(5, 8)
        this.orderNum = num.split('') // 将其便变成数据，渲染至滚动数组
      } else {
        // 订单总量数字超过 八位显示异常
        this.$message.warning('订单总量数字过大，显示异常，请联系客服')
      }
    },
    get() {
      let that = this;
      this.statisticType = new Date().getFullYear();
      let month = new Date().getMonth() + 1;
      queryOrderStatisticGroupMonth(this.statisticType).then(response => {
        response.data.forEach(element => {
          if (element.monthly == month) {
            //商城销售额
            this.$nextTick(() => {
             this.toOrderNum(element.monthlySalesTotalAmount.toFixed(0)) // 这里输入数字即可调用
              //this.toOrderNum(10000) // 这里输入数字即可调用
              this.setNumberTransform()

            })
          }

        });

      });
    }
  },
  mounted() {
    this.get();
    this.$nextTick(() => {
      // this.toOrderNum() // 这里输入数字即可调用
      // this.setNumberTransform()
    })
  },
};
</script>

<style scoped>
.chartNum {
  text-align: -webkit-center;
  justify-content: center;
  align-items: center;
  height: 250px;
  display: flex;
}

.titleStyle {
  color: #F0933F;
  margin: 0 15px;
}

.box-item {
  position: relative;
  font-size: 54px;
  line-height: 41px;
  text-align: center;
  list-style: none;
  color: #2D7CFF;
  writing-mode: vertical-lr;
  text-orientation: upright;
  /*文字禁止编辑*/
  -moz-user-select: none;
  /*火狐*/
  -webkit-user-select: none;
  /*webkit浏览器*/
  -ms-user-select: none;
  /*IE10*/
  -khtml-user-select: none;
  /*早期浏览器*/
  user-select: none;
  /* overflow: hidden; */
}

/* 默认逗号设置 */
.mark-item {
  width: 10px;
  height: 100px;
  margin-right: 5px;
  line-height: 10px;
  font-size: 48px;
  position: relative;
}

.mark-item span {
  position: absolute;
  width: 100%;
  bottom: 0;
  color: #F0933F;
  writing-mode: vertical-rl;
  text-orientation: upright;
}

/*滚动数字设置*/
.number-item {
  width: 70px;
  height: 90px;
  background: #041F62;
  list-style: none;
  margin-right: 5px;
  border-radius: 4px;
  /* border: 1px solid rgba(221, 221, 221, 1); */

}

.number-item span {
  position: relative;
  display: inline-block;
  margin-right: 10px;
  width: 100%;
  height: 100%;
  writing-mode: vertical-rl;
  text-orientation: upright;
  overflow: hidden;

}

.number-item span i {
  color: #F0933F;
  font-style: normal;
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translate(-50%, 0);
  transition: transform 1s ease-in-out;
  letter-spacing: 10px;
}

.number-item:last-child {
  margin-right: 0;
}
</style>
