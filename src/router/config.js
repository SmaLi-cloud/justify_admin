import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '主页',
      component: TabsView,
      redirect: '/main',
      children: [
        {
          path: 'main',
          name: '主页',
          meta: {
            notBreadcrumb: true, //不显示在面包屑中
            icon: 'icon-shouye',
            type: 'link',
            page: {
              closable: false
            }
          },
          component: () => import('@/pages/dataCenter'),
        },
        {
          path: 'order',
          name: '订单',
          meta: {
            icon: 'icon-kehu',
          },
          permission: "order",
          component: PageView,
          children: [
            {
              path: 'order',
              name: '订单管理',
              permission: 'order.list',
              component: () => import('@/pages/order'),
            },
            {
              path: 'orderDetail/:id',
              name: '订单详情',
              meta: {
                invisible: true
              },
              permission: 'order.list',
              component: () => import('@/pages/order/detail'),
            },
            {
              path: 'selectOrder',
              name: '订单查看',
              permission: 'order.selector_order',
              component: () => import('@/pages/selector/order'),
            },
            {
              path: 'selectOrderDetail/:id',
              name: '订单详情',
              meta: {
                invisible: true
              },
              permission: 'order.selector_order',
              component: () => import('@/pages/selector/order/detail'),
            },

          ]
        },
        {
          path: 'goods',
          name: '商品',
          meta: {
            icon: 'icon-kehu',
          },
          permission: "pro",
          component: PageView,
          children: [
            {
              path: 'goods',
              name: '商品管理',
              permission: 'pro.product',
              component: () => import('@/pages/goods'),
            },
            {
              path: 'goodsDetail/:id',
              name: '商品详情',
              meta: {
                invisible: true
              },
              permission: 'pro.product',
              component: () => import('@/pages/goods/detail'),
            },
            {
              path: 'selectorGoods',
              name: '商品查看',
              permission: 'pro.selector_product',
              component: () => import('@/pages/selector/goods'),
            },
            {
              path: 'selectGoodsDetail/:id',
              name: '商品详情',
              meta: {
                invisible: true
              },
              permission: 'pro.selector_product',
              component: () => import('@/pages/selector/goods/detail'),
            },
            {
              path: 'recommend',
              name: '商品推荐',
              permission: 'pro.recommend',
              component: () => import('@/pages/recommend'),
            },
            {
              path: 'addGoods',
              name: '添加商品',
              meta: {
                invisible: true
              },
              permission: 'pro.product',
              component: () => import('@/pages/goods/AddGoods'),
            },
            {
              path: 'goodsType',
              name: '类目管理',
              permission: 'pro.product_type',
              component: () => import('@/pages/goods/ProductType'),
            },
            {
              path: 'print',
              name: '打印标签牌',
              permission: 'pro.product',
              component: () => import('@/pages/goods/print'),
              meta: {
                invisible: true
              },
            },

          ]
        },
        {
          path: 'supplier',
          name: '供应链',
          meta: {
            icon: 'icon-kehu',
          },
          permission: "scm",
          component: PageView,
          children: [
            {
              path: 'supplier',
              name: '商家管理',
              permission: 'scm.supplier',
              component: () => import('@/pages/supplier'),
            },
            {
              path: 'supplierDetail/:id',
              name: '商家详情',
              meta: {
                invisible: true
              },
              permission: 'scm.supplier',
              component: () => import('@/pages/supplier/detail'),
            },
            {
              path: 'selectSupplier',
              name: '商家查看',
              permission: 'scm.selector_supplier',
              component: () => import('@/pages/selector/supplier'),
            },
            {
              path: 'selectSupplierDetail/:id',
              name: '商家详情',
              meta: {
                invisible: true
              },
              permission: 'scm.selector_supplier',
              component: () => import('@/pages/selector/supplier/detail'),
            },
            {
              path: 'brand',
              name: '品牌认证',
              permission: 'scm.brand',
              component: () => import('@/pages/brand'),
            },
            {
              path: 'brandDetail/:id',
              name: '品牌详情',
              meta: {
                invisible: true
              },
              permission: 'scm.brand',
              component: () => import('@/pages/brand/detail'),
            },
          ]
        },
        {
          path: 'distribution',
          name: '分销',
          meta: {
            icon: 'icon-kehu',
          },
          permission: "distribution",
          component: PageView,
          children: [
            {
              path: 'distribution',
              name: '分销商管理',
              permission: 'distribution.distributor',
              component: () => import('@/pages/distribution'),
            },
            {
              path: 'distributionDetail/:id',
              name: '分销商详情',
              meta: {
                invisible: true
              },
              permission: 'distribution.distributor',
              component: () => import('@/pages/distribution/detail'),
            },
          ]
        },
        {
          path: 'news',
          name: '新闻',
          meta: {
            icon: 'icon-kehu',
          },
          component: PageView,
          permission: 'news',
          children: [
            {
              path: 'news',
              name: '新闻管理',
              permission: 'news.list',
              component: () => import('@/pages/news'),
            },
            {
              path: 'addNews',
              name: '添加新闻',
              meta: {
                invisible: true
              },
              permission: 'news.list',
              component: () => import('@/pages/news/NewsAdd'),
            },
            {
              path: 'newsDetail/:id',
              name: '新闻详情',
              meta: {
                invisible: true
              },
              permission: 'news.list',
              component: () => import('@/pages/news/detail'),
            }
          ]
        },
        {
          path: 'settle',
          name: '结算',
          meta: {
            icon: 'icon-kehu',
          },
          permission: "settle_order",
          component: PageView,
          children: [
            {
              path: 'selector',
              name: '选品官结算',
              permission: 'settle_order.selector.list',
              component: () => import('@/pages/settle'),
            },
            {
              path: 'settleDetail/:id',
              name: '结算详情',
              meta: {
                invisible: true
              },
              permission: 'settle_order.selector.list',
              component: () => import('@/pages/settle/detail'),
            },
          ]
        },
        {
          path: 'technology',
          name: '科技馆',
          meta: {
            icon: 'icon-kehu',
          },
          permission: "technology",
          component: PageView,
          children: [
            {
              path: 'sample',
              name: '样品管理',
              permission: 'technology.sample',
              component: () => import('@/pages/technology'),
            },
            {
              path: 'sampleDetail/:id',
              name: '样品详情',
              meta: {
                invisible: true
              },
              permission: 'technology.sample',
              component: () => import('@/pages/technology/detail'),
            },
            {
              path: 'inStock',
              name: '库存管理',
              permission: 'technology.product',
              component: () => import('@/pages/technology/stock'),
            },
            {
              path: 'inStockDetail/:id',
              name: '产品详情',
              meta: {
                invisible: true
              },
              permission: 'technology.product',
              component: () => import('@/pages/technology/detail'),
            },
            {
              path: 'inOutRecord',
              name: '出入库记录',
              permission: 'technology.inventory',
              component: () => import('@/pages/technology/inOutRecord'),
            },
          ]
        },
        {
          path: 'company',
          name: '员工',
          meta: {
            icon: 'icon-kehu',
          },
          permission: "co",
          component: PageView,
          children: [
            {
              path: 'staff',
              name: '员工管理',
              permission: 'co.staff',
              component: () => import('@/pages/company/staff'),
            }
          ]
        },
        {
          path: 'sys',
          name: '系统',
          meta: {
            icon: 'icon-kehu',
          },
          permission: "sys",
          component: PageView,
          children: [
            {
              path: 'permission',
              name: '权限管理',
              permission: 'sys.permission',
              component: () => import('@/pages/sys/permission'),
            },
            {
              path: 'role',
              name: '角色管理',
              permission: 'sys.role',
              component: () => import('@/pages/sys/role'),
            },
            {
              path: 'video',
              name: '视频管理',
              permission: 'sys.video',
              component: () => import('@/pages/sys/video'),
            }
          ]
        },
        {
          path: 'modifyPersonal',
          name: '修改个人信息',
          meta: {
            invisible: true
          },
          component: () => import('@/pages/personalCenter/editPerson'),
        },
        {
          path: 'personalCenter',
          name: '修改密码',
          meta: {
            invisible: true
          },
          component: () => import('@/pages/personalCenter/index.vue')
        },

      ]
    }
  ]
}

export default options
