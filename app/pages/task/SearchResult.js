import React, {PureComponent} from 'react';
import {
    ScrollView,
    Dimensions,
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
    ImageBackground,
    TouchableOpacity, RefreshControl, ActivityIndicator
} from 'react-native'
import Title from '../../components/Title'
import {StringUtils} from "../../utils";
import Loading from "../../components/Loading";
let itemNo=0;//item的个数
export default class SearchResult extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            lastFollowingTime: '2019-10-16',
            sysType: '分红挖矿APP',
            purposeId: '12990',
            customerLabelTypeId: '',
            dickeyLabel: '',
            companyName: '上海延缘科技咨询有限公司',
            // visible:true,
            totalPage:0,
            //上拉加载更多 下拉刷新
            page:1,
            isLoading: true,
            dataArray: [],
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing: false,//下拉控制
            menuVisible: false,
            selectedIndex: 0,
            visible:true,
            //网络请求状态
            error: false,
            errorInfo: "",
        }
    }

    componentDidMount(): void {
       this._getSearchResult();
    }
    _getSearchResult=()=>{
        const {params} = this.props.navigation.state;
        const {
            purposeName,
            purposeId,
            linkerName,
            telephone,
            provinceId,
            cityId,
            customerLabelTypeId,
            personChargeId,
            purposeSourceId,
            purposeStatus,
            contractId,
            firstVisitBegin,
            firstVisitEnd,
            followTimeBegin,
            followTimeEnd,
            bigType,
            systemGroupId,
            systemSortId
        } = params;
        let url = Config.requestUrl + Config.intentionSearch.searchResult + `?purposeName=${purposeName}&purposeId=${purposeId}&linkerName=${linkerName}&` +
            `telephone=${telephone}&` +
            `provinceId=${provinceId}&` +
            `cityId=${cityId}&` +
            `customerLabelTypeId=${customerLabelTypeId}&` +
            `personChargeId=${personChargeId}&` +
            `purposeSourceId=${purposeSourceId}&` +
            `purposeStatus=${purposeStatus}&` +
            `contractId=${contractId}&` +
            `firstVisitBegin=${firstVisitBegin}&` +
            `firstVisitEnd=${firstVisitEnd}&` +
            `followTimeBegin=${followTimeBegin}&` +
            `followTimeEnd=${followTimeEnd}&` +
            `bigType=${bigType}&` +
            `systemGroupId=${systemGroupId}&` +
            `systemSortId=${systemSortId}&pageNum=${this.state.page}`;
        console.log(555, url);
        fetch(url, {method: 'POST'}).then(res =>{
            console.log(666,res);
            return res.json()
        }).then(responseText => {
            console.log('123456', responseText);
            this.setState({visible:false},()=>{
                if(responseText.code==='200'){
                    const {list,total}=responseText.obj;
                    console.log(3333,responseText);
                    let totalPage=Math.ceil(total/10);
                    this._rebuildDataByPaging(list,totalPage);
                }
            });

        }).catch(error => {
            Toast.fail(error)
        })
    }

    _renderItem = ({item}) => {
        console.log(666,item);
        return (
            <View style={{marginTop: moderateScale(15), paddingHorizontal: moderateScale(13)}}>
                <TouchableOpacity activeOpacity={0.8}
                                   onPress={() => this.props.navigation.navigate('CustomerArchives',{intentionId:item.id})}>
                    <View style={{
                        borderRadius: scale(5),
                        backgroundColor: "#fff",
                        shadowColor: "rgba(0, 0, 0, 0.06)",
                        shadowOffset: {
                            width: 0,
                            height: verticalScale(2)
                        },
                        shadowRadius: scale(10),
                        shadowOpacity: 1
                    }}>
                        <View style={{flexDirection: 'row', alignItems: 'center',}}>
                            <View style={{
                                paddingBottom: moderateScale(18),
                                alignItems: 'center',
                                paddingLeft: moderateScale(22),
                                flexDirection: 'row',
                            }}>
                                <View>
                                    {/*<TouchableOpacity activeOpacity={0.8} onPress={()=>this._jumpToCustomerArchives(item.purposeId)}>*/}
                                    <View style={{
                                        marginTop: px2dp(20),
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Text style={{
                                            fontFamily: "PingFang-SC-Bold",
                                            fontSize: moderateScale(16),
                                             width:px2dp(420),
                                            // color: customerLabelTypeId === 1450 ? '#EC6C59' : customerLabelTypeId === '1454' ? '#2e93f' : '#333'
                                        }}>{item.companyName}
                                        </Text>
                                        <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                            <Image style={{width: px2dp(32), height: px2dp(32)}}
                                                   source={item.deleteStatus===0?Images.solid:Images.solid_}/>
                                            <Text style={{
                                                fontFamily: "PingFang-SC-Medium",
                                                marginLeft: px2dp(12),
                                                fontSize: moderateScale(14),
                                                color: "#999"
                                            }}>{item.deleteStatus===0?'有效':'拉黑'}</Text>
                                        </View>
                                    </View>
                                    {/*</TouchableOpacity>*/}
                                    <View style={{
                                        marginTop: moderateScale(12),
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{
                                            fontFamily: "PingFang-SC-Medium",
                                            fontSize: moderateScale(14),
                                            color: "#666"
                                        }}>意向ID：</Text>
                                        <Text style={{
                                            fontFamily: "PingFang-SC-Medium",
                                            fontSize: moderateScale(14),
                                            color: "#999"
                                        }}>{item.id}</Text>
                                    </View>
                                    <View style={{
                                        marginTop: moderateScale(12),
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{
                                            fontFamily: "PingFang-SC-Medium",
                                            fontSize: moderateScale(14),
                                            color: "#666"
                                        }}>系统类型：</Text>
                                        <Text style={{
                                            fontFamily: "PingFang-SC-Medium",
                                            fontSize: moderateScale(14),
                                            color: "#999",
                                            width:px2dp(420),
                                        }}>{item.standardRequireName}</Text>
                                    </View>
                                    <View style={{
                                        marginTop: moderateScale(12),
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{
                                            fontFamily: "PingFang-SC-Medium",
                                            fontSize: moderateScale(14),
                                            color: "#666"
                                        }}>最后跟进时间：</Text>
                                        <Text style={{
                                            fontFamily: "PingFang-SC-Medium",
                                            fontSize: moderateScale(14),
                                            color: "#999"
                                        }}>{item.lastFollowTime1}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
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
            this._getSearchResult();
        }
    }
    _keyExtractor = (item, index) => index;
    // 渲染
    handleRefresh = () => {
        this.setState({
            page:1,
            isRefreshing:true,//tag,下拉刷新中，加载完全，就设置成false
            dataArray:[]
        },()=>{
            this. _getSearchResult();
        });
    }

    // 渲染
    render() {
        const {dataArray} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                <Title title={'搜索结果'} back onPressBack={() => this.props.navigation.goBack()}/>
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
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
