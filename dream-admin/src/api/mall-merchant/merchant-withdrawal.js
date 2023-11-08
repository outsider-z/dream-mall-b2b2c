import request from '@/utils/request'
//查询商户申请提现列表
export function queryUserWithdrawalList(data) {
    return request({
        url: '/merchant/merchant/withdrawal/queryUserWithdrawalList',
        method: 'post',
        data: data
    })
}
//商户申请提现
export function merchantWithdrawalApplication(data) {
    return request({
        url: '/merchant/merchant/withdrawal/merchantWithdrawalApplication',
        method: 'post',
        data: data
    })
}
//商户申请提现详情
export function queryMerchantWithdrawalById(query) {
    return request({
        url: '/merchant/merchant/withdrawal/queryMerchantWithdrawalById',
        method: 'get',
        params: query
    })
}
//查询商户手续费用
export function inquiryParameter(query) {
    return request({
        url: '/system/setting/inquiryParameter',
        method: 'get',
        params: query
    })
}
//查询商户可提现金额
export function queryMerchantAccountInfo(query) {
    return request({
        url: '/merchant/merchant/queryMerchantAccountInfo',
        method: 'get',
        params: query
    })
}
//查询商户信息
export function queryMerchantDetailById(query) {
    return request({
        url: '/merchant/merchant/queryMerchantDetailById',
        method: 'get',
        params: query
    })
}
//商户实名
export function merchantCertificationRealName(data) {
    return request({
        url: '/merchant/merchant/merchantCertificationRealName',
        method: 'post',
        data: data
    })
}
