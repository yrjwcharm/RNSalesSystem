import React, {PureComponent} from 'react';
import {
    Dimensions,
    ScrollView,
    Linking,
    SafeAreaView,
    StyleSheet,
    DeviceEventEmitter,
    Image,
    FlatList,
    Platform,
    NativeModules,
    BackHandler,
    View,
    Text,
    TextInput,
    Alert,
    ImageBackground,
    TouchableOpacity
} from 'react-native'
import Title from '../../components/Title'
import Select from "teaset/components/Select/Select";
import {Checkbox} from "teaset";
import Loading from "../../components/Loading";
import {NavigationActions, StackActions} from "react-navigation";

const {width} = Dimensions.get('window');
export default class Home extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            title: '', //标题
            taskTime: '',  //任务时间
            chanceID: '' , //机会ID,
            visible:true,
            userInfo:null,
            todayTotal:'',
            tomorrowTotal:'',
            weekTotal:'',
            expireTotal:'',
            fullName:'',
        }
    }
    componentDidMount(): void {
        store.get('userInfo').then(userInfo=>{
            this.setState({userInfo,fullName:userInfo.fullName},()=>{
                console.log(333,userInfo);
                this._getTodayTotal(userInfo);
            });
        })

    }
    _todayDeal=()=>{
        this.props.navigation.navigate('UrgentToDo',{statisticsType:1})

    }
    _tomorrowDeal=()=>{
        this.props.navigation.navigate('UrgentToDo',{statisticsType:2})
    }
    _weekDeal=()=>{
        this.props.navigation.navigate('UrgentToDo',{statisticsType:3})
    }
    _expireDeal=()=>{
        this.props.navigation.navigate('UrgentToDo',{statisticsType:4})
    }

    // 当前登录人：userId（必填）
    // 任务状态：selectType（必填）
    // 意向主键：purposeId
    // 统计类型：statisticsType 1 今日代办 2 明日代办 3 本周代办 4 过期任务（必填）
    _getTodayTotal=(userInfo)=>{
        let url=Config.requestUrl+Config.homeInterface.homeData+`?userId=${userInfo.userId}&selectType=1&statisticsType=1`;
        console.log(333,url);
        fetch(url,{method:'POST'}).then(res=>{
            return res.json()
        }).then(responseText=>{
            if(responseText.success){
             this.setState({todayTotal:responseText.obj});
            }
            console.log(3333,responseText);
            this._getTomorrowTotal(userInfo)
        }).catch(error=>{
            Toast.fail(error)
        })
    }
    _getTomorrowTotal=(userInfo)=>{
        let url=Config.requestUrl+Config.homeInterface.homeData+`?userId=${userInfo.userId}&selectType=1&statisticsType=2`;
        console.log(333,url);
        fetch(url,{method:'POST'}).then(res=>{
            return res.json()
        }).then(responseText=>{
            if(responseText.success){
                this.setState({tomorrowTotal:responseText.obj});
            }
            console.log(3333,responseText);
            this._getWeekTotal(userInfo);
        }).catch(error=>{
            Toast.fail(error)
        })
    }
    _getWeekTotal=(userInfo)=>{
        let url=Config.requestUrl+Config.homeInterface.homeData+`?userId=${userInfo.userId}&selectType=1&statisticsType=3`;
        console.log(333,url);
        fetch(url,{method:'POST'}).then(res=>{
            return res.json()
        }).then(responseText=>{
            if(responseText.success){
                this.setState({weekTotal:responseText.obj});
            }
            console.log(3333,responseText);
            this._getExpireTotal(userInfo);
        }).catch(error=>{
            Toast.fail(error)
        })
    }
    _getExpireTotal=(userInfo)=>{
        let url=Config.requestUrl+Config.homeInterface.homeData+`?userId=${userInfo.userId}&selectType=1&statisticsType=4`;
        console.log(333,url);
        fetch(url,{method:'POST'}).then(res=>{
            return res.json()
        }).then(responseText=>{
            this.setState({visible:false},()=>{
                if(responseText.success){
                    this.setState({expireTotal:responseText.obj} ,()=>{
                        console.log(444,this.state.todayTotal);
                        if(Platform.OS==='android'){
                            NativeModules.NaviModule.showBadge(responseText.obj+this.state.todayTotal);
                        }


                    });
                }
                console.log(3333,responseText);
            });

        }).catch(error=>{
            Toast.fail(error)
        })
    }
    _exitLogin=()=>{
        store.delete('userInfo');
        //重置路由代码
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
        });
        this.props.navigation.dispatch(resetAction);
    }
    // 渲染
    render() {
        const { todayTotal,
            tomorrowTotal,
            weekTotal,
            expireTotal,fullName} = this.state;
        return (
            <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                <ImageBackground source={Images.bg} style={{width, height: px2dp(180)}} resizeMode={'cover'}>
                    {/*<View style={{marginTop: moderateScale(20), flexDirection: 'row', justifyContent: 'flex-end'}}>*/}
                    {/*    <TouchableOpacity activeOpacity={0.8}>*/}
                    {/*        <Text style={{*/}
                    {/*            fontFamily: "PingFang-SC-Bold",*/}
                    {/*            fontSize: moderateScale(18),*/}
                    {/*            color: "#fff",*/}
                    {/*            marginRight:px2dp(20),*/}
                    {/*        }}>退出登录</Text>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*</View>*/}
                </ImageBackground>
                <View style={{
                    width: px2dp(351 * 2),
                    backgroundColor: '#fff',
                    borderRadius: px2dp(10),
                    position: 'absolute',
                    top: px2dp(80),
                    left: px2dp(23),
                    right: 0
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingTop: px2dp(40),
                        paddingBottom: px2dp(54)
                    }}>
                        <Image source={Images.default_avatar}
                               style={{marginLeft: px2dp(40), width: px2dp(78), height: px2dp(78)}}/>
                        <View style={{marginLeft: px2dp(32)}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: px2dp(32),
                                    color: "#333333",
                                    marginRight: px2dp(14),
                                }}>{fullName}</Text>
                                {/*<Text style={{*/}
                                {/*    marginLeft:px2dp(10),*/}
                                {/*    fontFamily: "PingFang-SC-Medium",*/}
                                {/*    fontSize: px2dp(22),*/}
                                {/*    color: "#818181"*/}
                                {/*}}>2019年11月12日 星期二</Text>*/}
                                <TouchableOpacity onPress={this._exitLogin} activeOpacity={0.8}>
                                <View style={{marginLeft:px2dp(20),borderRadius:px2dp(3),borderWidth:scale(1/2),borderColor:'#2e93ff',backgroundColor:'#EFF8FE'}}>
                                    <Text style={{fontFamily: "PingFang-SC-Medium",
                                        fontSize: moderateScale(12),
                                        paddingHorizontal:px2dp(6),paddingVertical:px2dp(4),color:'#2e93ff'}}>
                                        退出登录
                                    </Text>
                                </View>
                                </TouchableOpacity>
                                {/*<ImageBackground source={Images.profession} style={{width: px2dp(140)}}*/}
                                {/*                 resizeMode={'contain'}>*/}
                                {/*    <Text style={{*/}
                                {/*        fontFamily: "PingFang-SC-Medium",*/}
                                {/*        fontSize: px2dp(22),*/}
                                {/*        marginLeft: px2dp(40),*/}
                                {/*        color: "#cf9810"*/}
                                {/*    }}>销售经理</Text>*/}
                                {/*</ImageBackground>*/}
                            </View>
                        </View>

                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={Platform.OS==='android'?'always':'never'}>
                <View style={{backgroundColor: '#fff', marginTop: px2dp(100)}}>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', paddingBottom: px2dp(80)}}>
                        <View style={{width: width / 3, alignItems: 'center', marginTop: px2dp(70),}}>
                            <TouchableOpacity activeOpacity={0.8} onPress={this._todayDeal}>
                            <Image source={Images.today} style={{width: px2dp(110), height: px2dp(110)}}
                                   resizeMode={'contain'}/>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: px2dp(16)}}>

                                    <Text style={{
                                        fontFamily: "PingFang-SC-Medium",
                                        fontSize: px2dp(26),
                                        color: "#333333"
                                    }}>今日待办</Text>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: px2dp(26),
                                    color: "#333333"
                                }}>(</Text>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: px2dp(26),
                                    color: "#487afe"
                                }}>{todayTotal}</Text>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: px2dp(26),
                                    color: "#333333"
                                }}>)</Text>
                            </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{width: width / 3, alignItems: 'center', marginTop: px2dp(70),}}>
                            <TouchableOpacity activeOpacity={0.8} onPress={this._tomorrowDeal}>
                            <Image source={Images.tomorrow} style={{width: px2dp(110), height: px2dp(110)}}
                                   resizeMode={'contain'}/>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: px2dp(16)}}>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: px2dp(26),
                                    color: "#333333"
                                }}>明日待办</Text>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: px2dp(26),
                                    color: "#333333"
                                }}>(</Text>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: px2dp(26),
                                    color: "#487afe"
                                }}>{tomorrowTotal}</Text>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: px2dp(26),
                                    color: "#333333"
                                }}>)</Text>
                            </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{width: width / 3, alignItems: 'center',  marginTop: px2dp(70),}}>
                            <TouchableOpacity activeOpacity={0.8} onPress={this._weekDeal}>
                            <Image source={Images.week} style={{width: px2dp(110), height: px2dp(110)}}
                                   resizeMode={'contain'}/>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: px2dp(16)}}>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: px2dp(26),
                                    color: "#333333"
                                }}>本周待办</Text>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: px2dp(26),
                                    color: "#333333"
                                }}>(</Text>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: px2dp(26),
                                    color: "#487afe"
                                }}>{weekTotal}</Text>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: px2dp(26),
                                    color: "#333333"
                                }}>)</Text>
                            </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{width: width / 3, alignItems: 'center', marginTop: px2dp(70),}}>
                            <TouchableOpacity activeOpacity={0.8} onPress={this._expireDeal}>
                            <Image source={Images.overdue} style={{width: px2dp(110), height: px2dp(110)}}
                                   resizeMode={'contain'}/>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: px2dp(16)}}>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: px2dp(26),
                                    color: "#333333"
                                }}>已过期</Text>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: px2dp(26),
                                    color: "#333333"
                                }}>(</Text>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: px2dp(26),
                                    color: "#487afe"
                                }}>{expireTotal}</Text>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: px2dp(26),
                                    color: "#333333"
                                }}>)</Text>
                            </View>
                            </TouchableOpacity>
                        </View>
                    {/*    <View style={{width: width / 3, alignItems: 'center',  marginTop: px2dp(70),}}>*/}
                    {/*        <Image source={Images.long_overdue} style={{width: px2dp(110), height: px2dp(110)}}*/}
                    {/*               resizeMode={'contain'}/>*/}
                    {/*        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: px2dp(16)}}>*/}
                    {/*            <Text style={{*/}
                    {/*                fontFamily: "PingFang-SC-Medium",*/}
                    {/*                fontSize: px2dp(26),*/}
                    {/*                color: "#333333"*/}
                    {/*            }}>超长过期</Text>*/}
                    {/*            <Text style={{*/}
                    {/*                fontFamily: "PingFang-SC-Medium",*/}
                    {/*                fontSize: px2dp(26),*/}
                    {/*                color: "#333333"*/}
                    {/*            }}>(</Text>*/}
                    {/*            <Text style={{*/}
                    {/*                fontFamily: "PingFang-SC-Medium",*/}
                    {/*                fontSize: px2dp(26),*/}
                    {/*                color: "#487afe"*/}
                    {/*            }}>4</Text>*/}
                    {/*            <Text style={{*/}
                    {/*                fontFamily: "PingFang-SC-Medium",*/}
                    {/*                fontSize: px2dp(26),*/}
                    {/*                color: "#333333"*/}
                    {/*            }}>)</Text>*/}
                    {/*        </View>*/}
                    {/*    </View>*/}
                    {/*    <View style={{width: width / 3, alignItems: 'center',  marginTop: px2dp(70),}}>*/}
                    {/*        <Image source={Images.total} style={{width: px2dp(110), height: px2dp(110)}}*/}
                    {/*               resizeMode={'contain'}/>*/}
                    {/*        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: px2dp(16)}}>*/}
                    {/*            <Text style={{*/}
                    {/*                fontFamily: "PingFang-SC-Medium",*/}
                    {/*                fontSize: px2dp(26),*/}
                    {/*                color: "#333333"*/}
                    {/*            }}>待办总数</Text>*/}
                    {/*            <Text style={{*/}
                    {/*                fontFamily: "PingFang-SC-Medium",*/}
                    {/*                fontSize: px2dp(26),*/}
                    {/*                color: "#333333"*/}
                    {/*            }}>(</Text>*/}
                    {/*            <Text style={{*/}
                    {/*                fontFamily: "PingFang-SC-Medium",*/}
                    {/*                fontSize: px2dp(26),*/}
                    {/*                color: "#487afe"*/}
                    {/*            }}>4</Text>*/}
                    {/*            <Text style={{*/}
                    {/*                fontFamily: "PingFang-SC-Medium",*/}
                    {/*                fontSize: px2dp(26),*/}
                    {/*                color: "#333333"*/}
                    {/*            }}>)</Text>*/}
                    {/*        </View>*/}
                    {/*    </View>*/}
                    </View>
                </View>
                {/*<View style={{backgroundColor: '#fff', marginTop: px2dp(23)}}>*/}
                {/*    <View style={{flexDirection: 'row', flexWrap: 'wrap', paddingBottom: px2dp(80)}}>*/}
                {/*        <View style={{width: width / 3, alignItems: 'center',  marginTop: px2dp(70),}}>*/}
                {/*            <Image source={Images.today_follow} style={{width: px2dp(110), height: px2dp(110)}}*/}
                {/*                   resizeMode={'contain'}/>*/}
                {/*            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: px2dp(16)}}>*/}
                {/*                <Text style={{*/}
                {/*                    fontFamily: "PingFang-SC-Medium",*/}
                {/*                    fontSize: px2dp(26),*/}
                {/*                    color: "#333333"*/}
                {/*                }}>今日跟进</Text>*/}
                {/*                <Text style={{*/}
                {/*                    fontFamily: "PingFang-SC-Medium",*/}
                {/*                    fontSize: px2dp(26),*/}
                {/*                    color: "#333333"*/}
                {/*                }}>(</Text>*/}
                {/*                <Text style={{*/}
                {/*                    fontFamily: "PingFang-SC-Medium",*/}
                {/*                    fontSize: px2dp(26),*/}
                {/*                    color: "#487afe"*/}
                {/*                }}>4</Text>*/}
                {/*                <Text style={{*/}
                {/*                    fontFamily: "PingFang-SC-Medium",*/}
                {/*                    fontSize: px2dp(26),*/}
                {/*                    color: "#333333"*/}
                {/*                }}>)</Text>*/}
                {/*            </View>*/}
                {/*        </View>*/}
                {/*        <View style={{width: width / 3, alignItems: 'center',  marginTop: px2dp(70),}}>*/}
                {/*            <Image source={Images.yesterday_follow} style={{width: px2dp(110), height: px2dp(110)}}*/}
                {/*                   resizeMode={'contain'}/>*/}
                {/*            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: px2dp(16)}}>*/}
                {/*                <Text style={{*/}
                {/*                    fontFamily: "PingFang-SC-Medium",*/}
                {/*                    fontSize: px2dp(26),*/}
                {/*                    color: "#333333"*/}
                {/*                }}>昨日跟进</Text>*/}
                {/*                <Text style={{*/}
                {/*                    fontFamily: "PingFang-SC-Medium",*/}
                {/*                    fontSize: px2dp(26),*/}
                {/*                    color: "#333333"*/}
                {/*                }}>(</Text>*/}
                {/*                <Text style={{*/}
                {/*                    fontFamily: "PingFang-SC-Medium",*/}
                {/*                    fontSize: px2dp(26),*/}
                {/*                    color: "#487afe"*/}
                {/*                }}>4</Text>*/}
                {/*                <Text style={{*/}
                {/*                    fontFamily: "PingFang-SC-Medium",*/}
                {/*                    fontSize: px2dp(26),*/}
                {/*                    color: "#333333"*/}
                {/*                }}>)</Text>*/}
                {/*            </View>*/}
                {/*        </View>*/}
                {/*        <View style={{width: width / 3, alignItems: 'center',  marginTop: px2dp(70),}}>*/}
                {/*            <Image source={Images.week_follow} style={{width: px2dp(110), height: px2dp(110)}}*/}
                {/*                   resizeMode={'contain'}/>*/}
                {/*            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: px2dp(16)}}>*/}
                {/*                <Text style={{*/}
                {/*                    fontFamily: "PingFang-SC-Medium",*/}
                {/*                    fontSize: px2dp(26),*/}
                {/*                    color: "#333333"*/}
                {/*                }}>本周跟进频率</Text>*/}
                {/*                <Text style={{*/}
                {/*                    fontFamily: "PingFang-SC-Medium",*/}
                {/*                    fontSize: px2dp(26),*/}
                {/*                    color: "#333333"*/}
                {/*                }}>(</Text>*/}
                {/*                <Text style={{*/}
                {/*                    fontFamily: "PingFang-SC-Medium",*/}
                {/*                    fontSize: px2dp(26),*/}
                {/*                    color: "#487afe"*/}
                {/*                }}>4</Text>*/}
                {/*                <Text style={{*/}
                {/*                    fontFamily: "PingFang-SC-Medium",*/}
                {/*                    fontSize: px2dp(26),*/}
                {/*                    color: "#333333"*/}
                {/*                }}>)</Text>*/}
                {/*            </View>*/}
                {/*        </View>*/}
                {/*        <View style={{width: width / 3, alignItems: 'center',  marginTop: px2dp(70),}}>*/}
                {/*            <Image source={Images.follow_frequency} style={{width: px2dp(110), height: px2dp(110)}}*/}
                {/*                   resizeMode={'contain'}/>*/}
                {/*            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: px2dp(16)}}>*/}
                {/*                <Text style={{*/}
                {/*                    fontFamily: "PingFang-SC-Medium",*/}
                {/*                    fontSize: px2dp(26),*/}
                {/*                    color: "#333333"*/}
                {/*                }}>本月跟进频率</Text>*/}
                {/*                <Text style={{*/}
                {/*                    fontFamily: "PingFang-SC-Medium",*/}
                {/*                    fontSize: px2dp(26),*/}
                {/*                    color: "#333333"*/}
                {/*                }}>(</Text>*/}
                {/*                <Text style={{*/}
                {/*                    fontFamily: "PingFang-SC-Medium",*/}
                {/*                    fontSize: px2dp(26),*/}
                {/*                    color: "#487afe"*/}
                {/*                }}>89</Text>*/}
                {/*                <Text style={{*/}
                {/*                    fontFamily: "PingFang-SC-Medium",*/}
                {/*                    fontSize: px2dp(26),*/}
                {/*                    color: "#333333"*/}
                {/*                }}>)</Text>*/}
                {/*            </View>*/}
                {/*        </View>*/}
                {/*        <View style={{width: width / 3, alignItems: 'center',  marginTop: px2dp(70),}}>*/}
                {/*            <Image source={Images.follow_total_ranking} style={{width: px2dp(110), height: px2dp(110)}}*/}
                {/*                   resizeMode={'contain'}/>*/}
                {/*            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: px2dp(16)}}>*/}
                {/*                <Text style={{*/}
                {/*                    fontFamily: "PingFang-SC-Medium",*/}
                {/*                    fontSize: px2dp(26),*/}
                {/*                    color: "#333333"*/}
                {/*                }}>本月跟进总数排行</Text>*/}
                {/*            </View>*/}
                {/*        </View>*/}
                {/*        <View style={{width: width / 3, alignItems: 'center', marginTop: px2dp(70),}}>*/}
                {/*            <Image source={Images.follow_frequency_ranking} style={{width: px2dp(110), height: px2dp(110)}}*/}
                {/*                   resizeMode={'contain'}/>*/}
                {/*            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: px2dp(16)}}>*/}
                {/*                <Text style={{*/}
                {/*                    fontFamily: "PingFang-SC-Medium",*/}
                {/*                    fontSize: px2dp(26),*/}
                {/*                    color: "#333333"*/}
                {/*                }}>本月跟进频率排行</Text>*/}
                {/*            </View>*/}
                {/*        </View>*/}
                {/*    </View>*/}
                {/*</View>*/}
                </ScrollView>
                <Loading visible={this.state.visible}/>
            </View>

        );
    }

}
