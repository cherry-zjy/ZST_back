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
        <el-form-item label="停车场地址">
          <BaiDuMap :mapmsg="locationMsg" ref="map"></BaiDuMap>
        </el-form-item>
        <el-form-item label="停车场编号" prop="Number">
          <el-input v-model="editForm.Number"></el-input>
        </el-form-item>
        <el-form-item label="停车场名" prop="Name">
          <el-input v-model="editForm.Name"></el-input>
        </el-form-item>
        <el-form-item label="预约车位" prop="AppointmentCount">
          <el-input v-model.number="editForm.AppointmentCount"></el-input>
        </el-form-item>
        <el-form-item label="总车位" prop="TotalCount">
          <el-input v-model.number="editForm.TotalCount"></el-input>
        </el-form-item>
        <el-form-item label="剩余车位" prop="ResidualCount">
          <el-input v-model.number="editForm.ResidualCount"></el-input>
        </el-form-item>
        <el-form-item label="是否推荐" prop="IsRecommend">
          <el-switch v-model="editForm.IsRecommend"></el-switch>
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
    var checkResidualCount = (rule, value, callback) => {
      if (!value) {
        if (value == "0") {
          callback();
        } else {
          callback(new Error("剩余车位不能为空"));
        }
      } else {
        if (!Number(value)) {
          callback(new Error("请输入数字值"));
        } else if (value % 1 !== 0) {
          callback(new Error("必须为整数"));
        } else {
          if (value < 0) {
            callback(new Error("不能小于0"));
          } else {
            callback();
          }
        }
      }
      setTimeout(() => {
        // 是否为整数Number.isInteger
      }, 100);
      0.11;
    };
    var checkAppointmentCount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("预约车位不能为0或空"));
      }
      setTimeout(() => {
        // 是否为数字
        if (!Number(value)) {
          callback(new Error("请输入数字值"));
        } else if (value % 1 !== 0) {
          callback(new Error("必须为整数"));
        } else {
          if (value <= 0) {
            callback(new Error("必须大于0"));
          } else {
            callback();
          }
        }
      }, 100);
    };
    var checkTotalCount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("总车位不能为0或空"));
      }
      setTimeout(() => {
        // 是否为数字
        if (!Number(value)) {
          callback(new Error("请输入数字值"));
        } else if (value % 1 !== 0) {
          callback(new Error("必须为整数"));
        } else {
          if (value <= 0) {
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
        Number: "", //停车场编号
        Name: "", //停车场名
        ResidualCount: "", //剩余车位
        AppointmentCount: "", //预约车位
        TotalCount: "", //总车位
        Address: "", //地址
        Longitude: 0, //经纬度
        Latitude: 0,
        IsRecommend: false //是否推荐
      },
      rules: {
        Number: [
          {
            required: true,
            message: "请输入停车场编号",
            trigger: "blur"
          }
        ],
        Name: [
          {
            required: true,
            message: "请输入停车场名",
            trigger: "blur"
          }
        ],
        ResidualCount: [
          {
            validator: checkResidualCount
          }
        ],
        AppointmentCount: [
          {
            validator: checkAppointmentCount
          }
        ],
        TotalCount: [
          {
            validator: checkTotalCount
          }
        ],
        IsRecommend: [
          {
            required: true,
            message: "是否推荐",
            trigger: "change"
          }
        ]
      },
      // 地图经纬度  通用
      locationMsg: {
        keyword: "",
        lnglat: "",
        address: ""
      }
    };
  },
  methods: {
    // 修改提交
    submitForm(formName) {
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
              para.Address = this.$refs.map.locationMsg.address;
              para.Longitude = this.$refs.map.locationMsg.lnglat.split(",")[0];
              para.Latitude = this.$refs.map.locationMsg.lnglat.split(",")[1];
              // 发保存请求
              this.$http
                .post("/sps/api/BackPark/EditPark", para)
                .then(
                  function(response) {
                    this.editLoading = false;
                    var status = response.data.Status;
                    if (status === 1) {
                      // 表单重置
                      this.$refs["editForm"].resetFields();
                      this.editFormVisible = false;
                      this.$router.push({
                        path: "/BackParkList"
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
  beforeMount() {
    var parkInfo = JSON.parse(localStorage.getItem("parkListInfo"));
    this.editForm = parkInfo;
    this.locationMsg.lnglat = parkInfo.Longitude + "," + parkInfo.Latitude;
    this.locationMsg.address = parkInfo.Address;
  }
};
</script>
<style scoped>

</style>
