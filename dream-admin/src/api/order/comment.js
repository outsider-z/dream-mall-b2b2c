import request from '@/utils/request'

// 评论统计
export function queryCommentSummaryList(query) {
  return request({
    url:'/order/admin/comment/queryCommentSummaryList',
    method: 'get',
    params: query
  })
}
//评论--商品
export function commentList(query) {
  return request({
    url:'/order/admin/comment/list',
    method: 'get',
    params: query
  })
}
//评论--商品
export function queryCommentReplayList(query) {
  return request({
    url:'/order/admin/comment/queryCommentReplayList',
    method: 'get',
    params: query
  })
}