<template>
  <div class="notice">
    <div class="notice-item el-row ">
      <div class="el-col" @click="tab('0')" :class="{ active: active === '0' }">
        <div class="notice-img">
          <img src="../../assets/img/tongzhi.svg" />
        </div>
        <div class="notice-desc">
          <div class="notice-number">{{ noticeTotal }}</div>
          <div class="notice-txt">公告统计</div>
        </div>
      </div>
      <div class="el-col" @click="tab('1')" :class="{ active: active === '1' }">
        <div class="notice-img">
          <img src="../../assets/img/guanli.svg" />
        </div>
        <div class="notice-desc">
          <div class="notice-number">{{ noAuditTotal }}</div>
          <div class="notice-txt">待审核填报</div>
        </div>
      </div>
      <div class="el-col" @click="tab('2')" :class="{ active: active === '2' }">
        <div class="notice-img">
          <img src="../../assets/img/renwu.svg" />
        </div>
        <div class="notice-desc">
          <div class="notice-number">{{ sendFillTotal }}</div>
          <div class="notice-txt">已下发填报计划</div>
        </div>
      </div>

      <div class="el-col" @click="tab('4')" :class="{ active: active === '4' }">
        <div class="notice-img">
          <img src="../../assets/img/jixiao.svg" />
        </div>
        <div class="notice-desc">
          <!-- <div class="notice-number">图表</div> -->
          <div class="notice-txt">审核统计分析</div>
        </div>
      </div>
    </div>
    <div class="content">
      <transition mode="out-in">
        <notice-release @getTotal="getTotals" v-if="active === '0'"></notice-release>
        <no-audit v-if="active === '1'"></no-audit>
        <send-fill v-if="active === '2'"></send-fill>
        <chart v-if="active === '3'"></chart>
        <audit-statistics v-if="active === '4'"></audit-statistics>
      </transition>
    </div>
  </div>
</template>

<script>
import NoticeRelease from './notice-release'
import NoAudit from './no-audit'
import SendFill from './send-fill'
import Chart from './chart/index'
import AuditStatistics from './audit-statistics' //统计
import { getNoAuditList } from '@/api/approve/approve' //未审核的填报
import { getPlanList } from '@/api/system/fill-management' //已下发的填报
import { getNotices } from '@/api/notice/notice'
export default {
  name: 'MyDesktop',
  components: {
    NoticeRelease,
    'no-audit': NoAudit,
    'send-fill': SendFill,
    Chart,
    AuditStatistics
  },
  data() {
    return {
      active: '0',
      noAuditTotal: null,
      sendFillTotal: null,
      noticeTotal: null
    }
  },
  created() {
    this.active = sessionStorage.getItem('desktopTabsActive') ? sessionStorage.getItem('desktopTabsActive') : '0'
    this.getTotals()
  },
  methods: {
    getTotals() {
      const p0 = getNotices({
        page: 1,
        size: 10
      })
      const p1 = getNoAuditList({
        page: 1,
        size: 10
      })
      const p2 = getPlanList({
        page: 1,
        size: 10
      })
      Promise.all([p0, p1, p2]).then(
        res => {
          this.noticeTotal = res[0].data.total
          this.noAuditTotal = res[1].data.total
          this.sendFillTotal = res[2].data.total
        },
        error => {
          throw '主页请求所有数据的total失败${error}'
        }
      )
    },
    /* 从子组件获取总条数,子组件传送{componentName,total}*/
    getTotal($event) {
      switch ($event.componentName) {
        case 'NoAudit':
          // this.noAuditTotal = $event.total
          break
        case 'SendFill':
          // this.sendFillTotal = $event.total
          break
        default:
          break
      }
    },
    /* 切换tabs */
    tab(num) {
      this.active = num
      sessionStorage.setItem('desktopTabsActive', this.active)
      this.getTotals()
    }
  }
}
</script>

<style lang="scss" scoped>
.active {
  background-color: #409eff !important;
  .notice-number {
    font-size: 30px !important;
    color: tomato !important;
  }
  .notice-txt {
    color: #fff !important;
  }
}
.notice {
  padding: 10px;
}
.notice-item {
  .notice-img {
    padding: 10px;
    float: left;
    max-width: 60px;
    img {
      width: 100%;
    }
  }
  .notice-desc {
    float: right;
    flex: 1;
    text-align: center;
    padding-right: 20px;
    div {
      font-size: 16px;
      color: #333;
    }
    // .notice-number {
    //   font-size: 40px;
    //   color: tomato;
    // }
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 30px;
    background-color: #fff;
    border-radius: 10px;
    border: none;
    position: relative;
    margin-bottom: 30px;
    box-shadow: 0 0.46875rem 2.1875rem rgba(90, 97, 105, 0.1), 0 0.9375rem 1.40625rem rgba(90, 97, 105, 0.1), 0 0.25rem 0.53125rem rgba(90, 97, 105, 0.12), 0 0.125rem 0.1875rem rgba(90, 97, 105, 0.1);
  }
}

.el-row {
  display: flex;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  cursor: pointer;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
</style>
