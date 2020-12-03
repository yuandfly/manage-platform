<template>
  <div>
    <div class="conditions">
      <el-form :inline="true" :model="conditions" size="small">
        <el-form-item>
          <el-input v-model.trim="conditions.tableName" placeholder="请输入直报名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card class="box-card">
      <el-table :data="list" stripe style="width: 100%" border>
        <el-table-column prop="planName" label="直报名称"> </el-table-column>
        <el-table-column prop="unitUsername" label="填写人" width="120"> </el-table-column>
        <el-table-column prop="updatetime" label="填写时间" width="120">
          <template slot-scope="scope">
            {{ scope.row.updatetime | timeFormat('yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <!-- <el-tooltip class="item" effect="dark" content="查看详情" placement="top"> -->
            <el-link type="primary" @click="handleDetail(scope.row)">查看</el-link>
            <!-- </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background layout="total,prev, pager, next" :total="total" :current-page.sync="page"> </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getNoAuditList } from '@/api/approve/approve'
export default {
  name: 'NoAudit',
  watch: {
    total(val) {
      this.$emit('getTotal', { componentName: 'NoAudit', total: val })
    }
  },
  data() {
    return {
      conditions: {
        tableName: ''
      },
      page: 1,
      size: 10,
      total: null,
      list: []
    }
  },
  watch: {
    /* 翻页 */
    page: function() {
      this.getList()
    }
  },
  created() {
    /* 获取待审核列表 */
    this.getList()
  },
  methods: {
    getList() {
      getNoAuditList({
        page: this.page,
        size: this.size,
        unitName: this.conditions.tableName
      }).then(res => {
        const { data } = res
        this.total = data.total
        this.list = data.content
      })
    },
    handleDetail(rowInfo) {
      /* 将planCode和surveyCode通过url传给详情页 */
      this.$router.push({
        path: '/home/audit/to-audit/detail',
        query: { surveyCode: rowInfo.surveyCode, planCode: rowInfo.planCode, surveyName: rowInfo.surveyName, code: rowInfo.unitCode, userName: rowInfo.unitUsername }
      })
    },
    onSubmit() {
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
