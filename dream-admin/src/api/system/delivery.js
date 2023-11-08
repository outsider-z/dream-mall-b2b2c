import request from '@/utils/request'

// 查询同城配送模板列表
export function listDelivery(query) {
  return request({
    url: '/system/delivery/list',
    method: 'get',
    params: query
  })
}

// 查询同城配送模板详细
export function getDelivery(id) {
  return request({
    url: '/system/delivery/' + id,
    method: 'get'
  })
}

// 新增同城配送模板
export function addDelivery(data) {
  return request({
    url: '/system/delivery',
    method: 'post',
    data: data
  })
}

// 修改同城配送模板
export function updateDelivery(data) {
  return request({
    url: '/system/delivery',
    method: 'put',
    data: data
  })
}

// 删除同城配送模板
export function delDelivery(id) {
  return request({
    url: '/system/delivery/' + id,
    method: 'delete'
  })
}

// 获取所有同城配送模板
export function getCityDelivery() {
  return request({
    url: '/system/delivery/getCityDelivery',
    method: 'get',
  })
}

//同城配送模板开启/关闭
export function modifyCityDeliveryActiveFlag(data) {
  return request({
    url: '/system/delivery/modifyCityDeliveryActiveFlag',
    method: 'post',
    data: data
  })
}
