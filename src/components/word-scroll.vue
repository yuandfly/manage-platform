<template>
  <div class="notice-box" ref="noticeBox">
    <div class="notice-message" @mouseenter="pause" @mouseleave="messagePlay" ref="notice">{{ noticeMessage }}</div>
  </div>
</template>

<script>
import { format } from '@/common/js/util'
export default {
  data() {
    return {
      noticeTimer: null
    }
  },
  props: {
    noticeMessage: {
      type: String,
      default: '现在时间：' + format(new Date(), 'yyyy-MM-dd hh:mm:ss')
    }
  },
  mounted() {
    this.messagePlay()
  },
  methods: {
    pause() {
      clearInterval(this.noticeTimer)
    },
    messagePlay() {
      const textWidth = this.$refs.notice.clientWidth
      const boxWidth = this.$refs.noticeBox.clientWidth
      let i = boxWidth
      this.noticeTimer = setInterval(() => {
        i--
        if (i < -textWidth) {
          i = boxWidth
        }
        this.$refs.notice.style.left = i + 'px'
      }, 20)
    }
  }
}
</script>

<style lang="scss" scoped>
.notice-box {
  position: relative;
  width: 300px;
  height: 40px;
  overflow: hidden;
  .notice-message {
    position: absolute;
    left: 100%;
    color: #99a9bf;
    cursor: default;
  }
}
</style>
