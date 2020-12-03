<script>
import NoticeList from '@/views/notice-management/notice-list'
export default {
  extends: NoticeList,
  watch: {
    addFlag(val) {
      this.$emit('getTotal')
    }
  }
}
</script>
