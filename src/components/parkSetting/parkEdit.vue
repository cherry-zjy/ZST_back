<template>
  <div>
    <el-header>
      <el-breadcrumb separator="|" class="crumb">
        <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/BackParkList' }">停车场列表</el-breadcrumb-item>
        <el-breadcrumb-item>停车场编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-main style="width:70%;">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="150px" class="demo-editForm">
        <el-form-item label="停车场地址" prop="Details">
          <BaiDuMap :mapmsg="locationMsg" ref="map"></BaiDuMap>
        </el-form-item>
        <el-form-item label="停车场编号" prop="Name">
          <el-input v-model="editForm.Name"></el-input>
        </el-form-item>
        <el-form-item label="停车场名" prop="Price">
          <el-input v-model="editForm.Price"></el-input>
        </el-form-item>
        <el-form-item label="预约车位" prop="Stock">
          <el-input v-model.number="editForm.Stock"></el-input>
        </el-form-item>
        <el-form-item label="总车位" prop="Stock">
          <el-input v-model.number="editForm.Stock"></el-input>
        </el-form-item>
        <el-form-item label="是否推荐" prop="IsFreeShipping">
          <el-switch v-model="editForm.IsFreeShipping"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">立即修改</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-main>

  </div>
</template>
<script>
import BaiDuMap from "../BaiDuMap.vue"; //在页面中引入地图
// import bus from "../../utils/bus.js";

export default {
  components: {
    BaiDuMap
  },
  data() {
    var checkPrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("价格不能为空"));
      }
      setTimeout(() => {
        // 是否为整数Number.isInteger
        if (!Number(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 0) {
            callback(new Error("必须大于0"));
          } else {
            callback();
          }
        }
      }, 100);
    };
    var checkStock = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("库存不能为空"));
      }
      setTimeout(() => {
        // 是否为数字
        if (!Number(value)) {
          callback(new Error("请输入数字值"));
        } else if (value % 1 !== 0) {
          callback(new Error("库存必须为整数"));
        } else {
          if (value < 0) {
            callback(new Error("必须大于0"));
          } else {
            callback();
          }
        }
      }, 100);
    };
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      editForm: {
        Name: "", //名称
        Price: "", //价格
        Stock: "", //库存
        Image: [], //图片
        IsFreeShipping: false, //邮费选择
        Brief: "", //简介
        Details: ""
      },
      rules: {
        Name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur"
          }
        ],
        Price: [
          {
            validator: checkPrice
            // trigger: 'blur'
          }
        ],
        Stock: [
          {
            validator: checkStock
            // trigger: 'blur'
          }
        ],
        IsFreeShipping: [
          {
            required: true,
            message: "请选择邮费",
            trigger: "change"
          }
        ],
        Image: [
          {
            type: "array",
            required: true,
            message: "请上传商品图片",
            trigger: "change"
          }
        ],
        Brief: [
          {
            required: true,
            message: "请输入商品简介",
            trigger: "blur"
          }
        ],
        Details: [
          {
            required: true,
            message: "图文详情不能为空",
            trigger: "blur"
          }
        ]
      },
      // 地图经纬度  通用
      locationMsg: {
        keyword: "",
        lnglat: "121.141044,29.568927",
        address: "浙江省宁波市奉化市"
      }
    };
  },
  methods: {
    // 修改提交
    submitForm(formName) {
      console.log(this.$refs.map.locationMsg);
      if (this.$refs.map.locationMsg.lnglat == "") {
        this.$message({
          message: "警告哦，请先地图选点获取经纬度地址",
          type: "warning"
        });
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            //判断是否填写完整  --true
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              this.editLoading = true;
              var para = Object.assign({}, this.editForm);
              // 将token传入参数中
              para.Token = getCookie("token");
              para.ID = window.location.href.split("id=")[1];
              para.Image = para.Image.join(",");
              // console.log(this.Images)
              //   console.log(para);
              // 发保存请求
              this.$http
                .post("/sps/api/Back/P_ProductEdit", para)
                .then(
                  function(response) {
                    this.editLoading = false;
                    var status = response.data.Status;
                    if (status === 1) {
                      // 表单重置
                      this.$refs["editForm"].resetFields();
                      this.editFormVisible = false;
                      this.$router.push({
                        path: "/P_GetProductList"
                      });
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
                  function(error) {
                    this.$notify.error({
                      title: "错误",
                      message: "错误：请检查网络"
                    });
                  }.bind(this)
                );
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    /*
      重置表单
      */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
    // bus.$emit("locationMsg", this.locationMsg);
    var id = window.location.href.split("id=")[1];
    this.$http
      .get("/sps/api/Back/P_GetProductDetail", {
        params: {
          ID: id,
          token: getCookie("token")
        }
      })
      .then(
        function(response) {
          var status = response.data.Status;
          if (status === 1) {
            this.editForm = response.data.Result;
            // console.log(this.editForm);
            var newArr = response.data.Result.Image;
            var newObj = {};
            for (var i = 0; i < newArr.length; i++) {
              var element = [
                {
                  url: mainurl + newArr[i]
                }
              ];
              this.Images = this.Images.concat(element);
            }
            // 将ID传入参数中
            // this.editForm.ID = obj.ID;
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
  }
};
</script>
<style scoped>

</style>
