<template>
  <div>
    <div class="btn-box">
      <el-tooltip
        effect="dark"
        content="该功能动态创建模块，先在输入框中输入模块的名称，再根据需求点击下面卡片上方的按钮，在弹框中录入信息。双击已创建的元素名称可重编辑元素信息。"
        placement="top-start"
      >
        <span class="help-txt"><i class="el-icon-question"></i>帮助说明 </span>
      </el-tooltip>
      <div v-if="editModule">
        <el-button class="el-icon-back" size="mini" @click="back">返回</el-button>
        <el-button class="el-icon-check" type="primary" size="mini" @click="update">保存模块</el-button>
      </div>
      <el-button class="el-icon-check" type="primary" size="mini" @click="generate" v-else>生成模块</el-button>
    </div>
    <el-card>
      <template slot="header">
        <div class="ele-tag">
          <el-tag class="add-tag" @click="handleCommand(0, '文字框')">文字输入</el-tag>
          <!-- <el-tag class="add-tag" @click="handleCommand(1, '文字域')">文字域</el-tag> -->
          <el-tag class="add-tag" @click="handleCommand(4, '数字输入框')">数字输入</el-tag>
          <el-tag class="add-tag" @click="handleCommand(2, '时间选择')">时间选择</el-tag>
          <!-- <el-tag class="add-tag" @click="handleCommand(3, '时间范围选择')">时间范围选择</el-tag> -->
          <el-tag class="add-tag" @click="handleCommand(6, '单选框')">单项选择</el-tag>
          <el-tag class="add-tag" @click="handleCommand(7, '复选框')">多项选择</el-tag>
          <el-tag class="add-tag" @click="handleCommand(8, '下拉单选')">下拉单选</el-tag>
          <el-tag class="add-tag" @click="handleCommand(-1, '自定内容')">自定元素</el-tag>
          <el-tag class="add-tag" @click="eleListVisible = true">已有元素</el-tag>
        </div>
      </template>
      <div class="module-contanier">
        <div class="name-input">
          <div class="module-section">
            <div class="name-unit">
              <el-input v-show="showModuleNamebtn" v-focus v-model.trim="module.tableElementName" placeholder="请输入模块名称" @keyup.enter.native="hidde" @blur="hidde" size="mini" />
              <div class="module-name" v-show="!showModuleNamebtn" @dblclick="showModuleNamebtn = true">
                {{ module.tableElementName }}
              </div>
            </div>
            <div class="ele-unit">
              <div class="ele-box" :key="index" v-for="(item, index) in module.basicElementVOList">
                <add-ele :ele="item" @editEle="editEle(index)">
                  <i class="el-icon-close close-icon-g tiggle" @click.stop.prevent="deleteEle(index)"></i>
                </add-ele>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ele-msg" v-if="dialogVisible">
        <el-dialog class="create-form-dialog" :title="dialogTitle" :visible.sync="dialogVisible">
          <ele-info :ele="ele" ref="eleMsg" @oprateBtn="oprateBtn" :elementOrderArr="elementOrderArr" />
        </el-dialog>
      </div>
      <div class="ele-list" v-if="eleListVisible">
        <el-dialog title="选择元素" :visible.sync="eleListVisible" width="1200px">
          <ele-list @selectEleEnter="selectEleEnter" />
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import { createModule, getModule, updataModule } from '@/api/module/module'
import { moduleMap, elementMap } from './quote/model'
import { deepClone } from '@/common/js/tool'
import AddEle from './quote/add-ele'
import EleInfo from './quote/ele-info-dialog'
import EleList from './quote/ele-list-dialog'
const typeMap = {
  '-1': '自定内容',
  '0': '文字框',
  '1': '文字域',
  '2': '时间选择',
  '3': '时间范围选择',
  '4': '数字输入框',
  '6': '单选框',
  '7': '复选框',
  '8': '下拉单选'
}
export default {
  name: 'CreateModule',
  components: {
    AddEle,
    EleInfo,
    EleList
  },
  data() {
    return {
      showModuleNamebtn: true,
      module: {},
      ele: {},
      dialogVisible: false,
      eleListVisible: false,
      dialogTitle: '',
      elementOrderArr: [],
      editType: false,
      editIndex: null,
      editModule: false
    }
  },
  created() {
    this.editModule = this.$route.query.type ? true : false
    if (this.editModule) {
      const param = {
        surveyCode: this.$route.query.code
      }
      getModule(param).then(
        res => {
          let data = res.data
          data.basicElementVOList.sort((a, b) => Number(a.colnum) - Number(b.colnum))
          this.module = data
        },
        error => {
          this.$message.error(`获取模块数据失败${error}`)
        }
      )
    } else {
      this.module = deepClone(moduleMap)
    }
  },
  methods: {
    /* 更改名字的编辑状态 */
    hidde() {
      this.showModuleNamebtn = false
    },
    deleteEle(index) {
      this.module.basicElementVOList.splice(index, 1)
      this.setOrder()
    },
    /* 选择按钮 */
    handleCommand(type, title) {
      this.editType = false
      this.ele = Object.assign({}, deepClone(elementMap))
      this.ele.componentType = type
      this.dialogTitle = title + '元素定义'
      /* 赋值dataType */
      switch (type) {
        case 4:
          this.ele.dataType = 0 //数值 Number
          break
        case 2:
          this.ele.dataType = 1 //日期 Data
          break
        default:
          this.ele.dataType = 2 //字符 String
          break
      }
      this.dialogVisible = true
    },
    /* 选择已有元素的确认按钮 */
    selectEleEnter({ mode, data }) {
      this.editType = false
      /* 取消处理 */
      if (mode === 'cancle') {
        this.eleListVisible = false
        return
      }
      this.ele = Object.assign({}, data)
      this.dialogTitle = '已有元素定义'
      this.eleListVisible = false
      this.dialogVisible = true
    },
    /* 获取填写的信息 */
    oprateBtn({ mode, data }) {
      /* 取消处理 */
      if (mode === 'cancle') {
        this.dialogVisible = false
        return
      }
      this.ele = Object.assign({}, data)
      /* 元素信息的格式化转换统一在此做处理 */
      this.ele.isRequired = this.ele.isRequired ? 1 : 2
      this.dialogVisible = false
      this.eleShow = true
      /* 编辑/新增 */
      if (this.editType) {
        this.module.basicElementVOList.splice(this.editIndex, 1, this.ele)
      } else {
        this.module.basicElementVOList.push(this.ele)
        this.setOrder()
      }
      this.getOrder()
    },
    generate() {
      if (!this.module.tableElementName) {
        this.$message.error('模块名称必须填写！')
        return
      }
      this.module.basicElementVOList.forEach((ele, i) => {
        ele.colnum = i
        if (ele.dictionaryTableDOList instanceof Array) {
          ele.dictionaryTableDOList.forEach((option, i1) => {
            option.ordernum = i1
          })
        }
      })
      createModule(this.module).then(
        res => {
          this.$message.success('创建模块成功！')
          this.$router.push('/home/form/module-list')
        },
        error => {
          this.$message.error(`创建模块异常${error}`)
        }
      )
    },
    setOrder() {
      if (!this.module.basicElementVOList.length) {
        return
      }
      this.module.basicElementVOList.forEach((ele, i) => {
        ele.elementNumber = i
      })
    },
    getOrder() {
      if (!this.module.basicElementVOList.length) {
        return
      }
      this.elementOrderArr = Object.assign([], this.module.basicElementVOList.map(ele => ele.elementNumber))
    },
    editEle(i) {
      this.editIndex = i
      this.editType = true
      this.dialogTitle = '编辑元素'
      this.ele = Object.assign({}, this.module.basicElementVOList[i])
      this.dialogVisible = true
    },
    update() {
      this.module.basicElementVOList.forEach((ele, i) => {
        ele.elementNumber = i
      })
      updataModule(this.module).then(
        res => {
          this.$message.success('保存成功！')
          this.$router.back(-1)
        },
        error => {
          this.$message.error(`模块数据保存异常${error}`)
          this.$router.back(-1)
        }
      )
    },
    back() {
      this.$router.back(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.help-txt {
  cursor: default;
}
.btn-box {
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
}
.module-contanier {
  position: relative;
}
.add-form-btn,
.add-mudel-btn {
  text-align: center;
  padding: 5px 0;
}
.module-section {
  // display: flex;
  .name-unit {
    // width: 150px;
    // text-align: center;
    .module-name {
      // width: 150px;
      min-height: 28px;
      color: #909399;
      border: 1px solid #ebeef5;
      padding-left: 5px;
    }
  }
  .tiggle {
    display: none;
  }
  .ele-unit {
    display: grid;
    grid-template-columns: 33% 33% 33%;
    grid-column-gap: 0.5%;
    :hover {
      .tiggle {
        display: block;
      }
    }
  }
}

.add-tag {
  &.el-tag {
    cursor: pointer;
    margin-top: 5px;
    margin-bottom: 5px;
  }
}
</style>
