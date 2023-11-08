import request from '@/utils/request'

// 查询模块配置列表
export function listConfiguration(query) {
  return request({
    url: '/system/module/configuration/list',
    method: 'get',
    params: query
  })
}

// 查询模块配置详细
export function getConfiguration(id) {
  return request({
    url: '/system/module/configuration/' + id,
    method: 'get'
  })
}

// 新增模块配置
export function addConfiguration(data) {
  return request({
    url: '/system/module/configuration',
    method: 'post',
    data: data
  })
}

// 修改模块配置
export function updateConfiguration(data) {
  return request({
    url: '/system/module/configuration',
    method: 'put',
    data: data
  })
}

// 删除模块配置
export function delConfiguration(ids) {
  return request({
    url: '/system/module/configuration/' + ids,
    method: 'delete'
  })
}


//查询所有模块设置
export function getModuleSettings(data) {
  return request({
    url: '/system/admin/module/settings/getModuleSettings',
    method: 'post',
    data: data
  })
}
