import request from '@/utils/request';
//商户端-社区-修改发票
export function merchantModifyInvoiceInfo(data) {
    return request({
      url: '/order/merchant/invoice/merchantModifyInvoiceInfo',
      method: 'post',
      data: data
    })
}