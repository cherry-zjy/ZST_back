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
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="150px" class="demo-editForm">
        <el-form-item label="活动名称：" prop="ActivityName">
          <el-input v-model="editForm.ActivityName" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="活动类型：" prop="Type">
          <el-select v-model="editForm.Type" placeholder="请选择活动类型">
            <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领取类型：" prop="ReceiveType">
          <el-select v-model="editForm.ReceiveType" placeholder="请选择领取类型">
            <el-option v-for="item in ReceiveTypeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间：" prop="ActivityTime">
          <el-date-picker v-model="editForm.ActivityTime" value-format="yyyy-MM-dd" type="daterange" @change="changtime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出资方：" prop="Contribution">
          <el-input v-model.number="editForm.Contribution" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="总限量：" prop="TotalCount">
          <span style="font-size:12px;">(-1为不限量)</span>
          <el-input-number v-model="editForm.TotalCount" controls-position="right" :min="-1" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="每日限量：" prop="DayCount">
          <span style="font-size:12px;">(-1为不限量)</span>
          <el-input-number v-model="editForm.DayCount" controls-position="right" :min="-1" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="每人限量：" prop="UserCount">
          <span style="font-size:12px;">(0为不限量)</span>
          <el-input-number v-model="editForm.UserCount" controls-position="right" :min="-1" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="每人每日限量：" prop="UserDayCount">
          <span style="font-size:12px;">(0为不限量)</span>
          <el-input-number v-model="editForm.UserDayCount" controls-position="right" :min="-1" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="参与车场：" prop="ParkNameID" v-if="!isUpload">
          <el-upload style="float:right;margin-right:20%;top:0px;" :limit="1" class="upload-demo" :action="action" :on-remove="handleRemove"
            :on-success="handleExceed">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">若选择上传则单选失效</div>
          </el-upload>
          <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="editForm.ParkName" @change="handleCheckAllChange">全选</el-checkbox> -->
          <span style="font-size:12px;">(若内容过多请滚动查看)</span>
          <el-checkbox-group v-model="editForm.ParkNameID" style="overflow-y: scroll;max-height: 200px;">
            <el-checkbox v-for="park in parkList" :label="park.ParkID" :key="park.Number">{{park.Name}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-else label="参与车场：">
          <el-upload style="float:right;margin-right:20%;top:0px;" :limit="1" class="upload-demo" :action="action" :on-remove="handleRemove"
            :on-success="handleExceed">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">若选择上传则单选失效</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="券类型：" prop="UnitType">
          <el-select v-model="editForm.UnitType" placeholder="请选择券类型">
            <el-option v-for="item in [{value:0,name:'元'},{value:1,name:'折'}]" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="券额度：" prop="Fullcut">
          <div v-if="editForm.UnitType == 0" class="yuan">
            满
            <el-input-number v-model="editForm.Fullcut.input1" :controls="false" style="width:200px;" placeholder="多少"></el-input-number>
            减
            <el-input-number v-model="editForm.Fullcut.input2" :controls="false" style="width:200px;" placeholder="多少元"></el-input-number>
            <el-checkbox v-model="editForm.Fullcut.input3">上不封顶</el-checkbox>
          </div>
          <div v-else class="discoun">
            满
            <el-input-number v-model="editForm.Fullcut.input1" :controls="false" style="width:200px;" placeholder="多少"></el-input-number>
            打
            <el-input-number v-model="editForm.Fullcut.input2" :controls="false" style="width:200px;" :max="1" :min="0" placeholder="几折">
            </el-input-number>
            <span style="font-size:12px;">(折扣为0~1)</span>
            <el-checkbox v-model="editForm.Fullcut.input3">上不封顶</el-checkbox>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">立即添加</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>
<script>
export default {
  data() {
    return {
      action: "",
      dialogImageUrl: "",
      dialogVisible: false,
      editForm: {
        ActivityName: "", //名称
        Type: 0, //价格
        ReceiveType: 0, //用户领取方式
        ActivityTime: "", //时间 ,
        Contribution: "", //出资方
        // 限制次数
        TotalCount: -1,
        DayCount: -1,
        UserCount: 0,
        UserDayCount: 0,
        ParkNameID: [], //参与停车场
        UnitType: 1,
        Fullcut: {
          input1: "",
          input2: "",
          input3: false
        }
      },
      // 券额度数量
      quanNum: 1,
      // 参与车场
      isUpload: false, //是否上传文件了
      isIndeterminate: true, //用于全选
      parkList: [],
      checkAll: false,
      checkedCities: [],
      rules: {
        ParkNameID: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个参与车场",
            trigger: "change"
          }
        ],
        ActivityName: [
          {
            required: true,
            message: "请输入活动名称",
            trigger: "change"
          }
        ],
        Type: [
          {
            required: true,
            message: "请选择活动类型",
            trigger: "blur"
          }
        ],
        ReceiveType: [
          {
            required: true,
            message: "请选择活动类型",
            trigger: "blur"
          }
        ],
        ActivityTime: [
          {
            required: true,
            message: "请选择活动时间",
            trigger: "blur"
          }
        ],
        Contribution: [
          {
            required: true,
            message: "请输入出资方",
            trigger: "blur"
          }
        ],
        TotalCount: [
          {
            required: true,
            message: "次数不能为空",
            trigger: "blur"
          }
        ],
        DayCount: [
          {
            required: true,
            message: "次数不能为空",
            trigger: "blur"
          }
        ],
        UserCount: [
          {
            required: true,
            message: "次数不能为空",
            trigger: "blur"
          }
        ],
        UserDayCount: [
          {
            required: true,
            message: "次数不能为空",
            trigger: "blur"
          }
        ],
        checkedCities: [
          {
            required: true,
            message: "请选择或者上传停车场",
            trigger: "blur"
          }
        ],
        UnitType: [
          {
            required: true,
            message: "请选择券类型",
            trigger: "change"
          }
        ]
      },

      // 类型数组
      typeList: [
        {
          name: "停车券",
          value: 0
        },
        {
          name: "充值停车币",
          value: 1
        },
        {
          name: "充值月卡",
          value: 2
        },
        {
          name: "续费月卡",
          value: 3
        },
        {
          name: "余额充值",
          value: 4
        }
      ],
      ReceiveTypeList: [
        {
          name: "用户领取",
          value: 0
        },
        {
          name: "签到发放",
          value: 2
        }
      ]
    };
  },
  // watch: {
  //   Fullcut(o, n) {
  //     console.log(n)
  //   }
  // },
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
    // 上传文件
    // 成功
    handleExceed(response, file, fileList) {
      this.isUpload = true;
      var upPark = [];
      response.Result.forEach(element => {
        upPark.push(element.Num);
      });
      console.log(upPark);
      this.editForm.ParkNameID = upPark;
    },
    // 删除文件
    handleRemove(file, fileList) {
      this.editForm.ParkNameID = [];
      this.isUpload = false;
    },
    //时间格式化
    changtime(date) {
      // this.editForm.ActivityTime = date[0] + "," + date[1]
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            this.editForm.Fullcut.input1 == "" ||
            this.editForm.Fullcut.input2 == ""
          ) {
            this.$message({
              showClose: true,
              type: "warning",
              message: "请输入券额度"
            });
          } else {
            if (this.editForm.Fullcut.input1 < this.editForm.Fullcut.input2) {
              this.$message({
                showClose: true,
                type: "warning",
                message: "券额度减免/折扣 不能大于总额度"
              });
            } else {
              //判断是否填写完整  --true
              this.$confirm("确认提交吗？", "提示", {}).then(() => {
                var para = Object.assign({}, this.editForm);
                // 将token传入参数中
                para.Token = getCookie("token");
                para.ID = window.location.href.split("id=")[1];
                para.ActivityTime =
                  para.ActivityTime[0] + "," + para.ActivityTime[1];
                para.ParkNameID = para.ParkNameID.join(",");
                para.Fullcut =
                  para.Fullcut.input1 +
                  "," +
                  para.Fullcut.input2 +
                  "," +
                  para.Fullcut.input3;

                // 发保存请求
                this.$http
                  .post("api/BackOperate/EditCoupon", para)
                  .then(
                    function(response) {
                      var status = response.data.Status;
                      if (status === 1) {
                        // 表单重置

                        this.$router.push({
                          path: "/BackCouponList"
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
                        message: "错误：请检查网络0"
                      });
                    }.bind(this)
                  );
              });
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /*
            重置表单
            */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  beforeMount() {
    const loading = this.$loading({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    this.action = mainurl + "api/BackOperate/ParkExport";
    // 获取详情
    this.$http
      .get("api/BackOperate/BackCouponDetails", {
        params: {
          Token: getCookie("token"),
          ID: window.location.href.split("id=")[1]
        }
      })
      .then(
        function(response) {
          loading.close();
          var status = response.data.Status;
          if (status === 1) {
            // this.editForm = response.data.Result.list;
            var date = response.data.Result;

            this.editForm = {
              ActivityName: date.ActivityName, //名称
              Type: date.Type,
              ReceiveType: date.ReceiveType, //用户领取方式
              ActivityTime: [
                date.ActivityTime.split(",")[0],
                date.ActivityTime.split(",")[1]
              ], //时间 ,
              Contribution: date.Contribution, //出资方
              // 限制次数
              TotalCount: date.Counts.TotalCount,
              DayCount: date.Counts.DayCount,
              UserCount: date.Counts.UserCount,
              UserDayCount: date.Counts.UserDayCount,
              ParkNameID: [], //参与停车场
              UnitType: date.UnitType,
              Fullcut: {
                input1: date.Full,
                input2: date.Cut,
                input3: date.IsCap
              }
            };
            date.Parks.forEach(element => {
              this.editForm.ParkNameID.push(element.ParkID);
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
    // 获取停车场
    this.$http
      .get("api/BackPark/BackParkList", {
        params: {
          token: getCookie("token"),
          pageIndex: 1,
          pageSize: 999999,
          keyword: "-1"
        }
      })
      .then(
        function(response) {
          var status = response.data.Status;
          if (status === 1) {
            this.parkList = response.data.Result.list;
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
  mounted() {
    // this.$refs["editForm"].resetFields();
  }
};
</script>
<style scoped>
.is-controls-right {
  float: right;
  margin-right: 50%;
}
</style>
