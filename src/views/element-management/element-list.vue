<template>
  <div class="container">
    <div class="conditions">
      <el-form :inline="true" :model="conditions" size="small">
        <el-form-item>
          <el-input v-model.trim="conditions.eleName" placeholder="请输入元素名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card>
      <el-table :data="list" stripe style="width: 100%" border v-loading="loading">
        <el-table-column prop="elementName" label="元素名称"> </el-table-column>
        <el-table-column prop="componentType" label="元素类型" width="120">
          <template slot-scope="scope">
            {{ scope.row.componentType | typeTransform }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleOper(scope.row, 1)">查看</el-link>
            <el-link type="primary" @click="handleOper(scope.row, 2)">编辑</el-link>
            <el-link type="danger" @click="handleDel(scope.row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background layout="total,prev, pager, next" :total="pageObj.total" :current-page.sync="pageObj.page"> </el-pagination>
      </div>
    </el-card>
    <div v-if="dialogDetailVisible">
      <el-dialog :title="title" :visible.sync="dialogDetailVisible" width="1200px">
        <ele-dialog :currentData="currentData" :operateType="operateType" @updata="updata"></ele-dialog>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { elementList, updataElement, delElement } from '@/api/element/element'
import EleDialog from './ele-dialog'
const typeMap = [{ label: '文字框', value: 0 }, { label: '数字框', value: 4 }, { label: '单选框', value: 6 }, { label: '复选框', value: 7 }, { label: '下拉框', value: 8 }]
export default {
  name: 'ElementList',
  components: { EleDialog },
  data() {
    return {
      conditions: {
        eleName: ''
      },
      loading: false,
      dialogDetailVisible: false,
      currentData: {},
      list: [],
      pageObj: {
        page: 1,
        size: 10,
        total: 0
      },
      /* 1查看，2编辑 */
      operateType: 1,
      title: '元素详情'
    }
  },
  filters: {
    typeTransform(type) {
      if (isNaN(type)) {
        return ''
      }
      const current = typeMap.find(item => type === item.value)
      return current ? current.label : ''
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
      const params = { tableName: this.conditions.eleName, ...this.pageObj }
      delete params.total
      this.loading = true
      elementList(params).then(
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
    handleOper($event, type) {
      this.title = type === 1 ? '元素详情' : '元素编辑'
      this.operateType = type
      this.currentData = $event
      this.dialogDetailVisible = true
    },
    handleDetail($event) {},
    handleDel($event) {
      this.$confirm('确认删除该元素？', {
        type: 'warning'
      })
        .then(_ => {
          delElement({ surveyCode: $event.elementCode }).then(
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
    },
    updata() {
      this.dialogDetailVisible = false
    }
  }
}
</script>
