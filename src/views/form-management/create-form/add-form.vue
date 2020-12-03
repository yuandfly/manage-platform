<template>
  <div class="form-section">
    <div class="form-box">
      <div class="add-mudel-btn">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addModule(1)" :disabled="!addModuleBtn">添加模块</el-button>
        <el-button size="mini" icon="el-icon-plus" @click="addModule(2)" :disabled="!addModuleBtn">选择已有模块</el-button>
      </div>
      <el-form :model="form" ref="dynamicform" label-width="100px" class="dynamic-form" @submit.native.prevent>
        <div class="form-name from-name-input" v-if="editName">
          <el-input v-model.trim="form.surveyName" placeholder="请输入表单名称" @keyup.enter.native="validate" @blur="validate" size="mini"></el-input>
          <i class="tip" v-show="nameRequire">请输入表单名称</i>
        </div>
        <div class="form-name form-name-style" v-if="!editName" @dblclick="show()">
          {{ form.surveyName }}
        </div>
        <div class="module-box" :key="index" v-for="(module, index) in form.basicModuleVOList">
          <i class="el-icon-circle-close close-module" @click="deleteModule(index)"></i>
          <add-module @sendModule="getModule" :formOrder="formOrder" :index="index" :addModuleFlag="addModuleFlag" />
        </div>
      </el-form>
    </div>
    <div class="module-list" v-if="moduleListVisible">
      <el-dialog title="模块列表" :visible.sync="moduleListVisible" width="1200px">
        <module-list @selectModule="selectModule"></module-list>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import AddModule from './add-module'
import { deepClone } from '@/common/js/tool'
import { formMap, moduleMap } from './model'
import { mapState, mapMutations } from 'vuex'
import ModuleList from './module-list-dialog'
export default {
  name: 'AddForm',
  components: { AddModule, ModuleList },
  data() {
    return {
      moduleId: 0,
      editName: true,
      nameRequire: false,
      form: {},
      /* 通知子组件通过添加的方式初始化组件 */
      addModuleFlag: false,
      moduleListVisible: false
    }
  },
  props: {
    formOrder: Number,
    addFormFlag: Boolean
  },
  computed: {
    ...mapState(['formEdit', 'insertModule']),
    addModuleBtn() {
      return this.form.surveyName ? true : false
    }
  },
  created() {
    /* 初始化组件是新增还是编辑 */
    if (this.addFormFlag) {
      this.form = deepClone(formMap)
    } else if (this.formEdit) {
      //如果是编辑
      const formDate = this.getFormDate()
      this.form = formDate.basicTableVOList[this.formOrder]
    }
    /* 初始化插入模块的状态 */
    this.changeInsertModule(false)
  },
  methods: {
    ...mapMutations(['changeInsertModule']),
    /* 获取formData */
    getFormDate() {
      return JSON.parse(localStorage.getItem('formData'))
    },
    addModule(type) {
      if (this.form.surveyName === '') {
        this.nameRequire = true
        return
      }
      if (type === 1) {
        this.addModuleFlag = true
        this.changeInsertModule(false)
        this.form.basicModuleVOList.push(deepClone(moduleMap))
      } else {
        this.addModuleFlag = false
        this.moduleListVisible = true
      }
      this.moduleId++
    },
    deleteModule(index) {
      this.form.basicModuleVOList.splice(index, 1)
    },
    getModule($event) {
      /* for循环子组件将index传入子组件，再通过事件index和子组件的数据带回 */
      const { index, module } = $event
      this.form.basicModuleVOList[index] = module
    },
    show() {
      this.editName = true
    },
    validate() {
      if (this.form.surveyName === '') {
        this.nameRequire = true
        return false
      } else {
        this.nameRequire = false
      }
      this.editName = false
    },
    selectModule({ mode, data }) {
      if (mode === 'cancle') {
        this.moduleListVisible = false
        return
      } else {
        this.form.basicModuleVOList.push(data)
        this.changeInsertModule(true)
        localStorage.setItem('moduleData', JSON.stringify(data))
        this.moduleListVisible = false
        this.$bus.$emit('getOrders')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-section {
  position: relative;
  padding: 10px;
  .dynamic-form {
    border: 1px solid #ebeef5;
    border-radius: 4px;
  }
  .finish-edit {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .add-form-btn,
  .add-mudel-btn {
    text-align: center;
    padding: 5px 0;
  }
  .form-name {
    border-bottom: 1px solid #ebeef5;
    padding: 10px;
  }
  .from-name-input {
    position: relative;
  }
  .tip {
    position: absolute;
    font-style: normal;
    color: #f56c6c;
    font-size: 12px;
    left: 22px;
  }
  .form-name-style {
    font-size: 16px;
  }
  .module-box {
    position: relative;
    margin: 5px;
    // border: 1px solid #ebeef5;
  }
  .close-module {
    cursor: pointer;
    position: absolute;
    right: -20px;
    top: 0;
    z-index: 2;
  }
}
</style>
