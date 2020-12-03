<template>
  <div>
    <div class="page-container">
      <div class="conditions">
        <el-form :inline="true" :model="conditions" size="small">
          <el-form-item>
            <el-input v-model.trim="conditions.tableName" placeholder="请输入表格名称" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-card>
        <el-table :data="tableData" stripe style="width: 100%" border>
          <el-table-column prop="tableName" label="统计表格名称"> </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-link type="primary" @click="handleDetail(scope.row)">查看</el-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination background layout="total,prev, pager, next" :total="total" :current-page.sync="page"> </el-pagination>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getTableList } from '@/api/hn-statistics/create-table.js'
export default {
  data() {
    return {
      conditions: {
        tableName: ''
      },
      tableData: [],
      page: 1,
      size: 10,
      total: 0
    }
  },
  watch: {
    page() {
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const params = {
        page: this.page,
        size: this.size,
        tableName: this.conditions.tableName
      }
      getTableList(params).then(res => {
        this.total = res.data.total
        this.tableData = res.data.content
      })
    },
    handleDetail(row) {
      this.$router.push({
        path: '/hn-statistics/custom-table',
        query: { id: row.id }
      })
    },
    onSubmit() {
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  margin-top: 15px;
}
</style>
