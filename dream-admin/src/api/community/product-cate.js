import request from '@/utils/request';
//查询社区商户商品分类列表
export function productCateList(params) {
  return request({
    url: 'product/admin/community/productCate/list',
    method: 'get',
    params: params
  })
}
// 新增社区商户商品分类
export function productCate(data) {
  return request({
    url: '/product/admin/community/productCate',
    method: 'post',
    data: data
  })
}
// 获取所有社区商户信息
export function getAllCommonityMerchant(query) {
  return request({
    url: '/merchant/merchant/list',
    method: 'get',
    params: query
  })
}
// 修改社区商品
export function updateProductCate(data) {
  return request({
    url: '/product/admin/community/productCate',
    method: 'put',
    data: data
  })
}
// 查询社区商品分类详情
export function getProductDdetails(id){
  return request({
    url: '/product/admin/community/productCate/'+id,
    method: 'get'
  })
}

// 删除社区商品分类
export function delProductCate(ids) {
  return request({
    url: '/product/admin/community/productCate/' + ids,
    method: 'delete'
  })
}
// 导出社区商户商品分类
export function exportProductCate(data) {
  return request({
    url: '/product/admin/community/productCate/export',
    method: 'post',
    data: data
  })
}
