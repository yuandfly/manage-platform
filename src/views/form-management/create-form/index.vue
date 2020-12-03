<template>
  <div class="index-container">
    <div class="create-form" v-show="editForm">
      <page-layout>
        <template v-slot:generateBtn>
          <el-button type="primary" icon="el-icon-view" size="mini" @click="preview" :disabled="previewDisable"> 预览</el-button>
          <el-button icon="el-icon-back" size="mini" @click="back" v-if="formEdit"> 返回</el-button>
        </template>
        <template v-slot:header>
          <el-card class="head-card">
            <div class="header">
              <div class="edit-card" v-if="edit">
                <div class="title">
                  <el-form ref="headInfo" :rules="rules" :model="headInfo" label-width="80px" size="mini">
                    <el-row>
                      <el-form-item label="标题名称" prop="surveyName">
                        <el-input v-model.trim="headInfo.surveyName" placeholder="请输入标题名称"></el-input>
                      </el-form-item>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="制定机关">
                          <el-input v-model="headInfo.submitUnit" placeholder="请输入内容"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="批准机关">
                          <el-input v-model="headInfo.approveUnit" placeholder="请输入内容"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="批准文号">
                          <el-input v-model="headInfo.approveNo" placeholder="请输入内容"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </div>
            </div>
          </el-card>
        </template>
        <template v-slot:form>
          <div v-if="page.basicTableVOList.length">
            <div class="form-box" :key="index" v-for="(form, index) in page.basicTableVOList">
              <el-card class="card-box">
                <add-form :ref="'form' + index" :formOrder="index" :addFormFlag="addFormFlag" />
              </el-card>
            </div>
            <!-- 删除表 -->
            <i class="el-icon-delete close-icon" @click="deleteItem"></i>
          </div>
          <div class="add-form-btn">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="addForm" :disabled="previewDisable">添加表</el-button>
          </div>
        </template>
      </page-layout>
    </div>
    <!-- 预览 -->
    <div v-if="!editForm" class="preview">
      <el-card>
        <div class="opter-btn" v-if="!completed">
          <el-button type="primary" icon="el-icon-check" size="mini" :disabled="generateDisable" @click.stop="generate">保存表单</el-button>
          <el-button icon="el-icon-edit" size="mini" @click.stop="editForm = true">返回编辑</el-button>
        </div>
        <head-preview :headinfo="headInfo"></head-preview>
        <form-preview :configs="configs" :value="value" v-if="configs.length"></form-preview>
      </el-card>
    </div>
  </div>
</template>
<script>
import PageLayout from './page-layout'
import CustomHeader from './custom-header'
import FormHeader from './form-header'
import AddForm from './add-form'
import { saveForm, savePage, updatePage } from '@/api/system/formManagement'
import { pageMap, formMap } from './model'
import { deepClone } from '@/common/js/tool'
import { user } from '@/common/js/loginInfo'
import HeadPreview from '../form-head-preview'
import FormPreview from '../form-preview'
import { mapState, mapMutations } from 'vuex'
export default {
  provide() {
    return {
      parentForm: this
    }
  },
  data() {
    return {
      saveCode: '',
      editForm: true,
      completed: false,
      /* 显示表头 */
      showHead: false,
      /* 生成按钮 */
      generateDisable: true,
      page: {},
      loading: false,
      /* 表单数据 */
      configs: [],
      /* 表头信息 */
      headInfo: {
        surveyName: '',
        approveUnit: '',
        approveNo: ''
      },
      value: {},
      /* 表头编辑 */
      edit: true,
      rules: {
        surveyName: [{ required: true, message: '请输入标题名称', trigger: 'blur' }]
      },
      /* 通知子组件通过添加的方式初始化组件 */
      addFormFlag: false,
      /* 存储元素编号，通过provide传给子组件判断是否重复 */
      elementOrderArr: []
    }
  },
  computed: {
    ...mapState(['formEdit']),
    /* 预览按钮 */
    previewDisable() {
      return this.headInfo.surveyName ? false : true
    }
  },
  created() {
    if (location.pathname.includes('/create-form')) {
      /* 改变状态 */
      this.changeEdit(false)
    }
    if (this.formEdit) {
      //如果是编辑
      const formDate = this.getFormDate()
      this.page = formDate
      Object.keys(this.headInfo).forEach(key => {
        this.headInfo[key] = this.page[key]
      })
    } else {
      /* 给page赋初始值 */
      this.page = deepClone(pageMap)
    }
  },
  mounted() {
    this.$bus.$on('getOrders', () => {
      this.getOrder()
    })
    if (this.formEdit) {
      /* 获取元素序号 */
      this.getOrder()
    }
  },
  methods: {
    ...mapMutations(['changeEdit']),
    /* 获取formData */
    getFormDate() {
      return JSON.parse(localStorage.getItem('formData'))
    },
    editMode() {
      this.edit = true
    },
    addForm() {
      /* 打开预览按钮 */
      const form = deepClone(formMap)
      this.page.basicTableVOList.push(form)
      this.addFormFlag = true
    },
    deleteItem() {
      this.page.basicTableVOList.pop()
    },
    /* 保存一级表 */
    finishForm(index) {
      this.page.basicTableVOList[index] = this.$refs[`form${index}`][0].form
      if (this.page.basicTableVOList[index].surveyName === '') {
        this.$message({
          message: '请输入表单名称',
          type: 'warning'
        })
        return false
      }
      saveForm(this.page.basicTableVOList[index])
        .then(res => {
          this.$message({
            message: '一级表保存成功',
            type: 'success'
          })
        })
        .catch(error => {
          throw `一级表保存表异常${error}`
        })
    },
    preview() {
      /* 获取创建表的数据 */
      this.page.basicTableVOList.map((form, i) => {
        this.page.basicTableVOList[i] = this.$refs[`form${i}`][0].form
      })
      this.configs = this.page.basicTableVOList
      /* 打开生成按钮 */
      if (this.page.basicTableVOList.length > 0 && this.page.basicTableVOList[0].surveyName) {
        this.generateDisable = false
      }
      /* 隐藏编辑组件 */
      this.editForm = false
    },
    /* 保存 */
    generate() {
      /* 合并表头信息 */
      this.page = Object.assign(this.page, this.headInfo)
      /* 增加排序序号 */
      this.page.basicTableVOList.forEach((form, i1) => {
        form.seatNumber = i1
        form.basicModuleVOList.forEach((module, i2) => {
          module.seatNumber = i2
          module.basicElementVOList.forEach((ele, i3) => {
            ele.colnum = i3
          })
        })
      })
      if (this.formEdit) {
        updatePage(this.page).then(
          res => {
            this.completed = true
            this.saveCode = res.data
            this.$message({
              message: '更改成功',
              type: 'success'
            })
            this.toList()
          },
          error => {
            throw `二级表更改异常${error}`
          }
        )
      } else {
        /* 提交 */
        savePage(this.page).then(
          res => {
            this.completed = true
            this.saveCode = res.data
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.toList()
          },
          error => {
            throw `二级保存表异常${error}`
          }
        )
      }
    },
    toList() {
      this.$router.push({
        path: '/home/form/form-list',
        query: { surveyCode: this.saveCode }
      })
    },
    back() {
      this.$router.back(-1)
    },
    /* 找出元素编号 */
    getOrder() {
      /* 获取创建表的数据 */
      this.page.basicTableVOList.map((item, i) => {
        this.page.basicTableVOList[i] = this.$refs[`form${i}`][0].form
      })
      /* 遍历元素找出序号 */
      const eleOrderBox = []
      this.page.basicTableVOList.forEach(form => {
        form.basicModuleVOList.forEach(module => {
          module.basicElementVOList.forEach(ele => {
            eleOrderBox.push(ele.elementNumber)
          })
        })
      })
      // return eleOrderBox
      this.elementOrderArr = eleOrderBox
    }
  },
  components: {
    PageLayout,
    FormHeader,
    CustomHeader,
    AddForm,
    HeadPreview,
    FormPreview
  }
}
</script>
<style lang="scss" scoped>
.add-form-btn {
  margin: 5px 0;
  text-align: center;
}
.card-box {
  position: relative;
  margin-bottom: 15px;
}
.close-icon {
  cursor: pointer;
  position: absolute;
  bottom: 50px;
  right: 10px;
}
.finish-icon {
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
}
.preview {
  padding-top: 40px;
  position: relative;
  .opter-btn {
    position: absolute;
    top: 0;
    right: 0;
  }
}
.header {
  font-size: 16px;
  .edit-card {
    position: relative;
    padding-right: 20px;
  }
  .title {
    padding-top: 20px;
    margin: 0 auto;
  }
  .show-card {
    position: relative;
    .el-row {
      margin: 10px;
      .el-col {
        text-align: left;
      }
    }
  }
  .operate-icon {
    position: absolute;
    cursor: pointer;
    top: -10px;
    right: -10px;
    font-size: 14px;
  }
  .page-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
  .item-key {
    font-weight: 600;
    display: inline-block;
    width: 100px;
    text-align: end;
    color: #606266;
    padding-right: 5px;
  }
  .item-value {
    color: #909399;
  }
}
</style>
