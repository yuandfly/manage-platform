<template>
  <div class="chart-card" v-loading="loading">
    <div class="mode">
      <span class="label">显示方式</span>
      <el-select v-model="mode" placeholder="请选择显示方式" size="mini">
        <el-option label="柱状图" value="bar"></el-option>
        <el-option label="环状图" value="pie"></el-option>
        <!-- <el-option label="线性图" value="line"></el-option> -->
        <el-option label="雷达图" value="raddar"></el-option>
      </el-select>
      <span class="label">统计项</span>
      <el-select v-model="wordValue" value-key="elementCode" placeholder="请选择统计项" @change="wordChange($event)" size="mini">
        <el-option :label="word.elementName" :value="word" v-for="word in wordList" :key="word.elementCode"></el-option>
      </el-select>
    </div>
    <div v-if="!loading">
      <template v-if="isEmpty">
        <div v-if="mode === 'pie'">
          <pie :infoData="infoData"></pie>
        </div>
        <div v-if="mode === 'raddar'">
          <raddar :infoData="infoData"></raddar>
        </div>
        <div v-if="mode === 'line'">
          <line-chart :infoData="infoData"></line-chart>
        </div>
        <div v-if="mode === 'bar'">
          <bar :infoData="infoData"></bar>
        </div>
      </template>
      <template v-else>
        <empty-temp></empty-temp>
      </template>
    </div>
  </div>
</template>

<script>
import { getStatisticsList, getWords, getDetailsList } from '@/api/desktop/desktop'
import { getPlanList } from '@/api/system/fill-management'
import Bar from './bar'
import LineChart from './line'
import Pie from './pie'
import Raddar from './raddar'
export default {
  name: 'Chart',
  components: {
    Bar,
    LineChart,
    Pie,
    Raddar
  },
  data() {
    return {
      wordList: [],
      wordValue: null,
      mode: 'bar',
      loading: false,
      infoData: {
        lengend: '',
        xAxis: [],
        series: []
      }
    }
  },
  props: {
    planCode: {
      type: String
    }
  },
  computed: {
    isEmpty() {
      return this.infoData.series.length < 1 ? false : true
    }
  },
  created() {
    this.getField()
  },
  methods: {
    /* 获取字段 */
    getField() {
      const param = {
        planCode: this.planCode
      }
      getWords(param).then(res => {
        /* 过滤出数字类型的字段dataType:0 */
        this.wordList = res.data.filter(item => item.dataType === 0)
        if (!this.wordList.length) {
          return
        }
        this.wordValue = this.wordList[0]
        /* 默认展示第一个字段 */
        // this.getData(this.wordValue)
        this.getList(this.wordValue)
      })
    },
    wordChange() {
      this.getList(this.wordValue)
    },
    /* 中医药大学对不同值填报人数的统计 */
    getData(data) {
      this.loading = true
      /* 置空 */
      this.infoData = {
        lengend: '',
        xAxis: [],
        series: []
      }
      const params = {
        elementCode: data.elementCode,
        fieldName: data.elementName,
        fieldNameList: [],
        planCode: data.planCode
      }
      getStatisticsList(params).then(res => {
        const { itemizedResultsVOList, statisticalFields } = res.data
        this.infoData.lengend = statisticalFields
        if (itemizedResultsVOList.length > 0) {
          itemizedResultsVOList.forEach(item => {
            item.submitResult = item.submitResult === '' ? '未填' : item.submitResult
            this.infoData.xAxis.push(item.submitResult)
            this.infoData.series.push(item.numbers)
          })
        }
        this.loading = false
      })
    },
    /* 海南直报对不同填报人填写值得统计 */
    getList(data) {
      this.loading = true
      /* 置空 */
      this.infoData = {
        lengend: '',
        xAxis: [],
        series: []
      }
      const params = {
        elementCode: data.elementCode,
        fieldName: data.elementName,
        fieldNameList: [],
        planCode: data.planCode
      }
      getDetailsList(params).then(res => {
        if (res.data.length > 0) {
          this.infoData.lengend = this.wordValue.elementName
          res.data.forEach(item => {
            this.infoData.xAxis.push(item.detailedName)
            this.infoData.series.push(item.submitResult)
          })
        }
        this.loading = false
      })
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-top: 15px;
}
.mode {
  margin-bottom: 20px;
  font-size: 14px;
  color: #606266;
  .label:nth-of-type(2) {
    margin-left: 10px;
  }
}
</style>
