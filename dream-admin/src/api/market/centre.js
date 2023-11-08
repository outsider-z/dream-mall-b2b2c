import request from '@/utils/request'

// 查询活动
export function listCentreCenter(query) {
  return request({
    url: '/market/admin/centreCenter/list',
    method: 'get',
    params: query
  })
}

// 查询活动详细
export function getCentreCenter(id) {
  return request({
    url: '/market/admin/centreCenter/' + id,
    method: 'get'
  })
}

// 新增活动
export function addCentreCenter(data) {
  return request({
    url: '/market/admin/centreCenter',
    method: 'post',
    data: data
  })
}

// 修改活动
export function updateCentreCenter(data) {
  return request({
    url: '/market/admin/centreCenter',
    method: 'put',
    data: data
  })
}

// 删除活动
export function delCentreCenter(ids) {
  return request({
    url: '/market/admin/centreCenter/' + ids,
    method: 'delete'
  })
}

// 修改活动
export function updateStatus(data) {
  return request({
    url: '/market/admin/centreCenter/modifyActiveStatus',
    method: 'post',
    data: data
  })
}
