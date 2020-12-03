<template>
  <el-form class="dynamic-form">
    <div class="module" :key="i" v-for="(m, i) in formConfig.basicModuleVOList">
      <div class="module-name">{{ m.tableElementName }}</div>
      <div class="form-item">
        <template v-for="item in m.surveyUnitResultDOList">
          <approve-form-item :key="item.elementCode" :item="item" v-model="item.submitResult"></approve-form-item>
        </template>
      </div>
    </div>
    <slot></slot>
  </el-form>
</template>

<script>
import ApproveFormItem from './item'
export default {
  name: 'ApproveForm',
  components: {
    'approve-form-item': ApproveFormItem
  },
  props: {
    formConfig: {
      type: Object,
      required: true
    },
    value: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.setDefaultValue()
  },
  methods: {
    handleInput(val, key) {
      // 这里element-ui没有上报event，直接就是value了
      this.$emit('input', { ...this.value, [key]: val })
    },
    setDefaultValue() {
      // 设置默认值
      const formData = { ...this.value }
      if (!this.formConfig.basicModuleVOList) {
        return false
      }
      this.formConfig.basicModuleVOList.forEach(module => {
        if (module.basicElementVOList) {
          module.basicElementVOList.forEach(item => {
            const { elementCode, defaultValue } = item
            if (formData[defaultValue] === undefined || formData[defaultValue] === null) {
              formData[defaultValue] = defaultValue
            }
          })
        }
      })
      this.$emit('input', { ...formData })
    }
  }
}
</script>

<style lang="scss" scoped>
.module {
  display: flex;
  border-bottom: 1px solid #ebeef5;
  .module-name {
    flex: 0 0 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid #ebeef5;
  }
  .form-item {
    display: flex;
    flex-wrap: wrap;
    padding-top: 18px;
    .el-form-item {
      display: flex;
      color: #909399;
    }
  }
}
.module:last-of-type {
  border-bottom: none;
}
</style>
