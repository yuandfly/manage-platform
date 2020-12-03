<template>
  <div class="ele-contanier">
    <slot></slot>
    <div class="operte-section">
      <div class="ele-show">
        <div class="ele-number">{{ ele_.elementNumber }}</div>
        <div class="ele-name" @dblclick="edit">{{ ele_.elementName }}</div>
        <div class="ele-component">
          <div v-if="ele_.componentType === '-1' || ele_.componentType === -1">
            <span>--{{ ele_.remark }}--</span>
          </div>
          <div v-if="ele_.componentType === '0' || ele_.componentType === 0">
            <el-input :placeholder="ele_.placeholder" :disabled="true" size="mini"> </el-input>
          </div>
          <div v-if="ele_.componentType === '1' || ele_.componentType === 1">
            <el-input type="text" :placeholder="ele_.placeholder" :disabled="true" size="mini"> </el-input>
          </div>
          <div v-if="ele_.componentType === '2' || ele_.componentType === 2">
            <el-date-picker :disabled="true" type="datetime" :placeholder="ele_.placeholder" default-time="12:00:00" size="mini"> </el-date-picker>
          </div>
          <div v-if="ele_.componentType === '3' || ele_.componentType === 3">
            <el-date-picker :disabled="true" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="mini"> </el-date-picker>
          </div>
          <div v-if="ele_.componentType === '4' || ele_.componentType === 4">
            <el-input-number controls-position="right" :min="-10000" :max="10000" disabled size="mini"></el-input-number>
          </div>
          <div v-if="ele_.componentType === '6' || ele_.componentType === 6">
            <el-radio-group v-model="ele_.defaultValue" size="mini">
              <el-radio disabled :key="i" v-for="(item, i) in ele_.dictionaryTableDOList" :label="item.configValue">{{ item.configValue }}</el-radio>
            </el-radio-group>
          </div>
          <div v-if="ele_.componentType === '7' || ele_.componentType === 7">
            <el-checkbox-group>
              <el-checkbox disabled :key="i" v-for="(item, i) in ele_.dictionaryTableDOList" :label="item.configValue" size="mini">{{ item.configValue }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-if="ele_.componentType === '8' || ele_.componentType === 8">
            <el-select v-model="ele_.defaultValue" placeholder="请选择" size="mini">
              <el-option v-for="item in ele_.dictionaryTableDOList" :key="item.value" :label="item.configValue" :value="item.configValue"> </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddEle',
  props: {
    ele: {
      type: Object,
      required: true,
      default: {}
    }
  },
  computed: {
    ele_() {
      return this.ele
    }
  },
  methods: {
    edit() {
      this.$emit('editEle')
    }
  }
}
</script>

<style lang="scss" scoped>
.ele-contanier {
  position: relative;
  .operte-section {
    padding: 3px 0;
    .ele-show {
      display: flex;
      align-items: center;
      border: 1px solid #ebeef5;
    }
    .ele-number {
      width: 80px;
      padding-left: 5px;
      height: 100%;
      line-height: 2.5;
      color: #909399;
    }
    .ele-name {
      color: #909399;
      cursor: pointer;
      width: 215px;
      // border-left: 1px solid #ebeef5;
      // border-right: 1px solid #ebeef5;
      height: 100%;
      line-height: 2.5;
      padding-left: 5px;
    }
    .ele-component {
      width: 206px;
      >>> .el-input__inner {
        width: 200px;
      }
      >>> .el-input-number--mini {
        width: 100%;
      }
    }
  }
  .create-form-dialog {
    >>> .el-dialog {
      min-width: 800px;
    }
  }
}
</style>
<style lang="scss">
.add-tag {
  &.el-tag {
    cursor: pointer;
    margin-top: 5px;
    margin-bottom: 5px;
  }
}
</style>
