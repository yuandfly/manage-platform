<template>
  <div class="page-container">
    <div class="help-discrib">
      <el-tooltip effect="dark" content="该功能动态创建统计列表，请先定义列表的名称，并通过下面的按钮可自定义创建列表的每一项，通过每一项的上的按钮定义数据的统计来源。" placement="top-start">
        <span class="help-txt"><i class="el-icon-question"></i>帮助说明 </span>
      </el-tooltip>
    </div>
    <div class="table-name">
      <el-input v-model.trim="tabName" v-focus ref="tableNameRef" placeholder="请输入表格名称"></el-input>
    </div>
    <div class="content">
      <div class="create-th" v-if="showThBox">
        <div class="cus-th" v-for="col in columnList" :key="col.id">
          <el-input v-model.trim="col.fieldName" v-if="col.edit" @blur="fieldNameBlur(col)" placeholder="请填写统计项目名称"></el-input>
          <div class="col-name" v-else>
            <el-tooltip effect="dark" content="单击添加统计数据来源" placement="top-start">
              <i class="el-icon-circle-plus-outline" @click="addRule(col.id)"></i>
            </el-tooltip>
            <el-tooltip effect="dark" content="双击修改名称" placement="top-start">
              <span @dblclick="col.edit = true">{{ col.fieldName }}</span>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div class="oparate">
        <el-button-group>
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="addCol" :disabled="!tabName">添加统计项</el-button>
          <el-button type="primary" icon="el-icon-minus" size="mini" @click="delCol" :disabled="!showThBox">删除统计项</el-button>
          <el-button type="primary" icon="el-icon-check" size="mini" @click="generate" :disabled="!showThBox">生成列表</el-button>
        </el-button-group>
      </div>
    </div>
    <!-- 添加规则 -->
    <div v-if="ruleDialogVisible">
      <el-dialog title="添加列" :visible.sync="ruleDialogVisible" width="1200px">
        <rule-dialog ref="ruleRef" :ruleInfo="ruleInfo"></rule-dialog>
        <div slot="footer" class="dialog-footer">
          <el-button @click="ruleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import RuleDialog from './rule-dialog'
import { createTable } from '@/api/hn-statistics/create-table'
import { Table, Column, Rule } from './model'
export default {
  components: {
    RuleDialog
  },
  data() {
    return {
      table: new Table(JSON.parse(sessionStorage.getItem('userInfo')).nickname),
      tabName: '',
      ruleDialogVisible: false,
      columnList: [],
      ruleInfo: [],
      /* 点击当前字段修改规则 */
      currentColId: ''
    }
  },
  computed: {
    showThBox() {
      return this.columnList.length > 0 ? true : false
    }
  },
  directives: {
    focus: {
      inserted: function(el) {
        el.querySelector('input').focus()
      }
    }
  },
  methods: {
    addCol() {
      let column = new Column(JSON.parse(sessionStorage.getItem('userInfo')).nickname)
      this.columnList.push(column)
      const length = this.columnList.length
    },
    addRule(id) {
      this.ruleDialogVisible = true
      this.currentColId = id
      const currentItem = this.columnList.find(item => item.id === id)
      this.ruleInfo = currentItem.statisticalTableRuleDOList
    },
    delCol() {
      this.columnList.pop()
    },
    fieldNameBlur(col) {
      if (!col.fieldName) {
        this.$message.warning('请填统计项名称!')
      } else {
        col.edit = false
      }
    },
    generate() {
      if (!this.tabName) {
        this.$message.warning('请填写表格名称')
        return
      }
      let flag = false
      this.columnList.forEach((item, i) => {
        item.orders = i
        if (item.statisticalTableRuleDOList.length < 1) {
          flag = true
          this.$message.warning(`第${i + 1}列未添加数据来源，请点击表头前的+号添加数据来源`)
        }
      })
      if (flag) {
        return
      }
      this.table.tableName = this.tabName
      this.table.statisticalTableFieldAOList = this.columnList
      createTable(this.table).then(
        res => {
          this.$message.success('创建成功！')
          this.$router.push({
            path: '/hn-statistics/custom-table',
            query: { id: res.data }
          })
        },
        error => {
          this.$message.error(`创建失败${error}`)
        }
      )
    },
    addConfirm() {
      this.$refs.ruleRef.selectedList.forEach((rule, i) => {
        rule.orders = i
      })
      this.columnList.find(item => {
        if (item.id === this.currentColId) {
          item.statisticalTableRuleDOList = this.$refs.ruleRef.selectedList
        }
      })
      this.ruleDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.help-txt {
  cursor: default;
}
.content {
  margin-top: 10px;
  align-items: center;
  .create-th {
    // min-height: 42px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    display: flex;
  }
  .oparate {
    margin-top: 8px;
    text-align: center;
  }
  .cus-th {
    min-height: 42px;
    display: flex;
    align-items: center;
    height: 100%;
    min-width: 50px;
    max-width: 300px;
    border-right: 1px solid #ebeef5;
    &:last-of-type {
      border-right: none;
    }
  }
  .col-name {
    padding: 0 5px;
  }
}
</style>
