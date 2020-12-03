<template>
  <div>
    <div class="content">
      <div class="rule-box">
        <el-form :inline="true" :model="ruleForm" class="demo-form-inline" size="mini">
          <el-form-item label="表单选择">
            <el-select v-model="ruleForm.form" value-key="code" placeholder="请选择要择统计的表单" @change="formSelectdChange">
              <el-option v-for="form in formList" :label="form.surveyName" :value="form" :key="form.code"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计算项">
            <el-select v-model="ruleForm.element" value-key="elementCode" placeholder="请选择要统计">
              <el-option v-for="ele in elementList" :label="ele.elementName" :value="ele" :key="ele.elementCode"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计划名称" v-if="multipleSelect">
            <el-select v-model="ruleForm.plan" value-key="planCode" placeholder="请选择">
              <el-option v-for="plan in planList" :label="plan.planName" :value="plan" :key="plan.planCode"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计划名称" v-else>
            <el-select v-model="planArray" multiple collapse-tags value-key="planCode" style="margin-left: 20px;" placeholder="请选择">
              <el-option v-for="plan in planList" :label="plan.planName" :value="plan" :key="plan.planCode"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="oparate">
        <label>
          请选择连接符
          <el-select v-model="connector" placeholder="请选择连接符" size="mini" class="calculate-select">
            <el-option v-for="item in ruleList" :label="item.name" :value="item.key" :key="item.key"> </el-option>
          </el-select>
        </label>
        <el-button-group>
          <el-button type="primary" icon="el-icon-check" size="mini" @click="generate"></el-button>
        </el-button-group>
      </div>
    </div>
    <el-divider content-position="left">数据来源</el-divider>
    <div class="complete-rule" v-if="selectedList.length > 0">
      <div v-for="(item, i) in selectedList" :key="i" class="rule-row">
        <div class="rule-cont">
          <el-tag>计划名称：{{ item.planName }}</el-tag
          ><el-tag>统计项目：{{ item.elementName }}</el-tag
          ><el-tag>{{ item.operatorName }}</el-tag>
        </div>
        <div class="rule-oper">
          <el-button type="primary" icon="el-icon-delete" size="mini" @click="delRule(i)"></el-button>
        </div>
      </div>
    </div>
    <empty-temp text="请在上面表单中添加数据来源" min-height="10px" v-else></empty-temp>
  </div>
</template>
<script>
import { Table, Column, Rule } from './model'
import { getFormList, getForm } from '@/api/system/formManagement'
import { getFills } from '@/api/hn-statistics/hn-statistics'
const ruleMap = {
  '0': '=',
  '1': '+',
  '2': '-',
  '3': '*',
  '4': '/'
}
const ruleList = [
  {
    key: '0',
    name: '='
  },
  {
    key: '1',
    name: '+'
  },
  {
    key: '2',
    name: '-'
  },
  {
    key: '3',
    name: '*'
  },
  {
    key: '4',
    name: '/'
  }
]

export default {
  props: {
    ruleInfo: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      formLoading: false,
      selectedList: [],
      calculateChars: [],
      ruleList,
      ruleForm: {
        form: {},
        element: {},
        plan: {}
      },
      /* 连接符 */
      connector: '',
      planArray: [],
      /* 计划列表 */
      planList: [],
      /* 表单列表 */
      formList: [],
      /* 计算项列表 */
      elementList: []
    }
  },
  computed: {
    multipleSelect() {
      return this.selectedList.length > 0 ? true : false
    }
  },
  watch: {
    connector() {}
  },
  created() {
    if (this.ruleInfo.length > 0) {
      this.selectedList = this.ruleInfo
    }
    this.getPageList()
  },
  methods: {
    getPageList() {
      /* 获取二级列表 */
      const params = { level: 2, tableName: '', size: 100 }
      this.formLoading = true
      getFormList(params).then(
        res => {
          this.formList = res.data.content
          this.formLoading = false
        },
        error => {
          this.formLoading = false
          this.$messge.error(`获取列表失败${error}`)
        }
      )
    },
    formSelectdChange($event) {
      this.words($event.code)
      this.getPlants($event.code)
    },
    /* 当前表单中能统计的项过滤 */
    words(surveyCode) {
      this.elementList = []
      getForm({ surveyCode }).then(res => {
        res.data.data.basicTableVOList.forEach(form => {
          form.basicModuleVOList.forEach(mudel => {
            mudel.basicElementVOList.forEach(ele => {
              if (ele.dataType === 0) {
                this.elementList.push(ele)
              }
            })
          })
        })
      })
    },
    /* 获取关联的计划列表 */
    getPlants(surveyCode) {
      this.planList = []
      getFills({
        surveyCode
      }).then(res => {
        if (res.code === 0) {
          this.planList = res.data
        }
        this.loading1 = false
      })
    },
    /* 删除规则 */
    delRule(i) {
      this.selectedList.splice(i, 1)
    },
    generate() {
      /* 如果是单选计划 */
      if (this.ruleForm.plan.planCode) {
        const rule = new Rule(JSON.parse(sessionStorage.getItem('userInfo')).nickname)
        rule.planCode = this.ruleForm.plan.planCode
        rule.planName = this.ruleForm.plan.planName
        rule.elementCode = this.ruleForm.element.elementCode
        rule.elementName = this.ruleForm.element.elementName
        rule.operator = Number(this.connector)
        rule.operatorName = ruleMap[this.connector]
        this.selectedList.push(rule)
      } else if (this.planArray.length > 0) {
        //如果是多选计划
        this.planArray.forEach(item => {
          const rule = new Rule(JSON.parse(sessionStorage.getItem('userInfo')).nickname)
          rule.planCode = item.planCode
          rule.planName = item.planName
          rule.elementCode = this.ruleForm.element.elementCode
          rule.elementName = this.ruleForm.element.elementName
          rule.operator = 1
          rule.operatorName = '+'
          this.selectedList.push(rule)
        })
        /* 修改批量操作最后一个元素的符号 */
        this.selectedList[this.selectedList.length - 1].operator = Number(this.connector)
        this.selectedList[this.selectedList.length - 1].operatorName = ruleMap[this.connector]
      }
      this.resetForm()
    },
    /* 清空表单 */
    resetForm() {
      this.ruleForm.form = {}
      this.ruleForm.element = {}
      this.ruleForm.plan = {}
      this.planArray = []
      this.connector = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  margin-top: 10px;
  display: flex;
  align-items: flex-start;
  .rule-box {
    flex: 1;
  }
  .operate {
    width: 200px;
  }
}
.rule-row {
  display: flex;
  align-items: center;
  .rule-cont {
    margin-right: 8px;
    margin-bottom: 8px;
  }
  .rule-oper {
    width: 80px;
  }
}
.calculate-select {
  width: 120px;
}
.el-tag {
  margin: 0 5px;
}
</style>
