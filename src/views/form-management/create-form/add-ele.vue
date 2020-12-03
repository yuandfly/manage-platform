<template>
  <div class="ele-contanier">
    <slot></slot>
    <div class="operte-section">
      <div class="ele-show" v-if="eleShow">
        <div class="ele-number">{{ ele.elementNumber }}</div>
        <div class="ele-name" @dblclick="edit">{{ ele.elementName }}</div>
        <element-select class="ele-component" :eleInfo="ele"></element-select>
      </div>
      <el-popover placement="top" width="250" trigger="hover" v-else>
        <el-tag class="add-tag" @click="handleCommand(0, '文字框')">文字输入</el-tag>
        <!-- <el-tag class="add-tag" @click="handleCommand(1, '文字域')">文字域</el-tag> -->
        <el-tag class="add-tag" @click="handleCommand(4, '数字输入框')">数字输入</el-tag>
        <el-tag class="add-tag" @click="handleCommand(2, '时间选择')">时间选择</el-tag>
        <!-- <el-tag class="add-tag" @click="handleCommand(3, '时间范围选择')">时间范围选择</el-tag> -->
        <el-tag class="add-tag" @click="handleCommand(6, '单选框')">单项选择</el-tag>
        <el-tag class="add-tag" @click="handleCommand(7, '复选框')">多项选择</el-tag>
        <el-tag class="add-tag" @click="handleCommand(8, '下拉单选')">下拉单选</el-tag>
        <el-tag class="add-tag" @click="handleCommand(-1, '自定内容')">自定元素</el-tag>
        <el-tag class="add-tag" @click="handleHasEle">已有元素</el-tag>
        <el-button slot="reference" type="primary" size="mini">选择元素</el-button>
      </el-popover>
    </div>
    <div class="ele-msg" v-if="dialogVisible">
      <el-dialog class="create-form-dialog" :title="dialogTitle" :visible.sync="dialogVisible" width="900px">
        <ele-info :ele="ele" ref="eleMsg" @oprateBtn="oprateBtn" />
      </el-dialog>
    </div>
    <div class="ele-list" v-if="eleListVisible">
      <el-dialog title="选择元素" :visible.sync="eleListVisible" width="1200px">
        <ele-list @selectEleEnter="selectEleEnter" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { deepAssign, deepClone } from '@/common/js/tool'
import { elementMap } from './model'
import EleInfo from './ele-info-dialog'
import EleList from './ele-list-dialog'
import ElementSelect from './element-select'
import { mapState } from 'vuex'
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
  name: 'AddEle',
  components: { EleInfo, ElementSelect, EleList },
  data() {
    return {
      dialogTitle: '',
      dialogVisible: false,
      eleShow: false,
      eleListVisible: false,
      ele: {}
    }
  },
  props: {
    formOrder: Number,
    moduleOrder: Number,
    elementOrder: Number,
    addEleBtn: Boolean
  },
  computed: {
    ...mapState(['formEdit', 'insertModule'])
  },
  created() {
    /* 增加元素时初始化组件 */
    if (this.addEleBtn) {
      this.eleShow = false
      this.ele = deepClone(elementMap)
    } else if (this.formEdit) {
      /* 修改时初始化组件 */
      this.eleShow = true
      const formDate = this.getFormDate()
      this.ele = formDate.basicTableVOList[this.formOrder].basicModuleVOList[this.moduleOrder].basicElementVOList[this.elementOrder]
      /* 赋值弹框title */
      const key = this.ele.componentType.toString()
      this.dialogTitle = typeMap[key] + '元素定义'
    } else if (this.insertModule) {
      this.eleShow = true
      const moduleData = this.moduleData()
      this.ele = moduleData.basicElementVOList[this.elementOrder]
    }
  },
  methods: {
    /* 获取formData */
    getFormDate() {
      return JSON.parse(localStorage.getItem('formData'))
    },
    /* 获取插入模块的数据 */
    moduleData() {
      return JSON.parse(localStorage.getItem('moduleData'))
    },
    handleCommand(type, title) {
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
      /* 执行一下index文件的getOrder方法 */
      this.$bus.$emit('getOrders')
    },
    /* 选择已有元素的确认按钮 */
    selectEleEnter({ model, data }) {
      /* 取消处理 */
      if (model === 'cancle') {
        this.eleListVisible = false
        return
      }
      this.ele = Object.assign({}, data)
      this.dialogTitle = '已有元素定义'
      this.eleListVisible = false
      this.dialogVisible = true
      /* 执行一下index文件的getOrder方法 */
      this.$bus.$emit('getOrders')
    },
    /* 获取填写的信息 */
    oprateBtn(model) {
      /* 取消处理 */
      if (model === 'cancle') {
        this.dialogVisible = false
        return
      }
      /* 确定处理 */
      /* ref获取元素数据，提交时将数据传给module父组件 */
      this.ele = deepAssign(this.ele, this.$refs.eleMsg.form)
      /* 元素信息的格式化转换统一在此做处理 */
      this.ele.isRequired = this.ele.isRequired ? 1 : 2
      this.dialogVisible = false
      this.eleShow = true
      /* 将数据传给父组件 */
      this.send()
    },
    /* 将信息传送给父元素 */
    send() {
      const data = { index: this.elementOrder, ele: this.ele }
      this.$emit('sendMsg', data)
    },
    edit() {
      this.dialogVisible = true
    },
    handleHasEle() {
      this.eleListVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.add-tag {
  &.el-tag {
    cursor: pointer;
    margin-top: 5px;
    margin-bottom: 5px;
  }
}
.ele-contanier {
  position: relative;
  .operte-section > .el-input {
    width: 100px;
  }
  .operte-section {
    height: 100%;
    padding: 3px 0;
    .ele-show {
      display: flex;
      align-items: center;
      height: 100%;
      border: 1px solid #ebeef5;
    }
    .ele-number {
      width: 80px;
      padding-left: 5px;
      height: 100%;
      line-height: 2.5;
    }
    .ele-name {
      color: #909399;
      cursor: pointer;
      width: 215px;
      border-left: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;
      height: 100%;
      line-height: 2.5;
      padding-left: 5px;
    }
    .ele-component {
      width: 206px;
      >>> .el-input__inner {
        width: 200px;
      }
      >>> .el-input-number--mini {
        width: 100%;
      }
    }
  }
}
</style>
