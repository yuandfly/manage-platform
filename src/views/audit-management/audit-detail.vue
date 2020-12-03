<template>
  <div>
    <div class="create-info">
      <el-divider content-position="left">审批信息</el-divider>
      <table>
        <tbody>
          <tr>
            <td class="label">填报人：</td>
            <td class="val">{{ data.unitUsername }}</td>
            <td class="label">提交时间：</td>
            <td class="val">{{ data.updatetime | timeFormat('yyyy-MM-dd') }}</td>
            <td class="label">填报计划名称：</td>
            <td class="val">{{ data.planName }}</td>
          </tr>
          <tr>
            <td class="label">创建人：</td>
            <td class="val">{{ 122 }}</td>
            <td class="label">填报起始时间：</td>
            <td class="val">{{ data.startTime | timeFormat('yyyy-MM-dd') }}</td>
            <td class="label">填报终止时间：</td>
            <td class="val">{{ data.endTime | timeFormat('yyyy-MM-dd') }}</td>
          </tr>
          <tr>
            <td class="label">审核备注：</td>
            <td class="val">{{ data.remark }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <el-divider content-position="left">填报内容</el-divider>
    <div class="form-box" v-if="!loading">
      <div class="header">
        <h3 class="title">{{ oData.surveyName }}</h3>
        <div class="item-box">
          <div class="item-row">
            <div class="item-info">
              <span class="item-label">制定机关:</span><span class="item-name">{{ oData.submitUnit }}</span>
            </div>
            <div class="item-info">
              <span class="item-label">批准机关:</span><span class="item-name">{{ oData.approveUnit }}</span>
            </div>
          </div>
          <div class="item-row">
            <div class="item-info">
              <span class="item-label">批准文号:</span><span class="item-name">{{ oData.approveNo }}</span>
            </div>
            <div class="item-info">
              <span class="item-label">提交单位:</span><span class="item-name">{{ oData.submitUnit }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="form" v-for="form in oData.basicTableVOList" :key="form.code">
          <el-row>
            <div class="form-name">{{ form.surveyName }}</div>
          </el-row>
          <el-row v-for="m in form.basicModuleVOList" :key="m.tableElementCode">
            <div class="mudel">
              <div class="mudel-name">
                {{ m.tableElementName }}
              </div>
              <div class="mudel-content">
                <div class="element-cell" v-for="(e, i) in m.surveyUnitResultDOList" :key="i">
                  <div class="ele-name">({{ e.elementNumber }}){{ e.elementName }}:</div>
                  <div class="ele-value" v-if="e.submitResult instanceof Date">{{ e.submitResult }}</div>
                  <div class="ele-value" v-else>{{ e.submitResult ? e.submitResult : '' }}</div>
                </div>
              </div>
            </div>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getApproveDetail, setApprove } from '@/api/approve/approve'
import { deepClone } from '@/common/js/tool'
export default {
  data() {
    return {
      /* 作为原始数据备份 */
      oData: {},
      loading: false
    }
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    type: {
      type: String
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      /*获取表单信息 */
      this.loading = true
      const param = {
        surveyCode: this.data.surveyCode,
        planCode: this.data.planCode,
        surveyName: this.data.surveyName,
        code: this.data.unitCode,
        userName: this.data.unitUsername
      }
      getApproveDetail(param).then(res => {
        // /* 增加排序序号 1元素排序*/
        // res.data.basicTableVOList.forEach((form, i1) => {
        //   form.basicModuleVOList.forEach((module, i2) => {
        //     module.basicElementVOList.sort(this.compare('colnum'))
        //     /* 将多选值的字符串改为数组 */
        //     module.basicElementVOList.forEach(ele => {
        //       if (ele.componentType === 7) {
        //         if (!ele.defaultValue) {
        //           ele.defaultValue = []
        //         } else if (ele.defaultValue.length < 2) {
        //           ele.defaultValue = [ele.defaultValue]
        //         } else {
        //           ele.defaultValue = ele.defaultValue.join(',')
        //         }
        //       }
        //     })
        //   })
        // })
        /* 2模块排序 */
        res.data.basicTableVOList.forEach((form, i1) => {
          form.basicModuleVOList.sort(this.compare('seatNumber'))
        })
        /* 3表排序 */
        res.data.basicTableVOList.sort(this.compare('seatNumber'))
        this.oData = res.data
        this.loading = false
      })
    },
    /* 排序函数 */
    compare(property) {
      return (a, b) => {
        const value1 = a[property]
        const value2 = b[property]
        return value1 - value2 //升序,降序为value2 - value1
      }
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
.header {
  margin-top: 20px;
  .title {
    text-align: center;
  }
  .item-box {
    padding-left: 35px;
  }
  .item-row {
    margin: 15px 0;
    display: flex;
    justify-content: space-between;
    .item-info {
      display: table-cell;
      width: 300px;
    }
  }
}
.item-label {
  color: #99a9bf;
}
.item-name {
  margin-left: 8px;
}
.content {
  margin-top: 15px;
  .form {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    margin-bottom: 15px;
  }

  .form-name {
    text-align: center;
    height: 40px;
    line-height: 40px;
  }
  .mudel {
    border-top: 1px solid #ebeef5;
  }
  .mudel-name {
    padding: 8px;
    border-bottom: 1px solid #ebeef5;
  }
  .mudel-content {
    display: grid;
    grid-template-columns: 33% 33% 33%;
    grid-column-gap: 0.5%;
    grid-row-gap: 5px;
    padding: 8px;
  }
  .element-cell {
    border: 1px solid #ebeef5;
    padding: 5px;
    .ele-name {
      display: inline-block;
      width: 200px;
      color: #606266;
    }
    .ele-value {
      display: inline-block;
      color: #909399;
    }
  }
}
</style>
