<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 2000

export default {
  name: 'Bar',
  mixins: [resize],
  props: {
    infoData: {
      type: Object,
      required: true
    },
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
        toolbox: {
          top: -10,
          right: 20,
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
            saveAsImage: {
              pixelRatio: 1,
              backgroundColor: 'auto',
              title: '保存为图片'
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 30,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xAxis,
            axisTick: {
              alignWithLabel: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: true
            }
          }
        ],
        series: [
          {
            name: lengend,
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: series,
            // animationDuration
            barMaxWidth: 40,
            itemStyle: { normal: { label: { show: true, position: 'top', textStyle: { color: '#000' } } } }
          }
          // {
          //   name: 'pageB',
          //   type: 'bar',
          //   stack: 'vistors',
          //   barWidth: '60%',
          //   data: [80, 52, 200, 334, 390, 330, 220],
          //   animationDuration
          // },
          // {
          //   name: 'pageC',
          //   type: 'bar',
          //   stack: 'vistors',
          //   barWidth: '60%',
          //   data: [30, 52, 200, 334, 390, 330, 220],
          //   animationDuration
          // }
        ]
      })
    }
  }
}
</script>
