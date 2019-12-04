import React, {PureComponent} from 'react';
import {
    ScrollView,
    Linking,
    Easing,
    SafeAreaView,
    StyleSheet,
    DeviceEventEmitter,
    Image,
    FlatList,
    Platform,
    BackHandler,
    View,
    Text,
    TextInput,
    Alert,
    ImageBackground,
    TouchableOpacity,
    NativeModules
} from 'react-native'
import Title from '../../components/Title'
import {Input} from "teaset";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {StringUtils} from "../../utils";
import Loading from "../../components/Loading";
import  Animated  from 'react-native-reanimated'
export default class IntentionDetail extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        console.log(44443,props);
        const {params}=props.navigation.state;
        this.state={
            title:'意向详情',
            intentionID:'', //意向ID
            intentionState:'',  //意向状态
            company:'',   //公司
            homeLocation:'',  //所在地
            customerLabel:'' , //客户标签
            intentionSource:'',  //意向来源
            firstVisitTime:'',     //首访时间
            createTime:'' ,  //创建时间
            followLast:''  , //最后跟进
            createPerson:'' , //创建人
            statusStr:'',
            saleManager:''  ,   //销售经理
            chanceID:'',   //机会ID
            sysName:''  ,    //系统名称
            recordTime:'',    //录入时间
            contactInfo:'',    //联系信息
            name:'' ,           //姓名
            telephone:'' ,          //手机1
            fixMobile:'',          //固定电话
            qq:'' ,                 //QQ
            wx:'' ,                 //微信
            email:'' ,                 //邮箱
            planCompleteTime:'',taskTypeName:'',taskDetail:'',
            planTimeStr:'',
            systemRequirementsName:'',
            payMoney:'',
            conMoney:'',
            saleChanceId:'',
            contractNum:'',
            visible:true,
            isExpand:false,
            contractList:[],
            signedContractList:[],
            taskList:[],
            customerLabelTypeId:'',
            noLinkTime:'',
            totalMoney:'',
            countyName:'',

        }

    }
    //跳转跟进信息界面
    _jumpToFollowInfoRouter=(id)=>{
        this.props.navigation.navigate('FollowInfo',{intentionId:id})
    }
    //跳转任务信息界面
    _jumpToTaskInfoRouter=(id)=>{
        this.props.navigation.navigate('TaskInfo',{intentionId:id})
    }
    //跳转联系人信息界面
    _jumpToContactInfoRouter=(id)=>{
        this.props.navigation.navigate('ContactInfo',{intentionId:id})
    }
    //跳转销售机会界面
    _jumpToSaleChanceRouter=(id)=>{
        this.props.navigation.navigate('SaleChance',{intentionId:id})
    }
    //跳转已签约合同界面
    _jumpToAlreadySignContractRouter=(id)=>{
        this.props.navigation.navigate('AlreadySignContract',{intentionId:id})
    }
    //查询意向详情根据id
    _queryIntentionDetail=(id)=>{
        let url1=Config.requestUrl+Config.followingInterface.getSinglePurposeInfo+`?purposeId=${id}`;
        fetch(url1,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            console.log(555,responseText);
            this.setState({visible:false},()=>{
                if(responseText.success){
                    let obj=JSON.parse(responseText.obj);
                    console.log(66666666666666,obj);

                    if(obj.length!==0) {
                        const {cityName,countyName,noLinkTime,customerLabelTypeId,id, deleteStatus, companyName, provinceName, purposeResponsiblePersonName, firstTimeStr, personChargeName, lastFollowTimeStr, createTimeStr, customerLabelTypeName, purposeSourceName,} = obj;
                        this.setState({
                            createPerson: purposeResponsiblePersonName,
                            saleManager: personChargeName,
                            followLast: lastFollowTimeStr,
                            createTime: createTimeStr,
                            firstVisitTime: firstTimeStr,
                            intentionSource: purposeSourceName,
                            customerLabel: customerLabelTypeName,
                            homeLocation: provinceName+'>'+cityName+'>'+countyName,
                            intentionID: id,
                            customerLabelTypeId,
                            countyName,
                            intentionState: deleteStatus,
                            company: companyName,
                            noLinkTime
                        });
                    }
                }
            });

        }).catch(error=>{
            Toast.fail(error);
            this.setState({visible:false});
        })
    }
    //查询销售机会
    _querySaleChance=(id)=>{
        let url2=Config.requestUrl+Config.followingInterface.getSaleChance+`?purposeId=${id}`;
        fetch(url2,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            this.setState({visible:false},()=>{
                if(responseText.success){
                    let obj=JSON.parse(responseText.obj);
                    console.log(555,obj);
                    if(obj.length!==0) {
                        const {statusStr, id, systemRequirementsName, createStr} = obj[0];
                        this.setState({
                            statusStr,
                            chanceID: id,
                            sysName: systemRequirementsName,
                            recordTime: createStr
                        });
                    }
                }
            });
        }).catch(error=>{
            Toast.fail(error)
            this.setState({visible:false});
        })
    }
    //查询联系人信息
    _queryContactInfo=(id)=>{

        let url3=Config.requestUrl+Config.followingInterface.getContactInfo+`?purposeId=${id}`;
        fetch(url3,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            if(responseText.success){
                let obj=JSON.parse(responseText.obj);
                console.log(6666,obj);
                if(obj.length!==0){
                    const {linkName,phone,qq,telephone,weChat}=obj[0];
                    this.setState({name:linkName,telephone,fixMobile:phone,qq,wx:weChat,contractList:obj});
                }


            }

        }).catch(error=>{
            Toast.fail(error);
        });
    }
    //查询任务信息
    _queryTaskInfo=(id)=>{
        let url4=Config.requestUrl+Config.followingInterface.getTaskInfo+`?purposeId=${id}`;
        fetch(url4,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            this.setState({visible:false},()=>{
                if(responseText.success){
                    let obj=JSON.parse(responseText.obj);
                    console.log(999,obj);
                    // actualCompleteTime: 1512108780000
                    // changeResult: "排掉了"
                    // created: 1567588013540
                    // id: "2278"
                    // modified: 1567588013540
                    // planCompleteTime: 1512040030000
                    // recipientPersonId: "-726-"
                    // recipientPersonName: "张梦思"
                    // taskDetail: "请尽快联系客户"
                    // taskStatus: 2
                    // taskType: 1078
                    // taskTypeName: "联系客户"
                    if(obj.length!==0){
                        const {planTimeStr,planCompleteTime,taskTypeName,taskDetail}=obj[0];
                        this.setState({taskList:obj,planTimeStr,planCompleteTime,taskTypeName,taskDetail});
                    }

                }
            });
        }).catch(error=>{
            Toast.fail(error)
        })
    }
    //查询已签约信息
    _querySignedInfo=(id)=>{
        let url5=Config.requestUrl+Config.followingInterface.getSignedContractInfo+`?purposeId=${id}`;
        fetch(url5,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            console.log(555,responseText);
            this.setState({visible:false},()=>{
                if(responseText.success){
                    let obj=JSON.parse(responseText.obj);
                    console.log(8888,obj);
                    if(obj.length!==0) {
                        const {payMoney, conMoney,id, systemRequirementsName, changeNumber,} = obj[0];
                        this.setState({signedContractList:obj,totalMoney:payMoney+conMoney, saleChanceId: id, systemRequirementsName, contractNum: changeNumber});
                    }
                }
            });

        }).catch(error=>{
            Toast.fail(error)
            this.setState({visible:false});
        })
    }
    componentDidMount(): void {
        const {params}=this.props.navigation.state;
        this._queryIntentionDetail(params.intentionId);
        this._querySaleChance(params.intentionId)
        this._queryContactInfo(params.intentionId)
        this._queryTaskInfo(params.intentionId);
        this._querySignedInfo(params.intentionId)
    }
    _isExpand=()=>{
       this.setState({isExpand:!this.state.isExpand});
    }
    _callPhone=(url)=>{
        if(StringUtils.isEmpty(url)){
            return;
        }
        if(Platform.OS==='android'){
            NativeModules.NaviModule.callPhone(url);
        }else{
            Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                    console.log('Can\'t handle url: ' + url);
                } else {
                    return Linking.openURL(url);
                }
            }).catch(err => console.error('An error occurred', err));
        }
    }
    _formatMoney=(nStr)=> {
        nStr += '';
        let x = nStr.split('.');
        let x1 = x[0];
        let x2 = x.length > 1 ? '.' + x[1] : '';
        let rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
    // 渲染
    render() {
        const {countyName,planTimeStr,noLinkTime,customerLabelTypeId, taskList,contractList,
            signedContractList,totalMoney,saleChanceId,contractNum,systemRequirementsName,planCompleteTime,taskTypeName,taskDetail,name,telephone,fixMobile,qq,wx,statusStr,recordTime,sysName,chanceID,createPerson,saleManager,customerLabel,intentionSource,firstVisitTime,createTime,followLast,title,intentionID,intentionState,company,homeLocation,}=this.state;
        const {params}=this.props.navigation.state;
        let total=this._formatMoney(totalMoney);
        let noFinish=[];
       taskList.map(item=>{
           if(item.taskStatus!==2){
               noFinish.push(item.taskStatus);
           }
       })
        return (

            <SafeAreaView style={{flex:1,backgroundColor:'#F2F2F2',}}>
                <Title title={title} back onPressBack={()=>this.props.navigation.goBack()}  forward source={Images.menu} onPressForward={()=>this._jumpToFollowInfoRouter(params.intentionId)}/>
                    <ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
                        <View style={{paddingHorizontal:moderateScale(13),marginTop:moderateScale(12)}}>
                        <View>
                            <View style={{height:verticalScale(33),justifyContent:'center',backgroundColor:'#F8F8FA',borderBottomWidth: StyleSheet.hairlineWidth,borderBottomColor: '#e0e0e0'}}>
                                <View style={{marginHorizontal:moderateScale(13),flexDirection: 'row',alignItems:'center',justifyContent:'space-between'}}>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <Text style={{fontFamily: "PingFang-SC-Medium",
                                            fontSize: moderateScale(14),
                                            color: "#333333"}}>意向ID：</Text>
                                        <Text style={{fontFamily: "PingFang-SC-Medium",
                                            fontSize: moderateScale(14),
                                            color: "#2e93ff",marginLeft:moderateScale(10)}}>{intentionID}</Text>
                                    </View>
                                    <Text style={{fontFamily: "PingFang-SC-Medium",
                                        fontSize: moderateScale(14),
                                        color: intentionState===0?'#2e93ff':"#999",marginLeft:moderateScale(10)}}>{intentionState===0?'有效':'拉黑'}</Text>
                                </View>
                            </View>
                            <Cell  titleFontSize={moderateScale(16)} fontSize={moderateScale(16)} fontFamily={'PingFang-SC-Bold'} height={verticalScale(40)} title={'公司名称'} titleColor={'#333'} titleFontFamily={'PingFang-SC-Bold'} value={(company&&company.length)>12?company.substring(0,12)+'****':company} color={customerLabelTypeId===1450?'#EC6C59':customerLabelTypeId==='1454'?'#2e93f':'#333'}/>
                            <Cell  title={'所在地'} color={'#999'}  value={homeLocation}/>
                            <Cell  title={'客户标签'} textDecorationColor={customerLabelTypeId===1450?'red':customerLabelTypeId==='1454'?'#2e93ff':'#333'} textDecorationLine={'underline'}   color={customerLabelTypeId===1450?'red':customerLabelTypeId==='1454'?'#2e93ff':'#333'} value={customerLabel}/>
                            <Cell  title={'创建人'}   color={'#999'}  fontFamily={'PingFang-SC-Medium'} value={createPerson}/>
                            <Cell  title={'销售经理'}  color={'#999'} value={saleManager}/>
                            {this.state.isExpand?<Animated.View>
                                <Cell title={'意向来源'}  titleColor={'#999'} color={'#999'} value={intentionSource}/>
                                <Cell title={'首访时间'}  titleColor={'#999'}color={'#999'} value={firstVisitTime}/>
                                <Cell  title={'创建时间'}  titleColor={'#999'}color={'#999'}value={createTime}/>
                                <Cell  title={'最后跟进'}  titleColor={'#999'}color={'#999'}value={followLast}/>
                                <Cell  title={'未联系时长'} titleColor={'#999'} color={'#999'} value={noLinkTime}/>
                            </Animated.View>:<Animated.View/>}
                            <Animated.View>
                                <TouchableOpacity activeOpacity={0.8} onPress={this._isExpand}>
                                <View style={{justifyContent:'center',backgroundColor:'#fff',height:verticalScale(33)}}>
                                <Text style={{fontFamily: "PingFang-SC-Medium",
                                    fontSize: moderateScale(12),
                                    color: "#bbb",textAlign: 'center'}}>{this.state.isExpand?'收起':'展开'}</Text>
                                </View>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                        <View style={{marginTop:moderateScale(11)}}>
                            <View style={{height:verticalScale(33),justifyContent:'center',backgroundColor:'#f8f8fa',borderBottomWidth: StyleSheet.hairlineWidth,borderBottomColor: '#e0e0e0'}}>
                                <TouchableOpacity activeOpacity={0.8} onPress={()=>this._jumpToSaleChanceRouter(params.intentionId)}>
                                    <View style={{marginHorizontal:moderateScale(13),flexDirection: 'row',alignItems:'center',justifyContent:'space-between'}}>
                                        <View style={{flexDirection:'row',alignItems:'center'}}>
                                            <Text style={{fontFamily: "PingFang-SC-Medium",
                                                fontSize: moderateScale(14),
                                                color: "#333333"}}>机会ID：</Text>
                                            <Text style={{fontFamily: "PingFang-SC-Medium",
                                                fontSize: moderateScale(14),
                                                color: "#2e93ff",marginLeft:moderateScale(10)}}>{chanceID}</Text>
                                        </View>
                                        <Text style={{fontFamily: "PingFang-SC-Medium",
                                            fontSize: moderateScale(14),
                                            textDecorationColor:'#2e93ff',
                                            textDecorationLine:'underline',
                                            color: "#2e93ff",marginLeft:moderateScale(10)}}>{statusStr}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <Cell  titleFontSize={moderateScale(16)} fontSize={moderateScale(16)} titleFontFamily={'PingFang-SC-Bold'} fontFamily={'PingFang-SC-Bold'} height={verticalScale(40)}title={'系统名称'} value={StringUtils.isEmpty(sysName)?'暂无':sysName}/>
                            <Cell  title={'录入时间'} color='#999' value={recordTime}/>
                        </View>
                        <View style={{marginTop:moderateScale(11)}}>
                            <TouchableOpacity activeOpacity={0.8} disabled={contractList.length===0?true:false} onPress={()=>this._jumpToContactInfoRouter(params.intentionId)}>
                            <View style={{height:verticalScale(33),justifyContent:'center',backgroundColor:'#f8f8fa',borderBottomWidth: StyleSheet.hairlineWidth,borderBottomColor: '#e0e0e0'}}>
                                <View style={{marginHorizontal:moderateScale(13),flexDirection: 'row',alignItems:'center',justifyContent:'space-between'}}>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <Text style={{fontFamily: "PingFang-SC-Medium",
                                            fontSize: moderateScale(14),
                                            color: "#333333"}}>联系信息：</Text>
                                    </View>
                                    <Text style={{fontFamily: "PingFang-SC-Medium",
                                        fontSize: moderateScale(14),
                                        color: "#999",marginLeft:moderateScale(10)}}>{contractList.length===0?'暂无':"查看全部"}</Text>
                                </View>
                            </View>
                            </TouchableOpacity>
                            <Cell  title={'姓名'} value={name} color={'#2e93ff'}/>
                            <Cell  title={'手机'} onPress={()=>this._callPhone(telephone)} value={StringUtils.isEmpty(telephone)?'暂无':telephone}/>
                            {StringUtils.isEmpty(fixMobile)?<View/>:<Cell  onPress={()=>this._callPhone(fixMobile)} title={'固定电话'} value={StringUtils.isEmpty(fixMobile)?'暂无':fixMobile}/>}
                            {StringUtils.isEmpty(qq)?<View/>:<Cell  title={'QQ'} value={StringUtils.isEmpty(qq)?'暂无':qq}/>}
                            {StringUtils.isEmpty(wx)?<View/>:<Cell  title={'微信'} value={StringUtils.isEmpty(wx)?'暂无':wx}/>}
                        </View>
                        <View style={{marginTop:moderateScale(11)}}>
                            <TouchableOpacity activeOpacity={0.8} disabled={taskList.length===0?true:false} onPress={()=>this._jumpToTaskInfoRouter(params.intentionId)}>
                            <View style={{backgroundColor:taskList.length===0?'#EC6C59':noFinish.length===0?'#F8F8FA':'#2e93ff',height:verticalScale(33),justifyContent:'center',borderBottomWidth: StyleSheet.hairlineWidth,borderBottomColor: '#e0e0e0'}}>
                                <View style={{marginHorizontal:moderateScale(13),flexDirection: 'row',alignItems:'center',justifyContent:'space-between'}}>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <Text style={{fontFamily: "PingFang-SC-Medium",
                                            fontSize: moderateScale(14),
                                            color: taskList.length===0?'#fff':noFinish.length===0?'#333':'#fff'}}>任务信息：</Text>
                                    </View>
                                    <Text style={{fontFamily: "PingFang-SC-Medium",
                                        fontSize: moderateScale(14),
                                        color:taskList.length===0?'#fff':noFinish.length===0?'#333':'#fff',marginLeft:moderateScale(10)}}>{taskList.length===0?'暂无':"查看全部"}</Text>
                                </View>
                            </View>
                            </TouchableOpacity>
                            {StringUtils.isEmpty(taskTypeName)?<View/>:<Cell  title={'任务方式'} value={taskTypeName}/>}
                            {StringUtils.isEmpty(planTimeStr)?<View/>:<Cell  title={'计划时间'} value={`${planTimeStr}`}/>}
                            {StringUtils.isEmpty(taskDetail)?<View/>:<Cell  title={'任务要求'} value={taskDetail}/>}
                        </View>
                        <View style={{marginTop:moderateScale(11)}}>
                            <TouchableOpacity activeOpacity={0.8} disabled={signedContractList.length===0?true:false} onPress={()=>this._jumpToAlreadySignContractRouter(params.intentionId)}>
                            <View style={{height:verticalScale(33),justifyContent:'center',backgroundColor:'#f8f8fa',borderBottomWidth: StyleSheet.hairlineWidth,borderBottomColor: '#e0e0e0'}}>
                                <View style={{marginHorizontal:moderateScale(13),flexDirection: 'row',alignItems:'center',justifyContent:'space-between'}}>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <Text style={{fontFamily: "PingFang-SC-Medium",
                                            fontSize: moderateScale(14),
                                            color:"#333333"}}>已签合同：</Text>
                                    </View>
                                    <Text style={{fontFamily: "PingFang-SC-Medium",
                                        fontSize: moderateScale(14),
                                        color:"#666",marginLeft:moderateScale(10)}}>{signedContractList.length===0?'暂无':"查看全部"}</Text>
                                </View>
                            </View>
                            </TouchableOpacity>
                            {StringUtils.isEmpty(contractNum)?<View/>:<Cell  title={'合同编号'} value={contractNum}/>}
                            {StringUtils.isEmpty(total)?<View/>:<Cell  title={'合同总金额'} value={`${total}元`}/>}
                            {StringUtils.isEmpty(saleChanceId)?<View/>:<Cell  title={'机会ID'} value={saleChanceId}/>}
                            {StringUtils.isEmpty(systemRequirementsName)?<View/>: <Cell  title={'购买系统'} value={systemRequirementsName}/>}
                        </View>
                        </View>
                    </ScrollView>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>




        );
    }

}
const Cell=(props)=>{
    return(
        <TouchableOpacity onPress={props.onPress} activeOpacity={0.8}>
            <View style={{height:props.height?props.height:verticalScale(33),justifyContent:'center',backgroundColor: '#fff',borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:'#e0e0e0'}}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                    <Text style={{marginLeft:moderateScale(13),fontFamily: props.titleFontFamily?props.titleFontFamily:"PingFang-SC-Medium",
                        fontSize: props.titleFontSize?props.titleFontSize:moderateScale(14),
                        color:props.titleColor?props.titleColor: "#333333"}}>{props.title}</Text>
                    <Text style={{marginRight:moderateScale(10),textDecorationColor:props.textDecorationColor?props.textDecorationColor:'#333333',textDecorationLine:props.textDecorationLine?props.textDecorationLine:'none',color: props.color?props.color:"#333333",fontFamily: props.fontFamily?props.fontFamily:"PingFang-SC-Medium",fontSize:props.fontSize?props.fontSize:moderateScale(14),}}>
                        {props.value}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
