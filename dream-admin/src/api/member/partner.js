import request from '@/utils/request'
// 查询合伙人申请
export function getPartnerList(query) {
    return request({
      url: '/member/admin/partner/list',
      method: 'get',
      params: query
    })
  }
  // 审核申请
export function partner(data) {
    return request({
      url: '/member/admin/partner',
      method: 'put',
      data: data
    })
  }