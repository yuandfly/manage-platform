<template>
  <div class="page-container">
    <div class="conditions">
      <el-form :inline="true" :model="conditions" size="small">
        <el-form-item>
          <el-input v-model.trim="conditions.tableName" placeholder="请输入单位名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-button type="primary" class="back" icon="el-icon-back" size="mini" @click.stop="back">返回</el-button>
      </el-form>
    </div>
    <el-card>
      <el-table :data="list" stripe style="width: 100%" border>
        <el-table-column prop="planName" label="计划名称"> </el-table-column>
        <el-table-column prop="unitName" label="单位名称" width="300"> </el-table-column>
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
        <el-dialog title="详情" :visible.sync="dialogDetailVisible" class="fill-detail" width="1200px">
          <no-fill-detail :currentFill="currentFill"></no-fill-detail>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getNoFillList } from '@/api/approve/approve'
import NoFillDetail from './no-fill-detail'
export default {
  name: 'NoFill',
  components: {
    NoFillDetail
  },
  data() {
    return {
      conditions: {
        tableName: ''
      },
      dialogDetailVisible: false,
      currentFill: {},
      planCode: '',
      unitName: '',
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
      getNoFillList({
        page: this.page,
        size: this.size,
        state: 0,
        plianCode: this.planCode,
        unitName: this.conditions.tableName
      }).then(res => {
        const { data } = res
        this.total = data.total
        this.list = data.content
      })
    },
    handleDetail(row) {
      this.currentFill = row
      this.dialogDetailVisible = true
    },
    back() {
      this.$router.back(-1)
    },
    onSubmit() {
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.back {
  float: right;
}
.box-card {
  margin-top: 15px;
}
</style>
