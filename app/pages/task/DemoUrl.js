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
    Clipboard,
    TextInput,
    Alert,
    ImageBackground,
    TouchableOpacity
} from 'react-native'
import Title from '../../components/Title';
import Collapsible from 'react-native-collapsible';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';
import Loading from "../../components/Loading";
import {Drawer} from "native-base";
import ControlPanel from "./ControlPanel";
// const SECTIONS = [
//     {
//         title: '社交电商系统',
//         content: {managementBackgroundUrl:'http://192.168.0.107:6036/',account:'admin',password:'admin'},
//     },
//     {
//         title: '社交电商系统',
//         content: {managementBackgroundUrl:'http://192.168.0.107:6036/',account:'admin',password:'admin'},
//     },
//     {
//         title: '社交电商系统',
//         content: {managementBackgroundUrl:'http://192.168.0.107:6036/',account:'admin',password:'admin'},
//     },
// ];
export default class DemoUrl extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            activeSections: [],
            collapsed: true,
            sections: [],
            visible: true,
        }
    }

    componentDidMount(): void {
        this._queryDemoUrlList('');
        this.updateDemoUrlListener = DeviceEventEmitter.addListener('updateDemoUrl', result => {
            console.log(333, result);
            this._queryDemoUrlList(result.dicId);
        })
    }

    componentWillUnmount(): void {
        this.updateDemoUrlListener && this.updateDemoUrlListener.remove();
    }

    _queryDemoUrlList = (type) => {
        let url = Config.requestUrl + Config.demoUrlPageInterface.demoUrlList + `?sortType=${type}`;
        console.log(333, url);
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            console.log(444, responseText);
            this.setState({visible: false}, () => {
                if (responseText.success) {
                    let sections = [];
                    const {list} = responseText.obj;
                    list && list.map(item => {
                        sections.push({
                            title: item.urlNanme,
                            content: {
                                managementBackgroundUrl: item.dpUrl,
                                account: item.loginName,
                                password: item.password,
                            }
                        });
                    })
                    this.setState({sections});
                }
            });

        }).catch(error => {
            Toast.fail(error)
        })
    }

    setSections = sections => {
        this.setState({
            activeSections: sections.includes(undefined) ? [] : sections,
        });
    };

    renderHeader = (section, _, isActive) => {
        return (
            <Animatable.View
                duration={400}
                style={{
                    backgroundColor: '#F8F8FA',
                    height: verticalScale(40),
                    justifyContent: 'center',
                    borderBottomColor: '#e6e6e6',
                    borderBottomWidth: scale(1 / 2)
                }}
            >
                <View style={{
                    marginLeft: moderateScale(23),
                    marginRight: moderateScale(21),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Text style={{
                        fontFamily: "PingFangSC-Regular",
                        fontSize: moderateScale(16),
                        color: "#333333"
                    }}>{section.title}</Text>
                    <Image source={isActive ? Images.up : Images.down}
                           style={{width: scale(14), height: verticalScale(7)}}/>
                </View>
            </Animatable.View>
        );
    };

    _copyDemoUrl = async (url) => {
        Clipboard.setString(url);
        let str = await Clipboard.getString();
        console.log(str)//我是文本
        Toast.message('复制成功');
    }
    _copyAccount = async (account) => {
        Clipboard.setString(account);
        let str = await Clipboard.getString();
        console.log(str)//我是文本
        Toast.message('复制成功');
    }

    _copyPassword = async (password) => {
        Clipboard.setString(password);
        let str = await Clipboard.getString();
        console.log(str)//我是文本
        Toast.message('复制成功');
    }
    renderContent = (section, _, isActive) => {
        return (
            <Animatable.View
                duration={400}
                style={{justifyContent: 'center', backgroundColor: '#fff'}}
            >
                <View style={{
                    marginLeft: px2dp(30),
                    marginRight: px2dp(40),
                    marginTop: px2dp(30),
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#666"
                        }}>管理后台：</Text>
                        <Text style={{
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            marginLeft: px2dp(20),
                            color: "#999", width: px2dp(540)
                        }}>
                            {section.content.managementBackgroundUrl}
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#666"
                        }}>账号：</Text>
                        <Text style={{
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            marginLeft: px2dp(20),
                            color: "#999"
                        }}>
                            {section.content.account}
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            color: "#666"
                        }}>密码：</Text>
                        <Text style={{
                            fontFamily: "PingFangSC-Regular",
                            fontSize: moderateScale(13),
                            marginLeft: px2dp(20),
                            color: "#999"
                        }}>
                            {section.content.password}
                        </Text>
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    marginTop: px2dp(30),
                    marginBottom: px2dp(40),
                    alignItems: 'center',
                    justifyContent: 'space-around'
                }}>
                    <TouchableOpacity activeOpacity={0.8}
                                      onPress={() => this._copyDemoUrl(section.content.managementBackgroundUrl)}>
                        <View style={{
                            borderRadius: px2dp(3),
                            borderWidth: scale(1 / 2),
                            borderColor: '#2e93ff',
                            backgroundColor: '#EFF8FE'
                        }}>
                            <Text style={{
                                fontFamily: "PingFang-SC-Medium",
                                fontSize: moderateScale(14),
                                paddingHorizontal: px2dp(6), paddingVertical: px2dp(4), color: '#2e93ff'
                            }}>
                                复制地址
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => this._copyAccount(section.content.account)}>
                        <View style={{
                            borderRadius: px2dp(3),
                            borderWidth: scale(1 / 2),
                            borderColor: '#2e93ff',
                            backgroundColor: '#EFF8FE'
                        }}>
                            <Text style={{
                                fontFamily: "PingFang-SC-Medium",
                                fontSize: moderateScale(14),
                                paddingHorizontal: px2dp(6), paddingVertical: px2dp(4), color: '#2e93ff'
                            }}>
                                复制账户
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => this._copyPassword(section.content.password)}>
                        <View style={{
                            borderRadius: px2dp(3),
                            borderWidth: scale(1 / 2),
                            borderColor: '#2e93ff',
                            backgroundColor: '#EFF8FE'
                        }}>
                            <Text style={{
                                fontFamily: "PingFang-SC-Medium",
                                fontSize: moderateScale(14),
                                paddingHorizontal: px2dp(6), paddingVertical: px2dp(4), color: '#2e93ff'
                            }}>
                                复制密码
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        );
    }
    openDrawer = () => {
        this.drawer._root.open()
    };
    // 渲染
    closeDrawer = () => {
        this.drawer._root.close()
    }

    // 渲染
    render() {
        const {activeSections, sections} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                <Title title={'演示地址'} back onPressBack={() => this.props.navigation.goBack()} forward
                       source={Images.menu_} onPressForward={this.openDrawer}/>
                <Drawer panCloseMask={0.20} openDrawerOffset={0.25} side={'right'} ref={(ref) => {
                    this.drawer = ref;
                }} content={<ControlPanel {...this.state} closeDrawer={
                    this.closeDrawer
                }/>}>
                    {/*<View>*/}
                    {/*    <View style={{height:px2dp(80),justifyContent:'center',backgroundColor:'#F8F8FA'}}>*/}
                    {/*       <View style={{flexDirection:'row',alignItems:'center'}}>*/}
                    {/*           <Text style={{*/}
                    {/*               fontFamily: "PingFangSC-Medium",*/}
                    {/*               fontSize: moderateScale(15),*/}
                    {/*               color: "#333",*/}
                    {/*               textDecorationLine:'underline'*/}
                    {/*           }}>常规跟进怎么和客户聊？</Text>*/}
                    {/*       </View>*/}
                    {/*    </View>*/}
                    {/*</View>*/}
                    <ScrollView showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}>
                        <Accordion
                            activeSections={activeSections}
                            sections={sections}
                            touchableComponent={TouchableOpacity}
                            expandMultiple={false}
                            renderHeader={this.renderHeader}
                            renderContent={this.renderContent}
                            duration={400}
                            onChange={this.setSections}
                        />
                    </ScrollView>
                    <Loading visible={this.state.visible}/>
                </Drawer>
            </SafeAreaView>
        );
    }

}
