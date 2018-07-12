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
          <el-input v-model="filters.sear" placeholder="关键字" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-select v-model="filters.IsVip" placeholder="黑卡会员">
          <el-option v-for="item in IsVip" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="filters.IsVerify" placeholder="是否认证">
          <el-option v-for="item in IsVerify" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-form-item>
          <el-button type="primary" @click="getInfo(true)">查询</el-button>
        </el-form-item>
        <el-tag><span @click="filters.IsVip = '1';filters.IsVerify = '0';filters.pageIndex = 1;getInfo()" class="cursur">黑卡会员人数：{{BlackRealMoney.BlackCard}}</span></el-tag>
        <el-tag><span @click="filters.IsVerify = '2';filters.IsVip = '0';filters.pageIndex = 1;getInfo()" class="cursur">实名认证人数：{{BlackRealMoney.Attestation}}</span></el-tag>
        <el-tag><span>钱袋收入总金额：{{BlackRealMoney.MoneyBag}}</span></el-tag>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="List" style="width: 100%" :border='true'>

      <el-table-column label="用户名" prop="Name">
      </el-table-column>
      <el-table-column label="手机号" prop="Phone">
      </el-table-column>
      <el-table-column label="是否认证" prop="IsVerify" width="120">
      </el-table-column>
      <el-table-column label="会员卡号" prop="CardNo">
      </el-table-column>
      <el-table-column label="剩余匹配次数" prop="Available">
      </el-table-column>
      <el-table-column label="钱袋收入（元）" prop="Balance" :render-header="foo">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount" :current-page="currentPage">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import md5 from "js-md5";

  export default {
    data() {
      return {
        List: [], //列表
        pageCount: 1,
        mainurl: "",
        BlackRealMoney:[],
        // 搜索关键字
        filters: {
          sear: "",
          pageIndex: 1,
          pageSize: 12,
          Token: getCookie("token"),
          IsVip: '0',
          IsVerify: '0',
          Order:1
        },
        IsVip: [{
          value: '0',
          label: '黑卡会员（全部）'
        }, {
          value: '1',
          label: '是'
        }, {
          value: '2',
          label: '否'
        }],
        IsVerify: [{
          value: '0',
          label: '是否认证（全部）'
        }, {
          value: '1',
          label: '认证未通过'
        }, {
          value: '2',
          label: '认证通过'
        }],
      };
    },
    computed: {
      currentPage: function () {
        return this.filters.pageIndex
      }
    },
    methods: {
     foo(h,{column}){
       console.log(column)
        return(
          <span>{column.label}
          <i class="icon el-icon-caret-top" onClick={ this.topsort }></i>
          <i class="icon el-icon-caret-bottom" onClick={ this.bottomsort } style="display:none"></i>
          </span>
        )
      },
      topsort(){
        $(".el-icon-caret-bottom").show();
        $(".el-icon-caret-top").hide();
        this.filters.Order = 0;
        this.filters.pageIndex = 1
        this.getInfo()
      },
      bottomsort(){
        $(".el-icon-caret-top").show();
        $(".el-icon-caret-bottom").hide();
        this.filters.Order = 1;
        this.filters.pageIndex = 1
        this.getInfo()
      },
      getInfo(searchange) {
        if (searchange) {
          this.filters.pageIndex = 1
        }
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        if (this.filters.sear == "") {
          delete this.filters.sear
        } else {
          this.filters.sear = this.filters.sear
        }
        this.$http
          .get("api/Back_UserList/GetUserIndex", {
            params: this.filters
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.List = response.data.Result.coustomer;
                this.pageCount = response.data.Result.page;
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
      },
      getData(){
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_UserList/BlackRealMoney", {
            params: {}
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === -1) {
                this.BlackRealMoney = response.data.Result;
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
        var urlId = obj.ID;
        this.$router.push("/user/GetUserIndexDetail/id=" + urlId);
      },
    },
    mounted() {
      this.mainurl = mainurl;
      this.getInfo();
      this.getData();
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
  .cursur{
    cursor: pointer;
  }

</style>
