<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      myChart: null
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      let option = {
        color: ['#69A9B4'],
        grid: {
          show: false,
          left: '50px',
          right: '20px',
          top: '20px',
          bottom: '40px',
          width: 'auto',
          height: 'auto'
        },
        xAxis: {
          type: 'category',
          data: [
            '海口市',
            '三亚市',
            '三沙市',
            '儋州市',
            '五指山市',
            '琼海市',
            '文昌市',
            '万宁市',
            '东方市',
            '定安县',
            '屯昌县',
            '澄迈县',
            '高陵县',
            '白沙县',
            '昌江县',
            '乐东县',
            '陵水县',
            '保亭县',
            '琼中县'
          ],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            rotate: 30,
            textStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130, 120, 200, 150, 80, 70, 110, 130, 120, 200, 150, 80, 70],
            type: 'bar',
            barMaxWidth: 20,
            itemStyle: {
              barBorderRadius: 5
            }
          }
        ]
      }
      /* 设置图标根元素 */
      this.myChart = this.$echarts.init(this.$el)
      /* 设置配置项 */
      this.myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  height: 100%;
}
</style>
