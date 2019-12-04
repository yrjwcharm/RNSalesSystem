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
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    WebView,
} from 'react-native'
import Title from '../../components/Title'
import {Input} from "teaset";
const  {width}=Dimensions.get('window');
import HTML from 'react-native-render-html';
import Loading from "../../components/Loading";
import {StringUtils} from "../../utils";
export default class S_FollowInfo extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            followInfoList:[],
            visible:true,
        }
    }
    componentDidMount() {
        const {params}=this.props.navigation.state;
        let url=Config.requestUrl+Config.followingInterface.getFollowingInfo+`?purposeId=${params.intentionId}`;
        console.log(666,url);
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            this.setState({visible:false},()=>{
                if(responseText.success){
                    let obj=JSON.parse(responseText.obj);
                    console.log(6666,obj);
                    this.setState({followInfoList:obj});

                }
            });
        }).catch(error=>{
            Toast.fail(error);
        });
    }
    _renderHtml=(html)=>{
        if(!StringUtils.isEmpty(html)){
            console.log(333,html);
            return(
                <View style={{marginHorizontal: px2dp(30),flexDirection: 'row',alignItems:'center',}}>
                    <HTML html={html} baseFontStyle={{
                        fontSize: moderateScale(13),
                        color: "#333333",
                    }}   onLinkPress={(evt, href) => {
                        console.log(333,href);
                        // Linking.openURL(href)
                    } }   imagesMaxWidth={Dimensions.get('window').width-160}/>
                </View>
            );
        }else{
            return(<View/>);
        }
    }
    _keyExtractor = (item, index) => index;
    _renderItem=({item})=>{
        // var str = 'aaa_bbb';
        // var reg = /_/g;
        // var insertStr = "ccc_"
        // console.log(str.replace(reg,"_"+insertStr))//aaa_ccc_bbb
        console.log(3333,item.showMesTitleModel);
        console.log(4444,unescape(item.followContent));
        return(
            <View>
                <View style={{paddingVertical:moderateScale(20),justifyContent:'center',backgroundColor:'#fff',borderBottomWidth: StyleSheet.hairlineWidth,borderBottomColor: '#e0e0e0'}}>
                    <View style={{marginLeft: px2dp(20), marginBottom: px2dp(20)}}>
                        <View style={{
                            paddingVertical: moderateScale(20),
                            justifyContent: 'center',
                            backgroundColor: '#fff',
                        }}>
                            {this._renderHtml(item.showMesTitleModel)}
                            <View style={{marginTop: moderateScale(10)}}>
                                {this._renderHtml(unescape(item.followContent))}
                            </View>
                        </View>

                    </View>
                </View>
            </View>
        );
    }
    // 渲染
    render() {
        const {followInfoList}=this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#eee'}}>
                <Title title={'跟进信息'} back onPressBack={()=>this.props.navigation.goBack()} />
                <FlatList
                    data={followInfoList}
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
                <Text style={{marginLeft:moderateScale(22),fontFamily: "PingFang-SC-Medium",
                    fontSize: moderateScale(14),
                    color: "#333333"}}>{props.title}</Text>
                <Input value={props.value} style={{width:scale(200),textAlign: 'right',
                    height: verticalScale(33),
                    borderRadius: moderateScale(2),
                    backgroundColor: "transparent",
                    borderStyle: "solid",
                    borderWidth:0,
                    borderColor: "#dddddd",fontFamily: "PingFang-SC-Medium",
                    fontSize: moderateScale(14),
                    flex:1,
                    paddingRight:moderateScale(22),
                    color: props.color?props.color:"#333333"

                }} />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    font:{
        // fontFamily: "PingFangSC-Regular",
        // fontSize: moderateScale(17),
        color: "#333333",
        // lineHeight: px2dp(54),
    }
});

