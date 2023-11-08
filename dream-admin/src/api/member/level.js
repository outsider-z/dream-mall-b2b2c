import request from '@/utils/request'

// 查询用户等级列表
export function listLevel(query) {
  return request({
    url: '/member/user/level/list',
    method: 'get',
    params: query
  })
}

// 查询用户等级详细
export function getLevel(id) {
  return request({
    url: '/member/user/level/' + id,
    method: 'get'
  })
}

// 新增用户等级
export function addLevel(data) {
  return request({
    url: '/member/user/level',
    method: 'post',
    data: data
  })
}

// 修改用户等级
export function updateLevel(data) {
  return request({
    url: '/member/user/level',
    method: 'put',
    data: data
  })
}

// 删除用户等级
export function delLevel(ids) {
  return request({
    url: '/member/user/level/' + ids,
    method: 'delete'
  })
}

//修改默认等级
export function modifyUserDefaultLevel(query) {
  return request({
    url: '/member/user/level/modifyUserDefaultLevel',
    method: 'get',
    params: query
  })
}
//修改用户合伙人标识
export function modifyUserLevelPartnerFlag(query) {
  return request({
    url: '/member/user/level/modifyUserLevelPartnerFlag',
    method: 'get',
    params: query
  })
}