import React, {PureComponent} from 'react';
import {FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import {setJSExceptionHandler, setNativeExceptionHandler} from "react-native-exception-handler";
import RNRestart from "react-native-restart";
import SplashScreen from 'react-native-splash-screen';
// import JSPatch from '../../app/UpdateComp/ProgressBar';
export default class Splash extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        store.get('userInfo').then(userInfo=>{
                    if(userInfo!=null){
                        this.props.navigation.navigate('Main');
                    }else{
                        this.props.navigation.navigate('Login');
                    }
        })
    }
    componentWillMount(): void {
        this._causeJSError();
        this._causeNativeError();
    }
    componentDidMount(): void {
        SplashScreen.hide();
    }

    // 渲染
    render() {
        return (
            <View style={{backgroundColor:'transparent'}}/>
        );
    }
    _causeJSError = ()=>{
        setJSExceptionHandler(errorHandler, true);
    }
    _causeNativeError = ()=>{
        setNativeExceptionHandler((errorString) => {
            if(__DEV__){
                Alert.alert(errorString);
                console.log('error',errorString);
            }else{
                RNRestart.Restart();
                console.log('setNativeExceptionHandler',errorString);
            }
        });
        //RnTestExceptionHandler.raiseTestNativeError();
    }

}
/**
 * 捕获异常信息
 * @private
 */

const errorHandler = (e, isFatal) => {
    if (isFatal) {
        if(__DEV__){
            console.log('error',e.message);
            Alert.alert(
                '异常捕获',
                `${(isFatal) ? '严重BUG:' : ''}

            ${e.name}  ${e.message}

             APP出现异常闪退迹象,请尽快联系开发人员解决此BUG.
             `,
                [{
                    text: 'Close'
                }]
            );
        }else{
            //重启APP //兼容双平台
            RNRestart.Restart();
        }

    } else {
        console.log('333',e); // So that we can see it in the ADB logs in case of Android if needed
    }
};

