<template>
  <div class="all-view">
    <div class="hn-chart-container">
      <div class="header">
        <div class="header-title">海南省中医院数据总览</div>
        <div class="header-nav" @click="intoSys">进入系统</div>
      </div>
      <div class="first-row">
        <div class="first-1">
          <div class="section-title">重要指标</div>
          <span class="chart-border"></span>
          <div class="main-indicator party-bgc">
            <main-indicator></main-indicator>
          </div>
          <span class="chart-border"></span>
        </div>
        <div class="first-2">
          <div class="section-title">医疗机构分布</div>
          <span class="chart-border"></span>
          <div class="hn-earth party-bgc">
            <hn-earth></hn-earth>
          </div>
          <span class="chart-border"></span>
        </div>
        <div class="first-3">
          <div class="section-title">医疗资源配比分析</div>
          <span class="chart-border"></span>
          <div class="resource-matching party-bgc">
            <resource-matching></resource-matching>
          </div>
          <span class="chart-border"></span>
        </div>
      </div>
      <div class="second-row">
        <div class="second-1">
          <div class="section-title">医疗卫生机构区域分布</div>
          <span class="chart-border"></span>
          <div class="distribution party-bgc">
            <distribution></distribution>
          </div>
          <span class="chart-border"></span>
        </div>
        <div class="second-2">
          <div class="section-title">医疗卫生资源变化趋势</div>
          <span class="chart-border"></span>
          <div class="change-trend party-bgc">
            <change-trend></change-trend>
          </div>
          <span class="chart-border"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MainIndicator from './sections/main-indicator'
import HnEarth from './sections/hn-earth'
import ResourceMatching from './sections/resource-matching'
import Distribution from './sections/distribution'
import ChangeTrend from './sections/change-trend'

export default {
  components: {
    MainIndicator,
    HnEarth,
    ResourceMatching,
    Distribution,
    ChangeTrend
  },
  methods: {
    intoSys() {
      this.$router.push({ path: '/Home' })
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 60px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  align-content: center;
  .header-title {
    flex: 1;
    text-align: center;
    font-size: 0.3rem;
    letter-spacing: 10px;
    color: #fff;
  }
  .header-nav {
    flex: 0 0 100px;
    padding: 0 10px;
    text-align: center;
    font-size: 0.2rem;
    color: #fff;
    cursor: pointer;
  }
}
.section-title {
  font-size: 0.2rem;
  color: #fff;
  margin: 8px 0;
}
.party-bgc {
  background: rgba(2, 29, 54, 0.6);
  padding: 0;
  margin: 0;
}
.chart-border {
  display: block;
  position: relative;
  height: 1px;
  width: 100%;
  margin: 0;
  background: rgb(159, 255, 255);
  &::before {
    display: block;
    content: '';
    height: 4px;
    width: 4px;
    border-radius: 2px;
    background: rgb(159, 255, 255);
    position: absolute;
    left: 0;
    top: -2px;
  }
  &::after {
    display: block;
    content: '';
    height: 4px;
    width: 4px;
    border-radius: 2px;
    background: rgb(159, 255, 255);
    position: absolute;
    right: 0;
    top: -2px;
  }
}
.hn-chart-container {
  min-height: 100vh;
  width: 100%;
  background: url('../../assets/img/hntongji.png') no-repeat center;
  background-size: 100% 100%;
}

.first-row {
  padding: 8px;
  display: flex;
  justify-content: space-between;
  .first-1,
  .first-3 {
    flex: 2;
  }
  .first-2 {
    flex: 3;
    margin: 0 0.25rem;
  }
  .main-indicator {
    width: 100%;
    height: 5.65rem;
  }
  .hn-earth {
    width: 100%;
    height: 5.65rem;
  }
  .resource-matching {
    width: 100%;
    height: 5.65rem;
  }
}
.second-row {
  display: flex;
  padding: 8px;
  margin-top: 0.8rem;
  justify-content: space-between;
  .second-1 {
    flex: 1;
    margin-right: 0.125rem;
  }
  .second-2 {
    flex: 1;
    margin-left: 0.125rem;
  }
  .distribution {
    width: 100%;
    height: 3rem;
  }
  .change-trend {
    width: 100%;
    height: 3rem;
  }
}
</style>

<style>
/* 约束屏幕尺寸 */
@media screen and (min-width: 1441px) {
  html {
    font-size: 80px !important;
  }
}
@media screen and (max-width: 1440px) and (min-width: 1025px) {
  html {
    font-size: 60px !important;
  }
}
@media screen and (max-width: 1024px) {
  html {
    font-size: 42px !important;
  }
}
</style>
