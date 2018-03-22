<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="orderList" style="width: 100%" :border='true'>
      <el-table-column label="手机号" prop="OrderNo">
      </el-table-column>
      <el-table-column label="头像" prop="OrderNo">
        <template slot-scope="scope">
          <img v-for="(item,index) in scope.row.Image" :key="index" :src="mainurl+item" width="200" />
        </template>
      </el-table-column>
      <el-table-column label="昵称" prop="OrderNo">
      </el-table-column>
      <el-table-column label="性别" prop="OrderNo">
      </el-table-column>
      <el-table-column label="生日" prop="OrderNo">
      </el-table-column>
      <el-table-column label="微信" prop="isChoice">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.Price"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="QQ" prop="isChoice">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.Price"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="积分" prop="OrderNo">
        <template slot-scope="scope">
          <span>{{ scope.row.OrderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="我的车辆" prop="OrderNo">
        <template slot-scope="scope">
          <el-popover ref="popover4" placement="right" width="400" trigger="click">
            <el-table :data="gridData">
              <el-table-column width="150" property="date" label="日期"></el-table-column>
              <el-table-column width="100" property="name" label="姓名"></el-table-column>
              <el-table-column width="300" property="address" label="地址"></el-table-column>
            </el-table>
          </el-popover>
          <span v-popover:popover4 @click="detailClick">{{ scope.row.OrderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="我的月卡" prop="OrderNo">
        <template slot-scope="scope">
          <span>{{ scope.row.OrderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="我的优惠券" prop="OrderNo">
        <template slot-scope="scope">
          <span>{{ scope.row.OrderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" v-if="scope.row.Status == 2" type="primary" plain icon="el-icon-success" @click="handleEdit(scope.$index, scope.row)">锁定</el-button>
          <el-button size="mini" v-if="scope.row.Status == 1" type="danger" plain icon="el-icon-warning" @click="handleSend(scope.$index, scope.row)">解除锁定</el-button>
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
  // import "../../../static/jquery-search.js";
  import expresss from "../../../static/express.js";
  export default {
    data() {
      return {
        orderList: [{
          OrderNo: 213213213,
          isChoice: true
        }], //列表
        pageIndex: 1,
        pageSize: 10,
        pageCount: 1,
        mainurl: "",
        roleList: [], //管理员角色列表
        // 搜索关键字
        filters: {
          keyword: ""
        },
        // 状态数组
        typeList: [{
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
        ],
        // 我的车辆数组
        gridData: []
      };
    },
    methods: {

      detailClick() {
        this.gridData = [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }]
      },
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
            function (response) {
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
            function (error) {
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
      }
    },
    mounted() {
      // this.getInfo();
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

</style>
