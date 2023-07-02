/**
 * 公共基础数据接口
 */
import request from '../utils/request'

export const getDltHistoryPageList = () => {
    return request({
        method: 'get',
        url: 'https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=85&provinceId=0&isVerify=1&termLimits=100'
    })
}
export const getSsqHistoryPageList = () => {
    return request({
        method: 'get',
        url: 'http://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice?name=ssq&issueCount=&issueStart=&issueEnd=&dayStart=&dayEnd=&pageNo=1&pageSize=30&week=&systemType=PC'
    })
}
