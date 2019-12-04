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
import SmallButton from "../../components/SmallButton";
import Modal, {ModalButton, ModalContent, ModalFooter,} from "react-native-modals";
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
            scaleAnimationModal: false,
            slideAnimationModal: false,
            bottomModalAndTitle: false,
            bottomModal: false,
            visible:true,
            userInfo:null,
        }
    }
    componentDidMount(): void {
        store.get('userInfo').then(userInfo => {
            this.setState({userInfo},()=>{
                this._querySingleLinkDetail();
            });
        })

    }
    _querySingleLinkDetail=()=>{
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

    _save=()=>{

        const {params}=this.props.navigation.state;
        const {phone,phone1,wx,qq,email,linkName,userInfo:{userId}}=this.state;
        this.setState({visible:true},()=>{
            let url=Config.requestUrl+Config.contactDetailPageInterface.editLinker+`?userId=${userId}&purposeId=${params.purposeId}&linkerId=${params.id}&telephone=${phone}&telephone2=${phone1}&qq=${qq}&weChat=${wx}&email=${email}&personName=${linkName}`;
            console.log(666,url);
            fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
                console.log(444,responseText);
                this.setState({visible:false},()=>{
                    if(responseText.success){
                        this.setState({
                            defaultAnimationModal: true,
                        });
                    }
                });

            }).catch(error=>{
                Toast.fail(error)
            })
        });

    }
    _confirm=()=>{
       this.setState({defaultAnimationModal: false},()=>{
           DeviceEventEmitter.emit('update_link_detail',true);
           DeviceEventEmitter.emit('update_customer_archives_contact',true)
           this.props.navigation.goBack();
       });
    }
    _cancel=()=>{
        this.setState({
            defaultAnimationModal: false,
        });
    }
    // 渲染
    render() {
        const {qq,wx,email,sexName,phone1,linkName,phone2,fixMobile} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                <Title title={'编辑'} back onPressBack={() => this.props.navigation.goBack()}/>
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
                            <Input style={{
                                borderWidth:0,
                                marginLeft: px2dp(20),
                                color:"#333333",
                                height: px2dp(80),
                                fontFamily:"PingFang-SC-Medium",
                                fontSize: moderateScale(14),
                            }} value={linkName} placeholder={'联系人姓名'} onChangeText={(linkName)=>{
                                this.setState({linkName});
                            }} />
                            <Text style={{
                                marginLeft: px2dp(15),
                                fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(14),
                                color: "#999"
                            }}>{sexName}</Text>
                        </View>
                        <DefaultInput  keyboardType={'numeric'} onChangeText={(phone1)=>{
                            this.setState({phone1});
                        }} title={'手机'} value={phone1} noBorder/>
                        {/*<DefaultInput title={'手机2'} value={phone2} noBorder/>*/}
                        <DefaultInput  keyboardType={'numeric'} onChangeText={(fixMobile)=>{
                            this.setState({fixMobile});
                        }} title={'固话'} value={fixMobile} noBorder/>
                        <DefaultInput onChangeText={(qq)=>{
                            this.setState({qq});
                        }}  keyboardType={'numeric'} title={'QQ'} value={qq} noBorder/>
                        <NewInput onPress={()=>{
                            this.setState({wx:phone1});
                        }} keyboardType={'numeric'} pressText={'同手机号'} placeholder={'微信'} title={'请输入微信号'}  value={wx} noBorder onChangeText={(wx)=>{
                            this.setState({wx});
                        }}/>
                        <DefaultInput onChangeText={(email)=>{
                            this.setState({email});
                        }} title={'邮箱'} value={email} noBorder/>
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
                            <Image source={Images.success} resizeMode={'contain'} style={{width:px2dp(48),height:px2dp(48)}}/>
                            <Text style={{
                                textAlign:'center',
                                marginTop:px2dp(20),
                                marginLeft: moderateScale(22), fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(15),
                                color: "#666"
                            }}>内容已保存</Text>
                            <Text style={{
                                marginTop:px2dp(20),
                                marginLeft: moderateScale(22), fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(14),
                                color: "#999"
                            }}>页面内容已更新，请查看。</Text>
                          <SmallButton name={'确认'} width={px2dp(420)} height={px2dp(90)} onPress={this._confirm}/>
                      </View>
                    </ModalContent>
                </Modal>
                <View style={{justifyContent:'flex-end',flex:1,bottom:px2dp(30),alignItems:'center'}}>
                    <SmallButton name={'保存'} onPress={this._save}/>
                </View>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
const DefaultInput=(props)=>{
    return(
        <View style={{height:verticalScale(40),justifyContent:'center',backgroundColor: 'transparent',borderBottomWidth:props.noBorder?0:StyleSheet.hairlineWidth,borderBottomColor:'#e0e0e0'}}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Text style={{marginLeft:moderateScale(22),fontFamily: "PingFangSC-Medium",
                    fontSize: moderateScale(14),
                    color: "#333"}}>{props.title}</Text>
                <Input keyboardType={props.keyboardType} style={{borderWidth:0,flex:1,paddingLeft:px2dp(40),height:verticalScale(40),marginRight:moderateScale(10),fontSize:moderateScale(14),}}  onChangeText={props.onChangeText}
                       value={props.value} placeholder={props.placeholder} editable={props.editable}/>
            </View>
        </View>
    );
}
const NewInput=(props)=>{
    return(
        <View style={{height:verticalScale(40),justifyContent:'center',backgroundColor: 'transparent',borderBottomWidth:props.noBorder?0:StyleSheet.hairlineWidth,borderBottomColor:'#e0e0e0'}}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Text style={{marginLeft:moderateScale(22),fontFamily: "PingFangSC-Medium",
                    fontSize: moderateScale(14),
                    color: "#333"}}>{props.title}</Text>
                <Input keyboardType={props.keyboardType} style={{borderWidth:0,flex:1,paddingLeft:px2dp(40),height:verticalScale(40),marginRight:moderateScale(10),fontSize:moderateScale(14),}}  onChangeText={props.onChangeText}
                       value={props.value} placeholder={props.placeholder} editable={props.editable}/>
                <TouchableOpacity onPress={props.onPress} activeOpacity={0.8}>
                    <View style={{marginRight:moderateScale(15),borderRadius:px2dp(3),borderWidth:scale(1/2),borderColor:'#2e93ff',backgroundColor:'#EFF8FE'}}>
                        <Text style={{fontFamily: "PingFang-SC-Medium",
                            fontSize: moderateScale(14),
                            width:px2dp(120),
                            paddingHorizontal:px2dp(6),paddingVertical:px2dp(4),color:'#2e93ff'}}>
                            {props.pressText}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
