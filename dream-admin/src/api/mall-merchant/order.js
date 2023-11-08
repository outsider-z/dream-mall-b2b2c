import request from '@/utils/request'

// 查询商城订单列表
export function listOrder(query) {
  return request({
    url: '/order/merchant/order/merchantQueryOrderList',
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
    url: '/order/merchant/order/' + id,
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
    url: '/order/merchant/order/merchantModifyDeliveryAddress',
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
//导出订单 
export function exportOrderList(data) {

  return request({
    url: '/order/merchant/order/export',
    method: 'post',
    data: data
  });

}

//查询退货订单
export function refundOrderList(query) {
  return request({
    url: '/order/admin/refundOrder/list',
    method: 'get',
    params: query
  })
}
//查询退货订单
export function merchantQueryAfterSaleOrderList(data) {
  return request({
    url: '/order/merchant/order/merchantQueryAfterSaleOrderList',
    method: 'post',
    data: data
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
//商户核销订单
export function merchantVerificationOrder(data) {
  return request({
    url: '/order/merchant/order/merchantVerificationOrder',
    method: 'post',
    data: data
  })
}