<template>
  <div class="container">
    <div class="card-box">
      <el-card class="ele-list">
        <template solt="header">
          <div class="conditions">
            <el-form :inline="true" :model="conditions" size="mini">
              <el-form-item>
                <el-input v-model.trim="conditions.eleName" placeholder="请输入元素名称" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
        </template>
        <el-table :data="list" style="width: 100%" border highlight-current-row @current-change="handleCurrentChange" v-loading="loading">
          <el-table-column prop="elementName" label="元素名称"> </el-table-column>
          <el-table-column prop="componentType" label="元素类型" width="120">
            <template slot-scope="scope">
              {{ scope.row.componentType | typeTransform }}
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination background layout="total,prev, pager, next" :total="pageObj.total" :current-page.sync="pageObj.page"> </el-pagination>
        </div>
      </el-card>
      <el-card class="ele-prev">
        <template slot="header">
          <div class="prev-title">元素信息预览</div>
        </template>
        <div class="previw-box" v-if="showData">
          <div class="prev-row">
            <div class="prev-item">
              <div class="ele-labal">元素名称:</div>
              <div class="ele-val">{{ currentEle.elementName }}</div>
            </div>
            <div class="prev-item">
              <div class="ele-labal">元素类型:</div>
              <div class="ele-val">{{ currentEle.componentType | typeTransform }}</div>
            </div>
          </div>
          <div class="prev-row">
            <div class="prev-item">
              <div class="ele-labal">缩进距离:</div>
              <div class="ele-val">{{ currentEle.indentValue | indentTransform }}</div>
            </div>
            <div class="prev-item">
              <div class="ele-labal">元素选项:</div>
              <div class="ele-val">{{ currentEle.dictionaryTableDOList | optoinsTransform }}</div>
            </div>
          </div>
        </div>
        <empty-temp v-else></empty-temp>
      </el-card>
    </div>
    <div class="operate-box"><el-button size="mini" @click="handleBtn('cancle')">取消</el-button><el-button type="primary" size="mini" @click="handleBtn('comfirm')">确认</el-button></div>
  </div>
</template>
<script>
import { elementList, updataElement, delElement } from '@/api/element/element'
const typeMap = [{ label: '文字框', value: 0 }, { label: '数字框', value: 4 }, { label: '单选框', value: 6 }, { label: '复选框', value: 7 }, { label: '下拉框', value: 8 }]
export default {
  data() {
    return {
      conditions: {
        eleName: ''
      },
      loading: false,
      dialogDetailVisible: false,
      list: [],
      pageObj: {
        page: 1,
        size: 10,
        total: 0
      },
      currentEle: {}
    }
  },
  computed: {
    showData() {
      return Object.keys(this.currentEle).length < 1 ? false : true
    }
  },
  filters: {
    typeTransform(type) {
      if (isNaN(type)) {
        return ''
      }
      const current = typeMap.find(item => type === item.value)
      return current ? current.label : ''
    },
    indentTransform(val) {
      const val_ = +val
      switch (val_) {
        case 10:
          return '一格距'
          break
        case 20:
          return '二格距'
          break
        case 30:
          return '三格距'
          break
        default:
          return '无缩进'
          break
      }
    },
    optoinsTransform(val) {
      if (!(val instanceof Array)) {
        return ''
      }
      const optionVal = val.map(item => item.configValue)
      return optionVal.join(',')
    }
  },
  watch: {
    /* 翻页 */
    'pageObj.page': function() {
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const params = { tableName: this.conditions.eleName, ...this.pageObj }
      delete params.total
      this.loading = true
      elementList(params).then(
        res => {
          this.pageObj.total = res.data.total
          this.list = res.data.content
          this.loading = false
        },
        error => {
          this.loading = false
          this.$messge.error(`获取列表失败${error}`)
        }
      )
    },
    onSubmit() {
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentEle = val
    },
    handleBtn(mode) {
      if (!(this.currentEle.dictionaryTableDOList instanceof Array)) {
        this.currentEle.dictionaryTableDOList = []
      }
      const data = this.currentEle
      this.$emit('selectEleEnter', { mode, data })
    }
  }
}
</script>
<style lang="scss" scoped>
.card-box {
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
  .ele-list {
    flex: 1;
    margin-right: 10px;
  }
  .ele-prev {
    flex: 1;
  }
}
.conditions {
  margin-bottom: 5px;
}
.prev-title {
  color: #303133;
  padding: 5px;
}
.previw-box {
  padding: 0 8px;
  .prev-row {
    display: flex;
    margin: 5px 0;
  }
  .prev-item {
    flex: 1;
    display: flex;
  }
  .ele-labal {
    color: #99a9bf;
  }
  .ele-val {
    padding-left: 8px;
  }
}
.operate-box {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
