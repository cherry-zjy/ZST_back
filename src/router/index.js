import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

// 路由页面导入
import login from '@/components/Login.vue'
import home from '@/components/Home.vue'
import error from '@/components/404.vue'  //404错误
// import manage from '@/components/manage/manage.vue'
var manage = resolve => require(['@/components/manage/manage.vue'], resolve)

var role = resolve => require(['@/components/role/role.vue'], resolve)
var roleLimit = resolve => require(['@/components/role/roleLimit.vue'], resolve)
var power = resolve => require(['../components/role/power.vue'], resolve)

// 停车场设置
var BackParkList = resolve => require(['../components/parkSetting/BackParkList.vue'], resolve)//停车场列表
var parkEdit = resolve => require(['../components/parkSetting/parkEdit.vue'], resolve)//编辑
var parkAdd = resolve => require(['../components/parkSetting/parkAdd.vue'], resolve)//新增
// 订单管理
var BackAppointmentOrderList = resolve => require(['@/components/order/BackAppointmentOrderList.vue'], resolve)//预约订单
var BackParkOrderList = resolve => require(['@/components/order/BackParkOrderList.vue'], resolve)//停车订单

// 运行管理 
//优惠券管理
var BackCouponList = resolve => require(['../components/running/BackCouponList/BackCouponList.vue'], resolve)
// 优惠券编辑
var CouponEdit = resolve => require(['../components/running/BackCouponList/CouponEdit.vue'], resolve)
var CouponAdd = resolve => require(['../components/running/BackCouponList/CouponAdd.vue'], resolve)

//月卡管理
var BackMonthCardList = resolve => require(['../components/running/BackMonthCardList/BackMonthCardList.vue'], resolve)
// 月卡编辑
var MonthCardEdit = resolve => require(['../components/running/BackMonthCardList/MonthCardEdit.vue'], resolve)
var MonthCardAdd = resolve => require(['../components/running/BackMonthCardList/MonthCardAdd.vue'], resolve)

//通知管理
var BackNoticeList = resolve => require(['../components/running/BackNoticeList/BackNoticeList.vue'], resolve)
//通知编辑
var NoticeEdit = resolve => require(['../components/running/BackNoticeList/NoticeEdit.vue'], resolve)
var NoticeAdd = resolve => require(['../components/running/BackNoticeList/NoticeAdd.vue'], resolve)
// 用户管理
var BackUserList = resolve => require(['../components/user/BackUserList.vue'], resolve)  //用户管理
var BackChangeUserList = resolve => require(['../components/user/BackChangeUserList.vue'], resolve)  //换绑管理

// 懒加载方式，当路由被访问的时候才加载对应组件
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: '登录',
      component: login
    },
    {
      path: '/',
      name: '首页',
      component: home,
      children: [
        // 404
        { path: '/error', component: error, name: '404页' },
        // manage
        { path: '/manage', component: manage, name: '管理员管理', },
        // role
        { path: '/role', component: role, name: '权限管理' },
        { path: '/power', component: power, name: '角色管理' },
        { path: '/role/rolelimit/:id', component: roleLimit, name: '权限设置' },

        // 停车场设置
        { path: '/BackParkList', component: BackParkList, name: '停车场列表' },
        { path: '/BackParkList/parkEdit/:id', component: parkEdit, name: '停车场编辑' },
        { path: '/BackParkList/parkAdd', component: parkAdd, name: '停车场添加' },
        // order
        { path: '/BackAppointmentOrderList', component: BackAppointmentOrderList, name: '预约订单' },
        { path: '/BackParkOrderList', component: BackParkOrderList, name: '停车订单' },
        //运营管理
        { path: '/BackCouponList', component: BackCouponList, name: '优惠券管理' },
        // 
        { path: '/BackCouponList/CouponEdit/:id', component: CouponEdit, name: '优惠券编辑' },
        { path: '/BackCouponList/CouponAdd', component: CouponAdd, name: '优惠券添加' },

        { path: '/BackMonthCardList', component: BackMonthCardList, name: '月卡管理' },
        { path: '/BackMonthCardList/MonthCardEdit/:id', component: MonthCardEdit, name: '月卡编辑' },
        { path: '/BackMonthCardList/MonthCardAdd', component: MonthCardAdd, name: '月卡添加' },

        { path: '/BackNoticeList', component: BackNoticeList, name: '通知管理' },
        // --------通知编辑
        { path: '/BackNoticeList/NoticeEdit/:id', component: NoticeEdit, name: '通知编辑' },
        { path: '/BackNoticeList/NoticeAdd', component: NoticeAdd, name: '通知添加' },
        // 用户管理
        { path: '/BackUserList', component: BackUserList, name: '用户列表' },
        { path: '/BackChangeUserList', component: BackChangeUserList, name: '换绑管理' },
      ]
    },
  ]
})
