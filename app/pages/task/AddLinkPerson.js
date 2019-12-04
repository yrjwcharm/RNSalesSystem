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
    Alert,
    ImageBackground,
    TouchableOpacity
} from 'react-native'
import Title from '../../components/Title'
import {StringUtils} from "../../utils";
import {Input} from "teaset";
import SmallButton from "../../components/SmallButton";
import Modal, {ModalContent} from "react-native-modals";
import Loading from "../../components/Loading";

export default class AddLinkPerson extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            phone1: '',
            personName: '',
            phone2: '',
            fixMobile: '',
            qq: '',
            wx: '',
            email: '',
            defaultAnimationModal: false,
            userInfo: null,
        }
    }

    componentDidMount(): void {
        store.get('userInfo').then(userInfo => {
            this.setState({userInfo});
        })
    }

    _addLinkPerson = () => {
        const {phone1, phone2, fixMobile, qq, wx, email, userInfo: {userId}, personName} = this.state;
        // 意向ID：purposeId
        // 手机1：telephone
        // 手机2：telephone2
        // 固话：phone
        // QQ：qq
        // 微信：weChat
        // 邮箱：email
        if(StringUtils.isEmpty(personName)){
            Toast.info("联系人姓名不能为空");
            return;
        }
        if (!StringUtils.isMobile(phone1)) {
            Toast.info("请输入正确手机号码");
            return;
        }
        const {params} = this.props.navigation.state;
        this.setState({visible: true}, () => {
            let url = Config.requestUrl + Config.addContactPageInterface.addContact + `?&userId=${userId}&purposeId=${params.intentionId}&telephone=${phone1}&telephone2=${phone2}&phone=${fixMobile}&qq=${qq}&weChat=${wx}&email=${email}&personName=${personName}`;
            console.log(333, url);
            fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
                this.setState({
                    visible: false
                }, () => {
                    if (responseText.code === '200') {
                        this.setState({defaultAnimationModal: true});
                    }
                });
                console.log(333, responseText);

            }).catch(error => {
                Toast.fail(error)
            })
        });

    }
    _confirm = () => {
        this.setState({defaultAnimationModal: false}, () => {
            DeviceEventEmitter.emit('update_customer_archives_contact', true)
            this.props.navigation.goBack();
        });
    }
    _cancel = () => {
        this.setState({
            defaultAnimationModal: false,
        });
    }

    // 渲染
    render() {
        const {phone1, phone2, fixMobile, qq, wx, email, personName} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                <Title title={'添加联系人'} back onPressBack={() => this.props.navigation.goBack()}/>
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
                        <DefaultInput required placeholder={'请输入'} title={'联系人姓名'} value={personName} noBorder
                                      onChangeText={(personName) => {
                                          this.setState({personName});
                                      }}/>
                        <DefaultInput required keyboardType={'numeric'} placeholder={'请输入联系电话'} title={'手机1'} value={phone1}
                                      noBorder onChangeText={(phone1) => {
                            this.setState({phone1});
                        }}/>
                        <DefaultInput keyboardType={'numeric'} placeholder={'请输入联系电话'} title={'手机2'} value={phone2}
                                      noBorder onChangeText={(phone2) => {
                            this.setState({phone2});
                        }}/>
                        <DefaultInput keyboardType={'numeric'} title={'固话'} placeholder={'请输入固定电话'} value={fixMobile}
                                      noBorder onChangeText={(fixMobile) => {
                            this.setState({fixMobile});
                        }}/>
                        <DefaultInput keyboardType={'numeric'} placeholder={'QQ'} title={'请输入QQ号'} value={qq} noBorder
                                      onChangeText={(qq) => {
                                          this.setState({qq});
                                      }}/>
                        <NewInput onPress={() => {
                            this.setState({wx: phone1});
                        }} keyboardType={'numeric'} pressText={'同手机号'} placeholder={'微信'} title={'请输入微信号'} value={wx}
                                  noBorder onChangeText={(wx) => {
                            this.setState({wx});
                        }}/>
                        <DefaultInput placeholder={'邮箱'} title={'请输入邮箱'} value={email} noBorder
                                      onChangeText={(email) => {
                                          this.setState({email});
                                      }}/>
                    </View>
                    <Modal
                        width={0.65}
                        visible={this.state.defaultAnimationModal}
                        rounded
                        actionsBordered
                        onTouchOutside={() => {
                            this.setState({defaultAnimationModal: false});
                        }}
                        modalTitle={
                            <TouchableOpacity activeOpacity={0.8} onPress={this._cancel}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    paddingTop: px2dp(12),
                                    paddingRight: px2dp(12)
                                }}>
                                    <Image source={Images.exclude} style={{width: px2dp(32), height: px2dp(32)}}/>
                                </View>
                            </TouchableOpacity>
                        }
                    >
                        <ModalContent
                            style={{backgroundColor: '#fff'}}
                        >
                            <View style={{alignItems: 'center'}}>
                                <Image source={Images.success} resizeMode={'contain'}
                                       style={{width: px2dp(48), height: px2dp(48)}}/>
                                <Text style={{
                                    textAlign: 'center',
                                    marginTop: px2dp(20),
                                    marginLeft: moderateScale(22), fontFamily: "PingFangSC-Medium",
                                    fontSize: moderateScale(15),
                                    color: "#666"
                                }}>联系人已添加</Text>
                                <Text style={{
                                    marginTop: px2dp(20),
                                    marginLeft: moderateScale(22), fontFamily: "PingFangSC-Medium",
                                    fontSize: moderateScale(14),
                                    color: "#999"
                                }}>新联系人已添加，请查看。</Text>
                                <SmallButton name={'确认'} width={px2dp(420)} height={px2dp(90)} onPress={this._confirm}/>
                            </View>
                        </ModalContent>
                    </Modal>
                    <View style={{justifyContent: 'flex-end', flex: 1, bottom: px2dp(30), alignItems: 'center'}}>
                        <SmallButton name={'保存'} onPress={this._addLinkPerson}/>
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
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{
                    marginLeft: moderateScale(22), fontFamily: "PingFangSC-Medium",
                    fontSize: moderateScale(14),
                    color: "#333"
                }}>{props.title}</Text>
                <Input keyboardType={props.keyboardType} style={{
                    borderWidth: 0,
                    flex: 1,
                    paddingLeft: px2dp(40),
                    height: verticalScale(40),
                    marginRight: moderateScale(10),
                    fontSize: moderateScale(14),
                }} onChangeText={props.onChangeText}
                       value={props.value} placeholder={props.placeholder} editable={props.editable}/>
            </View>
        </View>
    );
}
const NewInput = (props) => {
    return (
        <View style={{
            height: verticalScale(40),
            justifyContent: 'center',
            backgroundColor: 'transparent',
            borderBottomWidth: props.noBorder ? 0 : StyleSheet.hairlineWidth,
            borderBottomColor: '#e0e0e0'
        }}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{
                    marginLeft: moderateScale(22), fontFamily: "PingFangSC-Medium",
                    fontSize: moderateScale(14),
                    color: "#333"
                }}>{props.title}</Text>
                <Input keyboardType={props.keyboardType} style={{
                    borderWidth: 0,
                    flex: 1,
                    paddingLeft: px2dp(40),
                    height: verticalScale(40),
                    marginRight: moderateScale(10),
                    fontSize: moderateScale(14),
                }} onChangeText={props.onChangeText}
                       value={props.value} placeholder={props.placeholder} editable={props.editable}/>
                <TouchableOpacity onPress={props.onPress} activeOpacity={0.8}>
                    <View style={{
                        marginRight: moderateScale(15),
                        borderRadius: px2dp(3),
                        borderWidth: scale(1 / 2),
                        borderColor: '#2e93ff',
                        backgroundColor: '#EFF8FE'
                    }}>
                        <Text style={{
                            fontFamily: "PingFang-SC-Medium",
                            fontSize: moderateScale(14),
                            width: px2dp(120),
                            paddingHorizontal: px2dp(6), paddingVertical: px2dp(4), color: '#2e93ff'
                        }}>
                            {props.pressText}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const DefaultInput1 = (props) => {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={props.onPress}>
            <View style={{
                height: verticalScale(40),
                justifyContent: 'center',
                backgroundColor: 'transparent',
                borderBottomWidth: props.noBorder ? 0 : StyleSheet.hairlineWidth,
                borderBottomColor: '#e0e0e0'
            }}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Text style={{
                        marginLeft: moderateScale(22), fontFamily: "PingFangSC-Medium",
                        fontSize: moderateScale(14),
                        color: "#333"
                    }}>{props.required?<Text style={{color:'red'}}>*</Text>:''} {props.title}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: px2dp(20)}}>
                        <Input style={{
                            borderWidth: 0,
                            flex: 1,
                            paddingLeft: px2dp(40),
                            height: verticalScale(40),
                            fontSize: moderateScale(14),
                        }} onChangeText={props.onChangeText}
                               value={props.value} editable={props.editable} keyboardType={props.keyboardType}
                               placeholder={props.placeholder}/>
                        <Image source={Images.arrow} resizeMode={'contain'}
                               style={{width: px2dp(32), height: px2dp(32)}}/>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
