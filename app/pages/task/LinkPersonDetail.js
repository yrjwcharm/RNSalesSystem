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
    TouchableOpacity,
    NativeModules,
} from 'react-native'
import Title from '../../components/Title'
import {StringUtils} from "../../utils";
import {Input} from "teaset";
import {Container, Header, Content, Footer, FooterTab, Button, Icon, Badge} from 'native-base';
import Modal, {ModalContent} from "react-native-modals";
import SmallButton from "../../components/SmallButton";
import Loading from "../../components/Loading";
export default class LinkPersonDetail extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            qq:'',
            wx:'',
            email:'',
            phone1:'',
            phone2:'',
            fixMobile:'',
            linkName:'',
            sexName:'',
            customBackgroundModal: false,
            defaultAnimationModal: false,
            defaultAnimationModal1:false,
            swipeableModal: false,
            scaleAnimationModal: false,
            slideAnimationModal: false,
            bottomModalAndTitle: false,
            bottomModal: false,
            visible:true,
            userInfo:null,
        }
    }
    componentDidMount(): void {
        store.get('userInfo').then(userInfo=>{
            this.setState({userInfo},()=>{
                this._querySingleLinkerDetail();
            });
        });

      this.updateLinkDetailListener=DeviceEventEmitter.addListener('update_link_detail',(result)=>{
          if(result){
              this._querySingleLinkerDetail();
          }
      })
    }
    componentWillUnmount(): void {
        this.updateLinkDetailListener&&this.updateLinkDetailListener.remove();
    }

    _querySingleLinkerDetail=()=>{
        const {params}=this.props.navigation.state;
        let url=Config.requestUrl+Config.contactDetailPageInterface.singleContact+`?linkerId=${params.id}`;
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            this.setState({visible:false},()=>{
                console.log(444,responseText);
                if(responseText.success){
                    const { id,isDelete,isBlack,weChat,linkName,qq,telephone,vin,sexName}=responseText.obj;
                    this.setState({linkName,qq,wx:weChat,phone1:telephone,sexName});
                }
            });
        }).catch(error=>{
            Toast.fail(error)
        })
    }

    _associated = () => {
        const {params}=this.props.navigation.state;
            this.props.navigation.navigate('ContactPersonList',{id:params.id,purposeId:params.purposeId});
    }
    _editLinkPersonInfo = () => {
        const {params}=this.props.navigation.state;
            this.props.navigation.navigate('EditLinkPerson',{id:params.id,purposeId:params.purposeId})
    }
    _intentionShielding=()=>{

        const {params}=this.props.navigation.state;
        // 联系人主键：linkerId
        // 当前登录人主键：userId
        // 申请备注：toBlackResultStr
        // 申请拉黑主键：blackId
        const {userInfo:{userId},toBlackResultStr}=this.state;
        let url=Config.requestUrl+Config.contactDetailPageInterface.linkerShield+`?linkerId=${params.id}&userId=${userId}&toBlackResultStr=${toBlackResultStr}`;
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            console.log(444,responseText);
            if(responseText.success){
                    Toast.message(responseText.obj);
            }
        }).catch(error=>{
            Toast.fail(error)
        })
    }
    _delete=()=>{
        const {params}=this.props.navigation.state;
        let url=Config.requestUrl+Config.contactDetailPageInterface.deleteLinker+`?linkerId=${params.id}`;
        this.setState({visible:true},()=>{
            fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
                this.setState({visible:false},()=>{
                    console.log(444,responseText);
                    if(responseText.success){
                        this.setState({defaultAnimationModal:true});
                    }
                });
            }).catch(error=>{
                Toast.fail(error)
            })
        });

    }
    _cancel=()=>{
        this.setState({defaultAnimationModal:false});
    }
    _cancel1=()=>{
        this.setState({defaultAnimationModal1:false});
    }
    _confirm=()=>{
        this.setState({defaultAnimationModal:false},()=>{
            DeviceEventEmitter.emit('update_customer_archives_contact',true);
                this.props.navigation.goBack();
        });
    }
    _confirm1=()=>{
        this.setState({defaultAnimationModal1:false},);
    }

    // 渲染
    render() {
        const {qq,wx,email,sexName,phone1,linkName,phone2,fixMobile} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                <Title title={'联系详情'} back onPressBack={() => this.props.navigation.goBack()}/>
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
                        <View style={{ marginLeft:px2dp(20), marginTop:px2dp(20),flexDirection:'row',alignItems:'center'}}>
                            <Text style={{
                                fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(16),
                                color: "#333"
                            }}>{linkName}</Text>
                            <Text style={{
                                marginLeft: px2dp(15),
                                fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(14),
                                color: "#999"
                            }}>{sexName}</Text>
                        </View>
                        <DefaultInput title={'手机'} value={phone1} noBorder/>
                        {/*<DefaultInput title={'手机2'} value={phone2} noBorder/>*/}
                        <DefaultInput title={'固话'} value={StringUtils.isEmpty(fixMobile)?'暂无':fixMobile} noBorder/>
                        <DefaultInput title={'QQ'} value={StringUtils.isEmpty(qq)?'暂无':qq} noBorder/>
                        <DefaultInput title={'微信'} value={StringUtils.isEmpty(wx)?'暂无':wx} noBorder/>
                        <DefaultInput title={'邮箱'} value={StringUtils.isEmpty(email)?'暂无':email} noBorder/>
                        {/*{StringUtils.isEmpty(remark) ? <View/> : <DefaultInput title={'需求描述'} value={remark} noBorder/>}*/}
                    </View>
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
                            <Image source={Images.delete} resizeMode={'contain'} style={{width:px2dp(48),height:px2dp(48)}}/>
                            <Text style={{
                                textAlign:'center',
                                marginTop:px2dp(20),
                                marginLeft: moderateScale(22), fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(15),
                                color: "#666"
                            }}>信息确认</Text>
                            <Text style={{
                                marginTop:px2dp(20),
                                marginLeft: moderateScale(22), fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(14),
                                color: "#999"
                            }}>您确认要删除该联系人吗？</Text>
                            <SmallButton name={'确认'} width={px2dp(420)} height={px2dp(90)} onPress={this._confirm}/>
                        </View>
                    </ModalContent>
                </Modal>
                <Modal
                    width={0.65}
                    visible={this.state.defaultAnimationModal1}
                    rounded
                    actionsBordered
                    onTouchOutside={() => {
                        this.setState({ defaultAnimationModal1: false });
                    }}
                    modalTitle={
                        <TouchableOpacity activeOpacity={0.8} onPress={this._cancel1}>
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
                            <Image source={Images.shielding} resizeMode={'contain'} style={{width:px2dp(48),height:px2dp(48)}}/>
                            <Text style={{
                                textAlign:'center',
                                marginTop:px2dp(20),
                                marginLeft: moderateScale(22), fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(15),
                                color: "#666"
                            }}>信息确认</Text>
                            <Text style={{
                                marginTop:px2dp(20),
                                marginLeft: moderateScale(22), fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(14),
                                color: "#999"
                            }}>您确认要把所选的联系人拉入黑名单吗？</Text>
                            <SmallButton name={'确认'} width={px2dp(420)} height={px2dp(90)} onPress={this._confirm1}/>
                        </View>
                    </ModalContent>
                </Modal>
                <View style={{flex: 1, justifyContent: 'flex-end',}}>
                    <View style={{height: px2dp(96), backgroundColor: '#fff', justifyContent: 'center'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                            {/*<TouchableOpacity acitiveOapcity={0.8} onPress={this._associated}>*/}
                            {/*    <View style={{alignItems: 'center'}}>*/}
                            {/*        <Image source={Images.exclude} style={{width: px2dp(32), height: px2dp(32)}}/>*/}
                            {/*        <Text style={{*/}
                            {/*            marginTop: px2dp(5),*/}
                            {/*            fontFamily: "PingFangSC-Medium",*/}
                            {/*            fontSize: moderateScale(14),*/}
                            {/*            color: "#333"*/}
                            {/*        }}>关联</Text>*/}
                            {/*    </View>*/}
                            {/*</TouchableOpacity>*/}
                            <TouchableOpacity acitiveOapcity={0.8} onPress={this._editLinkPersonInfo}>
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
                            <TouchableOpacity activeOpacity={0.8} onPress={this._delete}>
                                <View style={{alignItems: 'center'}}>
                                    <Image source={Images.exclude} style={{width: px2dp(32), height: px2dp(32)}}/>
                                    <Text style={{
                                        marginTop: px2dp(5),
                                        fontFamily: "PingFangSC-Medium",
                                        fontSize: moderateScale(14),
                                        color: "#333"
                                    }}>删除</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} onPress={this._intentionShielding}>
                                <View style={{alignItems: 'center'}}>
                                    <Image source={Images.shielding} style={{width: px2dp(32), height: px2dp(32)}}/>
                                    <Text style={{
                                        marginTop: px2dp(5),
                                        fontFamily: "PingFangSC-Medium",
                                        fontSize: moderateScale(14),
                                        color: "#333"
                                    }}>拉黑</Text>
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
