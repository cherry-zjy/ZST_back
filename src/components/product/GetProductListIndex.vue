<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage' }">作品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.keyword" placeholder="关键字" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers()">查询</el-button>
        </el-form-item>
        <el-form-item  style="float:right;">
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="productList" style="width: 100%" :border='true'>
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="商品图片:">
            <!-- <span>{{ props.row.name }}</span> -->
            <img v-for="(item,index) in props.row.Image" :key="index" :src="mainurl+item" width="200" style="margin-left:20px;" />
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
      <el-table-column label="商品名称" prop="Name">
      </el-table-column>
      <!-- <el-table-column label="商品图片" prop="Image" >
        <template slot-scope="scope">
            <img v-for="(item,index) in scope.row.Image" :key="index" :src="mainurl+item" width="200" />
        </template>
      </el-table-column> -->
      <el-table-column label="商品价格" prop="Price" sortable>
      </el-table-column>
      <el-table-column label="库存" prop="Stock" sortable>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini"  type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange"
       layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import md5 from "js-md5";

export default {
  data() {
    return {
      productList: [], //列表
      pageIndex: 1,
      pageSize: 3,
      pageCount: 1,
      mainurl: "",
      roleList: [], //管理员角色列表
      // 搜索关键字
      filters: {
        keyword: ""
      },
      //编辑界面是否显示
      editFormVisible: false,
      editLoading: false,

      //编辑界面数据
      editForm: {
        IsLock: false,
        Name: "",
        Role: "",
        RoleID: "",
        Password: ""
      },
      editFormRules: {
        Name: [
          {
            required: true,
            message: "请输入账户",
            trigger: "blur"
          }
        ],
        Password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      },
      //新增界面是否显示
      addFormVisible: false,
      addLoading: false,
      addFormRules: {
        Name: [
          {
            required: true,
            message: "请输入账户",
            trigger: "blur"
          }
        ],
        Password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      },
      //新增界面数据
      addForm: {
        IsLock: false,
        Name: "",
        RoleID: "",
        Password: ""
      }
    };
  },
  methods: {
    /*
         1、获取列表 渲染列表
         2、搜索关键字
         3、分页
      */
    getInfo() {
      this.$http
        .get("/api/Back_ProductList/GetProductList", {
          params: {
            token: getCookie("token"),
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            keyword: this.filters.keyword == "" ? "-1" : this.filters.keyword
          }
        })
        .then(
          function(response) {
            var status = response.data.Status;
            if (status === 1) {
              this.productList = response.data.Result.List;
              this.pageCount = response.data.Result.Page;
            } else if (status === 40001) {
              this.$message({
                showClose: true,
                type: "warning",
                message: response.data.Result
              });
              setTimeout(() => {
                tt.$router.push({
                  path: "/login"
                });
              }, 1500);
            }
          }.bind(this)
        )
        // 请求error
        .catch(
          function(error) {
            this.$notify.error({
              title: "错误",
              message: "错误：请检查网络"
            });
          }.bind(this)
        );
    },
    //
    getUsers() {
      this.getInfo();
    },
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getInfo();
    },
  },
  mounted() {
    this.mainurl = mainurl;
    this.getInfo();
  }
};
</script>
<style scoped>
/* 面包屑 */

.crumb {
  height: 36px;
  line-height: 36px;
}

.block {
  text-align: center;
  padding: 20px 0;
}
</style>
