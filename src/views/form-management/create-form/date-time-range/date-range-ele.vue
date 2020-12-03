<template>
  <div>
    <el-date-picker :disabled="true" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="mini"> </el-date-picker>
  </div>
</template>

<script>
import { deepAssign } from '@/common/js/tool'
export default {
  name: 'DateRangeEle',
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
