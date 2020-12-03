<template>
  <div class="page-container">
    <div class="back">
      <el-button type="primary" icon="el-icon-back" size="mini" @click.stop="back">返回</el-button>
    </div>
    <el-card class="box-card">
      <el-table :data="list" stripe style="width: 100%" border>
        <el-table-column prop="planName" label="直报名称"> </el-table-column>
        <el-table-column prop="unitUsername" label="填写人" width="120"> </el-table-column>
        <el-table-column label="状态" width="50">
          <template v-if="state === 3">
            <span class="table-state-success">通过</span>
          </template>
          <template v-else>
            <span class="table-state-error">驳回</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleDetail(scope.row)">查看</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background layout="total,prev, pager, next" :total="total" :current-page.sync="page"> </el-pagination>
      </div>
      <!-- 查看详情弹框 -->
      <div v-if="dialogDetailVisible">
        <el-dialog title="详情" :visible.sync="dialogDetailVisible" width="1200px">
          <audit-detail :data="rowInfo" type="pass"></audit-detail>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import AuditDetail from '../audit-detail'
import { getApproveList } from '@/api/approve/approve'
export default {
  name: 'StateList',
  components: { AuditDetail },
  data() {
    return {
      dialogDetailVisible: false,
      state: null,
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
    /* 如果是驳回在前type有'_' */
    const { type } = this.$route.params
    if (!type) {
      return
    } else if (type.includes('_')) {
      this.state = 4
      this.planCode = type.slice(1)
    } else {
      this.state = 3
      this.planCode = type
    }
    /* 获取待审核列表 */
    this.getList()
  },
  methods: {
    getList() {
      /* state 0未填 1草稿 2已填报待审核 3审核通过 4 审核未过  审核的状态码 */
      getApproveList({
        page: this.page,
        size: this.size,
        state: this.state,
        plianCode: this.planCode
      }).then(res => {
        const { data } = res
        this.total = data.total
        this.list = data.content
      })
    },
    handleDetail(row) {
      this.rowInfo = row
      this.dialogDetailVisible = true
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
