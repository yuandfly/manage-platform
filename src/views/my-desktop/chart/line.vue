<template>
  <div :class="className" :style="{ height: height, width: width }"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  name: 'LineChart',
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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    infoData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      chartData: {
        expectedData: [820, 932, 901, 934, 1290, 1330, 1320],
        actualData: [800, 900, 1000, 1000, 1200, 1330, 1320]
      }
    }
  },
  watch: {
    infoData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
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
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.infoData)
    },
    setOptions({ lengend, xAxis, series }) {
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
        xAxis: {
          data: xAxis,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 30,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          // axisPointer: {
          //   type: 'cross'
          // },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: [lengend]
        },
        series: [
          {
            name: '人数',
            itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: series,
            animationDuration: 1500,
            animationEasing: 'cubicInOut'
          }
          // {
          //   name: 'actual',
          //   smooth: true,
          //   type: 'line',
          //   itemStyle: {
          //     normal: {
          //       color: '#3888fa',
          //       lineStyle: {
          //         color: '#3888fa',
          //         width: 2
          //       },
          //       areaStyle: {
          //         color: '#f3f8ff'
          //       }
          //     }
          //   },
          //   data: actualData,
          //   animationDuration: 2800,
          //   animationEasing: 'quadraticOut'
          // }
        ]
      })
    }
  }
}
</script>
