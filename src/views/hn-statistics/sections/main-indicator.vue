<template>
  <div class="container">
    <div class="party">
      <div class="indicator">
        <div class="indicator-name">
          医疗卫生机构
        </div>
        <div class="indicator-data">
          <div class="indicator-number">6030</div>
          <div class="unit-box">
            <div class="unit">单位</div>
            <div class="unit-name">家</div>
          </div>
          <div class="break-line"></div>
          <div class="rate">
            <div class="rate-name"><span>同比</span><span class="rate-val">10%</span></div>
            <div class="rate-name"><span>环比</span><span class="rate-val">10%</span></div>
          </div>
        </div>
      </div>
      <div class="break-point"></div>
    </div>
    <div class="party">
      <div class="indicator">
        <div class="indicator-name">
          公立医疗机构
        </div>
        <div class="indicator-data">
          <div class="indicator-number">6030</div>
          <div class="unit-box">
            <div class="unit">单位</div>
            <div class="unit-name">家</div>
          </div>
          <div class="break-line"></div>
          <div class="rate">
            <div class="rate-name"><span>同比</span><span class="rate-val">10%</span></div>
            <div class="rate-name"><span>环比</span><span class="rate-val">10%</span></div>
          </div>
        </div>
      </div>
      <div class="break-point"></div>
    </div>
    <div class="party">
      <div class="indicator">
        <div class="indicator-name">
          民营医疗机构
        </div>
        <div class="indicator-data">
          <div class="indicator-number">6030</div>
          <div class="unit-box">
            <div class="unit">单位</div>
            <div class="unit-name">家</div>
          </div>
          <div class="break-line"></div>
          <div class="rate">
            <div class="rate-name"><span>同比</span><span class="rate-val">10%</span></div>
            <div class="rate-name"><span>环比</span><span class="rate-val">10%</span></div>
          </div>
        </div>
      </div>
      <div class="break-point"></div>
    </div>
    <div class="party">
      <div class="indicator">
        <div class="indicator-name">
          医院数量
        </div>
        <div class="indicator-data">
          <div class="indicator-number">6030</div>
          <div class="unit-box">
            <div class="unit">单位</div>
            <div class="unit-name">家</div>
          </div>
          <div class="break-line"></div>
          <div class="rate">
            <div class="rate-name"><span>同比</span><span class="rate-val">10%</span></div>
            <div class="rate-name"><span>环比</span><span class="rate-val">10%</span></div>
          </div>
        </div>
      </div>
      <div class="break-point"></div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.indicator {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  .indicator-name {
    font-size: 0.2rem;
    color: rgb(159, 255, 225);
    font-weight: 600;
  }
}
.indicator-data {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .indicator-number {
    font-size: 0.2rem;
    font-weight: 600;
    color: #fff;
    margin-right: 8px;
  }
}
.unit-box {
  .unit {
    color: rgb(94, 105, 117);
  }
  .unit-name {
    color: #fff;
  }
}
.break-line {
  height: 100%;
  width: 1px;
  background: rgb(159, 255, 225);
  margin: 0 5px;
}
.rate {
  .rate-name {
    color: rgb(94, 105, 117);
  }
  .rate-val {
    color: #fff;
    margin-left: 8px;
  }
}
</style>
