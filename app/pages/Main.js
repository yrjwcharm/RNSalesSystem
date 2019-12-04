import React, {PureComponent} from 'react';
import {View, ToastAndroid, Text, Image, BackHandler, Platform, DeviceEventEmitter, StatusBar} from 'react-native'
import TabNavigator from 'react-native-tab-navigator'
import Home from "./home/Home";
import Task from './task/Task'
import Profile from "./profile/Profile";
import Following from "./following/Main";
import Signed from './signed/S_Main'
import {Badge} from 'beeshell'
import IntentionSearch from "./task/IntentionSearch";
import {StringUtils} from "../utils";
export default class Main extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            selectedTab: 'home',
            badgeNum:0,
            statisticsType:'',
            date:'',

        }
    }
    componentWillMount(): void {
        if (Platform.OS === 'android'){
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
        StatusBar.setBackgroundColor('#F8F8FA')
        StatusBar.setNetworkActivityIndicatorVisible(true);
        global.height = px2dp(88);
    }
    componentWillUnmount(): void {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }
    onBackAndroid = () => {
        //禁用返回键
        if(this.props.navigation.isFocused()) {//判断   该页面是否处于聚焦状态
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                //最近2秒内按过back键，可以退出应用。
                // return false;
                BackHandler.exitApp();//直接退出APP
            }else{
                this.lastBackPressed = Date.now();
                ToastAndroid.show('再按一次退出应用', 1000);//提示
                return true;
            }
        }
    }
    // 渲染
    render() {
        let tabHeight=verticalScale(48);
        return (
            <TabNavigator  tabBarStyle = {{backgroundColor:'#F8F8FA',height:tabHeight,alignItems:'center'}}>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'home'}
                    title="首页"
                    titleStyle={{fontSize: px2dp(22),
                        color: "#999999"}}
                    selectedTitleStyle={{color: "#2e93ff",fontSize: px2dp(22),}}
                    renderIcon={() => <Image source={Images.home}  style={{width:px2dp(36),height:px2dp(36)}}/>}
                    renderSelectedIcon={() =><Image source={Images.home_selected}  style={{width:px2dp(36),height:px2dp(36)}}/>}
                    onPress={() => this.setState({selectedTab: 'home'})}>
                   <Home {...this.props} />
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'task'}
                    title="待办"
                    // renderBadge={() => <Badge label={badgeNum}/>}
                    titleStyle={{fontSize: px2dp(22),
                        color: "#999999"}}
                    selectedTitleStyle={{color: "#2e93ff",fontSize: px2dp(22),}}
                    renderIcon={() => <Image source={Images.task} style={{width:px2dp(36),height:px2dp(36)}}/>}
                    renderSelectedIcon={() =><Image source={Images.task_selected}  style={{width:px2dp(36),height:px2dp(36)}}/>}
                    onPress={() => this.setState({selectedTab: 'task'})}>
                   <Task {...this.props} />
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'following'}
                    title="跟进中"
                    titleStyle={{fontSize: px2dp(22),
                        color: "#999999"}}
                    selectedTitleStyle={{color: "#2e93ff",fontSize: px2dp(22),}}
                    renderIcon={() => <Image source={Images.following}  style={{width:px2dp(36),height:px2dp(36)}}/>}
                    renderSelectedIcon={() =><Image source={Images.following_selected}  style={{width:px2dp(36),height:px2dp(36)}}/>}
                    onPress={() => this.setState({selectedTab: 'following'})}>
                   <Following {...this.props}  />
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'signed'}
                    title="已签约"
                    titleStyle={{fontSize: px2dp(22),
                        color: "#999999"}}
                    selectedTitleStyle={{color: "#2e93ff",fontSize: px2dp(22),}}
                    renderIcon={() => <Image source={Images.sign}  style={{width:px2dp(36),height:px2dp(36)}}/>}
                    renderSelectedIcon={() =><Image source={Images.sign_selected} style={{width:px2dp(36),height:px2dp(36)}}/>}
                    onPress={() => this.setState({selectedTab: 'signed'})}>
                   <Signed {...this.props}  />
                </TabNavigator.Item>
                {/*<TabNavigator.Item*/}
                {/*    selected={this.state.selectedTab === 'mine'}*/}
                {/*    title="我的"*/}
                {/*    titleStyle={{fontSize: px2dp(22),*/}
                {/*        color: "#999999"}}*/}
                {/*    selectedTitleStyle={{color: "#118fb8",fontSize: px2dp(22),}}*/}
                {/*    renderIcon={() => <Image source={Images.mine} style={{width:px2dp(34),height:px2dp(36)}}/>}*/}
                {/*    renderSelectedIcon={() =><Image source={Images.mine_selected} style={{width:px2dp(34),height:px2dp(36)}}/>}*/}
                {/*    onPress={() => this.setState({selectedTab: 'mine'})}>*/}
                {/*   <Profile {...this.props}/>*/}
                {/*</TabNavigator.Item>*/}
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'intention'}
                    title="搜索"
                    titleStyle={{fontSize: px2dp(22),
                        color: "#999999"}}
                    selectedTitleStyle={{color: "#2e93ff",fontSize: px2dp(22),}}
                    renderIcon={() => <Image source={Images.intention} style={{width:px2dp(34),height:px2dp(36)}}/>}
                    renderSelectedIcon={() =><Image source={Images.intention_selected} style={{width:px2dp(34),height:px2dp(36)}}/>}
                    onPress={() => this.setState({selectedTab: 'intention'})}>
                   <IntentionSearch {...this.props}/>
                </TabNavigator.Item>
            </TabNavigator>
        );
    }

}
