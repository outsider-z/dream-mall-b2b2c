import request from '@/utils/request'

// 查询轮播图配置列表
export function listSwiper(query) {
  return request({
    url: '/market/admin/swiper/list',
    method: 'get',
    params: query
  })
}

// 查询轮播图配置详细
export function getSwiper(id) {
  return request({
    url: '/market/admin/swiper/' + id,
    method: 'get'
  })
}

// 新增轮播图配置
export function addSwiper(data) {
  return request({
    url: '/market/admin/swiper',
    method: 'post',
    data: data
  })
}

// 修改轮播图配置
export function updateSwiper(data) {
  return request({
    url: '/market/admin/swiper',
    method: 'put',
    data: data
  })
}

// 删除轮播图配置
export function delSwiper(ids) {
  return request({
    url: '/market/admin/swiper/' + ids,
    method: 'delete'
  })
}
