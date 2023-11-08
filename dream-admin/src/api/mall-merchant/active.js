import request from '@/utils/request';
// 查询活动中心管理列表
export function queryActiveCentreList(data) {
  return request({
    url: '/market/merchant/activeCentre/queryActiveCentreList',
    method: 'post',
    data: data
  })
}
//商户查询团购活动专场列表
export function queryGroupActiveList(data) {
  return request({
    url: '/market/merchant/activeCentre/queryGroupActiveList',
    method: 'post',
    data: data
  })
}
//商户查询团购商品列表
export function merchantQueryGroupProduct(data) {
  return request({
    url: '/market/merchant/activeCentre/merchantQueryGroupProduct',
    method: 'post',
    data: data
  })
}
// 新增团购商品
export function merchantAddGroupProduct(data) {
  return request({
    url: '/market/merchant/activeCentre/merchantAddGroupProduct',
    method: 'post',
    data: data
  })
}
// 获取团购商品详情
export function queryGroupProductDetail(query) {
  return request({
    url: '/market/merchant/activeCentre/queryGroupProductDetail',
    method: 'get',
    params: query
  })
}
// 修改团购商品
export function merchantModifyGroupProduct(data) {
  return request({
    url: '/market/merchant/activeCentre/merchantModifyGroupProduct',
    method: 'post',
    data: data
  })
}
// 删除团购商品
export function merchantRemoveGroupProduct(query) {
  return request({
    url: '/market/merchant/activeCentre/merchantRemoveGroupProduct',
    method: 'get',
    params: query
  })
}
// 查询秒杀时段列表
export function merchantQuerySpikeTimeList(data) {
  return request({
    url: '/market/merchant/activeCentre/merchantQuerySpikeTimeList',
    method: 'post',
    data: data
  })
}
// 查询秒杀时段商品
export function merchantQuerySpikeProductList(data) {
  return request({
    url: '/market/merchant/activeCentre/merchantQuerySpikeProductList',
    method: 'post',
    data: data
  })
}
// 新增秒杀时段商品
export function merchantAddSpikeProduct(data) {
  return request({
    url: '/market/merchant/activeCentre/merchantAddSpikeProduct',
    method: 'post',
    data: data
  })
}
// 获取秒杀商品详情
export function querySpikeProductDetail(query) {
  return request({
    url: '/market/merchant/activeCentre/querySpikeProductDetail',
    method: 'get',
    params: query
  })
}
// 修改秒杀时段商品
export function merchantModifySpikeProduct(data) {
  return request({
    url: '/market/merchant/activeCentre/merchantModifySpikeProduct',
    method: 'post',
    data: data
  })
}

// 删除秒杀时段商品
export function merchantRemoveSpikeProduct(query) {
  return request({
    url: '/market/merchant/activeCentre/merchantRemoveSpikeProduct',
    method: 'get',
    params: query
  })
}
// 查询积分商品列表
export function merchantQueryPointProduct(data) {
  return request({
    url: '/market/merchant/activeCentre/merchantQueryPointProduct',
    method: 'post',
    data: data
  })
}
// 新增积分时段商品
export function merchantAddPointProduct(data) {
  return request({
    url: '/market/merchant/activeCentre/merchantAddPointProduct',
    method: 'post',
    data: data
  })
}
// 获取积分商品详情
export function queryPointProductDetail(query) {
  return request({
    url: '/market/merchant/activeCentre/queryPointProductDetail',
    method: 'get',
    params: query
  })
}
// 修改积分时段商品
export function merchantModifyPointProduct(data) {
  return request({
    url: '/market/merchant/activeCentre/merchantModifyPointProduct',
    method: 'post',
    data: data
  })
}
// 删除积分时段商品
export function merchantRemovePointProduct(query) {
  return request({
    url: '/market/merchant/activeCentre/merchantRemovePointProduct',
    method: 'get',
    params: query
  })
}

// 商户-新增节日商品
export function merchantAddHolidayProduct(data) {
  return request({
    url: '/market/merchant/activeCentre/merchantAddHolidayProduct',
    method: 'post',
    data: data
  })
}

//商户-查询节日商品
export function merchantQueryHolidayProductList(data) {
  return request({
    url: '/market/merchant/activeCentre/merchantQueryHolidayProductList',
    method: 'post',
    data: data
  })
}

// 商户-删除节日商品
export function merchantDeleteHolidayProduct(query) {
  return request({
    url: '/market/merchant/activeCentre/merchantDeleteHolidayProduct',
    method: 'get',
    params: query
  })
}

// 商户-节日商品详情
export function merchantQueryHolidayProductDetail(id) {
  return request({
    url: '/market/merchant/activeCentre/merchantQueryHolidayProductDetail?id='+id,
    method: 'get',
  })
}
// 商户-修改节日商品
export function merchantModifyHolidayProduct(data) {
  return request({
    url: '/market/merchant/activeCentre/merchantModifyHolidayProduct',
    method: 'post',
    data: data
  })
}