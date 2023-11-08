import request from '@/utils/request'

// 查询商城运费模板列表
export function listTemplate(query) {
  return request({
    url: '/system/freight/template/list',
    method: 'get',
    params: query
  })
}

// 查询商城运费模板详细
export function getTemplate(id) {
  return request({
    url: '/system/freight/template/' + id,
    method: 'get'
  })
}

// 新增商城运费模板
export function addTemplate(data) {
  return request({
    url: '/system/freight/template',
    method: 'post',
    data: data
  })
}

// 修改商城运费模板
export function updateTemplate(data) {
  return request({
    url: '/system/freight/template',
    method: 'put',
    data: data
  })
}

// 删除商城运费模板
export function delTemplate(ids) {
  return request({
    url: '/system/freight/template/' + ids,
    method: 'delete'
  })
}

// 查询商城运费模板详情列表
export function listDetail(query) {
  return request({
    url: '/system/freight/detail/list',
    method: 'get',
    params: query
  })
}

// 查询商城运费模板详情详细
export function getDetail(id) {
  return request({
    url: '/system/freight/detail/' + id,
    method: 'get'
  })
}

// 新增商城运费模板详情
export function addDetail(data) {
  return request({
    url: '/system/detail',
    method: 'post',
    data: data
  })
}

// 修改商城运费模板详情
export function updateDetail(data) {
  return request({
    url: '/system/detail',
    method: 'put',
    data: data
  })
}

// 删除商城运费模板详情
export function delDetail(ids) {
  return request({
    url: '/system/detail/' + ids,
    method: 'delete'
  })
}

//查询特定地区
export function getAreas(query) {
  return request({
    url: '/system/area/getAreas',
    method: 'get',
    params: query
  })
}

// 查询物流公司
export function getAllLogisticsCompany() {
  return request({
    url: '/system/company/getAllLogisticsCompany',
    method: 'get',
  })
}
// 获取所有运费模板
export function getFreightTemplate(query) {
  return request({
    url: '/system/freight/template/getFreightTemplate',
    method: 'get',
    params: query
  })
}

//运费模板开启/关闭
export function modifyFreightTemplateActiveFlag(data) {
  return request({
    url: '/system/freight/template/modifyFreightTemplateActiveFlag',
    method: 'post',
    data: data
  })
}
