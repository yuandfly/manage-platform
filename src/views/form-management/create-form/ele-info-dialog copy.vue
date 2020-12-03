<template>
  <div class="ele-info-contanier">
    <custom-msg v-if="ele.componentType === '-1' || ele.componentType === -1" :ele="ele" ref="formEle"></custom-msg>
    <input-msg v-if="ele.componentType === '0' || ele.componentType === 0" :ele="ele" ref="formEle"></input-msg>
    <textarea-msg v-if="ele.componentType === '1' || ele.componentType === 1" :ele="ele" ref="formEle"></textarea-msg>
    <dateTime-msg v-if="ele.componentType === '2' || ele.componentType === 2" :ele="ele" ref="formEle"></dateTime-msg>
    <date-range-msg v-if="ele.componentType === '3' || ele.componentType === 3" :ele="ele" ref="formEle"></date-range-msg>
    <number-msg v-if="ele.componentType === '4' || ele.componentType === 4" :ele="ele" ref="formEle"></number-msg>
    <radio-msg v-if="ele.componentType === '6' || ele.componentType === 6" :ele="ele" ref="formEle"></radio-msg>
    <checkedbox-msg v-if="ele.componentType === '7' || ele.componentType === 7" :ele="ele" ref="formEle"></checkedbox-msg>
    <select-msg v-if="ele.componentType === '8' || ele.componentType === 8" :ele="ele" ref="formEle"></select-msg>
    <div class="dialog-footer">
      <el-button type="primary" @click="clickBtn('confire')">确 定 </el-button>
      <el-button @click="clickBtn('cancle')">取 消</el-button>
    </div>
  </div>
</template>

<script>
import InputMsg from './input/input-msg'
import TextareaMsg from './textarea/textarea-msg'
import RadioMsg from './radio/radio-msg'
import CheckedboxMsg from './checkedbox/checkedbox-msg'
import SelectMsg from './select/select-msg'
import DateTimeMsg from './date-time/date-time-msg'
import DateRangeMsg from './date-time-range/date-range-msg'
import NumberMsg from './number/number-msg'
import CustomMsg from './custom/custom-msg'
export default {
  name: 'EleInfo',
  components: {
    InputMsg,
    TextareaMsg,
    RadioMsg,
    CheckedboxMsg,
    SelectMsg,
    DateTimeMsg,
    DateRangeMsg,
    NumberMsg,
    CustomMsg
  },
  data() {
    return {}
  },
  computed: {
    form() {
      return this.$refs.formEle.form
    }
  },
  props: {
    ele: {
      type: Object,
      required: true
    }
  },
  methods: {
    clickBtn(mode) {
      if (mode === 'confire') {
        this.$refs.formEle.validate()
        /* 如果表单验证错误 ,这不提交信息*/
        if (!this.$refs.formEle.form.valid) {
          return
        }
      }
      this.$emit('oprateBtn', mode)
    }
  }
}
</script>

<style lang="scss" scoped>
.ele-info-contanier {
  padding-top: 10px;
  overflow: hidden;
  .dialog-footer {
    float: right;
  }
}
</style>
