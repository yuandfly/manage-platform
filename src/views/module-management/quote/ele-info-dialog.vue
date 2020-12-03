<template>
  <div class="ele-info-contanier">
    <el-form :model="form" :inline="true" ref="formEle" :rules="rules" class="form" size="small">
      <el-row class="top-row">
        <el-col :span="12">
          <el-form-item label="元素编号" prop="elementNumber" :label-width="formLabelWidth">
            <el-input v-model.trim="form.elementNumber" autocomplete="off" placeholder="请输入元素编号" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="元素名称" prop="elementName" :label-width="formLabelWidth">
            <el-input v-model.trim="form.elementName" autocomplete="off" placeholder="请输入元素名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称缩进" :label-width="formLabelWidth" class="select">
            <el-select v-model="form.indentValue" placeholder="请选择缩进距离">
              <el-option label="无缩进" :value="0"> </el-option>
              <el-option label="一格" :value="10"> </el-option>
              <el-option label="两格" :value="20"> </el-option>
              <el-option label="三格" :value="30"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="自定义内容" :label-width="formLabelWidth" v-if="form.componentType == -1">
            <el-input v-model.trim="form.remark" autocomplete="off" placeholder="请输入自定义内容"></el-input>
          </el-form-item>
          <el-form-item label="是否必填" :label-width="formLabelWidth" v-else>
            <el-switch v-model="form.isRequired" active-color="#13ce66" inactive-color="#cccccc"> </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="option" v-if="hasOptoins">
          <div class="option-label">
            添加选项
          </div>
          <div class="option-box" v-for="(option, i) in form.dictionaryTableDOList" :key="i">
            <el-input v-model="option.configValue" autocomplete="off" placeholder="请输入选项内容" style="width:180px" size="small"></el-input>
            <el-button-group>
              <el-button type="primary" icon="el-icon-plus" @click="add(i)" size="small"></el-button>
              <el-button type="primary" icon="el-icon-minus" :disabled="btnDisable" @click="del(i)" size="small"></el-button>
            </el-button-group>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="必填校验提示" :label-width="formLabelWidth" v-if="form.isRequired" prop="promptLanguage" :rules="promptLanguage">
            <el-input v-model.trim="form.promptLanguage" autocomplete="off" placeholder="请输入必填校验提示"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="clickBtn('cancle')" size="small">取 消</el-button>
      <el-button type="primary" @click="clickBtn('confire')" size="small">确 定 </el-button>
    </div>
  </div>
</template>

<script>
import { optionsMap } from './model'
import { deepClone } from '@/common/js/tool'
export default {
  name: 'Ele',
  data() {
    /* 自定义校验序号的规则 */
    let checkOrder = (rule, value, callback) => {
      /* 如果备份的元素序号为空则不校验 */
      if (this.elementNumberBalk === value) {
        callback()
      } else if (this.elementOrderArr_.includes(value)) {
        return callback(new Error('元素序号重复'))
      } else {
        callback()
      }
    }
    let checkOrder2 = (rule, value, callback) => {
      /* 以数字开头和结尾中间可使用-或.链接 */
      let reg = /^([0-9]|[0-9]\-|[0-9]\.)*[0-9]$/
      if (!reg.test(value)) {
        return callback(new Error('只能由数字或数字由-或.连接组成'))
      } else {
        callback()
      }
    }
    return {
      form: {},
      rules: {
        // elementNumber: [{ required: true, message: '请输入元素编号', trigger: 'blur' }, { validator: checkOrder, trigger: 'blur' }, { validator: checkOrder2, trigger: 'blur' }],
        elementName: [{ required: true, message: '请输入元素名称', trigger: 'blur' }, { min: 1, max: 12, message: '长度在1到12个字符', trigger: 'blur' }],
        optionValue: [{ required: true, message: '请输入选项', trigger: 'blur' }]
      },
      formLabelWidth: '120px',
      promptLanguage: [{ required: true, message: '请输入必填提示信息', trigger: 'blur' }, { min: 1, max: 12, message: '长度在1到12个字符', trigger: 'blur' }]
    }
  },
  props: {
    ele: {
      type: Object,
      required: true
    },
    elementOrderArr: {
      type: Array,
      default: []
    }
  },
  computed: {
    btnDisable() {
      return this.form.dictionaryTableDOList.length < 3
    },
    elementNumberBalk() {
      return this.ele.elementNumber
    },
    hasOptoins() {
      const componentType = +this.ele.componentType
      return [6, 7, 8].includes(componentType)
    },
    elementOrderArr_: {
      get() {
        return this.elementOrderArr
      }
    }
  },
  created() {
    this.form = deepClone(this.ele)
    this.form.isRequired = false
    /* 如果不是编辑是初始化dictionaryTableDOList */
    if (!(this.form.dictionaryTableDOList instanceof Array) || this.form.dictionaryTableDOList.length < 2) {
      this.form.dictionaryTableDOList = [deepClone(optionsMap), deepClone(optionsMap)]
    }
  },
  methods: {
    add(i) {
      const option = deepClone(optionsMap)
      this.form.dictionaryTableDOList.splice(i + 1, 0, option)
    },
    del(i) {
      this.form.dictionaryTableDOList.splice(i, 1)
    },
    validate() {
      this.$refs.formEle.validate(valid => {
        let hasnull = false
        if (this.hasOptoins) {
          /* 选项必填 */
          hasnull = this.form.dictionaryTableDOList.some(item => {
            return item.configValue === '' || null
          })
        }
        if (hasnull) {
          /* 添加一个验证标志 */
          this.form['valid'] = false
          this.$message.error('请填写选项内容')
        } else {
          /* 添加一个验证标志 */
          this.form['valid'] = valid
        }
      })
    },
    clickBtn(mode) {
      if (mode === 'confire') {
        this.validate()
        /* 如果表单验证错误 ,这不提交信息*/
        if (!this.form.valid) {
          return
        }
      }
      this.$emit('oprateBtn', { mode, data: this.form })
    }
  }
}
</script>

<style lang="scss" scoped>
.option-label {
  line-height: 40px;
}
.option {
  padding-left: 50px;
}
.option-box {
  display: flex;
  margin-bottom: 10px;
  .option-btn {
    margin-left: 10px;
  }
}
.select {
  color: red;
  >>> .el-form-item__content {
    width: 200px;
  }
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
