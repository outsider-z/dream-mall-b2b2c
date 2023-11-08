import request from '@/utils/request';
  //新增活动视频信息
  export function AddActiveVideo(data) {
    return request({
      url: '/market/admin/activeVideo',
      method: 'post',
      data: data
    })
  }
  // 查询视频列表
export function getActivityVideoList(query) {
    return request({
      url: '/market/admin/activeVideo/list',
      method: 'get',
      params: query
    })
  }
// 删除视频信息
export function delActiveVideo(id) {
    return request({
      url: '/market/admin/activeVideo/' + id,
      method: 'delete'
    })
  }
  // 修改视频
export function updateActiveVideo(data) {
    return request({
      url: '/market/admin/activeVideo',
      method: 'put',
      data: data
    })
  }