<template>
  <div class="chart-card">
    <el-switch v-model="combined" active-text="单项显示" inactive-text="合并显示"> </el-switch>
    <div id="bar" :class="className" :style="{ height: height, width: width }" />
  </div>
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
      type: Object
    },
    className: {
      default: 'chart'
    },
    width: {
      default: '100%'
    },
    height: {
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      combined: true,
      loading: false,
      planNames: [],
      options: {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  watch: {
    combined() {
      this.setOption()
      this.chart.setOption(this.options, true)
    },
    infoData: {
      handler() {
        this.setOption()
        this.chart.setOption(this.options, true)
      },
      deep: true
    }
  },
  methods: {
    setOption({ xTitle, xAxis, seriesData, combinedValue } = this.infoData) {
      const series = Object.keys(seriesData).map((key, i) => {
        return {
          name: this.planNames[i],
          type: 'bar',
          barWidth: '10%',
          data: seriesData[key],
          animationDuration,
          barMaxWidth: 20,
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          }
        }
      })
      const combinedValueDate = {
        name: '总计',
        type: 'bar',
        //stack: 'vistors', //堆叠
        barWidth: '10%',
        data: combinedValue,
        animationDuration,
        barMaxWidth: 20,
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        }
      }
      this.options = {
        color: ['#409EFF', '#67C23A', '#E6A23C'],
        title: {
          text: `${xTitle}值`,
          textStyle: {
            fontSize: 14,
            color: '#409EFF'
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
        legend: {
          data: [this.planNames],
          marginBottom: 10
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 50,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xAxis,
            axisLine: {
              lineStyle: {
                color: '#409EFF'
              }
            },
            // axisTick: {
            //   alignWithLabel: false
            // }
            axisLabel: {
              rotate: 45
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#409EFF'
              }
            },
            axisTick: {
              show: true
            }
          }
        ],
        series: this.combined ? series : combinedValueDate
      }
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('bar'), 'macarons')
      this.setOption()
      this.chart.setOption(this.options, true)
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }
}
</script>
<style lang="scss" scoped>
.chart {
  margin-top: 8px;
}
</style>
