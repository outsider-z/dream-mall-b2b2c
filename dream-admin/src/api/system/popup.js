import request from '@/utils/request'

// 查询弹窗配置列表
export function listConfig(query) {
  return request({
    url: '/market/admin/popup/config/list',
    method: 'get',
    params: query
  })
}

// 查询弹窗配置详细
export function getConfig(id) {
  return request({
    url: '/market/admin/popup/config/' + id,
    method: 'get'
  })
}

// 新增弹窗配置
export function addConfig(data) {
  return request({
    url: '/market/admin/popup/config',
    method: 'post',
    data: data
  })
}

// 修改弹窗配置
export function updateConfig(data) {
  return request({
    url: '/market/admin/popup/config',
    method: 'put',
    data: data
  })
}

// 删除弹窗配置
export function delConfig(ids) {
  return request({
    url: '/market/admin/popup/config/' + ids,
    method: 'delete'
  })
}
