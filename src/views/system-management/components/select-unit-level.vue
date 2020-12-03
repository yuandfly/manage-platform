<template>
  <el-select v-model="level"    placeholder="请选择" @change="change">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'select-unit-level',
  data () {
    return {
      level: this.changeLevel,
      options: [{
        value: '1',
        label: '省级'
      }, {
        value: '2',
        label: '市州'
      }, {
        value: '3',
        label: '基层'
      }]
    }
  },
  props: {
    changeLevel: {
      default: '1'
    }
  },
  mounted () {
    this.level = this.changeLevel;
    console.log(this.level);
  },
  watch: {
    changeLevel () {
      this.level = this.changeLevel;
      console.log(this.level);
    }
  },
  methods: {
    change () {
    //  this.level = this.value;
      console.log(this.level);
      this.$emit('update:changeLevel', this.level);
    }
  }
}
</script>

<style scoped>

</style>
