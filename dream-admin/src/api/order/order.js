import request from '@/utils/request'

// 查询商城订单列表
export function listOrder(query) {
  return request({
    url: '/order/admin/order/list',
    method: 'get',
    params: query
  })
}
// 查询商城商品列表
export function orderProductList(query) {
  return request({
    url: '/order/admin/orderProduct/list',
    method: 'get',
    params: query
  })
}
// 获取订单商品详细信息
export function getProduct(id) {
  return request({
    url: '/order/admin/order/' + id,
    method: 'get'
  })
}
//修改物流
export function adminModifyLogisticInfo(data) {
  return request({
    url: '/order/admin/order/adminModifyLogisticInfo',
    method: 'post',
    data: data
  })
}
//修改收货地址
export function adminModifyDeliveryAddress(data) {
  return request({
    url: '/order/admin/order/adminModifyDeliveryAddress',
    method: 'post',
    data: data
  })
}

//发货
export function merchantOrderShipped(data) {
  return request({
    url: '/order/merchant/order/merchantOrderShipped',
    method: 'post',
    data: data
  })
}

//查询退货订单
export function refundOrderList(query) {
  return request({
    url: '/order/admin/refundOrder/list',
    method: 'get',
    params: query
  })
}
//商城订单结算
export function mallOrderSettlement(query) {
  return request({
    url: '/order/admin/order/mallOrderSettlement',
    method: 'get',
    params: query
  })
}
//售后退款
export function merchantAcceptAfterSaleOrder(data) {
  return request({
    url: '/order/merchant/order/merchantAcceptAfterSaleOrder',
    method: 'post',
    data: data
  })
}

//商户确认收货退款处理
export function merchantConfirmRefundOrder(data) {
  return request({
    url: '/order/merchant/order/merchantConfirmRefundOrder',
    method: 'post',
    data: data
  })
}

//商户查询订单列表
export function merchantQueryOrderList(query) {
  return request({
    url: '/order/merchant/order/merchantQueryOrderList',
    method: 'get',
    params: query
  })
}
//商户核销订单
export function merchantVerificationOrder(data) {
  return request({
    url: '/order/merchant/order/merchantVerificationOrder',
    method: 'post',
    data: data
  })
}