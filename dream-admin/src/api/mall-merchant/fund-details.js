import request from '@/utils/request';
// 查询商户资金列表
export function queryMerchantStatementInfoList(query) {
    return request({
      url: '/order/merchant/statement/queryMerchantStatementInfoList',
      method: 'get',
      params: query
    })
}