<template>
  <div id="chart" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  name: 'Pie',
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
      required: true
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
      const seriesData = xAxis.map((item, i) => {
        return { name: item, value: series[i] }
      })
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
            saveAsImage: {
              pixelRatio: 1,
              backgroundColor: 'auto',
              title: '保存为图片'
            }
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '-5',
          data: xAxis
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
            fontWeight: 'bold'
          }
        },
        series: [
          {
            name: lengend,
            type: 'pie',
            radius: ['50%', '70%'],
            data: seriesData,
            animationEasing: 'cubicInOut',
            animationDuration: 500
          }
        ]
      })
    }
  }
}
</script>
