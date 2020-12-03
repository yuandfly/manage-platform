<template>
  <div class="container">
    <div class="conditions">
      <el-form :inline="true" :model="conditions" size="small">
        <el-form-item>
          <el-input v-model.trim="conditions.tableName" placeholder="请输入表单名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card>
      <el-table :data="pageList" stripe style="width: 100%" border v-loading="loading">
        <el-table-column prop="surveyName" label="表单名称"> </el-table-column>
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
      <el-dialog title="填报计划详情" :visible.sync="dialogDetailVisible" fullscreen>
        <page-detail :currentData="currentData" v-if="dialogDetailVisible"></page-detail>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import { getFormList } from '@/api/system/formManagement'
import { formBase } from '../form-base'
import { deepClone, deepAssign } from '@/common/js/tool'
import PageDetail from './page-detail'
export default {
  name: 'FormList',
  components: { PageDetail },
  data() {
    return {
      conditions: {
        tableName: ''
      },
      loading: false,
      dialogDetailVisible: false,
      currentData: {},
      pageList: [],
      pageObj: {
        page: 1,
        size: 10,
        total: 0
      }
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
      /* 获取二级列表 */
      const params = { level: 2, tableName: this.conditions.tableName, ...this.pageObj }
      this.loading = true
      getFormList(params).then(
        res => {
          this.pageObj.total = res.data.total
          this.pageList = res.data.content
          this.loading = false
        },
        error => {
          this.loading = false
          this.$messge.error(`获取列表失败${error}`)
        }
      )
    },
    handleEdit($event) {
      this.currentData = $event
      this.dialogDetailVisible = true
    },
    onSubmit() {
      this.getList()
    }
  }
}
</script>
