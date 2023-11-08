import request from '@/utils/request'

// 商家查询发票信息列表
export function merchantQueryInvoiceList(data) {
  return request({
    url: '/order/merchant/invoice/merchantQueryInvoiceList',
    method: 'post',
    data: data
  })
}
// 修改发票信息
export function merchantModifyInvoiceInfo(data) {
  return request({
    url: '/order/merchant/invoice/merchantModifyInvoiceInfo',
    method: 'post',
    data: data
  })
}
