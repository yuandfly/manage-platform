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
        <el-table-column prop="planName" label="直报名称"> </el-table-column>
        <!-- <el-table-column prop="startTime" label="填报起始时间" width="200"> </el-table-column>
        <el-table-column prop="endTime" label="填报终止时间" width="200"> </el-table-column> -->
        <el-table-column prop="createuser" label="创建人" width="120"> </el-table-column>
        <!-- <el-table-column prop="createtime" label="创建时间" width="200"> </el-table-column> -->
        <el-table-column prop="remark" label="备注" width="120"> </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="primary" @click="handleEdit(scope.row)">查看计划详情</el-button> -->
            <el-link type="primary" @click="handleEdit(scope.row, 1)">通过列表</el-link>
            <el-link @click="handleEdit(scope.row, 0)">驳回列表</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background layout="total,prev, pager, next" :total="pageObj.total" :current-page.sync="pageObj.page"> </el-pagination>
      </div>
      <!-- 查看计划弹框 -->
      <!-- <el-dialog title="填报计划详情" :visible.sync="planDetailVisible" class="fill-detail">
        <state-list :sateObj="sateObj"></state-list>
      </el-dialog> -->
      <!-- 查看审核状态弹框 -->
      <!-- <el-dialog title="填报计划详情" :visible.sync="auditStateVisible" class="fill-detail">
        <state-list :stateType="stateType"></state-list>
      </el-dialog> -->
    </el-card>
  </div>
</template>
<script>
import { getPlanList } from '@/api/system/fill-management'
import StateList from './state-list'
export default {
  name: 'AuditSate',
  components: { StateList },
  data() {
    return {
      conditions: {
        tableName: ''
      },
      planDetailVisible: false,
      auditStateVisible: false,
      pageObj: {
        page: 1,
        size: 10,
        total: 0
      },
      tableData: [],
      stateType: ''
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
    handleEdit(row, type) {
      /* type---0 驳回，1通过,如果是驳回在planCode前加'_' */
      this.stateType = type === 0 ? '_' + row.planCode : row.planCode
      this.$router.push(`/home/audit/audit-state/${this.stateType}`)
    },
    onSubmit() {
      this.getList()
    }
  }
}
</script>
