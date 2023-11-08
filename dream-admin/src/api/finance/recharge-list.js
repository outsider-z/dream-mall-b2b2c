import request from '@/utils/request'
// 新建
export function addPost(data) {
    return request({
      url: '/task/info',
      method: 'post',
      data: data
    })
}

// 修改
export function updatePut(data) {
    return request({
      url: '/task/info',
      data: data,
      method: 'put',
    })
}
// 删除
export function deletes(id) {
    return request({
      url: '/task/info/' + id,
      method: 'delete'
    })
}

// 查询列表
export function getLists(query) {
    return request({
      url: '/order/admin/user/statement/list',
      method: 'get',
      params: query
    })
}

// 查询列表详情
export function getDetails(id) {
    return request({
      url: '/order/admin/user/statement/'+id,
      method: 'get'
    })
}

