<template>
  <div class="header">
    <div class="edit-card" v-if="edit">
      <div class="btn-box">
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          size="mini"
          @click="addTitle"
          >添加标题</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          size="mini"
          @click="addItem(1)"
          >添加单行项</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          size="mini"
          @click="addItem(2)"
          >添加多行项</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-circle-check"
          size="mini"
          @click="enter"
          >生成</el-button
        >
      </div>
      <div class="title" v-if="titleShow">
        <el-input class="item-tilte" type="text" v-model="title" />
      </div>
      <div class="row" :key="index" v-for="(row, index) in itemAarr">
        <i
          class="el-icon-circle-close close-icon"
          @click="deleteItem(index)"
        ></i>
        <div class="item" :key="i" v-for="(item, i) in row">
          <el-input
            class="item-key"
            type="text"
            size="small"
            v-model="item.key"
            placeholder="请输入项名"
          />:
          <el-input
            class="item-val"
            type="text"
            size="small"
            v-model="item.val"
            placeholder="请输入说明"
          />
        </div>
      </div>
    </div>
    <div class="show-card" v-else>
      <div class="el-icon-edit edit-icon" @click="editMode"></div>
      <div class="name" v-if="title">{{ title }}</div>
      <div class="row" :key="index" v-for="(row, index) in itemAarr">
        <div class="item" :key="i" v-for="(item, i) in row">
          <span class="show-key">{{ item.key }}</span
          >:
          <span class="show-val">{{ item.val }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { deepClone } from "@/common/js/tool";
export default {
  name: "CustomHeader",
  data() {
    return {
      edit: true,
      titleShow: false,
      title: "",
      itemAarr: []
    };
  },
  methods: {
    addTitle() {
      this.titleShow = true;
    },
    addItem(type) {
      const length = this.itemAarr.length;
      const item = { key: "", val: "", rowType: type };
      if (type === 1) {
        this.itemAarr.push([item]);
      } else {
        if (
          length === 0 ||
          this.itemAarr[length - 1][0].rowType === 1 ||
          this.itemAarr[length - 1].length > 1
        ) {
          this.itemAarr.push([item]);
        } else {
          this.itemAarr[length - 1].push(item);
        }
      }
    },
    deleteItem(i) {
      this.itemAarr.splice(i, 1);
    },
    enter() {
      this.edit = false;
    },
    editMode() {
      this.edit = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.edit-card {
  padding-right: 20px;
}
.title {
  padding-top: 20px;
  margin: 0 auto;
}
.row {
  display: flex;
  justify-content: space-between;
  position: relative;
  .item {
    display: flex;
    justify-items: flex-start;
    margin: 5px 0;
  }
  .item-key {
    width: 175px;
    margin-left: 5px;
  }
  .close-icon {
    position: absolute;
    right: -20px;
    top: 10px;
    z-index: 2;
  }
}
.show-card {
  position: relative;
  .edit-icon {
    position: absolute;
    top: 0;
    right: 0;
  }
  .item {
    font-size: 14px;
    margin: 10px 0;
  }
}
</style>
