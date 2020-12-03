<template>
  <div class="notice">
    <div class="conditions">
      <el-form :inline="true" :model="conditions" size="small">
        <el-form-item>
          <el-input v-model.trim="conditions.noticeName" placeholder="请输入公告名称" clearable></el-input>
        </el-form-item>
        <el-form-item label-width="80" v-if="pageType !== 'noticeDraft'">
          <el-select v-model="conditions.state" placeholder="全部">
            <el-option label="全部" :value="null"> </el-option>
            <el-option label="已发布" :value="0"> </el-option>
            <el-option label="草稿" :value="1"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>公告列表</span>
        <el-button style="float: right;" size="mini" type="primary" @click="visible = true" v-if="pageType !== 'noticeDraft'">添加公告</el-button>
      </div>
      <el-table :data="dataList" style="width: 100%">
        <el-table-column prop="title" label="标题">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="noticeState" label="状态" width="100">
          <template slot-scope="scope">
            <span :class="scope.row.noticeState === 1 ? 'table-state-warning' : 'table-state-success'">{{ scope.row.noticeState === 1 ? '草稿' : '已发布' }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="title" label="创建时间" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | timeFormat('yyyy-MM-dd') }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-link type="primary" @click="noticeClick(scope.row)" v-if="scope.row.noticeState === 0">查看</el-link>
            <el-link type="primary" @click="edit(scope.row)" v-if="scope.row.noticeState === 1">编辑</el-link>
            <el-link type="danger" @click="del(scope.row)">删除</el-link>
            <!-- <el-link type="warnning" v-if="scope.row.bz === 0" @click="wasteNotice(scope.row)">废弃</el-link> -->
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right;padding-bottom: 10px;">
        <el-pagination style="text-align: center;margin-top: 15px;" background layout="total, prev, pager, next" :total="total" :current-page.sync="now_page" :page-size="limit"> </el-pagination>
      </div>
    </el-card>
    <!-- 创建、编辑 -->
    <div v-if="visible">
      <el-dialog title="添加公告" fullscreen :modal="false" :visible.sync="visible" @close="closeDialog">
        <el-form label-position="top">
          <el-form-item label="公告标题" label-width="80">
            <el-input v-model.trim="noticeTitle"></el-input>
          </el-form-item>
          <el-form-item label="通知单位" label-width="80" class="notice-select">
            <el-select v-model="noticeUsers" value-key="organizationCode" multiple placeholder="请选择">
              <el-option v-for="item in units" :key="item.organizationCode" :label="item.detailedName" :value="item"> </el-option>
            </el-select>
          </el-form-item>
          <wang-editor @htmlData="getContent" :catchData="catchData"></wang-editor>
          <el-form-item>
            <el-button style="float: right; margin: 20px;" size="small" @click="addNotice(1)">保存草稿</el-button>
            <el-button style="float: right;margin-top:20px" type="primary" size="small" @click="addNotice(0)">立即发布</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!-- 查看 -->
    <div v-if="showNoticeVisible">
      <el-dialog title="查看公告" fullscreen :close-on-click-modal="false" :visible="showNoticeVisible" @close="showNoticeVisible = false">
        <el-card>
          <div slot="header" style="font-size:26px;text-align: center;">
            {{ currentNotice.title }}
          </div>
          <div style="text-align: center;color: darkgray;margin-bottom:10px">发布单位：{{ currentNotice.unitName }}&nbsp;&nbsp; 发布时间：{{ currentNotice.createTime }}&nbsp;&nbsp;</div>
          <div style="color: darkgray;">接收单位：{{ recieveUnit }}</div>
          <div v-html="currentNotice.content" style="padding: 30px;"></div>
        </el-card>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import WangEditor from '@/components/toolbar/wang-editor'
import { createNotice, getNotices, delNotice, getDetail } from '@/api/notice/notice'
import { getUnitList } from '@/api/system/fill-management'
export default {
  name: 'NoticeList',
  components: { WangEditor },
  data() {
    return {
      pageType: 'noticeAll',
      conditions: {
        noticeName: '',
        state: ''
      },
      noticeUsers: [],
      /* 下级单位列表 */
      units: [],
      visible: false,
      showNoticeVisible: false,
      dataList: [],
      isShow: true,
      catchData: '',
      innerHtmlData: '',
      noticeTitle: '',
      limit: 10,
      now_page: 1,
      total: 0,
      currentNotice: {
        title: '',
        createUser: '',
        createTime: '',
        content: '',
        noticeUserDOList: []
      },
      /* 查询转态，null 全部 0发布，1草稿 */
      state: null,
      /* 添加标记，用户桌面组件更新总数 */
      addFlag: false,
      noticeId: ''
    }
  },
  computed: {
    recieveUnit() {
      const names = this.currentNotice.noticeUserDOList.map(item => {
        return item.unitName
      })
      return names.join(' , ')
    }
  },
  watch: {
    now_page() {
      this.getList()
    }
  },
  created() {
    this.getList()
    this.getUnits()
  },
  methods: {
    getList() {
      let params = {
        size: this.limit,
        page: this.now_page,
        plianCode: this.conditions.noticeName,
        state: this.state
      }
      getNotices(params).then(res => {
        if (res.code === 0) {
          this.dataList = res.data.content
          this.total = res.data.total
        }
        this.addFlag = !this.addFlag
      })
    },
    /* 获取发送单位 */
    getUnits() {
      getUnitList().then(res => {
        this.units = res.data
      })
    },
    /* 获取编辑器内容 */
    getContent(ev) {
      this.innerHtmlData = ev
    },
    /* 保存公告 */
    addNotice(type) {
      if (!this.noticeTitle) {
        this.$message.warning('请填写公告名称！')
        return
      }
      if (type === 0 && this.noticeUsers.length < 1) {
        this.$message.warning('请选择通知单位！')
        return
      }
      /* 选中的下级单位 */
      const noticeUserDOList = this.noticeUsers.map(item => {
        return {
          unitCode: item.organizationCode,
          unitName: item.detailedName
        }
      })
      const params = {
        noticeState: type,
        title: this.noticeTitle,
        content: this.innerHtmlData,
        id: this.noticeId ? this.noticeId : '',
        noticeUserDOList
      }
      createNotice(params).then(res => {
        if (res.code === 0) {
          this.$message.success(type === 0 ? '发布公告成功' : '保存公告成功')
          this.getList()
          this.visible = false
          /* 情况编辑器 */
          this.noticeTitle = ''
          this.noticeUsers = []
          this.catchData = ''
        }
      })
    },
    noticeClick(row) {
      getDetail({ id: row.id }).then(res => {
        this.currentNotice = res.data
        this.showNoticeVisible = true
      })
    },
    /* 删除 */
    del(row) {
      this.$confirm(`确定删除吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delNotice({ id: row.id }).then(res => {
          if (res.code === 0) {
            this.getList()
            this.$message.success('删除成功')
          }
        })
      })
    },
    wasteNotice(row) {
      this.$confirm(`确定废弃吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: row.id
        }
        dropNotice(params).then(res => {
          if (res.data.code === 0) {
            this.$message.success('废弃成功')
            this.getList()
            this.visible = false
          } else if (res.data.code === -1) {
            this.$message.error(res.data.msg)
          }
        })
      })
    },
    /* 编辑操作 */
    edit(row) {
      this.visible = true
      this.noticeTitle = row.title
      this.noticeId = row.id
      this.catchData = row.content
    },
    onSubmit() {
      this.state = this.conditions.state
      this.getList()
    },
    closeDialog() {
      /* 情况编辑器 */
      this.noticeTitle = ''
      this.noticeUsers = []
      this.catchData = ''
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.notice {
  padding: 10px;
}
.notice-item {
  .notice-img {
    /*float: left;*/
    /*overflow: hidden;*/
    /*height: 0;*/
    /*width: 50%;*/
    /*padding-bottom: 6rem;*/
    /*text-align: center;*/
    img {
      padding: 0.3rem;
      width: 100%;
      max-width: 120px;
      box-sizing: border-box;
    }
  }
  .notice-desc {
    /*float:right;*/
    /*flex: 1;*/
    text-align: center;

    div {
      font-size: 22px;
      color: #333;
      height: 100%;
    }
    .notice-number {
      font-size: 28px;
      color: tomato;
      height: 100%;
    }
  }

  .column {
    display: flex;
    align-items: center;
    justify-content: center;
    /*margin-left: 40px;*/
    height: 124px;
    background-color: #fff;
    border-radius: 10px;
    border: none;
    position: relative;
    margin-bottom: 30px;
    box-shadow: 0 0.46875rem 2.1875rem rgba(90, 97, 105, 0.1), 0 0.9375rem 1.40625rem rgba(90, 97, 105, 0.1), 0 0.25rem 0.53125rem rgba(90, 97, 105, 0.12), 0 0.125rem 0.1875rem rgba(90, 97, 105, 0.1);
  }
}

.el-row {
  /*margin-bottom: 20px;*/
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
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
/*.row-bg {*/
/*  padding: 10px 0;*/
/*  background-color: #f9fafc;*/
/*}*/

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
}
.notice-select {
  >>> .el-select {
    width: 100%;
  }
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
