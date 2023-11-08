import request from '@/utils/request'
// 查询
export function listGlobal(query) {
  return request({
    url: '/system/global/config/list',
    method: 'get',
    params: query
  })
}
// 新增
export function addGlobal(data) {
  return request({
    url: '/system/global/config',
    method: 'post',
    data: data
  })
}

// 修改
export function updateGlobal(data) {
  return request({
    url: '/system/global/config',
    method: 'put',
    data: data
  })
}

// 删除
export function delGlobal(globalId) {
  return request({
    url: '/system/global/config/' + globalId,
    method: 'delete'
  })
}

// 查询详细
export function getGlobal(globalId) {
  return request({
    url: '/system/global/config/' + globalId,
    method: 'get'
  })
}

//分销
// 查询分销配置列表
export function listConfig(query) {
  return request({
    url: '/system/distribution/config/queryDistributionConfig',
    method: 'get',
    params: query
  })
}
// 修改分销配置
export function updateConfig(data) {
  return request({
    url: '/system/distribution/config',
    method: 'put',
    data: data
  })
}
