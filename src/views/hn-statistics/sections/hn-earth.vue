<template>
  <div class="container">
    <div class="name-section">
      <span class="earth-name">海南省</span>
    </div>
    <div class="earth-party" id="hn-earth">
      地图
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    //取得json的样式，读取json文件
    this.$.getJSON('/static/echarts-map-json/geometryProvince/46.json', '', data => {
      //生成地图
      this.createMap(data)
    })
  },
  methods: {
    createMap(data) {
      this.$echarts.registerMap('hainan', data)
      const myecharts = this.$echarts.init(document.getElementById('hn-earth'))
      let option = {
        visualMap: {
          show: true,
          min: 0, // 指定 visualMapContinuous 组件的允许的最小值。'min' 必须用户指定。[visualMap.min, visualMax.max] 形成了视觉映射的『定义域』。
          max: 1000, // 指定 visualMapContinuous 组件的允许的最大值
          text: ['高', '低'], // 两端的文本，如 ['High', 'Low'] 如例子：http://www.echartsjs.com/gallery/editor.html?c=doc-example/map-visualMap-continuous-text&edit=1&reset=1
          textStyle: {
            color: '#fff'
          },
          realtime: false, // 拖拽时，是否实时更新。
          calculable: false, // 是否显示拖拽用的手柄（手柄能拖拽调整选中范围）。
          hoverLink: false, // 打开 hoverLink 功能时，鼠标悬浮到 visualMap 组件上时，鼠标位置对应的数值 在 图表中对应的图形元素，会高亮。
          inRange: {
            // inRange (object)定义 在选中范围中 的视觉元素。（用户可以和 visualMap 组件交互，用鼠标或触摸选择范围）
            // 1、symbol: 图元的图形类别。2、symbolSize: 图元的大小。3、color: 图元的颜色。4、colorAlpha: 图元的颜色的透明度。5、opacity: 图元以及其附属物（如文字标签）的透明度。6、
            color: ['#004098', '#0494e1']
          }
        },
        geo: {
          map: 'hainan',
          roam: false,
          aspectScale: 0.75,
          zoom: 1.2,
          label: {
            normal: {
              show: true,
              textStyle: {
                color: '#ddd'
              }
            },
            emphasis: {
              // 对应的鼠标悬浮效果
              show: false,
              textStyle: {
                color: '#fff'
              }
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#0083ce',
              borderColor: '#0066ba'
            },
            emphasis: {
              borderWidth: 0,
              borderColor: '#0066ba',
              areaColor: '#0494e1',
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        series: [
          {
            type: 'map',
            roam: true,
            coordinateSystem: 'geo',
            geoIndex: 0,
            aspectScale: 0.75,
            zoom: 1.2,
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: false
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#F06C00'
              }
            },
            data: [
              // value可以对应的相应的颜色区域值
            ]
          }
        ]
      }
      myecharts.setOption(option)
    },
    resize() {
      const myecharts = document.getElementById('hn-earth')
      window.addEventListener('resize', function() {
        myecharts.resize()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  display: flex;
  .name-section {
    padding-top: 15px;
    width: 50px;
    .earth-name {
      display: block;
      position: relative;
      color: #fff;
      text-indent: 8px;
      &::before {
        display: inline-block;
        content: '';
        position: absolute;
        height: 100%;
        width: 2px;
        background: rgb(159, 255, 255);
        left: 0px;
      }
    }
  }
  .earth-party {
    flex: 1;
  }
}
</style>
