<script>
import PublishFill from '../fill-management/fill-publish/index'
export default {
  name: 'SendFill',
  extends: PublishFill,
  watch: {
    'pageObj.total'(val) {
      this.$emit('getTotal', { componentName: 'SendFill', total: val })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  margin-top: 0;
}
</style>
