import request from '@/utils/request'
  // 新建
export function addPost(data) {
    return request({
      url: '/system/company',
      method: 'post',
      data: data
    })
}

// 修改
export function updatePut(data) {
    return request({
      url: '/system/company',
      data: data,
      method: 'put',
    })
}
// 删除
export function deletes(id) {
    return request({
      url: '/system/company/' + id,
      method: 'delete'
    })
}

// 查询列表
export function getLists(query) {
    return request({
      url: '/system/company/list',
      method: 'get',
      params: query
    })
}

// 查询列表详情
export function getDetails(id) {
    return request({
      url: '/system/company/'+id,
      method: 'get'
    })
}

