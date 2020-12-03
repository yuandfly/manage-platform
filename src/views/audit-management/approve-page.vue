<template>
  <div class="form-box">
    <div class="form" :key="i" v-for="(formConfig, i) in configs">
      <div class="form-name">
        {{ formConfig.surveyName }}
      </div>
      <approve-form :formConfig="formConfig" v-model="value"></approve-form>
    </div>
  </div>
</template>
<script>
import ApproveForm from './approve-form/form'
export default {
  name: 'ApprovePage',
  components: {
    'approve-form': ApproveForm
  },
  data() {
    return {
      value: {}
    }
  },
  props: {
    configs: {
      type: Array,
      required: true,
      default: []
    }
  },
  created() {
    console.log('接受的configs', this.configs)
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.form {
  margin-top: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  .form-name {
    font-size: 16px;
    padding-left: 20px;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ebeef5;
  }
}
</style>
