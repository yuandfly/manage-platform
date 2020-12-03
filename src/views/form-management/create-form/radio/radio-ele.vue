<template>
  <el-radio-group v-model="ele_.defaultValue" size="mini">
    <el-radio disabled :key="i" v-for="(item, i) in ele_.dictionaryTableDOList" :label="item.configValue">{{ item.configValue }}</el-radio>
  </el-radio-group>
</template>

<script>
import { deepAssign } from '@/common/js/tool'
export default {
  name: 'RadioEle',
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
