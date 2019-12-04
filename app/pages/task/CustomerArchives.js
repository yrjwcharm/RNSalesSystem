import React, {PureComponent} from 'react';
import {
    ScrollView,
    Dimensions,
    Linking,
    SafeAreaView,
    StyleSheet,
    DeviceEventEmitter,
    Image,
    Keyboard,
    FlatList,
    Platform,
    BackHandler,
    View,
    Text,
    TextInput,
    Alert,
    ImageBackground,
    TouchableOpacity,
    NativeModules
} from 'react-native'
import Title from '../../components/Title'
import Animated from "react-native-reanimated";
import {StringUtils} from "../../utils";
import Loading from "../../components/Loading";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import ActionSheet from "react-native-actionsheet";
import * as Progress from "react-native-progress";
import Checkbox from "teaset/components/Checkbox/Checkbox";
import {Input} from "teaset";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import ImagePicker from 'react-native-image-crop-picker';
const  {width}=Dimensions.get('window');
import HTML from 'react-native-render-html';

export default class CustomerArchives extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            title: '意向详情',
            intentionID: '', //意向ID
            intentionState: '',  //意向状态
            company: '',   //公司
            homeLocation: '',  //所在地
            customerLabel: '', //客户标签
            intentionSource: '',  //意向来源
            firstVisitTime: '',     //首访时间
            createTime: '',  //创建时间
            followLast: '', //最后跟进
            createPerson: '', //创建人
            statusStr: '',
            saleManager: '',   //销售经理
            chanceID: '',   //机会ID
            sysName: '',    //系统名称
            recordTime: '',    //录入时间
            contactInfo: '',    //联系信息
            name: '',           //姓名
            telephone: '',          //手机1
            fixMobile: '',          //固定电话
            qq: '',                 //QQ
            wx: '',                 //微信
            email: '',                 //邮箱
            planCompleteTime: '', taskTypeName: '', taskDetail: '',
            planTimeStr: '',
            systemRequirementsName: '',
            payMoney: '',
            conMoney: '',
            saleChanceId: '',
            contractNum: '',
            visible: true,
            isExpand: false,
            contractList: [],
            signedContractList: [],
            taskList: [],
            followInfoList: [],
            contactList: [],
            saleChanceList: [],
            customerLabelTypeId: '',
            noLinkTime: '',
            totalMoney: '',
            countyName: '',
            index: 0,
            routes: [
                {key: 'first', title: '跟进'},
                {key: 'second', title: '机会'},
                {key: 'third', title: '联系'},
                {key: 'fourth', title: '任务'},
                {key: 'fifth', title: '合同'},
            ],
        }
    }

    //查询意向详情根据id
    _queryIntentionDetail = (id) => {
        console.log(3333, id);
        let url1 = Config.requestUrl + Config.followingInterface.getSinglePurposeInfo + `?purposeId=${id}`;
        fetch(url1, {method: 'POST'}).then(res => res.json()).then(responseText => {
            console.log(555, responseText);
            if (responseText.success) {
                let obj = JSON.parse(responseText.obj);
                console.log(66666666666666, obj);

                if (obj.length !== 0) {
                    const {cityName, countyName, noLinkTime, customerLabelTypeId, id, deleteStatus, companyName, provinceName, purposeResponsiblePersonName, firstTimeStr, personChargeName, lastFollowTimeStr, createTimeStr, customerLabelTypeName, purposeSourceName,} = obj;
                    this.setState({
                        createPerson: purposeResponsiblePersonName,
                        saleManager: personChargeName,
                        followLast: lastFollowTimeStr,
                        createTime: createTimeStr,
                        firstVisitTime: firstTimeStr,
                        intentionSource: purposeSourceName,
                        customerLabel: customerLabelTypeName,
                        homeLocation: (StringUtils.isEmpty(provinceName) && StringUtils.isEmpty(cityName)) ? '暂无' : provinceName + '>' + cityName,
                        intentionID: id,
                        customerLabelTypeId,
                        countyName,
                        intentionState: deleteStatus,
                        company: companyName,
                        noLinkTime
                    });
                }
            }
            this._queryFollowingInfo(id);

        }).catch(error => {
            Toast.fail(error);
            this.setState({visible: false});
        })
    }
    _queryFollowingInfo = (id) => {
        let url = Config.requestUrl + Config.followingInterface.getFollowingInfo + `?purposeId=${id}`;
        console.log(666, url);
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            this.setState({visible: false}, () => {
                if (responseText.success) {
                    let obj = JSON.parse(responseText.obj);
                    obj.shift();
                    console.log(6666, obj);
                    this.setState({followInfoList: obj});

                }
                this._querySaleChance(id)
            });

        }).catch(error => {
            Toast.fail(error);
        });
    }
    //查询销售机会
    _querySaleChance = (id) => {
        let url2 = Config.requestUrl + Config.followingInterface.getSaleChance + `?purposeId=${id}`;
        fetch(url2, {method: 'POST'}).then(res => res.json()).then(responseText => {
            if (responseText.success) {
                let obj = JSON.parse(responseText.obj);
                console.log(444, obj);
                this.setState({saleChanceList: obj});
            }
            this._queryContactInfo(id)

        }).catch(error => {
            Toast.fail(error)
        })
    }
    //查询联系人信息
    _queryContactInfo = (id) => {

        let url3 = Config.requestUrl + Config.followingInterface.getContactInfo + `?purposeId=${id}`;
        fetch(url3, {method: 'POST'}).then(res => res.json()).then(responseText => {
            if (responseText.success) {
                let obj = JSON.parse(responseText.obj);
                console.log(555, obj);
                this.setState({contactList: obj});


            }
            this._queryTaskInfo(id);


        }).catch(error => {
            Toast.fail(error);
        });
    }
    //查询任务信息
    _queryTaskInfo = (id) => {
        let url4 = Config.requestUrl + Config.followingInterface.getTaskInfo + `?purposeId=${id}`;
        fetch(url4, {method: 'POST'}).then(res => res.json()).then(responseText => {
            if (responseText.success) {
                let obj = JSON.parse(responseText.obj);
                console.log(6666, obj);
                this.setState({taskList: obj});
            }
            this._querySignedInfo(id)
        }).catch(error => {
            Toast.fail(error)
        })
    }
    //查询已签约信息
    _querySignedInfo = (id) => {
        let url5 = Config.requestUrl + Config.followingInterface.getSignedContractInfo + `?purposeId=${id}`;
        fetch(url5, {method: 'POST'}).then(res => res.json()).then(responseText => {
            console.log(555, responseText);
            if (responseText.success) {
                let obj = JSON.parse(responseText.obj);
                this.setState({contractList: obj});
            }

        }).catch(error => {
            Toast.fail(error)
        })
    }

    componentDidMount(): void {
        const {params} = this.props.navigation.state;
        this._queryIntentionDetail(params.intentionId);
        this.update_customer_archives_follow = DeviceEventEmitter.addListener('update_customer_archives_follow', result => {
            if (result) {
                this._queryFollowingInfo(params.intentionId)
            }
        })
        this.update_customer_archives_sales_chance = DeviceEventEmitter.addListener('update_customer_archives_sales_chance', result => {
            if (result) {
                this._querySaleChance(params.intentionId)
            }
        })
        this.update_customer_archives_contact = DeviceEventEmitter.addListener('update_customer_archives_contact', result => {
            if (result) {
                this._queryContactInfo(params.intentionId)
            }
        })
        this.update_customer_archives_task = DeviceEventEmitter.addListener('update_customer_archives_task', result => {
            if (result) {
                this._queryTaskInfo(params.intentionId)
            }
        })
    }

    componentWillUnmount(): void {
        this.update_customer_archives_follow && this.update_customer_archives_follow.remove();
        this.update_customer_archives_sales_chance && this.update_customer_archives_sales_chance.remove();
        this.update_customer_archives_contact && this.update_customer_archives_contact.remove();
        this.update_customer_archives_task && this.update_customer_archives_task.remove();

    }

    _isExpand = () => {
        this.setState({isExpand: !this.state.isExpand});
    }
    _showActionSheet = () => {
        this.ActionSheet.show();
    }

    // 渲染
    render() {
        const {
            countyName, planTimeStr, noLinkTime, customerLabelTypeId, taskList, contractList,
            signedContractList, totalMoney, saleChanceId, contractNum, systemRequirementsName, planCompleteTime, taskTypeName, taskDetail, name, telephone, fixMobile, qq, wx, statusStr, recordTime, sysName, chanceID, createPerson, saleManager, customerLabel, intentionSource, firstVisitTime, createTime, followLast, title, intentionID, intentionState, company, homeLocation,
        } = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                <Title title={'客户档案'} back onPressBack={() => this.props.navigation.goBack()} forward
                       source={Images.add_menu} onPressForward={this._showActionSheet}/>
                <View>
                    <View>
                        <Cell titleFontSize={moderateScale(14)} color={'#999'} noBorder fontSize={moderateScale(14)}
                              height={verticalScale(40)} title={'意向ID：'} titleColor={'#333'} value={intentionID}/>
                        <View
                            style={{height: verticalScale(30), justifyContent: 'center', backgroundColor: '#fff'}}>
                            <View style={{
                                marginHorizontal: moderateScale(13),
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        fontFamily: "PingFang-SC-Medium",
                                        fontSize: moderateScale(14),
                                        color: "#333333"
                                    }}>公司名称：</Text>
                                    <Text style={{
                                        fontFamily: "PingFang-SC-Medium",
                                        fontSize: moderateScale(14),
                                        color: "#999", marginLeft: moderateScale(10)
                                    }}>{(company && company.length) > 12 ? company.substring(0, 12) + '****' : company}</Text>
                                    <Text style={{
                                        fontFamily: "PingFang-SC-Medium",
                                        fontSize: moderateScale(14),
                                        color: customerLabelTypeId === 1450 ? 'red' : customerLabelTypeId === '1454' ? '#2e93ff' : '#333',
                                        marginLeft: moderateScale(10)
                                    }}>【{customerLabel}】</Text>
                                </View>
                            </View>
                        </View>
                        {/*<Cell  titleFontSize={moderateScale(16)} noBorder fontSize={moderateScale(16)} fontFamily={'PingFang-SC-Bold'} height={verticalScale(40)} title={'公司名称'} titleColor={'#333'} titleFontFamily={'PingFang-SC-Bold'} value={(company&&company.length)>12?company.substring(0,12)+'****':company} color={customerLabelTypeId===1450?'#EC6C59':customerLabelTypeId==='1454'?'#2e93f':'#333'}/>*/}
                        <Cell title={'所在地：'} noBorder color={'#999'} value={homeLocation}/>
                        {/*<Cell  title={'客户标签'} noBorder textDecorationColor={customerLabelTypeId===1450?'red':customerLabelTypeId==='1454'?'#2e93ff':'#333'} textDecorationLine={'underline'}   color={customerLabelTypeId===1450?'red':customerLabelTypeId==='1454'?'#2e93ff':'#333'} value={customerLabel}/>*/}
                        {this.state.isExpand ? <Animated.View>
                            <Cell title={'创建人：'} titleColor={'#999'} noBorder color={'#999'}
                                  fontFamily={'PingFang-SC-Medium'}
                                  value={createPerson}/>
                            <Cell title={'销售经理：'} titleColor={'#999'} noBorder color={'#999'} value={saleManager}/>
                            <Cell title={'意向来源：'} noBorder titleColor={'#999'} color={'#999'}
                                  value={intentionSource}/>
                            <Cell title={'首访时间：'} noBorder titleColor={'#999'} color={'#999'}
                                  value={firstVisitTime}/>
                            <Cell title={'创建时间：'} noBorder titleColor={'#999'} color={'#999'} value={createTime}/>
                            <Cell title={'最后跟进：'} noBorder titleColor={'#999'} color={'#999'} value={followLast}/>
                            <Cell title={'未联系时长：'} noBorder titleColor={'#999'} color={'#999'} value={noLinkTime}/>
                        </Animated.View> : <Animated.View/>}
                        <Animated.View>
                            <TouchableOpacity activeOpacity={0.8} onPress={this._isExpand}>
                                <View style={{
                                    justifyContent: 'center',
                                    backgroundColor: '#fff',
                                    height: verticalScale(33)
                                }}>
                                    <Text style={{
                                        fontFamily: "PingFang-SC-Medium",
                                        fontSize: moderateScale(12),
                                        color: "#bbb", textAlign: 'center'
                                    }}>{this.state.isExpand ? '收起' : '展开'}</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        first: () => <FollowInfo {...this.props} CI={this}/>,
                        second: () => <ChanceInfo {...this.props} CI={this}/>,
                        third: () => <ContactInfo {...this.props} CI={this}/>,
                        fourth: () => <TaskInfo {...this.props} CI={this}/>,
                        fifth: () => <ContractInfo {...this.props} CI={this}/>,
                    })}
                    onIndexChange={index => this.setState({index})}
                    initialLayout={{width: Dimensions.get('window').width}}
                    renderTabBar={props =>
                        <TabBar
                            {...props}
                            style={{
                                backgroundColor: "#f5f5f5",
                            }}
                            getLabelText={({route}) => route.title}
                            labelStyle={{
                                fontSize: px2dp(28),
                            }}
                            tabStyle={{height: verticalScale(44),}}
                            indicatorStyle={{backgroundColor: '#2e93ff'}}
                            activeColor={'#2e93ff'}
                            inactiveColor={'#666666'}

                        />
                    }
                />
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    // title={'头像上传'}
                    options={['添加机会', '添加联系人', '添加任务', '添加合同', '取消']}
                    cancelButtonIndex={4}
                    destructiveButtonIndex={4}
                    onPress={(index) => {
                        if (index === 0) {
                            const {params} = this.props.navigation.state;
                            this.props.navigation.navigate('AddSalesChance', {
                                isEditState: false,
                                intentionId: params.intentionId
                            });
                        } else if (index === 1) {
                            const {params} = this.props.navigation.state;
                            this.props.navigation.navigate('AddContact', {intentionId: params.intentionId});
                        } else if (index === 2) {
                            const {params} = this.props.navigation.state;
                            this.props.navigation.navigate('AddTask', {intentionId: params.intentionId});
                        } else if (index === 3) {
                            const {params} = this.props.navigation.state;
                            this.props.navigation.navigate('SelectChance', {intentionId: params.intentionId,});
                        }
                        /* do something */
                    }
                    }
                />
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }
}
const DefaultInput = (props) => {
    return (
        <View style={{
            height: verticalScale(30),
            justifyContent: 'center',
            backgroundColor: 'transparent',
            borderBottomWidth: props.noBorder ? 0 : StyleSheet.hairlineWidth,
            borderBottomColor: '#e0e0e0'
        }}>
            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                <Text style={{
                    marginLeft: moderateScale(22), fontFamily: "PingFangSC-Medium",
                    fontSize: moderateScale(14),
                    color: "#333"
                }}>{props.title}</Text>
                <Text style={{
                    marginLeft: moderateScale(10),
                    textDecorationColor: props.textDecorationColor ? props.textDecorationColor : '#999',
                    textDecorationLine: props.textDecorationLine ? props.textDecorationLine : 'none',
                    color: props.color ? props.color : "#333333",
                    fontFamily: props.fontFamily ? props.fontFamily : "PingFang-SC-Medium",
                    fontSize: props.fontSize ? props.fontSize : moderateScale(14),
                }}>
                    {props.value}
                </Text>
            </View>
        </View>
    );
}
const Cell = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress} activeOpacity={0.8}>
            <View style={{
                height: props.height ? props.height : verticalScale(30),
                justifyContent: 'center',
                backgroundColor: '#fff',
                borderBottomWidth: props.noBorder ? 0 : StyleSheet.hairlineWidth,
                borderBottomColor: '#e0e0e0'
            }}>
                <View style={{flexDirection: 'row', alignItems: 'center',}}>
                    <Text style={{
                        marginLeft: moderateScale(13),
                        fontFamily: props.titleFontFamily ? props.titleFontFamily : "PingFang-SC-Medium",
                        fontSize: props.titleFontSize ? props.titleFontSize : moderateScale(14),
                        color: props.titleColor ? props.titleColor : "#333333"
                    }}>{props.title}</Text>
                    <Text style={{
                        marginLeft: moderateScale(10),
                        textDecorationColor: props.textDecorationColor ? props.textDecorationColor : '#333333',
                        textDecorationLine: props.textDecorationLine ? props.textDecorationLine : 'none',
                        color: props.color ? props.color : "#333333",
                        fontFamily: props.fontFamily ? props.fontFamily : "PingFang-SC-Medium",
                        fontSize: props.fontSize ? props.fontSize : moderateScale(14),
                    }}>
                        {props.value}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

class FollowInfo extends PureComponent {
    constructor() {
        super();
        this.state = {
            checked: false,

        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
    }

    _keyboardDidHide = () => {

    }
    _jumpToFollowDetail = () => {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('followDetail', {intentionId: params.intentionId});
    }
    _renderHtml=(html)=>{
        if(!StringUtils.isEmpty(html)){
            console.log(333,html);
            return(
                <View style={{marginHorizontal: px2dp(30),flexDirection: 'row',alignItems:'center',}}>
                    <HTML html={html} baseFontStyle={{
                        fontSize: moderateScale(13),
                        color: "#333333",
                    }}   onLinkPress={(evt, href) => {
                        console.log(333,href);
                        // Linking.openURL(href)
                    } }   imagesMaxWidth={Dimensions.get('window').width-160}/>
                </View>
            );
        }else{
            return(<View/>);
        }
    }
    _renderItem = ({item}) => {
        console.log(1234567, item);
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={this._jumpToFollowDetail}>
                <View>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: px2dp(25)}}>
                        <Image source={Images.solid__} style={{width: px2dp(32), height: px2dp(32)}}/>
                        <Text style={{
                            marginLeft: px2dp(20),
                            fontFamily: "PingFangSC-Medium",
                            fontSize: moderateScale(15),
                            color: "#999",
                        }}>{item.createtimeStr}</Text>
                    </View>
                    <View style={{
                        marginLeft: px2dp(40),
                        marginTop: -px2dp(5),
                        width: px2dp(2),
                        height: px2dp(30),
                        backgroundColor: '#e0e0e0'
                    }}/>
                </View>
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: px2dp(10),
                    marginHorizontal: px2dp(26),
                    paddingLeft: px2dp(30),
                    // paddingRight: px2dp(30)
                }}>
                    <View style={{marginLeft: px2dp(20), marginBottom: px2dp(20)}}>
                        <View style={{
                            paddingVertical: moderateScale(20),
                            justifyContent: 'center',
                            backgroundColor: '#fff',
                        }}>
                                {this._renderHtml(item.showMesTitleModel)}
                                <View style={{marginTop: moderateScale(10)}}>
                                    {this._renderHtml(unescape(item.followContent))}
                                </View>
                        </View>

                    </View>
                </View>
                <View style={{marginLeft: px2dp(40), width: px2dp(2), height: px2dp(30), backgroundColor: '#e0e0e0'}}/>
            </TouchableOpacity>
        );
    }
    _addFollowingInfo = () => {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('AddFollowing', {intentionId: params.intentionId});
    }

    render() {
        const {followInfoList} = this.props.CI.state;
        console.log(333, this.state);
        // {marginTop: px2dp(20),}
        return (
            <View style={[{flex: 1},]}>
                <View style={{marginTop:px2dp(30)}}/>
                <FlatList
                    data={followInfoList}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ListEmptyComponent={
                        <View
                            style={{
                                height: SCREEN_HEIGHT / 2,
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: SCREEN_WIDTH
                            }}>
                            <Image source={Images.noData}
                                   style={{width: px2dp(150), height: px2dp(150)}}/>
                            <Text style={{fontSize: px2dp(28), color: '#999', margin: px2dp(50)}}> 没有数据哦!</Text></View>}
                />
                {/*<View >*/}
                {/*<View>*/}
                {/*    <View style={{flexDirection: 'row', alignItems: 'center',marginLeft:px2dp(25)}}>*/}
                {/*        <Image source={Images.time_slot} style={{width: px2dp(32), height: px2dp(32)}}/>*/}
                {/*        <Text style={{*/}
                {/*            marginLeft: px2dp(20),*/}
                {/*            fontFamily: "PingFangSC-Medium",*/}
                {/*            fontSize: moderateScale(15),*/}
                {/*            color: "#999",*/}
                {/*        }}>08-24</Text>*/}
                {/*    </View>*/}
                {/*    <View style={{marginLeft: px2dp(40),marginTop:-px2dp(5),width:px2dp(2),height:px2dp(30),backgroundColor:'#e0e0e0'}}/>*/}
                {/*</View>*/}
                {/*<View style={{backgroundColor:'#fff',borderRadius:px2dp(10),marginHorizontal:px2dp(26),paddingLeft:px2dp(45),paddingRight:px2dp(30)}}>*/}
                {/*    <View style={{height: px2dp(80), justifyContent: 'center'}}>*/}
                {/*        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>*/}
                {/*            <View style={{flexDirection:'row',alignItems:'center'}}>*/}
                {/*              <Image source={Images.avatar__} style={{width:px2dp(48),height:px2dp(48)}} />*/}
                {/*                <Text style={{*/}
                {/*                    marginLeft:px2dp(20),*/}
                {/*                    fontFamily: "PingFangSC-Medium",*/}
                {/*                    fontSize: moderateScale(16),*/}
                {/*                    fontWeight:'bold',*/}
                {/*                    color: "#333",*/}
                {/*                }}>周小龙</Text>*/}
                {/*                <Text style={{*/}
                {/*                    marginLeft:px2dp(12),*/}
                {/*                    fontFamily: "PingFangSC-Medium",*/}
                {/*                    fontSize: moderateScale(14),*/}
                {/*                    color: "#999",*/}
                {/*                }}>销售经理</Text>*/}
                {/*            </View>*/}
                {/*            <Text style={{*/}
                {/*                fontFamily: "PingFangSC-Medium",*/}
                {/*                fontSize: moderateScale(14),*/}
                {/*                color: "#333",*/}
                {/*            }}>添加了【客户画像】</Text>*/}
                {/*        </View>*/}
                {/*    </View>*/}
                {/*    <View style={{alignItems:'center'}}>*/}
                {/*            <Image source={Images.pic} style={{marginBottom:px2dp(20)}}/>*/}
                {/*    </View>*/}
                {/*</View>*/}
                {/*<View style={{marginLeft: px2dp(40),width:px2dp(2),height:px2dp(30),backgroundColor:'#e0e0e0'}}/>*/}
                {/*</View>*/}
                <View style={{position: 'relative', justifyContent: 'flex-end', bottom: 0, zIndex: 9999,}}>
                    <TouchableOpacity opacity={0.8} onPress={this._addFollowingInfo}>
                        <View style={{height: px2dp(90), justifyContent: 'center', backgroundColor: '#F8F8FA'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: px2dp(26),}}>
                                <Input style={{
                                    flex: 1,
                                    height: px2dp(60),
                                    textAlign: 'center',
                                    fontSize: px2dp(24),
                                }} editable={false} onSubmitEditing={Keyboard.dismiss} placeholder={'快速记录跟进'}/>
                                {/*{this.state.sendMsgBtn ? <TouchableOpacity activeOpacity={0.8} onPress={this._sendMsg}>*/}
                                {/*    <View*/}
                                {/*        style={{marginLeft: px2dp(15), borderRadius: px2dp(5), backgroundColor: '#2e93ff'}}>*/}
                                {/*        <Text style={{*/}
                                {/*            paddingHorizontal: px2dp(10),*/}
                                {/*            fontSize: px2dp(24),*/}
                                {/*            color: '#fff',*/}
                                {/*            paddingVertical: px2dp(8)*/}
                                {/*        }}>发送</Text>*/}
                                {/*    </View>*/}
                                <View style={{marginLeft: px2dp(15),}}>
                                    <Image source={Images.add_select} style={{width: px2dp(32), height: px2dp(32)}}
                                           resizeMode={'contain'}/>
                                </View>

                            </View>
                        </View>
                    </TouchableOpacity>
                    {/*{this.state.visibility ? <Animated.View style={{backgroundColor: '#fff', height: px2dp(320)}}>*/}
                    {/*    <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: px2dp(10)}}>*/}
                    {/*        <TouchableOpacity activeOpacity={0.8} onPress={this._getAvatarFromGallery}>*/}
                    {/*            <View style={{width: Dimensions.get('window').width / 8, alignItems: 'center'}}>*/}
                    {/*                <Image source={Images.gallery} resizeMode={'contain'}*/}
                    {/*                       style={{width: px2dp(48), height: px2dp(48)}}/>*/}
                    {/*            </View>*/}
                    {/*        </TouchableOpacity>*/}
                    {/*        <TouchableOpacity activeOpacity={0.8} onPress={this._getAvatarFromCapture}>*/}
                    {/*            <View style={{width: Dimensions.get('window').width / 8, alignItems: 'center'}}>*/}
                    {/*                <Image source={Images.camera} resizeMode={'contain'}*/}
                    {/*                       style={{width: px2dp(48), height: px2dp(48)}}/>*/}
                    {/*            </View>*/}
                    {/*        </TouchableOpacity>*/}
                    {/*    </View>*/}
                    {/*</Animated.View> : null}*/}
                </View>
            </View>
        );
    }
}

class ChanceInfo extends PureComponent {
    _jumpToSalesChanceDetail = (item) => {
        console.log(333, item);
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('SalesChanceDetail', {id: item.id, intentionId: params.intentionId});
    }
    _renderItem = ({item}) => {
        return (
            <TouchableOpacity onPress={() => this._jumpToSalesChanceDetail(item)}>
                <View style={{marginTop: moderateScale(15), paddingHorizontal: moderateScale(13),}}>
                    <View style={{
                        borderRadius: scale(5),
                        backgroundColor: "#f5f5f5",
                        shadowColor: "rgba(0, 0, 0, 0.06)",
                        shadowOffset: {
                            width: 0,
                            height: verticalScale(2)
                        },
                        borderWidth: px2dp(1),
                        borderColor: '#e0e0e0',
                        shadowRadius: scale(10),
                        shadowOpacity: 1,
                    }}>
                        <View style={{height: verticalScale(30), justifyContent: 'center'}}>
                            <View style={{marginLeft: moderateScale(26), flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Medium",
                                    fontSize: moderateScale(15),
                                    color: "#333", fontWeight: 'bold'
                                }}>{item.systemRequirementsName}</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: px2dp(20)}}>
                                    <Image source={item.status === 1 ? Images.solid : Images.solid_}
                                           style={{width: px2dp(32), height: px2dp(32)}} resizeMode={'contain'}/>
                                    <Text style={{
                                        marginLeft: px2dp(8), fontFamily: "PingFangSC-Medium",
                                        fontSize: px2dp(24),
                                        color: "#333",
                                    }}>{item.statusStr}</Text>
                                </View>
                            </View>
                        </View>
                        <DefaultInput title={'签约可能性：'} value={item.sixtyDayPossibilityStr} noBorder/>
                        {/*<DefaultInput title={'系统类型'} value={item.systemRequirementsName} noBorder/>*/}
                        <DefaultInput title={'报价范围：'} value={item.budgetQuotedRangeStr} noBorder/>
                        {/*<DefaultInput title={'机会状态'} color={item.status===1?'#2e93ff':'#F8F8FA'} value={item.statusStr} noBorder/>*/}
                        <DefaultInput title={'机会状态：'} value={item.statusStr} noBorder/>
                        <DefaultInput title={'机会ID：'} value={item.id} noBorder/>
                        <DefaultInput title={'录入时间：'} value={item.createStr} noBorder/>
                        {/*{StringUtils.isEmpty(item.remark)?<View/>:<DefaultInput title={'需求描述'} value={item.remark} noBorder/>}*/}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
    _keyExtractor = (item, index) => index;

    render() {
        const {saleChanceList} = this.props.CI.state;
        return (
            <View style={{flex: 1}}>
                <Text style={{
                    fontFamily: "PingFang-SC-Medium",
                    fontSize: px2dp(26),
                    textAlign: 'center',
                    marginTop: px2dp(24),
                    color: "#333"
                }}>当前意向共有{saleChanceList.length}个机会</Text>
                <FlatList
                    data={saleChanceList}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ListEmptyComponent={
                        <View
                            style={{
                                height: SCREEN_HEIGHT / 2,
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: SCREEN_WIDTH
                            }}>
                            <Image source={Images.noData}
                                   style={{width: px2dp(150), height: px2dp(150)}}/>
                            <Text style={{fontSize: px2dp(28), color: '#999', margin: px2dp(50)}}> 没有数据哦!</Text></View>}
                />
            </View>

        );
    }
}

class ContactInfo extends PureComponent {
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
        console.log(item, 111);
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => {
                const {params}=this.props.navigation.state;
                this.props.navigation.navigate('LinkPersonDetail', {id: item.id,purposeId:params.intentionId})
            }}>
                <View style={{marginTop: moderateScale(15), paddingHorizontal: moderateScale(13),}}>
                    <View style={{
                        borderRadius: scale(5),
                        backgroundColor: "#f5f5f5",
                        shadowColor: "rgba(0, 0, 0, 0.06)",
                        shadowOffset: {
                            width: 0,
                            height: verticalScale(2)
                        },
                        borderWidth: px2dp(1),
                        borderColor: '#e0e0e0',
                        shadowRadius: scale(10),
                        shadowOpacity: 1,
                    }}>
                        <View style={{height: verticalScale(30), justifyContent: 'center',}}>
                            <View style={{marginLeft: moderateScale(26), flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Medium",
                                    fontSize: moderateScale(15),
                                    fontWeight: 'bold',
                                    color: "#333"
                                }}>{item.linkName}</Text>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => this._callPhone(item.telephone)}>
                                    <Text style={{
                                        marginLeft: moderateScale(7), fontFamily: "PingFangSC-Medium",
                                        fontSize: moderateScale(15),
                                        color: "#2e93ff"
                                    }}>{item.sex}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/*<DefaultInput editable={false} title={'姓名'} color={'#2e93ff'} value={item.linkName} noBorder/>*/}
                        <DefaultInput editable={false} title={'电话：'} onPress={() => this._callPhone(item.telephone)}
                                      value={StringUtils.isEmpty(item.telephone) ? '暂无' : item.telephone} noBorder/>
                        {/*<DefaultInput editable={false} title={'固定电话'} onPress={()=>this._callPhone(item.phone)} value={StringUtils.isEmpty(item.phone)?'暂无':item.phone} noBorder/>*/}
                        <DefaultInput editable={false} title={'QQ：'}
                                      value={StringUtils.isEmpty(item.qq) ? '暂无' : item.qq} noBorder/>
                        <DefaultInput editable={false} title={'微信：'}
                                      value={StringUtils.isEmpty(item.weChat) ? '暂无' : item.weChat} noBorder/>
                        {/*<DefaultInput editable={false} title={'邮箱'} value={StringUtils.isEmpty(item.email)?'暂无':item.email} noBorder/>*/}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    // 渲染
    render() {
        const {contactList} = this.props.CI.state;
        return (
            <View style={{flex: 1}}>
                <Text style={{
                    fontFamily: "PingFang-SC-Medium",
                    fontSize: px2dp(26),
                    textAlign: 'center',
                    marginTop: px2dp(24),
                    color: "#333"
                }}>当前意向共有{contactList.length}个联系人</Text>
                <FlatList
                    data={contactList}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ListEmptyComponent={
                        <View
                            style={{
                                height: SCREEN_HEIGHT / 2,
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: SCREEN_WIDTH
                            }}>
                            <Image source={Images.noData}
                                   style={{width: px2dp(150), height: px2dp(150)}}/>
                            <Text style={{fontSize: px2dp(28), color: '#999', margin: px2dp(50)}}> 没有数据哦!</Text></View>}
                />
            </View>
        );
    }
}

class TaskInfo extends PureComponent {
    _renderItem = ({item}) => {
        console.log(4244, item);
        return (
            <TouchableOpacity activeOpacity={0.8}
                              onPress={() => this.props.navigation.navigate('TaskDetail', {id: item.id})}>
                <View style={{marginTop: moderateScale(15), paddingHorizontal: moderateScale(13),}}>
                    <View style={{
                        borderRadius: scale(5),
                        backgroundColor: "#f5f5f5",
                        shadowColor: "rgba(0, 0, 0, 0.06)",
                        shadowOffset: {
                            width: 0,
                            height: verticalScale(2)
                        },
                        borderWidth: px2dp(1),
                        borderColor: '#e0e0e0',
                        shadowRadius: scale(10),
                        shadowOpacity: 1,
                    }}>
                        <View style={{height: verticalScale(30), justifyContent: 'center',}}>
                            <View style={{marginLeft: moderateScale(26), flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{
                                    fontFamily: "PingFangSC-Medium",
                                    fontSize: moderateScale(15),
                                    fontWeight: 'bold',
                                    color: "#333"
                                }}>{item.executeTypeName}</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: px2dp(20)}}>
                                    <Image source={item.taskStatus === 2 ? Images.solid_ : Images.solid}
                                           style={{width: px2dp(32), height: px2dp(32)}} resizeMode={'contain'}/>
                                    <Text style={{
                                        marginLeft: moderateScale(7), fontFamily: "PingFangSC-Medium",
                                        fontSize: px2dp(24),
                                        color: '#666'
                                    }}>{item.taskStatus === 1 ? '跟进中' : item.taskStatus === 2 ? '已完成' : item.taskStatus === 3 ? '已取消' : item.taskStatus === 4 ? '已延期' : ''}</Text>
                                </View>
                            </View>
                        </View>
                        <DefaultInput title={'任务目的：'} value={item.taskTypeName} noBorder/>
                        {/*<DefaultInput  title={'执行方式'}  value={item.executeTypeName} noBorder/>*/}
                        <DefaultInput title={'计划时间：'} value={`${item.planTimeStr}`} noBorder/>
                        {/*{item.taskStatus===2?<DefaultInput  title={'实际执行时间'} value={`${item.actTimeStr}`} noBorder/>:<View/>}*/}
                        {/*<DefaultInput  title={'执行人'} value={item.recipientPersonName} noBorder/>*/}
                        {/*{item.taskStatus===2?<DefaultInput  title={'处理结果'} value={StringUtils.isEmpty(item.changeResult)?'暂无':item.changeResult} noBorder/>:<View/>}*/}
                        <DefaultInput title={'任务要求：'}
                                      value={StringUtils.isEmpty(item.taskDetail) ? '暂无' : unescape(item.taskDetail)}
                                      noBorder/>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
    _keyExtractor = (item, index) => index;

    render() {
        const {taskList} = this.props.CI.state;
        return (
            <View style={{flex: 1}}>
                <Text style={{
                    fontFamily: "PingFang-SC-Medium",
                    fontSize: px2dp(26),
                    textAlign: 'center',
                    marginTop: px2dp(24),
                    color: "#333"
                }}>当前意向共有{taskList.length}个任务</Text>
                <FlatList
                    data={taskList}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ListEmptyComponent={
                        <View
                            style={{
                                height: SCREEN_HEIGHT / 2,
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: SCREEN_WIDTH
                            }}>
                            <Image source={Images.noData}
                                   style={{width: px2dp(150), height: px2dp(150)}}/>
                            <Text style={{fontSize: px2dp(28), color: '#999', margin: px2dp(50)}}> 没有数据哦!</Text></View>}
                />
            </View>
        );
    }
}

class ContractInfo extends PureComponent {
    constructor() {
        super();
    }

    //格式化金额
    _formatMoney = (nStr) => {
        nStr += '';
        let x = nStr.split('.');
        let x1 = x[0];
        let x2 = x.length > 1 ? '.' + x[1] : '';
        let rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
    _jumpToSingleContractDetail=(id)=>{
        const {params}=this.props.navigation.state;
        this.props.navigation.navigate('ContractDetail', {id,intentionId:params.intentionId})
    }
    _renderItem = ({item}) => {
        let payMoney = this._formatMoney(item.payMoney);
        let conMoney = this._formatMoney(item.conMoney);
        let totalMoney = item.conMoney + item.payMoney;
        let percentage = (item.payMoney / totalMoney).toFixed(2);
        console.log(333, percentage);
        console.log('hhhhhh', item);
        return (
            <TouchableOpacity activeOpacity={0.8}
                              onPress={()=>this._jumpToSingleContractDetail(item.id)}>
                <View style={{
                    marginHorizontal: moderateScale(13),
                    marginTop: moderateScale(12),
                    borderRadius: scale(5),
                    backgroundColor: "#f5f5f5",
                    shadowColor: "rgba(0, 0, 0, 0.06)",
                    shadowOffset: {
                        width: 0,
                        height: verticalScale(2)
                    },
                    borderWidth: px2dp(1),
                    borderColor: '#e0e0e0',
                    shadowRadius: scale(10),
                    shadowOpacity: 1,
                }}>
                    <View style={{height: verticalScale(30), justifyContent: 'center', backgroundColor: '#f5f5f5',}}>
                        <View style={{
                            marginHorizontal: moderateScale(13),
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: moderateScale(15),
                                    fontWeight: 'bold',
                                    color: "#333"
                                }}>{item.systemRequirementsName}</Text>
                                {/*<Text style={{fontFamily: "PingFang-SC-Medium",*/}
                                {/*    fontSize: moderateScale(14),*/}
                                {/*    color: "#2e93ff",marginLeft:moderateScale(10)}}>{item.changeNumber}</Text>*/}
                            </View>
                            {/*<Text style={{fontFamily: "PingFang-SC-Medium",*/}
                            {/*    fontSize: moderateScale(14),*/}
                            {/*    color: "#118fb8",marginLeft:moderateScale(10)}}>{''}</Text>*/}
                        </View>
                    </View>
                    {/*<View style={{paddingBottom:moderateScale(13),borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:'#e0e0e0'}}>*/}
                    {/*    <View style={{marginTop:moderateScale(12),marginHorizontal:moderateScale(22),flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>*/}
                    {/*        <Text style={{fontFamily: "PingFang-SC-Medium",*/}
                    {/*            fontSize: moderateScale(14),*/}
                    {/*            color: "#333333"}}>已付{payMoney}元</Text>*/}
                    {/*        <Text style={{fontFamily: "PingFang-SC-Medium",*/}
                    {/*            fontSize: moderateScale(14),*/}
                    {/*            color: "#333333"}}>剩余{conMoney}元</Text>*/}
                    {/*    </View>*/}
                    {/*    <View style={{justifyContent:'center',flexDirection:'row',marginTop:moderateScale(13)}}>*/}
                    {/*        <Progress.Bar progress={percentage} width={scale(200)}/>*/}
                    {/*    </View>*/}
                    {/*    <View>*/}
                    {/*        <Text style={{fontFamily: "PingFang-SC-Medium",*/}
                    {/*            fontSize: moderateScale(14),*/}
                    {/*            textAlign:'right',*/}
                    {/*            marginRight:moderateScale(22),*/}
                    {/*            marginTop:moderateScale(13),*/}
                    {/*            color: "#333333"}}>共{this._formatMoney(totalMoney)}元</Text>*/}
                    {/*    </View>*/}
                    {/*</View>*/}
                    <DefaultInput editable={false} title={'合同总金额：'} value={this._formatMoney(totalMoney) + '元'}
                                  noBorder/>
                    <DefaultInput editable={false} title={'未付款：'} value={conMoney + '元'} noBorder/>
                    <DefaultInput editable={false} title={'合同编号：'} value={item.changeNumber} noBorder/>
                    {/*<DefaultInput editable={false} title={'购买系统'} value={item.systemRequirementsName} noBorder/>*/}
                    {/*<DefaultInput editable={false} title={'需求描述'} value={StringUtils.isEmpty(item.remark)?'暂无':item.remark} />*/}
                    {/*<TouchableOpacity onPress={()=>this._viewContract(item)}>*/}
                    {/*    <View style={{height:verticalScale(45),justifyContent:'center'}}>*/}
                    {/*        <Text style={{textAlign: 'center',fontFamily: "PingFang-SC-Medium",*/}
                    {/*            fontSize: moderateScale(14),*/}
                    {/*            color: "#2e93ff",marginLeft:moderateScale(10)}}>查看合同</Text>*/}
                    {/*    </View>*/}
                    {/*</TouchableOpacity>*/}
                </View>
            </TouchableOpacity>
        );
    }

    // 渲染
    render() {
        const {contractList} = this.props.CI.state;
        return (
            <View style={{flex: 1}}>
                <Text style={{
                    fontFamily: "PingFang-SC-Medium",
                    fontSize: px2dp(26),
                    textAlign: 'center',
                    marginTop: px2dp(24),
                    color: "#333"
                }}>当前意向共有{contractList.length}个合同</Text>
                <FlatList
                    data={contractList}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ListEmptyComponent={
                        <View
                            style={{
                                height: SCREEN_HEIGHT / 2,
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: SCREEN_WIDTH
                            }}>
                            <Image source={Images.noData}
                                   style={{width: px2dp(150), height: px2dp(150)}}/>
                            <Text style={{fontSize: px2dp(28), color: '#999', margin: px2dp(50)}}> 没有数据哦!</Text></View>}
                />
            </View>
        );
    }
}
