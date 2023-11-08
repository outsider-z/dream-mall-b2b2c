import request from '@/utils/request'

// 查询优惠券列表
export function listCoupon(query) {
  return request({
    url: '/market/admin/coupon/list',
    method: 'get',
    params: query
  })
}

// 查询优惠券详细
export function getCoupon(id) {
  return request({
    url: '/market/admin/coupon/' + id,
    method: 'get'
  })
}

// 新增优惠券
export function addCoupon(data) {
  return request({
    url: '/market/admin/coupon',
    method: 'post',
    data: data
  })
}

// 修改优惠券
export function updateCoupon(data) {
  return request({
    url: '/market/admin/coupon',
    method: 'put',
    data: data
  })
}

// 删除优惠券
export function delCoupon(id) {
  return request({
    url: '/market/admin/coupon/' + id,
    method: 'delete'
  })
}

// 查询优惠券可使用商品列表
export function getCouponList(query) {
  return request({
    url: '/market/admin/coupon/product/list',
    method: 'get',
    params: query
  })
}
// 分页查询用户优惠券列表
export function queryUserCouponList(query) {
  return request({
    url: '/market/admin/coupon/product/queryUserCouponList',
    method: 'get',
    params: query
  })
}

// 优惠券发放/关闭
export function modifyCouponGrantFlag(data) {
  return request({
    url: '/market/admin/coupon/modifyCouponGrantFlag',
    method: 'post',
    data: data
  })
}
