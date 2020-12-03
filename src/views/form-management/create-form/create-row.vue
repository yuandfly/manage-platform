<template>
  <div class="craet-row">
    <div v-for="(item, index) in rowNum" :key="index" class="add-item">
      <div v-show="!item.mount" class="ele-select">
        <el-popover placement="top" width="300">
          <div class="element-box">
            <el-button size="mini" round @click="selectEle(0, item)"
              >文字输入框</el-button
            >
            <el-button size="mini" round @click="selectEle(1, item)"
              >文本域</el-button
            >
            <el-button size="mini" round @click="selectEle(2, item)"
              >单选框</el-button
            >
            <el-button size="mini" round @click="selectEle(3, item)"
              >复选框</el-button
            >
            <el-button size="mini" round @click="selectEle(4, item)"
              >下拉单选</el-button
            >
            <el-button size="mini" round @click="selectEle(5, item)"
              >下拉多选</el-button
            >
            <el-button size="mini" round @click="selectEle(6, item)"
              >日期选择</el-button
            >
            <el-button size="mini" round @click="selectEle(7, item)"
              >日期范围选择</el-button
            >
            <el-button size="mini" round @click="selectEle(8, item)"
              >时间选择</el-button
            >
            <el-button size="mini" round @click="selectEle(9, item)"
              >时间范围选择</el-button
            >
          </div>
          <el-button
            slot="reference"
            type="primary"
            icon="el-icon-circle-plus-outline"
            size="mini"
            >添加元素</el-button
          >
        </el-popover>
      </div>
      <div v-if="item.mount" class="form-ele">
        <div class="label">
          <el-input
            v-show="item.editLabel"
            v-model="item.label"
            placeholder="请输入内容"
            @keyup.enter.native="item.editLabel = false"
          ></el-input>
          <span v-show="!item.editLabel" @dblclick="item.editLabel = true">{{
            item.label
          }}</span>
        </div>
        <form-element :type="item.type" />
      </div>
    </div>
  </div>
</template>
<script>
import FormElement from "./element-box";
export default {
  name: "AddRow",
  components: {
    FormElement
  },
  data() {
    return {
      visible: false,
      rowNum: []
    };
  },
  created() {
    const num = 4;
    for (let i = 0; i < num; i++) {
      const item = {
        label: "",
        editLabel: true,
        mount: false,
        type: 0,
        key: new Date().getTime() + Math.random()
      };
      this.rowNum.push(item);
    }
  },
  methods: {
    selectEle(num, item) {
      item.mount = true;
      item.type = num;
    },
    keyEnter() {}
  }
};
</script>
<style lang="scss" scoped>
.craet-row {
  display: flex;
  justify-content: space-around;
}
.element-box {
  button {
    margin-top: 5px;
  }
}
.form-ele {
  display: flex;
}
</style>
