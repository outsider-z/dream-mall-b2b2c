import request from '@/utils/request';

// 新增同城配送模板
export function addDelivery(data) {
  return request({
    url: '/system/delivery',
    method: 'post',
    data: data
  })
}
// 修改同城配送模板
export function updateDelivery(data) {
  return request({
    url: '/system/delivery',
    method: 'put',
    data: data
  })
}
// 查询社区商同城配送模板详情
export function getDeliveryDetails(id){
  return request({
    url: '/system/delivery/'+id,
    method: 'get'
  })
}
// 查询同城配送模板列表
export function getDeliveryList(query){
  return request({
    url: '/system/delivery/list',
    method: 'get',
    params: query
  })
}
// 根据查询同城配送模板列表
export function queryCityDeliveryByMerchantId(id){
  return request({
    url: '/system/delivery/queryCityDeliveryByMerchantId/'+id,
    method: 'get'
  })
}
// 删除社区商品分类
export function delDelivery(ids) {
  return request({
    url: '/system/delivery/' + ids,
    method: 'delete'
  })
}
