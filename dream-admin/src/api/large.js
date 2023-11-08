import request from '@/utils/request'
// 查询平台人员数量统计
export function queryPlatformMemberInfo() {
    return request({
      url: '/member/public/data/platform/queryPlatformMemberInfo',
      method: 'get'
    })
  }
  // 查询平台订单数据统计信息
export function queryOrderStatisticInfo(data) {
  return request({
    url: '/order/public/order/queryOrderStatisticInfo?'+data,
    method: 'get'
  })
}
  // 查询订单待处理数据统计信息
  export function queryPendingOrderInfo(data) {
    return request({
      url: '/order/public/order/queryPendingOrderInfo?orderAttribute='+data,
      method: 'get'
    })
  }
  // 查询平台订单数据统计信息
  export function queryOrderStatisticGroupMonth(data) {
    return request({
      url: '/order/public/order/queryOrderStatisticGroupMonth?annual='+data,
      method: 'get'
    })
  }
  // 查询商品销售排行数据
  export function queryMerchantProductSalesStatistic() {
    return request({
      url: '/merchant/public/merchant/queryMerchantProductSalesStatistic',
      method: 'get'
    })
  }
  // 查询商品及视频数量统计
  export function queryProductNumStatistic() {
    return request({
      url: '/product/public/queryProductNumStatistic',
      method: 'get'
    })
  }

  //商户查询营销数据
export function queryMerchantSummaryInfo(query) {
  return request({
    url: '/merchant/merchant/queryMerchantSummaryInfo',
    method: 'get',
    params: query
  })
}