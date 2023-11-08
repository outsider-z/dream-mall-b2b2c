import request from '@/utils/request';
// 查询社区订单列表
export function listOrder(query) {
  return request({
    url: '/order/admin/community/order/list',
    method: 'get',
    params: query
  })
}

// 获取订单详细信息
export function getOrderDetalis(id) {
  return request({
    url: '/order/admin/community/order/' + id,
    method: 'get'
  })
}
// 获取订单商品详细信息
export function queryMerchantShopperList(data) {
  return request({
    url: '/system/merchant/shopper/queryMerchantShopperList',
   method: 'post',
   data: data
  })
}

// 商家接单
export function merchantAcceptOrder(data) {
  return request({
    url: '/order/merchant/community/order/merchantAcceptOrder',
    method: 'post',
    data: data
  })
}

// 社区商户订单备货完成
export function merchantStockComplete(data) {
  return request({
    url: '/order/merchant/community/order/merchantStockComplete',
    method: 'post',
    data: data
  })
}


// 社区商户订单配送完成
export function merchantOrderDeliveryCompleted(data) {
  return request({
    url: '/order/merchant/community/order/merchantOrderDeliveryCompleted',
    method: 'post',
    data: data
  })
}

// 商户修改社区订单信息
export function merchantModifyCommunityOrderInfo(data) {
  return request({
    url: '/order/merchant/community/order/merchantModifyCommunityOrderInfo',
    method: 'post',
    data: data
  })
}
//订单核销
export function merchantOrderVerification(data) {
  return request({
    url: '/order/merchant/community/order/merchantOrderVerification',
    method: 'post',
    data: data
  })
}
/***售后**/

// 查询社区售后订单列表
export function orderRefundList(query) {
  return request({
    url: '/order/admin/refundOrder/list',
    method: 'get',
    params: query
  })
}

// 查询社区售后订单处理
export function merchantAcceptAfterSaleOrder(data) {
  return request({
    url: '/order/merchant/community/order/merchantAcceptAfterSaleOrder',
   method: 'post',
   data: data
  })
}

// 社区商户确认收货退款处理
export function merchantConfirmRefundOrder(data) {
  return request({
    url: '/order/merchant/community/order/merchantConfirmRefundOrder',
   method: 'post',
   data: data
  })
}
// 获取订单退货申请详细信息
export function refundOrder(id) {
  return request({
    url: '/order/admin/refundOrder/'+id,
   method: 'get',
  })
}
//

