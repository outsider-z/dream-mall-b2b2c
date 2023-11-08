import request from '@/utils/request'

// 根据名称获取配置信息
export function inquiryParameter(query) {
  return request({
    url: '/system/setting/inquiryParameter',
    method: 'get',
    params: query
  })
}

// 修改配置
export function updateSetting(data) {
  return request({
    url: '/system/setting',
    method: 'put',
    data: data
  })
}
