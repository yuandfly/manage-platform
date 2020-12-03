<template>
  <div class="page-container">
    <el-card v-loading.body="loading">
      <div class="oprate">
        <div class="oprate-btn">
          <el-button type="primary" icon="el-icon-check" size="mini" @click.stop="approved(3)">通过</el-button>
          <el-button type="warning" icon="el-icon-close" size="mini" @click.stop="approved(4)">驳回</el-button>
          <el-button icon="el-icon-back" size="mini" @click.stop="back">返回</el-button>
        </div>
        <el-form label-width="80px" class="remark">
          <el-form-item label="审核意见">
            <el-input v-model="remark" type="textarea" placeholder="请填写审核意见" :autosize="{ minRows: 2, maxRows: 4 }" maxlength="50" show-word-limit></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-divider content-position="left">填报内容</el-divider>
    <div class="form-box" v-if="!loading">
      <el-card>
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
        <!-- 填报内容 -->
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
                    <div v-else class="ele-value">{{ e.submitResult ? e.submitResult : '' }}</div>
                  </div>
                </div>
              </div>
            </el-row>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getApproveDetail, setApprove } from '@/api/approve/approve'
import { deepClone } from '@/common/js/tool'
export default {
  name: 'AuditDetail',
  data() {
    return {
      /* 作为原始数据备份 */
      oData: {},
      /*  */
      planCode: '',
      surveyCode: '',
      surveyName: '',
      code: '',
      userName: '',
      remark: '',
      loading: false
    }
  },
  created() {
    /* 从创建也跳转过来携带code  */
    this.surveyCode = this.$route.query.surveyCode
    this.planCode = this.$route.query.planCode
    this.surveyName = this.$route.query.surveyName
    this.code = this.$route.query.code
    this.userName = this.$route.query.userName
    this.getList()
  },
  methods: {
    getList() {
      /*获取表单信息 */
      this.loading = true
      const param = {
        surveyCode: this.surveyCode,
        planCode: this.planCode,
        surveyName: this.surveyName,
        code: this.code,
        userName: this.userName
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
    /*submitState 0未填 1草稿 2已填报待审核 3审核通过 4 审核未过  审核的状态码 */
    approved(state) {
      this.remark = this.remark.trim()
      if (state === 4 && !this.remark) {
        this.$message.warning('请填写备注！')
        return
      }
      const param = {
        planCode: this.planCode,
        submitState: state,
        unitCode: this.oData.basicTableVOList[0].basicModuleVOList[0].surveyUnitResultDOList[0].unitCode,
        unitUsername: null,
        updatetime: '',
        remark: this.remark
      }
      setApprove(param).then(res => {
        if (state === 3) this.$message.success('审核通过成功！')
        if (state === 4) this.$message.success('审核驳回完成！')
        this.$router.back(-1)
      })
    },
    back() {
      this.$router.back(-1)
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
.oprate-btn {
  text-align: right;
  margin-bottom: 20px;
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
      color: #99a9bf;
    }
    .ele-value {
      display: inline-block;
      color: #303133;
    }
  }
}
</style>
