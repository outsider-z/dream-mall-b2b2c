import request from '@/utils/request';


  // 查询设备列表
  export function getDeviceList(query){
    return request({
      url: '/third/admin/deviceInfo/list',
      method: 'get',
      params: query
    })
  }

// 新增设备
export function addDeviceInfo(data) {
    return request({
      url: '/third/admin/deviceInfo',
      method: 'post',
      data: data
    })
  }

  // 修改设备
export function updateDeviceInfo(data) {
    return request({
      url: '/third/admin/deviceInfo',
      method: 'put',
      data: data
    })
  }
  // 审核设备
  export function auditDeviceStatusInfo(data) {
    return request({
      url: '/third/admin/deviceInfo/auditDeviceStatusInfo',
      method: 'put',
      data: data
    })
  }




// 删除设备
export function delDeviceInfo(ids) {
    return request({
      url: '/third/admin/deviceInfo/' + ids,
      method: 'delete'
    })
  }
// 查询设备详情
export function getDeviceInfoDetails(id){
    return request({
      url: '/third/admin/deviceInfo/'+id,
      method: 'get'
    })
  }