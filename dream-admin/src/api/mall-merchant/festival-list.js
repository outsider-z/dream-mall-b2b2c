import request from '@/utils/request';

//查询节日活动
export function getHolidayActiveList(query) {
    return request({
      url: '/market/merchant/activeCentre/merchantQueryHolidayActiveList',
      method: 'post',
      data: query
    })
}
//查询节日活动详情
export function getHolidayActiveDetails(id) {
    return request({
      url: '//' + id,
      method: 'get',
    })
}

// 新增活动商品
export function addhHolidayProduct(data) {
    return request({
      url: '/market/merchant/activeCentre/merchantAddHolidayProduct',
      method: 'post',
      data: data
    })
}

// 修改活动商品
export function updateHolidayProduct(data) {
    return request({
      url: '/market/merchant/activeCentre/merchantModifyHolidayProduct',
      method: 'put',
      data: data
    })
  }
//查询节日活动商品详情
export function geHolidayProductDetails(id) {
    return request({
      url: '/market/merchant/activeCentre/merchantQueryHolidayProductDetail/' + id,
      method: 'get',
    })
}

// 删除活动商品
export function delHolidayProduct(ids) {
    return request({
      url: '/market/merchant/activeCentre/merchantDeleteHolidayProduct/' + ids,
      method: 'delete'
    })
}

//查询节日活动商品列表
export function geHolidayProduct(data) {
    return request({
      url: '/market/merchant/activeCentre/merchantQueryHolidayProductList',
      method: 'post',
        data: data
    })
   
}