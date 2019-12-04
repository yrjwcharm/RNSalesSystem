import React, {PureComponent} from 'react';
import {ScrollView,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../../components/Title'
import {Input} from "teaset";
import * as Progress from 'react-native-progress/index';
import Loading from "../../components/Loading";
import {StringUtils} from "../../utils";
import OpenFile from "react-native-doc-viewer";
import RNFetchBlob from "rn-fetch-blob";
export default class ContractDetail extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            changeNumber:'',
            conMoney:'',
            id:'',
            signApplyPersonName:'',
            sixtyDayPossibilityStr:'',
            systemRequirementsName:'',
            payMoney:'',
            remark:'',
            visible:true,
            percentage:0,
            totalMoney:0,
            userInfo:null,
        }
    }
    componentDidMount(): void {
        store.get('userInfo').then(userInfo=>{
            this.setState({userInfo},()=>{
                this._querySingleContractDetail();
            });
        })
    }
    _querySingleContractDetail=()=>{
        const {params}=this.props.navigation.state;
        console.log(5555,params);
        let url=Config.requestUrl+Config.contractDetailPageInterface.singleContractDetail+`?id=${params.id}`;
        console.log(31133,url);
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            console.log(555,responseText);
            this.setState({visible:false},()=>{
                // budgetQuotedRange: 2
                // budgetQuotedRangeStr: "10万左右"
                // changeNumber: "BJHRSD-2017-1023-B01"
                // conMoney: 88000
                // contractTypeId: 1246
                // contractTypeName: "B标准产品"
                // createPersonId: 713
                // createtime: "2017-09-25T01:42:03.000+0000"
                // firstPayment: 44000
                // firstPaymentTime: "2017-11-17T00:00:00"
                // id: 439
                // isHaveContractId: 1
                // isHaveContractName: "有"
                // isHaveInvoice: 1
                // payMoney: 35200
                // purposeId: 520
                // signApplyPersonId: 726
                // signApplyPersonName: "张梦思"
                // signSubject: "大同市中金陆汽车销售有限公司"
                // sixtyDayPossibility: 3
                // sixtyDayPossibilityStr: "60%"
                // status: 4
                // systemRequirementsId: "1166,1166"
                // systemRequirementsName: "现金贷系统"
                if(responseText.success){
                    let obj=responseText.obj;
                    const {remark,changeNumber,conMoney,payMoney,id,signApplyPersonName,sixtyDayPossibilityStr,systemRequirementsName}=obj;
                    let totalMoney=conMoney+payMoney;
                    let percentage=(payMoney/totalMoney).toFixed(2);
                    this.setState({percentage,remark,totalMoney,payMoney,changeNumber,conMoney,id,signApplyPersonName,sixtyDayPossibilityStr,systemRequirementsName});
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
    _viewContract=(id)=>{
        let url=Config.requestUrl+Config.followingInterface.viewContract+`?contractId=${id}`;
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
    _applyTermination=(id)=>{
//         合同主键：contractId（必填）
// 申请原因：voidApplyResult
//         当前登录人主键：userId（必填）
        const {userInfo:{userId}}=this.state;
        this.setState({visible:true},()=>{
            let url=Config.requestUrl+Config.contractDetailPageInterface.contractTermination+`?userId=${userId}&contractId=${id}`;
            console.log(666,url);
            fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
                console.log(333,responseText);
                this.setState({visible:false},()=>{
                    if(responseText.success){
                        Toast.info(responseText.msg);
                    }
                });

            }).catch(error=>{
                Toast.fail(error)
            })
        });

    }
    _addElements=()=>{
        const {params}=this.props.navigation.state;
         this.props.navigation.navigate('AddElements',{intentionId:params.intentionId})
    }
    _applyPlan=(id)=>{
            this.props.navigation.navigate('Gathering',{id})
    }
    //申请查账
    _applyAuditAccounts=()=>{

    }
    // 渲染
    render() {
        const {changeNumber,percentage,remark,conMoney,payMoney,totalMoney,id,signApplyPersonName,systemRequirementsName}=this.state;
        console.log(333,changeNumber,remark,conMoney,payMoney,id,signApplyPersonName,systemRequirementsName);
        console.log(333,payMoney,conMoney,totalMoney,percentage);
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#eee'}}>
                <Title title={'已签合同'} back onPressBack={()=>this.props.navigation.goBack()}/>
                <View style={{borderRadius: scale(5),backgroundColor:'#Fff',marginHorizontal:moderateScale(13),marginTop:moderateScale(12)}}>
                    <View style={{height:verticalScale(40),justifyContent:'center',backgroundColor:'#fff',borderBottomWidth: StyleSheet.hairlineWidth,borderBottomColor: '#e0e0e0'}}>
                        <View style={{marginHorizontal:moderateScale(13),flexDirection: 'row',alignItems:'center',justifyContent:'space-between'}}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Text style={{fontFamily: "PingFang-SC-Medium",
                                    fontSize: moderateScale(14),
                                    color: "#333"}}>合同编号</Text>
                                <Text style={{fontFamily: "PingFang-SC-Medium",
                                    fontSize: moderateScale(14),
                                    color: "#2e93ff",marginLeft:moderateScale(10)}}>{changeNumber}</Text>
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
                                color: "#333333"}}>已付{this._formatMoney(payMoney)}元</Text>
                            <Text style={{fontFamily: "PingFang-SC-Medium",
                                fontSize: moderateScale(14),
                                color: "#333333"}}>剩余{this._formatMoney(conMoney)}元</Text>
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
                    <DefaultInput editable={false} title={'机会ID'} value={id} color={'#2e93ff'} noBorder/>
                    <DefaultInput editable={false} title={'成单人'} value={signApplyPersonName} noBorder/>
                    <DefaultInput editable={false} title={'购买系统'} value={systemRequirementsName} noBorder/>
                    <DefaultInput editable={false} title={'需求描述'} value={StringUtils.isEmpty(remark)?'暂无':remark} />
                    <TouchableOpacity onPress={()=>this._viewContract(id)}>
                        <View style={{height:verticalScale(45),justifyContent:'center'}}>
                            <Text style={{textAlign: 'center',fontFamily: "PingFang-SC-Medium",
                                fontSize: moderateScale(14),
                                color: "#2e93ff",marginLeft:moderateScale(10)}}>查看合同</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, justifyContent: 'flex-end',}}>
                    <View style={{height: px2dp(96), backgroundColor: '#fff', justifyContent: 'center'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                            <TouchableOpacity acitiveOapcity={0.8} onPress={()=>this._applyTermination(id)}>
                                <View style={{alignItems: 'center'}}>
                                    <Image source={Images.termination} style={{width: px2dp(32), height: px2dp(32)}}/>
                                    <Text style={{
                                        marginTop: px2dp(5),
                                        fontFamily: "PingFangSC-Medium",
                                        fontSize: moderateScale(14),
                                        color: "#333"
                                    }}>申请终止</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity acitiveOapcity={0.8} onPress={this._addElements}>
                                <View style={{alignItems: 'center'}}>
                                    <Image source={Images.add_element} style={{width: px2dp(32), height: px2dp(32)}}/>
                                    <Text style={{
                                        marginTop: px2dp(5),
                                        fontFamily: "PingFangSC-Medium",
                                        fontSize: moderateScale(14),
                                        color: "#333"
                                    }}>添加要素</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} onPress={()=>this._applyPlan(id)}>
                                <View style={{alignItems: 'center'}}>
                                    <Image source={Images.plan} style={{width: px2dp(32), height: px2dp(32)}}/>
                                    <Text style={{
                                        marginTop: px2dp(5),
                                        fontFamily: "PingFangSC-Medium",
                                        fontSize: moderateScale(14),
                                        color: "#333"
                                    }}>收款计划</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} onPress={this._applyAuditAccounts}>
                                <View style={{alignItems: 'center'}}>
                                    <Image source={Images.audit_account} style={{width: px2dp(32), height: px2dp(32)}}/>
                                    <Text style={{
                                        marginTop: px2dp(5),
                                        fontFamily: "PingFangSC-Medium",
                                        fontSize: moderateScale(14),
                                        color: "#333"
                                    }}>申请查账</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
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
