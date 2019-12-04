import React, {PureComponent} from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    ImageBackground,
    SafeAreaView,
    Image,
    TouchableOpacity,
    TouchableNativeFeedback,
    TouchableHighlight,
    Text,
    TextInput,
    StatusBar,
    Platform,
} from 'react-native' ;
import Title from '../components/Title'
import SmallButton from "../components/SmallButton";
import Loading from "../components/Loading";
import {StringUtils} from "../utils/StringUtils";
import {Dialog} from "beeshell";
import {Input} from "teaset";

const {width, height} = Dimensions.get('window');
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

export default class Login extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            username: '',
            password: '',
            visible: false,
            showPassword: false,
            password_visibility: false,
            username_clear: false,
        }

    }

    _login = () => {
        const {username, password} = this.state;
        if (StringUtils.isEmpty(username)) {
            Toast.info('请输入用户名');
            return;
        }
        if (StringUtils.isEmpty(password)) {
            Toast.info('请输入密码');
            return;
        }
        let url = Config.requestUrl + Config.loginInterface.doLogin + `?username=${username}&password=${password}`;
        console.log("111111", url);
        this.setState({visible: true}, () => {
            fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
                console.log(333, responseText);
                this.setState({visible: false}, () => {
                    if (responseText.success) {
                        const {success, msgStr} = responseText.obj;
                        if (success) {
                            Toast.message(msgStr);
                            store.save('userInfo', responseText.obj).then(() => {
                                this.props.navigation.navigate('Main');
                            })
                        } else {
                            Toast.message(msgStr);
                        }

                    } else {
                        Toast.message('登录失败');
                    }
                });
            }).catch(error => {
                Toast.fail(error)
                this.setState({visible: false});
            })
        });
    }
    _toggle = () => {
        console.log(333, 'zoule');
        this.setState({password_visibility: !this.state.password_visibility});

    }
    _focusOrBlur = () => {
        this.setState({username_clear: !this.state.username_clear});
    }
    _clear = () => {
        this.setState({username: ''});
    }

    // 渲染
    render() {
        const {username, password} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false}
                                         keyboardShouldPersistTaps={Platform.OS === 'android' ? 'always' : 'never'}>
                    <View>
                        <View style={{alignItems: 'center', marginTop: px2dp(20)}}>
                            <Image source={Images.login} resizeMode={'contain'}
                                   style={{width: px2dp(600), height: px2dp(640)}}/>
                        </View>
                        <View style={{marginTop: px2dp(20)}}>
                            <Cell name={''} borderBottomWidth={px2dp(1)} placeholder={'请输入用户名'}
                                  value={this.state.username} onChangeText={(username) => {
                                this.setState({username});
                            }}/>
                            <Cell name={''} borderBottomWidth={px2dp(1)} placeholder={'请输入密码'}
                                  value={this.state.password} onChangeText={(password) => {
                                this.setState({password});
                            }}/>
                        </View>
                        <SmallButton name={'登录'} onPress={this._login} style={{marginTop:px2dp(20)}}/>
                    </View>
                </KeyboardAwareScrollView>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
const Cell = (props) => {
    let that = props.that;
    return (
        <View style={{flexDirection: 'row', justifyContent: 'center',}}>
            <View style={{
                width: px2dp(293 * 2),
                borderBottomWidth: props.borderBottomWidth ? props.borderBottomWidth : 0,
                borderBottomColor: '#e0e0e0',
                flexDirection: 'row',
                alignItems: 'center',
                height: px2dp(95)
            }}>
                <Text style={{
                    fontFamily: "PingFangSC-Medium",
                    fontSize: px2dp(28),
                    color: "#666"
                }}>{props.name}</Text>
                <Input ref={props.ref} onFocus={props.onFocus} onBlur={props.onBlur} style={{
                    width: px2dp(400),
                    borderWidth: 0,
                    height: px2dp(95),
                    backgroundColor: 'transparent',
                    fontFamily: 'SourceHanSansSC-Regular',
                    color: '#333',
                    fontSize: px2dp(28)
                }} placeholderText={'#999'} placeholder={props.placeholder} value={props.value}
                       onChangeText={props.onChangeText}/>

            </View>
        </View>
    );
}
// const Cell1=(props)=>{
//     let that=props.that;
//      return(
//          <View style={{flexDirection:'row',justifyContent:'center',}}>
//              <View style={{width:px2dp(293*2),borderBottomWidth:props.borderBottomWidth?props.borderBottomWidth:0,borderBottomColor:'rgba(255, 255, 255, 0.6)',flexDirection:'row',alignItems:'center',height:px2dp(110)}}>
//                     <Image source={props.source} resizeMode={'cover'} style={{marginHorizontal:px2dp(24),width:px2dp(38),height:px2dp(38)}}/>
//                  <View style={{flexDirection:'row',alignItems:'center'}}>
//                      <Input secureTextEntry={!that.state.password_visibility} style={{width:px2dp(400),borderWidth:0,height:px2dp(110),backgroundColor:'transparent',fontFamily:'SourceHanSansSC-Regular',color:'#e6e6e6',fontSize:px2dp(30)}} placeholderText={'#e6e6e6'} placeholder={props.placeholder} value={props.value} onChangeText={props.onChangeText}/>
//                      <TouchableOpacity onPress={props.onPress} activeOpacity={0.8}>
//                          <Image source={that.state.password_visibility?Images.openEyes:Images.closeEyes} style={{marginLeft:px2dp(20),width:px2dp(38),height:px2dp(38)}}/>
//                      </TouchableOpacity>
//                  </View>
//              </View>
//          </View>
//      );
// }
