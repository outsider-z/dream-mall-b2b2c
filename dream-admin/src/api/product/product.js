import request from '@/utils/request'

// 查询商城商品列表
export function listProduct(query) {
  return request({
    url: '/product/mall/product/list',
    method: 'get',
    params: query
  })
}

// 查询商城商品详细
export function getProduct(id) {
  return request({
    url: '/product/mall/product/' + id,
    method: 'get'
  })
}

// 新增商城商品
export function addProduct(data) {
  return request({
    url: '/product/mall/product',
    method: 'post',
    data: data
  })
}

// 修改商城商品
export function updateProduct(data) {
  return request({
    url: '/product/mall/product',
    method: 'put',
    data: data
  })
}

// 删除商城商品
export function delProduct(ids) {
  return request({
    url: '/product/mall/product/' + ids,
    method: 'delete'
  })
}

// 上架商品
export function modifyProductStatus(data) {
  return request({
    url: '/product/mall/product/modifyProductStatus',
    method: 'post',
    data: data
  })
}

// 查询商城商品列表

export function getAllProduct(data) {
 return request({
    url: '/product/mall/product/getAllProduct',
    method: 'post',
    data: data
  })
}
// 查询商城商品列表
export function getSkuList(query) {
  return request({
    url: '/product/product/sku/list',
    method: 'get',
    params: query
  })
}

//商品审核
export function modifyProductVerifyStatus(data) {
  return request({
    url: '/product/mall/product/modifyProductVerifyStatus',
    method: 'post',
    data: data
  })
}
// 商户查询商城商品列表
export function merchantQueryMallProductList(query) {
  return request({
    url: '/product/merchant/mall/product/merchantQueryMallProductList',
    method: 'get',
    params: query
  })
}
// 查询商城商品详细
export function generatorWxAppletQrCode(data) {
  return request({
    url: '/third/api/weChat/generatorWxAppletQrCode',
    method: 'post',
    data: data
  })
}