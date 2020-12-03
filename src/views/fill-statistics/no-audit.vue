<template>
  <div class="page-container">
    <div class="back">
      <el-button type="primary" icon="el-icon-back" size="mini" @click.stop="back">返回</el-button>
    </div>
    <el-card class="box-card">
      <el-table :data="list" stripe style="width: 100%" border>
        <el-table-column prop="planName" label="计划名称"> </el-table-column>
        <el-table-column prop="unitUsername" label="填写人" width="120"> </el-table-column>
        <!-- <el-table-column prop="updatetime" label="填写时间"> </el-table-column> -->
        <!-- <el-table-column prop="startTime" label="填报起始时间">
          <template slot-scope="scope">
            {{ scope.row.startTime | timeFormat('yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="填报结束时间">
          <template slot-scope="scope">
            {{ scope.row.endTime | timeFormat('yyyy-MM-dd') }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="remark" label="审核意见"> </el-table-column> -->
        <!-- <el-table-column label="状态" width="50">
          <template v-if="state === 3">
            <span class="table-state-success">通过</span>
          </template>
          <template v-else>
            <span class="table-state-error">驳回</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleDetail(scope.row)">审批处理</el-link>
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
import { getApproveList } from '@/api/approve/approve'
export default {
  name: 'NoAudit',
  data() {
    return {
      dialogDetailVisible: false,
      planCode: '',
      rowInfo: {},
      page: 1,
      size: 10,
      total: null,
      list: []
    }
  },
  watch: {
    page() {
      this.getList()
    }
  },
  created() {
    this.planCode = this.$route.query.planCode

    /* 获取待审核列表 */
    this.getList()
  },
  methods: {
    getList() {
      /* state 0未填 1草稿 2已填报待审核 3审核通过 4 审核未过  审核的状态码 */
      getApproveList({
        page: this.page,
        size: this.size,
        state: 2,
        plianCode: this.planCode
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
    back() {
      this.$router.back(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.back {
  text-align: right;
}
.box-card {
  margin-top: 15px;
}
</style>
