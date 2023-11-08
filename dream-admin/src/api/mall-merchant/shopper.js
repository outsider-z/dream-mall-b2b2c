import request from '@/utils/request';

// 查询商家配送人员列表
export function listShopper(data) {
  return request({
    url: '/system/merchant/shopper/queryMerchantShopperList',
    method: 'post',
    data: data
  })
}
// 查询商家配送人员详细
export function getShopper(id) {
  return request({
    url: '/system/merchant/shopper/merchantQueryShopperDetail/' + id,
    method: 'get'
  })
}
// 新增商家配送人员
export function addShopper(data) {
  return request({
    url: '/system/merchant/shopper/addMerchantShopper',
    method: 'post',
    data: data
  })
}
// 修改商家配送人员
export function updateShopper(data) {
  return request({
    url: '/system/merchant/shopper/merchantModifyShopperinfo',
    method: 'put',
    data: data
  })
}
// 删除商家配送人员
export function delShopper(ids) {
  return request({
    url: '/system/merchant/shopper/merchantDeleteShopperInfo?' + ids,
    method: 'delete'
  })
}
