<template>
  <div class="container">
    <div class="conditions">
      <el-form :inline="true" :model="conditions" size="mini">
        <el-form-item>
          <el-input v-model.trim="conditions.moduleName" placeholder="请输入模块名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" style="width: 100%" highlight-current-row border @current-change="currentChange" v-loading="loading">
      <el-table-column prop="tableElementName" label="模块名称"> </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-link type="primary" @click="handleDetail(scope.row)">查看</el-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box clearfix">
      <el-pagination background layout="total,prev, pager, next" :total="pageObj.total" :current-page.sync="pageObj.page"> </el-pagination>
    </div>
    <div class="input-order">
      <div class="order-label">
        元素起始编号
      </div>
      <el-input v-model.trim="startOrder" type="number" placeholder="请输入起始编号" size="mini"></el-input>
    </div>
    <div class="operate-box">
      <el-button size="mini" @click="handleBtn('cancle')">取消</el-button>
      <el-button type="primary" :disabled="enterDisable" size="mini" @click="handleBtn('comfirm')">确认</el-button>
    </div>
    <div class="prview" v-if="dialogDetailVisible">
      <el-dialog title="模块详情" :visible.sync="dialogDetailVisible" append-to-body width="1300px">
        <module-detail :module="currentData"></module-detail>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import ModuleList from '@/views/module-management/module-list'
import { getModuleList, getModule, deleteModule } from '@/api/module/module'
import ModuleDetail from '@/components/dynamic-form/module'
export default {
  extends: ModuleList,
  inject: ['parentForm'],
  data() {
    return {
      /* 当前行数据的ID */
      currentId: '',
      startOrder: 0
    }
  },
  computed: {
    enterDisable() {
      return !this.currentId
    }
  },
  created() {
    this.pageObj.size = 6
  },
  methods: {
    currentChange($event) {
      this.currentId = $event.tableElementCode
    },
    handleBtn(mode) {
      if (mode === 'cancle') {
        const data = {}
        this.$emit('selectModule', { mode, data })
      } else {
        const param = {
          surveyCode: this.currentId
        }
        getModule(param).then(
          res => {
            let noRepeat = true
            this.currentData = res.data
            this.currentData.basicElementVOList.forEach((element, i) => {
              const order = +this.startOrder + i
              element.elementNumber = order.toString()
              if (noRepeat) {
                if (this.parentForm.elementOrderArr.includes(order.toString())) {
                  noRepeat = false
                }
              }
            })
            if (noRepeat) {
              this.$emit('selectModule', { mode, data: this.currentData })
            } else {
              this.$message.warning('元素序号重复，请重新输入起始序号！')
            }
          },
          error => {
            this.$message.error(`获取模块数据失败${error}`)
          }
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  >>> .el-table {
    td {
      padding: 5px 0;
      cursor: pointer;
    }
  }
}
.operate-box {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.input-order {
  display: flex;
  align-items: center;
  .order-label {
    flex: 0 0 95px;
  }
}
</style>
