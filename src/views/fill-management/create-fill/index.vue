<template>
  <div class="page-container">
    <div class="fill-preview">
      <el-card class="fill-form">
        <el-form :model="fillForm" :rules="rules" ref="ruleForm" label-width="120px" size="mini">
          <el-row>
            <el-col :span="12">
              <el-form-item label="直报名称" prop="planName">
                <el-input v-model="fillForm.planName" placeholder="请输入填报计划名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="填报起止日期" required>
                <el-date-picker
                  v-model="dateRange"
                  type="datetimerange"
                  start-placeholder="填报开始日期"
                  end-placeholder="填报结束日期"
                  :default-time="['0:00:00', '23:59:59']"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="表单选择" prop="surveyName">
                <el-select v-model="selectdForm" value-key="code" placeholder="请选择填报表单" @change="getItem($event)">
                  <template v-for="page in pageList">
                    <el-option v-if="page.surveyName" :key="page.code" :label="page.surveyName" :value="page"></el-option>
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="填报单位选择" prop="surveyUnitStateDOList">
                <el-select v-model="fillForm.surveyUnitStateDOList" filterable :multiple="true" :collapse-tags="true" placeholder="请选择">
                  <el-option v-for="item in secondaryList" :key="item.value" :label="item.detailedName" :value="item.organizationCode"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="fillForm.remark" placeholder="请输入备注信息" maxlength="30"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="btn-box">
            <el-form-item class="btn">
              <el-button type="primary" @click="submitForm('ruleForm')">立即下发</el-button>
              <!-- <el-button @click="saveDraft('ruleForm')">存为草稿</el-button> -->
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-card>
    </div>
    <div class="from-preview">
      <div class="section-title">
        <el-divider content-position="left">表单预览</el-divider>
      </div>
      <div class="form-box" v-loading.body="loading" v-if="configs.length">
        <el-card>
          <head-preview :headinfo="headinfo"></head-preview>
          <form-preview :configs="configs" :value="value"></form-preview>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import { getForm, getFormList } from '@/api/system/formManagement'
import { getUnitList, createFill } from '@/api/system/fill-management'
import HeadPreview from '../../form-management/form-head-preview'
import FormPreview from '../../form-management/form-preview'
import { formBase } from '../../form-management/form-base'
import { deepClone, deepAssign } from '@/common/js/tool'
import { format } from '@/common/js/util'
import { baseUnit } from './model'
export default {
  name: 'CreateFill',
  components: { HeadPreview, FormPreview },
  data() {
    return {
      loading: false,
      value: {},
      /* 表单数据 */
      configs: [],
      /* 表头信息 */
      headinfo: {
        surveyName: '',
        submitUnit: '',
        approveUnit: '',
        approveNo: ''
      },
      now: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      /* 表单列表list */
      pageList: [],
      pageObj: {
        page: 1,
        size: 100,
        total: 0
      },
      /* 下级单位列表 */
      secondaryList: [],
      selectdForm: {},
      /* 填报时间 */
      dateRange: '',
      fillForm: {
        code: '',
        planName: '',
        startTime: '',
        endTime: '',
        remark: '',
        surveyName: '',
        surveyUnitStateDOList: []
      },
      rules: {
        planName: [{ required: true, message: '请选择填写计划名称', trigger: 'blur' }],
        // surveyName: [{ required: true, message: '请选择填表表单', trigger: 'change' }],
        startTime: [
          {
            required: true,
            message: '请选择起始日期',
            trigger: 'change'
          }
        ],
        endTime: [
          {
            required: true,
            message: '请选择结束时间',
            trigger: 'change'
          }
        ],
        surveyUnitStateDOList: [
          {
            required: true,
            message: '请选择下级填报单位',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    this.now = format(new Date(), 'yyyy-MM-dd hh:mm:ss')
    /* 获取二级列表 */
    getFormList({ level: 2, ...this.pageObj }).then(
      res => {
        this.pageObj.total = res.data.total
        this.pageList = res.data.content
        this.loading = false
      },
      error => {
        this.loading = false
        this.$messge.error(`获取列表失败${error}`)
      }
    )
    /* 获取下级单位列表 */
    getUnitList().then(
      res => {
        if (!res.data) {
          return
        }
        this.secondaryList = res.data
      },
      error => {
        this.$message.error(`获取下级单位失败:${error}`)
      }
    )
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
    getItem($event) {
      this.loading = true
      const { code } = $event
      const param = {
        surveyCode: code
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
    },
    submitForm(formName) {
      if (!this.dateRange instanceof Array) {
        this.$messge.warning('请选择填报时间段')
        return false
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          /* 将选择的表单信息赋值给提交对象 */
          const { code, surveyName } = this.selectdForm
          this.fillForm.code = code
          this.fillForm.surveyName = surveyName
          /* 格式化时间 */
          const startTime = format(this.dateRange[0], 'yyyy-MM-dd hh:mm:ss')
          const endTime = format(this.dateRange[1], 'yyyy-MM-dd hh:mm:ss')
          this.fillForm.startTime = startTime
          this.fillForm.endTime = endTime
          /* 添加下级单位的基本参数 */
          const _surveyUnitStateDOList = this.fillForm.surveyUnitStateDOList.map(item => {
            const unit = deepClone(baseUnit)
            const filler = this.secondaryList.filter(obj => item === obj.organizationCode)
            unit.unitCode = item
            unit.surveyCode = this.fillForm.code
            unit.surveyName = this.fillForm.surveyName
            unit.unitName = filler[0].detailedName
            return unit
          })
          this.fillForm.surveyUnitStateDOList = _surveyUnitStateDOList
          createFill(this.fillForm).then(
            res => {
              this.$message.success('创建成功')
              this.$router.push({ path: '/home/fill/publish-fill' })
            },
            error => {
              this.$message.error(`创建失败:${error}`)
            }
          )
        } else {
          return false
        }
      })
    },
    saveDraft(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message({
            message: '保存成功!',
            type: 'success'
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.form {
  margin-top: 20px;
  border: 1px solid #ebeef5;
  .form-name {
    text-align: center;
    font-weight: bold;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ebeef5;
  }
}
.btn-box {
  overflow: hidden;
  .btn {
    float: right;
  }
}
.fill-form {
  >>> .el-range-editor.el-input__inner {
    width: 100%;
  }
  >>> .el-select {
    width: 100%;
  }
}
</style>
