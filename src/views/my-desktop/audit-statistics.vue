<template>
  <div class="container">
    <div class="conditions">
      <el-form :inline="true" :model="conditions" size="small">
        <el-form-item>
          <el-input v-model.trim="conditions.planName" placeholder="请输入直报名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card>
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column prop="planName" label="直报名称"> </el-table-column>
        <el-table-column prop="createtime" label="创建时间" width="120">
          <template slot-scope="scope">
            {{ scope.row.createtime | timeFormat('yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleEdit(scope.row, 'statictis')">统计</el-link>
            <el-link type="primary" @click="handleEdit(scope.row, 'detail')">详情</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background layout="total,prev, pager, next" :total="pageObj.total" :current-page.sync="pageObj.page"> </el-pagination>
      </div>
      <!-- 查看详情弹框 -->
      <el-dialog title="直报详情" :visible.sync="dialogDetailVisible" width="1200px">
        <fill-detail :currentFill="currentFill"></fill-detail>
      </el-dialog>
      <!-- 查看填报统计弹框 -->
      <el-dialog title="直报统计" :visible.sync="fillStatictisVisible" class="fill-detail">
        <chart :planCode="planCode" v-if="fillStatictisVisible"></chart>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getPlanList } from '@/api/desktop/desktop'
import FillDetail from '../fill-management/fill-publish/detail'
import Chart from './chart/index'
export default {
  name: 'AuditStatistics',
  components: {
    FillDetail,
    Chart
  },
  watch: {
    'pageObj.total'(val) {
      this.$emit('getTotal', { componentName: 'SendFill', total: val })
    }
  },
  data() {
    return {
      conditions: {
        planName: ''
      },
      dialogDetailVisible: false,
      fillStatictisVisible: false,
      currentFill: {},
      planCode: '',
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
        sise: this.pageObj.size,
        state: 0,
        plianCode: this.conditions.planName
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
    handleEdit($event, type) {
      if (type === 'detail') {
        this.currentFill = $event
        this.dialogDetailVisible = true
      } else if (type === 'statictis') {
        this.planCode = $event.planCode
        this.fillStatictisVisible = true
      }
    },
    onSubmit() {
      this.getList()
    }
  }
}
</script>
