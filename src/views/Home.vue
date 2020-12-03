<style>
.fold-icon {
  font-size: 20px;
  color: #333;
  margin-left: -10px;
  margin-top: 1%;
}

.header-title {
  width: 8.5%;
  text-align: center;
  color: #fff;
  font-size: 22px;
}

/**头像 */
.avatar {
  margin-top: 13%;
}

.center {
  text-align: center;
}

html,
body,
#app,
.homeBox,
.el-container {
  padding: 0px;
  /*设置内部填充为0 几个布局元素之间没有间距*/
  margin: 0px;
  /*设置外部填充为0 几个布局元素之间没有间距*/
  min-height: 100vh;
  /*统一设置高度为100%*/
}
</style>

<template>
  <section>
    <div class="homeBox">
      <el-container class="page-right">
        <el-header>
          <div class="main-logo-box">
            <img class="main-logo" src="../assets/img/hn-logo.png" />
          </div>
          <!-- 左侧菜单栏是否展示与收起 -->
          <!-- <el-col :span="1">
              <span @click="getCollapse(false)"><i class="el-icon-s-fold  fold-icon" v-if="isCollapse === true"></i></span>
              <span @click="getCollapse(true)"> <i class="el-icon-s-unfold fold-icon" v-if="isCollapse === false"></i></span>
            </el-col> -->
          <div>
            <span class="sys-name">{{ sysName }}</span>
          </div>
          <div class=" justify-box"></div>
          <!-- 滚动消息 -->
          <!-- <div class="notice-comp">
                <word-scroll :noticeMessage="noticeMessage"></word-scroll>
              </div> -->
          <div class="center">
            <el-avatar :size="40" class="avatar" spape="circle" fit="cover" :src="sysUserAvatar" @error="errorHandler"> </el-avatar>
          </div>
          <div class="center">
            <el-menu class="el-menu-demo" mode="horizontal" background-color="#409EFF" text-color="#fff" active-text-color="#fff">
              <el-submenu index="2" class="user-name">
                <template slot="title">
                  {{ user.nickname }}
                </template>
                <el-menu-item index="2-1" @click="ChangePassword()">修改密码</el-menu-item>
                <el-menu-item index="2-2" @click="logout()">退出登录</el-menu-item>
                <el-menu-item index="2-2" @click="intoOverview">进入总览</el-menu-item>
              </el-submenu>
            </el-menu>
          </div>
        </el-header>
        <el-container class="page-nav">
          <el-aside :width="menuWidth">
            <el-menu
              :default-active="$route.path"
              class="el-menu-vertical-demo homeBox"
              @open="handleOpen"
              unique-opened
              background-color="#27333a"
              text-color="#fff"
              @close="handleClose"
              :collapse="isCollapse"
            >
              <!-- <el-menu-item>
                <div class="main-logo-box" v-if="isCollapse === false">
                  <img class="main-logo" src="../assets/img/hn-logo.png" />
                </div>
                <h3 v-else>
                  <i class="sys-name-icon el-icon-s-platform"></i>
                </h3>
              </el-menu-item> -->
              <template v-for="(item, index) in permissionTreeList">
                <template v-if="!item.childList">
                  <el-menu-item :index="item.key" :key="index" @click="toContent(item, item)">
                    <i :class="[item.icon ? item.icon : 'el-icon-star-off']"></i><span> {{ item.name }}</span>
                  </el-menu-item>
                </template>
                <template v-else>
                  <el-submenu :index="item.key" :key="index">
                    <template slot="title">
                      <i :class="[item.icon ? item.icon : 'el-icon-star-off']"></i><span>{{ item.name }}</span></template
                    >
                    <el-menu-item v-for="child in item.childList" :index="child.key" :key="child.key" @click="toContent(item, child)">
                      <span> {{ child.name }}</span>
                    </el-menu-item>
                  </el-submenu>
                </template>
              </template>
            </el-menu>
          </el-aside>
          <el-main>
            <el-row>
              <el-col :span="24" class="content-wrapper">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item :to="{ path: indexUrl }">{{ indexName }}</el-breadcrumb-item>
                  <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
                </el-breadcrumb>
                <transition name="fade" mode="out-in">
                  <router-view></router-view>
                </transition>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </el-container>
    </div>
    <change-password v-if="dialogVisibles" :visible.sync="dialogVisibles"></change-password>
  </section>
</template>

<script>
import { menu } from '@/common/js/menu.js'
import { get, post } from '@/http/http.js'
import crypto from '@/common/js/crypto.js'
import { delCookie } from '@/common/js/cookie.js'
import changePassword from '@/components/system/admin/ChangePassword.vue'

export default {
  components: {
    changePassword
  },
  data() {
    return {
      indexName: '首页',
      indexUrl: '/home',
      title: '个人工作台',
      sysName: '海南省中医药综合统计网络直报系统',
      noticeMessage: '未读消息--及时填报',
      dialogVisibles: false,
      menuWidth: '200px',
      isCollapse: false, //展开与收起
      permissionTreeList: [],
      user: {},
      // sysUserAvatar: require('../common/image/admin.jpg'),
      sysUserAvatar: require('../assets/img/company-logo.png'),
      noticeTimer: null
    }
  },
  created() {
    let sessionUser = sessionStorage.getItem('sessionUser')
    let sessionUserValue = crypto.decrypt(sessionUser, null)
    if (sessionUserValue) {
      sessionUserValue = JSON.parse(sessionUserValue)
      this.permissionTreeList = sessionUserValue.permission
      this.user = sessionUserValue.adminData
    }
    if (sessionStorage.getItem('indexName') !== null && sessionStorage.getItem('indexName') !== '') {
      this.indexName = sessionStorage.getItem('indexName')
    }
    if (sessionStorage.getItem('indexUrl') !== null && sessionStorage.getItem('indexUrl') !== '') {
      const url = sessionStorage.getItem('indexUrl')
      /* 如果url地址小三段时 */
      if (url.match(/\//g).length < 3) {
        this.indexUrl = url
      } else {
        const urlArray = url.split('/')
        this.indexUrl = '/' + urlArray[1] + '/' + urlArray[2]
      }
    }
    if (sessionStorage.getItem('title') !== null && sessionStorage.getItem('title') !== '') {
      this.title = sessionStorage.getItem('title')
    }
    this.permissionTreeList = menu

    // this.permissionTreeList = sessionUserValue.permission
  },
  methods: {
    //用户密码修改
    ChangePassword() {
      this.dialogVisibles = true
    },
    //展开与收起
    getCollapse(it) {
      if (it === true) {
        this.menuWidth = '64px'
      } else {
        this.menuWidth = '200px'
      }
      this.isCollapse = it
    },
    //图片加载失败
    errorHandler() {
      return true
    },
    //菜单跳转
    toContent(item, child) {
      sessionStorage.setItem('indexName', item.name)
      sessionStorage.setItem('indexUrl', child.key)
      sessionStorage.setItem('title', child.name)
      this.indexName = sessionStorage.getItem('indexName')
      const url = sessionStorage.getItem('indexUrl')
      /* 如果url地址小三段时 */
      if (url.match(/\//g).length < 3) {
        this.indexUrl = url
      } else {
        const urlArray = url.split('/')
        this.indexUrl = '/' + urlArray[1] + '/' + urlArray[2]
      }
      this.title = sessionStorage.getItem('title')
      return this.$router
        .push({
          path: child.key
        })
        .catch(error => {
          // console.log(error);
        })
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    logout() {
      this.$confirm('确认退出吗?', '提示', {
        //type: 'warning'
      })
        .then(() => {
          get('/adminLogin/logout', {})
            .then(data => {
              if (data.code != 0) {
                this.$message({
                  message: data.msg,
                  type: 'error'
                })
                return false
              }
              localStorage.clear()
              sessionStorage.clear()
              delCookie('token')
              delCookie('JSESSIONID')
              this.$router.push({
                path: '/login'
              })
            })
            .catch(function(error) {
              console.log(error)
            })
        })
        .catch(() => {})
    },
    intoOverview() {
      this.$router.push({ path: '/hn-chart' })
    }
  }
}
</script>
<style lang="scss" scoped>
.page-right {
  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    .justify-box {
      flex: 1;
    }
    .avatar {
      margin-right: 20px;
    }
  }
  .main-logo-box {
    padding-top: 8px;
    min-width: 200px;
  }
  .main-logo {
    width: 180px;
  }
}

.el-header,
.el-footer {
  background-color: #fff;
  color: #333;
  line-height: 60px;
  border-bottom: 1px solid #ebeef5;
  -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.notice-comp {
  position: absolute;
  right: 230px;
}
/**设置头*/
.el-aside {
  color: #333;
  line-height: 220px;
  min-height: 100vh;
  overflow: hidden;
  ul {
    height: 100%;
  }
}

.sys-name {
  font-size: 18px;
  color: #000;
}

.el-avatar > img {
  width: 100%;
}
.menuicon {
  color: #fff;
}
.el-main {
  background-color: #fff;
  color: #333;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

/**设置左侧菜单样式*/
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-submenu.user-name {
  width: 100%;
}
</style>
