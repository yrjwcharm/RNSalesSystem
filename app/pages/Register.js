import React, {PureComponent} from 'react';
import {SafeAreaView,StyleSheet,Image,FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../components/Title'
import SmallButton from "../components/SmallButton";
import {StringUtils} from "../utils";
import {Input} from "teaset";
export default class Register extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            username:'18311410379',
            inviteCode:'456',
            SMSCode:'467321',
        }
    }
    _sendVerifyCode=()=>{
        const {username,inviteCode,SMSCode}=this.state;
        if(!StringUtils.checkMobile(username)) {
            return;
        }
    }
    _register=()=>{
        const {username,inviteCode,SMSCode}=this.state;
        if(!StringUtils.checkMobile(username)) {
            return;
        }
        if(StringUtils.isEmpty(inviteCode)){
            Toast.info('请输入邀请码');
            return;
        }
        if(StringUtils.isEmpty(SMSCode)){
            Toast.info('请输入短信验证码');
        }
        this.props.navigation.goBack();
    }
    // 渲染
    render() {
        const {username,inviteCode,SMSCode}=this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#eee'}}>
                <Title title="注册" />
                <View style={{marginHorizontal:moderateScale(13),marginTop:moderateScale(11),borderRadius: scale(5),
                    backgroundColor: "#f5f5f5",
                    shadowColor: "rgba(0, 0, 0, 0.06)",
                    shadowOffset: {
                        width: 0,
                        height: verticalScale(2)
                    },
                    shadowRadius: scale(10),
                    shadowOpacity: 1,}}>
                    <BuildInput1 name={'手机号：'}  value={username} placeholder={'请输入手机号'} onChangeText={(text)=>{
                        this.setState({username:text});
                    }}/>
                    <BuildInput1 name={'邀请码：'}  value={inviteCode} placeholder={'请输入邀请码'} onChangeText={(text)=>{
                        this.setState({inviteCode:text});
                    }}/>
                    <DefaultInput name={'验证码：'}  placeholder={'请输入验证码'} value={SMSCode} onChangeText={(text)=>{
                        this.setState({SMSCode:text});
                    }} onPress={this._sendVerifyCode}/>
                </View>
                <View style={{marginTop:moderateScale(11)}}>
                    <SmallButton name={'注册'} onPress={this._register}/>
                </View>
            </SafeAreaView>
        );
    }

}
const BuildInput1=(props)=>{
    return(
        <View style={{backgroundColor:'#f5f5f5',borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:'#e6e6e6',paddingLeft:moderateScale(28),paddingRight:moderateScale(15),flexDirection:'row',justifyContent: 'space-between',alignItems:'center',height:verticalScale(50)}}>
            <Text style={{fontFamily: "PingFang-SC-Medium",
                fontSize: moderateScale(13),
                color: "#999999"}}>{props.name}</Text>
            <Input style={{backgroundColor:'transparent',borderWidth:0,fontFamily: "PingFang-SC-Medium",
                fontSize: moderateScale(14),
                textAlign:'left',
                flex:1,
                paddingLeft:moderateScale(33),
                color: "#333333"}}   placeholder={props.placeholder} value={props.value} onChangeText={props.onChangeText}/>
        </View>
    );
}
const DefaultInput=(props)=>{
    return(
        <View style={{backgroundColor:'#F5F5F5',borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:'#e6e6e6',paddingLeft:moderateScale(28),paddingRight:moderateScale(15),flexDirection:'row',justifyContent: 'space-between',alignItems:'center',height:verticalScale(50)}}>
            <Text style={{fontFamily: "PingFang-SC-Medium",
                fontSize: moderateScale(13),
                color: "#999999"}}>{props.name}</Text>
            <Input style={{backgroundColor:'transparent',borderWidth:0,fontFamily: "PingFang-SC-Medium",
                fontSize: moderateScale(14),
                textAlign:'left',
                flex:1,
                paddingLeft:moderateScale(33),
                color: "#333333"}} placeholder={props.placeholder} value={props.value} onChangeText={props.onChangeText}/>
            <TouchableOpacity activeOpacity={0.8} onPress={props.onPress}>
                <View style={{backgroundColor:'#118fb8',borderRadius: scale(4)}}>
                    <Text style={{fontSize:moderateScale(14),color:'#FFf',paddingHorizontal:moderateScale(12),paddingVertical:moderateScale(7)}}>验证码</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}
