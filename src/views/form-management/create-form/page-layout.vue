<template>
  <div class="page">
    <div class="btn">
      <slot name="generateBtn"></slot>
    </div>
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="form">
      <slot name="form"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PageLayout',
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.page {
  padding-top: 40px;
  position: relative;
  .header {
    text-align: center;
    font-size: 20px;
  }
  .form {
    margin-top: 10px;
    font-size: 14px;
  }
  .btn {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
