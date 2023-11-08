import request from '@/utils/request';
// 查询健康档案列表
export function gethealthList(query){
    return request({
      url: '/market/admin/healthRecord/list',
      method: 'get',
      params: query
    })
  }
  // 查询健康档案详情
export function getHealthDetails(id){
    return request({
      url: '/market/admin/healthRecord/'+id,
      method: 'get'
    })
  }
