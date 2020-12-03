<template>
  <div class="form-box">
    <div class="form" :key="i" v-for="(formConfig, i) in configs">
      <div class="form-name">
        {{ formConfig.surveyName }}
      </div>
      <dynamic-form :formConfig="formConfig" v-model="value"></dynamic-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FormPreview',
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
    background-color: #ecf5ff;
    border-color: #d9ecff;
    border-radius: 4px 4px 0 0;
  }
}
</style>
