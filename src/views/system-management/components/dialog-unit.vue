<template>
  <div>
    <el-dialog :title="title" class="dialog-unit" :close-on-click-modal="false" :visible.sync="show" width="500px" @close="$emit('update:current_show', false)">
      <el-form :model="unit_form" :rules="rules" ref="ruleForm">
        <el-form-item label="单位名称" prop="detailedName">
          <el-input v-model="unit_form.detailedName" autocomplete="off" :disabled="unitNameChecking"></el-input>
        </el-form-item>
        <el-form-item label="组织机构代码" prop="organizationCode" :label-width="formLabelWidth">
          <el-input v-model="unit_form.organizationCode" autocomplete="off" :disabled="unitCodeChecking"></el-input>
        </el-form-item>
        <el-form-item label="单位电话" prop="unitPhone" :label-width="formLabelWidth">
          <el-input v-model="unit_form.unitPhone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位邮箱" prop="unitEmail" :label-width="formLabelWidth">
          <el-input v-model="unit_form.unitEmail" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位地址" prop="unitAddress" :label-width="formLabelWidth">
          <el-input v-model="unit_form.unitAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级级单位" prop="parentId" :label-width="formLabelWidth">
          <el-select v-model="unit_form.parentId" placeholder="请选择上级单位" class="unit-select">
            <el-option v-for="unit in parentUnits" :key="unit.organizationCode" :label="unit.detailedName" :value="unit.organizationCode"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="状态" prop="state" :label-width="formLabelWidth">
          <el-switch v-model="unit_form.state" active-color="#13ce66" active-text="启用" active-value="1" inactive-value="0"> </el-switch>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm" v-if="type === 1">添 加</el-button>
        <el-button type="primary" @click="saveForm" v-if="type === 2">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SelectUnitList from './select-unit-list'
import { addUnits, saveUnits, isHasUinit, getUnitsList2 } from '@/api/system/units'
export default {
  name: 'dialog-unit',
  components: { SelectUnitList },
  data() {
    let userEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    let unitNameCheckHas = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('单位名称不能为空'))
      }
      /* 编辑时，如果名称没有改变则不需要校验 */
      if (this.unit_form_blak.detailedName && value.trim() === this.unit_form_blak.detailedName) {
        return callback()
      }
      this.unitNameChecking = true
      isHasUinit({
        organizationCode: null,
        unitname: value.trim()
      }).then(res => {
        this.unitNameChecking = false
        if (res.data.code === 1) {
          callback(new Error('单位名称已存在'))
        } else {
          callback()
        }
      })
    }
    let unitCodeCheckHas = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('组织机构代码不能为空'))
      }
      if (this.unit_form_blak.organizationCode && value.trim() === this.unit_form_blak.organizationCode) {
        return callback()
      }
      this.unitCodeChecking = true
      isHasUinit({
        organizationCode: value.trim(),
        unitname: null
      }).then(res => {
        this.unitCodeChecking = false
        if (res.data.code === 1) {
          callback(new Error('组织机构代码已存在'))
        } else {
          callback()
        }
      })
    }
    return {
      unitNameChecking: false,
      unitCodeChecking: false,
      show: this.current_show,
      current_unit: this.currentUnit,
      parentUnits: [],
      formLabelWidth: '220',
      unit_form: {
        detailedName: '',
        organizationCode: '',
        unitAddress: '',
        parentId: '',
        unitEmail: '',
        unitPhone: '',
        state: null,
        id: null,
        remarks: null
      },
      unit_form_blak: {},
      rules: {
        detailedName: [{ required: true, message: '请输入单位名称', trigger: 'blur' }, { validator: unitNameCheckHas, trigger: 'blur' }],
        organizationCode: [{ required: true, message: '请输入组织机构代码', trigger: 'blur' }, { validator: unitCodeCheckHas, trigger: 'blur' }],
        unitPhone: [{ required: true, message: '请输入单位电话', trigger: 'blur' }],
        unitEmail: [{ validator: userEmail, trigger: 'blur' }, { type: 'email', required: true, message: '请输入单位邮箱', trigger: 'blur' }],
        unitAddress: [{ required: true, message: '请输入单位地址', trigger: 'blur' }]
        // parentId: [{ required: true, message: '请选择上级单位', trigger: 'blur' }]
      }
    }
  },
  props: {
    current_show: {
      type: Boolean,
      default: true
    },
    type: {
      type: Number
    },
    currentUnit: {}
  },
  watch: {
    current_show() {
      this.show = this.current_show
      if (this.type === 1) {
        this.reset()
      } else if (this.type === 2) {
        this.current_unit = JSON.parse(JSON.stringify(this.currentUnit))
        this.unit_form = this.current_unit
        this.unit_form.state = this.unit_form.state.toString()
      }
    },
    unit_form: {
      handler(newValue, oldValue) {},
      deep: true
    }
  },
  mounted() {
    this.getUnits()
  },
  computed: {
    title() {
      if (this.type === 1) {
        return '添加单位'
      } else if (this.type === 2) {
        /* 如果是编辑，对数据进行备份 */
        this.unit_form_blak = this.currentUnit
        return '编辑单位'
      }
    }
  },
  methods: {
    cancel() {
      this.show = false
    },
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.add()
        }
      })
    },
    saveForm() {
      console.log('q', this.$refs['ruleForm'])
      this.$refs['ruleForm'].validate(valid => {
        console.log('q', this.$refs['ruleForm'])
        if (valid) {
          this.save()
        }
      })
    },
    add() {
      addUnits(this.unit_form).then(res => {
        if (res.data.code === 0) {
          this.$message({
            message: `添加单位【${this.unit_form.detailedName}】成功。`,
            type: 'success'
          })
          // 重置
          this.reset()
          // 添加成功关闭dialog
          this.cancel()
          // 刷新父组件列表
          this.$parent.getList()
        } else {
          this.$message({
            message: `添加单位【${this.unit_form.detailedName}】失败，${res.data.msg}`,
            type: 'error'
          })
        }
      })
    },
    save() {
      saveUnits(this.unit_form).then(res => {
        if (res.data.code === 0) {
          this.$message({
            message: `修改单位【${this.unit_form.detailedName}】成功。`,
            type: 'success'
          })
          // 重置
          this.reset()
          // 添加成功关闭dialog
          this.cancel()
          // 刷新父组件列表
          this.$parent.getList()
        } else {
          this.$message({
            message: `修改单位【${this.unit_form.detailedName}】失败。`,
            type: 'error'
          })
        }
      })
    },
    reset() {
      this.unit_form = {
        detailedName: '',
        organizationCode: '',
        unitAddress: '',
        parentId: '',
        unitEmail: '',
        unitPhone: '',
        state: null,
        id: null,
        remarks: null
      }
    },
    getUnits() {
      getUnitsList2().then(res => {
        this.parentUnits = res.data.data
      })
    }
  }
}
</script>

<style scoped>
.dialog-unit /deep/ .el-form-item__content {
  margin-left: 110px;
}
.unit-select /deep/.el-select {
  width: 100%;
}
</style>
