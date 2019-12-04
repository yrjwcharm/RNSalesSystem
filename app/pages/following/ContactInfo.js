import React, {PureComponent} from 'react';
import {
    ScrollView,
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
    TouchableOpacity,
    NativeModules
} from 'react-native'
import Title from '../../components/Title'
import {Input} from "teaset";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view/index";
import Loading from "../../components/Loading";
import {StringUtils} from "../../utils";
export default class ContactInfo extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            contactInfo:'',    //联系信息
            name:'' ,           //姓名
            phone1:'' ,          //手机1
            phone2:''  ,         //手机2
            fixMobile:'',          //固定电话
            qq:'' ,                 //QQ
            wx:'' ,                 //微信
            email:'' ,              //邮箱
            contactList:[],         //联系人列表
            visible:true,
        }
    }
    componentDidMount(): void {
        const {params}=this.props.navigation.state;
        console.log(5555,params);
        let url=Config.requestUrl+Config.followingInterface.getContactInfo+`?purposeId=${params.intentionId}`;
        console.log(31133,url);
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            this.setState({visible:false},()=>{
                if(responseText.success){
                    let obj=JSON.parse(responseText.obj);
                    console.log(555,obj);
                    this.setState({contactList:obj});
                }
            });
        }).catch(error=>{
            Toast.fail(error)
            this.setState({visible:false});
        })
    }

    _keyExtractor = (item, index) => index;
    _callPhone=(url)=>{
        if(StringUtils.isEmpty(url)){
            return;
        }
        if(Platform.OS==='android'){
            NativeModules.NaviModule.callPhone(url);
        }else{
            Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                    console.log('Can\'t handle url: ' + url);
                } else {
                    return Linking.openURL(url);
                }
            }).catch(err => console.error('An error occurred', err));
        }
    }
    _renderItem=({item})=>{
        return(
            <View style={{marginTop:moderateScale(15),paddingHorizontal:moderateScale(13),}}>
                <View style={{borderRadius: scale(5),
                    backgroundColor: "#fff",
                    shadowColor: "rgba(0, 0, 0, 0.06)",
                    shadowOffset: {
                        width: 0,
                        height: verticalScale(2)
                    },
                    shadowRadius: scale(10),
                    shadowOpacity: 1,}}>
                    <View style={{height:verticalScale(40),justifyContent:'center',borderBottomColor:'#e0e0e0',borderBottomWidth:StyleSheet.hairlineWidth}}>
                        <View style={{marginLeft:moderateScale(26),flexDirection:'row',alignItems:'center'}}>
                            <Text style={{fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(15),
                                color: "#333"}}>联系信息</Text>
                            <TouchableOpacity activeOpacity={0.8} onPress={()=>this._callPhone(item.telephone)}>
                                <Text style={{marginLeft:moderateScale(7),	fontFamily: "PingFangSC-Medium",
                                    fontSize: moderateScale(15),
                                    color: "#2e93ff"}}>{item.telephone}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <DefaultInput editable={false} title={'姓名'} color={'#2e93ff'} value={item.linkName} noBorder/>
                    <DefaultInput editable={false} title={'手机'} onPress={()=>this._callPhone(item.telephone)} value={StringUtils.isEmpty(item.telephone)?'暂无':item.telephone} noBorder/>
                    <DefaultInput editable={false} title={'固定电话'} onPress={()=>this._callPhone(item.phone)} value={StringUtils.isEmpty(item.phone)?'暂无':item.phone} noBorder/>
                    <DefaultInput editable={false} title={'QQ'} value={StringUtils.isEmpty(item.qq)?'暂无':item.qq} noBorder/>
                    <DefaultInput editable={false} title={'微信'} value={StringUtils.isEmpty(item.weChat)?'暂无':item.weChat} noBorder/>
                    <DefaultInput editable={false} title={'邮箱'} value={StringUtils.isEmpty(item.email)?'暂无':item.email} noBorder/>
                </View>
            </View>
        );
    }
    // 渲染
    render() {
        const {contactList}=this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f2f2f2'}}>
                <Title title={'联系人信息'} back onPressBack={()=>this.props.navigation.goBack()}/>
                <FlatList
                    data={contactList}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
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
                />
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
const DefaultInput=(props)=>{
    return(
        <View style={{height:verticalScale(45),justifyContent:'center',backgroundColor: 'transparent',borderBottomWidth:props.noBorder?0:StyleSheet.hairlineWidth,borderBottomColor:'#e0e0e0'}}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Text style={{marginLeft:moderateScale(22),fontFamily: "PingFangSC-Medium",
                    fontSize: moderateScale(14),
                    color: "#333"}}>{props.title}</Text>
                <Text style={{marginRight:moderateScale(10),textDecorationColor:props.textDecorationColor?props.textDecorationColor:'#999',textDecorationLine:props.textDecorationLine?props.textDecorationLine:'none',color: props.color?props.color:"#333333",fontFamily: props.fontFamily?props.fontFamily:"PingFang-SC-Medium",fontSize:props.fontSize?props.fontSize:moderateScale(14),}}>
                    {props.value}
                </Text>
            </View>
        </View>
    );
}
