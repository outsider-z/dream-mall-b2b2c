import request from '@/utils/request'

// 获取积分设置
export function getPointSetting(data) {
  return request({
    url: '/system/point/setting/getPointSetting',
    method: 'post',
    data: data
  })
}

// 修改积分设置
export function pointSetting(data) {
  return request({
    url: '/system/point/setting',
    method: 'put',
    data: data
  })
}


// 获取签到积分设置信息
export function getSignSetting(data) {
  return request({
    url: '/system/sign/setting/getSignSetting',
    method: 'post',
    data: data
  })
}

// 修改签到积分设置
export function signSetting(data) {
  return request({
    url: '/system/sign/setting',
    method: 'put',
    data: data
  })
}
//查询签到列表
export function listUserSign(query) {
  return request({
    url: '/system/admin/userSign/list',
    method: 'get',
    params: query
  })
}