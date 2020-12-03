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
        color: ['#0377C8'],
        grid: {
          show: false,
          left: '50px',
          right: '20px',
          top: '20px',
          bottom: '30px',
          width: 'auto',
          height: 'auto'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'],
          axisLabel: {
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
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130, 120, 200, 150, 180],
            type: 'line',
            smooth: true,
            areaStyle: {}
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
