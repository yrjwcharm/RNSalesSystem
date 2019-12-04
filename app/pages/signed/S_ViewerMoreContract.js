import React, {PureComponent} from 'react';
import {ScrollView,NativeModules,Dimensions,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../../components/Title';
import Pdf from 'react-native-pdf';
import Loading from "../../components/Loading";
import OpenFile from "react-native-doc-viewer";
import RNFetchBlob from "rn-fetch-blob";
export default class S_ViewerMoreContract extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            contractAttachmentList:[]
        }
    }
    componentDidMount(): void {
        const {params}=this.props.navigation.state;
        this.setState({contractAttachmentList:params.contractAttachmentList});
        console.log(333,params);
    }
    _jumpToS_ContractAttachment=(url)=>{
            if(url.indexOf('.PDF')!==-1||url.indexOf('.pdf')!==-1){
                this.props.navigation.navigate('S_ContractPdf',{url:Config.filepath+url});
            }else{
                // send http request in a new thread (using native code)
                    RNFetchBlob.fetch('POST', Config.filepath+url, {
                        Authorization : 'Bearer access-token...',
                        // more headers  ..
                    })
                        .then((res) => {
                            this.setState({visible:false},()=>{
                                let status = res.info().status;
                                if(status === 200) {
                                    // the conversion is done in native code
                                    let base64Str = res.base64();
                                    try{
                                        OpenFile.openDocb64([{
                                            base64:base64Str,
                                            fileName:"sample",
                                            fileType:"doc",
                                            cache:true /*Use Cache Folder Android*/
                                        }], (error, url) => {
                                            if (error) {
                                                console.error('3333',error);
                                            } else {
                                                console.log('rrrr',url)
                                            }
                                        })
                                    }catch (error) {
                                        Toast.fail(error)
                                    }
                                } else {
                                    // handle other status codes
                                }
                            });
                        })
                        // Something went wrong:
                        .catch((errorMessage, statusCode) => {
                            // error handling
                        })
            }
    }
    _keyExtractor = (item, index) => index;
    _renderItem=({item})=>{
        return(
            <View style={{marginTop:moderateScale(15),paddingHorizontal:moderateScale(13),}}>
                <View style={{borderRadius: scale(5),
                    backgroundColor: "#f5f5f5",
                    shadowColor: "rgba(0, 0, 0, 0.06)",
                    shadowOffset: {
                        width: 0,
                        height: verticalScale(2)
                    },
                    shadowRadius: scale(10),
                    shadowOpacity: 1,}}>
                    <View style={{paddingVertical:moderateScale(10),paddingHorizontal:moderateScale(13),alignItems:'center',justifyContent: 'space-between'}}>
                    <Text style={{fontFamily: "PingFang-SC-Medium",
                        fontSize: moderateScale(14),
                        color: "#333",}}>合同附件</Text>
                    <TouchableOpacity  onPress={(()=>this._jumpToS_ContractAttachment(item.webpath))}>
                        <Text style={ { marginTop:moderateScale(10),fontSize: moderateScale(15) }}>
                            {`http://192.168.0.200:8080/sales/`+item.webpath}
                        </Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
    // 渲染
    render() {
        const {contractAttachmentList}=this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#eee'}}>
                <Title title={'合同附件'} back onPressBack={()=>this.props.navigation.goBack()}/>
                <FlatList
                    data={contractAttachmentList}
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
