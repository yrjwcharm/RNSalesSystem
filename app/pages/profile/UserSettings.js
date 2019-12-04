import React, {PureComponent} from 'react';
import {ScrollView,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../../components/Title'
import {Input} from "teaset";
import SmallButton from "../../components/SmallButton";
import {StackActions,NavigationActions} from 'react-navigation'
import * as ImagePicker from "react-native-image-crop-picker";
export default class UserSettings extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
    }
    _exitLogin=()=>{
        //重置路由代码
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
        });
        this.props.navigation.dispatch(resetAction);
    }
    // 渲染
    render() {
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#eee'}}>
                <Title title={'用户设置'} back onPressBack={()=>this.props.navigation.goBack()}/>
                <View style={{marginTop:moderateScale(11)}}>
                <DefaultInput title={'账号'} value={'yrjwcharm'}/>
                <DefaultInput title={'手机号'} value={'18311410379'}/>
                <SmallButton name={'退出登录'} onPress={this._exitLogin}/>
                </View>
            </SafeAreaView>
        );
    }

}
const DefaultInput=(props)=>{
    return(
        <View style={{height:verticalScale(45),justifyContent:'center',backgroundColor: '#fff',borderBottomWidth:scale(1/2),borderBottomColor:'#e0e0e0'}}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Text style={{marginLeft:moderateScale(13),fontFamily: "PingFangSC-Regular",
                    fontSize: moderateScale(14),
                    color: "#333333"}}>{props.title}</Text>
                <Input value={props.value} style={{width:scale(200),textAlign: 'center',
                    height: verticalScale(33),
                    borderRadius: moderateScale(2),
                    backgroundColor: "transparent",
                    borderStyle: "solid",
                    borderWidth:0,
                    borderColor: "#dddddd",fontFamily: "PingFangSC-Regular",
                    fontSize: moderateScale(14),
                    flex:1,
                    color: props.color?props.color:"#333333"

                }} />



            </View>
        </View>
    );
}
