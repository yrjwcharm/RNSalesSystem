import React, {PureComponent} from 'react';
import {ScrollView,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../../components/Title'
import {Input} from "teaset";
import Loading from "../../components/Loading";
import {StringUtils} from "../../utils";
export default class TaskInfo extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            taskState:'',             //任务状态
            taskType:'',             //任务类型
            planTime:'',             //计划时间
            actualExecutionTime:'',  //实际执行时间
            executor:'' ,             //执行人
            taskRequirement:'',       //任务要求
            handleResult:'',          //处理结果
            taskList:[],
            visible:true,
        }
    }
    componentDidMount(): void {
        const {params}=this.props.navigation.state;
        console.log(5555,params);
        let url=Config.requestUrl+Config.followingInterface.getTaskInfo+`?purposeId=${params.intentionId}`;
        console.log(31133,url);
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            console.log(555,responseText);
            this.setState({visible:false},()=>{
                if(responseText.success){
                    let obj=JSON.parse(responseText.obj);
                    console.log(6666,obj);
                    this.setState({taskList:obj});
                }
            });

        }).catch(error=>{
            Toast.fail(error)
            this.setState({visible:false});
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
                    <View style={{backgroundColor:item.taskStatus===2?'#F8F8FA':'#2e93ff',height:verticalScale(40),justifyContent:'center',borderBottomColor:'#e0e0e0',borderBottomWidth:StyleSheet.hairlineWidth}}>
                        <View style={{marginLeft:moderateScale(26),flexDirection:'row',alignItems:'center'}}>
                            <Text style={{fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(15),
                                color: item.taskStatus===2?'#333':"#fff"}}>状态</Text>
                            <Text style={{marginLeft:moderateScale(7),	fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(15),
                                color:item.taskStatus===2?'#999':"#fff"}}>{item.taskStatus===2?'已完成':'待完成'}</Text>
                        </View>
                    </View>
                    <DefaultInput  title={'任务目的'}  value={item.taskTypeName} noBorder/>
                    <DefaultInput  title={'执行方式'}  value={item.executeTypeName} noBorder/>
                    <DefaultInput  title={'计划时间'}  value={`${item.planTimeStr}`} noBorder/>
                    {item.taskStatus===2?<DefaultInput  title={'实际执行时间'} value={`${item.actTimeStr}`} noBorder/>:<View/>}
                    <DefaultInput  title={'执行人'} value={item.recipientPersonName} noBorder/>
                    {item.taskStatus===2?<DefaultInput  title={'处理结果'} value={StringUtils.isEmpty(item.changeResult)?'暂无':item.changeResult} noBorder/>:<View/>}
                    <DefaultInput  title={'任务要求'}  value={StringUtils.isEmpty(item.taskDetail)?'暂无':unescape(item.taskDetail)} noBorder/>
                </View>
            </View>
        );
    }
    _keyExtractor = (item, index) => index;
    // 渲染
    render() {
        const {taskList}=this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f2f2f2'}}>
                <Title title={'任务信息'} back onPressBack={()=>this.props.navigation.goBack()}/>
                <FlatList
                    data={taskList}
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

