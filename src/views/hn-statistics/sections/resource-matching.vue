<template>
  <div class="container">
    <div class="tabs">
      <div class="tab-item active">每千人人口拥有执业（助理）医师数</div>
      <div class="tab-item">每千人人口拥有注册护士数</div>
      <div class="tab-item">每千人人口拥有床位师数</div>
    </div>
    <div id="resource"></div>
  </div>
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
          left: '60px',
          right: '40px',
          top: '20px',
          width: 'auto',
          height: 'auto'
        },
        yAxis: [
          {
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
              textStyle: {
                color: '#fff'
              }
            }
          },
          {
            type: 'category',
            data: [120, 200, 150, 80, 70, 110, 130, 120, 200, 150, 80, 70, 110, 130, 120, 200, 150, 80, 70],
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
          }
        ],
        xAxis: {
          type: 'value',
          show: false,
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
            data: [120, 200, 150, 80, 70, 110, 130, 120, 200, 150, 80, 70, 110, 130, 120, 200, 150, 80, 70],
            type: 'bar',
            barMaxWidth: 10,
            itemStyle: {
              barBorderRadius: 5
            }
          }
        ]
      }
      /* 设置图标根元素 */
      this.myChart = this.$echarts.init(document.getElementById('resource'))
      /* 设置配置项 */
      this.myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  padding: 8px;
  // overflow: auto;
}
.tabs {
  display: flex;
  .tab-item {
    flex: 1;
    margin: 0 8px;
    padding: 5px;
    text-align: center;
    color: rgb(94, 105, 117);
    border: 1px solid rgb(159, 255, 255);
    border-radius: 4px;
    box-shadow: 0 0 5px 1px rgb(159, 255, 255);
    cursor: pointer;
  }
  .active {
    color: #fff;
  }
}
#resource {
  height: 100%;
}
</style>
