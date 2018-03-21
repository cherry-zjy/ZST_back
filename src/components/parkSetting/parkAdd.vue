<template>
  <div>
    <el-header>
      <el-breadcrumb separator="|" class="crumb">
        <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/BackParkList' }">停车场列表</el-breadcrumb-item>
        <el-breadcrumb-item>停车场添加</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-main style="width:70%;">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="150px" class="demo-addForm">
        <el-form-item label="停车场地址" prop="Details">
          <BaiDuMap :mapmsg="locationMsg" ref="map"></BaiDuMap>
        </el-form-item>
        <el-form-item label="停车场编号" prop="Name">
          <el-input v-model="addForm.Name"></el-input>
        </el-form-item>
        <el-form-item label="停车场名" prop="Price">
          <el-input v-model="addForm.Price"></el-input>
        </el-form-item>
        <el-form-item label="预约车位" prop="Stock">
          <el-input v-model.number="addForm.Stock"></el-input>
        </el-form-item>
        <el-form-item label="总车位" prop="Stock">
          <el-input v-model.number="addForm.Stock"></el-input>
        </el-form-item>
        <el-form-item label="是否推荐" prop="IsFreeShipping">
          <el-switch v-model="addForm.IsFreeShipping"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('addForm')">立即添加</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>
<script>
import BaiDuMap from "../BaiDuMap.vue"; //在页面中引入高德地图
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
      mainurl: "http://hxm.nbxuanma.com",
      action: "http://hxm.nbxuanma.com/api/Photo/UpdateForImage?type=0",
      dialogImageUrl: "",
      dialogVisible: false,
      addForm: {
        Name: "", //名称
        Price: "", //价格
        Stock: "", //库存
        Image: [], //图片
        IsFreeShipping: false, //邮费选择
        Brief: "", //简介
        Details: ""
      },
      // 地图经纬度  通用
      locationMsg: {
        keyword: "",
        lnglat: "",
        address: ""
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
          }
        ],
        Stock: [
          {
            validator: checkStock
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
        lnglat: [
          {
            required: true,
            message: "请输入获取经纬度",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "根据经纬度自动生成",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 添加提交
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
              this.addLoading = true;
              var para = Object.assign({}, this.addForm);
              // 将token传入参数中
              para.Token = getCookie("token");
              para.Image = para.Image.join(",");

              // 发保存请求
              //   this.$http
              // .post("/sps/api/Back/P_ProductAdd", para)
              // .then(
              //   function (response) {
              //     this.addLoading = false;
              //     var status = response.data.Status;
              //     if (status === 1) {
              //       // 表单重置
              //       this.$refs["addForm"].resetFields();
              //       this.addFormVisible = false;
              //       this.$router.push({
              //         path: "/P_GetProductList"
              //       });
              //     } else if (status === 40001) {
              //       this.$message({
              //         showClose: true,
              //         type: "warning",
              //         message: response.data.Result
              //       });
              //       setTimeout(() => {
              //         tt.$router.push({
              //           path: "/login"
              //         });
              //       }, 1500);
              //     } else {
              //       this.$message({
              //         showClose: true,
              //         type: "warning",
              //         message: response.data.Result
              //       });
              //     }
              //   }.bind(this)
              // )
              // 请求error
              // .catch(
              //   function (error) {
              //     this.$notify.error({
              //       title: "错误",
              //       message: "错误：请检查网络"
              //     });
              //   }.bind(this)
              // );
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },

    addSubmit() {
      var content = this.$refs.ueditor.getUEContent();
      this.addForm.Details = encodeURIComponent(content);
    },
    /*
        /*
          重置表单
          */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {}
};
</script>
<style scoped>
#tangram-suggestion--TANGRAM__u-main {
  z-index: 4000 !important;
}
</style>
