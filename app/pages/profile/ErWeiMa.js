import React, {PureComponent} from 'react';
import {ScrollView,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../../components/Title'
export default class ErWeiMa extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
    }
    // 渲染
    render() {
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#eee'}}>
            <Title title={'我的二维码'} back onPressBack={()=>this.props.navigation.goBack()}/>
            </SafeAreaView>
        );
    }

}
