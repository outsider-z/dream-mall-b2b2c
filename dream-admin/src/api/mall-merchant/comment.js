import request from '@/utils/request';

// 商户查询评论
export function getCommentList(query) {
    return request({
      url: '/order/merchant/comment/list',
      method: 'get',
      params: query
    })
}