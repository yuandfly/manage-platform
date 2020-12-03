<template>
  <div :style="{ 'min-height': minHeight }">
    <span>
      {{ text }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '暂无数据'
    },
    minHeight: {
      type: String,
      default: '60px'
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  height: 100%;
  padding: 30px;
  text-align: center;
  opacity: 0.3;
}
</style>
