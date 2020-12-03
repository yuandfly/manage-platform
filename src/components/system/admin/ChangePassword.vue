<template>
  <el-dialog title="修改管理员密码" :center="true" :visible.sync="visible" :before-close="close" :close-on-click-modal="false"
    :close-on-press-escape="false">
    <el-form :inline="true" :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
      <el-form-item label="用户名:" prop="videoid" >
        <el-input v-model="addForm.nickname" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="用户原密码:" prop="passWord" :rules="[
      { required: true, message: '不能为空'}, ]">
        <el-input v-model="addForm.passWord" show-password></el-input>
      </el-form-item>

      <el-form-item label="用户新密码:" prop="newPassWord" :rules="[
      { required: true, message: '不能为空'}, ]">
        <el-input v-model="addForm.newPassWord" show-password></el-input>
      </el-form-item>




    </el-form>
    <div slot="footer" class="dialog-footer" id="el-dialog__footer">
      <el-button @click="close">关闭</el-button>
      <el-button type="primary" @click.native="addSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
    get
  } from '@/http/http.js'
  import {adminChangePassword } from '@/api/system/admin'
   import crypto from "@/common/js/crypto.js";

  export default {
    components: {

    },
    data() {
      return {
        addForm: {},
        addLoading: false,
        addFormRules: {},
        user: {},
      }
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },

    mounted() {
      let sessionUser = sessionStorage.getItem('sessionUser');
      let sessionUserValue = crypto.decrypt(sessionUser, null);
      this.addForm = JSON.parse(sessionUserValue).adminData;

    },

    methods: {
      close() {
        // 直接修改父组件的属性
        this.$emit("update:visible", false);
      },
      addSubmit: function() {
        this.user.nickname=this.addForm.nickname
        this.user.id=this.addForm.adminId
        this.user.password=crypto.MD5(this.addForm.passWord)
        this.user.newPassWord=crypto.MD5(this.addForm.newPassWord)
        adminChangePassword(this.user).then(res=>{
          debugger
          if(res.data.code==0){
            this.$message({
            message: '状态修改成功',
            type: 'success',
          })
         this.$router.push({
           path: '/login'
         });

          }else{
            this.$message({
              message: "修改失败",
              type: 'error'
            })


          }
        })
      },



    }
  };
</script>
