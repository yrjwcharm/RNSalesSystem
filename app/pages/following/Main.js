import React, {PureComponent} from 'react';
import {
    ScrollView,
    Linking,
    NativeModules,
    RefreshControl,
    ActivityIndicator,
    SafeAreaView,
    StyleSheet,
    Dimensions,
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
import Title1 from "../../components/Title1";
import Select from "teaset/components/Select/Select";
import Loading from "../../components/Loading";
import {StringUtils} from "../../utils";

const {width} = Dimensions.get('window');
let itemNo = 0;//item的个数
export default class Main extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            company: '',  //公司
            sysType: '', //系统类型
            provinceName: '',   //城市
            intentionID: '',  //意向ID
            timeRemaining: '',    //还剩时间
            userInfo: null,    //用户信息
            customerLabelTypeName: '',//客户类型
            name: '',//姓名
            telephone: '', //电话
            sortName: 3,
            visible: true,
            totalPage: 0,

            //上拉加载更多 下拉刷新
            page: 1,
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing: false,//下拉控制
        }
    }

    componentDidMount(): void {
        store.get('userInfo').then(userInfo => {
            this.setState({userInfo}, () => {
                this._getIntentionInfo(userInfo, this.state.sortName);
            });
        })
    }

    //跳转意图详情界面
    _jumpToCustomerArchivesRouter = (id) => {
        this.props.navigation.navigate('CustomerArchives', {intentionId: id})
    }
    //查询不同状态的意向信息
    _getIntentionInfo = (userInfo, sortName) => {
        const {userId} = userInfo;
        // contractStatus(销售机会状态)personChargeId(销售经理主键/当前登录人主键
        let url = Config.requestUrl + Config.followingInterface.getByStatus + `?contractStatus=1&personChargeId=${userId}&sortName=${sortName}&sortType=1&pageNum=${this.state.page}`;
        console.log(3333, url);
        fetch(url, {method: 'POST'}).then(res => {
            console.log(444, res);
            return res.json()
        }).then(responseText => {
            this.setState({visible: false}, () => {
                console.log(444, responseText);
                if (responseText.success) {
                    console.log('3332', responseText);
                    const {list, total} = responseText.obj;
                    let totalPage = Math.ceil(total / 10);
                    this._rebuildDataByPaging(list, totalPage);
                } else {
                    console.log('3332', responseText);
                }
            });

        }).catch(error => {
            Toast.fail(error);
            this.setState({visible: false});
        })
    }
    //通过分页重新构建数据
    _rebuildDataByPaging = (data, totalPage) => {
        let dataBlob = [];//这是创建该数组，目的放存在key值的数据，就不会报黄灯了
        let i = itemNo;
        data && data.map(function (item) {
            dataBlob.push({
                ...item
            })
            i++;
        });
        itemNo = i;
        let foot = 0;
        if (this.state.page >= totalPage) {
            foot = 1;//listView底部显示没有更多数据了
        }
        this.setState({
            //复制数据源
            //  dataArray:this.state.dataArray.concat( responseData.results),
            dataArray: this.state.dataArray.concat(dataBlob),
            isLoading: false,
            showFoot: foot,
            totalPage,
            isRefreshing: false,
        });
        dataBlob = null;
    }
    //渲染FlatList 底部显示
    _renderFooter = () => {
        if (this.state.showFoot === 1) {
            return (
                <View style={{height: 30, alignItems: 'center', justifyContent: 'flex-start',}}>
                    <Text style={{
                        color: '#999999',
                        fontSize: moderateScale(14),
                        marginTop: moderateScale(5),
                        marginBottom: moderateScale(5),
                    }}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if (this.state.showFoot === 2) {
            return (
                <View style={{
                    flexDirection: 'row',
                    height: verticalScale(24),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: moderateScale(10)
                }}>
                    <ActivityIndicator/>
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if (this.state.showFoot === 0) {
            return (
                <View style={{
                    flexDirection: 'row',
                    height: verticalScale(24),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: moderateScale(10)
                }}/>

            );
        }
    }
    //上拉加载时触发
    _onEndReached = () => {
        //如果是正在加载中或没有更多数据了，则返回
        if (this.state.showFoot !== 0) {
            return;
        }
        //如果当前页大于或等于总页数，那就是到最后一页了，返回
        if ((this.state.page !== 1) && (this.state.page >= this.state.totalPage)) {
            return;
        } else {
            this.state.page++;
        }
        //底部显示正在加载更多数据
        this.setState({showFoot: 2});
        //获取数据，在componentDidMount()已经请求过数据了
        if (this.state.page > 1) {
            this._getIntentionInfo(this.state.userInfo, this.state.sortName)
        }
    }
    _keyExtractor = (item, index) => index;
    // 渲染
    handleRefresh = () => {
        this.setState({
            page: 1,
            isRefreshing: true,//tag,下拉刷新中，加载完全，就设置成flase
            dataArray: []
        }, () => {
            this._getIntentionInfo(this.state.userInfo, this.state.sortName);
        });
    }
    _callPhone = (url) => {
        if (StringUtils.isEmpty(url)) {
            return;
        }
        if (Platform.OS === 'android') {
            NativeModules.NaviModule.callPhone(url);
        } else {
            Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                    console.log('Can\'t handle url: ' + url);
                } else {
                    return Linking.openURL(url);
                }
            }).catch(err => console.error('An error occurred', err));
        }
    }
    _renderItem = ({item}) => {
        return (
            <View style={{marginTop: moderateScale(12), paddingHorizontal: moderateScale(13)}}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => this._jumpToCustomerArchivesRouter(item.id)}>
                    <View style={{
                        borderRadius: scale(5),
                        backgroundColor: "#fff",
                        shadowColor: "rgba(0, 0, 0, 0.06)",
                        shadowOffset: {
                            width: 0,
                            height: verticalScale(2)
                        },
                        paddingHorizontal: moderateScale(22),
                        shadowRadius: scale(10),
                        shadowOpacity: 1,
                    }}>
                        <View style={{
                            paddingBottom: moderateScale(18),
                            alignItems: 'center',
                            flexDirection: 'row',
                            marginTop: moderateScale(15)
                        }}>
                            <View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        fontFamily: "PingFang-SC-Bold",
                                        fontSize: moderateScale(16),
                                        width: px2dp(420),
                                        color: item.customerLabelTypeId === 1450 ? '#EC6C59' : item.customerLabelTypeId === '1454' ? '#2e93f' : '#333'
                                    }}>{item.companyName}</Text>
                                </View>
                                <View
                                    style={{marginTop: moderateScale(12), flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        fontFamily: "PingFang-SC-Medium",
                                        fontSize: moderateScale(14),
                                        color: "#666"
                                    }}>{StringUtils.isEmpty(item.provinceName) ? '----' : item.provinceName}</Text>
                                    <Image source={Images.separator} style={{
                                        marginLeft: moderateScale(11),
                                        marginRight: moderateScale(10),
                                        width: scale(4),
                                        height: verticalScale(15)
                                    }}/>
                                    <Text style={{
                                        fontFamily: "PingFang-SC-Medium",
                                        fontSize: moderateScale(14),
                                        color: "#999"
                                    }}>{StringUtils.isEmpty(item.standardRequireName) ? '暂无' : item.standardRequireName}</Text>
                                </View>
                                <View
                                    style={{marginTop: moderateScale(12), flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        fontFamily: "PingFang-SC-Medium",
                                        fontSize: moderateScale(14),
                                        color: "#666"
                                    }}>意向ID：</Text>
                                    <Text style={{
                                        fontFamily: "PingFang-SC-Medium",
                                        fontSize: moderateScale(12),
                                        color: "#999"
                                    }}>{item.id}</Text>
                                </View>
                                <View
                                    style={{marginTop: moderateScale(12), flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        fontFamily: "PingFang-SC-Medium",
                                        fontSize: moderateScale(14),
                                        color: "#666"
                                    }}>姓名：</Text>
                                    <Text style={{
                                        fontFamily: "PingFang-SC-Medium",
                                        fontSize: moderateScale(12),
                                        color: "#999"
                                    }}>{item.personName}</Text>
                                    <TouchableOpacity activeOpacity={0.8}
                                                      onPress={() => this._callPhone(item.telephone)}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginLeft:px2dp(10),
                                        }}>
                                            <Text style={{
                                                fontFamily: "PingFang-SC-Medium",
                                                fontSize: moderateScale(12),
                                                color: "#666"
                                            }}>电话：</Text>
                                            <Text style={{
                                                fontFamily: "PingFang-SC-Medium",
                                                fontSize: moderateScale(14),
                                                color: "#999"
                                            }}>{StringUtils.isEmpty(item.telephone) ? '暂无' : item.telephone}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flexDirection:'row',alignItems:'center',  marginTop: moderateScale(12),}}>
                                    <View style={{
                                        borderRadius: scale(2),
                                        borderWidth: scale(1 / 2),
                                        borderColor: '#2e93ff',
                                        backgroundColor: '#EFF8FE',
                                    }}>
                                        <Text style={{
                                            fontFamily: "PingFang-SC-Medium",
                                            fontSize: moderateScale(12),
                                            color: "#2e93ff",
                                            paddingHorizontal: moderateScale(6),
                                            paddingVertical: moderateScale(4)
                                        }}>{item.timeStr}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const {dataArray, userInfo} = this.state;
        console.log(4444, dataArray);
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#F2F2F2'}}>
                <Title title={'跟进中'}/>
                <View style={{height: verticalScale(40), justifyContent: 'center', backgroundColor: '#F8F8FA'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => {
                            this.setState({visible: true, page: 1, sortName: 2, dataArray: []}, () => {
                                this._getIntentionInfo(userInfo, this.state.sortName)
                            });
                        }}>
                            <Select value={'意向ID'} style={{
                                height: verticalScale(40),
                                width: width / 2,
                                borderWidth: 0,
                                borderRightWidth: scale(1 / 4),
                                backgroundColor: 'transparent',
                                paddingRight: moderateScale(28),
                            }} valueStyle={{
                                fontFamily: "PingFang-SC-Bold",
                                fontSize: moderateScale(14),
                                textAlign: 'center',
                                color: "#333333"
                            }} editable={false} icon={<Image source={Images.drop_down} style={{
                                marginRight: moderateScale(20),
                                width: scale(11),
                                height: verticalScale(7)
                            }}/>}/>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => {
                            this.setState({visible: true, page: 1, sortName: 1, dataArray: []}, () => {
                                this._getIntentionInfo(userInfo, this.state.sortName)
                            });
                        }}>
                            <Select value={'省市'} style={{
                                height: verticalScale(40),
                                width: width / 2,
                                borderWidth: 0,
                                borderLeftWidth: scale(1 / 4),
                                backgroundColor: 'transparent',
                                paddingRight: moderateScale(28),
                            }} valueStyle={{
                                fontFamily: "PingFang-SC-Bold",
                                fontSize: moderateScale(14),
                                textAlign: 'center',
                                color: "#333333"
                            }} editable={false} icon={<Image source={Images.drop_down} style={{
                                marginRight: moderateScale(20),
                                width: scale(11),
                                height: verticalScale(7)
                            }}/>}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <FlatList
                    data={dataArray}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ListFooterComponent={this._renderFooter}
                    onEndReached={this._onEndReached}
                    onEndReachedThreshold={0.1}
                    ListEmptyComponent={
                        <View
                            style={{
                                height: SCREEN_HEIGHT - px2dp(100),
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: SCREEN_WIDTH
                            }}>
                            <Image source={Images.noData}
                                   style={{width: px2dp(150), height: px2dp(150)}}/>
                            <Text style={{fontSize: px2dp(28), color: '#999', margin: px2dp(50)}}> 没有数据哦!</Text></View>}
                    //为刷新设置颜色
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.handleRefresh.bind(this)}//因为涉及到this.state
                            colors={['#ff0000', '#00ff00', '#0000ff', '#3ad564']}
                            progressBackgroundColor="#ffffff"
                        />
                    }
                />
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
