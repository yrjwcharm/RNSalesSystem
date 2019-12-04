import React, {PureComponent} from 'react';
import {ScrollView,Dimensions,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../../components/Title'
import {StringUtils} from "../../utils";
import Loading from "../../components/Loading";
export default class SelectChance extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            chanceList:[],
            visible:true,
            company:'',
            intentionId:'',
        }
    }
    componentDidMount(): void {
        const {params}=this.props.navigation.state;
        let url=Config.requestUrl+Config.followingInterface.getSaleChance+`?purposeId=${params.intentionId}`;
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            console.log(333,responseText);
            this.setState({visible:false,intentionId:params.intentionId},()=>{
                if(responseText.code==='200'){
                    let obj=eval(responseText.obj);
                    console.log(333,obj);
                    this.setState({chanceList:obj});
                }
            });

        }).catch(error=>{
            Toast.fail(error)
        });
    }

    _renderItem = ({item}) => {
        console.log(4244,item);
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.navigation.navigate('ApplySigned',{intentionId:this.state.intentionId})}>
                <View style={{marginTop: moderateScale(15), paddingHorizontal: moderateScale(13),}}>
                    <View style={{
                        borderRadius: scale(5),
                        backgroundColor: "#fff",
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
                                }}>{item.systemRequirementsName}</Text>
                            </View>
                        </View>
                        <DefaultInput title={'签约可能性：'} value={item.sixtyDayPossibilityStr} noBorder/>
                        {/*<DefaultInput  title={'执行方式'}  value={item.executeTypeName} noBorder/>*/}
                        <DefaultInput title={'系统类型：'} value={item.systemRequirementsName} noBorder/>
                        <DefaultInput title={'报价范围：'} value={item.budgetQuotedRangeStr} noBorder/>
                        <DefaultInput title={'机会状态：'} value={item.statusStr} noBorder/>
                        <DefaultInput title={'录入时间：'} value={item.createStr} noBorder/>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
    // 渲染
    render() {
        const {chanceList}=this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f2f2f2'}}>
                <Title title={'选择机会'} back onPressBack={()=>this.props.navigation.goBack()}/>
                <FlatList
                    data={chanceList}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    _keyExtractor ={(item, index) => index}
                    ListEmptyComponent={
                        <View
                            style={{
                                height: SCREEN_HEIGHT,
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
