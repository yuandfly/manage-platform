<template>
  <div class="no-audit">
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
        <el-table-column prop="planName" label="直报名称"> </el-table-column>
        <el-table-column prop="createuser" label="创建人" width="120"> </el-table-column>
        <el-table-column prop="createtime" label="创建时间" width="120">
          <template slot-scope="scope">
            {{ scope.row.createtime | timeFormat('yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleEdit(scope.row)">查看</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background layout="total,prev, pager, next" :total="pageObj.total" :current-page.sync="pageObj.page"> </el-pagination>
      </div>
      <!-- 查看详情弹框 -->
      <el-dialog title="直报详情" :visible.sync="dialogDetailVisible" class="fill-detail" fullscreen>
        <fill-detail :currentFill="currentFill" v-if="dialogDetailVisible"></fill-detail>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import { getPlanList } from '@/api/system/fill-management'
import FillDetail from './detail'
export default {
  name: 'PublishFill',
  components: {
    FillDetail
  },
  data() {
    return {
      conditions: {
        tableName: ''
      },
      dialogDetailVisible: false,
      currentFill: {},
      pageObj: {
        page: 1,
        size: 10,
        total: 0
      },
      tableData: []
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
      const params = {
        page: this.pageObj.page,
        size: this.pageObj.size,
        plianCode: this.conditions.tableName
      }
      getPlanList(params).then(
        res => {
          this.pageObj.total = res.data.total
          this.tableData = res.data.content
        },
        error => {
          throw `获取填报计划列表失败${error}`
        }
      )
    },
    handleEdit($event) {
      this.currentFill = $event
      this.dialogDetailVisible = true
    },
    onSubmit() {
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
.no-audit {
  margin: 15px 5px 0;
}
</style>
