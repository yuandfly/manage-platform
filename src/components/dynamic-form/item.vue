<template>
  <el-form-item ref="item" :rules="rules" :label="eleName" class="item">
    <span v-if="item.componentType === -1 || item.componentType === '-1'">--{{ item.remark }}--</span>
    <el-input v-if="item.componentType === 0 || item.componentType === '0'" v-model.trim="value" type="text" :placeholder="item.placeholder"></el-input>
    <el-input v-if="item.componentType === 1 || item.componentType === '1'" v-model="value" type="textarea" :placeholder="item.placeholder"></el-input>
    <el-date-picker
      v-if="item.componentType === 2 || item.componentType === '2'"
      v-model="value"
      type="datetime"
      format="yyyy-MM-dd HH:mm:ss"
      :placeholder="item.placeholder"
      default-time="12:00:00"
    ></el-date-picker>
    <el-date-picker
      v-if="item.componentType === 3 || item.componentType === '3'"
      v-model="value"
      type="datetimerange"
      format="yyyy-MM-dd HH:mm:ss"
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
    ></el-date-picker>
    <el-input-number v-if="item.componentType === 4 || item.componentType === '4'" controls-position="right" :min="-2560000" :max="2560000" v-model="value"></el-input-number>
    <el-radio-group v-if="item.componentType === 6 || item.componentType === '6'" v-model="value">
      <el-radio v-for="(radio, radioi) in item.dictionaryTableDOList" :key="radioi" :label="radio.configValue">{{ radio.configValue }}</el-radio>
    </el-radio-group>
    <el-checkbox-group v-if="item.componentType === 7 || item.componentType === '7'" v-model="mutiple">
      <el-checkbox v-for="(checkbox, checkboxi) in item.dictionaryTableDOList" :key="checkboxi" :label="checkbox.configValue" name="configValue"></el-checkbox>
    </el-checkbox-group>
    <el-select v-if="item.componentType === 8 || item.componentType === '8'" v-model="value" :placeholder="item.placeholder">
      <el-option v-for="(select, selecti) in item.dictionaryTableDOList" :key="selecti" :label="select.configValue" :value="select.configValue"> </el-option>
    </el-select>
  </el-form-item>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      value: '',
      mutiple: []
    }
  },
  computed: {
    rules() {
      const required = this.item.isRequired === 1 ? true : false
      const message = this.item.promptLanguage
      return [{ required, message, trigger: 'blur' }]
    },
    inputWidth() {
      console.log(this.item.rownum)
      if (isNaN(this.item.rownum) || null || '') {
        return `width:200px`
      }
      return `width:${this.item.rownum * 200}px`
    },
    eleName() {
      /* 增加label的缩进 */
      if (this.item.indentValue === 10) {
        return `\xa0\xa0\xa0${this.item.elementName}`
      } else if (this.item.indentValue === 20) {
        return `\xa0\xa0\xa0\xa0\xa0\xa0${this.item.elementName}`
      } else if (this.item.indentValue === 30) {
        return `\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0${this.item.elementName}`
      } else {
        return this.item.elementName
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.item {
  display: flex;
  align-items: center;
  >>> .el-input__inner {
    box-sizing: border-box;
    width: 100%;
  }
  >>> .el-form-item__content {
    box-sizing: border-box;
    width: 100%;
  }
  >>> .el-input-number--mini {
    box-sizing: border-box;
    width: 100%;
  }
}
>>> .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>
