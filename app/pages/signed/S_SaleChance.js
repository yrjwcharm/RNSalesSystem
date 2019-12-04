
import React, {PureComponent} from 'react';
import {ScrollView,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../../components/Title'
import {Input} from "teaset";
import Loading from "../../components/Loading";
import {StringUtils} from "../../utils";
export default class S_SaleChance extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            chanceID:'' ,    //机会ID
            entryTime:'' ,       //录入时间
            priceRange:''   ,     //报价范围
            signPossibility:'',    //签约可能性
            sysType:'',            //系统类型
            requirementDescribe:'', //需求描述
            state:'' ,              //状态
            saleChanceList:[],
            visible:true,
        }
    }
    componentDidMount(): void {
        const {params}=this.props.navigation.state;
        console.log(5555,params);
        let url=Config.requestUrl+Config.followingInterface.getSaleChance+`?purposeId=${params.intentionId}`;
        console.log(31133,url);
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            console.log(555,responseText);
            this.setState({visible:false},()=>{
                if(responseText.success){
                    let obj=JSON.parse(responseText.obj);
                    console.log(444,obj);
                    this.setState({saleChanceList:obj});
                }
            });
        }).catch(error=>{
            Toast.fail(error)
        })
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
                    <View style={{height:verticalScale(40),backgroundColor:item.status===1?'#2e93ff':'#F8F8FA',justifyContent:'center',borderBottomColor:'#e0e0e0',borderBottomWidth:StyleSheet.hairlineWidth}}>
                        <View style={{marginLeft:moderateScale(26),flexDirection:'row',alignItems:'center'}}>
                            <Text style={{fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(15),
                                color: item.status===1?'#fff':"#333"}}>机会ID</Text>
                            <Text style={{marginLeft:moderateScale(7),	fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(15),
                                color: item.status===1?'#fff':"#999"}}>{item.id}</Text>
                        </View>
                    </View>
                    <DefaultInput title={'录入时间'} value={item.createStr} noBorder/>
                    <DefaultInput title={'报价范围'} value={item.budgetQuotedRangeStr} noBorder/>
                    <DefaultInput title={'签约可能性'} value={item.sixtyDayPossibilityStr} noBorder/>
                    <DefaultInput title={'系统类型'} value={item.systemRequirementsName} noBorder/>
                    {StringUtils.isEmpty(item.remark)?<View/>:<DefaultInput title={'需求描述'} value={item.remark} noBorder/>}
                    <DefaultInput title={'状态'} color={item.status===1?'#2e93ff':'#F8F8FA'} value={item.statusStr} noBorder/>
                </View>
            </View>
        );
    }
    _keyExtractor = (item, index) => index;
    // 渲染
    render() {
        const {saleChanceList}=this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f2f2f2'}}>
                <Title title={'销售机会'} back onPressBack={()=>this.props.navigation.goBack()}/>
                <FlatList
                    data={saleChanceList}
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
