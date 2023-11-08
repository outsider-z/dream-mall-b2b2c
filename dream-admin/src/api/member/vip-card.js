import request from '@/utils/request'
// 查询会员卡列表
export function getCardList(query) {
  return request({
    url: '/system/admin/card/list',
    method: 'get',
    params: query
  })
}
// 新增会员卡信息
export function addCard(data) {
  return request({
    url: '/system/admin/card',
    method: 'post',
    data: data
  })
}
// 修改用户基础信息
export function updateCard(data) {
  return request({
    url: '/system/admin/card',
    method: 'put',
    data: data
  })
}
// 查询用户等级详细
export function getCard(id) {
  return request({
    url: '/system/admin/card/' + id,
    method: 'get'
  })
}

// 查询用户等级详细
export function getUserCardApply(query) {
  return request({
    url: '/member/admin/user/card/list' ,
    method: 'get',
    params: query
  })
}

// 查询用户等级详细
export function modifyUserCardAuditStatus(data) {
  return request({
    url: '/member/admin/user/card/modifyUserCardAuditStatus' ,
   method: 'post',
   data: data
  })
}

// 修改用户会员卡信息
export function updateCardInfo(data) {
  return request({
    url: '/member/admin/user/card',
    method: 'put',
    data: data
  })
}
// 会员卡充值
export function updateCardAccountInfo(data) {
  return request({
    url: '/member/admin/user/card/modifyUserCardAccountInfo',
    method: 'post',
    data: data
  })
}
