<template>
  <div>
    <span>--{{ ele_.remark }}--</span>
  </div>
</template>

<script>
import { deepAssign } from '@/common/js/tool'
export default {
  name: 'CustomEle',
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
