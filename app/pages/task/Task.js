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
    Easing,
    ImageBackground,
    TouchableOpacity,
    NativeModules, RefreshControl, ActivityIndicator,
} from 'react-native'
import Title from '../../components/Title1'
import Loading from "../../components/Loading";
import {StringUtils} from "../../utils";
import  Animated  from 'react-native-reanimated'
let itemNo=0;//item的个数
export default class Task extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            sortType:1,
            taskList:[],
            visible:true,
            totalPage:0,

            //上拉加载更多 下拉刷新
            page:1,
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
            showFoot:0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing:false,//下拉控制
            menuVisible:false,
            selectedIndex:0,
            total:0,//代办信息总条数
            taskGoalList:[],
            taskGoalId:'',
        }
        console.log(props,111);
    }
    componentWillMount(): void {

    }
    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        console.log(44,nextProps);
        // alert(111);
    }

    componentDidMount(): void {
            store.get('userInfo').then(userInfo=>{
                this.setState({userInfo},()=>{
                    this._getTaskGoalList(userInfo);
                });
            })

    }
    //获取任务目的列表
    _getTaskGoalList = (userInfo) => {
        let url = Config.requestUrl + Config.dataDictionary.customerLabelList + `?onlyMark=renwumudi`;
        console.log(4444, url);
        fetch(url, {method: 'POST'}).then(res => {
            console.log(333, res);
            return res.json()
        }).then(responseText => {
            console.log(3333, responseText);
            if (responseText.code === '200') {
                let obj = eval(responseText.obj);
                console.log("nb",obj);
                this.setState({taskGoalList: obj});
            }
            this._getTaskListInfo(userInfo)
        }).catch(error => {
            Toast.fail(error)
        })
    }
    _getTaskListInfo=(userInfo)=>{
        const {userId}=userInfo;
        let url=Config.requestUrl+Config.followingInterface.taskList+`?userId=${userId}&sortType=1&customerLabelTypeId=${this.state.taskGoalId}&pageNum=${this.state.page}`;
        console.log(555,url);
        fetch(url,{method:'POST'}).then(res=>{
            console.log(3333,res);
            return res.json()
        }).then(responseText=>{
            console.log(3333,responseText);
            this.setState({visible:false},()=>{
                if(responseText.success){
                    const {list,total}=responseText.obj;
                    console.log(666,responseText);
                    this.setState({total},()=>{
                        let totalPage=Math.ceil(total/10);
                        this._rebuildDataByPaging(list,totalPage);
                    });

                }
            });

        })
    }
    _jumpToCustomerArchives=(id)=>{
        this.props.navigation.navigate('CustomerArchives',{intentionId:id});
    }
    //通过分页重新构建数据
    _rebuildDataByPaging=(data,totalPage)=>{
        let dataBlob = [];//这是创建该数组，目的放存在key值的数据，就不会报黄灯了
        let i = itemNo;
        data&&data.map(function (item) {
            dataBlob.push({
                ...item
            })
            i++;
        });
        itemNo = i;
        let foot = 0;
        if(this.state.page>=totalPage){
            foot = 1;//listView底部显示没有更多数据了
        }
        this.setState({
            //复制数据源
            //  dataArray:this.state.dataArray.concat( responseData.results),
            dataArray:this.state.dataArray.concat(dataBlob),
            isLoading: false,
            showFoot:foot,
            totalPage,
            menuVisible:false,
            isRefreshing:false,
        });
        dataBlob = null;
    }
    //渲染FlatList 底部显示
    _renderFooter=()=>{
        if (this.state.showFoot === 1) {
            return (
                <View style={{height:30,alignItems:'center',justifyContent:'flex-start',}}>
                    <Text style={{color:'#999999',fontSize:moderateScale(14),marginTop:moderateScale(5),marginBottom:moderateScale(5),}}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if(this.state.showFoot === 2) {
            return (
                <View style={{flexDirection:'row',
                    height:verticalScale(24),
                    justifyContent:'center',
                    alignItems:'center',
                    marginBottom:moderateScale(10)}}>
                    <ActivityIndicator />
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if(this.state.showFoot === 0){
            return (
                <View style={{ flexDirection:'row',
                    height:verticalScale(24),
                    justifyContent:'center',
                    alignItems:'center',
                    marginBottom:moderateScale(10)}}/>

            );
        }
    }
    //上拉加载时触发
    _onEndReached=()=>{
        //如果是正在加载中或没有更多数据了，则返回
        if(this.state.showFoot !== 0 ){
            return ;
        }
        //如果当前页大于或等于总页数，那就是到最后一页了，返回
        if((this.state.page!==1) && (this.state.page>=this.state.totalPage)){
            return;
        } else {
            this.state.page++;
        }
        //底部显示正在加载更多数据
        this.setState({showFoot:2});
        //获取数据，在componentDidMount()已经请求过数据了
        if (this.state.page>1)
        {
            this._getTaskListInfo(this.state.userInfo);
        }
    }
    _keyExtractor = (item, index) => index;
    // 渲染
    handleRefresh = () => {
        this.setState({
            page:1,
            isRefreshing:true,//tag,下拉刷新中，加载完全，就设置成flase
            dataArray:[]
        },()=>{
            this._getTaskListInfo(this.state.userInfo);
        });
    }
    _getTaskListByTaskGoal=(item)=>{
        this.setState({page:1,dataArray:[],visible:true,taskGoalId:item.dicId},()=>{
            this._getTaskListInfo(this.state.userInfo);
        });

    }
    _getTaskListByAll=()=>{
        this.setState({page:1,dataArray:[],visible:true,taskGoalId:''},()=>{
            this._getTaskListInfo(this.state.userInfo);
        });
    }
    _renderItem=({item})=>{
        return (
            <View style={{marginTop:moderateScale(15),paddingHorizontal:moderateScale(13)}}>
                <TouchableOpacity activeOpacity={0.8} onPress={()=>this._jumpToCustomerArchives(item.purposeId)}>
                    <View style={{borderRadius: scale(5),
                        backgroundColor: "#fff",
                        shadowColor: "rgba(0, 0, 0, 0.06)",
                        shadowOffset: {
                            width: 0,
                            height: verticalScale(2)
                        },
                        shadowRadius: scale(10),
                        shadowOpacity: 1}}>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                            <View style={{paddingBottom:moderateScale(18),alignItems:'center',paddingHorizontal:moderateScale(22),flexDirection:'row',justifyContent:'space-between',marginTop:moderateScale(15)}}>
                                <View>
                                        <View style={{flexDirection:'row',alignItems:'center'}}>
                                            <Text style={{fontFamily: "PingFang-SC-Bold",
                                                fontSize: moderateScale(16),
                                                width:px2dp(420),
                                                color:'#333'}}>{item.companyName}</Text>
                                        </View>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <View>
                                            <View style={{marginTop:moderateScale(12),flexDirection:'row',alignItems:'center'}}>
                                                <Text style={{fontFamily: "PingFang-SC-Medium",
                                                    fontSize: moderateScale(14),
                                                    color: "#666"}}>意向ID：</Text>
                                                <Text style={{fontFamily: "PingFang-SC-Medium",
                                                    fontSize: moderateScale(14),
                                                    color: "#999"}}>{item.purposeId}</Text>
                                            </View>
                                            {/*<View style={{marginTop:moderateScale(12),flexDirection:'row',alignItems:'center'}}>*/}
                                            {/*    <Text  style={{fontFamily: "PingFang-SC-Medium",*/}
                                            {/*        fontSize: moderateScale(14),*/}
                                            {/*        color: "#666"}}>任务目的：</Text>*/}
                                            {/*    <Text style={{fontFamily: "PingFang-SC-Medium",*/}
                                            {/*        fontSize: moderateScale(14),*/}
                                            {/*        color: "#999"}}>{item.taskTypeName}</Text>*/}
                                            {/*</View>*/}
                                            <View style={{marginTop:moderateScale(12),flexDirection:'row',alignItems:'center'}}>
                                                <Text style={{fontFamily: "PingFang-SC-Medium",
                                                    fontSize: moderateScale(14),
                                                    color: "#666"}}>执行方式：</Text>
                                                <Text style={{fontFamily: "PingFang-SC-Medium",
                                                    fontSize: moderateScale(14),
                                                    color: "#999"}}>{StringUtils.isEmpty(item.executeTypeName)?'暂无':item.executeTypeName}</Text>
                                                <View style={{marginLeft:px2dp(10),flexDirection:'row',alignItems:'center'}}>
                                                    <Text style={{fontFamily: "PingFang-SC-Medium",
                                                        fontSize: moderateScale(14),
                                                        color: "#666"}}>计划时间：</Text>
                                                    <Text style={{fontFamily: "PingFang-SC-Medium",
                                                        fontSize: moderateScale(14),
                                                        color: "#666"}}>{item.planTimeStr}</Text>
                                                </View>
                                            </View>
                                            <View style={{marginTop:moderateScale(12),flexDirection:'row',alignItems:'center'}}>
                                                <View style={{borderRadius:scale(2),borderWidth:StyleSheet.hairlineWidth,borderColor:item.timeStr>=0?'#0070C0':'#f00',backgroundColor:item.timeStr>=0?'#0070C0':'#f00',}}>
                                                    <Text style={{fontFamily: "PingFang-SC-Medium",
                                                        fontSize: moderateScale(12),
                                                        marginLeft:moderateScale(5),
                                                        color:"#fff",paddingHorizontal:moderateScale(6),paddingVertical:moderateScale(4)}}>{item.timeStr>=0?`剩余${item.timeStr}`:`过期${item.timeStr.substring(item.timeStr.indexOf('-')+1)}`}</Text>
                                                </View>
                                                <View style={{marginLeft:moderateScale(10),borderRadius:px2dp(3),borderWidth:scale(1/2),borderColor:'#2e93ff',backgroundColor:'#EFF8FE'}}>
                                                    <Text style={{fontFamily: "PingFang-SC-Medium",
                                                        fontSize: moderateScale(12),
                                                        paddingHorizontal:px2dp(6),paddingVertical:px2dp(4),color:'#2e93ff'}}>
                                                        {item.taskTypeName}
                                                    </Text>
                                                </View>
                                            </View>
                                            {/*<View style={{marginTop:moderateScale(12),flexDirection:'row',alignItems:'center'}}>*/}
                                            {/*    <Text style={{fontFamily: "PingFang-SC-Medium",*/}
                                            {/*        fontSize: moderateScale(14),*/}
                                            {/*        color: "#666"}}>任务要求：</Text>*/}
                                            {/*    <Text style={{fontFamily: "PingFang-SC-Medium",*/}
                                            {/*        fontSize: moderateScale(14),*/}
                                            {/*        color: "#999"}}>{unescape(item.taskDetail)}</Text>*/}
                                            {/*</View>*/}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    _showDropMenu=()=>{
        this.setState({menuVisible:!this.state.menuVisible});
    }
    // 渲染
    render() {
        const {dataArray,total,taskGoalList}=this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f2f2f2'}}>
                <Title title={'待办'}   forward onPressForward={this._showDropMenu} forwardLabelText={'筛选'} />
                <Text  style={{fontFamily: "PingFang-SC-Medium",
                    fontSize:px2dp(26),
                    textAlign:'center',
                    marginTop:px2dp(24),
                    color: "#333"}}>您目前有{total}个待办任务</Text>
                <FlatList
                    data={dataArray}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ListFooterComponent={this._renderFooter}
                    onEndReached={this._onEndReached}
                    onEndReachedThreshold={0.1}
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
                    //为刷新设置颜色
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.handleRefresh.bind(this)}//因为涉及到this.state
                            colors={['#ff0000', '#00ff00','#0000ff','#3ad564']}
                            progressBackgroundColor="#ffffff"
                        />
                    }
                />
                {this.state.menuVisible?
                    <Animated.View  style={{width:px2dp(300),position:'absolute',right:0,top:px2dp(90),zIndex:9999,backgroundColor:'#fff'}}>
                        <TouchableOpacity activeOpacity={0.8} onPress={this._getTaskListByAll}>
                            <View style={{height:px2dp(80),justifyContent:'center',borderBottomColor:'#e0e0e0',borderBottomWidth:StyleSheet.hairlineWidth}}>
                                <Text style={{fontFamily: "PingFang-SC-Medium",
                                    fontSize: moderateScale(14),
                                    textAlign:'center',
                                    color: "#333"}}>全部</Text>
                            </View>
                        </TouchableOpacity>
                    {taskGoalList&&taskGoalList.map(item=>{
                            return(
                                <TouchableOpacity activeOpacity={0.8} onPress={()=>this._getTaskListByTaskGoal(item)}>
                                    <View style={{height:px2dp(80),justifyContent:'center',borderBottomColor:'#e0e0e0',borderBottomWidth:StyleSheet.hairlineWidth}}>
                                        <Text style={{fontFamily: "PingFang-SC-Medium",
                                            fontSize: moderateScale(14),
                                            textAlign:'center',
                                            color: "#333"}}>{item.itemValue}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    )}
                </Animated.View>:null}
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }
}
