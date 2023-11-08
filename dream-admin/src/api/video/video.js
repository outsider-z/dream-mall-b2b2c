import request from '@/utils/request';
// 查询视频列表
export function getVideoList(query) {
  return request({
    url: '/video/admin/video/list',
    method: 'get',
    params: query
  })
}
// 查询视频详细
export function getVideoDetails(id) {
  return request({
    url: '/video/admin/video/' + id,
    method: 'get'
  })
}
// 修改短视频信息
export function modifyVideoAuditStatus(data) {
  return request({
    url: '/video/admin/video/modifyVideoAuditStatus',
    method: 'put',
    data: data
  })
}
// 删除视频信息
export function delVideo(id) {
  return request({
    url: '/video/admin/video/' + id,
    method: 'delete'
  })
}
// 活动
  // 获取视频上传凭证
  export function generatorVideoUploadVoucher(data) {
    return request({
      url: '/video/admin/video/generatorVideoUploadVoucher',
      method: 'post',
      data: data
    })
  }
// 素材视频新增
export function videoLibrary(data) {
  return request({
    url: '/market/admin/videoLibrary',
    method: 'post',
    data: data
  })
}
// 查询素材视频列表
export function getVideoLibraryList(query) {
  return request({
    url: '/market/admin/videoLibrary/list',
    method: 'get',
    params: query
  })
}
// 删除素材视频信息
export function delVideoLibrary(id) {
  return request({
    url: '/market/admin/videoLibrary/' + id,
    method: 'delete'
  })
}
// 查询管理端材料类型信息列表
export function queryVideoLibraryTypeList(query) {
  return request({
    url: '/market/admin/videoLibrary/queryVideoLibraryTypeList',
    method: 'get',
    params: query
  })
}
