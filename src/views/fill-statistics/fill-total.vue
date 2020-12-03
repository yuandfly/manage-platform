<template>
  <div class="page-container">
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
    <el-card>
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column prop="planName" label="直报计划名称"> </el-table-column>
        <el-table-column prop="notFilledIn" label="未报数" width="80">
          <template slot-scope="scope">
            <el-link type="primary" @click="toSigleList('notFilledIn', scope.row)" :class="{ 'no-click': !scope.row.notFilledIn }">{{ scope.row.notFilledIn | null2zero }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="toBeReviewed " label="未审核" width="80">
          <template slot-scope="scope">
            <el-link type="warning" @click="toSigleList('toBeReviewed', scope.row)" :class="{ 'no-click': !scope.row.toBeReviewed }">{{ scope.row.toBeReviewed | null2zero }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="approved" label="审核通过" width="80">
          <template slot-scope="scope">
            <el-link type="success" @click="toSigleList('approved', scope.row)" :class="{ 'no-click': !scope.row.approved }">{{ scope.row.approved | null2zero }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="failed" label="驳回数" width="80">
          <template slot-scope="scope">
            <el-link type="danger" @click="toSigleList('failed', scope.row)" :class="{ 'no-click': !scope.row.failed }">{{ scope.row.failed | null2zero }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="releaseStatus" label="完成状态" width="80">
          <template slot-scope="scope">
            <span :class="scope.row.releaseStatus === 2 ? 'table-state-success' : 'table-state-warning'">
              {{ scope.row.releaseStatus === 2 ? '完成' : '未完' }}
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="total" label="直报总数" width="80">
          <template slot-scope="scope">
            {{ scope.row.total | null2zero }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="createuser" label="创建人" width="120"> </el-table-column> -->
        <el-table-column prop="createtime" label="创建时间" width="120">
          <template slot-scope="scope">
            {{ scope.row.createtime | timeFormat('yyyy-MM-dd') }}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background layout="total,prev, pager, next" :total="pageObj.total" :current-page.sync="pageObj.page"> </el-pagination>
      </div>
      <!-- 查看详情弹框 -->
      <div v-if="dialogDetailVisible">
        <el-dialog title="填报计划详情" :visible.sync="dialogDetailVisible" width="1200px">
          <fill-detail :currentFill="currentFill" v-if="dialogDetailVisible"></fill-detail>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
import PublishFill from '@/views/fill-management/fill-publish/index'
const pathMap = {
  notFilledIn: '/fill-statistics/no-fill',
  toBeReviewed: '/fill-statistics/no-audit',
  approved: '/home/audit/audit-state/',
  failed: '/home/audit/audit-state/'
}
export default {
  name: 'FillStateManage',
  extends: PublishFill,
  filters: {
    null2zero(val) {
      return val === null || '' ? 0 : val
    }
  },
  methods: {
    /* 跳转至单项列表 */
    toSigleList(item, row) {
      switch (item) {
        case 'notFilledIn':
          this.$router.push({
            path: pathMap['notFilledIn'],
            query: { planCode: row.planCode }
          })
          break
        case 'toBeReviewed':
          this.$router.push({
            path: pathMap['toBeReviewed'],
            query: { planCode: row.planCode }
          })
          break
        case 'approved':
          this.$router.push(pathMap['approved'] + row.planCode)
          break
        case 'failed':
          this.$router.push(pathMap['failed'] + '_' + row.planCode)
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.col-template {
  cursor: pointer;
}
.no-click {
  pointer-events: none;
  cursor: default;
  color: #bfbfbf;
}
</style>
