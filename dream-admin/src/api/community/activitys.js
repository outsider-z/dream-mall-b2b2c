import request from '@/utils/request';
// 新增公益活动
export function addCharityActive(data) {
    return request({
      url: '/market/admin/charityActive',
      method: 'post',
      data: data
    })
  }
// 查询公益活动详情
export function getCharityActiveDetails(id){
    return request({
      url: '/market/admin/charityActive/'+id,
      method: 'get'
    })
  }
  // 查询公益活动列表
export function getCharityActiveList(query){
    return request({
      url: '/market/admin/charityActive/list',
      method: 'get',
      params: query
    })
  }
// 修改公益活动
export function updateCharityActive(data) {
    return request({
      url: '/market/admin/charityActive',
      method: 'put',
      data: data
    })
  }
// 删除公益活动
export function delCharityActive(ids) {
    return request({
      url: '/market/admin/charityActive/' + ids,
      method: 'delete'
    })
  }
  // 查询公益活动报名人列表
  export function getCharityUserList(query){
    return request({
      url: '/market/admin/charityUser/list',
      method: 'get',
      params: query
    })
  }

  