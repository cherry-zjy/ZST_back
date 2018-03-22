<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>预约订单</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="关键字">
          <el-input v-model="filters.keyword" placeholder="关键字" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="开始日期" v-model="filters.StTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="1">~</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="结束时间" v-model="filters.EndTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <!-- <el-date-picker 
      v-model="filters.Time"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
      @change="choiceTime">
    </el-date-picker> -->
        </el-form-item>
            
        <el-form-item label="发货状态">
          <el-select v-model="filters.Type" placeholder="发货状态">
            <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="orderList" style="width: 100%" :border='true'>
      <el-table-column label="停车场编号" prop="OrderNo">
      </el-table-column>
      <el-table-column label="停车场名" prop="CreateTime">
      </el-table-column>
      <el-table-column label="预约时间" prop="ProductName">
      </el-table-column>
      <el-table-column label="预约人" prop="Name">
      </el-table-column>
      <el-table-column label="预约费用" prop="Phone">
      </el-table-column>
      <el-table-column label="优惠金额（元）" prop="Price">
      </el-table-column>
      <el-table-column label="订单状态" prop="Status" :formatter="Status">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-delete" @click="handlDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderList: [], //列表
      pageIndex: 1,
      pageSize: 10,
      pageCount: 1,
      mainurl: "",
      roleList: [], //管理员角色列表
      // 搜索关键字
      filters: {
        keyword: "",
        StTime: "2018-01-01",
        EndTime: "",
        Type: 0
      },
      // 状态数组
      typeList: [
        {
          name: "全部",
          value: 0
        },
        {
          name: "待发货",
          value: 1
        },
        {
          name: "待收货",
          value: 2
        }
      ]
    };
  },
  methods: {
    // choiceTime(e) {
    //   console.log(e);
    // },
    /*
           1、获取列表 渲染列表
           2、搜索关键字
           3、分页
        */
    getInfo() {
      this.$http
        .post("/sps/api/Back/O_GetOrderList", {
          Token: getCookie("token"),
          PageIndex: this.pageIndex,
          PageSize: this.pageSize,
          Keyword: this.filters.keyword == "" ? "-1" : this.filters.keyword,
          Type: this.filters.Type,
          StTime: this.filters.StTime,
          EndTime: this.filters.EndTime == "" ? "-1" : this.filters.EndTime
        })
        .then(
          function(response) {
            var status = response.data.Status;
            if (status === 1) {
              this.orderList = response.data.Result.List;
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
    //关键字搜索
    getUsers() {
      this.getInfo();
      // console.log(this.filters)
    },
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getInfo();
    },
    Status(row, status) {
      var status = row[status.property];
      switch (status) {
        case 0:
          return (status = "待付款");
          break;
        case 1:
          return (status = "待发货");
          break;
        case 2:
          return (status = "已发货");
          break;
        default:
          return (status = "已完成");
          break;
      }
    },
    /*
          1、添加编辑时获取角色列表，渲染下拉菜单
        */
    handleDel() {
      //判断是否填写完整  --true
      this.$confirm("确认删除吗？", "提示", {}).then(() => {
        this.editLoading = true;
        var para = Object.assign({}, this.editForm);
        // 将token传入参数中
        console.log(para);
        para.Token = getCookie("token");
        // 发保存请求
        this.$http
          .get("/sps/api/Admin/Edit", {
            // params: para
          })
          .then(
            function(response) {
              this.editLoading = false;
              var status = response.data.Status;
              if (status === 1) {
                // 表单重置
                this.$refs["editForm"].resetFields();
                this.editFormVisible = false;
                this.getInfo();
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
    }
  },
  mounted() {
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
/* 弹出框 */
.el-dialog__body .el-form-item {
  width: 60%;
  margin-left: calc(50% - 30%);
}
/* 选择公司 */
.el-select--medium {
  width: 100%;
}
.el-input--medium {
  width: 100%;
}
</style>
