<template>
  <el-card>
    <div v-if="hasOprate" class="oprate">
      <el-button @click="toEdite" class="el-icon-edit" type="primary" size="mini" :disabled="isEdit">编辑内容</el-button>
      <el-button @click="addRules" class="el-icon-edit-outline" size="mini" :disabled="isEdit">添加规则</el-button>
    </div>
    <div>
      <head-preview :headinfo="headinfo"></head-preview>
      <form-preview :configs="configs" v-loading="loading"></form-preview>
    </div>
  </el-card>
</template>

<script>
import HeadPreview from '../form-head-preview'
import FormPreview from '../form-preview'
import { getForm } from '@/api/system/formManagement'
import { formBase } from '../form-base.js'
import { deepClone, deepAssign } from '@/common/js/tool'
export default {
  name: 'PageDetail',
  components: { HeadPreview, FormPreview },
  data() {
    return {
      /* 用于纯预览 可以屏蔽按钮 */
      hasOprate: true,
      /* 是否可编辑 */
      isEdit: true,
      configs: [],
      /* 表头信息 */
      headinfo: {
        surveyName: '',
        submitUnit: '',
        approveUnit: '',
        approveNo: ''
      },
      dataBak: {},
      surveyCode: '',
      loading: false
    }
  },
  props: {
    currentData: {
      type: Object
    }
  },
  created() {
    if (this.currentData) {
      this.surveyCode = this.currentData.code
      this.getItem()
    }
  },
  methods: {
    /* 排序函数 */
    compare(property) {
      return (a, b) => {
        const value1 = a[property]
        const value2 = b[property]
        return value1 - value2 //升序,降序为value2 - value1
      }
    },
    getItem() {
      this.loading = true
      const param = {
        surveyCode: this.surveyCode
      }
      getForm(param).then(res => {
        this.configs = []
        if (res.data.data.level === 1) {
          const baseData = deepClone(formBase)
          this.configs.push(deepAssign(baseData, res.data))
        }
        if (res.data.data.level === 2) {
          this.dataBak = res.data.data
          /* 获取编辑状态 */
          this.isEdit = res.data.state === 0 ? true : false
          /* 截取表头信息 */
          for (let key in this.headinfo) {
            this.headinfo[key] = res.data.data[key]
          }
          /* 增加排序序号 1元素排序*/
          res.data.data.basicTableVOList.forEach((form, i1) => {
            form.basicModuleVOList.forEach((module, i2) => {
              module.basicElementVOList.sort(this.compare('colnum'))
            })
          })
          /* 2模块 */
          res.data.data.basicTableVOList.forEach((form, i1) => {
            form.basicModuleVOList.sort(this.compare('seatNumber'))
          })
          /* 3表排序 */
          res.data.data.basicTableVOList.sort(this.compare('seatNumber'))
          /* 截取表单信息 */
          res.data.data.basicTableVOList.forEach(form => {
            const baseData = deepClone(formBase)
            this.configs.push(deepAssign(baseData, form))
          })
        }
        this.loading = false
      })
    },
    toEdite() {
      localStorage.removeItem('formData')
      /* 将备份数据的 basicTableVOList转换为排序后的数据*/
      this.dataBak.basicTableVOList = this.configs
      localStorage.setItem('formData', JSON.stringify(this.dataBak))
      this.$router.push('/home/form/form-edit')
    },
    addRules() {
      this.$router.push({
        path: '/home/form/add-rules',
        query: {
          surveyCode: this.surveyCode
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.oprate {
  text-align: right;
}
</style>
