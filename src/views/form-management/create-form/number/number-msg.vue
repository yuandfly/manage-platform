<template>
  <el-form :model="form" :inline="true" ref="msgForm" :rules="rules" class="form">
    <el-row>
      <el-col :span="12">
        <el-form-item label="元素编号" prop="elementNumber" :label-width="formLabelWidth">
          <el-input v-model.trim="form.elementNumber" autocomplete="off" placeholder="请输入元素编号"></el-input>
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
        <el-form-item label="占位长度" prop="rownum" :label-width="formLabelWidth" class="select">
          <el-select v-model="form.rownum" placeholder="请选择元素占位长度">
            <el-option label="一列" :value="1"> </el-option>
            <el-option label="两列" :value="2"> </el-option>
            <el-option label="三列" :value="3"> </el-option>
          </el-select>
        </el-form-item>
      </el-col>
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
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="是否必填" :label-width="formLabelWidth">
          <el-switch v-model="form.isRequired" active-color="#13ce66" inactive-color="#cccccc"> </el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="必填校验提示" :label-width="formLabelWidth" v-if="form.isRequired" prop="promptLanguage" :rules="promptLanguage">
          <el-input v-model.trim="form.promptLanguage" autocomplete="off" placeholder="请输入必填校验提示"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { deepClone } from '@/common/js/tool'
export default {
  name: 'NumberMsg',
  inject: ['parentForm'],
  data() {
    /* 自定义校验序号的规则 */
    let checkOrder = (rule, value, callback) => {
      console.log('this.elementNumberBalk', this.elementNumberBalk)
      if (this.elementNumberBalk === value) {
        callback()
      } else if (this.parentForm.elementOrderArr.includes(value)) {
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
        elementNumber: [{ required: true, message: '请输入元素编号', trigger: 'blur' }, { validator: checkOrder, trigger: 'blur' }, { validator: checkOrder2, trigger: 'blur' }],
        elementName: [{ required: true, message: '请输入元素名称', trigger: 'blur' }, { min: 1, max: 12, message: '长度在1到12个字符', trigger: 'blur' }]
        // rownum: [{ required: true, message: '请输入元素占位长度', trigger: 'change' }]
      },
      formLabelWidth: '120px',
      promptLanguage: [{ required: true, message: '请输入必填提示信息', trigger: 'blur' }, { min: 1, max: 12, message: '长度在1到12个字符', trigger: 'blur' }]
    }
  },
  props: {
    ele: {
      type: Object,
      required: true
    }
  },
  computed: {
    elementNumberBalk() {
      return this.ele.elementNumber
    }
  },
  created() {
    this.form = deepClone(this.ele)
    this.form.isRequired = false
  },
  methods: {
    validate() {
      this.$refs.msgForm.validate(valid => {
        /* 添加一个验证标志 */
        this.form['valid'] = valid
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.select {
  color: red;
  >>> .el-form-item__content {
    width: 200px;
  }
}
</style>
