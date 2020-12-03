<template>
  <div class="container">
    <div class="list-box">
      <el-card class="form-list">
        <div class="conditions" slot="header">
          <el-form :inline="true" :model="conditions" size="small">
            <el-form-item>
              <el-input v-model.trim="conditions.tableName" placeholder="请输入表单名称" clearable size="mini"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table :data="pageList" highlight-current-row @current-change="handleSelectForm" style="width: 100%" v-loading="loading" border>
          <el-table-column prop="surveyName" label="表单名称"> </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-link type="primary" @click="handlePreview(scope.row)">预览</el-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination background layout="total,prev, pager, next" :page-size="5" :total="pageObj.total" :current-page.sync="pageObj.page"> </el-pagination>
        </div>
      </el-card>
      <el-card class="fill-list">
        <div slot="header">
          <el-form class="clearfix" :inline="true">
            <el-form-item class="select-word" label="统计项">
              <el-select v-model="word" placeholder="请选择统计项" size="mini" :disabled="getWords">
                <el-option :label="ele.elementName" :value="ele.elementCode" v-for="ele in elements" :key="ele.elementCode"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <el-table :data="fillList" @selection-change="selectFill" style="width: 100%" v-loading="loading1" border>
          <el-table-column type="selection" width="55" v-if="fillList.length > 0"> </el-table-column>
          <el-table-column prop="planName" label="计划名称"> </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-divider content-position="left">统计结果</el-divider>
    <!-- 查看详情弹框 -->
    <div v-if="previewVisible">
      <el-dialog title="表单预览" :visible.sync="previewVisible" width="1200px">
        <page-detail :currentData="currentData"></page-detail>
      </el-dialog>
    </div>
    <!-- 统计结果 -->
    <div>
      <div v-if="staticsticRes">
        <statisticsChart :plan="staticsticPlan"></statisticsChart>
      </div>
      <template v-else>
        <empty-temp></empty-temp>
      </template>
    </div>
  </div>
</template>
<script>
import { getFormList, getForm } from '@/api/system/formManagement'
import { getFills } from '@/api/hn-statistics/hn-statistics'
import { formBase } from '@/views/form-management/form-base'
import { deepClone, deepAssign } from '@/common/js/tool'
import PageDetail from './pape-detail'
import statisticsChart from './word-statistics-chart/index'
export default {
  components: { PageDetail, statisticsChart },
  data() {
    return {
      conditions: {
        tableName: ''
      },
      loading: false,
      previewVisible: false,
      currentData: {},
      pageList: [],
      pageObj: {
        page: 1,
        size: 5,
        total: 0
      },
      /* 直报列表 */
      loading1: false,
      fillList: [],
      getWords: true,
      selectFills: [],
      elements: [],
      word: '',
      wordDialogVisible: false,
      // 传入参数
      staticsticPlan: {
        elementCode: '',
        planCodeList: [],
        planNames: []
      }
    }
  },
  computed: {
    staticsticRes() {
      return this.staticsticPlan.planNames.length > 0 && this.staticsticPlan.elementCode ? true : false
    }
  },
  watch: {
    /* 翻页 */
    'pageObj.page': function() {
      this.getList()
      this.fillList = []
    },
    selectFills(val) {
      this.getWords = val.length > 0 ? false : true
      this.selectdWordEnter()
    },
    word() {
      this.selectdWordEnter()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      /* 获取二级列表 */
      const params = { level: 2, tableName: this.conditions.tableName, ...this.pageObj }
      this.loading = true
      getFormList(params).then(
        res => {
          this.pageObj.total = res.data.total
          this.pageList = res.data.content
          this.loading = false
        },
        error => {
          this.loading = false
          this.$messge.error(`获取列表失败${error}`)
        }
      )
    },
    /* 选中表单 */
    handleSelectForm($event) {
      /* 置空 */
      this.selectFills = []
      this.setInitStaticsticPlan()
      /* $event未null时说明是分页切换 */
      if (!$event) {
        return
      }
      this.currentData = $event
      this.loading1 = true
      getFills({
        surveyCode: $event.code
      }).then(res => {
        if (res.code === 0) {
          this.fillList = res.data
        }
        this.loading1 = false
      })
      this.word = ''
      this.words()
    },
    /* 预览 */
    handlePreview($event) {
      /* $event未null时说明是分页切换 */
      if (!$event) {
        this.previewVisible = false
        return
      }
      this.previewVisible = false
      this.loading1 = true
      this.currentData = $event
      getFills({
        surveyCode: $event.code
      }).then(res => {
        if (res.code === 0) {
          this.fillList = res.data
        }
        this.loading1 = false
        this.previewVisible = true
      })
    },
    onSubmit() {
      this.getList()
    },
    selectFill(val) {
      this.selectFills = val
    },
    /* 当前表单中能统计的项过滤 */
    words() {
      const param = {
        surveyCode: this.currentData.code
      }
      getForm(param).then(res => {
        this.elements = []
        res.data.data.basicTableVOList.forEach(form => {
          form.basicModuleVOList.forEach(mudel => {
            mudel.basicElementVOList.forEach(ele => {
              if (ele.dataType === 0) {
                this.elements.push(ele)
              }
            })
          })
        })
      })
    },
    /* 选择统计字段 */
    selectdWordEnter() {
      if (!this.word) {
        return
      }
      const plan = this.selectFills.reduce(
        (cacl, current) => {
          cacl.code.push(current.planCode)
          cacl.name.push(current.planName)
          return cacl
        },
        { code: [], name: [] }
      )
      this.staticsticPlan.elementCode = this.word
      this.$set(this.staticsticPlan, 'planCodeList', plan.code)
      this.$set(this.staticsticPlan, 'planNames', plan.name)
    },
    setInitStaticsticPlan() {
      this.staticsticPlan.elementCode = ''
      this.$set(this.staticsticPlan, 'planCodeList', [])
      this.$set(this.staticsticPlan, 'planNames', [])
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  margin-top: 10px;
}
.select-word {
  float: right;
}
.list-box {
  display: flex;
  .el-card {
    min-height: 310px;
  }
  >>> .el-card__body {
    padding: 8px;
  }
  >>> .el-card__header {
    padding: 8px;
  }
  >>> .el-form-item {
    margin-bottom: 0;
  }
  >>> .el-table {
    td {
      padding: 5px 0;
      cursor: pointer;
    }
  }
  .form-list {
    flex: 1;
    margin-right: 10px;
  }
  .fill-list {
    flex: 1;
  }
}
</style>
