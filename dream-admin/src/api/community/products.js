import request from '@/utils/request';
// 获取所有社区商户信息
export function getAllCommonityMerchant(query) {
  return request({
    url: '/merchant/merchant/list',
    method: 'get',
    params: query
  })
}
// 新增社区商品
export function addProduct(data) {
  return request({
    url: '/product/admin/community/product',
    method: 'post',
    data: data
  })
}
// 修改社区商品
export function updateMerchant(data) {
  return request({
    url: '/product/admin/community/product',
    method: 'put',
    data: data
  })
}
//查询社区商品详情
export function findProductDetails(id) {
  return request({
    url: '/product/admin/community/product/'+id,
    method: 'get',
  })
}
// 删除社区商品
export function delProduct(ids) {
  return request({
    url: '/product/admin/community/product/' + ids,
    method: 'delete'
  })
}
// 导出社区商品
export function product(data) {
  return request({
    url: '/product/admin/community/product/export',
    method: 'post',
    data: data
  })
}
//查询社区商品列表
export function findProductList(query) {
  return request({
    url: '/product/admin/community/product/list',
    method: 'get',
    params: query
  })
}

//社区商品上架下架
export function modifyCommunityProductStatus(data) {
  return request({
    url: '/product/admin/community/product/modifyCommunityProductStatus',
    method: 'post',
    data: data
  })
}
//社区商品同意拒绝
export function modifyCommunityProductVerifyStatus(data) {
  return request({
    url: '/product/admin/community/product/modifyCommunityCommunityProductVerifyStatus',
    method: 'post',
    data: data
  })
}
