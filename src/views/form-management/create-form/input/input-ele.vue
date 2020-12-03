<template>
  <div>
    <el-input :placeholder="ele_.placeholder" :disabled="true" size="mini"> </el-input>
  </div>
</template>

<script>
import { deepAssign } from '@/common/js/tool'
export default {
  name: 'InputEle',
  data() {
    return {
      ele_: {}
    }
  },
  props: {
    ele: {
      type: Object,
      required: true
    }
  },
  beforeMount() {
    this.ele_ = deepAssign(this.ele_, this.ele)
  }
}
</script>

<style lang="scss" scoped></style>
