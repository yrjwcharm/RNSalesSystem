import {Platform,Text,View} from 'react-native'
/**
 * Created by Fandy 下午2:13
 */
const Config = {
    requestUrl:'http://192.168.0.200:8002/',
    //后台
    // requestUrl:'http://172.16.80.51:8002',
    filepath:`http://192.168.0.200:8080/sales/`,
    loginInterface:{
        doLogin:'/api/appUser/userLogin',
    },
    homeInterface:{
        homeData:'/api/saleTask/getTaskTotal'
    },
    followingInterface:{
        getByStatus:'/api/salePurpose/getByStatus' , //查询不同状态的意向信息
        getTaskInfo:'/api/saleTask/listByPurposeId' ,  //获取任务信息
        getContactInfo:'/api/salePersonLink/listByPurposeId',//获取联系人信息
        getSignedContractInfo:'/api/saleContract/listAllSigned' , //以签约合同
        getSaleChance:'/api/saleContract/listByPurposeId',     //获取销售机会
        getFollowingInfo:'/api/saleFollowLog/listFollowLog' ,   //获取跟进信息
        getSinglePurposeInfo:'/api/salePurpose/listByPurposeId' ,  //获取单个意向信息
        viewContract:'/api/saleFile/listByContractId',               //查看合同
        taskList:'/api/saleTask/listTaskByUserId',
        urgentToDoList:'/api/saleTask/listTaskByStatus'
    },
    //数据字典
    dataDictionary:{
        customerLabelList:'/api/dictionary/listByOnlyMark'
    },
    intentionSearch:{
        DL:'/api/salePurpose/getBigSort',
        salesManagerList:'/api/appUser/getSalesManager?queryType=2',
        sysByGroupList:'/api/salePurpose/getGroupOfSystem?groupKey=biaozhunxitongfenlei',
        searchResult:'/api/salePurpose/listSearchSalePurpose',
        sysType:'/api/dictionary/listByParentId'
    },
    province:{
        provinceList:'/api/csDicAreaDynam/listByParentId',
    },
    addSalesChancePageInterface: {
        priceRange: '/api/saleContract/getQuotedRange',
        signPossibility: '/api/saleContract/getPossibility',
        productManager: '/api/appUser/listProductByRole?queryType=3',
        projectManager: '/api/appUser/listProductByRole?queryType=4',
        saveSalesChance: '/api/saleContract/addContract',
        sysType:'/api/globalType/listAllGroupOfSystemType'
    },
    addFollowing:{
        saveFollowing:'/api/saleFollowLog/addFollowMsg'
    },
    addContactPageInterface:{
        addContact:'/api/salePersonLink/addPersonLinker'
    },
    addTaskPageInterface:{
        addTask:'/api/saleTask/addSaleTask'
    },
    applySignPageInterface:{
        dataSource:'/api/saleContract/getHaveInvoice',
        autoGenerateContractNum:'/api/saleContract/makeChangeNumber',
        save:'/api/saleContract/addContractApply',
    },
    contactDetailPageInterface:{
        contactList:'/api/salePersonLink/listAll',
        singleContact:'/api/salePersonLink/seeSingle',
        deleteLinker:'/api/salePersonLink/deleteLinker',
        editLinker:'/api/salePersonLink/addPersonLinker',
        pullBlack:'/api/salePurpose/pullBlackApply',
        linkerShield:'/api/salePersonLink/addPersonToBlack',
        relationLinker:'http://localhost:8002/api/relationLinker'
    },
    paymentPlan:{
        getPayType:'/api/saleReplayment/getMoneyType',
        addPayment:'/api/saleReplayment/addMoney'
    },
    salesChanceDetailPageInterface:{
        singleSalesChanceDetail:'/api/saleContract/singleSee',
    },
    contractDetailPageInterface:{
        singleContractDetail:'/api/saleContract/singleSee',
        contractTermination:'/api/saleContract/toViodApply'
    },
    taskDetailPageInterface:{
        singleTaskDetail:'/api/saleTask/listByTaskId',
        dealTask:'/api/saleTask/changeStatus'
    },
    salesExcludePageInterface:{
        salesExclude:'/api/saleContract/applyExclude'
    },
    demoUrlPageInterface:{
        demoUrlList:'/api/saleDemoItem/listAll',
        queryCondition:'/api/globalType/listAllAndShowSystem'

    },
    checkVerbalTrick:{
        checkVerbalTrickList:'/api/saleStill/listStill'
    },
    purposePullBlackPageInterface:{
        purposePullBlack:'/api/salePurpose/pullBlackApply'
    },
    signedContractPageInterface:{
        signedContractList:'/api/saleContract/listSignedByUserIdAndPurposeId'
    },
    gathering:{
        gatheringPlan:'/api/saleReplayment/seeSingle'
    }
};
export default Config;
