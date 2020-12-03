<template>
  <div class="unit page-container">
    <div class="conditions">
      <el-form :inline="true" :model="conditions" size="small">
        <el-form-item>
          <el-input v-model.trim="conditions.unitName" placeholder="请输入单位名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card class="box-card">
      <div slot="header" style="overflow: hidden;">
        <span style="float:left;">单位管理</span>
        <span style="float:right;">
          <el-button type="primary" @click="updateShow">添加单位</el-button>
        </span>
      </div>
      <el-table :data="tableData" border style="width: 100%" stripe>
        <el-table-column prop="detailedName" label="单位名称"> </el-table-column>
        <el-table-column prop="organizationCode" label="组织机构代码" width="180"> </el-table-column>
        <el-table-column prop="unitAddress" label="单位地址"> </el-table-column>
        <!-- <el-table-column prop="parentId" label="上级单位ID" width="100"> </el-table-column> -->
        <!-- <el-table-column prop="createTime" label="创建时间" width="100"> </el-table-column> -->
        <el-table-column prop="operation" label="操作" width="100">
          <template slot-scope="scope">
            <el-link type="primary" @click.native.prevent="editUnit(scope.row)">
              编辑
            </el-link>
            <el-link type="danger" @click.native.prevent="delUnit(scope.row)">
              删除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right;padding: 10px;">
        <el-pagination background layout="total,prev, pager, next" :total="total" :current-page.sync="now_page" :page-size="limit"> </el-pagination>
      </div>
    </el-card>
    <dialog-unit :current_show.sync="show" :type="showType" :currentUnit="currentUnit"></dialog-unit>
  </div>
</template>

<script>
import DialogUnit from './components/dialog-unit'
import { getAllUnitsList, delUnits } from '@/api/system/units'

export default {
  name: 'ProjectUnit',
  components: { DialogUnit },
  data() {
    return {
      conditions: {
        unitName: ''
      },
      pLevel: ['', '省级', '市州', '基层'],
      show: false,
      showType: 1, // 1 添加单位  2 编辑单位
      currentUnit: {},
      confirm_show: false,
      limit: 10,
      total: 0,
      now_page: 1,
      tableData: []
    }
  },
  watch: {
    now_page() {
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    updateShow() {
      this.showType = 1
      this.show = true
    },
    getList() {
      const params = {
        page: this.now_page,
        size: this.limit,
        unitName: this.conditions.unitName
      }
      getAllUnitsList(params).then(
        res => {
          if (res.data.code === 0) {
            this.tableData = res.data.data.content
            this.total = res.data.data.total
          }
        },
        error => {
          this.$message.error(`添加失败${error}`)
        }
      )
    },
    editUnit(row) {
      this.showType = 2
      this.show = true
      this.currentUnit = row
    },
    delUnit(row) {
      this.$confirm(`确定删除【${row.detailedName}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delUnits({
            organizationCode: row.organizationCode
          }).then(res => {
            if (res.data.code === 0) {
              this.$message({
                message: `删除成功`,
                type: 'success'
              })
              this.page = 1
              this.getList()
            }
          })
        })
        .catch(err => {
          throw `删除单位失败${err}`
        })
    },
    onSubmit() {
      this.getList()
    }
  }
}
</script>
