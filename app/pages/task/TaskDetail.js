import React, {PureComponent} from 'react';
import {ScrollView,Dimensions,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../../components/Title'
import {StringUtils} from "../../utils";
import DelayTask from "./DelayTask";
import ActionSheet from "react-native-actionsheet";
import Loading from "../../components/Loading";
export default class TaskDetail extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            recipientPersonName:'拜访客户',
            executeTypeName:'拜访客户',
            taskStatus:2,
            taskTypeName:'',
            planTimeStr:'2019-08-26 20:46:16',
            taskDetail:'-',
            visible:true,
            taskId:'',
            purposeId:'',
        }
    }
    componentDidMount(): void {
     this._querySingleDetail();
     this.updateTaskDetailListener=DeviceEventEmitter.addListener('update_task_detail',()=>{
         this._querySingleDetail();
     })
    }
    _querySingleDetail=()=>{
        const {params}=this.props.navigation.state;
        let url=Config.requestUrl+Config.taskDetailPageInterface.singleTaskDetail+`?taskId=${params.id}`;
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            console.log(444,responseText);
            this.setState({visible:false},()=>{
                if(responseText.success){
                    const obj=JSON.parse(responseText.obj);
                    const {createtime,taskTypeName,executeTypeName,id,isAdvanceNotice,isNoticeOp,isOverNotice,planCompleteTime,purposeId,recipientPersonId,recipientPersonName,taskDetail,taskStatus,}=obj;
                    this.setState({taskId:id,taskTypeName,taskStatus,executeTypeName,recipientPersonName,planTimeStr:planCompleteTime,taskDetail});
                }
            });

        }).catch(error=>{
            Toast.fail(error)
        })
    }
    componentWillUnmount(): void {
        this.updateTaskDetailListener&&this.updateTaskDetailListener.remove();
    }

    _cancelTask=()=>{
        this.props.navigation.navigate('CancelTask',{taskId:this.state.taskId,});
    }
    _accomplishTask=()=>{
        this.props.navigation.navigate('AccomplishTask',{taskId:this.state.taskId,});
    }
    _delayTask=()=>{
        this.props.navigation.navigate('DelayTask',{taskId:this.state.taskId,});
    }
    _showActionSheet=()=>{
        this.ActionSheet.show()
    }
    // 渲染
    render() {
        const {recipientPersonName,executeTypeName,taskStatus,taskTypeName,planTimeStr,taskDetail}=this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f2f2f2'}}>
                <Title title={'任务详情'} back onPressBack={() => this.props.navigation.goBack()}/>
                <View style={{marginTop: moderateScale(15), paddingHorizontal: moderateScale(13),}}>
                    <View style={{
                        borderRadius: scale(5),
                        backgroundColor: "#fff",
                        shadowColor: "rgba(0, 0, 0, 0.06)",
                        shadowOffset: {
                            width: 0,
                            height: verticalScale(2)
                        },
                        borderWidth: px2dp(1),
                        borderColor: '#e0e0e0',
                        shadowRadius: scale(10),
                        shadowOpacity: 1,
                    }}>
                        <View style={{height: verticalScale(30), justifyContent: 'center',}}>
                            <View style={{marginLeft: moderateScale(26), flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Medium",
                                    fontSize: moderateScale(15),
                                    fontWeight: 'bold',
                                    color: "#333"
                                }}>{executeTypeName}</Text>
                            </View>
                        </View>
                        <DefaultInput title={'任务目的：'} value={taskTypeName} noBorder/>
                        <DefaultInput title={'状态：'} value={taskStatus===1?'跟进中':taskStatus===2?'已完成':taskStatus===3?'取消':taskStatus===4?'延期':''} noBorder/>
                        {/*<DefaultInput  title={'执行方式'}  value={item.executeTypeName} noBorder/>*/}
                        <DefaultInput title={'计划时间：'} value={planTimeStr} noBorder/>
                        {/*{item.taskStatus===2?<DefaultInput  title={'实际执行时间'} value={`${item.actTimeStr}`} noBorder/>:<View/>}*/}
                        <DefaultInput  title={'执行人'} value={recipientPersonName} noBorder/>
                        {/*{item.taskStatus===2?<DefaultInput  title={'处理结果'} value={StringUtils.isEmpty(item.changeResult)?'暂无':item.changeResult} noBorder/>:<View/>}*/}
                        <DefaultInput title={'任务要求：'}
                                      value={StringUtils.isEmpty(taskDetail) ? '暂无' : unescape(taskDetail)}
                                      noBorder/>
                    </View>
                </View>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    // title={'Which one do you like ?'}
                    options={['查看话术', '演示地址', '取消']}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={2}
                    onPress={(index) => {
                        /* do something */
                        if(index===0)
                            this.props.navigation.navigate('CheckVerbalTrick');
                        else if(index===1)
                            this.props.navigation.navigate('DemoUrl');

                    }}
                />
                <View style={{flex: 1, justifyContent: 'flex-end',}}>
                    <View style={{height: px2dp(96), backgroundColor: '#fff', justifyContent: 'center'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                            <TouchableOpacity acitiveOapcity={0.8} onPress={this._cancelTask}>
                                <View style={{alignItems: 'center'}}>
                                    <Image source={Images.exclude} style={{width: px2dp(32), height: px2dp(32)}}/>
                                    <Text style={{
                                        marginTop: px2dp(5),
                                        fontFamily: "PingFangSC-Medium",
                                        fontSize: moderateScale(14),
                                        color: "#333"
                                    }}>取消</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity acitiveOapcity={0.8} onPress={this._accomplishTask}>
                                <View style={{alignItems: 'center'}}>
                                    <Image source={Images.accomplish} style={{width: px2dp(32), height: px2dp(32)}}/>
                                    <Text style={{
                                        marginTop: px2dp(5),
                                        fontFamily: "PingFangSC-Medium",
                                        fontSize: moderateScale(14),
                                        color: "#333"
                                    }}>完成</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} onPress={this._delayTask}>
                                <View style={{alignItems: 'center'}}>
                                    <Image source={Images.delay} style={{width: px2dp(32), height: px2dp(32)}}/>
                                    <Text style={{
                                        marginTop: px2dp(5),
                                        fontFamily: "PingFangSC-Medium",
                                        fontSize: moderateScale(14),
                                        color: "#333"
                                    }}>延期</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} onPress={this._showActionSheet}>
                                <View style={{alignItems: 'center'}}>
                                    <Image source={Images.more} style={{width: px2dp(32), height: px2dp(32)}}/>
                                    <Text style={{
                                        marginTop: px2dp(5),
                                        fontFamily: "PingFangSC-Medium",
                                        fontSize: moderateScale(14),
                                        color: "#333"
                                    }}>更多</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
const DefaultInput = (props) => {
    return (
        <View style={{
            height: verticalScale(30),
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
                    marginLeft: moderateScale(10),
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
