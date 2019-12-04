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
import Loading from "../../components/Loading";

export default class ControlPanel extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            queryConditionList: [],
            listItem:{}
        }
    }

    componentDidMount(): void {
        this._getQueryCondition();
    }

    _getQueryCondition = () => {
        let url = Config.requestUrl + Config.demoUrlPageInterface.queryCondition;
        fetch(url, {method: 'POST'}).then(res => res.json().then(responseText => {
            console.log(1111, responseText);
                if (responseText.success) {
                    const obj = eval(responseText.obj);
                    obj.map(item => {
                        item.list.map(item => {
                            item.checked = false
                        });
                    });
                    console.log(333, obj);
                    this.setState({queryConditionList: obj});

                }

        })).catch(error => {
            Toast.fail(error);
        })
    }
    _queryCondition = (item) => {
        let arr = this.state.queryConditionList;
        arr.map(s => {
            s.list.map(obj => {
                if (JSON.stringify(obj) === JSON.stringify(item)) {
                    obj.checked = true;
                } else {
                    obj.checked = false;
                }
            });
        });
        console.log(4444, arr);
        this.setState({queryConditionList: [...arr],listItem:item});
    }
    _reset = () => {
        this._getQueryCondition();
    }
    _confirm = () => {
        const {listItem}=this.state;
        if(Object.keys(listItem).length===0){
           Toast.info('请选择类别');
           return;
        }
        DeviceEventEmitter.emit('updateDemoUrl',listItem);
        this.props.closeDrawer();
    }

    // 渲染
    render() {
        const {queryConditionList} = this.state;
        return (
            <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <View style={{
                    height: px2dp(80),
                    justifyContent: 'center',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: '#e0e0e0'
                }}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={{
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#666"
                        }}>产品类别</Text>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}>
                    {queryConditionList && queryConditionList.map(item => {
                        return (
                            <View>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: moderateScale(15),
                                    color:'#333',
                                    marginLeft: px2dp(30),
                                    marginTop: px2dp(20),
                                    marginBottom: px2dp(10),
                                }}>{item.typeName}</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}}>
                                    {item.list && item.list.map(item => {
                                        return (
                                            <TouchableOpacity activeOpacity={0.8}
                                                              onPress={() => this._queryCondition(item)}>
                                                <View style={{
                                                    marginLeft: moderateScale(10),
                                                    marginTop: px2dp(10),
                                                    borderRadius: px2dp(3),
                                                    borderWidth: scale(1 / 2),
                                                    borderColor: item.checked ? '#2e93ff' : '#e0e0e0',
                                                    backgroundColor: item.checked ? '#EFF8FE' : '#f5f5f5'
                                                }}>
                                                    <Text style={{
                                                        fontFamily: "PingFang-SC-Medium",
                                                        fontSize: moderateScale(12),
                                                        paddingHorizontal: px2dp(12),
                                                        paddingVertical: px2dp(8),
                                                        color: item.checked ? '#2e93ff' : '#666'
                                                    }}>
                                                        {item.itemValue}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>

                                        );
                                    })}
                                </View>
                            </View>
                        );
                    })}

                </ScrollView>
                <View style={{justifyContent: 'flex-end',}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity activeOpacity={0.8} onPress={this._reset}>
                            <View style={{justifyContent: 'center',   backgroundColor: '#fff',height: px2dp(80)}}>
                                <View style={{
                                    alignItems: 'center',
                                    width: Dimensions.get('window').width * 0.75 / 2
                                }}>
                                    <Text style={{
                                        fontFamily: "PingFang-SC-Medium",
                                        fontSize: moderateScale(15),
                                        color: '#2e93ff',
                                    }}>重置</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={this._confirm}>
                            <View style={{justifyContent: 'center',  backgroundColor: '#2e93ff', height: px2dp(80)}}>
                                <View style={{
                                    alignItems: 'center',
                                    width: Dimensions.get('window').width * 0.75 / 2
                                }}>
                                    <Text style={{
                                        fontFamily: "PingFang-SC-Medium",
                                        fontSize: moderateScale(15),
                                        color: '#fff',
                                    }}>确定</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        );
    }

}
