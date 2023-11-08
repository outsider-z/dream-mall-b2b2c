import request from '@/utils/request';

//查询节日活动
export function getHolidayActiveList(query) {
    return request({
      url: '/market/admin/holidayActive/list',
      method: 'get',
      params: query
    })
}
//查询节日活动详情
export function getHolidayActiveDetails(id) {
    return request({
      url: '/market/admin/holidayActive/' + id,
      method: 'get',
    })
}
// 新增活动
export function addHolidayActive(data) {
    return request({
      url: '/market/admin/holidayActive',
      method: 'post',
      data: data
    })
}

// 修改活动
export function updateHolidayActive(data) {
  return request({
    url: '/market/admin/holidayActive',
    method: 'put',
    data: data
  })
}

// 删除活动
export function delHolidayActive(ids) {
    return request({
      url: '/market/admin/holidayActive/' + ids,
      method: 'delete'
    })
}



// 新增活动商品
export function addhHolidayProduct(data) {
    return request({
      url: '/market/admin/holidayProduct',
      method: 'post',
      data: data
    })
}

// 修改活动商品
export function updateHolidayProduct(data) {
    return request({
      url: '/market/admin/holidayProduct',
      method: 'put',
      data: data
    })
  }
//查询节日活动商品详情
export function geHolidayProductDetails(id) {
    return request({
      url: '/market/admin/holidayProduct/' + id,
      method: 'get',
    })
}

// 删除活动商品
export function delHolidayProduct(ids) {
    return request({
      url: '/market/admin/holidayProduct/' + ids,
      method: 'delete'
    })
}

//查询节日活动商品列表
export function geHolidayProduct(data) {
    return request({
      url: '/market/admin/holidayProduct/list',
      method: 'post',
        data: data
    })
   
}