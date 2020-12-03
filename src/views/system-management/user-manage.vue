<template>
  <div class="page-container">
    <div class="topside">
      <el-form :inline="true" :model="filters">
        <el-form-item label="用户姓名">
          <el-input v-model="filters.username" placeholder="请输入用户姓名" size="small"></el-input>
        </el-form-item>

        <el-form-item label="用户电话">
          <el-input v-model="filters.telephone" placeholder="请输入用户电话" size="small"></el-input>
        </el-form-item>

        <el-form-item label="用户角色">
          <el-select v-model="filters.roleid" class="myselect" placeholder="请选择用户角色" size="small">
            <el-option v-for="item in roleidSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" v-on:click="queryAll()" size="small">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd" size="small">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card>
      <section>
        <!--工具条-->
        <!-- <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
      <el-form :inline='true' :model='filters'>
        <el-form-item label='用户姓名'>
          <el-input v-model='filters.username' placeholder='请输入用户姓名'></el-input>
        </el-form-item>

        <el-form-item label='用户电话'>
          <el-input v-model='filters.telephone' placeholder='请输入用户电话'></el-input>
        </el-form-item>

        <el-form-item label='用户角色'>
          <el-select v-model='filters.roleid' class='myselect' placeholder='请选择用户角色'>
            <el-option
              v-for='item in roleidSelect'
              :key='item.value'
              :label='item.label'
              :value='item.value'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type='primary' v-on:click='queryAll()'>查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='handleAdd'>新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>-->

        <!--列表-->
        <el-table
          :data="tableData"
          class="gutter"
          border
          stripe
          highlight-current-row
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          style="width: 100%;"
        >
          <el-table-column prop="username" align="center" label="用户姓名" min-width="80"></el-table-column>
          <el-table-column prop="nickname" align="center" label="用户账号" min-width="80"></el-table-column>
          <!-- <el-table-column prop="telephone" align="center" label="电话" min-width="80"></el-table-column> -->
          <!-- <el-table-column prop="email" align="center" label="邮箱" min-width="80"></el-table-column> -->
          <el-table-column prop="roleName" align="center" label="角色" min-width="80"></el-table-column>
          <!-- <el-table-column prop="createTime" align="center" label="创建时间" min-width="80"></el-table-column> -->
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <!-- <el-link v-if="scope.row.id !== userid" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-link> -->
              <el-link type="danger" v-if="scope.row.id !== userid" @click="handleDel(scope.$index, scope.row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="page_bar">
          <paging-toolbar :pager="pager" @change="queryAll('condition')" />
        </el-col>
        <!--编辑模块-->
        <edit-admin :id="id" v-if="editAdminVisible" :visible.sync="editAdminVisible" @refresh="queryAll()" width="300"></edit-admin>
        <!--新增模块-->
        <add-admin v-if="addAdminVisible" :visible.sync="addAdminVisible" @refresh="queryAll()"></add-admin>
      </section>
    </el-card>
  </div>
</template>
<script>
import roleOption from './options/roleOption'
import EditAdmin from './components/editAdmin'
import addAdmin from './components/addAdmin'
import PagingToolbar from './components/paging'
import { getAdminVOPageList, updateDisabledById, deleteRoleById } from '@/api/system/admin'

export default {
  components: { PagingToolbar, addAdmin, EditAdmin },
  data() {
    return {
      labelPosition: 'right',
      filters: {},
      // 显示编辑界面
      editAdminVisible: false,
      // 编辑详情数据
      id: '',
      // 新增界面是否显示
      addAdminVisible: false,
      pager: {
        total: 0, // 总条数
        page: 1, // 当前页
        rows: 10 // 每页显示多少条
      },
      loading: false,
      tableData: [],
      userid: Number(sessionStorage.getItem('userId')),
      roleidSelect: roleOption.roleSelect({})
    }
  },
  methods: {
    // 性别显示转换
    formatSex: function(row) {
      return row.sex === 0 ? '男' : row.sex === 1 ? '女' : '未知'
    },
    changeSwitch(data) {
      // console.log(Object.assign({}, data))
      let para = {}
      para.id = data.id
      para.disabled = data.disabled
      // console.log(para);
      updateDisabledById(para).then(res => {
        let code = res.data.code
        if (code === 0) {
          this.$message({
            message: '状态修改成功',
            type: 'success'
          })
          // 直接修改父组件的属性
          this.$emit('update:visible', false) // 执行查询方法，刷新页面
          this.$emit('refresh')
        } else {
          this.$message.error('错了哦,请联系管理员')
        }
      })
      // 或者使用下面的方法..
      // this.$axios.get('/web-api/web/admin/updateDisabledById?id='+data.id+'&disabled='+data.disabled).then((res) => {
      //   let code = res.data.code
      //     if (code === 0) {
      //       this.$message({
      //         message: '状态修改成功',
      //         type: 'success'
      //       })
      //       // 直接修改父组件的属性
      //       this.$emit('update:visible', false)// 执行查询方法，刷新页面
      //       this.$emit('refresh')
      //   }else {
      //     this.$message.error('错了哦,请联系管理员')
      //   }
      // }).catch(function (error) {
      //   console.log(error)
      // })
    },
    // 获取角色列表-------start
    queryAll(condition) {
      this.loading = true
      let formInitData = {}
      if (condition === undefined) {
        // 条件查询
        sessionStorage.setItem('formInit', JSON.stringify(this.filters))
        this.filters.page = 1
        this.filters.limit = this.pager.rows
        formInitData = this.filters
        formInitData.unitId = sessionStorage.getItem('unitId')
      } else {
        // 分页查询
        let formInit = JSON.parse(sessionStorage.getItem('formInit'))
        if (JSON.stringify(formInit) !== '{}') {
          formInitData = formInit
        }
        formInitData.page = this.pager.page
        formInitData.limit = this.pager.rows
        formInitData.unitId = sessionStorage.getItem('unitId')
      }
      // 请求数据
      getAdminVOPageList(formInitData)
        .then(res => {
          this.pager.page = formInitData.page
          this.pager.total = res.data.data.total
          this.tableData = res.data.data.content

          this.loading = false
        })
        .catch(res => {
          this.loading = false
        })
    },

    // 是否显示编辑页面
    handleEdit(index, row) {
      this.editAdminVisible = true
      this.id = row.id
    },

    // 显示新增界面
    handleAdd: function() {
      this.addAdminVisible = true
    },

    // 删除-------start
    handleDel: function(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          let para = row.id
          deleteRoleById(para).then(res => {
            this.loading = false
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.queryAll()
          })
        })
        .catch(() => {})
    }
    // 删除--------end
  },
  mounted() {
    this.queryAll()
  }
}
</script>

<style lang="scss" scoped>
.homepage {
  width: 100%;
  .topside {
    height: 50px;
    border-radius: 6px;
    background-color: #eee;
    >>> .el-input--mini .el-input__inner {
      width: 190px !important;
    }
    .el-form {
      margin-left: 50px;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 200px;
    }
  }
}
.page_bar {
  display: flex;
  justify-content: flex-end;
  margin: 14px 0;
}
</style>
