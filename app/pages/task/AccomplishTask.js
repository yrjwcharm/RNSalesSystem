import React, {PureComponent} from 'react';
import {ScrollView,Dimensions,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../../components/Title'
import {Textarea} from "native-base";
import {StringUtils} from "../../utils";
import Checkbox from "teaset/components/Checkbox/Checkbox";
import SmallButton from "../../components/SmallButton";
import Modal, {ModalContent} from "react-native-modals";
import DatePicker from "../../components/DatePicker";
export default class AccomplishTask extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            recipientPersonName:'拜访客户',
            executeTypeName:'拜访客户',
            taskStatus:2,
            taskTypeName:'常规跟进',
            planTimeStr:'2019-08-26 20:46:16',
            taskDetail:'-',
            checked:false,
            customBackgroundModal: false,
            defaultAnimationModal: false,
            swipeableModal: false,
            scaleAnimationModal: false,
            slideAnimationModal: false,
            bottomModalAndTitle: false,
            bottomModal: false,
            visible:true,
        }
    }
    componentDidMount(): void {
        store.get('userInfo').then(userInfo=> {
            this.setState({userInfo},()=>{
                this._querySingleTaskDetail();
            })
        })
    }
    _querySingleTaskDetail=()=>{
        const {params}=this.props.navigation.state;
        let url=Config.requestUrl+Config.taskDetailPageInterface.singleTaskDetail+`?taskId=${params.taskId}`;
        console.log(3333,url);
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

    _save=()=>{
        if(this.state.checked){
            this.props.navigation.navigate('AddTask');
        }else{
            this._submit();
        }
    }
    _submit=()=>{
        const {userInfo:{userId},changeResult}=this.state;
        const {params}=this.props.navigation.state;
        let url=Config.requestUrl+Config.taskDetailPageInterface.dealTask+`?userId=${userId}&taskId=${params.taskId}&operationType=2&changeResult=${changeResult}`;
        console.log(333,url);
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            console.log(333,responseText);
            if(responseText.success){
                this.setState({defaultAnimationModal:true});
            }
        }).catch(error=>{
            Toast.fail(error);
        })
    }
    _confirm=()=>{
        this.setState({
            defaultAnimationModal: false,
        },()=>{
            DeviceEventEmitter.emit('update_customer_archives_task',true);
            DeviceEventEmitter.emit('update_task_detail',true);
            this.props.navigation.goBack()
        });

    }
    _cancel=()=>{
        this.setState({
            defaultAnimationModal: false,
        });
    }
    // 渲染
    render() {
        const {recipientPersonName,executeTypeName,taskStatus,taskTypeName,planTimeStr,taskDetail}=this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f2f2f2'}}>
                <Title title={'完成任务'} back onPressBack={() => this.props.navigation.goBack()}/>
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
                        <DefaultInput title={'状态：'} value={taskStatus===1?'跟进中':taskStatus===2?'已完成':taskStatus===3?'已取消':taskStatus===4?'已延期':''} noBorder/>
                        {/*<DefaultInput  title={'执行方式'}  value={item.executeTypeName} noBorder/>*/}
                        <DefaultInput onPress={this._showDelayTimePicker} title={'计划时间：'} value={planTimeStr} noBorder/>
                        {/*{item.taskStatus===2?<DefaultInput  title={'实际执行时间'} value={`${item.actTimeStr}`} noBorder/>:<View/>}*/}
                        <DefaultInput  title={'执行人'} value={recipientPersonName} noBorder/>
                        {/*{item.taskStatus===2?<DefaultInput  title={'处理结果'} value={StringUtils.isEmpty(item.changeResult)?'暂无':item.changeResult} noBorder/>:<View/>}*/}
                        <DefaultInput title={'任务要求：'}
                                      value={StringUtils.isEmpty(taskDetail) ? '暂无' : unescape(taskDetail)}
                                      noBorder/>
                    </View>
                </View>
                <View style={{marginTop:px2dp(26),marginHorizontal: px2dp(26),backgroundColor:'#fff',borderRadius:px2dp(10)}}>
                    <Textarea rowSpan={8}  placeholder="任务处理结果" style={{paddingTop:px2dp(15),paddingLeft:px2dp(30),color:'#333',fontSize:px2dp(28)}} />
                </View>
                <View style={{marginLeft:px2dp(26),marginTop:px2dp(20)}}>
                    <Checkbox
                        title='派发新任务'
                        size='lg'
                        checkedIcon={<Image source={Images.check_box_} style={{width:px2dp(32),height:px2dp(32)}}/>}
                        uncheckedIcon={<Image  source={Images.check_box} style={{width:px2dp(32),height:px2dp(32)}} />}
                        checked={this.state.checked}
                        onChange={checked => this.setState({checked})}
                    />
                </View>
                <Modal
                    width={0.65}
                    visible={this.state.defaultAnimationModal}
                    rounded
                    actionsBordered
                    onTouchOutside={() => {
                        this.setState({ defaultAnimationModal: false });
                    }}
                    modalTitle={
                        <TouchableOpacity activeOpacity={0.8} onPress={this._cancel}>
                            <View style={{flexDirection:'row',justifyContent:'flex-end',paddingTop:px2dp(12),paddingRight:px2dp(12)}}>
                                <Image source={Images.exclude} style={{width:px2dp(32),height:px2dp(32)}}/>
                            </View>
                        </TouchableOpacity>
                    }
                >
                    <ModalContent
                        style={{ backgroundColor: '#fff' }}
                    >
                        <View style={{alignItems:'center'}}>
                            <Image source={Images.success} resizeMode={'contain'} style={{width:px2dp(48),height:px2dp(48)}}/>
                            <Text style={{
                                textAlign:'center',
                                marginTop:px2dp(20),
                                marginLeft: moderateScale(22), fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(15),
                                color: "#666"
                            }}>任务已完成</Text>
                            <Text style={{
                                marginTop:px2dp(20),
                                marginLeft: moderateScale(22), fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(14),
                                color: "#999"
                            }}>任务状态已添加，请查看。</Text>
                            <SmallButton name={'确认'} width={px2dp(420)} height={px2dp(90)} onPress={this._confirm}/>
                        </View>
                    </ModalContent>
                </Modal>
                <View style={{justifyContent:'flex-end',flex:1,bottom:px2dp(30),alignItems:'center'}}>
                    <SmallButton name={this.state.checked?'下一步':'保存'} onPress={this._save}/>
                </View>
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
