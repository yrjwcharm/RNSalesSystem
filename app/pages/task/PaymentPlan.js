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
import Title from '../../components/Title1'
import Modal, {ModalContent} from "react-native-modals";
import {Textarea} from "native-base";
import SmallButton from "../../components/SmallButton";
import Loading from "../../components/Loading";
import {Input} from "teaset";
import {StringUtils} from "../../utils";

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
export default class PaymentPlan extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            customBackgroundModal: false,
            defaultAnimationModal: false,
            swipeableModal: false,
            scaleAnimationModal: false,
            slideAnimationModal: false,
            bottomModalAndTitle: false,
            bottomModal: false,
            paymentTypeList:[],
            visible:true,
            paymentType:'',
            paymentTypeId:'',
            shouldReceiveMoney:'',
            marketCost:'',
            backCondition:'',
            remark:''

        }
    }

    componentDidMount(): void {
      this._getPaymentType();
    }
    _getPaymentType=()=>{
        let url = Config.requestUrl + Config.paymentPlan.getPayType;
        fetch(url, {method: 'POST'}).then(res => {
            console.log(4444,res);
            return res.json()
        }).then(responseText => {
            console.log('1++', responseText);
            this.setState({visible:false},()=>{
                if(responseText.success){
                    let obj=eval(responseText.obj);
                    obj.map(item=>{
                        item.checked=false;
                    });
                    this.setState({paymentTypeList:obj});
                }
            });

        }).catch(error => {
            Toast.info(error)
        })
    }
    /*款型类型*/
    _confirm = () => {
        const {paymentTypeItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(paymentTypeItem).length === 0) {
            Toast.info('请选择款项类型');
            return;
        }
        this.setState({
            bottomModalAndTitle: false,
            paymentType: paymentTypeItem.value,
            paymentTypeId:paymentTypeItem.label,
        }, () => {
            // this.props.navigation.goBack();
        });

    }
    _cancel = () => {
        this.setState({
            bottomModalAndTitle: false,
            paymentTypeItem: {},
        }, () => {
            this._getPaymentType();
        });
    }
    _selectPaymentTypeItem= (item) => {
        this.state.paymentTypeList.map(item => {
            item.checked = false;
        });
        item.checked = true;
        this.setState({
            paymentTypeList: [
                ...this.state.paymentTypeList,
            ],
            paymentTypeItem: item,
        });
        console.log(444, this.state.paymentTypeList);
    }
    _save = () => {
//         款项主键：repalyId
//         合同主键：contractId（必填）
// 应收金额：backMoney
//         市场费用：marketCost
//         款型类型：moneyType
//         回款条件：backCondition
//         备注：remark
//         已付款：allPayMoney
//         核销金额：writeOffMoney
//         是否首付：isFirst  （1是 2否）
    }
    _showPaymentTypePicker = () => {
        this.setState({
            bottomModalAndTitle: true,
        });
    }
    _submit = () => {
        const {params}=this.props.navigation.state;
        const{shouldReceiveMoney,marketCost,paymentTypeId,backCondition,remark}=this.state;
        if(StringUtils.isEmpty(paymentTypeId)){
            Toast.info('请选择款项类型')
            return;
        }
        if(isNaN(shouldReceiveMoney)){
            Toast.info('请输入有效金额')
            return;
        }
        if(isNaN(marketCost)){
            Toast.info('请输入有效市场费用')
            return;
        }
        let url =Config.requestUrl+Config.paymentPlan.addPayment+`?contractId=${params.contractId}&backMoney=${shouldReceiveMoney}&marketCost=${marketCost}&moneyType=${paymentTypeId}&backCondition=${backCondition}&remark=${remark}`;
        console.log(333,url);
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            console.log(4444,responseText);
            if(responseText.success){
                Toast.message('提交成功');
                this.props.navigation.goBack();
            }
        }).catch(error=>{
            Toast.fail(error);
        })
    }

    // 渲染
    render() {
        const {paymentTypeList,paymentType,shouldReceiveMoney,marketCost,paymentTypeId,backCondition,remark}=this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                <Title title={'收款计划'} back onPressForward={() => this._save()}
                       onPressBack={() => this.props.navigation.goBack()} forwardLabelText={'保存'}/>
                <ListRow style={{
                    borderTopLeftRadius: px2dp(10),
                    borderTopRightRadius: px2dp(10),
                    backgroundColor: '#fff',
                    borderBottomWidth: px2dp(1),
                    borderBottomColor: '#E0E0E0',
                    marginTop: px2dp(26)
                }} keyboardType={'numeric'} title={'应收金额(元)'} value={shouldReceiveMoney} onChangeText={(shouldReceiveMoney)=>{
                    this.setState({shouldReceiveMoney});
                }}/>
                <ListRow keyboardType={'numeric'} style={{backgroundColor: '#fff', borderBottomWidth: px2dp(1), borderBottomColor: '#E0E0E0'}}
                      title={'市场费用(元)'} value={marketCost} onChangeText={(marketCost)=>{
                    this.setState({marketCost});
                }}/>
                <Menu arrow style={{
                    backgroundColor: '#fff',
                    borderBottomLeftRadius: px2dp(10),
                    borderBottomRightRadius: px2dp(10)
                }} title={'款项类型'} detail={paymentType} onPress={this._showPaymentTypePicker}/>
                <View style={{
                    marginTop: px2dp(26),
                    marginHorizontal: px2dp(26),
                    backgroundColor: '#fff',
                    borderRadius: px2dp(10)
                }}>
                    <Textarea rowSpan={5} placeholder="回款条件" style={{
                        paddingTop: px2dp(15),
                        paddingLeft: px2dp(30),
                        color: '#333',
                        fontSize: px2dp(28)
                    }} onChangeText={(backCondition)=>{
                        this.setState({backCondition});
                    }} value={backCondition}/>
                </View>
                <View style={{
                    marginTop: px2dp(26),
                    marginHorizontal: px2dp(26),
                    backgroundColor: '#fff',
                    borderRadius: px2dp(10)
                }}>
                    <Textarea rowSpan={5} placeholder="备注" style={{
                        paddingTop: px2dp(15),
                        paddingLeft: px2dp(30),
                        color: '#333',
                        fontSize: px2dp(28)
                    }} onChangeText={(remark)=>{
                        this.setState({remark});
                    }} value={remark}/>
                </View>
                <Modal.BottomModal
                    visible={this.state.bottomModalAndTitle}
                    onTouchOutside={() => this.setState({bottomModalAndTitle: false})}
                    height={0.35}
                    width={1}
                    onSwipeOut={() => this.setState({bottomModalAndTitle: false})}
                    modalTitle={
                        <ModalTitle
                            title="款项类型"
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
                        <ScrollView keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}>
                            {paymentTypeList && paymentTypeList.map(item => {
                                return (
                                    <TouchableOpacity onPress={() => this._selectPaymentTypeItem(item)}
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
        <View style={[{marginHorizontal: px2dp(26), height: px2dp(100), justifyContent: 'center'}, props.style]}>
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
                        <Image source={props.arrow ? Images.arrow : null}
                               style={{width: px2dp(32), height: px2dp(32)}}/>
                    </View>
            </View>
        </View>
        </TouchableOpacity>
    );
}
const ListRow = (props) => {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={props.onPress}>
        <View style={[{marginHorizontal: px2dp(26), height: px2dp(100), justifyContent: 'center'}, props.style]}>
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
                    <View style={{flexDirection: 'row', alignItems: 'center',flex:1}}>
                        <Input style={{
                            flex:1,
                            textAlign:'right',
                            fontFamily: "PingFangSC-Medium",
                            fontSize: moderateScale(14),
                            color: "#999",
                            borderWidth:0,
                            backgroundColor:'transparent',

                        }} keyboardType={props.keyboardType} value={props.value} onChangeText={props.onChangeText} placeholder={props.placeholder}/>
                    </View>
            </View>
        </View>
        </TouchableOpacity>
    );
}
