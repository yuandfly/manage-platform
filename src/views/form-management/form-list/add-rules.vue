<template>
  <div>
    <div class="oprate">
      <el-button size="mini" class="el-icon-back" @click="back">返回</el-button>
    </div>
    <div class="fill-form">
      <head-preview :headinfo="headinfo"></head-preview>
      <form-preview :configs="configs"></form-preview>
    </div>
    <div class="add-rules">
      <el-divider content-position="left">添加计算规则({{ rulesList.length }})</el-divider>
      <el-row class="rule-row" v-for="(rule, index) in rulesList" :key="index">
        <el-col :span="1">
          <span class="rules-order">({{ index + 1 }})</span>
        </el-col>
        <el-col :span="22">
          <span v-for="ele in rule" :key="ele.id">
            <el-tag v-if="ele.typeCode === 0">{{ ele.elementName }}</el-tag>
            <el-tag v-else type="info">{{ ele.typeCode | showChart }}</el-tag>
          </span>
        </el-col>
        <!-- <el-tooltip class="item" effect="dark" content="删除规则" placement="top"> </el-tooltip>-->
        <el-button size="mini" type="danger" @click="deleteRule(rule[0].rulesId)" class="el-icon-close"></el-button>
      </el-row>
      <el-divider></el-divider>
      <el-form :model="rulesForm" ref="rulesForm" class="demo-form-inline" inline>
        <el-row class="add-rule-box">
          <el-col class="exp-col">
            <el-form-item prop="firstElement.elementCode" :rules="{ required: true, message: '必填字段', trigger: 'change' }">
              <el-select v-model="rulesForm.firstElement.elementCode" placeholder="元素项" size="mini">
                <el-option :label="ele.elementName" :value="ele.elementCode" v-for="ele in elements" :key="ele.elementCode"></el-option>
              </el-select>
            </el-form-item>
            <!-- 动态添加元素 -->
            <template v-for="(ele, i) in rulesForm.adds">
              <el-form-item
                v-if="ele.typeCode !== 0"
                :key="i"
                :prop="'adds.' + i + '.typeCode'"
                :rules="{
                  required: true,
                  message: '必填字段',
                  trigger: 'change'
                }"
              >
                <el-select v-model="ele.typeCode" placeholder="运算符" style="width:90px" size="mini">
                  <el-option label="+" :value="1"></el-option>
                  <el-option label="-" :value="2"></el-option>
                  <el-option label="*" :value="3"></el-option>
                  <el-option label="/" :value="5"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-else
                :key="i"
                :prop="'adds.' + i + '.elementCode'"
                :rules="{
                  required: true,
                  message: '必填字段',
                  trigger: 'change'
                }"
              >
                <el-select v-model="ele.elementCode" placeholder="元素项" size="mini">
                  <el-option :label="ele.elementName" :value="ele.elementCode" v-for="ele in elements" :key="ele.elementCode"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-col>
          <el-col class="res-col">
            <el-form-item prop="lastCharacter.typeCode" :rules="{ required: true, message: '必填字段', trigger: 'change' }">
              <el-select v-model="rulesForm.lastCharacter.typeCode" placeholder="计算" style="width:80px" size="mini">
                <el-option label="=" :value="5"></el-option>
                <el-option label=">" :value="6"></el-option>
                <el-option label="<" :value="7"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="result.elementCode" :rules="{ required: true, message: '必填字段', trigger: 'change' }">
              <el-select v-model="rulesForm.result.elementCode" placeholder="结果" size="mini">
                <el-option :label="ele.elementName" :value="ele.elementCode" v-for="ele in elements" :key="ele.elementCode"></el-option>
              </el-select>
              <el-button-group>
                <el-tooltip class="item" effect="dark" content="添加运算符" placement="top">
                  <el-button size="mini" @click="addChart" class="el-icon-link"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="添加元素项" placement="top">
                  <el-button size="mini" @click="plusEle" class="el-icon-plus"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删减项" placement="top">
                  <el-button size="mini" @click="minusEle" class="el-icon-minus"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="保存规则" placement="top">
                  <el-button type="primary" size="mini" @click="sendRule" class="el-icon-check"></el-button>
                </el-tooltip>
              </el-button-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import PageDetail from './page-detail'
import { ruleDTO } from './rule-model'
import { deepClone } from '@/common/js/tool'
import { getFormElement, saveFormRule, getFormRule, deleteFormRule } from '@/api/system/form-rule'
import { user } from '@/common/js/loginInfo'
/* 运算符号map */
const chartMap = [{ label: '+', value: 1 }, { label: '-', value: 2 }, { label: '*', value: 3 }, { label: '/', value: 4 }, { label: '=', value: 5 }, { label: '>', value: 6 }, { label: '<', value: 7 }]
export default {
  name: 'AddRules',
  extends: PageDetail,
  data() {
    return {
      /* elements */
      elements: [],
      /* 规则列表 */
      rulesList: [],
      /* 单个规则 */
      rulesForm: {
        firstElement: {},
        lastCharacter: {},
        result: {},
        adds: []
      }
    }
  },
  filters: {
    showChart(type) {
      if (!type) {
        return '未知符号'
      }
      const chartItem = chartMap.find(chart => {
        return chart.value === type
      })
      return chartItem.label
    }
  },
  created() {
    this.initDate()
    /* 赋值entends组件属性值 */
    this.surveyCode = this.$route.query.surveyCode
    /* 执行entends组件的函数 */
    this.getItem()
    /* 获取可计算的元素 */
    this.getFormElementList()
    /* 获取规则列表 */
    this.getFormRuleList()
  },
  methods: {
    /* 获取表单上能参与计算的元素 */
    getFormElementList() {
      getFormElement({
        surveyCode: this.surveyCode
      }).then(res => {
        this.elements = res.data.baseElementDOList
      })
    },
    /* 获取规则列表 */
    getFormRuleList() {
      getFormRule({
        surveyCode: this.surveyCode
      }).then(res => {
        this.rulesList = res.data
      })
    },
    /* 删除一条规则 */
    deleteRule(id) {
      deleteFormRule({
        rulesId: id,
        surveyCode: this.surveyCode
      }).then(res => {
        this.$message.success('删除成功！')
        this.getFormRuleList()
      })
    },
    /* 给部分元素赋初始值 */
    initDate() {
      /* 给第一个元素 ypeCode = 0*/
      const firstElement = deepClone(ruleDTO)
      firstElement.typeCode = 0
      this.rulesForm.firstElement = firstElement
      /* 给最后一元素 ypeCode = 0 */
      const result = deepClone(ruleDTO)
      result.typeCode = 0
      this.rulesForm.result = result
      /* 最后一个符号的初始化 */
      const lastCharacter = deepClone(ruleDTO)
      lastCharacter.typeCode = 5
      this.rulesForm.lastCharacter = lastCharacter
    },

    /* 规则表中增加元素 */
    plusEle() {
      const ele = deepClone(ruleDTO)
      ele.typeCode = 0
      this.rulesForm.adds.push(ele)
    },
    /* 规则表中减掉元素 */
    minusEle() {
      if (this.rulesForm.adds.length < 1) {
        return
      }
      this.rulesForm.adds.pop()
    },
    /* 添加运算符 */
    addChart() {
      const ele = deepClone(ruleDTO)
      this.rulesForm.adds.push(ele)
    },
    /* 提交一条规则 */
    sendRule() {
      this.$refs.rulesForm.validate(valid => {
        if (!valid) {
          return
        } else {
          const { firstElement, lastCharacter, result, adds } = this.rulesForm
          /* 合并参数，并添加序号 */
          let param = [firstElement, ...adds, lastCharacter, result]
          param = param.map((item, i) => {
            item.surveyCode = this.surveyCode
            item.createuser = user.nickname
            item.seatNumber = i
            /* 找到对应的elementName */
            this.elements.find(ele => {
              if (item.elementCode === ele.elementCode) {
                item.elementName = ele.elementName
              }
            })
            return item
          })
          saveFormRule(param).then(
            res => {
              this.$message.success('添加规则成功！')
              this.getFormRuleList()
              this.$refs['rulesForm'].resetFields()
              this.rulesForm.adds = []
            },
            error => {
              this.$message.error(`添加规则失败${error}`)
            }
          )
        }
      })
    },
    back() {
      this.$router.back(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.add-rules {
  margin-top: 30px;
}
.rules-operate {
  text-align: center;
}
.oprate {
  text-align: right;
}
.rule-row {
  margin: 8px 0;
  display: flex;
}
.el-tag {
  margin: 0 5px;
}
.rules-order {
  line-height: 2;
}
.add-rule-box {
  display: flex;
  justify-content: center;
  .res-col {
    flex-grow: 0;
    flex-shrink: 0;
    width: 474px;
  }
}
</style>
