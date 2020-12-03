<template>
  <div>
    <el-date-picker :disabled="true" type="datetime" :placeholder="ele_.placeholder" default-time="12:00:00" size="mini"> </el-date-picker>
  </div>
</template>

<script>
import { deepAssign } from '@/common/js/tool'
export default {
  name: 'DateTimeEle',
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
