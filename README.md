# 智梦源java多商户商城社区-如淘宝京东等

#### 介绍

  智梦源多商户商城社区，是一款业务完善且经过生产使用验证过的java多商户复合型商城、社区服务电商系统。

#### 软件架构说明

本项目后端： 
    采用Spring Boot + Spring Cloud + Alibaba。   
    注册中心、配置中心选型Nacos，权限认证使用Redis。  
    认证中心使用Spring Security + OAuth2.0 + JWT。  
    流量控制框架选型Sentinel，分布式事务选型Seata。  
    消息中间件使用Rabbit mq。  
    数据库使用 mysql + mybatis。  

本项目前端：
    使用uni-app开发, 一套代码可打包部署至 微信小程序、android版、ios版、web版、H5版以及发布到各种小程序等。

#### 后端系统模块

  com.dream  
  ├── dream-gateway         // 网关模块  
  ├── dream-auth            // 认证中心  
  ├── dream-api             // 接口模块  
  │       └── dream-api-system                          // 系统接口  
  ├── dream-common          // 公共模块  
  │       └── dream-common-core                         // 核心模块  
  │       └── dream-common-datascope                    // 权限范围  
  │       └── dream-common-datasource                   // 多数据源  
  │       └── dream-common-log                          // 日志记录  
  │       └── dream-common-rabbitmq                     // 消息队列  
  │       └── dream-common-redis                        // 缓存服务  
  │       └── dream-common-seata                        // 分布式事务  
  │       └── dream-common-security                     // 安全模块  
  │       └── dream-common-swagger                      // 系统接口  
  │       └── dream-common-websocket                    // websocket  
  ├── dream-modules         // 业务模块  
  │       └── dream-system                              // 系统模块  
  │       └── dream-gen                                 // 代码生成  
  │       └── dream-job                                 // 定时任务  
  │       └── dream-file                                // 文件服务  
  │       └── dream-market                              // 营销服务  
  │       └── dream-member                              // 用户服务  
  │       └── dream-merchant                            // 商户服务  
  │       └── dream-order                               // 订单服务  
  │       └── dream-cart                                // 购物车服务  
  │       └── dream-pay                                 // 支付中心  
  │       └── dream-product                             // 商品服务  
  │       └── dream-third                               // 第三方服务  
  │       └── dream-video                               // 短视频服务  
  ├── dream-visual          // 图形化管理模块  
  │       └── dream-visual-monitor                      // 监控中心  
  ├──pom.xml                // 公共依赖  

#### 功能介绍

  商家管理，商城商家入驻申请、社区商家入驻申请，商家审核  
  社区管理，社区信息  
  商品管理，单规格、多规格商品管理，品牌、分类管理、商品评价  
  订单管理，订单支付、发货、取消、售后、结算等  
  会员管理，会员列表、会员等级、会员团队等  
  资金管理，会员提现、商家提现、奖金支出、团队资金  
  通知公告，官方资讯、活动通知、协议中心  
  营销推广，首页轮播、广告管理、优惠券、秒杀、拼团、积分商品、节日活动等  
  平台配置，基础设置、微信支付、支付宝支付、多媒体存储、短信设置、物流配置  
  分润设置，推广分润、销售分润、团队业绩分润、分润等级  
  商城中心，商城首页轮播、拼团活动、秒杀活动、推荐商品  
  社区中心，社区首页轮播、社区子模块、社区活动、社区推荐商家及商品  
  短视频管理，视频列表、视频审核、视频预览、视频发布、点赞、分享  
  硬件设备，点餐机设备管理、小票机设备管理  
  数据大屏，商户新、用户、订单新增量，商品销量，商户排行，月销售额曲线分析图  
统计分析，商品销量统计、会员增长统计、订单销量统计  

#### 沟通交流群
QQ群：663830947

#### 项目演示

1. 平台（商家）web端: http://39.106.46.52/login  
2. 商家移动端: 微信小程序搜索 拎玩网商家端  
3. 用户端: 微信扫码  
   ![Image text](https://linwan-oss.oss-cn-beijing.aliyuncs.com/files/gitee_qr_code.png)

#### 项目截图
![Image text](https://linwan-oss.oss-cn-beijing.aliyuncs.com/files/gitee_banner1.png)
![Image text](https://linwan-oss.oss-cn-beijing.aliyuncs.com/files/gitee_banner2.png)
![Image text](https://linwan-oss.oss-cn-beijing.aliyuncs.com/files/gitee_admin1.png)
![Image text](https://linwan-oss.oss-cn-beijing.aliyuncs.com/files/gitee_admin2.png)
![Image text](https://linwan-oss.oss-cn-beijing.aliyuncs.com/files/gitee_admin3.png)
![Image text](https://linwan-oss.oss-cn-beijing.aliyuncs.com/files/gitee_admin4.png)

#### 感谢
注：感谢若依开源的支持
