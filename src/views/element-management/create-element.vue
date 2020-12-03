<template>
  <div class="page-container">
    <div class="btn-box">
      <el-button class="el-icon-check" type="primary" size="mini" @click="generate">生成元素</el-button>
    </div>
    <el-card>
      <el-form :model="eleForm" ref="msgForm" :rules="rules" label-width="80px" size="mini" class="ele-form">
        <el-row class="top-row">
          <el-col :span="12">
            <el-form-item label="元素名称" prop="elementName">
              <el-input v-model.trim="eleForm.elementName" autocomplete="off" placeholder="请输入元素名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="元素类型">
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
            <el-form-item label="名称缩进">
              <el-select v-model="eleForm.indentValue" placeholder="请选择缩进距离">
                <el-option label="无缩进" :value="0"> </el-option>
                <el-option label="一格" :value="10"> </el-option>
                <el-option label="两格" :value="20"> </el-option>
                <el-option label="三格" :value="30"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="占位长度" prop="rownum">
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
              <el-input v-model="option.configValue" autocomplete="off" placeholder="请输入选项内容" size="mini"></el-input>
              <el-button type="primary" icon="el-icon-plus" @click="add(i)" size="mini"></el-button>
              <el-button type="primary" icon="el-icon-minus" :disabled="btnDisable" @click="del(i)" size="mini"></el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { elementModel, optionsModel } from './model'
import { deepClone } from '@/common/js/tool'
import { createElement } from '@/api/element/element'
import { mapState } from 'vuex'
export default {
  name: 'createEle',
  data() {
    return {
      eleForm: {},
      // optionsShow: false,
      rules: {
        elementName: [{ required: true, message: '请输入元素名称', trigger: 'blur' }, { min: 1, max: 12, message: '长度在1到12个字符', trigger: 'blur' }],
        optionValue: [{ required: true, message: '请输入选项', trigger: 'blur' }],
        componentType: [{ required: true, message: '请选择元素类型', trigger: 'blur' }]
      },
      promptLanguage: [{ required: true, message: '请输入必填提示信息', trigger: 'blur' }, { min: 1, max: 12, message: '长度在1到12个字符', trigger: 'blur' }]
    }
  },
  created() {
    this.eleForm = deepClone(elementModel)
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
  watch: {
    optionsShow(val) {
      if (val) {
        this.eleForm.dictionaryTableDOList = [deepClone(optionsModel), deepClone(optionsModel)]
      } else {
        this.eleForm.dictionaryTableDOList = []
      }
    }
  },
  methods: {
    generate() {
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
      createElement(this.eleForm).then(
        res => {
          if (res.code === 1) {
            this.$message.warning('元素已存在！')
            return
          }
          this.$message.success('创建成功！')
          this.$router.push('/home/form/element-list')
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
.option-box {
  display: flex;
  flex-wrap: nowrap;
  margin-bottom: 10px;
  .option-btn {
    margin-left: 10px;
  }
}
.ele-form {
  >>> .el-select {
    width: 100%;
  }
}
</style>
