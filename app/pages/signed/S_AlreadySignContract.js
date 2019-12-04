import React, {PureComponent} from 'react';
import {ScrollView,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../../components/Title'
import {Input} from "teaset";
import * as Progress from 'react-native-progress/index';
import Loading from "../../components/Loading";
import {StringUtils} from "../../utils";
import OpenFile from "react-native-doc-viewer";
import RNFetchBlob from "rn-fetch-blob";
export default class S_AlreadySignContract extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            contractNo:'',   //合同编号
            chanceID:'',      //机会ID
            intoASingle:'',                 //成单人
            buySys:'' ,                  //购买系统
            requirementDescribe:'',       //需求描述
            totalMoney:'',                 //总共金额
            remainMoney:''  ,              //剩余金额
            visible:true,
            signedContractList:[]
        }
    }
    componentDidMount(): void {
        const {params}=this.props.navigation.state;
        console.log(5555,params);
        let url=Config.requestUrl+Config.followingInterface.getSignedContractInfo+`?purposeId=${params.intentionId}`;
        console.log(31133,url);
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            console.log(555,responseText);
            this.setState({visible:false},()=>{
                if(responseText.success){
                    let obj=JSON.parse(responseText.obj);
                    this.setState({signedContractList:obj});
                }
            });

        }).catch(error=>{
            Toast.fail(error);
            this.setState({visible:false});
        })
    }
    _formatMoney=(nStr)=> {
        nStr += '';
        let x = nStr.split('.');
        let x1 = x[0];
        let x2 = x.length > 1 ? '.' + x[1] : '';
        let rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
    _viewContract=(item)=>{
        let url=Config.requestUrl+Config.followingInterface.viewContract+`?contractId=${item.id}`;
        fetch(url,{method:'POST'}).then(res=>{
            console.log(333,res);
            return res.json()
        }).then(responseText=>{
                console.log(33333,responseText);
                if(responseText.success){
                    let obj=JSON.parse(responseText.obj);
                    console.log(3333,obj);
                    if(obj.length===1){
                        const {webpath}=obj[0];
                        if(webpath.indexOf('.pdf')!==-1||webpath.indexOf('.PDF')!==-1){
                            this.props.navigation.navigate('S_ContractPdf',{url:Config.filepath+webpath});
                        }else {
                            // send http request in a new thread (using native code)
                                RNFetchBlob.fetch('POST', Config.filepath+webpath, {
                                    Authorization : 'Bearer access-token...',
                                    // more headers  ..
                                })
                                    .then((res) => {
                                        this.setState({visible:false},()=>{
                                            let status = res.info().status;
                                            if(status === 200) {
                                                // the conversion is done in native code
                                                let base64Str = res.base64();
                                                console.log(444,base64Str);
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

                    }else{
                        this.props.navigation.navigate('S_ViewerMoreContract',{contractAttachmentList:obj})
                    }
                }

        }).catch(error=>{
            Toast.fail(error);
        })
    }
    _renderItem=({item})=>{
        let payMoney=this._formatMoney(item.payMoney);
        let conMoney=this._formatMoney(item.conMoney);
        let totalMoney=item.conMoney+item.payMoney;
        let percentage=(item.payMoney/totalMoney).toFixed(2);
        console.log(333,percentage);
        return(
            <View style={{borderRadius: scale(5),backgroundColor:'#Fff',marginHorizontal:moderateScale(13),marginTop:moderateScale(12)}}>
                <View style={{height:verticalScale(40),justifyContent:'center',backgroundColor:'#fff',borderBottomWidth: StyleSheet.hairlineWidth,borderBottomColor: '#e0e0e0'}}>
                    <View style={{marginHorizontal:moderateScale(13),flexDirection: 'row',alignItems:'center',justifyContent:'space-between'}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={{fontFamily: "PingFang-SC-Medium",
                                fontSize: moderateScale(14),
                                color: "#333"}}>合同编号</Text>
                            <Text style={{fontFamily: "PingFang-SC-Medium",
                                fontSize: moderateScale(14),
                                color: "#2e93ff",marginLeft:moderateScale(10)}}>{item.changeNumber}</Text>
                        </View>
                        <Text style={{fontFamily: "PingFang-SC-Medium",
                            fontSize: moderateScale(14),
                            color: "#118fb8",marginLeft:moderateScale(10)}}>{''}</Text>
                    </View>
                </View>
                <View style={{paddingBottom:moderateScale(13),borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:'#e0e0e0'}}>
                    <View style={{marginTop:moderateScale(12),marginHorizontal:moderateScale(22),flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={{fontFamily: "PingFang-SC-Medium",
                            fontSize: moderateScale(14),
                            color: "#333333"}}>已付{payMoney}元</Text>
                        <Text style={{fontFamily: "PingFang-SC-Medium",
                            fontSize: moderateScale(14),
                            color: "#333333"}}>剩余{conMoney}元</Text>
                    </View>
                    <View style={{justifyContent:'center',flexDirection:'row',marginTop:moderateScale(13)}}>
                        <Progress.Bar progress={percentage} width={scale(200)}/>
                    </View>
                    <View>
                    <Text style={{fontFamily: "PingFang-SC-Medium",
                        fontSize: moderateScale(14),
                        textAlign:'right',
                        marginRight:moderateScale(22),
                        marginTop:moderateScale(13),
                        color: "#333333"}}>共{this._formatMoney(totalMoney)}元</Text>
                    </View>
                </View>
                <DefaultInput editable={false} title={'机会ID'} value={item.id} color={'#2e93ff'} noBorder/>
                <DefaultInput editable={false} title={'成单人'} value={item.signApplyPersonName} noBorder/>
                <DefaultInput editable={false} title={'购买系统'} value={item.systemRequirementsName} noBorder/>
                <DefaultInput editable={false} title={'需求描述'} value={StringUtils.isEmpty(item.remark)?'暂无':item.remark} />
                <TouchableOpacity onPress={()=>this._viewContract(item)}>
                <View style={{height:verticalScale(45),justifyContent:'center'}}>
                    <Text style={{textAlign: 'center',fontFamily: "PingFang-SC-Medium",
                        fontSize: moderateScale(14),
                        color: "#2e93ff",marginLeft:moderateScale(10)}}>查看合同</Text>
                </View>
                </TouchableOpacity>
            </View>
        );
    }
    // 渲染
    render() {
        const {signedContractList}=this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#eee'}}>
                <Title title={'已签合同'} back onPressBack={()=>this.props.navigation.goBack()}/>
                <FlatList
                    data={signedContractList}
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
