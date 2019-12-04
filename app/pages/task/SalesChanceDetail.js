import React, {PureComponent} from 'react';
import {
    ScrollView,
    Dimensions,
    Linking,
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
    TouchableOpacity
} from 'react-native'
import Title from '../../components/Title'
import {StringUtils} from "../../utils";
import {Input} from "teaset";
import {Container, Header, Content, Footer, FooterTab, Button, Icon, Badge} from 'native-base';
export default class SalesChanceDetail extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            id: '15303',
            createStr: '2019-08-26',
            budgetQuotedRangeStr: '20万左右',
            sixtyDayPossibilityStr: '20%',
            systemRequirementsName: '分红挖矿APP',
            remark: '-',
            status: 1,
            visible:true,
            statusStr: '跟进中',
            purposeId:props.navigation.state.params.intentionId
        }
    }
    componentDidMount(): void {
        // budgetQuotedRange: 4
        // createPersonId: 734
        // createtime: "2019-10-11T09:03:51.000+0000"
        // id: 16196
        // purposeId: 15623
        // signApplyPersonId: 726
        // signApplyPersonName: "张梦思"
        // sixtyDayPossibility: 5
        // status: 2
        // systemRequirementsId: "1465"
        // systemRequirementsName: "个性需求纯定制"
        const {params}=this.props.navigation.state;
        let url=Config.requestUrl+Config.salesChanceDetailPageInterface.singleSalesChanceDetail+`?id=${params.id}`
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            console.log(6666,responseText);
            this.setState({visible:false},()=>{
                if(responseText.success){
                    const {status,budgetQuotedRangeStr,remark,createtime,signApplyPersonName,systemRequirementsName,sixtyDayPossibilityStr,id}=responseText.obj;
                    this.setState({remark,status,systemRequirementsName:systemRequirementsName,id,createStr:createtime,budgetQuotedRangeStr:budgetQuotedRangeStr,sixtyDayPossibilityStr:sixtyDayPossibilityStr});
                }
            });

        }).catch(error=>{
            Toast.fail(error)
        })
    }

    _exclude = (contractId) => {
        const {purposeId}=this.state;
        this.props.navigation.navigate('SalesChanceExclude',{contractId,purposeId});
    }
    _editSalesChance = (contractId) => {
        this.props.navigation.navigate('EditSalesChance', {isEditState: true,contractId});
    }
    _intentionShielding=(contractId)=>{
        const {purposeId}=this.state;
        this.props.navigation.navigate('IntentionShielding',{intentionId:purposeId,contractId});
    }
    _applySigned=(contractId)=>{
        const {purposeId}=this.state;
        this.props.navigation.navigate('ApplySigned',{intentionId:purposeId,contractId});
    }

    // 渲染
    render() {
        const {id, createStr, budgetQuotedRangeStr, sixtyDayPossibilityStr, systemRequirementsName, remark, status} = this.state;
        let statusStr='';
       if(status===1)
           statusStr='续跟';
       else if (status===2)
           statusStr='排除';
       else  if(status===3)
           statusStr='长期';
       else if(status===4)
           statusStr='已签';
       else
           statusStr='已终止';

        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                <Title title={'机会详情'} back onPressBack={() => this.props.navigation.goBack()}/>
                <View style={{marginTop: moderateScale(15), paddingHorizontal: moderateScale(13), flex: 1}}>
                    <View style={{
                        borderRadius: scale(5),
                        backgroundColor: "#fff",
                        shadowColor: "rgba(0, 0, 0, 0.06)",
                        shadowOffset: {
                            width: 0,
                            height: verticalScale(2)
                        },
                        shadowRadius: scale(10),
                        shadowOpacity: 1,
                    }}>
                        <DefaultInput title={'机会ID'} value={id} noBorder/>
                        <DefaultInput title={'录入时间'} value={createStr} noBorder/>
                        <DefaultInput title={'报价范围'} value={budgetQuotedRangeStr} noBorder/>
                        <DefaultInput title={'签约可能性'} value={sixtyDayPossibilityStr} noBorder/>
                        <DefaultInput title={'系统类型'} value={systemRequirementsName} noBorder/>
                        {StringUtils.isEmpty(remark) ? <View/> : <DefaultInput title={'需求描述'} value={remark} noBorder/>}
                        <DefaultInput title={'机会状态'} value={statusStr} noBorder/>
                    </View>
                </View>
                <View style={{flex: 1, justifyContent: 'flex-end',}}>
                    <View style={{height: px2dp(96), backgroundColor: '#fff', justifyContent: 'center'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                            <TouchableOpacity acitiveOapcity={0.8} onPress={()=>this._exclude(id)}>
                                <View style={{alignItems: 'center'}}>
                                    <Image source={Images.exclude} style={{width: px2dp(32), height: px2dp(32)}}/>
                                    <Text style={{
                                        marginTop: px2dp(5),
                                        fontFamily: "PingFangSC-Medium",
                                        fontSize: moderateScale(14),
                                        color: "#333"
                                    }}>排除</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity acitiveOapcity={0.8} onPress={()=>this._editSalesChance(id)}>
                                <View style={{alignItems: 'center'}}>
                                    <Image source={Images.edit} style={{width: px2dp(32), height: px2dp(32)}}/>
                                    <Text style={{
                                        marginTop: px2dp(5),
                                        fontFamily: "PingFangSC-Medium",
                                        fontSize: moderateScale(14),
                                        color: "#333"
                                    }}>编辑</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} onPress={()=>this._applySigned(id)}>
                            <View style={{alignItems: 'center'}}>
                                <Image source={Images.apply_signed} style={{width: px2dp(32), height: px2dp(32)}}/>
                                <Text style={{
                                    marginTop: px2dp(5),
                                    fontFamily: "PingFangSC-Medium",
                                    fontSize: moderateScale(14),
                                    color: "#333"
                                }}>申请已签</Text>
                            </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} onPress={()=>this._intentionShielding(id)}>
                            <View style={{alignItems: 'center'}}>
                                <Image source={Images.shielding} style={{width: px2dp(32), height: px2dp(32)}}/>
                                <Text style={{
                                    marginTop: px2dp(5),
                                    fontFamily: "PingFangSC-Medium",
                                    fontSize: moderateScale(14),
                                    color: "#333"
                                }}>意向拉黑</Text>
                            </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

}
const DefaultInput = (props) => {
    return (
        <View style={{
            height: verticalScale(40),
            justifyContent: 'center',
            backgroundColor: 'transparent',
            borderBottomWidth: props.noBorder ? 0 : StyleSheet.hairlineWidth,
            borderBottomColor: '#e0e0e0'
        }}>
            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                <Text style={{
                    marginLeft: moderateScale(22), fontFamily: "PingFangSC-Medium",
                    fontSize: moderateScale(14),
                    color: "#333"
                }}>{props.title}</Text>
                <Text style={{
                    marginLeft: px2dp(80),
                    textDecorationColor: props.textDecorationColor ? props.textDecorationColor : '#999',
                    textDecorationLine: props.textDecorationLine ? props.textDecorationLine : 'none',
                    color: props.color ? props.color : "#333333",
                    fontFamily: props.fontFamily ? props.fontFamily : "PingFang-SC-Medium",
                    fontSize: props.fontSize ? props.fontSize : moderateScale(14),
                }}>
                    {props.value}
                </Text>
            </View>
        </View>
    );
}
