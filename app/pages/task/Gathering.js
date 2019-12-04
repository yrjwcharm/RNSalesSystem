import React, {PureComponent} from 'react';
import {ScrollView,Dimensions,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../../components/Title'
import {StringUtils} from "../../utils";
import Loading from "../../components/Loading";
export default class Gathering extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            // visible:true,
        }
    }
    componentDidMount(): void {
        const {params}=this.props.navigation.state;
       // let url=Config.requestUrl+Config.gathering.gatheringPlan+`?replayId=${params.id}`;
       // fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
       //     console.log(333,responseText);
       // }).catch(error=>{
       //     Toast.fail(error)
       // })
    }

    // 渲染
    render() {
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f2f2f2'}}>
                <Title title={'收款计划'} back onPressBack={()=>this.props.navigation.goBack()}/>
                {/*<DefaultInput editable={false} title={'机会ID'} value={''} color={'#2e93ff'} noBorder/>*/}
                {/*<DefaultInput editable={false} title={'成单人'} value={''} noBorder/>*/}
                {/*<DefaultInput editable={false} title={'购买系统'} value={''} noBorder/>*/}
                {/*<DefaultInput editable={false} title={'需求描述'} value={''} />*/}
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
