<template>
  <el-form-item :rules="Rules" :label="item.elementName" :prop="item.elementCode" :class="{ 'form-item-block': true }">
    <el-input v-if="item.componentType === 0 || item.componentType === '0'" v-bind="$attrs" type="text"></el-input>
    <el-input v-if="item.componentType === 1 || item.componentType === '1'" v-bind="$attrs" type="textarea"></el-input>
    <el-date-picker
      v-if="item.componentType === 2 || item.componentType === '2'"
      v-bind="$attrs"
      type="datetime"
      format="yyyy-MM-dd HH:mm:ss"
      placeholder="选择日期时间"
      default-time="12:00:00"
    ></el-date-picker>
    <el-date-picker
      v-if="item.componentType === 3 || item.componentType === '3'"
      v-bind="$attrs"
      type="datetimerange"
      format="yyyy-MM-dd HH:mm:ss"
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
    ></el-date-picker>
    <el-radio-group v-if="item.componentType === 6 || item.componentType === '6'" v-bind="$attrs">
      <el-radio v-for="(radio, radioi) in item.dictionaryTableDOList" :key="radioi" :label="radio.configValue">{{ radio.configValue }}</el-radio>
    </el-radio-group>
    <el-checkbox-group v-if="item.componentType === 7 || item.componentType === '7'" v-bind="$attrs">
      <el-checkbox v-for="(checkbox, checkboxi) in item.dictionaryTableDOList" :key="checkboxi" :label="checkbox.configValue" name="configValue"></el-checkbox>
    </el-checkbox-group>
    <el-select v-if="item.componentType === 8 || item.componentType === '8'" v-bind="$attrs">
      <el-option v-for="(select, selecti) in item.dictionaryTableDOList" :key="selecti" :label="select.configValue" :value="select.configValue"> </el-option>
    </el-select>
  </el-form-item>
</template>

<script>
export default {
  name: 'ApproveFormItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      value: '',
      mutiple: [],
      Rules: {}
    }
  }
}
</script>
<style lang="scss">
.form-item-block {
  display: block;
  .el-form-item__label {
    width: 90px;
  }
}
</style>
