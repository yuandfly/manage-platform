<template>
  <div class="header">
    <div class="title">{{ headinfo.surveyName }}</div>
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
  name: 'HeadPreview',
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
  // color: #34495e;
  .title {
    text-align: center;
    font-size: 16px;
  }
  .item-box {
    padding-left: 35px;
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
  .item-label {
    color: #99a9bf;
  }
  .item-name {
    padding-left: 8px;
  }
}
</style>
