<template>
  <div class="header">
    <h3 class="title">{{ headinfo.surveyName }}</h3>
    <div class="item-box">
      <div class="item-row">
        <div class="item-info">
          <span class="item-label">制定机关:</span><span class="item-name">{{ headinfo.submitUnit }}</span>
        </div>
        <div class="item-info">
          <span class="item-label">批准机关:</span><span class="item-name">{{ headinfo.approveUnit }}</span>
        </div>
      </div>
      <div class="item-row">
        <div class="item-info">
          <span class="item-label">批准文号:</span><span class="item-name">{{ headinfo.approveNo }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApproveHead',
  props: {
    headinfo: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  margin-top: 20px;
  .title {
    text-align: center;
  }
  .item-row {
    margin: 15px 0;
    display: flex;
    justify-content: space-between;
    .item-info {
      display: table-cell;
      width: 300px;
    }
  }
}
</style>
