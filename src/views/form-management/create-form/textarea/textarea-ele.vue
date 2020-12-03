<template>
  <div>
    <el-input type="text" :placeholder="ele_.placeholder" :disabled="true" size="mini"> </el-input>
  </div>
</template>

<script>
export default {
  name: 'TextareaEle',
  data() {
    return {
      ele_: {
        value: '',
        valueKey: '',
        placeholder: '请输入',
        maxlength: 50
      }
    }
  },
  props: {
    ele: {
      type: Object,
      required: true
    }
  },
  beforeMount() {
    this.ele_ = Object.assign(this.ele_, this.ele)
  }
}
</script>

<style lang="scss" scoped></style>
