<template>
  <el-card>
    <div class="create-info">
      <el-divider content-position="left">创建信息</el-divider>
      <table>
        <tbody>
          <tr>
            <td class="label">创建人员：</td>
            <td class="val">{{ currentFill.createuser }}</td>
            <td class="label">填报起始时间：</td>
            <td class="val">{{ currentFill.startTime | timeFormat('yyyy-MM-dd') }}</td>
            <td class="label">填报终止时间：</td>
            <td class="val">{{ currentFill.endTime | timeFormat('yyyy-MM-dd') }}</td>
          </tr>
          <tr>
            <td class="label">创建时间：</td>
            <td class="val">{{ currentFill.createtime }}</td>
            <td class="label">填报计划名称：</td>
            <td class="val">{{ currentFill.planName }}</td>
            <td class="label"></td>
            <td class="val"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="section-title">
      <el-divider content-position="left">填报表单信息</el-divider>
    </div>
    <div>
      <head-preview :headinfo="headinfo"></head-preview>
      <form-preview :configs="configs"></form-preview>
    </div>
  </el-card>
</template>

<script>
import HeadPreview from '../../form-management/form-head-preview'
import FormPreview from '../../form-management/form-preview'
import { getForm } from '@/api/system/formManagement'
import { formBase } from '../../form-management/form-base'
import { deepClone, deepAssign } from '@/common/js/tool'
export default {
  name: 'FillDetail',
  components: { HeadPreview, FormPreview },
  data() {
    return {
      configs: [],
      /* 表头信息 */
      headinfo: {
        surveyName: '',
        submitUnit: '',
        approveUnit: '',
        approveNo: ''
      }
    }
  },
  props: {
    currentFill: {
      type: Object,
      require: true
    }
  },
  created() {
    this.getItem()
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
    /*获取表单信息 */
    getItem() {
      const param = {
        surveyCode: this.currentFill.code
      }
      getForm(param).then(res => {
        this.configs = []
        /* 增加排序序号 1元素排序*/
        res.data.data.basicTableVOList.forEach((form, i1) => {
          form.basicModuleVOList.forEach((module, i2) => {
            module.basicElementVOList.sort(this.compare('colnum'))
            /* 将多选值的字符串改为数组 */
            module.basicElementVOList.forEach(ele => {
              if (ele.componentType === 7) {
                if (!ele.defaultValue) {
                  ele.defaultValue = []
                } else if (ele.defaultValue.length < 2) {
                  ele.defaultValue = [ele.defaultValue]
                } else {
                  ele.defaultValue = ele.defaultValue.join(',')
                }
              }
            })
          })
        })
        /* 2模块排序 */
        res.data.data.basicTableVOList.forEach((form, i1) => {
          form.basicModuleVOList.sort(this.compare('seatNumber'))
        })
        /* 3表排序 */
        res.data.data.basicTableVOList.sort(this.compare('seatNumber'))
        /* 截取表头信息 */
        for (let key in this.headinfo) {
          this.headinfo[key] = res.data.data[key]
        }
        res.data.data.basicTableVOList.forEach(form => {
          const baseData = deepClone(formBase)
          this.configs.push(deepAssign(baseData, form))
        })
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  tr {
    height: 30px;
  }
}
.label {
  width: 100px;
  text-align: right;
  color: #99a9bf;
}
.val {
  margin-left: 8px;
}
.section-title {
  margin-top: 40px;
}
.fill-form {
  padding: 0 20px;
}
</style>
