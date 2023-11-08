import request from '@/utils/request';

// 社区商户查询商品
export function merchantQueryCommunityProductList(query) {
    return request({
      url: '/product/merchant/community/product/merchantQueryCommunityProductList',
      method: 'get',
      params: query
    })
}
  // 社区商户新增商品
export function merchantAddCommunityProduct(data) {
    return request({
      url: '/product/merchant/community/product/merchantAddCommunityProduct',
      method: 'post',
      data: data
    })
}
  // 社区商户修改商品
  export function merchantModifyCommunityProduct(data) {
    return request({
      url: '/product/merchant/community/product/merchantModifyCommunityProduct',
      method: 'post',
      data: data
    })
}
  // 社区商户上架/下架商品
  export function merchantModifyCommunityProductStatus(data) {
    return request({
      url: '/product/merchant/community/product/merchantModifyCommunityProductStatus',
      method: 'post',
      data: data
    })
}
 // 社区商户查询商品信息详情
 export function merchantQueryCommunityProductDetail(id){
    return request({
      url: '/product/merchant/community/product/merchantQueryCommunityProductDetail?id='+id,
      method: 'get'
    })
  }
// 社区商户删除社区商品信息
export function merchantRemoveCommunityProductById(id){
    return request({
      url: '/product/merchant/community/product/merchantRemoveCommunityProductById?id='+id,
      method: 'get'
    })
  }
  
// 社区商户分类查询
export function merchantQueryCommunityProductCateList(query){
  return request({
    url: '/product/merchant/community/productCate/merchantQueryCommunityProductCateList',
    method: 'get',
    params: query
  })
}
  // 社区商户分类新增
  export function merchantAddCommunityProductCate(data) {
    return request({
      url: '/product/merchant/community/productCate/merchantAddCommunityProductCate',
      method: 'post',
      data: data
    })
}

 // 社区商户分类修改
 export function merchantModifyCommunityProductCate(data) {
  return request({
    url: '/product/merchant/community/productCate/merchantModifyCommunityProductCate',
    method: 'post',
    data: data
  })
}
 // 社区商户分类删除
 export function merchantDeleteCommunityProductCate(id) {
  return request({
    url: '/product/merchant/community/productCate/merchantDeleteCommunityProductCate?id='+id,
    method: 'post',
  })
}
// 查询社区商户商品分类详情
export function productCate(id){
  return request({
    url: '/product/merchant/community/productCate/'+id,
    method: 'get'
  })
}

// 查询社区商户运费模板
export function merchantQueryCityDelivery(query){
  return request({
    url: '/system/merchant/delivery/merchantQueryCityDelivery',
    method: 'get',
    params: query
  })
}
// 社区商户新增运费模板
export function merchantAddCityDelivery(data){
  return request({
    url: '/system/merchant/delivery/merchantAddCityDelivery',
    method: 'post',
    data: data
  })
}
// 社区商户修改运费模板
export function merchantModifyCityDelivery(data){
  return request({
    url: '/system/merchant/delivery/merchantModifyCityDelivery',
    method: 'post',
    data: data
  })
}

// 社区商户新增配送人员
export function addMerchantShopper(data){
  return request({
    url: '/system/merchant/shopper/addMerchantShopper',
    method: 'post',
    data: data
  })
}

// 社区商户删除配送人员
export function merchantDeleteShopperInfo(id){
  return request({
    url: '/system/merchant/shopper/merchantDeleteShopperInfo?id='+id,
    method: 'delete'
  })
}

// 社区商户修改配送人员
export function merchantModifyShopperinfo(data){
  return request({
    url: '/system/merchant/shopper/merchantModifyShopperinfo',
    method: 'post',
    data: data
  })
}

// 社区商户查询配送人员列表
export function queryMerchantShopperList(data){
  return request({
    url: '/system/merchant/shopper/queryMerchantShopperList',
    method: 'post',
    data: data
  })
}
