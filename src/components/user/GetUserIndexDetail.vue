<template>
  <div>
    <el-header>
      <el-breadcrumb separator="|" class="crumb">
        <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/GetUserIndex' }">用户列表</el-breadcrumb-item>
        <el-breadcrumb-item>用户详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-main style="width:70%;">
      <el-form ref="editForm" label-width="150px" class="demo-editForm">
        <el-form-item label="昵称：" prop="Name">
          {{editForm.Name}}
        </el-form-item>
        <el-form-item label="头像：" prop="Image">
          <img :src="mainurl+editForm.Image" width="100" />
        </el-form-item>
        <el-form-item label="手机号：" prop="ReceiveType">
          {{editForm.Phone}}
        </el-form-item>
        <el-form-item label="性别：" prop="ActivityTime">
          {{editForm.Sex|sexfilter}}
        </el-form-item>
        <el-form-item label="位置：" prop="Contribution">
          {{editForm.Region}}
        </el-form-item>
        <el-form-item label="生日：" prop="TotalCount">
          {{editForm.BrithDay}}
        </el-form-item>
        <el-form-item label="个人简介：" prop="DayCount">
          {{editForm.Introduce}}
        </el-form-item>
        <!-- <el-form-item label="支付宝账号：" prop="UserCount">
          <el-input v-model="editForm.ActivityName" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="提现人姓名：" prop="UserDayCount">
          <el-input v-model="editForm.ActivityName" style="width:200px;"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="back()">返回</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>
<script>
import qs from "qs"
export default {
  data() {
    return {
      editForm: [],
      mainurl :''
  }
  },
  methods: {
    back(){
      this.$router.push("/GetUserIndex");
    }
  },
  filters: {  
    sexfilter: function (value) {  
      if(value == '-1'){
        value = "未定义"
      }else if(value == '0'){
        value = "女"
      }else{
        value = "男"
      }
        return value
    }  
},  
  mounted() {
    this.mainurl = mainurl;
    const loading = this.$loading({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    this.action = mainurl + "api/BackOperate/ParkExport";
    // 获取详情
    this.$http
      .get("api/Back_UserList/GetUserDetail", {
        params: {
          Token: getCookie("token"),
          userID: window.location.href.split("id=")[1]
        }
      })
      .then(
        function(response) {
          loading.close();
          var status = response.data.Status;
          if (status === 1) {
            this.editForm = response.data.Result;
          } else if (status === 40001) {
            this.$message({
              showClose: true,
              type: "warning",
              message: response.data.Result
            });
            setTimeout(() => {
              this.$router.push({
                path: "/login"
              });
            }, 1500);
          }
        }.bind(this)
      )
      // 请求error
      .catch(
        function(error) {
          loading.close();
          this.$notify.error({
            title: "错误",
            message: "错误：请检查网络"
          });
        }.bind(this)
      );
  },
};
</script>
<style scoped>
.is-controls-right {
  float: right;
  margin-right: 50%;
}
</style>
