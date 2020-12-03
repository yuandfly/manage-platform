<template>
  <el-select v-model="ele_.defaultValue" placeholder="请选择" size="mini">
    <el-option v-for="item in ele_.dictionaryTableDOList" :key="item.value" :label="item.configValue" :value="item.configValue"> </el-option>
  </el-select>
</template>

<script>
import { deepAssign } from '@/common/js/tool'
export default {
  name: 'SelectEle',
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
