import React, {PureComponent} from 'react';
import {ScrollView,Dimensions,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../../components/Title'
import {StringUtils} from "../../utils";
import {Input} from "teaset";
import SmallButton from "../../components/SmallButton";
import Modal, {ModalContent} from "react-native-modals";

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
export default class AddSalesChance extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            bottomModalAndTitle: false,
            bottomModalAndTitle_1: false,
            bottomModalAndTitle_2: false,
            bottomModalAndTitle_3: false,
            bottomModalAndTitle_4: false,
            isEditState:props.navigation.state.params.isEditState,
            createStr:'',   //录入时间
            priceRange:'',  //报价范围
            sixtyDayPossibilityStr:'', //签约可能性
            systemRequirementsName:'',//系统类型
            remark:'',//需求描述
            projectManagerList:[],
            projectManagerItem: {},
            projectManager:'',//项目经理
            productManagerList:[],
            productManagerItem:{},
            productManager:'',//产品经理
            priceRangeList:[],
            priceRangeItem:{},
            priceRangeKey:'',
            possibilityList:[],
            possibilityItem:{},
            possibilityKey:'',
            sysTypeList: [],
            sysTypeItem: {},
            visible:true,
            productManagerId:'',
            projectManagerId:'',
            userInfo:null,
            systemSortId:'',//系统分类Id
            defaultAnimationModal:false,
        }
    }
    componentDidMount(): void {
        store.get('userInfo').then(userInfo=>{
            this.setState({userInfo},()=>{
                this._getPriceRange();
            });
        })

    }
    _getPriceRange=()=>{
        let url=Config.requestUrl+Config.addSalesChancePageInterface.priceRange;
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            if(responseText.code==='200'){
                const obj=eval(responseText.obj);
                obj.map(item => {
                    item.checked = false;
                })
                this.setState({priceRangeList:obj});
            }
            this._getSignPossibilityList();
        }).catch(error=>{
            Toast.fail(error)
        })
    }
    _getSignPossibilityList=()=>{
        let url=Config.requestUrl+Config.addSalesChancePageInterface.signPossibility;
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            console.log(555,responseText);
            if(responseText.code==='200'){
                const obj=eval(responseText.obj);
                obj.map(item => {
                    item.checked = false;
                })
                this.setState({possibilityList:obj});
                this._getSysType();
            }
        }).catch(error=>{
            Toast.fail(error)
        })
    }
    _getSysType = () => {
        let url = Config.requestUrl + Config.addSalesChancePageInterface.sysType;
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            console.log("system",responseText);
            if (responseText.code === '200') {
                let obj = eval(responseText.obj);
                obj.map(item => {
                    item.checked = false;
                })
                this.setState({sysTypeList: obj});
                console.log("tag22", obj);
            }
           this._getProductManagerList();
        }).catch(error => {
            Toast.fail(error)
        })
    }
    _getProductManagerList=()=>{
        let url=Config.requestUrl+Config.addSalesChancePageInterface.productManager;
        console.log(333, url);
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
                if (responseText.code === '200') {
                    let obj = eval(responseText.obj);
                    obj.map(item => {
                        item.checked = false;
                    })
                    this.setState({productManagerList: obj});
                    console.log("tag+++", obj);
                }
            this._getProjectManagerList();

        }).catch(error => {
            Toast.fail(error)
        })
    }
    _getProjectManagerList = () => {
        let url=Config.requestUrl+Config.addSalesChancePageInterface.projectManager;
        console.log(333, url);
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            this.setState({visible: false}, () => {
                if (responseText.code === '200') {
                    let obj = eval(responseText.obj);
                    obj.map(item => {
                        item.checked = false;
                    })
                    this.setState({projectManagerList: obj});
                    console.log("tag333", obj);
                }
            });

        }).catch(error => {
            Toast.fail(error)
        })
    }
    _addSalesChance=()=>{
        const {userId}=this.state.userInfo;
        const {projectManagerItem,productManagerItem,possibilityItem,sysTypeItem,priceRangeItem,priceRangeKey,productManagerId,projectManagerId,remark,possibilityKey,systemSortId}=this.state;
        if(Object.keys(priceRangeItem).length===0){
            Toast.info('请选择报价范围')
            return;
        }
        if(Object.keys(possibilityItem).length===0){
            Toast.info('请选择签约可能性')
            return;
        }
        if(Object.keys(sysTypeItem).length===0){
            Toast.info('请选择系统类型')
            return;
        }
        const {params}=this.props.navigation.state;
        this.setState({visible:true},()=>{
            let url=Config.requestUrl+Config.addSalesChancePageInterface.saveSalesChance+`?purposeId=${params.intentionId}`+
                `&budgetQuotedRange=${priceRangeKey}&sixtyDayPossibility=${possibilityKey}&systemIds=${systemSortId}&requirementDescription=${remark}&proManId=${productManagerId}&proPerId=${projectManagerId}&userId=${userId}`;
            console.log(4444,url);
            fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
                console.log(3333,responseText);
                this.setState({visible:false},()=>{
                    if(responseText.success){
                        this.setState({
                            defaultAnimationModal: true,
                        });
                    }
                });

            }).catch(error=>{
                Toast.fail(error);
            })
        });


    }
    _confirm= () => {
        const {priceRangeItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(priceRangeItem).length === 0) {
            Toast.info('请选择报价范围');
            return;
        }
        this.setState({
            bottomModalAndTitle: false,
            priceRange: priceRangeItem.value,
            priceRangeKey:priceRangeItem.label
        });

    }
    _cancel = () => {
        this.setState({
            bottomModalAndTitle: false,
            priceRangeItem: {}
        }, () => {
           this._getPriceRange();
        });
    }
    _selectPriceRangeState = (item) => {
        this.state.priceRangeList.map(item => {
            item.checked = false;
        });
        item.checked = true;
        this.setState({
            priceRangeList: [
                ...this.state.priceRangeList,
            ],
            priceRangeItem: item,
        });
        console.log(666, this.state.priceRangeList);
    }
    _confirm1= () => {
        const {possibilityItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(possibilityItem).length === 0) {
            Toast.info('请选择签约可能性');
            return;
        }
        this.setState({
            bottomModalAndTitle1: false,
            sixtyDayPossibilityStr: possibilityItem.value,
            possibilityKey:possibilityItem.label
        });

    }
    _cancel1 = () => {
        this.setState({
            bottomModalAndTitle1: false,
            possibilityItem: {}
        }, () => {
           this._getSignPossibilityList();
        });
    }
    _selectSignPossibility = (item) => {
        this.state.possibilityList.map(item => {
            item.checked = false;
        });
        item.checked = true;
        this.setState({
            possibilityList: [
                ...this.state.possibilityList,
            ],
            possibilityItem: item,
        });
        console.log(666, this.state.possibilityList);
    }
    //系统分类
    _confirm2 = () => {
        const {sysTypeItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(sysTypeItem).length === 0) {
            Toast.info('请选择系统分类');
            return;
        }
        this.setState({
            bottomModalAndTitle2: false,
            systemRequirementsName: sysTypeItem.typeName,
            systemSortId:sysTypeItem.proTypeId
        },);

    }
    _cancel2 = () => {
        this.setState({
            bottomModalAndTitle2: false,
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
    //产品经理
    _confirm3 = () => {
        const {productManagerItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(productManagerItem).length === 0) {
            Toast.info('请选择产品经理');
            return;
        }
        this.setState({
            bottomModalAndTitle3: false,
            productManager: productManagerItem.fullname,
            productManagerId:productManagerItem.userId
        }, () => {
            // this.props.navigation.goBack();
        });

    }
    _cancel3 = () => {
        this.setState({
            bottomModalAndTitle3: false,
            productManagerItem: {}
        }, () => {
            this._getProductManagerList()
        });
    }
    _selectProductManager = (item) => {
        this.state.productManagerList.map(item => {
            item.checked = false;
        });
        item.checked = true;
        this.setState({
            productManagerList: [
                ...this.state.productManagerList,
            ],
            productManagerItem: item,
        });
        console.log(666, this.state.productManagerList);
    }
    //项目经理
    _confirm4 = () => {
        const {projectManagerItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(projectManagerItem).length === 0) {
            Toast.info('请选择产品经理');
            return;
        }
        this.setState({
            bottomModalAndTitle4: false,
            projectManager: projectManagerItem.fullname,
            projectManagerId:projectManagerItem.userId
        }, () => {
            // this.props.navigation.goBack();
        });

    }
    _cancel4 = () => {
        this.setState({
            bottomModalAndTitle4: false,
            projectManagerItem: {}
        }, () => {
            this._getProjectManagerList()
        });
    }
    _selectProjectManager = (item) => {
        this.state.projectManagerList.map(item => {
            item.checked = false;
        });
        item.checked = true;
        this.setState({
            projectManagerList: [
                ...this.state.projectManagerList,
            ],
            projectManagerItem: item,
        });
        console.log(666, this.state.projectManagerList);
    }
    _cancel_=()=>{
        this.setState({
            defaultAnimationModal: false,
        });
    }
    _confirm_=()=>{
        this.setState({
            defaultAnimationModal: false,
        },()=>{
            DeviceEventEmitter.emit('update_customer_archives_sales_chance',true);
            this.props.navigation.goBack();
        });

    }
    // 渲染
    render() {
        const {productManagerList,projectManagerList,sysTypeList,priceRange,possibilityList,projectManager,productManager,priceRangeList,sixtyDayPossibilityStr,systemRequirementsName,remark,isEditState}=this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f2f2f2'}}>
                <Title title={isEditState?'编辑':'添加机会'} back onPressBack={()=>this.props.navigation.goBack()}/>
                <View style={{marginTop:moderateScale(15),paddingHorizontal:moderateScale(13),flex:1}}>
                    <View style={{borderRadius: scale(5),
                        backgroundColor: "#fff",
                        shadowColor: "rgba(0, 0, 0, 0.06)",
                        shadowOffset: {
                            width: 0,
                            height: verticalScale(2)
                        },
                        shadowRadius: scale(10),
                        shadowOpacity: 1,}}>
                        <DefaultInput1 required placeholder={'请输入报价范围'} title={'报价范围'} value={priceRange} noBorder   onChangeText={(priceRange)=>{
                            this.setState({priceRange});
                        }} editable={false} onPress={()=>{
                            this.setState({
                                bottomModalAndTitle: true,
                            })
                        }}/>
                        <DefaultInput1 required placeholder={'请输入签约可能性'} title={'签约可能性'} value={sixtyDayPossibilityStr} noBorder onChangeText={(sixtyDayPossibilityStr)=>{
                            this.setState({sixtyDayPossibilityStr});
                        }} editable={false} onPress={()=>{
                            this.setState({
                                bottomModalAndTitle1: true,
                            })
                        }}/>
                        <DefaultInput1  required title={'系统类型'}  placeholder={'请选择系统类型'} value={systemRequirementsName} noBorder onChangeText={(systemRequirementsName)=>{
                            this.setState({systemRequirementsName});
                        }} editable={false} onPress={()=>{
                            this.setState({
                                bottomModalAndTitle2: true,
                            })
                        }}/>
                        <DefaultInput required placeholder={'请输入需求描述'} title={'需求描述'} value={remark} noBorder onChangeText={(remark)=>{
                            this.setState({remark});
                        }}/>
                        <DefaultInput1 placeholder={'请选择产品经理'} title={'产品经理'}  value={productManager} noBorder onChangeText={(productManager)=>{
                            this.setState({productManager});
                        }} editable={false} onPress={()=>{
                            this.setState({
                                bottomModalAndTitle3: true,
                            })
                        }}/>
                        <DefaultInput1 placeholder={'请选择项目经理'} title={'项目经理'}  value={projectManager} noBorder onChangeText={(projectManager)=>{
                            this.setState({projectManager});
                        }} editable={false} onPress={()=>{
                            this.setState({
                                bottomModalAndTitle4: true,
                            })
                        }} />
                    </View>
                    {/*报价范围*/}
                    <Modal.BottomModal
                        visible={this.state.bottomModalAndTitle}
                        onTouchOutside={() => this.setState({bottomModalAndTitle: false})}
                        height={0.40}
                        width={1}
                        onSwipeOut={() => this.setState({bottomModalAndTitle: false})}
                        modalTitle={
                            <ModalTitle title={'选择报价范围'} onCancel={
                                this._cancel
                            } onConfirm={
                                this._confirm
                            } style={{
                                borderBottomColor: '#e0e0e0',
                                borderBottomWidth: StyleSheet.hairlineWidth
                            }}/>
                        }
                    >
                        <ModalContent
                            style={{
                                flex: 1,
                                backgroundColor: 'fff',
                            }}
                        >
                            {priceRangeList && priceRangeList.map(item => {
                                return (
                                    <TouchableOpacity onPress={() => this._selectPriceRangeState(item)} activeOpacity={0.8}>
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
                        </ModalContent>
                    </Modal.BottomModal>
                    {/*签约可能性*/}
                    <Modal.BottomModal
                        visible={this.state.bottomModalAndTitle1}
                        onTouchOutside={() => this.setState({bottomModalAndTitle1: false})}
                        height={0.40}
                        width={1}
                        onSwipeOut={() => this.setState({bottomModalAndTitle1: false})}
                        modalTitle={
                            <ModalTitle title={'选择签约可能性'} onCancel={
                                this._cancel1
                            } onConfirm={
                                this._confirm1
                            } style={{
                                borderBottomColor: '#e0e0e0',
                                borderBottomWidth: StyleSheet.hairlineWidth
                            }}/>
                        }
                    >
                        <ModalContent
                            style={{
                                flex: 1,
                                backgroundColor: 'fff',
                            }}
                        >
                            {possibilityList && possibilityList.map(item => {
                                return (
                                    <TouchableOpacity onPress={() => this._selectSignPossibility(item)} activeOpacity={0.8}>
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
                        </ModalContent>
                    </Modal.BottomModal>
                    {/*系统类型*/}
                    <Modal.BottomModal
                        visible={this.state.bottomModalAndTitle2}
                        onTouchOutside={() => this.setState({bottomModalAndTitle2: false})}
                        height={0.40}
                        width={1}
                        onSwipeOut={() => this.setState({bottomModalAndTitle2: false})}
                        modalTitle={
                            <ModalTitle title={'选择系统类型'} onCancel={
                                this._cancel2
                            } onConfirm={
                                this._confirm2
                            } style={{
                                borderBottomColor: '#e0e0e0',
                                borderBottomWidth: StyleSheet.hairlineWidth
                            }}/>
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
                    {/*系统类型*/}
                    <Modal.BottomModal
                        visible={this.state.bottomModalAndTitle3}
                        onTouchOutside={() => this.setState({bottomModalAndTitle3: false})}
                        height={0.40}
                        width={1}
                        onSwipeOut={() => this.setState({bottomModalAndTitle3: false})}
                        modalTitle={
                            <ModalTitle title={'选择产品经理'} onCancel={
                                this._cancel3
                            } onConfirm={
                                this._confirm3
                            } style={{
                                borderBottomColor: '#e0e0e0',
                                borderBottomWidth: StyleSheet.hairlineWidth
                            }}/>
                        }
                    >
                        <ModalContent
                            style={{
                                flex: 1,
                                backgroundColor: 'fff',
                            }}
                        >
                            <ScrollView keyboardShouldPersistTaps={Platform.OS==='android'?'always':'never'}>
                                {productManagerList && productManagerList.map(item => {
                                    return (
                                        <TouchableOpacity onPress={() => this._selectProductManager(item)} activeOpacity={0.8}>
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
                                                        {item.fullname}
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
                    {/*项目经理*/}
                    <Modal.BottomModal
                        visible={this.state.bottomModalAndTitle4}
                        onTouchOutside={() => this.setState({bottomModalAndTitle4: false})}
                        height={0.40}
                        width={1}
                        onSwipeOut={() => this.setState({bottomModalAndTitle4: false})}
                        modalTitle={
                            <ModalTitle title={'选择项目经理'} onCancel={
                                this._cancel4
                            } onConfirm={
                                this._confirm4
                            } style={{
                                borderBottomColor: '#e0e0e0',
                                borderBottomWidth: StyleSheet.hairlineWidth
                            }}/>
                        }
                    >
                        <ModalContent
                            style={{
                                flex: 1,
                                backgroundColor: 'fff',
                            }}
                        >
                            <ScrollView keyboardShouldPersistTaps={Platform.OS==='android'?'always':'never'}>
                                {projectManagerList && projectManagerList.map(item => {
                                    return (
                                        <TouchableOpacity onPress={() => this._selectProjectManager(item)} activeOpacity={0.8}>
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
                                                        {item.fullname}
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
                    <Modal
                        width={0.65}
                        visible={this.state.defaultAnimationModal}
                        rounded
                        actionsBordered
                        onTouchOutside={() => {
                            this.setState({ defaultAnimationModal: false });
                        }}
                        modalTitle={
                            <TouchableOpacity activeOpacity={0.8} onPress={this._cancel_}>
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
                                }}>机会已添加</Text>
                                <Text style={{
                                    marginTop:px2dp(20),
                                    marginLeft: moderateScale(22), fontFamily: "PingFangSC-Medium",
                                    fontSize: moderateScale(14),
                                    color: "#999"
                                }}>新机会已添加,请查看。</Text>
                                <SmallButton name={'确认'} width={px2dp(420)} height={px2dp(90)} onPress={this._confirm_}/>
                            </View>
                        </ModalContent>
                    </Modal>
                    <View style={{justifyContent:'flex-end',flex:1,bottom:px2dp(30),alignItems:'center'}}>
                            <SmallButton name={'保存'} onPress={this._addSalesChance}/>
                    </View>
                </View>
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
                    color: "#333"}}>{props.required?<Text style={{color:'red'}}>*</Text>:''} {props.title}</Text>
                <Input  style={{borderWidth:0,flex:1,paddingLeft:px2dp(40),height:verticalScale(40),marginRight:moderateScale(10),fontSize:moderateScale(14),}}  onChangeText={props.onChangeText}
                        value={props.value} placeholder={props.placeholder}/>
            </View>
        </View>
    );
}
const DefaultInput1=(props)=>{
    return(
        <TouchableOpacity activeOpacity={0.8} onPress={props.onPress}>
        <View style={{height:verticalScale(40),justifyContent:'center',backgroundColor: 'transparent',borderBottomWidth:props.noBorder?0:StyleSheet.hairlineWidth,borderBottomColor:'#e0e0e0'}}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Text style={{marginLeft:moderateScale(22),fontFamily: "PingFangSC-Medium",
                    fontSize: moderateScale(14),
                    color: "#333"}}>{props.required?<Text style={{color:'red'}}>*</Text>:''} {props.title}</Text>
                <View style={{flexDirection:'row',alignItems:'center',flex:1,marginRight: px2dp(20)}}>
                <Input  style={{borderWidth:0,flex:1,paddingLeft:px2dp(40),height:verticalScale(40),fontSize:moderateScale(14),}}  onChangeText={props.onChangeText}
                        value={props.value} placeholder={props.placeholder} editable={props.editable}/>
                        <Image source={Images.arrow} resizeMode={'contain'} style={{width:px2dp(32),height:px2dp(32)}}/>
                </View>
            </View>
        </View>
        </TouchableOpacity>
    );
}
