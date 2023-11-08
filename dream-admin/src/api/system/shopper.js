import request from '@/utils/request'

// 查询商家配送人员列表
export function listShopper(query) {
  return request({
    url: '/system/admin/merchant/shopper/list',
    method: 'get',
    params: query
  })
}

// 查询商家配送人员详细
export function getShopper(id) {
  return request({
    url: '/system/admin/merchant/shopper/' + id,
    method: 'get'
  })
}

// 新增商家配送人员
export function addShopper(data) {
  return request({
    url: '/system/admin/merchant/shopper',
    method: 'post',
    data: data
  })
}

// 修改商家配送人员
export function updateShopper(data) {
  return request({
    url: '/system/admin/merchant/shopper',
    method: 'put',
    data: data
  })
}

// 删除商家配送人员
export function delShopper(ids) {
  return request({
    url: '/system/admin/merchant/shopper/' + ids,
    method: 'delete'
  })
}


