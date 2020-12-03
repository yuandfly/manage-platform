<template>
  <el-col>
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-submenu index="1">
        <template slot="title">
          <!-- <i class="el-icon-location"></i> -->
          <span>已创建表单页面</span>
        </template>
        <el-menu-item-group>
          <!-- <template slot="title"
              >未发布</template
            > -->
          <el-menu-item
            :index="`1-${i + 1}`"
            :key="i"
            v-for="(item, i) in pageList"
            :title="item.surveyName ? item.surveyName : '未命名'"
            @click="clickItem(item.code)"
            >{{
              item.surveyName ? item.surveyName : '未命名' | ellipsis(8)
            }}</el-menu-item
          >
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <!-- <i class="el-icon-location"></i> -->
          <span>已创建表单模块</span>
        </template>
        <el-menu-item-group>
          <!-- <template slot="title"
              >未发布</template
            > -->
          <el-menu-item
            :index="`1-${i + 1}`"
            :key="i"
            v-for="(item, i) in formList"
            :title="item.surveyName ? item.surveyName : '未命名'"
            @click="clickItem(item.code)"
            >{{
              item.surveyName ? item.surveyName : '未命名' | ellipsis(8)
            }}</el-menu-item
          >
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-col>
</template>

<script>
export default {
  props: {
    formList: {
      type: Array,
      require: true,
      default: []
    },
    pageList: {
      type: Array,
      require: true,
      default: []
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath)
    },
    clickItem(code) {
      this.$emit('getItem', code)
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-card.el-card {
  height: 100%;
  .el-card__body {
    padding: 0px;
  }
}
.el-col {
  .el-menu {
    border: none;
  }
}
</style>
