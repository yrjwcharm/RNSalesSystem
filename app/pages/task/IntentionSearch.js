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
import Title from '../../components/Title'
import {Input} from "teaset";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import SmallButton from "../../components/SmallButton";
import Modal, {ModalContent} from "react-native-modals";
import DatePicker from "../../components/DatePicker";
import moment from "moment";
import Loading from "../../components/Loading";
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
export default class IntentionSearch extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            visible: true,
            bottomModal: false,
            bottomModalAndTitle: false,
            bottomModalAndTitle_1: false,
            bottomModalAndTitle_2: false,
            bottomModalAndTitle_3: false,
            bottomModalAndTitle_4: false,
            bottomModalAndTitle_5: false,
            bottomModalAndTitle_6: false,
            bottomModalAndTitle_7: false,
            date: moment().format('YYYY-MM-DD'),
            purposeName: '',
            //意向ID
            purposeId: '',
            //联系人
            linkerName: '',
            //联系电话
            telephone: '',
            //省主键
            provinceId: '',
            //市主键
            cityId: '',
            //客户标签
            customerLabelTypeId: '',
            //销售经理
            personChargeId: '',
            //意向来源
            purposeSourceId: '',
            //意向状态
            purposeStatus: '',
            //机会状态
            contractId: '',
            //首访时间--开始时间
            firstVisitBegin: '',
            //首访时间--结束时间
            firstVisitEnd: '',
            //跟进时间--开始时间
            followTimeBegin: '',
            //跟进时间--结束时间
            followTimeEnd: '',
            //大类值
            bigType: '',
            //系统分组主键
            systemGroupId: '',
            //系统分类
            systemSortId: '',
            areaId: '',
            //页码
            pageNum: '',//页码数 从1开始
            visibility: false,
            provinceCityArea: '',
            customerLabel: '',
            intentionSource: '',
            type: '',//大类
            sysByGroup: '',//系统分组
            sysType: '',
            chanceState: '',
            intentionState: '',
            salesManager: '',
            provinceCityAreaCoding: '',
            customerLabelList: [],
            customerLabelItem: {},
            intentionSourceList: [],
            intentionSourceItem: {},
            dlList: [],
            dlItem: {},
            sysGroupList: [],
            sysTypeList: [],
            sysTypeItem: {},
            intentionList: [{label: '', value: '全部', checked: false}, {
                label: 0,
                value: '有效',
                checked: false
            }, {label: 1, value: '拉黑', checked: false}],
            chanceList:
                [{label: '', value: '全部', checked: false}, {label: 1, value: '跟进', checked: false}, {
                    label: 2,
                    value: '排除',
                    checked: false
                }, {label: 4, value: '已签', checked: false}],
            intentionStateItem: {},
            chanceStateItem: {},
            salesManagerList: [],
            sysGroupItem: {},
            salesManagerItem: {},

        }
    }

    componentWillMount(): void {
        this.listener = DeviceEventEmitter.addListener('p_c_a_success', result => {
            console.log(555, result);
            if (result) {
                this.setState({
                    provinceCityArea: result.provinceName + ' ' + result.cityName + ' ' + result.areaName,
                    provinceId: result.provinceCoding,
                    cityId: result.cityCoding,
                    areaId: result.areaCoding,
                });
            }

        })
    }

    componentDidMount(): void {
        this._getCustomerLabelList();
    }

    _getSysType = (id) => {
        let url = Config.requestUrl + Config.intentionSearch.sysType + `?parentId=${id}`;
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            this.setState({visible: false}, () => {
                if (responseText.code === '200') {
                    let obj = eval(responseText.obj);
                    obj.map(item => {
                        item.checked = false;
                    })
                    this.setState({sysTypeList: obj});
                    console.log("tag212", obj);
                }
            });
        }).catch(error => {
            Toast.fail(error)
        })
    }
    _getSysByGroupList = () => {
        let url = Config.requestUrl + Config.intentionSearch.sysByGroupList;
        fetch(url, {method: 'POST'}).then(res => {
            console.log(333, res);
            return res.json()
        }).then(responseText => {
            if (responseText.code === '200') {
                let obj = eval(responseText.obj);
                obj.map(item => {
                    item.checked = false;
                })
                this.setState({sysGroupList: obj});
                console.log("tag1", obj);
            }
            this._getSalesManagerList();

        }).catch(error => {
            Toast.fail(error)
        })
    }
    _getSalesManagerList = () => {
        let url = Config.requestUrl + Config.intentionSearch.salesManagerList;
        console.log(333, url);
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            this.setState({visible: false}, () => {
                if (responseText.code === '200') {
                    let obj = eval(responseText.obj);
                    obj.map(item => {
                        item.checked = false;
                    })
                    this.setState({salesManagerList: obj});
                    console.log("tag333", obj);
                }
            });

        }).catch(error => {
            Toast.fail(error)
        })
    }
    //获取大类列表
    _getDLList = () => {
        let url = Config.requestUrl + Config.intentionSearch.DL;
        console.log(4444, url);
        fetch(url, {method: 'POST'}).then(res => {
            console.log(333, res);
            return res.json()
        }).then(responseText => {
            console.log(3333, responseText);
            if (responseText.code === '200') {
                let obj = eval(responseText.obj);
                obj.map(item => {
                    item.checked = false;
                })
                this.setState({dlList: obj});
                console.log('tag', obj);
            }
            this._getSysByGroupList();

        }).catch(error => {
            Toast.fail(error)
        })
    }
    //获取意向来源列表
    _getIntentionSource = () => {
        let url = Config.requestUrl + Config.dataDictionary.customerLabelList + `?onlyMark=yixianglaiyuan`;
        console.log(4444, url);
        fetch(url, {method: 'POST'}).then(res => {
            console.log(333, res);
            return res.json()
        }).then(responseText => {
            console.log(3333, responseText);
            if (responseText.code === '200') {
                let obj = eval(responseText.obj);
                obj.map(item => {
                    item.checked = false;
                })
                console.log(6666, obj);
                this.setState({intentionSourceList: obj});
            }
            this._getDLList();
        }).catch(error => {
            Toast.fail(error)
        })
    }
    //获取客户标签列表
    _getCustomerLabelList = () => {
        let url = Config.requestUrl + Config.dataDictionary.customerLabelList + `?onlyMark=kehubiaoqian`;
        console.log(4444, url);
        fetch(url, {method: 'POST'}).then(res => {
            console.log(333, res);
            return res.json()
        }).then(responseText => {
            console.log(3333, responseText);
            if (responseText.code === '200') {
                let obj = eval(responseText.obj);
                obj.map(item => {
                    item.checked = false;
                })
                console.log("nb", obj);
                this.setState({customerLabelList: obj});
            }
            this._getIntentionSource();
        }).catch(error => {
            Toast.fail(error)
        })
    }

    componentWillUnmount(): void {
        this.listener && this.listener.remove();
    }

    _search = () => {
        const {
            purposeName,
            purposeId,
            linkerName,
            telephone,
            provinceId,
            cityId,
            customerLabelTypeId,
            personChargeId,
            purposeSourceId,
            purposeStatus,
            contractId,
            firstVisitBegin,
            firstVisitEnd,
            followTimeBegin,
            followTimeEnd,
            bigType,
            systemGroupId,
            systemSortId
        } = this.state;
        if (!StringUtils.isEmpty(telephone) && (!StringUtils.isMobile(telephone))) {
            Toast.info('手机号输入有误');
            return;
        }
        if (!StringUtils.isEmpty(purposeId)) {
            if (isNaN(parseFloat(purposeId))) {
                Toast.info('请输入有效意向Id')
                return;
            }
        }
        this.props.navigation.navigate('SearchResult', {
            purposeName,
            purposeId,
            linkerName,
            telephone,
            provinceId,
            cityId,
            customerLabelTypeId,
            personChargeId,
            purposeSourceId,
            purposeStatus,
            contractId,
            firstVisitBegin,
            firstVisitEnd,
            followTimeBegin,
            followTimeEnd,
            bigType,
            systemGroupId,
            systemSortId
        })
    }
    /*客户表亲啊*/
    _confirm = () => {
        const {customerLabelItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(customerLabelItem).length === 0) {
            Toast.info('请选择客户标签');
            return;
        }
        this.setState({
            bottomModalAndTitle: false,
            customerLabel: customerLabelItem.itemValue,
            customerLabelTypeId: customerLabelItem.dicId,
        }, () => {
            // this.props.navigation.goBack();
        });

    }
    _cancel = () => {
        this.setState({
            bottomModalAndTitle: false,
            customerLabelItem: {},
            customerLabel: '',
            customerLabelTypeId: '',
        }, () => {
            this._getCustomerLabelList();
        });
    }
    _selectCustomLabel = (item) => {
        this.state.customerLabelList.map(item => {
            item.checked = false;
        });
        item.checked = true;
        this.setState({
            customerLabelList: [
                ...this.state.customerLabelList,
            ],
            customerLabelItem: item,
        });
        console.log(444, this.state.customerLabelList);
    }
    /*意向来源*/
    _confirm1 = () => {
        const {intentionSourceItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(intentionSourceItem).length === 0) {
            Toast.info('请选择意向来源');
            return;
        }
        this.setState({
            bottomModalAndTitle_1: false,
            intentionSource: intentionSourceItem.itemValue,
            purposeSourceId: intentionSourceItem.dicId,
        }, () => {
            // this.props.navigation.goBack();
        });

    }
    _cancel1 = () => {
        this.setState({
            bottomModalAndTitle_1: false,
            intentionSourceItem: {},
            intentionSource: '',
            purposeSourceId: '',
        }, () => {
            this._getIntentionSource();
        });
    }
    _confirm2 = () => {
        const {dlItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(dlItem).length === 0) {
            Toast.info('请选择大类');
            return;
        }
        this.setState({
            bottomModalAndTitle_2: false,
            type: dlItem.value,
            bigType: dlItem.label
        }, () => {
            // this.props.navigation.goBack();
        });

    }
    _cancel2 = () => {
        this.setState({
            bottomModalAndTitle_2: false,
            dlItem: {},
            type: '',
            bigType: '',
        }, () => {
            this._getDLList();
        });
    }
    _selectDLType = (item) => {
        this.state.dlList.map(item => {
            item.checked = false;
        });
        item.checked = true;
        this.setState({
            dlList: [
                ...this.state.dlList,
            ],
            dlItem: item,
        });
        console.log(666, this.state.dlList);
    }
    //系统分组
    _confirm3 = () => {
        const {sysGroupItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(sysGroupItem).length === 0) {
            Toast.info('请选择系统分组');
            return;
        }
        this.setState({
            bottomModalAndTitle_3: false,
            sysByGroup: sysGroupItem.typeName,
            systemGroupId: sysGroupItem.proTypeId,
            sysType: '',
        }, () => {
            if (!StringUtils.isEmpty(this.state.sysByGroup)) {
                this._getSysType(sysGroupItem.proTypeId);
            }

        });

    }
    _cancel3 = () => {
        this.setState({
            bottomModalAndTitle_3: false,
            sysByGroup: '',
            sysType: '',
            systemGroupId: '',
            systemSortId: '',
            // sysGroupItem: {}
        }, () => {
            this._getSysByGroupList();
        });
    }
    _selectSysGroup = (item) => {
        this.state.sysGroupList.map(item => {
            item.checked = false;
        });
        item.checked = true;
        this.setState({
            sysGroupList: [
                ...this.state.sysGroupList,
            ],
            sysGroupItem: item,
        });
        console.log(666, this.state.sysGroupList);
    }
    //系统类型
    _confirm4 = () => {
        const {sysTypeItem, sysGroupItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(sysTypeItem).length === 0) {
            Toast.info('请选择系统类型');
            return;
        }
        this.setState({
            bottomModalAndTitle_4: false,
            sysType: sysTypeItem.descp,
            systemSortId: sysTypeItem.dicId
        });

    }
    _cancel4 = () => {
        this.setState({
            bottomModalAndTitle_4: false,
            // sysTypeItem: {}
        }, () => {
            this._getSysType(this.state.sysGroupItem.proTypeId)
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
    _confirm5 = () => {
        const {intentionStateItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(intentionStateItem).length === 0) {
            Toast.info('请选择意向状态');
            return;
        }
        this.setState({
            bottomModalAndTitle_5: false,
            intentionState: intentionStateItem.value,
            purposeStatus: intentionStateItem.label
        }, () => {
            // this.props.navigation.goBack();
        });

    }
    _cancel5 = () => {
        this.setState({
            bottomModalAndTitle_5: false,
            intentionStateItem: {},
            purposeStatus: '',
            intentionState: '',
        }, () => {
            this.setState({
                intentionList: [{label: 0, value: '有效', checked: false}, {
                    label: 1,
                    value: '拉黑',
                    checked: false
                }]
            });
        });
    }
    _selectIntentionState = (item) => {
        this.state.intentionList.map(item => {
            item.checked = false;
        });
        item.checked = true;
        this.setState({
            intentionList: [
                ...this.state.intentionList,
            ],
            intentionStateItem: item,
        });
        console.log(666, this.state.intentionList);
    }
    //
    _confirm6 = () => {
        const {chanceStateItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(chanceStateItem).length === 0) {
            Toast.info('请选择机会状态');
            return;
        }
        this.setState({
            bottomModalAndTitle_6: false,
            chanceState: chanceStateItem.value,
            contractId: chanceStateItem.label
        }, () => {
            // this.props.navigation.goBack();
        });

    }
    _cancel6 = () => {
        this.setState({
            bottomModalAndTitle_6: false,
            chanceStateItem: {},
            chanceState: '',
            contractId: ''
        }, () => {
            this.setState({
                chanceList: [{label: '', value: '全部', checked: false}, {
                    label: 1,
                    value: '跟进',
                    checked: false
                }, {label: 2, value: '排除', checked: false}, {label: 4, value: '已签', checked: false}],
            });
        });
    }
    _selectChanceState = (item) => {
        this.state.chanceList.map(item => {
            item.checked = false;
        });
        item.checked = true;
        this.setState({
            chanceList: [
                ...this.state.chanceList,
            ],
            chanceStateItem: item,
        });
        console.log(666, this.state.chanceList);
    }
    _confirm7 = () => {
        const {salesManagerItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(salesManagerItem).length === 0) {
            Toast.info('请选择销售经理');
            return;
        }
        this.setState({
            bottomModalAndTitle_7: false,
            salesManager: salesManagerItem.fullname,
            personChargeId: salesManagerItem.userId,
        }, () => {
            // this.props.navigation.goBack();
        });

    }
    _cancel7 = () => {
        this.setState({
            bottomModalAndTitle_7: false,
            chanceStateItem: {},
            salesManager: '',
            personChargeId: '',
        }, () => {
            this._getSalesManagerList();
        });
    }
    _selectSalesManager = (item) => {
        this.state.salesManagerList.map(item => {
            item.checked = false;
        });
        item.checked = true;
        this.setState({
            salesManagerList: [
                ...this.state.salesManagerList,
            ],
            salesManagerItem: item,
        });
        console.log(666, this.state.salesManagerList);
    }


    _showFirstVisitBeginPicker = () => {
        this.refs.datePicker.show({
            title: "请选择日期", //标题
            // years: 10, //展示总年数
            // lastYear: 2020, //展示最后一年，须同时传years
            selectedValue: this.state.date, //默认选择的日期，格式"yyyy-MM-dd"
            onPickerConfirm: (chooseDate) => { //确认回调，格式"yyyy-MM-dd"
                this.setState({
                    firstVisitBegin: chooseDate,
                });
            },
        });
    };
    _showFirstVisitEndPicker = () => {
        this.refs.datePicker.show({
            title: "请选择日期", //标题
            // years: 10, //展示总年数
            // lastYear: 2020, //展示最后一年，须同时传years
            selectedValue: this.state.date, //默认选择的日期，格式"yyyy-MM-dd"
            onPickerConfirm: (chooseDate) => { //确认回调，格式"yyyy-MM-dd"
                this.setState({
                    firstVisitEnd: chooseDate,
                });
            },
        });
    };
    _showFollowTimeBeginPicker = () => {
        this.refs.datePicker.show({
            title: "请选择日期", //标题
            // years: 10, //展示总年数
            // lastYear: 2020, //展示最后一年，须同时传years
            selectedValue: this.state.date, //默认选择的日期，格式"yyyy-MM-dd"
            onPickerConfirm: (chooseDate) => { //确认回调，格式"yyyy-MM-dd"
                this.setState({
                    followTimeBegin: chooseDate,
                });
            },
        });
    };
    _showFollowTimeEndPicker = () => {
        this.refs.datePicker.show({
            title: "请选择日期", //标题
            // years: 10, //展示总年数
            // lastYear: 2020, //展示最后一年，须同时传years
            selectedValue: this.state.date, //默认选择的日期，格式"yyyy-MM-dd"
            onPickerConfirm: (chooseDate) => { //确认回调，格式"yyyy-MM-dd"
                this.setState({
                    followTimeEnd: chooseDate,
                });
            },
        });
    };
    _selectIntentionSource = (item) => {
        this.state.intentionSourceList.map(item => {
            item.checked = false;
        });
        item.checked = true;
        this.setState({
            intentionSourceList: [
                ...this.state.intentionSourceList,
            ],
            intentionSourceItem: item,
        });
        console.log(666, this.state.intentionSourceList);
    }

    // 渲染
    render() {
        const {
            purposeName,
            //意向ID
            purposeId,
            //联系人
            linkerName,
            //联系电话
            telephone, sysTypeList, salesManagerList, sysGroupList, chanceList, intentionList, dlList, intentionSourceList, customerLabelList, sysType, chanceState, intentionState, salesManager, type, sysByGroup, intentionSource, firstVisitBegin, firstVisitEnd, followTimeBegin, followTimeEnd, provinceCityArea, customerLabel
        } = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                <Title title={'意向搜索'}/>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false}
                                         keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}>
                    <View style={{marginBottom: px2dp(120)}}>
                        <Menu1 style={{
                            backgroundColor: '#FFf',
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1,
                        }} onChangeText={(purposeName) => {
                            this.setState({purposeName});
                        }} title={'意向名称：'} placeholder={'请输入意向名称'} value={purposeName}/>
                        <Menu1 style={{
                            backgroundColor: '#FFf',
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1,
                            paddingLeft: px2dp(25),
                        }} keyboardType={'numeric'} onChangeText={(purposeId) => {
                            this.setState({purposeId});
                        }} title={'意向ID：'} placeholder={'请输入意向ID'} value={purposeId}/>
                        <Menu1 style={{
                            backgroundColor: '#FFf',
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1,
                            paddingLeft: px2dp(25),
                        }} onChangeText={(linkerName) => {
                            this.setState({linkerName});
                        }} title={'联系人：'} placeholder={'请输入联系人'} value={linkerName}/>
                        <Menu1 style={{
                            backgroundColor: '#FFf',
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1
                        }} onChangeText={(telephone) => {
                            this.setState({telephone});
                        }} title={'联系电话：'} keyboardType={'numeric'} placeholder={'请输入联系电话'} value={telephone}/>
                        <Menu arrow title={'省市：'} detail={provinceCityArea} style={{
                            backgroundColor: '#FFf',
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1,
                            paddingLeft: px2dp(50),
                        }} onPress={() => {
                            this.props.navigation.navigate('Province')
                        }}/>
                        <Menu arrow title={'客户标签：'} detail={customerLabel} style={{
                            backgroundColor: '#FFf',
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1
                        }} onPress={() => {
                            this.setState({
                                bottomModalAndTitle: true,
                            });
                        }}/>
                        <Menu arrow title={'意向来源：'} detail={intentionSource} style={{
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1,
                            backgroundColor: '#FFf'
                        }}
                              onPress={() => {
                                  this.setState({
                                      bottomModalAndTitle_1: true,
                                  });
                              }}/>
                        <Menu arrow title={'大类：'} detail={type} style={{
                            // marginTop: px2dp(12),
                            backgroundColor: '#FFf',
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1,
                            paddingLeft: px2dp(50),
                        }} onPress={() => {
                            this.setState({
                                bottomModalAndTitle_2: true,
                            });
                        }}/>
                        <Menu arrow title={'系统分组：'} detail={sysByGroup} style={{
                            backgroundColor: '#FFf',
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1
                        }} onPress={() => {
                            this.setState({
                                bottomModalAndTitle_3: true,
                            });
                        }}/>
                        <Menu arrow title={'系统类型：'} detail={sysType} style={{
                            backgroundColor: '#FFf',
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1
                        }} onPress={() => {
                            if (Object.keys(this.state.sysGroupItem).length === 0) {
                                Toast.info('尚未选择系统分组');
                                return;
                            }
                            this.setState({
                                bottomModalAndTitle_4: true,
                            });
                        }}/>
                        <Menu arrow title={'意向状态：'} detail={intentionState} style={{
                            // marginTop: px2dp(12),
                            backgroundColor: '#FFf',
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1
                        }} onPress={() => {
                            this.setState({
                                bottomModalAndTitle_5: true,
                            });
                        }}/>
                        <Menu arrow title={'机会状态：'} detail={chanceState} style={{
                            backgroundColor: '#FFf',
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1
                        }} onPress={() => {
                            this.setState({
                                bottomModalAndTitle_6: true,
                            });
                        }}/>
                        <Menu arrow title={'销售经理：'} detail={salesManager} style={{
                            backgroundColor: '#FFf',
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1
                        }} onPress={() => {
                            this.setState({
                                bottomModalAndTitle_7: true,
                            });
                        }}/>
                        <Input1 title={'首访时间：'} value1={firstVisitBegin} value2={firstVisitEnd}
                                onPress1={this._showFirstVisitBeginPicker} onPress2={this._showFirstVisitEndPicker}
                                editable1={false} editable2={false}/>
                        <Input1 title={'最后跟进时间：'} value1={followTimeBegin} value2={followTimeEnd}
                                onPress1={this._showFollowTimeBeginPicker}
                                onPress2={this._showFollowTimeEndPicker} editable1={false} editable2={false}/>
                    </View>
                </KeyboardAwareScrollView>
                {/*客户标签*/}
                <Modal.BottomModal
                    visible={this.state.bottomModalAndTitle}
                    onTouchOutside={() => this.setState({bottomModalAndTitle: false})}
                    height={0.40}
                    width={1}
                    onSwipeOut={() => this.setState({bottomModalAndTitle: false})}
                    modalTitle={
                        <ModalTitle title={'选择客户标签'} onCancel={
                            this._cancel
                        } onConfirm={
                            this._confirm
                        } style={{
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1
                        }}/>
                    }
                >
                    <ModalContent
                        style={{
                            flex: 1,
                            backgroundColor: 'fff',
                        }}
                    >
                        {customerLabelList && customerLabelList.map(item => {
                            return (
                                <TouchableOpacity onPress={() => this._selectCustomLabel(item)} activeOpacity={0.8}>
                                    <View style={{
                                        backgroundColor: item.checked ? '#2e93ff' : '#fff',
                                        height: px2dp(80),
                                        justifyContent: 'center',
                                        borderBottomColor: '#e0e0e0',
                                        borderBottomWidth: 1
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
                    </ModalContent>
                </Modal.BottomModal>
                {/*选择意向来源*/}
                <Modal.BottomModal
                    visible={this.state.bottomModalAndTitle_1}
                    onTouchOutside={() => this.setState({bottomModalAndTitle_1: false})}
                    height={0.40}
                    width={1}
                    onSwipeOut={() => this.setState({bottomModalAndTitle_1: false})}
                    modalTitle={
                        <ModalTitle title={'选择意向来源'} onCancel={
                            this._cancel1
                        } onConfirm={
                            this._confirm1
                        } style={{
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1
                        }}/>
                    }
                >
                    <ModalContent
                        style={{
                            flex: 1,
                            backgroundColor: 'fff',
                        }}
                    >
                        <ScrollView keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}>
                            {intentionSourceList && intentionSourceList.map(item => {
                                return (
                                    <TouchableOpacity onPress={() => this._selectIntentionSource(item)}
                                                      activeOpacity={0.8}>
                                        <View style={{
                                            backgroundColor: item.checked ? '#2e93ff' : '#fff',
                                            height: px2dp(80),
                                            justifyContent: 'center',
                                            borderBottomColor: '#e0e0e0',
                                            borderBottomWidth: 1
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
                {/*选择大类*/}
                <Modal.BottomModal
                    visible={this.state.bottomModalAndTitle_2}
                    onTouchOutside={() => this.setState({bottomModalAndTitle_2: false})}
                    height={0.40}
                    width={1}
                    onSwipeOut={() => this.setState({bottomModalAndTitle_2: false})}
                    modalTitle={
                        <ModalTitle title={'选择大类'} style={{
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1
                        }} onConfirm={this._confirm2} onCancel={this._cancel2}/>
                    }
                >
                    <ModalContent
                        style={{
                            flex: 1,
                            backgroundColor: 'fff',
                        }}
                    >
                        <ScrollView keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}>
                            {dlList && dlList.map(item => {
                                return (
                                    <TouchableOpacity onPress={() => this._selectDLType(item)} activeOpacity={0.8}>
                                        <View style={{
                                            backgroundColor: item.checked ? '#2e93ff' : '#fff',
                                            height: px2dp(80),
                                            justifyContent: 'center',
                                            borderBottomColor: '#e0e0e0',
                                            borderBottomWidth: 1
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
                {/*选择系统分组*/}
                <Modal.BottomModal
                    visible={this.state.bottomModalAndTitle_3}
                    onTouchOutside={() => this.setState({bottomModalAndTitle_3: false})}
                    height={0.40}
                    width={1}
                    onSwipeOut={() => this.setState({bottomModalAndTitle_3: false})}
                    modalTitle={
                        <ModalTitle title={'选择系统分组'} onCancel={
                            this._cancel3
                        } onConfirm={
                            this._confirm3
                        } style={{
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1
                        }}/>
                    }
                >
                    <ModalContent
                        style={{
                            flex: 1,
                            backgroundColor: 'fff',
                        }}
                    >
                        <ScrollView keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}>
                            {sysGroupList && sysGroupList.map(item => {
                                return (
                                    <TouchableOpacity onPress={() => this._selectSysGroup(item)} activeOpacity={0.8}>
                                        <View style={{
                                            backgroundColor: item.checked ? '#2e93ff' : '#fff',
                                            height: px2dp(80),
                                            justifyContent: 'center',
                                            borderBottomColor: '#e0e0e0',
                                            borderBottomWidth: 1
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
                {/*选择系统类型*/}
                <Modal.BottomModal
                    visible={this.state.bottomModalAndTitle_4}
                    onTouchOutside={() => this.setState({bottomModalAndTitle_4: false})}
                    height={0.40}
                    width={1}
                    onSwipeOut={() => this.setState({bottomModalAndTitle_4: false})}
                    modalTitle={
                        <ModalTitle title={'选择系统类型'} onCancel={
                            this._cancel4
                        } onConfirm={
                            this._confirm4
                        } style={{
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1
                        }}/>
                    }
                >
                    <ModalContent
                        style={{
                            flex: 1,
                            backgroundColor: 'fff',
                        }}
                    >
                        <ScrollView keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}>
                            {sysTypeList && sysTypeList.map(item => {
                                return (
                                    <TouchableOpacity onPress={() => this._selectSysType(item)} activeOpacity={0.8}>
                                        <View style={{
                                            backgroundColor: item.checked ? '#2e93ff' : '#fff',
                                            height: px2dp(80),
                                            justifyContent: 'center',
                                            borderBottomColor: '#e0e0e0',
                                            borderBottomWidth: 1
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
                {/*选择意向状态*/}
                <Modal.BottomModal
                    visible={this.state.bottomModalAndTitle_5}
                    onTouchOutside={() => this.setState({bottomModalAndTitle_5: false})}
                    height={0.40}
                    width={1}
                    onSwipeOut={() => this.setState({bottomModalAndTitle_5: false})}
                    modalTitle={
                        <ModalTitle title={'选择意向状态'} onCancel={this._cancel5} onConfirm={
                            this._confirm5

                        } style={{
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1
                        }}/>
                    }
                >
                    <ModalContent
                        style={{
                            flex: 1,
                            backgroundColor: 'fff',
                        }}
                    >
                        <ScrollView keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}>
                            {intentionList && intentionList.map(item => {
                                return (
                                    <TouchableOpacity onPress={() => this._selectIntentionState(item)}
                                                      activeOpacity={0.8}>
                                        <View style={{
                                            backgroundColor: item.checked ? '#2e93ff' : '#fff',
                                            height: px2dp(80),
                                            justifyContent: 'center',
                                            borderBottomColor: '#e0e0e0',
                                            borderBottomWidth: 1
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
                {/*选择机会状态*/}
                <Modal.BottomModal
                    visible={this.state.bottomModalAndTitle_6}
                    onTouchOutside={() => this.setState({bottomModalAndTitle_6: false})}
                    height={0.40}
                    width={1}
                    onSwipeOut={() => this.setState({bottomModalAndTitle_6: false})}
                    modalTitle={
                        <ModalTitle title={'选择机会状态'} onCancel={
                            this._cancel6
                        } onConfirm={
                            this._confirm6
                        } style={{
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1
                        }}/>
                    }
                >
                    <ModalContent
                        style={{
                            flex: 1,
                            backgroundColor: 'fff',
                        }}
                    >
                        <ScrollView keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}>
                            {chanceList && chanceList.map(item => {
                                return (
                                    <TouchableOpacity onPress={() => this._selectChanceState(item)} activeOpacity={0.8}>
                                        <View style={{
                                            backgroundColor: item.checked ? '#2e93ff' : '#fff',
                                            height: px2dp(80),
                                            justifyContent: 'center',
                                            borderBottomColor: '#e0e0e0',
                                            borderBottomWidth: 1
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
                {/*选择销售经理*/}
                <Modal.BottomModal
                    visible={this.state.bottomModalAndTitle_7}
                    onTouchOutside={() => this.setState({bottomModalAndTitle_7: false})}
                    height={0.40}
                    width={1}
                    onSwipeOut={() => this.setState({bottomModalAndTitle_7: false})}
                    modalTitle={
                        <ModalTitle title={'选择销售经理'} onCancel={
                            this._cancel7
                        } onConfirm={
                            this._confirm7
                        } style={{
                            borderBottomColor: '#e0e0e0',
                            borderBottomWidth: 1
                        }}/>
                    }
                >
                    <ModalContent
                        style={{
                            flex: 1,
                            backgroundColor: 'fff',
                        }}
                    >
                        <ScrollView keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}>
                            {salesManagerList && salesManagerList.map(item => {
                                return (
                                    <TouchableOpacity onPress={() => this._selectSalesManager(item)}
                                                      activeOpacity={0.8}>
                                        <View style={{
                                            backgroundColor: item.checked ? '#2e93ff' : '#fff',
                                            height: px2dp(80),
                                            justifyContent: 'center',
                                            borderBottomColor: '#e0e0e0',
                                            borderBottomWidth: 1
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
                <DatePicker ref={"datePicker"} hide={true}/>
                <View style={{position: 'absolute', zIndex: 99, bottom: px2dp(22)}}>
                    <SmallButton name={'搜索'} onPress={this._search}/>
                </View>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
const Input1 = (props) => {
    return (
        <View style={{
            height: px2dp(80),
            justifyContent: 'center',
            backgroundColor: '#fff',
            borderBottomWidth: props.noBorder ? 0 : 1,
            borderBottomColor: '#e0e0e0'
        }}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: px2dp(20)}}>
                <Text style={{
                    marginLeft: moderateScale(16), fontFamily: "PingFangSC-Medium",
                    fontSize: moderateScale(14),
                    color: "#333"
                }}>{props.title}</Text>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity activeOapcity={0.8} onPress={props.onPress1}
                                      style={{flex: 1, height: verticalScale(25),}}>
                        <Input style={{
                            flex: 1,
                            marginLeft: px2dp(80),
                            color: "#333333",
                            textAlign: 'center',
                            fontFamily: "PingFang-SC-Medium",
                            fontSize: moderateScale(14),
                        }} value={props.value1} editable={props.editable1}/>
                    </TouchableOpacity>
                    <Text style={{
                        paddingLeft: px2dp(60),
                        fontFamily: "PingFangSC-Medium",
                        fontSize: moderateScale(14),
                        color: "#333"
                    }}>~</Text>
                    <TouchableOpacity activeOapcity={0.8} onPress={props.onPress2}
                                      style={{flex: 1, height: verticalScale(25),}}>
                        <Input style={{
                            flex: 1,
                            textAlign: 'center',
                            marginLeft: px2dp(80),
                            color: "#333333",
                            height: verticalScale(25),
                            fontFamily: "PingFang-SC-Medium",
                            fontSize: moderateScale(14),
                        }} value={props.value2} editable={props.editable2}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
const Menu = (props) => {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={props.onPress}>
            <View style={[{height: px2dp(80), justifyContent: 'center'}, props.style]}>
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
            <View style={[{height: px2dp(80), justifyContent: 'center'}, props.style]}>
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
                        <Input style={{
                            backgroundColor: 'transparent',
                            borderWidth: 0,
                            textAlign: 'right',
                            color: "#333333",
                            height: px2dp(80),
                            fontFamily: "PingFang-SC-Medium",
                            fontSize: moderateScale(14),
                        }} keyboardType={props.keyboardType} onChangeText={props.onChangeText} value={props.value}
                               placeholder={props.placeholder}/>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

