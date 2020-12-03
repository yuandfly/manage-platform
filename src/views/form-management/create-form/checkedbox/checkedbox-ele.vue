<template>
  <el-checkbox-group>
    <el-checkbox disabled :key="i" v-for="(item, i) in ele_.dictionaryTableDOList" :label="item.configValue" size="mini">{{ item.configValue }}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
import { deepAssign } from '@/common/js/tool'
export default {
  name: 'CheckedboxEle',
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
