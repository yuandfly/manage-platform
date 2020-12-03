<template>
  <div class="module-contanier">
    <div class="name-input">
      <div class="module-section">
        <div class="name-unit">
          <el-input v-show="showModuleNamebtn" v-model="module.tableElementName" placeholder="请输入模块名称" @keyup.enter.native="hidde" @blur="hidde" size="mini" />
          <div class="module-name" v-show="!showModuleNamebtn" @dblclick="showModuleNamebtn = true">
            {{ module.tableElementName }}
          </div>
        </div>
        <div class="ele-unit">
          <div class="ele-box" :key="index" v-for="(ele, index) in module.basicElementVOList">
            <add-ele @sendMsg="getEle" :formOrder="formOrder" :moduleOrder="moduleOrder" :elementOrder="index" :addEleBtn="addEleBtn" v-if="ele.state != 2">
              <i class="el-icon-close close-icon-g tiggle" @click.stop.prevent="deleteEle(index)"></i>
            </add-ele>
          </div>
          <el-tooltip effect="dark" content="添加元素" placement="top">
            <el-button :disabled="eleAddDisabled" @click="addEleFn" type="primary" icon="el-icon-plus" size="mini" class="add-ele-btn"></el-button>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { moduleMap, elementMap } from './model'
import { deepClone } from '@/common/js/tool'
import AddEle from './add-ele'
import { mapState } from 'vuex'
export default {
  name: 'AddModule',
  components: {
    AddEle
  },
  data() {
    return {
      eleAddDisabled: false,
      showModuleNamebtn: true,
      module: {},
      /* 告诉子组件是新增 */
      addEleBtn: false
    }
  },
  props: {
    formOrder: Number,
    index: {
      type: Number,
      required: true
    },
    addModuleFlag: Boolean
  },
  computed: {
    ...mapState(['formEdit', 'insertModule']),
    /* 当前模块的序号 */
    moduleOrder() {
      return this.index
    }
  },
  created() {
    /* 初始化组件是添加还是编辑 */
    if (this.addModuleFlag) {
      this.module = deepClone(moduleMap)
    } else if (this.formEdit) {
      //如果是编辑
      const formDate = this.getFormDate()
      this.module = formDate.basicTableVOList[this.formOrder].basicModuleVOList[this.index]
    } else if (this.insertModule) {
      const moduleData = this.moduleData()
      this.module = moduleData
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
    /* 更改名字的编辑状态 */
    hidde() {
      this.showModuleNamebtn = false
    },
    addEleFn() {
      const element = deepClone(elementMap)
      this.module.basicElementVOList.push(element)
      this.eleAddDisabled = true
      this.addEleBtn = true
    },
    deleteEle(index) {
      this.module.basicElementVOList[index].state = 2
      this.module.basicElementVOList[index].elementNumber = ''
      const length = this.module.basicElementVOList.length
      const showLength = this.module.basicElementVOList.filter(item => item.state != 2)
      /* 如果只剩一个元素时，移除添加按钮的disabled属性 */
      if (showLength < 2) {
        this.eleAddDisabled = false
      }
      if (index === length - 1) {
        this.eleAddDisabled = false
      }
      /* 让父组件对应更新 */
      this.send()
    },
    /* 获取元素的信息 */
    getEle($event) {
      this.eleAddDisabled = false
      const { index, ele } = $event
      this.module.basicElementVOList[index] = ele
      this.send()
    },
    /* 将信息传送给父元素 */
    send() {
      const data = { index: this.moduleOrder, module: this.module }
      this.$emit('sendModule', data)
    }
  }
}
</script>

<style lang="scss" scoped>
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
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    :hover {
      .tiggle {
        display: block;
      }
    }
  }
  .ele-box {
    display: flex;
    padding-right: 10px;
    align-items: center;
  }
}
.add-ele-btn {
  height: 30px;
}
</style>
