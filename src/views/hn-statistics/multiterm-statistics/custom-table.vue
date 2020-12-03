<template>
  <div class="page-container">
    <div class="back">
      <el-button icon="el-icon-back" type="primary" size="mini" @click="back">返回</el-button>
    </div>
    <el-card v-loading="loading">
      <template slot="header">
        <div class="table-head">
          <div class="table-title">
            {{ tableTitle }}
          </div>
          <el-button calss="export-btn" icon="el-icon-download" size="mini" @click="exportXLS">导出</el-button>
        </div>
      </template>
      <el-table class="custom-table" :data="tableData" stripe style="width: 100%" border>
        <el-table-column label="填报单位名称">
          <template slot-scope="scope">
            {{ unitName[scope.row.index] }}
          </template>
        </el-table-column>
        <template v-for="(col, i) in tableLabel">
          <el-table-column :prop="col.id" :label="col.fieldName" :key="i"> </el-table-column>
        </template>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getTableDataById } from '@/api/hn-statistics/create-table'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  data() {
    return {
      tableId: '',
      loading: false,
      tableTitle: '',
      unitName: [],
      tableLabel: [],
      tableData: []
    }
  },
  created() {
    this.tableId = this.$route.query.id
    this.getData()
  },
  methods: {
    getData() {
      if (!this.tableId) {
        this.$message.error('获取id失败')
        return
      }
      this.loading = true
      getTableDataById({ id: this.tableId }).then(
        res => {
          const { statisticalTableName, statisticalDataVOList, fieldList } = res.data
          this.tableTitle = res.data.statisticalTableName
          this.tableLabel = fieldList
          this.tableData = statisticalDataVOList.map((item, index) => {
            this.unitName.push(item.unitName)
            const col = {}
            item.valueList.forEach((val, i) => {
              const key = fieldList[i].id
              col[key] = val
            })
            col['index'] = index
            return col
          })
          this.loading = false
        },
        error => {
          this.$message.error(`获取数据失败${error}`)
          this.loading = false
        }
      )
    },
    back() {
      this.$router.back(-1)
    },
    exportXLS() {
      const name = this.tableTitle
      let wb = XLSX.utils.table_to_book(document.querySelector('.custom-table'))
      let wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        //  name+'.xlsx'表示导出的excel表格名字
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), name + '.xlsx')
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    }
  }
}
</script>

<style lang="scss" scoped>
.table-head {
  display: flex;
  .table-title {
    flex: 1;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 5px;
  }
  .export-btn {
    width: 200px;
  }
}

.back {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}
</style>
