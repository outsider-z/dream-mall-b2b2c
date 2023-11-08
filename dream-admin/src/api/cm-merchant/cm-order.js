import request from '@/utils/request';
// 商户查询社区订单列表
export function getLists(query) {
    return request({
      url: '/order/merchant/community/order/merchantQueryCommunityOrderList',
      method: 'get',
      params: query
    })
}

//社区-商户端-订单详情
export function getDetails(id) {
    return request({
      url: '/order/merchant/community/order/'+id,
      method: 'get'
    })
}

  //社区-商户端-社区商户接单
export function merchantAcceptOrder(data) {
    return request({
      url: '/order/merchant/community/order/merchantAcceptOrder',
      method: 'post',
      data: data
    })
}
  //社区-商户端-社区商户备货完成
  export function merchantStockComplete(data) {
    return request({
      url: '/order/merchant/community/order/merchantStockComplete',
      method: 'post',
      data: data
    })
}

  //社区-商户端-社区商户修改社区订单
  export function merchantModifyCommunityOrderInfo(data) {
    return request({
      url: '/order/merchant/community/order/merchantModifyCommunityOrderInfo',
      method: 'post',
      data: data
    })
}

 //社区-商户端-社区商户订单配送完成
 export function merchantOrderDeliveryCompleted(data) {
    return request({
      url: '/order/merchant/community/order/merchantOrderDeliveryCompleted',
      method: 'post',
      data: data
    })
}
 //社区-商户端-社区商户核销订单
 export function merchantOrderVerification(data) {
    return request({
      url: '/order/merchant/community/order/merchantOrderVerification',
      method: 'post',
      data: data
    })
}




  //社区-商户端-处理售后申请
  export function merchantAcceptAfterSaleOrder(data) {
    return request({
      url: '/order/merchant/community/order/merchantAcceptAfterSaleOrder',
      method: 'post',
      data: data
    })
}


   //社区-商户端-社区商户确认收货退款处理
   export function merchantConfirmRefundOrder(data) {
    return request({
      url: '/order/merchant/community/order/merchantConfirmRefundOrder',
      method: 'post',
      data: data
    })
}
//社区-商户端-社区商户退款申请列表
export function orderRefundList(data) {
  return request({
    url: '/order/merchant/order/merchantQueryAfterSaleOrderList',
    method: 'post',
    data: data
  })
}
//社区-商户端-社区商户退款申请订单详情
export function refundOrder(id) {
  return request({
    url: '/order/merchant/community/'+ id,
    method: 'get',
  })
}