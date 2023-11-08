import request from '@/utils/request'

// 查询新人福利配置列表
export function listBenefits(query) {
  return request({
    url: '/market/benefits/config/list',
    method: 'get',
    params: query
  })
}

// 查询新人福利配置详细
export function getBenefits(id) {
  return request({
    url: '/market/benefits/config' + id,
    method: 'get'
  })
}

// 新增新人福利配置
export function addBenefits(data) {
  return request({
    url: '/market/benefits/config',
    method: 'post',
    data: data
  })
}

// 修改新人福利配置
export function updateBenefits(data) {
  return request({
    url: '/market/benefits/config',
    method: 'put',
    data: data
  })
}

// 删除新人福利配置
export function delBenefits(id) {
  return request({
    url: '/market/benefits/config/' + id,
    method: 'delete'
  })
}
