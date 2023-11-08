import request from '@/utils/request';
// 查询商户优惠券列表
export function merchantQueryCouponList(data) {
    return request({
      url: '/market/merchant/coupon/merchantQueryCouponList',
      method: 'post',
      data: data
    })
}
// 新增商户优惠券
export function merchantAddCouponInfo(data) {
    return request({
      url: '/market/merchant/coupon/merchantAddCouponInfo',
      method: 'post',
      data: data
    })
}
// 优惠券启用/关闭
export function mercahntModifyCouponGrantFlag(data) {
    return request({
      url: '/market/merchant/coupon/mercahntModifyCouponGrantFlag',
      method: 'post',
      data: data
    })
}
// 商户修改优惠券
export function merchantModifyCouponInfo(data) {
    return request({
      url: '/market/merchant/coupon/merchantModifyCouponInfo',
      method: 'post',
      data: data
    })
}
// 商户获取优惠券详细信息
export function merchantQueryCoupinDetail(id) {
    return request({
      url: '/market/merchant/coupon/merchantQueryCoupinDetail?id='+id,
      method: 'get'
    })
}

// 商户删除优惠券
export function merchantRemoveCouponById(query) {
    return request({
      url: '/market/merchant/coupon/merchantRemoveCouponById',
      method: 'get',
      params: query
    })
}

// 商户获取优惠券可使用商品详细信息
export function merchantQueryCouponProductDetail(id) {
  return request({
    url: '/market/merchant/coupon/product/merchantQueryCouponProductDetail?id='+id,
    method: 'get'
  })
}

// 商户查询优惠券可使用商品列表
export function merchantQueryCouponProductList(data) {
  return request({
    url: '/market/merchant/coupon/product/merchantQueryCouponProductList',
    method: 'post',
    data: data
  })
}


