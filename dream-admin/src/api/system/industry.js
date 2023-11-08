import request from '@/utils/request'

// 查询行业列表
export function listIndustry(query) {
  return request({
    url: '/system/admin/community/industry/list',
    method: 'get',
    params: query
  })
}

// 查询行业详细
export function getIndustry(industryId) {
  return request({
    url: '/system/admin/community/industry/' + industryId,
    method: 'get'
  })
}

// 新增行业
export function addIndustry(data) {
  return request({
    url: '/system/admin/community/industry',
    method: 'post',
    data: data
  })
}

// 修改行业
export function updateIndustry(data) {
  return request({
    url: '/system/admin/community/industry',
    method: 'put',
    data: data
  })
}

// 删除行业信息
export function delIndustry(ids) {
  return request({
    url: '/system/admin/community/industry/' + ids,
    method: 'delete'
  })
}

// 查询所有行业信息
export function queryAllIndustryList(query) {
  return request({
    url: '/system/admin/community/industry/queryAllIndustryList',
    method: 'get',
    params: query
  })
}