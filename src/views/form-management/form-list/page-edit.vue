<template>
  <div>
    <create-form></create-form>
  </div>
</template>

<script>
import CreateForm from '../create-form/index'
import { mapMutations } from 'vuex'
export default {
  components: {
    CreateForm
  },
  created() {
    /* 将状态改为修改表单 */
    this.changeEdit(true)
  },
  methods: {
    ...mapMutations(['changeEdit']),
    getFormDate() {
      return JSON.parse(localStorage.getItem('formData'))
    }
  }
}
</script>

<style lang="scss" scoped></style>
