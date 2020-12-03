<template>
  <div class="chart-card" v-loading="loading">
    <div v-if="!loading">
      <bar :infoData="infoData" :planNames="planNames"></bar>
    </div>
  </div>
</template>

<script>
import Bar from './bar'
import { getMultiPlanStatistics } from '@/api/hn-statistics/hn-statistics'
export default {
  components: {
    Bar
  },
  data() {
    return {
      loading: false,
      infoData: {
        lengend: '',
        xAxis: [],
        series: []
      },
      planNames: []
    }
  },
  props: {
    plan: {
      type: Object,
      default: {}
    }
  },
  created() {
    this.getData()
  },
  watch: {
    plan: {
      handler() {
        this.getData()
      },
      deep: true
    }
  },
  methods: {
    /* 获取字段对应的数据 */
    getData() {
      this.loading = true
      /* 置空 */
      this.infoData = {
        xTitle: '',
        xAxis: [],
        seriesData: {}, //多柱状图
        combinedValue: []
      }
      const { planNames, ...params } = this.plan
      this.planNames = planNames
      getMultiPlanStatistics([params]).then(res => {
        if (res.data.length < 1) {
          return
        }
        const xAxisData = []
        res.data.forEach(item => {
          this.infoData.xAxis.push(item.unitName)
          this.infoData.combinedValue.push(item.combinedValue)
          if (item.statisticsDetailsVOList[0] !== null && item.statisticsDetailsVOList[0] instanceof Object) {
            this.infoData.xTitle = item.statisticsDetailsVOList[0].elementName
          }
          xAxisData.push(item.submitValueList)
        })
        /* 计划个数产出多柱状图 */
        this.planNames.forEach((name, i) => {
          i = i.toString()
          this.infoData.seriesData[i] = []
        })
        /* 取不同填报人每个指定计划的值形成的数组 */
        xAxisData.forEach(item => {
          item.forEach((count, i) => {
            i = i.toString()
            this.infoData.seriesData[i].push(count)
          })
        })
        this.loading = false
      })
    }
  }
}
</script>
<style scoped lang="scss"></style>
