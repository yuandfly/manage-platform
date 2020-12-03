<template>
  <div>
    <el-input-number controls-position="right" :min="-10000" :max="10000" disabled size="mini"></el-input-number>
  </div>
</template>

<script>
import { deepAssign } from '@/common/js/tool'
export default {
  name: 'NumberEle',
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
