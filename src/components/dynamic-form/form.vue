<template>
  <el-form class="dynamic-form" inline label-width="220px" label-position="left" size="mini">
    <div class="module" :key="i" v-for="(m, i) in formConfig.basicModuleVOList">
      <div class="module-name" v-if="m.tableElementName">{{ m.tableElementName }}</div>
      <div class="form-item-box">
        <template v-for="item in m.basicElementVOList">
          <div class="form-item" :key="item.elementCode" v-if="item.state != 2">
            <div class="ele-number">{{ item.elementNumber }}</div>
            <dynamic-form-item :key="item.elementCode" :item="item" class="ele-component"></dynamic-form-item>
          </div>
        </template>
      </div>
    </div>
    <slot></slot>
  </el-form>
</template>

<script>
export default {
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
    // this.setDefaultValue()
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
.dynamic-form {
  padding: 5px;
}
.module {
  // border: 1px solid #ebeef5;
  margin-bottom: 5px;
  .module-name {
    padding: 5px 0;
    padding-left: 10px;
    border: 1px solid #ebeef5;
  }
  .form-item-box {
    display: grid;
    grid-template-columns: 33% 33% 33%;
    grid-column-gap: 0.5%;
    padding-top: 5px;
  }
  .form-item {
    display: flex;
    border: 1px solid #ebeef5;
    // margin-right: 8px;
    margin-bottom: 8px;
    .ele-number {
      display: flex;
      align-items: center;
      flex: 0 0 60px;
      padding-left: 5px;
      border-right: 1px solid #ebeef5;
    }
    .ele-component {
      padding-top: 3px;
      padding-bottom: 3px;
    }
    >>> .el-form-item {
      margin: 0;
      padding: 0;
    }
    >>> .el-form-item__label {
      padding-left: 5px;
    }
    >>> .el-form-item__content {
      padding: 3px;
      // border-left: 1px solid #ebeef5;
    }
  }
}
</style>
