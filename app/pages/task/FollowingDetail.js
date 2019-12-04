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
    WebView, Keyboard,
} from 'react-native'
import Title from '../../components/Title'
import {Input} from "teaset";
import Loading from "../../components/Loading";
import {StringUtils} from "../../utils";
import Animated from "react-native-reanimated";
import ImagePicker from 'react-native-image-crop-picker';
import HTML from "react-native-render-html";

export default class FollowingDetail extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            followInfoList: [],
            visible: true,
        }
    }

    componentDidMount() {
        const {params} = this.props.navigation.state;
        let url = Config.requestUrl + Config.followingInterface.getFollowingInfo + `?purposeId=${params.intentionId}`;
        console.log(666, url);
        fetch(url, {method: 'POST'}).then(res => res.json()).then(responseText => {
            this.setState({visible: false}, () => {
                if (responseText.success) {
                    let obj = JSON.parse(responseText.obj);
                    console.log(6666, obj);
                    this.setState({followInfoList: obj});

                }
            });
        }).catch(error => {
            Toast.fail(error);
        });
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    //拍照
    _getAvatarFromCapture = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(444, image.path);

        });
    }
    //从相册选取
    _getAvatarFromGallery = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            // mediaType: "photo",
        }).then(image => {
            console.log(666, image.path);
        });
    };
    _keyboardDidShow = () => {

    }

    _keyboardDidHide = () => {
        this.setState({visibility: false});
    }
    _showBottomMenu = () => {
        console.log(555, 'zoule');
        this.setState({visibility: true});
    }
    _sendMsg = () => {
        this.setState({sendMsgBtn: false,}, () => {
            this.setState({message: ''});
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
                    } }   imagesMaxWidth={Dimensions.get('window').width-45}/>
                </View>
            );
        }else{
            return(<View/>);
        }
    }
    _keyExtractor = (item, index) => index;
    _renderItem = ({item}) => {
        // var str = 'aaa_bbb';
        // var reg = /_/g;
        // var insertStr = "ccc_"
        // console.log(str.replace(reg,"_"+insertStr))//aaa_ccc_bbb
        console.log(3333, item.showMesTitleModel);
        console.log(4444, unescape(item.followContent));
        return (
            <View>
                <View style={{
                    paddingVertical: moderateScale(20),
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                }}>
                    <View style={{marginHorizontal: moderateScale(13),}}>
                        <View>
                            {this._renderHtml(item.showMesTitleModel)}
                        </View>
                        <View>
                            {this._renderHtml(unescape(item.followContent))}
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    // 渲染
    render() {
        const {followInfoList} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#eee'}}>
                <Title title={'跟进信息'} back onPressBack={() => this.props.navigation.goBack()}/>
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
                <View style={{
                    position: 'relative',
                    bottom: this.state.visibility ? px2dp(320) : px2dp(0),
                    zIndex: 9999,
                }}>
                    <View style={{height: px2dp(90), justifyContent: 'center', backgroundColor: '#F8F8FA'}}>
                        <Animated.View
                            style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: px2dp(26),}}>
                            <Input style={{
                                flex: 1,
                                height: px2dp(60),
                                textAlign: 'center',
                                fontSize: px2dp(24),
                            }} ref={'input'} onChangeText={(message) => {
                                this.setState({message}, () => {
                                    if (message.length > 0)
                                        this.setState({sendMsgBtn: true});
                                    else
                                        this.setState({sendMsgBtn: false});
                                });

                            }} onSubmitEditing={Keyboard.dismiss} value={this.state.message} placeholder={'快速记录跟进'}/>
                            {this.state.sendMsgBtn ? <TouchableOpacity activeOpacity={0.8} onPress={this._sendMsg}>
                                <View
                                    style={{marginLeft: px2dp(15), borderRadius: px2dp(5), backgroundColor: '#2e93ff'}}>
                                    <Text style={{
                                        paddingHorizontal: px2dp(10),
                                        fontSize: px2dp(24),
                                        color: '#fff',
                                        paddingVertical: px2dp(8)
                                    }}>发送</Text>
                                </View>
                            </TouchableOpacity> : <TouchableOpacity activeOpacity={0.8} onPress={this._showBottomMenu}>
                                <View style={{marginLeft: px2dp(15),}}>
                                    <Image source={Images.add_select} style={{width: px2dp(32), height: px2dp(32)}}
                                           resizeMode={'contain'}/>
                                </View>
                            </TouchableOpacity>}
                        </Animated.View>
                    </View>
                    {this.state.visibility ? <Animated.View style={{backgroundColor: '#fff', height: px2dp(320)}}>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: px2dp(10)}}>
                            <TouchableOpacity activeOpacity={0.8} onPress={this._getAvatarFromGallery}>
                                <View style={{width: Dimensions.get('window').width / 8, alignItems: 'center'}}>
                                    <Image source={Images.gallery} resizeMode={'contain'}
                                           style={{width: px2dp(48), height: px2dp(48)}}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} onPress={this._getAvatarFromCapture}>
                                <View style={{width: Dimensions.get('window').width / 8, alignItems: 'center'}}>
                                    <Image source={Images.camera} resizeMode={'contain'}
                                           style={{width: px2dp(48), height: px2dp(48)}}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Animated.View> : null}
                </View>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
const DefaultInput = (props) => {
    return (
        <View style={{
            height: verticalScale(45),
            justifyContent: 'center',
            backgroundColor: 'transparent',
            borderBottomWidth: props.noBorder ? 0 : StyleSheet.hairlineWidth,
            borderBottomColor: '#e0e0e0'
        }}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{
                    marginLeft: moderateScale(22), fontFamily: "PingFang-SC-Medium",
                    fontSize: moderateScale(14),
                    color: "#333333"
                }}>{props.title}</Text>
                <Input value={props.value} style={{
                    width: scale(200), textAlign: 'right',
                    height: verticalScale(33),
                    borderRadius: moderateScale(2),
                    backgroundColor: "transparent",
                    borderStyle: "solid",
                    borderWidth: 0,
                    borderColor: "#dddddd", fontFamily: "PingFang-SC-Medium",
                    fontSize: moderateScale(14),
                    flex: 1,
                    paddingRight: moderateScale(22),
                    color: props.color ? props.color : "#333333"

                }}/>
            </View>
        </View>
    );
}


