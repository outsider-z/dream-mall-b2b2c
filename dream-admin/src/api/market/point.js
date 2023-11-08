import request from '@/utils/request';
// 查询秒杀活动
export function pointList(query) {
  return request({
    url:'/market/admin/point/product/list',
    method: 'get',
    params: query
  })
}
// 查询秒杀活动详情
export function getDetailsPoint(id) {
  return request({
    url: '/market/admin/point/product/'+id,
    method: 'get'
  })
}
// 导出秒杀活动
export function pointExport(query) {
  return request({
    url: '/market/admin/point/product/export',
    method: 'get',
    params: query
  })
}
// 新增活动
export function addPoint(data) {
  return request({
    url: '/market/admin/point/product',
    method: 'post',
    data: data
  })
}
// 修改活动
export function updatePoint(data) {
  return request({
    url: '/market/admin/point/product',
    method: 'put',
    data: data
  })
}
// 删除活动
export function delPoint(ids) {
  return request({
    url: '/market/admin/point/product/' + ids,
    method: 'delete'
  })
}