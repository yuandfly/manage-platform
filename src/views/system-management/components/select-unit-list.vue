<template>
  <el-select v-model="units" placeholder="请选择" @change="change">
    <el-option v-for="item in list" :key="item.unit_id" :label="item.unit_name" :value="item.unit_id"> </el-option>
  </el-select>
</template>

<script>
import { getUnitsList } from '@/api/system/units'

export default {
  name: 'select-unit-list',
  data() {
    return {
      units: this.selectUnits,
      unitsName: this.selectUnitsName,
      list: []
    }
  },
  props: {
    selectUnits: {},
    selectUnitsName: {},
    type: {
      default: 1
    }
  },
  watch: {
    selectUnits() {
      this.units = this.selectUnits
      console.log(this.units)
    },
    selectUnitsName() {
      this.unitsName = this.selectUnitsName
      console.log(this.unitsName)
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      await getUnitsList().then(res => {
        console.log(res)
        if (res.data.code === 0) {
          this.list = res.data.data
        } else {
          this.$message(res.data.msg)
        }
      })
    },
    reset() {
      this.units = ''
    },
    change() {
      this.$emit('update:selectUnits', this.units)
      this.list.forEach(v => {
        if (v.unit_id === this.units) {
          this.unitsName = v.unit_name
        }
      })
      console.log(this.unitsName, this.selectUnitsName)
      this.$emit('update:selectUnitsName', this.unitsName)
    }
  }
}
</script>

<style scoped></style>
