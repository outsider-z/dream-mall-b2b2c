import request from '@/utils/request'

// 查询商城商品品类列表
export function listCate(query) {
  return request({
    url: '/product/product/cate/list',
    method: 'get',
    params: query
  })
}

// 查询商城商品品类详细
export function getCate(id) {
  return request({
    url: '/product/product/cate/' + id,
    method: 'get'
  })
}

// 新增商城商品品类
export function addCate(data) {
  return request({
    url: '/product/product/cate',
    method: 'post',
    data: data
  })
}

// 修改商城商品品类
export function updateCate(data) {
  return request({
    url: '/product/product/cate',
    method: 'put',
    data: data
  })
}

// 删除商城商品品类
export function delCate(ids) {
  return request({
    url: '/product/product/cate/' + ids,
    method: 'delete'
  })
}

// 查询商城所有商品品类列表
export function getAllProductCate(query) {
  return request({
    url: '/product/product/cate/getAllProductCate',
    method: 'get',
    params: query
  })
}