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
import {Textarea} from 'native-base'
import Title from '../../components/Title';
import Modal, {
    ModalContent,
    ModalFooter,
    ModalButton,
    SlideAnimation,
    ScaleAnimation,
} from 'react-native-modals';
import SmallButton from "../../components/SmallButton";
import Loading from "../../components/Loading";

const ModalTitle = (props) => {
    return (
        <View style={[{height: px2dp(90), justifyContent: 'center'}, props.style]}>
            <View style={{
                marginHorizontal: px2dp(26),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <TouchableOpacity activeOpacity={0.8} onPress={props.onCancel}>
                    <View style={{height: px2dp(90), justifyContent: 'center'}}>
                        <Text style={{
                            fontFamily: "PingFangSC-Medium",
                            fontSize: moderateScale(14),
                            color: "#2e93ff",
                        }}>取消</Text>
                    </View>
                </TouchableOpacity>
                <View style={{height: px2dp(90), justifyContent: 'center'}}>
                    <Text style={{
                        fontFamily: "PingFangSC-Medium",
                        fontSize: moderateScale(14),
                        color: "#333",
                        fontWeight: 'bold'
                    }}>{props.title}</Text>
                </View>
                <TouchableOpacity activeOpacity={0.8} onPress={props.onConfirm}>
                    <View style={{height: px2dp(90), justifyContent: 'center'}}>
                        <Text style={{
                            fontFamily: "PingFangSC-Medium",
                            fontSize: moderateScale(14),
                            color: "#2e93ff"
                        }}>确定</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default class Exclude extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            customBackgroundModal: false,
            defaultAnimationModal: false,
            scaleAnimationModal: false,
            slideAnimationModal: false,
            bottomModalAndTitle: false,
            bottomModal: false,
            remarks: '',
            applyTypeList: [{label: 1, value: '申请删除', checked: false}, {
                label: 2,
                value: '申请排除',
                checked: false
            }, {label: 3, value: '申请长期', checked: false}, {label: 4, value: '申请已签', checked: false}],
            applyTypeItem: {},
            applyType: '申请类型',
            applyTypeId: '',
            applyTime:'',
            applyFactor: '申请原因',
            visible: true,
            applyFactorList: [],
            applyFactorItem: {},
            applyResultId: '',
            userInfo:null,
        }
    }

    componentDidMount(): void {
        store.get('userInfo').then(userInfo=>{
            this.setState({userInfo},()=>{
                this._getApplyFactorList();
            });
        })

    }

    _getApplyFactorList = () => {
        let url = Config.requestUrl + Config.dataDictionary.customerLabelList + `?onlyMark=paichuyuanyin`;
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            console.log(555, responseText);
            this.setState({visible: false}, () => {
                if (responseText.success) {
                    const obj = eval(responseText.obj);
                    obj.map(item => {
                        item.checked = false;
                    });
                    this.setState({applyFactorList: obj});
                }
            });
        }).catch(error => {
            Toast.fail(error)
        })
    }
    //系统类型
    _confirm1 = () => {
        const {applyTypeItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(applyTypeItem).length === 0) {
            Toast.info('请选择申请类型');
            return;
        }
        this.setState({
            bottomModalAndTitle1: false,
            applyType: applyTypeItem.value,
            applyTypeId: applyTypeItem.label
        });

    }
    _cancel1 = () => {
        this.setState({
            bottomModalAndTitle1: false,
            applyTypeItem: {}
        }, () => {
            this.setState({
                applyTypeList: [{label: 1, value: '申请删除', checked: false}, {
                    label: 2,
                    value: '申请排除',
                    checked: false
                }, {label: 3, value: '申请长期', checked: false}, {label: 4, value: '申请已签', checked: false}],
            });
        });
    }
    _confirm = () => {
        const {applyFactorItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(applyFactorItem).length === 0) {
            Toast.info('请选择申请类型');
            return;
        }
        this.setState({
            bottomModalAndTitle: false,
            applyFactor: applyFactorItem.itemValue,
            applyResultId: applyFactorItem.dicId
        });
    }
    _cancel = () => {
        this.setState({
            bottomModalAndTitle: false,
            applyFactorItem: {}
        }, () => {
            this._getApplyFactorList();
        });
    }
    _selectApplyFactorItem = (item) => {
        this.state.applyFactorList.map(item => {
            item.checked = false;
        });
        item.checked = true;
        this.setState({
            applyFactorList: [
                ...this.state.applyFactorList,
            ],
            applyFactorItem: item,
        });
        console.log(666, this.state.applyFactorList);
    }
    _selectApplyTypeItem = (item) => {
        this.state.applyTypeList.map(item => {
            item.checked = false;
        });
        item.checked = true;
        this.setState({
            applyTypeList: [
                ...this.state.applyTypeList,
            ],
            applyTypeItem: item,
        });
        console.log(666, this.state.applyTypeList);
    }
    _selectExcludeFactor = () => {
        this.setState({
            bottomModalAndTitle: true,
        });

    }
    _selectApplyTypeList = () => {
        this.setState({
            bottomModalAndTitle1: true,
        });
    }
    _submit = () => {
        const {params}=this.props.navigation.state;
        const {applyFactorItem,applyTypeItem,remarks,applyResultId,applyType,applyTypeId,userInfo:{userId:applyUserId},applyTime}=this.state;
        if(Object.keys(applyFactorItem).length===0){
            Toast.info('请选择申请原因')
            return;
        }
        if(Object.keys(applyTypeItem).length===0){
            Toast.info('请选择申请类型')
            return;
        }
        this.setState({visible:true},()=>{
            let url=Config.requestUrl+Config.salesExcludePageInterface.salesExclude+`?contractId=${params.contractId}&purposeId=${params.purposeId}&remarks=${remarks}&applyResultId=${applyResultId}&applyType=${applyTypeId}&applyUserId=${applyUserId}&applyTime=${applyTime}`;
            console.log(333,url);
            fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
                this.setState({visible:false},()=>{
                    console.log(333,responseText);
                    if(responseText.success){
                        Toast.message(responseText.msg);
                        this.props.navigation.goBack();
                    }
                });
            }).catch(error=>{Toast.fail(error)})
        });
    }

    // 渲染
    render() {
        const {applyFactorList, applyTypeList, applyType, applyFactor} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                <Title title={'排除'} back onPressBack={() => this.props.navigation.goBack()}/>
                <Menu style={{borderRadius: px2dp(10), marginTop: px2dp(26)}} title={'申请原因'} detail={applyFactor}
                      onPress={this._selectExcludeFactor}/>
                <Menu onPress={
                    this._selectApplyTypeList
                } style={{borderRadius: px2dp(10), marginTop: px2dp(26)}} title={'申请类型'} detail={applyType}/>
                <View style={{
                    marginTop: px2dp(26),
                    marginHorizontal: px2dp(26),
                    backgroundColor: '#fff',
                    borderRadius: px2dp(10)
                }}>
                    <Textarea rowSpan={5} placeholder="请输入申请说明" onChangeText={(remarks) => {
                        this.setState({remarks});
                    }} style={{paddingTop: px2dp(15), paddingLeft: px2dp(30), color: '#333', fontSize: px2dp(28)}}/>
                </View>
                <Modal.BottomModal
                    visible={this.state.bottomModalAndTitle}
                    onTouchOutside={() => this.setState({bottomModalAndTitle: false})}
                    height={0.5}
                    width={1}
                    onSwipeOut={() => this.setState({bottomModalAndTitle: false})}
                    modalTitle={
                        <ModalTitle
                            title="申请原因"
                            onConfirm={this._confirm}
                            onCancel={this._cancel}
                        />
                    }
                >
                    <ModalContent
                        style={{
                            flex: 1,
                            backgroundColor: 'fff',
                        }}
                    >
                        <ScrollView keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}>
                            {applyFactorList && applyFactorList.map(item => {
                                return (
                                    <TouchableOpacity onPress={() => this._selectApplyFactorItem(item)}
                                                      activeOpacity={0.8}>
                                        <View style={{
                                            backgroundColor: item.checked ? '#2e93ff' : '#fff',
                                            height: px2dp(80),
                                            justifyContent: 'center',
                                            borderBottomColor: '#e0e0e0',
                                            borderBottomWidth: StyleSheet.hairlineWidth
                                        }}>
                                            <View style={{alignItems: 'center',}}>
                                                <Text style={{
                                                    fontFamily: "PingFangSC-Medium",
                                                    fontSize: moderateScale(14),
                                                    color: item.checked ? "#fff" : '#999'
                                                }}>
                                                    {item.itemValue}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })
                            }
                        </ScrollView>
                    </ModalContent>
                </Modal.BottomModal>
                {/*申请类型*/}
                <Modal.BottomModal
                    visible={this.state.bottomModalAndTitle1}
                    onTouchOutside={() => this.setState({bottomModalAndTitle1: false})}
                    height={0.5}
                    width={1}
                    onSwipeOut={() => this.setState({bottomModalAndTitle1: false})}
                    modalTitle={
                        <ModalTitle
                            title="申请类型"
                            onConfirm={this._confirm1}
                            onCancel={this._cancel1}
                        />
                    }
                >
                    <ModalContent
                        style={{
                            flex: 1,
                            backgroundColor: 'fff',
                        }}
                    >
                        <ScrollView keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}>
                            {applyTypeList && applyTypeList.map(item => {
                                return (
                                    <TouchableOpacity onPress={() => this._selectApplyTypeItem(item)}
                                                      activeOpacity={0.8}>
                                        <View style={{
                                            backgroundColor: item.checked ? '#2e93ff' : '#fff',
                                            height: px2dp(80),
                                            justifyContent: 'center',
                                            borderBottomColor: '#e0e0e0',
                                            borderBottomWidth: StyleSheet.hairlineWidth
                                        }}>
                                            <View style={{alignItems: 'center',}}>
                                                <Text style={{
                                                    fontFamily: "PingFangSC-Medium",
                                                    fontSize: moderateScale(14),
                                                    color: item.checked ? "#fff" : '#999'
                                                }}>
                                                    {item.value}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })
                            }
                        </ScrollView>
                    </ModalContent>
                </Modal.BottomModal>
                <View style={{justifyContent: 'flex-end', flex: 1, bottom: px2dp(30), alignItems: 'center'}}>
                    <SmallButton name={'提交'} onPress={this._submit}/>
                </View>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
const Menu = (props) => {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={props.onPress}>
            <View style={[{
                marginHorizontal: px2dp(26),
                height: px2dp(100),
                justifyContent: 'center',
                backgroundColor: '#fff'
            }, props.style]}>
                <View style={{
                    flexDirection: 'row',
                    paddingHorizontal: px2dp(30),
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Text style={{
                        fontFamily: "PingFangSC-Medium",
                        fontSize: moderateScale(14),
                        color: "#333"
                    }}>{props.title}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{
                            fontFamily: "PingFangSC-Medium",
                            fontSize: moderateScale(14),
                            color: "#999"
                        }}>{props.detail}</Text>
                        <Image source={Images.arrow} style={{width: px2dp(32), height: px2dp(32)}}/>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
