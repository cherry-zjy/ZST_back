<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>广告列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;" v-if="!change">
      <el-form :inline="true" style="float:right">
        <el-form-item>
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- table 内容 -->
    <el-table :data="List" style="width: 100%" :border='true' v-if="!change">
      <el-table-column label="广告标题" prop="Name">
      </el-table-column>
      <el-table-column label="广告图" prop="Image">
        <template slot-scope="scope">
          <img :src="mainurl+scope.row.Image" width="200" />
        </template>
      </el-table-column>
      <el-table-column label="广告类型" prop="Type" :formatter="typeText">
      </el-table-column>
      <el-table-column label="链接地址" prop="Url">
      </el-table-column>
      <el-table-column label="投放人姓名" prop="Name">
      </el-table-column>
      <el-table-column label="到期时间" prop="ExpiryTime" :formatter="timefilterHandler">
      </el-table-column>
      <el-table-column label="状态" prop="State" :formatter="statefilterHandler">
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="del(scope.row.ID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block" v-if="!change">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>

    <el-main style="width:70%;" v-if="change">

      <el-form :model="getList" ref="getList" label-width="150px" class="demo-ruleForm" :rules="rules">
        <el-form-item>
          <el-button type="primary" @click="change = false" style="float:right">返回</el-button>
        </el-form-item>
        <el-form-item label="广告标题" prop="Title">
          <el-input v-model="getList.Title"></el-input>
        </el-form-item>
        <el-form-item label="跳转地址" prop="Url">
          <el-input v-model="getList.Url"></el-input>
        </el-form-item>
        <el-form-item label="广告类型" prop="Type">
          <el-select v-model="getList.Type" placeholder="请选择类型">
            <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投放人姓名" prop="Name">
          <el-input v-model="getList.Name"></el-input>
        </el-form-item>
        <el-form-item label="到期时间" prop="ExpiryTime">
          <el-date-picker type="date" placeholder="到期时间" v-model="getList.ExpiryTime" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="广告大图" prop="Image">
          <el-upload v-model="getList.Image" class="avatar-uploader" :action="action" :show-file-list="false" :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('getList')" v-if="!add">修改</el-button>
          <el-button type="primary" @click="addForm('getList')" v-if="add">添加</el-button>
          <el-button @click="resetForm('getList')">重置</el-button>
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
        List: [], //列表
        pageCount: 1,
        mainurl: "",
        filters: {
          pageIndex: 1,
          pageSize: 12,
          Token: getCookie("token"),
        },
        change: false,
        typeList: [{
            name: "欢迎广告页",
            type: 0
          },
          {
            name: "首页间接广告位",
            type: 1
          },
          {
            name: "配对页广告位",
            type: 2
          },
          {
            name: "作品页广告位",
            type: 3
          }
        ],
        getList: {
          ExpiryTime: '',
          State: '',
          ID: '',
          Image: '',
          Name: '',
          Type: '',
          Url: '',
          Title: '',
        },
        action: "",
        add: false,
        imageUrl: "",
        rules: {
          Image: [{
            required: true,
            message: "请上传图片",
            trigger: "blur"
          }],
          Name: [{
            required: true,
            message: '请输入投放人姓名',
            trigger: 'blur'
          }, ],
          Url: [{
            required: true,
            message: '请输入跳转地址',
            trigger: 'blur'
          }, ],
          Title: [{
            required: true,
            message: '请输入广告标题',
            trigger: 'blur'
          }, ],
          Type: [{
            required: true,
            message: '请选择广告类型',
            trigger: 'change'
          }],
          ExpiryTime: [{
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change'
          }],
        }
      };
    },
    mounted() {
      this.mainurl = mainurl;
      this.action = this.mainurl + "/api/Photo/UpdateForImage?type=0",
        this.getInfo();
    },
    methods: {
      timefilterHandler(row) {
        var ExpiryTime = row.ExpiryTime;
        ExpiryTime = ExpiryTime.substring(0, 10);
        return ExpiryTime
      },
      typeText(row, Type) {
        var type = row[Type.property];
        switch (type) {
          case 0:
            return (type = "欢迎广告页");
            break;
          case 1:
            return (type = "首页间接广告位");
            break;
          case 2:
            return (type = "配对页广告位");
            break;
          case 3:
            return (type = "作品页广告位");
            break;
          default:
            break;
        }
      },
      statefilterHandler(row, State) {
        var State = row[State.property];
        switch (State) {
          case 0:
            return (State = "上架");
            break;
          case 1:
            return (State = "下架");
            break;
        }
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.getList.Image = res.Result[0];
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isLt2M;
      },
      // 修改提交
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            //判断是否填写完整  --true
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              var para = Object.assign({}, this.getList);
              const loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
              });
              // 发保存请求
              this.$http
                .post("api/Back_PlatformManager/EditBannerList",
                  qs.stringify({
                    Token: getCookie("token"),
                    InvestID: para.ID,
                    Type: para.Type,
                    Image: para.Image,
                    Name: para.Name,
                    Url: para.Url,
                    Title: para.Title,
                    ExpiryTime: para.ExpiryTime,
                  })
                )
                .then(
                  function (response) {
                    loading.close();
                    var status = response.data.Status;
                    if (status === 1) {
                      this.$message({
                        showClose: true,
                        type: "success",
                        message: response.data.Result
                      });
                      // 表单重置
                      this.$refs["getList"].resetFields();
                      this.getInfo();
                      this.change = false;
                      this.add = fasle;
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
                    // this.$notify.error({
                    //   title: "错误",
                    //   message: "错误：请检查网络"
                    // });
                  }.bind(this)
                );
            });
          }
        });
      },
      // 新增提交
      addForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            //判断是否填写完整  --true
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              var para = Object.assign({}, this.getList);
              const loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
              });
              // 发保存请求
              this.$http
                .post("api/Back_PlatformManager/AddInvestment",
                  qs.stringify({
                    Token: getCookie("token"),
                    Type: para.Type,
                    Image: para.Image,
                    Name: para.Name,
                    Url: para.Url,
                    Title: para.Title,
                    ExpiryTime: para.ExpiryTime,
                  })
                )
                .then(
                  function (response) {
                    loading.close();
                    var status = response.data.Status;
                    if (status === 1) {
                      this.$message({
                        showClose: true,
                        type: "success",
                        message: response.data.Result
                      });
                      // 表单重置
                      this.$refs["getList"].resetFields();
                      this.getInfo();
                      this.change = false;
                      this.add = fasle;
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
                    // this.$notify.error({
                    //   title: "错误",
                    //   message: "错误：请检查网络"
                    // });
                  }.bind(this)
                );
            });
          }
        });
      },
      //删除
      del(id){
        this.$confirm('确认删除该广告?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          this.$http
            .get("api/Back_PlatformManager/DelBannerList", {
              params: {
                Token: getCookie("token"),
                bannerID: id,
              }
            })
            .then(
              function (response) {
                loading.close();
                var status = response.data.Status;
                if (status === 1) {
                  this.$message({
                    showClose: true,
                    type: "success",
                    message: response.data.Result
                  });
                  this.getInfo()
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      /*
        重置表单
        */
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      /*
           1、获取列表 渲染列表
           2、搜索关键字
           3、分页
        */
      getInfo() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_PlatformManager/GetInvestmentIndex", {
            params: this.filters
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.List = response.data.Result.investList;
                this.pageCount = response.data.Result.page;
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
      },
      //
      getUsers() {
        this.getInfo();
      },
      // 分页
      handleCurrentChange(val) {
        this.filters.pageIndex = val;
        this.getInfo();
      },
      //详情
      handleEdit(index, row) {
        console.log(Object.assign({}, row));
        var obj = Object.assign({}, row);
        this.getList = obj;
        this.getList.ExpiryTime = new Date(this.getList.ExpiryTime.substring(0,10))      
        this.imageUrl = this.mainurl + obj.Image;
        this.change = true;
        this.add = false;
      },
      //新增
      handleAdd() {
        this.change = true;
        this.add = true;
        this.getList = {
          ExpiryTime: '',
          State: '',
          ID: '',
          Image: '',
          Name: '',
          Type: '',
          Url: '',
          Title: '',
        };
        this.imageUrl = '';
      }
    },

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

  .avatar-uploader .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .el-upload--text {
    width: 100%;
  }

  .avatar-uploader-icon {
    font-size: 32px;
    color: #8c939d;
    width: 317px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #8c939d;
  }

  .avatar {
    width: 100%;
  }

</style>
