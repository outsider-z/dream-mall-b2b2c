import request from '@/utils/request';
// 查询秒杀活动
export function spikeTimeList(query) {
  return request({
    url: '/market/admin/spikeTime/list',
    method: 'get',
    params: query
  })
}

// 查询秒杀活动详情
export function getDetailsSpikeTime(id) {
  return request({
    url: '/market/admin/spikeTime/'+id,
    method: 'get'
  })
}
// 导出秒杀活动
export function spikeExport(query) {
  return request({
    url: '/market/admin/spikeTime/export',
    method: 'get',
    params: query
  })
}

// 新增活动
export function addSpikeTime(data) {
  return request({
    url: '/market/admin/spikeTime',
    method: 'post',
    data: data
  })
}
// 修改活动
export function updateSpikeTime(data) {
  return request({
    url: '/market/admin/spikeTime',
    method: 'put',
    data: data
  })
}
// 删除活动
export function delSpikeTime(ids) {
  return request({
    url: '/market/admin/spikeTime/' + ids,
    method: 'delete'
  })
}

//添加商品规格
export function spikeProduct(data) {
  return request({
    url: '/market/admin/spikeProduct',
    method: 'post',
    data: data
  })
}

// 查询秒杀活动详情
export function spikeProductList(query) {
  return request({
    url: '/market/admin/spikeProduct/list',
    method: 'get',
    params: query
  })
}

// 获取秒杀时段商品详细信息
export function getSpikeProduct(id) {
  return request({
    url: '/market/admin/spikeProduct/'+id,
    method: 'get'
  })
}

// 修改秒杀时段商品
export function updateSpikeProduct(data) {
  return request({
    url: '/market/admin/spikeProduct',
    method: 'put',
    data: data
  })
}

// 修改秒杀时段商品状态
export function modifySpikeTimeProductStatus(data) {
  return request({
    url: '/market/admin/spikeProduct/modifySpikeTimeProductStatus',
    method: 'post',
    data: data
  })
}

//查询拼团活动列表
export function groupActiveList(query) {
  return request({
    url: '/market/admin/groupActive/list',
    method: 'get',
    params: query
  })
}

//新增拼团活动专场
export function addGroupActive(data) {
  return request({
    url: '/market/admin/groupActive',
    method: 'post',
    data: data
  })
}
// 修改拼团活动专场
export function updateGroupActive(data) {
  return request({
    url: '/market/admin/groupActive',
    method: 'put',
    data: data
  })
}

// 删除拼团活动
export function delGroupActive(ids) {
  return request({
    url: '/market/admin/groupActive/' + ids,
    method: 'delete'
  })
}
// 查询拼团活动专场详情
export function getGroupDetail(id) {
  return request({
    url: '/market/admin/groupActive/'+id,
    method: 'get'
  })
}

//添加拼团商品
export function addGroupProduct(data) {
  return request({
    url: '/market/admin/groupProduct',
    method: 'post',
    data: data
  })
}
// 修改拼团商品
export function updateGroupProduct(data) {
  return request({
    url: '/market/admin/groupProduct',
    method: 'put',
    data: data
  })
}
//查询拼团活商品列表
export function getGroupProductList(query) {
  return request({
    url: '/market/admin/groupProduct/list',
    method: 'get',
    params: query
  })
}
// 查询拼团活动商品详情
export function getGroupProduct(id) {
  return request({
    url: '/market/admin/groupProduct/'+id,
    method: 'get'
  })
}
// 修改拼团活动商品状态
export function modifyGroupProductStatus(data) {
  return request({
    url: '/market/admin/groupProduct/modifyGroupProductStatus',
    method: 'post',
    data: data
  })
}
