import request from '@/utils/request';

// 查询会员卡列表
export function getRealNameList(query) {
  return request({
    url: '/member/admin/user/certification/list',
    method: 'get',
    params: query
  })
}
// 用户实名认证申请审核
export function modifyUserCertificationAuditStatus(data) {
  return request({
    url: '/member/admin/user/certification/modifyUserCertificationAuditStatus',
    method: 'post',
    data: data
  })
}
// 查询用户等级详细
export function getRealNameDetails(id) {
  return request({
    url: '/member/admin/user/certification/' + id,
    method: 'get'
  })
}
