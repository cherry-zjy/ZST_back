<template>
  <div>
    <el-header>
      <el-breadcrumb separator="|" class="crumb">
        <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/BackCouponList' }">优惠券管理</el-breadcrumb-item>
        <el-breadcrumb-item>优惠券添加</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-main style="width:70%;">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="150px" class="demo-addForm">
        <el-form-item label="活动名称" prop="Name">
          <el-input v-model="addForm.Name" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="活动类型" prop="Price">
          <el-select v-model="addForm.Price" placeholder="请选择活动类型">
            <el-option label="停车券" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间" prop="Stock">
          <el-date-picker v-model="addForm.Stock" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出资方" prop="Stock">
          <el-input v-model.number="addForm.Stock" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="限制次数" prop="IsFreeShipping">
          <el-checkbox-group v-model="addForm.IsFreeShipping">
            <el-checkbox label="总 限 量"></el-checkbox>
            <el-input-number v-model="addForm.IsFreeShipping.num1" controls-position="right" :min="0" :max="100"></el-input-number>
            <br>
            <el-checkbox label="每日限量"></el-checkbox>
            <el-input-number v-model="addForm.IsFreeShipping.num2" controls-position="right" :min="0" :max="100"></el-input-number>
            <br>
            <el-checkbox label="每人限量"></el-checkbox>
            <el-input-number v-model="addForm.IsFreeShipping.num3" controls-position="right" :min="0" :max="100"></el-input-number>
            <br>
            <el-checkbox label="每人每日限量"></el-checkbox>
            <el-input-number v-model="addForm.IsFreeShipping.num4" controls-position="right" :min="0" :max="100"></el-input-number>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="参与车场" prop="Brief">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox> <span style="font-size:12px;">(若内容过多请滚动查看)</span>
          <el-upload style="float:right;"
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :before-remove="beforeRemove"
  :on-exceed="handleExceed">
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">若选择上传则单选失效</div>
</el-upload>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" style="overflow-y: scroll;max-height: 200px;">
            <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="券类型" prop="Details">
          <el-select v-model="addForm.Details" placeholder="请选择券类型">
            <el-option label="元" value="0"></el-option>
            <el-option label="折" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="券额度" :rules="{
          required: true, message: '不能为空', trigger: 'blur'
        }">
          <div style="float:right;margin-right:30%;top:0px;">
            <span>点击增加
              <i class="el-icon-circle-plus" @click="addDomain" style="cursor: pointer;"></i>
            </span>
          </div>
          <div v-if="addForm.Details == 0" class="yuan" v-for="(domain, index) in addForm.domains" :key="index">
            满
            <el-input v-model="addForm.input1" size="small" style="width:200px;" placeholder="多少"></el-input>
            减
            <el-input v-model="addForm.input2" size="small" style="width:200px;" placeholder="多少元"></el-input>
            <i v-if="quanNum>1" class="el-icon-remove" style="cursor: pointer;" @click.prevent="removeDomain(domain)"></i>

          </div>
          <div v-else class="discoun">
            满
            <el-input v-model="addForm.input1" size="small" style="width:200px;" placeholder="多少"></el-input>
            打
            <el-input v-model="addForm.input2" size="small" style="width:200px;" placeholder="几折"></el-input>
            <i v-if="quanNum>1" class="el-icon-remove" style="cursor: pointer;" @click.prevent="removeDomain(domain)"></i>
          </div>

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
const cityOptions = ["上海", "北京", "广州", "深圳"];
export default {
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
        IsFreeShipping: {
          // 限制次数
          num1: 0,
          num2: 0,
          num3: 0,
          num4: 0
        }, //邮费选择
        Brief: "", //简介
        Details: "",
        domains: [
          {
            input1: "",
            input2: ""
          }
        ]
      },
      // 券额度数量
      quanNum: 1,
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
        Details: [
          {
            required: true,
            message: "图文详情不能为空",
            trigger: "blur"
          }
        ]
      },

      // 参与车场
      isIndeterminate: true, //用于全选
      cities: cityOptions,
      checkAll: false,
      checkedCities: ["上海", "北京"]
    };
  },
  methods: {
    // 参与车场
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      console.log(value);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
    //新增 删除
    addDomain() {
      this.quanNum++;
      this.addForm.domains.push({
        value: "",
        key: Date.now()
      });
    },
    removeDomain(item) {
      this.quanNum--;
      var index = this.addForm.domains.indexOf(item);
      if (this.addForm.domains.length > 1) {
        if (index !== -1) {
          this.addForm.domains.splice(index, 1);
        }
      } else {
        this.$message({
          message: "警告哦，至少存在一条",
          type: "warning"
        });
      }
    },

    // 添加提交
    submitForm(formName) {
      console.log(this.add);
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
            this.$http
              .post("/sps/api/Back/P_ProductAdd", para)
              .then(
                function(response) {
                  this.addLoading = false;
                  var status = response.data.Status;
                  if (status === 1) {
                    // 表单重置
                    this.$refs["addForm"].resetFields();
                    this.addFormVisible = false;
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
    },

    /*
        上传成功的回调函数
          handleAvatarSuccess(response, file, fileList) 
          respomse:请求回调，返回上传的图片地址
          file：该图片的参数信息
          fileList 返回当前所有的图片数组，
        */
    handleAvatarSuccess(response, file, fileList) {
      var arrImg = [];
      arrImg = arrImg.concat(response.Result[0]);
      this.addForm.Image = this.addForm.Image.concat(arrImg);
    },
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
.is-controls-right {
  float: right;
  margin-right: 65%;
}
</style>
