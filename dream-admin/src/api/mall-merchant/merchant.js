import request from '@/utils/request'

// 查询商城商户信息列表
export function listMerchant(query) {
  return request({
    url: '/merchant/merchant/list',
    method: 'get',
    params: query
  })
}

// 查询商城商户信息详细
export function getMerchant(id) {
  return request({
    url: '/merchant/merchant/' + id,
    method: 'get'
  })
}
// 查询商城商户信息详细
export function queryMerchantDetailById(id) {
  return request({
    url: '/merchant/merchant/queryMerchantDetailById?id=' + id,
    method: 'get'
  })
}
// 新增商城商户信息
export function addMerchant(data) {
  return request({
    url: '/merchant/merchant',
    method: 'post',
    data: data
  })
}

// 修改商城商户信息
export function updateMerchant(data) {
  return request({
    url: '/merchant/merchant',
    method: 'put',
    data: data
  })
}

// 删除商城商户信息
export function delMerchant(ids) {
  return request({
    url: '/merchant/merchant/' + ids,
    method: 'delete'
  })
}

// 修改商城商户状态
export function changeStatus(data) {
  return request({
    url: '/merchant/merchant/changeStatus',
    method: 'put',
    data: data
  })
}

// 获取所有商城商户信息
export function getAllMallMerchant(query) {
  return request({
    url: '/merchant/merchant/getAllMallMerchant',
    method: 'get',
    params: query
  })
}

// 根据手机号商户信息
export function getMerchantByPhoneNo(data) {
  return request({
    url: '/merchant/merchant/getMerchantByPhoneNo',
    method: 'post',
    data: data
  })
}

//商户入驻
export function mallMerchantRegister(data) {
  return request({
    url: '/merchant/public/merchant/mallMerchantRegister',
    method: 'post',
    data: data
  })
}
//社区入驻
export function communityMerchantRegister(data) {
  return request({
    url: '/merchant/public/merchant/communityMerchantRegister',
    method: 'post',
    data: data
  })
}

// 商户审核失败原因查询
export function queryMerchantRegisterFailReason(query) {
  return request({
    url: '/merchant/public/merchant/queryMerchantRegisterFailReason',
    method: 'get',
    params: query
  })
}
//查询行业
export function queryAllIndustryList(query) {
  return request({
    url: '/system/admin/community/industry/queryAllIndustryList',
    method: 'get',
    params: query
  })
}

//查询商家（不返回资质）
export function searchMerchantList(data) {
  return request({
    url: '/merchant/public/merchant/searchMerchantList',
    method: 'post',
    data: data
  })
}

// 查询商城商户信息不排序
export function queryMerchantInfoList(query) {
  return request({
    url: '/merchant/merchant/queryMerchantInfoList',
    method: 'get',
    params: query
  })
}

