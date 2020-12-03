<template>
  <div class="header">
    <div class="edit-card" v-if="edit">
      <div class="el-icon-check operate-icon" @click="enter"></div>
      <div class="title">
        <el-form ref="headInfo" :rules="rules" :model="headInfo" label-width="80px">
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
    <div class="show-card" v-else>
      <div class="el-icon-edit operate-icon" @click="editMode"></div>
      <div class="page-title" v-if="headInfo.surveyName">
        {{ headInfo.surveyName }}
      </div>
      <el-row>
        <el-col :span="7">
          <span class="item-key">制定机关:</span><span class="item-value">{{ headInfo.submitUnit }}</span>
        </el-col>
        <el-col :span="10" style="visibility: hidden;"> dsafds</el-col>
        <el-col :span="7">
          <span class="item-key">批准机关:</span><span class="item-value">{{ headInfo.approveUnit }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <span class="item-key">批准文号:</span><span class="item-value">{{ headInfo.approveNo }}</span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { deepClone } from '@/common/js/tool'
export default {
  name: 'FormHeader',
  data() {
    return {
      edit: true,
      headInfo: {
        surveyName: '',
        approveUnit: '',
        approveNo: ''
      },
      rules: {
        surveyName: [{ required: true, message: '请输入标题名称', trigger: 'blur' }]
      }
    }
  },

  methods: {
    enter() {
      this.$refs.headInfo.validate(avli => {
        if (avli) {
          this.edit = false
          this.$emit('headSave', this.headInfo)
        } else {
          return
        }
      })
    },
    editMode() {
      this.edit = true
    }
  }
}
</script>

<style lang="scss" scoped>
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
