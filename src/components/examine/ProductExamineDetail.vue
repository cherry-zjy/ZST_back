<template>
  <div>
    <el-header>
      <el-breadcrumb separator="|" class="crumb">
        <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/ProductExamineIndex' }">作品审核列表</el-breadcrumb-item>
        <el-breadcrumb-item>作品审核详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-row>
      <el-col :span="12">
        <p class="title">作品信息</p>
        <el-form ref="editForm" label-width="150px" class="demo-editForm" :label-position="labelPosition">
          <el-form-item label="作品名：" prop="Name">
            {{editForm.Name}}
          </el-form-item>
          <el-form-item label="作品简介：" prop="Introduce">
            {{editForm.Introduce}}
          </el-form-item>
          <el-form-item label="发布人：" prop="Author">
            {{editForm.Author}}
          </el-form-item>
          <el-form-item label="作品大图：" prop="Image">
            <img :src="mainurl+editForm.Image" width="100" />
          </el-form-item>
          <el-form-item label="单品图：" prop="Images">
            <span v-for="(items,index) in imageForm" :key="index">
              <img :src="mainurl+items" width="100" class="imgpad">
            </span>
          </el-form-item>
          <el-form-item label="主色调：" prop="MainColor">
            {{editForm.MainColor}}
          </el-form-item>
          <el-form-item label="辅色调：" prop="SecondaryColor">
            {{editForm.SecondaryColor}}
          </el-form-item>
          <el-form-item label="空间分类：" prop="Area">
            {{editForm.Area}}
          </el-form-item>
          <el-form-item label="合适面积：" prop="Proportion">
            {{editForm.Proportion}}
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <p class="title">服务商信息</p>
        <el-form ref="editForm" label-width="150px" class="demo-editForm" :label-position="labelPosition">
          <el-form-item label="服务商官方全称：" prop="OfficialName">
            {{editForm.OfficialName}}
          </el-form-item>
          <el-form-item label="LOGO：" prop="Logo">
            <img :src="mainurl+editForm.Logo" width="100" />
          </el-form-item>
          <el-form-item label="服务商姓名：" prop="Contact">
            {{editForm.Contact}}
          </el-form-item>
          <el-form-item label="服务商手机号：" prop="Phone">
            {{editForm.Phone}}
          </el-form-item>
          <el-form-item label="地图位置：" prop="Address">
            {{editForm.Address}}
          </el-form-item>
          <el-form-item label="楼号门牌号：" prop="AddressDetail">
            {{editForm.AddressDetail}}
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <center>
      <el-button type="success" @click="dialogVisible2 = true">通过</el-button>
      <el-button type="danger" @click="dialogFormVisible = true">拒绝</el-button>
      <el-button type="primary" @click="back()" class="centerbtn">返回</el-button>
    </center>

    <el-dialog title="拒绝理由" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="请输入拒绝理由">
          <el-input v-model="reason" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="examine(2,reason)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogVisible2" width="30%">
      <span>确认审核通过？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="examine('1','-1')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import qs from "qs";
  export default {
    data() {
      return {
        editForm: [],
        imageForm: [],
        mainurl: "",
        labelPosition: 'left',
        reason: "",
        dialogFormVisible: false,
        dialogVisible2: false
      };
    },
    methods: {
      back() {
        this.$router.push("/ProductExamineIndex");
      },
      examine(state, reason) {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_ExamineManager/ExamineProduct", {
            params: {
              Token: getCookie("token"),
              prodID: window.location.href.split("id=")[1],
              state: state,
              reason: reason
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              this.dialogFormVisible = false;
              this.dialogVisible2 = false;
              if (status === 1) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: response.data.Result
                });
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
              } else {
                loading.close();
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: response.data.Result
                });
              }
            }.bind(this)
          )
          // 请求error
          .catch(
            function (error) {
              loading.close();
              this.$notify.error({
                title: "错误",
                message: "错误：请检查网络"
              });
            }.bind(this)
          );
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
      // 获取详情
      this.$http
        .get("api/Back_ExamineManager/ProdExamineDetail", {
          params: {
            Token: getCookie("token"),
            prodID: window.location.href.split("id=")[1]
          }
        })
        .then(
          function (response) {
            loading.close();
            var status = response.data.Status;
            if (status === 1) {
              this.editForm = response.data.Result;
              var images = response.data.Result.Images;
              this.imageForm = images.split(",");
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
            } else {
              loading.close();
              this.$message({
                showClose: true,
                type: "warning",
                message: response.data.Result
              });
            }
          }.bind(this)
        )
        // 请求error
        .catch(
          function (error) {
            loading.close();
            this.$notify.error({
              title: "错误",
              message: "错误：请检查网络"
            });
          }.bind(this)
        );
    }
  };

</script>
<style scoped>
  .is-controls-right {
    float: right;
    margin-right: 50%;
  }

  .title {
    font-size: 22px;
    padding: 15px;
    font-weight: bolder;
  }

  .el-form-item__label {
    text-align: left;
  }

  form {
    padding: 15px;
  }

  .imgpad {
    padding: 5px;
  }

</style>
