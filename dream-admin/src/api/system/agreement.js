import request from '@/utils/request'

// 查询协议列表
export function listAgreement(query) {
  return request({
    url: '/system/admin/agreement/list',
    method: 'get',
    params: query
  })
}

// 查询协议详细
export function getAgreement(noticeId) {
  return request({
    url: '/system/admin/agreement/' + noticeId,
    method: 'get'
  })
}

// 新增协议
export function addAgreement(data) {
  return request({
    url: '/system/admin/agreement',
    method: 'post',
    data: data
  })
}

// 修改协议
export function updateAgreement(data) {
  return request({
    url: '/system/admin/agreement',
    method: 'put',
    data: data
  })
}

// 删除协议
export function delAgreement(noticeId) {
  return request({
    url: '/system/admin/agreement/' + noticeId,
    method: 'delete'
  })
}
