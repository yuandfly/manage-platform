<template>
  <div>
    <el-form :model="eleForm" :inline="true" ref="msgForm" :rules="rules" class="form" :disabled="operateType === 1" size="small">
      <el-row class="top-row">
        <el-col :span="12">
          <el-form-item label="元素名称" prop="elementName" :label-width="formLabelWidth">
            <el-input v-model.trim="eleForm.elementName" autocomplete="off" placeholder="请输入元素名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="元素类型" :label-width="formLabelWidth" class="select">
            <el-select v-model="eleForm.componentType" prop="componentType" placeholder="请选择元素类型">
              <el-option label="文字框" :value="0"> </el-option>
              <el-option label="数字框" :value="4"> </el-option>
              <el-option label="单选框" :value="6"> </el-option>
              <el-option label="复选框" :value="7"> </el-option>
              <el-option label="下拉单选" :value="8"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称缩进" :label-width="formLabelWidth" class="select">
            <el-select v-model="eleForm.indentValue" placeholder="请选择缩进距离">
              <el-option label="无缩进" :value="0"> </el-option>
              <el-option label="一格" :value="10"> </el-option>
              <el-option label="两格" :value="20"> </el-option>
              <el-option label="三格" :value="30"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="占位长度" prop="rownum" :label-width="formLabelWidth" class="select">
            <el-select v-model="eleForm.rownum" placeholder="请选择元素占位长度">
              <el-option label="一列" :value="1"> </el-option>
              <el-option label="两列" :value="2"> </el-option>
              <el-option label="三列" :value="3"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="option" v-if="optionsShow">
          <div class="option-label">
            添加选项
          </div>
          <div class="option-box" v-for="(option, i) in eleForm.dictionaryTableDOList" :key="i">
            <el-input v-model="option.configValue" autocomplete="off" placeholder="请输入选项内容" style="width:357px" size="small"></el-input>
            <el-button-group>
              <el-button type="primary" icon="el-icon-plus" @click="add(i)" size="small"></el-button>
              <el-button type="primary" icon="el-icon-minus" :disabled="btnDisable" @click="del(i)" size="small"></el-button>
            </el-button-group>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div class="btn-box" v-if="operateType === 2">
      <el-button size="small" @click="cancel">取消</el-button>
      <el-button class="el-icon-check" type="primary" size="small" @click="save">保存</el-button>
    </div>
  </div>
</template>
<script>
import { optionsModel } from './model'
import { deepClone } from '@/common/js/tool'
import { updataElement } from '@/api/element/element'
import { mapState } from 'vuex'
export default {
  name: 'eleDialog',
  data() {
    return {
      eleForm: {},
      rules: {
        elementName: [{ required: true, message: '请输入元素名称', trigger: 'blur' }, { min: 1, max: 12, message: '长度在1到12个字符', trigger: 'blur' }],
        optionValue: [{ required: true, message: '请输入选项', trigger: 'blur' }],
        componentType: [{ required: true, message: '请选择元素类型', trigger: 'blur' }]
      },
      formLabelWidth: '120px',
      promptLanguage: [{ required: true, message: '请输入必填提示信息', trigger: 'blur' }, { min: 1, max: 12, message: '长度在1到12个字符', trigger: 'blur' }]
    }
  },
  props: {
    currentData: {
      type: Object,
      required: true,
      defualt: {}
    },
    operateType: {
      type: Number,
      required: true,
      defualt: 1
    }
  },
  created() {
    this.eleForm = this.currentData
  },
  computed: {
    btnDisable() {
      return this.eleForm.dictionaryTableDOList.length < 3
    },
    optionsShow() {
      let type = this.eleForm.componentType
      return type === 6 || type === 7 || type === 8 ? true : false
    }
  },
  methods: {
    cancel() {
      this.$emit('updata')
    },
    save() {
      this.validate()
      if (!this.eleForm['valid']) {
        return false
      }
      delete this.eleForm['valid']
      this.eleForm.isRequired = this.eleForm.isRequired ? 1 : 2
      this.eleForm.dataType = this.tranformType(this.eleForm.componentType)
      if (this.optionsShow) {
        this.eleForm.dictionaryTableDOList.forEach((option, i) => {
          option.ordernum = i
        })
      }
      updataElement(this.eleForm).then(
        res => {
          this.$message.success('保存成功！')
          this.$emit('updata')
        },
        error => {
          this.$message.error(`保存元素异常，${error}`)
        }
      )
    },
    add(i) {
      const option = deepClone(optionsModel)
      this.eleForm.dictionaryTableDOList.splice(i + 1, 0, option)
    },
    del(i) {
      this.eleForm.dictionaryTableDOList.splice(i, 1)
    },
    validate() {
      this.$refs.msgForm.validate(valid => {
        /* 选项必填 */
        let hasnull = false
        if (this.optionsShow) {
          hasnull = this.eleForm.dictionaryTableDOList.some(item => {
            return item.configValue === '' || null
          })
        }
        if (hasnull) {
          /* 添加一个验证标志 */
          this.eleForm['valid'] = false
          this.$message.error('请填写选项内容!')
        } else {
          /* 添加一个验证标志 */
          this.eleForm['valid'] = valid
        }
      })
    },
    /* 转换dataType */
    tranformType(type) {
      let type_ = 2
      switch (type) {
        case 4:
          type_ = 0 //数值 Number
          break
        case 2:
          type_ = 1 //日期 Data
          break
        default:
          type_ = 2 //字符 String
          break
      }
      return type_
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-box {
  margin-bottom: 8px;
  display: flex;
  justify-content: flex-end;
}
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
>>> .el-form-item__content {
  width: 400px;
}
>>> .el-input__inner {
  width: 400px;
}
</style>
