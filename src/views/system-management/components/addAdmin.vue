<template>
  <!-- 新增界面 -->
  <el-dialog title="新增用户" :label-position="labelPosition" :visible.sync="visible" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :inline="true" :label-position="labelPosition" :model="addForm" :rules="addFormRules" label-width="160px" class="demo-form-inline" width="500px" ref="addForm">
      <el-form-item label="用户账号" prop="nickname">
        <el-input v-model.trim="addForm.nickname" class="myselect"></el-input>
      </el-form-item>

      <el-form-item label="用户姓名" prop="username">
        <el-input v-model.trim="addForm.username" class="myselect"></el-input>
      </el-form-item>

      <el-form-item label="登录密码" prop="password">
        <el-input v-model.trim="addForm.password" class="myselect" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input v-model.trim="addForm.checkPass" class="myselect" type="password"></el-input>
      </el-form-item>

      <el-form-item label="用户角色" prop="roleid">
        <el-select v-model="addForm.roleid" class="myselect" placeholder="请选择角色">
          <el-option v-for="item in getRoleList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户单位" prop="unitid">
        <el-select v-model="addForm.unitId" @change="changSelect($event)">
          <el-option v-for="item in unitList" :label="item.detailedName" :value="item.organizationCode" :key="item.organizationCode"> </el-option>
        </el-select>
      </el-form-item>
      <div class="center" style="overflow: hidden">
        <div style="float: right;">
          <el-button @click.native="close">取消</el-button>
          <el-button type="primary" size="medium" @click.native="addSubmit">提交</el-button>
        </div>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import roleList from '../options/roleOption.js'
import { insertData } from '@/api/system/admin.js'
import { getAllUnitsList } from '@/api/system/units.js'
import { format } from '@/common/js/util'
import crypto from '@/common/js/crypto'
import SelectUnitList from '@/common/js/roleOption'
export default {
  components: {
    SelectUnitList
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // 校验用户账号
    let validateNickName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户账号'))
      } else {
        let reg = /^[A-Za-z0-9]{1,20}$/.test(value)
        if (!reg) {
          callback(new Error('只能输入中英文、数字，长度1-20'))
        }
        callback()
      }
    }

    // 校验密码
    let validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        if (this.addForm.checkPass !== '') {
          this.$refs.addForm.validateField('checkPass')
        }
        callback()
      }
    }
    // 校验确认密码
    let validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.addForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      labelPosition: 'right',
      addForm: {},
      addFormRules: {
        username: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }, { pattern: /^[\u4E00-\u9FA5A-Za-z0-9]{1,20}$/, message: '只能输入中英文、数字，长度1-20' }],
        nickname: [{ validator: validateNickName, trigger: 'blur' }],
        password: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }],
        roleid: [{ required: true, message: '请选择用户所属角色', trigger: 'change' }],
        unitId: [{ required: true, message: '请选择用户所属单位', trigger: 'change' }]
      },
      /** 角色下拉选 */
      getRoleList: roleList.roleSelect(),
      cosType: 1, // 1-单张图片
      url: '',
      isUse: 'false',
      unitList: undefined,
      unitLevel: undefined,
      unitId: undefined,
      unitName: undefined,
      oId: '',
      oCode: ''
    }
  },
  mounted() {
    this.getUnitList()
  },
  methods: {
    changSelect(ev) {
      console.log(ev)
      this.unitList.forEach((value, index, arr) => {
        if (value.organizationCode === ev) {
          this.unitLevel = value.unitLevel
          this.unitId = value.id
          this.unitName = value.userName
          this.oId = value.id
          this.oCode = value.organizationCode
        }
      })
    },
    close() {
      // 直接修改父组件的属性
      this.$emit('update:visible', false)
    },
    // 新增用户列表
    addSubmit: function() {
      // // 先校验账号是否已经存在..
      // getStaffByLoginName(this.addForm.staffLoginName).then(res => {
      //   if (res.data.data === 1) {
      //     this.$message({
      //       message: '您输入的用户账号已经被使用了,请重新输入 ',
      //       type: 'error'
      //     })
      //   } else {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            let para = Object.assign({}, this.addForm)
            para.createTime = format(new Date(), 'yyyy-MM-dd hh:mm:ss')
            para.facephoto = this.url
            // para.staffPwd = cryptoUtil.MD5(para.staffAliasName + '-' + para.staffPwd)
            para.password = crypto.MD5(this.addForm.password)
            para.disabled = 0 // 用户状态默认正常..
            para.unitId = this.unitId
            para.unitName = this.unitName
            para.unitLevel = this.unitLevel
            para.oid = this.oId
            para.ocode = this.oCode
            // console.log(Object.assign({}, para))
            insertData(para).then(res => {
              if (res.data.code === 0) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                // 直接修改父组件的属性
                this.$emit('update:visible', false)
                // 执行查询方法，刷新页面
                this.$emit('refresh')
              } else {
                this.$message({
                  message: '添加失败 ',
                  type: 'error'
                })
              }
            })
          })
        }
      })
      //   }
      // })
    },

    getUnitList() {
      const params = {
        page: 1,
        size: 100,
        unitName: ''
      }
      getAllUnitsList(params).then(res => {
        this.unitList = res.data.data.content
      })
    },

    childByValue(childValue) {
      this.url = childValue.url
    }
  }
}
</script>

<style scoped>
.left {
  float: left;
  width: 70%;
  height: 320px;
}
.right {
  float: left;
  width: 30%;
  height: 320px;
}

hr {
  color: #d2d2d2;
}

.footer {
  text-align: center;
}
</style>
