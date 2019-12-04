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
export default class IntentionShielding extends PureComponent {
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
            visible:true,
            applyFactorList:[],
            applyFactorId:'',
            applyFactor:'',
            applyFactorItem:'',
            userInfo:null,
        }
    }

    _selectExcludeFactor = () => {
        this.setState({
            bottomModalAndTitle: true,
        });

    }
    /*申请原因*/
    _confirm = () => {
        const {applyFactorItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(applyFactorItem).length === 0) {
            Toast.info('请选择客户标签');
            return;
        }
        this.setState({
            bottomModalAndTitle: false,
            applyFactor: applyFactorItem.itemValue,
            applyFactorId:applyFactorItem.dicId,
        });

    }
    _cancel = () => {
        this.setState({
            bottomModalAndTitle: false,
            applyFactorItem: {},
        }, () => {
            this._applyFactorList();
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
        console.log(444, this.state.applyFactorList);
    }
    componentDidMount(): void {
        store.get('userInfo').then(userInfo=>{
            this.setState({userInfo},()=>{
                this._applyFactorList();
            });
        })
    }
    _applyFactorList=()=>{
        let url = Config.requestUrl + Config.dataDictionary.customerLabelList + `?onlyMark=shanchuyuanyin`;
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


    _submit=()=>{
        //         意向主键：purposeId（必填）
        // 申请说明：remarks
        //         申请原因主键：applyResultId
        //         申请类型：applyType（申请拉黑10） （必填）
        // 申请人主键：applyUserId（必填）
        // 申请时间：applyTime
        const {params}=this.props.navigation.state;
        const {remark,applyFactorId,userInfo:{userId}}=this.state;
        this.setState({visible:true},()=>{
            let url=Config.requestUrl+Config.purposePullBlackPageInterface.purposePullBlack+`?applyUserId=${userId}&applyType=10&applyResultId=${applyFactorId}&purposeId=${params.intentionId}&remarks=${remark}&`;
            fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
                console.log(333,responseText);
                this.setState({visible:false},()=>{
                    if(responseText.success){
                        Toast.message(responseText.obj);
                        this.props.navigation.goBack();
                    }
                });

            }).catch(error=>{
                Toast.fail(error)
            });
        });

    }

    // 渲染
    render() {
        const {applyFactorList,applyFactor,}=this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                <Title title={'意向拉黑'} back onPressBack={() => this.props.navigation.goBack()}/>
                <Menu style={{borderRadius:px2dp(10),marginTop:px2dp(26)}} title={'申请原因'} detail={applyFactor} onPress={this._selectExcludeFactor}/>
                <View style={{marginTop:px2dp(26),marginHorizontal: px2dp(26),backgroundColor:'#fff',borderRadius:px2dp(10)}}>
                    <Textarea rowSpan={5}  placeholder="请输入申请说明" style={{paddingTop:px2dp(15),paddingLeft:px2dp(30),color:'#333',fontSize:px2dp(28)}} />
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
                            onCancel={this._cancel}
                            onConfirm={this._confirm}
                        />
                    }
                >
                    <ModalContent
                        style={{
                            flex: 1,
                            backgroundColor: 'fff',
                        }}
                    >
                        <ScrollView keyboardShouldPersistTaps={Platform.OS==='android'?'always':'never'}>
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
                <View style={{justifyContent:'flex-end',flex:1,bottom:px2dp(30),alignItems:'center'}}>
                    <SmallButton name={'提交'} onPress={this._submit}/>
                </View>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
const Menu = (props) => {
    return (
        <View style={[{marginHorizontal:px2dp(26),height: px2dp(100), justifyContent: 'center', backgroundColor: '#fff'},props.style]}>
            <View style={{flexDirection: 'row',paddingHorizontal:px2dp(30), alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{
                    fontFamily: "PingFangSC-Medium",
                    fontSize: moderateScale(14),
                    color: "#333"
                }}>{props.title}</Text>
                <TouchableOpacity activeOpacity={0.8} onPress={props.onPress}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{
                            fontFamily: "PingFangSC-Medium",
                            fontSize: moderateScale(14),
                            color: "#999"
                        }}>{props.detail}</Text>
                        <Image source={Images.arrow} style={{width: px2dp(32), height: px2dp(32)}}/>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
