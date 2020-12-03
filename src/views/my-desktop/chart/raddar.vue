<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 3000

export default {
  name: 'Radder',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    infoData: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart({ lengend, xAxis, series } = this.infoData) {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        color: ['#409eff'],
        title: {
          // text: '填报姓名统计',
          textStyle: {
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          top: -10,
          right: 20,
          feature: {
            saveAsImage: {
              pixelRatio: 1,
              backgroundColor: 'auto',
              title: '保存为图片'
            }
          }
        },
        radar: {
          radius: '66%',
          center: ['50%', '50%'],
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: 'rgba(127,95,132,.3)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: [
            { name: xAxis[0], max: 10 },
            { name: xAxis[1], max: 10 },
            { name: xAxis[2], max: 10 }
            // { name: 'Customer Support', max: 20000 },
            // { name: 'Development', max: 20000 },
            // { name: 'Marketing', max: 20000 }
          ]
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: [lengend]
        },
        series: [
          {
            type: 'radar',
            symbolSize: 0,
            areaStyle: {
              normal: {
                shadowBlur: 13,
                shadowColor: 'rgba(0,0,0,.2)',
                shadowOffsetX: 0,
                shadowOffsetY: 10,
                opacity: 1
              }
            },
            data: [
              {
                value: series,
                name: lengend
              }
              // {
              //   value: [4000, 9000, 15000, 15000, 13000, 11000],
              //   name: 'Expected Spending'
              // },
              // {
              //   value: [5500, 11000, 12000, 15000, 12000, 12000],
              //   name: 'Actual Spending'
              // }
            ],

            animationDuration: animationDuration,
            animationEasing: 'cubicInOut'
          }
        ]
      })
    }
  }
}
</script>
