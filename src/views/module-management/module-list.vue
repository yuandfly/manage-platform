<template>
  <div class="container">
    <div class="conditions">
      <el-form :inline="true" :model="conditions" size="small">
        <el-form-item>
          <el-input v-model.trim="conditions.moduleName" placeholder="请输入模块名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card>
      <el-table :data="list" stripe style="width: 100%" border v-loading="loading">
        <el-table-column prop="tableElementName" label="模块名称"> </el-table-column>
        <el-table-column prop="createtime" label="创建时间" width="120">
          <template slot-scope="scope">
            {{ scope.row.createtime | timeFormat('yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleDetail(scope.row)">查看</el-link>
            <el-link type="primary" @click="handleUpdate(scope.row)">编辑</el-link>
            <el-link type="danger" @click="handleDel(scope.row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background layout="total,prev, pager, next" :total="pageObj.total" :current-page.sync="pageObj.page"> </el-pagination>
      </div>
    </el-card>
    <div class="prview" v-if="dialogDetailVisible">
      <el-dialog title="模块详情" :visible.sync="dialogDetailVisible" width="1200px">
        <module-detail :module="currentData"></module-detail>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getModuleList, getModule, deleteModule } from '@/api/module/module'
import ModuleDetail from '@/components/dynamic-form/module'
export default {
  name: 'ModuleList',
  components: {
    ModuleDetail
  },
  data() {
    return {
      conditions: {
        moduleName: ''
      },
      loading: false,
      dialogDetailVisible: false,
      currentData: {},
      list: [],
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
      const params = { tableName: this.conditions.moduleName, ...this.pageObj }
      delete params.total
      this.loading = true
      getModuleList(params).then(
        res => {
          this.pageObj.total = res.data.total
          this.list = res.data.content
          this.loading = false
        },
        error => {
          this.loading = false
          this.$message.error(`获取元素列表失败${error}`)
        }
      )
    },
    handleUpdate($event) {
      this.$router.push({
        path: '/home/form/create-module',
        query: { type: 'edit', code: $event.tableElementCode }
      })
    },
    handleDetail($event) {
      const param = {
        surveyCode: $event.tableElementCode
      }
      getModule(param).then(
        res => {
          this.currentData = res.data
          this.dialogDetailVisible = true
        },
        error => {
          this.$message.error(`获取模块数据失败${error}`)
        }
      )
    },
    handleDel($event) {
      this.$confirm('确认删除该元素？', {
        type: 'warning'
      })
        .then(_ => {
          deleteModule({ surveyCode: $event.tableElementCode }).then(
            _ => {
              this.$message.success('删除成功！')
              this.getList()
            },
            error => {
              this.$message.error(`除异常${error}`)
            }
          )
        })
        .catch(_ => {})
    },
    onSubmit() {
      this.getList()
    }
  }
}
</script>
