import request from '@/utils/request';
// 查询评论举报
export function commentReportList(query) {
    return request({
      url: '/order/admin/commentReport/list',
      method: 'get',
      params: query
    })
}
// 查询评论举报信息详情
export function commentReportDetail(id){
    return request({
      url: '/order/admin/commentReport/'+id,
      method: 'get'
    })
  }
// 用户评论信息举报审核
export function auditCommentReportInfo(data) {
    return request({
      url: '/order/admin/commentReport/auditCommentReportInfo',
      method: 'put',
      data: data
    })
  }