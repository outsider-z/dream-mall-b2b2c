import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('@/views/chatBox/Home');
const Customers = () => import('@/views/chatBox/Customers');
const Chat = () => import('@/views/chatBox/Chat');
const Conversations = () => import('@/views/chatBox/Conversations');
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path(.*)',
    component: () => import('@/views/redirect')
  }]
},
{
  path: '/login',
  component: () => import('@/views/login'),
  hidden: true
},
{
  path: '/policy',
  component: () => import('@/views/policy'),
  hidden: true
},
{
  path: '/user-agreement',
  component: () => import('@/views/user-agreement'),
  hidden: true
},
{
  path: '/register',
  component: () => import('@/views/register'),
  hidden: true
},
//入驻商家
{
  path: '/settle',
  component: () => import('@/views/settle'),
  hidden: true
},
//流程介绍
{
  path: '/process',
  component: () => import('@/views/process'),
  hidden: true
},
//社区入驻
{
  path: '/communtiy',
  component: () => import('@/views/community_settle'),
  hidden: true
},
//大屏
{
  path: '/large',
  component: () => import('@/views/largeScreen/large'),
  hidden: true
},
{
  path: '/404',
  component: () => import('@/views/error/404'),
  hidden: true
},
{
  path: '/401',
  component: () => import('@/views/error/401'),
  hidden: true
},
{
  path: '',
  component: Layout,
  redirect: 'index',
  children: [{
    path: 'index',
    component: () => import('@/views/index'),
    name: 'Index',
    meta: {
      title: '首页',
      icon: 'dashboard',
      affix: true
    }
  }]
},
//订单详情
{
  path: '/order',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [{
    path: 'orderIndex',
    component: () => import('@/views/order/mall/orderIndex'),
    name: 'orderIndex',
    meta: {
      title: '商城订单详情',
      icon: 'user'
    }
  }, {
    path: 'order-details',
    component: () => import('@/views/order/community/order-details'),
    name: 'order-details',
    meta: {
      title: '社区订单详情',
      icon: 'user'
    }
  },
  {
    path: 'refund-details',
    component: () => import('@/views/order/community-refund/refund-details'),
    name: 'refund-details',
    meta: {
      title: '社区售后详情',
      icon: 'user'
    }
  }
  ]
},
//秒杀活动
{
  path: '/extension',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [{
    path: 'seckill-activity',
    component: () => import('@/views/extension/seckill/seckill-activity'),
    name: 'seckill-activity',
    meta: {
      title: '秒杀活动',
      icon: 'user'
    }
  }]
},
//拼团活动
{
  path: '/extension',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [{
    path: 'scrabble',
    component: () => import('@/views/extension/seckill/scrabble'),
    name: 'scrabble',
    meta: {
      title: '拼团活动',
      icon: 'user'
    }
  }]
},
//积分活动
{
  path: '/integral',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [{
    path: 'addPoint',
    component: () => import('@/views/integral/pointOrder/addPoint'),
    name: 'addPoint',
    meta: {
      title: '积分活动',
      icon: 'user'
    }
  }]
},

{
  path: '/extension',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [{
    path: 'festivalList',
    component: () => import('@/views/extension/seckill/festival-list'),
    name: 'festivalList',
    meta: {
      title: '节日活动',
      icon: 'user'
    }
  }]
}, {
  path: '/extension',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [{
    path: 'festivaProduct',
    component: () => import('@/views/extension/seckill/festival-product'),
    name: 'festivaProduct',
    meta: {
      title: '节日商品',
      icon: 'user'
    }
  }]
},



//商品评论详情
{
  path: '/comment',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [{
    path: 'commentDetails',
    component: () => import('@/views/comment/productCom/commentDetails'),
    name: 'commentDetails',
    meta: {
      title: '商品评论',
      icon: 'user'
    }
  }]
},
//视频评论详情
{
  path: '/comment',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [{
    path: 'videoComDetail',
    component: () => import('@/views/comment/videoCom/videoComDetail'),
    name: 'videoComDetail',
    meta: {
      title: '视频评论',
      icon: 'user'
    }
  }]
},
//视频评论-回复
{
  path: '/comment',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [{
    path: 'videoReply',
    component: () => import('@/views/comment/videoCom/videoReply'),
    name: 'videoReply',
    meta: {
      title: '评论回复',
      icon: 'user'
    }
  }]
},
//商户--开票申请
{
  path: '/mall-merchant',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [{
    path: 'invoiceIndex',
    component: () => import('@/views/mall-merchant/invoice/invoice-details'),
    name: 'invoiceIndex',
    meta: {
      title: '开票申请',
      icon: 'user'
    }
  }]
},
//配置商品
{
  path: '/extension',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [
    {
      path: 'seckil/seckill-product',
      component: () => import('@/views/extension/seckill/seckill-product'),
      name: 'seckill-product',
      meta: {
        title: '配置秒杀商品',
        icon: 'user'
      }
    },
    {
      path: 'seckill/group-product',
      component: () => import('@/views/extension/seckill/group-product'),
      name: 'group-product',
      meta: {
        title: '配置团购商品',
        icon: 'user'
      }
    }

]
},

//优惠券详情
{
  path: '/extension',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [{
    path: 'couponDetail',
    component: () => import('@/views/extension/coupon/couponDetail'),
    name: 'couponDetail',
    meta: {
      title: '优惠券详情',
      icon: 'user'
    }
  }]
},
//监测记录
{
  path: '/community',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [{
    path: 'monitoringRecords',
    component: () => import('@/views/community/monitoringRecords/index'),
    name: 'monitoringRecords',
    meta: {
      title: '监测记录',
      icon: 'user'
    }
  }]
},
//商户订单--订单详情
{
  path: '/mall-merchant',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [{
    path: 'orderDetails',
    component: () => import('@/views/mall-merchant/order/order-details'),
    name: 'orderDetails',
    meta: {
      title: '订单详情',
      icon: 'user'
    }
  }]
},
//商户端-商城商户
{
  path: '/mall-merchant',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [
    {
      path: 'activity/seckill-list',
      component: () => import('@/views/mall-merchant/activity/seckill-list'),
      name: 'seckill-list',
      meta: {
        title: '秒杀活动',
        icon: 'user'
      },
    }, {
      path: 'activity/group-list',
      component: () => import('@/views/mall-merchant/activity/group-list'),
      name: 'group-list',
      meta: {
        title: '拼团活动',
        icon: 'user'
      }
    },
    {
      //商户--积分活动
      path: 'activity/point-product-list',
      component: () => import('@/views/mall-merchant/activity/point-product-list'),
      name: 'point-product-list',
      meta: {
        title: '积分活动',
        icon: 'user'
      }
    },
    {
      path: 'activity/group-product-list',
      component: () => import('@/views/mall-merchant/activity/group-product-list'),
      name: 'group-product-list',
      meta: {
        title: '拼团配置商品',
        icon: 'user'
      }
    },
    {
      path: 'avtivity/seckill-product-list',
      component: () => import('@/views/mall-merchant/activity/seckill-product-list'),
      name: 'seckill-product-list',
      meta: {
        title: '秒杀配置商品',
        icon: 'user'
      }
    },
    {
      path: 'avtivity/festival-lists',
      component: () => import('@/views/mall-merchant/activity/festival-lists'),
      name: 'festival-lists',
      meta: {
        title: '节日活动',
        icon: 'user'
      }
    },
    {
      path: 'avtivity/festival-product-list',
      component: () => import('@/views/mall-merchant/activity/festival-product-list'),
      name: 'festival-product-list',
      meta: {
        title: '节日配置商品',
        icon: 'user'
      }
    },
    {
      path: 'couponDetail',
      component: () => import('@/views/mall-merchant/coupon/coupon-details'),
      name: 'couponDetail',
      meta: {
        title: '优惠券详情',
        icon: 'user'
      }
    }

  ]
},

{
  path: '/chatBox',
  component: Home,
  hidden: true,
  redirect: '/conversations',
  children: [{
    path: 'conversations',
    components: {
      default: Conversations
    },
    children: [{
      path: 'chat',
      components: {
        default: Chat
      }
    }]
  },
  {
    path: 'customers',
    components: {
      default: Customers
    }
  }
  ]
},
{
  path: '/user',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [
    {
      path: 'profile',
      component: () => import('@/views/system/user/profile/index'),
      name: 'Profile',
      meta: {
        title: '个人中心',
        icon: 'user'
      }
    },
    //商城商品添加
    {
      path: '/productAdd',
      component: () => import('@/views/commodity/product/productAdd'),
      name: 'ProductAdd',
      meta: {
        title: '商品添加',
        icon: 'el-icon-plus'
      }
    },

    //商品修改
    {
      path: '/productEdit',
      component: () => import('@/views/commodity/product/productEdit'),
      name: 'ProductEdit',
      meta: {
        title: '商品详情',
        icon: 'el-icon-plus'
      }
    },

    //秒杀详情
    {
      path: '/seckollDetail',
      component: () => import('@/views/extension/seckill/seckollDetail'),
      name: 'seckollDetail',
      meta: {
        title: '秒杀详情',
        icon: 'el-icon-plus'
      }
    },
    //团购详情
    {
      path: '/groupDetail',
      component: () => import('@/views/extension/group/groupDetail'),
      name: 'groupDetail',
      meta: {
        title: '团购详情',
        icon: 'el-icon-plus'
      }
    },
    //社区商品添加
    {
      path: '/productAdds',
      component: () => import('@/views/community/goods/product-add'),
      name: 'ProductAdds',
      meta: {
        title: '商品添加/修改',
        icon: 'el-icon-plus'
      }
    },

    //商户端--社区商品添加
    // {
    //   path: '/cm-product-add',
    //   component: () => import('@/views/cm-merchant/goods/product-add'),
    //   name: 'CmProductAdd',
    //   meta: {
    //     title: '商品添加',
    //     icon: 'el-icon-plus'
    //   }
    // },
    //商户端--商品添加
    {
      path: '/product-add',
      component: () => import('@/views/mall-merchant/product/merchant-product-add'),
      name: 'product-add',
      meta: {
        title: '商品添加',
        icon: 'el-icon-plus'
      }
    },
    //商户端--商品修改
    {
      path: '/merchant-product-edit',
      component: () => import('@/views/mall-merchant/product/merchant-product-edit'),
      name: 'merchant-product-edit',
      meta: {
        title: '商品修改',
        icon: 'el-icon-plus'
      }
    },
    //添加社区服务
    {
      path: '/serviceList',
      component: () => import('@/views/community/set-service/service-list'),
      name: 'serviceList',
      meta: {
        title: '添加社区服务',
        icon: 'el-icon-plus'
      }
    }
  ]
},

//商户端--社区商户
{
  path: '/cm-merchant',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [
    {
      path: '/cm-merchant/order/cm-order-details',
      component: () => import('@/views/cm-merchant/order/cm-order-details'),
      name: 'cm-order-details',
      meta: {
        title: '社区订单详情',
        icon: 'user'
      }
    },
    {
      path: '/cm-merchant/goods/product-add',
      component: () => import('@/views/cm-merchant/goods/product-add'),
      name: 'CmProductAdd',
      meta: {
        title: '商品添加',
        icon: 'el-icon-plus'
      }
    },
    {
      path: '/cm-merchant/order/cm-refund-details',
      component: () => import('@/views/cm-merchant/order/cm-order-details'),
      name: 'cm-refund-details',
      meta: {
        title: '社区订单售后详情',
        icon: 'user'
      }
    },
    {
      path: '/cm-merchant/invoice/cm-invoice-details',
      component: () => import('@/views/cm-merchant/invoice/cm-invoice-details'),
      name: 'cm-refund-details',
      meta: {
        title: '社区发票售后详情',
        icon: 'user'
      }
    },
  ]
},

//会员卡充值卡消费记录

{
  path: '/member',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [
    {
      path: '/card-recharge-list',
      component: () => import('@/views/member/userCardApply/card-recharge-list'),
      name: 'card-recharge-list',
      meta: {
        title: '会员卡充值消费记录',
        icon: 'user'
      }
    },
    {
      path: '/user-team-list',
      component: () => import('@/views/member/query/user-team-list'),
      name: 'user-team-list',
      meta: {
        title: '会员团队',
        icon: 'user'
      }
    }


  ]
}

]

// 动态路由，基于用户权限动态去加载

export const dynamicRoutes = [{
  path: '/system/user-auth',
  component: Layout,
  hidden: true,
  permissions: ['system:user:edit'],
  children: [{
    path: 'role/:userId(\\d+)',
    component: () => import('@/views/system/user/authRole'),
    name: 'AuthRole',
    meta: {
      title: '分配角色',
      activeMenu: '/system/user'
    }
  }]
},
{
  path: '/system/role-auth',
  component: Layout,
  hidden: true,
  permissions: ['system:role:edit'],
  children: [{
    path: 'user/:roleId(\\d+)',
    component: () => import('@/views/system/role/authUser'),
    name: 'AuthUser',
    meta: {
      title: '分配用户',
      activeMenu: '/system/role'
    }
  }]
},
{
  path: '/system/dict-data',
  component: Layout,
  hidden: true,
  permissions: ['system:dict:list'],
  children: [{
    path: 'index/:dictId(\\d+)',
    component: () => import('@/views/system/dict/data'),
    name: 'Data',
    meta: {
      title: '字典数据',
      activeMenu: '/system/dict'
    }
  }]
},
{
  path: '/monitor/job-log',
  component: Layout,
  hidden: true,
  permissions: ['monitor:job:list'],
  children: [{
    path: 'index',
    component: () => import('@/views/monitor/job/log'),
    name: 'JobLog',
    meta: {
      title: '调度日志',
      activeMenu: '/monitor/job'
    }
  }]
},
{
  path: '/tool/gen-edit',
  component: Layout,
  hidden: true,
  permissions: ['tool:gen:edit'],
  children: [{
    path: 'index/:tableId(\\d+)',
    component: () => import('@/views/tool/gen/editTable'),
    name: 'GenEdit',
    meta: {
      title: '修改生成配置',
      activeMenu: '/tool/gen'
    }
  }]
},
]

// 防止连续点击多次路由报错
let routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})
