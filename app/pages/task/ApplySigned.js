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
import SmallButton from "../../components/SmallButton";
import Modal, {ModalContent} from "react-native-modals";
import Loading from "../../components/Loading";
import {Input} from 'teaset'
import {StringUtils} from "../../utils";
import Select from "teaset/components/Select/Select";

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
export default class ApplySigned extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            customBackgroundModal: false,
            defaultAnimationModal: false,
            bottomModalAndTitle1: false,
            bottomModalAndTitle2: false,
            scaleAnimationModal: false,
            slideAnimationModal: false,
            bottomModalAndTitle: false,
            bottomModal: false,
            sysTypeList: [],
            sysTypeItem: {},
            company: '',
            systemRequirementsName:'',
            totalMoney: '',
            systemSortId: '',
            contractType: '',
            contractTypeList: [],
            contractTypeItem: {},
            contractTypeId: '',
            visible:true,
            contractNum:'自动生成',
            existOrNoContractId:null,
            existOrNoAskForInvoiceId:null

        }
        this.existOrNoContractList=[{text:'有',value:1},{text:'无',value:2}]
            this.existOrNoAskForInvoiceList=[{text:'有',value:1},{text:'无',value:2}]
    }

    componentDidMount(): void {
        this._getSysType();
    }
    _getContractType = () => {
        // 合同类型主键：contractTypeId
        // 销售机会主键：contractId
        let url = Config.requestUrl + Config.dataDictionary.customerLabelList + `?onlyMark=hetongleixing`;
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            console.log(333, responseText);
            this.setState({visible:false},()=>{
                if (responseText.code === '200') {
                    let obj = JSON.parse(responseText.obj);
                    obj.map(item => {
                        item.checked = false;
                    })
                    this.setState({contractTypeList: obj});
                }
            });

        }).catch(error => {
            Toast.fail(error)
        })
    }

    _save = (isNext) => {
        // 销售机会主键：contractId
        // 签约主体;signSubject
        // 有无合同：isHaveContractId
        // 有无索要发票：isHaveInvoice
        // 系统类型主键集合：systemIds
        // 销售机会编号：changeNumber
        // 合同总金额：conMoney
        // 合同类型主键;contractTypeId
        const {existOrNoContractId,totalMoney, contractNum,existOrNoAskForInvoiceId,company,systemSortId,contractTypeId}=this.state;
        const {params}=this.props.navigation.state;
        if(StringUtils.isEmpty(company)){
            Toast.info('签约主体不能为空')
            return;
        }
        if(StringUtils.isEmpty(systemSortId)){
            Toast.info('请选择系统类型')
            return;
        }
        if(StringUtils.isEmpty(totalMoney)){
            Toast.info('合同总金额不能为空')
            return;
        }
        if(isNaN(totalMoney)){
            Toast.info('请输入有效合同金额')
            return;
        }
        if(StringUtils.isEmpty(contractTypeId)){
            Toast.info('请选择合同类型')
            return;
        }
        this.setState({visible:true},()=>{
            let url=Config.requestUrl+Config.applySignPageInterface.save+`?contractId=${params.intentionId}&signSubject=${company}&isHaveContractId=${existOrNoContractId}&isHaveInvoice=${existOrNoAskForInvoiceId}&systemIds=${systemSortId}&changeNumber=${contractNum}&conMoney=${totalMoney}&contractTypeId=${contractTypeId}`;
            console.log("3333",url);
            fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
                this.setState({visible:false},()=>{
                    if(responseText.code==='200'){
                        if(isNext){

                            this.props.navigation.navigate('PaymentPlan',{purposeId:params.intentionId,contractId:params.contractId});
                        }else{
                            Toast.message('保存成功');

                        }

                    }
                });
                console.log("baocuo",responseText);
            }).catch(error=>{
                Toast.fail(error)
            });
        });


    }
    /*自动生成合同编号*/
    _autoGenerateContractNum = (contractTypeItem) => {
        const {params} = this.props.navigation.state;
        let url = Config.requestUrl + Config.applySignPageInterface.autoGenerateContractNum + `?contractTypeId=${contractTypeItem.dicId}&contractId=${params.intentionId}`;
           fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
               if(responseText.code==='200'){
                   this.setState({contractNum:responseText.obj});
               }
           }) .catch(error=>{
               Toast.fail(error)
           })

    }
    _getSysType = () => {
        let url = Config.requestUrl + Config.addSalesChancePageInterface.sysType;
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            if (responseText.code === '200') {
                let obj = eval(responseText.obj);
                obj.map(item => {
                    item.checked = false;
                })
                this.setState({sysTypeList: obj});
                console.log("tag22", obj);
            }
            this._getContractType();
        }).catch(error => {
            Toast.fail(error)
        })
    }
    //系统分类
    _confirm1 = () => {
        const {sysTypeItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(sysTypeItem).length === 0) {
            Toast.info('请选择系统分类');
            return;
        }
        this.setState({
            bottomModalAndTitle1: false,
            systemRequirementsName: sysTypeItem.typeName,
            systemSortId:sysTypeItem.proTypeId
        },);


    }
    _cancel1 = () => {
        this.setState({
            bottomModalAndTitle1: false,
            sysTypeItem: {}
        }, () => {
            this._getSysType();
        });
    }
    _selectSysType = (item) => {
        this.state.sysTypeList.map(item => {
            item.checked = false;
        });
        item.checked = true;
        this.setState({
            sysTypeList: [
                ...this.state.sysTypeList,
            ],
            sysTypeItem: item,
        });
        console.log(666, this.state.sysTypeList);
    }
    //合同类型
    _confirm2 = () => {
        const {contractTypeItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(contractTypeItem).length === 0) {
            Toast.info('请选择合同类型');
            return;
        }
        this.setState({
            bottomModalAndTitle2:false,
            contractType: contractTypeItem.descp,
            contractTypeId: contractTypeItem.dicId
        }, () => {
            this._autoGenerateContractNum(contractTypeItem);
        });

    }
    _cancel2 = () => {
        this.setState({
            bottomModalAndTitle2: false,
            contractTypeItem: {}
        }, () => {
            this._getContractType()
        });
    }
    _selectContractType = (item) => {
        this.state.contractTypeList.map(item => {
            item.checked = false;
        });
        item.checked = true;
        this.setState({
            contractTypeList: [
                ...this.state.contractTypeList,
            ],
            contractTypeItem: item,
        });
        console.log(666, this.state.contractTypeList);
    }
    _showSysTypePicker = () => {
        this.setState({
            bottomModalAndTitle1: true,
        });
    }
    // 渲染
    render() {
        const {existOrNoContractId,
            existOrNoAskForInvoiceId,systemRequirementsName,contractTypeList,totalMoney,contractNum, contractType, sysType, company, sysTypeList, existOrNoContract, existOrNoAskForInvoice} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                <Title title={'申请已签'} back onPressBack={() => this.props.navigation.goBack()} forwardLabelText={'保存'}
                       forward onPressForward={()=>this._save(false)}/>
                <View style={{
                    marginTop: px2dp(20),
                    borderRadius: px2dp(10),
                    paddingLeft: px2dp(26),
                    paddingTop: px2dp(18),
                    paddingBottom: px2dp(22),
                    marginHorizontal: px2dp(26),
                    backgroundColor: '#fff'
                }}>
                    <Text style={{
                        fontFamily: "PingFangSC-Medium",
                        fontSize: moderateScale(14),
                        color: "#333"
                    }}>
                       <Text style={{color:'red'}}>*</Text> 签约主体
                    </Text>
                    <Input style={{
                        height: px2dp(90),
                        marginTop: px2dp(20),
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                        fontFamily: "PingFangSC-Medium",
                        fontSize: moderateScale(14),
                        color: "#999"
                    }} value={company} onChangeText={(company) => {
                        this.setState({company});
                    }} placeholder={'请输入'}/>
                </View>
                <ListRow style={{
                    borderTopLeftRadius: px2dp(10),
                    borderTopRightRadius: px2dp(10),
                    backgroundColor: '#fff',
                    borderBottomWidth: px2dp(1),
                    borderBottomColor: '#E0E0E0',
                    marginTop: px2dp(26)
                }} required value={existOrNoContractId} title={'有无合同'}  onSelected={(item)=>{
                    this.setState({existOrNoContractId:item.value});
                }} items={this.existOrNoContractList}/>
                <ListRow value={existOrNoAskForInvoiceId} items={this.existOrNoAskForInvoiceList}  onSelected={(item)=>{
                    this.setState({existOrNoAskForInvoiceId:item.value});
                }} required style={{backgroundColor: '#fff', borderBottomWidth: px2dp(1), borderBottomColor: '#E0E0E0'}}
                      title={'索要发票'} />
                <Menu required arrow style={{backgroundColor: '#fff'}} title={'系统类型'} detail={systemRequirementsName}
                      onPress={this._showSysTypePicker}/>
                <Menu1 onChangeText={(totalMoney) => {
                    this.setState({totalMoney});
                }} keyboardType={'numeric'} placeholder={'请输入合同总金额'} style={{
                    borderTopLeftRadius: px2dp(10),
                    borderTopRightRadius: px2dp(10),
                    backgroundColor: '#fff',
                    borderBottomWidth: px2dp(1),
                    borderBottomColor: '#E0E0E0',
                    marginTop: px2dp(26)
                }} title={'合同总金额(元)'} detail={totalMoney}/>
                <Menu  required style={{backgroundColor: '#fff', borderBottomWidth: px2dp(1), borderBottomColor: '#E0E0E0',}}
                      title={'合同编号'} detail={contractNum}/>
                <Menu  required onPress={() => {
                    this.setState({bottomModalAndTitle2: true});
                }} arrow style={{backgroundColor: '#fff'}} title={'合同类型'} detail={contractType}/>
                {/*系统类型*/}
                <Modal.BottomModal
                    visible={this.state.bottomModalAndTitle1}
                    onTouchOutside={() => this.setState({bottomModalAndTitle1: false})}
                    height={0.5}
                    width={1}
                    onSwipeOut={() => this.setState({bottomModalAndTitle1: false})}
                    modalTitle={
                        <ModalTitle
                            title="系统类型"
                            onCancel={this._cancel1}
                            onConfirm={this._confirm1}
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
                            {sysTypeList && sysTypeList.map(item => {
                                return (
                                    <TouchableOpacity onPress={() => this._selectSysType(item)} activeOpacity={0.8}>
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
                                                    {item.typeName}
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
                {/*合同类型*/}
                <Modal.BottomModal
                    visible={this.state.bottomModalAndTitle2}
                    onTouchOutside={() => this.setState({bottomModalAndTitle2: false})}
                    height={0.5}
                    width={1}
                    onSwipeOut={() => this.setState({bottomModalAndTitle2: false})}
                    modalTitle={
                        <ModalTitle
                            title="合同类型"
                            onCancel={this._cancel2}
                            onConfirm={this._confirm2}
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
                            {contractTypeList && contractTypeList.map(item => {
                                return (
                                    <TouchableOpacity onPress={() => this._selectContractType(item)}
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
                                                    {item.descp}
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
                    <SmallButton name={'下一步'} onPress={()=>this._save(true)}/>
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
const Menu1 = (props) => {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={props.onPress}>
        <View style={[{marginHorizontal: px2dp(26), height: px2dp(100), justifyContent: 'center'}, props.style]}>
            <View style={{
                flexDirection: 'row',
                paddingLeft: px2dp(30),
                paddingRight: px2dp(10),
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Text style={{
                    fontFamily: "PingFangSC-Medium",
                    fontSize: moderateScale(14),
                    color: "#333"
                }}>{props.required?<Text style={{color:'red'}}>*</Text>:''} {props.title}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                    <Input style={{
                        height: px2dp(90),
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                        flex: 1,
                        textAlign: 'right',
                        fontFamily: "PingFangSC-Medium",
                        fontSize: moderateScale(14),
                        color: "#999"
                    }}  keyboardType={props.keyboardType} value={props.detail} onChangeText={props.onChangeText} placeholder={props.placeholder}/>
                    <Image source={props.arrow ? Images.arrow : null} style={{width: px2dp(32), height: px2dp(32)}}/>
                </View>

            </View>
        </View>
        </TouchableOpacity>
    );
}
const ListRow = (props) => {
    return (
        <View style={[{marginHorizontal: px2dp(26), height: px2dp(100), justifyContent: 'center'}, props.style]}>
            <View style={{
                flexDirection: 'row',
                paddingLeft: px2dp(30),
                paddingRight: px2dp(10),
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Text style={{
                    fontFamily: "PingFangSC-Medium",
                    fontSize: moderateScale(14),
                    color: "#333"
                }}>{props.required?<Text style={{color:'red'}}>*</Text>:''} {props.title}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                    <Select value={props.value} style={{
                        height:px2dp(100),
                         flex:1,
                        borderWidth:0,
                        backgroundColor:'transparent',
                        marginRight:px2dp(28),
                    }} getItemText={(item)=>item.text} getItemValue={(item)=>item.value} items={props.items} onSelected={props.onSelected}  valueStyle={{fontFamily: "PingFang-SC-Bold",
                        fontSize: px2dp(28),
                        textAlign:'center',
                        color: "#333333"}}/>

                </View>

            </View>
        </View>
    );
}
