<template>
  <div class="element-box">
    <!-- 大于5才能配置options -->
    <custom-ele v-if="eleInfo.componentType === '-1' || eleInfo.componentType === -1" :ele="eleInfo"></custom-ele>
    <input-ele v-if="eleInfo.componentType === '0' || eleInfo.componentType === 0" :ele="eleInfo"></input-ele>
    <textarea-ele v-if="eleInfo.componentType === '1' || eleInfo.componentType === 1" :ele="eleInfo"></textarea-ele>
    <date-time-ele v-if="eleInfo.componentType === '2' || eleInfo.componentType === 2" :ele="eleInfo"></date-time-ele>
    <date-range-ele v-if="eleInfo.componentType === '3' || eleInfo.componentType === 3" :ele="eleInfo"></date-range-ele>
    <number-ele v-if="eleInfo.componentType === '4' || eleInfo.componentType === 4" :ele="eleInfo"></number-ele>
    <radio-ele v-if="eleInfo.componentType === '6' || eleInfo.componentType === 6" :ele="eleInfo"></radio-ele>
    <checkedbox-ele v-if="eleInfo.componentType === '7' || eleInfo.componentType === 7" :ele="eleInfo"></checkedbox-ele>
    <select-ele v-if="eleInfo.componentType === '8' || eleInfo.componentType === 8" :ele="eleInfo"></select-ele>
  </div>
</template>
<script>
import InputEle from './input/input-ele'
import TextareaEle from './textarea/textarea-ele'
import RadioEle from './radio/radio-ele'
import CheckedboxEle from './checkedbox/checkedbox-ele'
import SelectEle from './select/select-ele'
import DateTimeEle from './date-time/date-time-ele'
import DateRangeEle from './date-time-range/date-range-ele'
import NumberEle from './number/number-ele'
import CustomEle from './custom/custom-ele'
export default {
  name: 'ElementSelect',
  components: {
    InputEle,
    TextareaEle,
    RadioEle,
    CheckedboxEle,
    SelectEle,
    DateTimeEle,
    DateRangeEle,
    NumberEle,
    CustomEle
  },
  props: {
    eleInfo: {
      type: Object,
      required: true
    }
  },
  created() {
    console.log('修改更新', this.eleInfo)
  }
}
</script>

<style lang="scss" scoped>
.element-box {
  position: relative;
  // line-height: 40px;
  padding: 3px;
}
</style>
