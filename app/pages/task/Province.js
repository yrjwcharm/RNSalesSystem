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
    TouchableOpacity,
    RefreshControl
} from 'react-native'
import Title from '../../components/Title'
import Loading from "../../components/Loading";
export default class Province extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            dataArray:[],
            visible:true,
        }
    }
    componentDidMount(): void {
        let url=Config.requestUrl+Config.province.provinceList+`?parentId=6591`;
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            this.setState({visible:false},()=>{
                if(responseText.code==='200'){
                    let obj=eval(responseText.obj);
                    this.setState({dataArray:obj});
                }
            });

        }).catch(error=>{
            Toast.fail(error)
        })
    }

    _toCity=(item)=>{
        this.props.navigation.navigate('City',{provinceName:item.title,provinceCoding:item.id});
    }
    _keyExtractor = (item, index) => index;
    _renderItem=({item})=>{
        return(
            <TouchableOpacity activeOpacity={0.8} onPress={()=>this._toCity(item)}>
                <View style={{height:px2dp(80),backgroundColor:'#FFF',justifyContent:'center',borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:'#e0e0e0'}}>
                    <Text style={{
                        marginLeft:px2dp(20),
                        fontFamily: "PingFangSC-Medium",
                        fontSize: moderateScale(14),
                        color: "#333"
                    }}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        );
    }
    // 渲染
    render() {
        const {dataArray}=this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f2f2f2'}}>
                <Title title={'省'} back onPressBack={() => this.props.navigation.goBack()}/>
                <FlatList
                    data={dataArray}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
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
                />
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
