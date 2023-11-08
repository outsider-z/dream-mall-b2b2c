import request from '@/utils/request'

// 查询模块设置列表
export function listSettings(query) {
  return request({
    url: '/system/admin/module/settings/list',
    method: 'get',
    params: query
  })
}

// 查询模块设置详细
export function getSettings(id) {
  return request({
    url: '/system/admin/module/settings/' + id,
    method: 'get'
  })
}

// 新增模块设置
export function addSettings(data) {
  return request({
    url: '/system/admin/module/settings',
    method: 'post',
    data: data
  })
}

// 修改模块设置
export function updateSettings(data) {
  return request({
    url: '/system/admin/module/settings',
    method: 'put',
    data: data
  })
}

// 删除模块设置
export function delSettings(ids) {
  return request({
    url: '/system/admin/module/settings/' + ids,
    method: 'delete'
  })
}
