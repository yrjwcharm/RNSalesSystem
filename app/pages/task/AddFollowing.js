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
    TouchableOpacity
} from 'react-native'
import {Textarea} from 'native-base'
import Title from '../../components/Title';
import Modal, {
    ModalContent,
    ModalFooter,
    ModalButton,
    SlideAnimation,
    ScaleAnimation,
} from 'react-native-modals';
import SmallButton from "../../components/SmallButton";
import ActionSheet from "react-native-actionsheet";
import ImagePicker from "react-native-image-crop-picker";
import Loading from "../../components/Loading";
import {StringUtils} from "../../utils";

const ModalTitle = (props) => {
    return (
        <View style={[{height: px2dp(90), justifyContent: 'center'}, props.style]}>
            <View style={{
                marginHorizontal: px2dp(26),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <TouchableOpacity activeOpacity={0.8} onPress={props.onCancel}>
                    <View style={{height: px2dp(90), justifyContent: 'center'}}>
                        <Text style={{
                            fontFamily: "PingFangSC-Medium",
                            fontSize: moderateScale(14),
                            color: "#2e93ff",
                        }}>取消</Text>
                    </View>
                </TouchableOpacity>
                <View style={{height: px2dp(90), justifyContent: 'center'}}>
                    <Text style={{
                        fontFamily: "PingFangSC-Medium",
                        fontSize: moderateScale(14),
                        color: "#333",
                        fontWeight: 'bold'
                    }}>{props.title}</Text>
                </View>
                <TouchableOpacity activeOpacity={0.8} onPress={props.onConfirm}>
                    <View style={{height: px2dp(90), justifyContent: 'center'}}>
                        <Text style={{
                            fontFamily: "PingFangSC-Medium",
                            fontSize: moderateScale(14),
                            color: "#2e93ff"
                        }}>确定</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default class AddFollowing extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            bottomModalAndTitle: false,
            defaultAnimationModal:false,
            followType:'',
            followTypeList:[],
            followTypeItem:{},
            imagePath:Images.add_pic,
            followTypeId:'',
            visible:true,
            followContent:'',
            userInfo:null,
        }
    }
    componentDidMount(): void {
        store.get('userInfo').then(userInfo=>{
            this.setState({userInfo},()=>{
                this._getFollowingTypeList();
            });
        })

    }
    _getFollowingTypeList=()=>{
        let url=Config.requestUrl+Config.dataDictionary.customerLabelList+`?onlyMark=genjinleixing`;
        fetch(url, {method: 'POST'}).then(res => {
            console.log(333, res);
            return res.json()
        }).then(responseText => {
            console.log(3333, responseText);
            this.setState({visible:false},()=>{
                if (responseText.code === '200') {
                    let obj = eval(responseText.obj);
                    obj.map(item => {
                        item.checked = false;
                    })
                    console.log("nb",obj);
                    this.setState({followTypeList: obj});
                }
            });

        }).catch(error => {
            Toast.fail(error)
        })
    }
    _confirm = () => {
        const {followTypeItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(followTypeItem).length === 0) {
            Toast.info('请选择跟进类型');
            return;
        }
        this.setState({
            bottomModalAndTitle: false,
            followType: followTypeItem.itemValue,
            followTypeId:followTypeItem.dicId,
        }, () => {
            // this.props.navigation.goBack();
        });

    }
    _cancel = () => {
        this.setState({
            bottomModalAndTitle: false,
            followTypeItem: {}
        }, () => {
           this._getFollowingTypeList();
        });
    }
    _selectFollowingType = (item) => {
        this.state.followTypeList.map(item => {
            item.checked = false;
        });
        item.checked = true;
        this.setState({
            followTypeList: [
                ...this.state.followTypeList,
            ],
            followTypeItem: item,
        });
        console.log(444, this.state.followTypeList);
    }
    _cancel1=()=>{
        this.setState({
            defaultAnimationModal: false,
        });
    }
    _confirm1=()=>{
        this.setState({
            defaultAnimationModal: false,
        },()=>{
            DeviceEventEmitter.emit('update_customer_archives_follow',true);
            this.props.navigation.goBack();
        });

    }
    _submit=()=>{
        const {followContent,followTypeId,purposeId,followTypeItem}=this.state;
        const {userId}=this.state.userInfo;
        const {params}=this.props.navigation.state;
        if (Object.keys(followTypeItem).length === 0) {
            Toast.info('请选择跟进类型');
            return;
        }
        if(StringUtils.isEmpty(followContent)){
            Toast.info('跟进信息不能为空')
            return;
        }
        this.setState({visible:true},()=>{
            let url=Config.requestUrl+Config.addFollowing.saveFollowing+`?followContent=${followContent}&userId=${userId}&followTypeId=${followTypeId}&purposeId=${params.intentionId}`
            console.log(333,url);
            fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
                this.setState({visible:false},()=>{
                    if(responseText.success){
                        this.setState({defaultAnimationModal:true});
                    }
                });

            }).catch(error=>{
                Toast.fail(error)
            })
        });

    }

    //拍照
    _getPicFromCapture = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(444, image.path);
            this.setState({
                imagePath:{uri:image.path}
            });

        });
    }
    //从相册选取
    _getPicFromGallery = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            // mediaType: "photo",
        }).then(image => {
            this.setState({
                imagePath:{uri:image.path}
            });
        });
    };
    _showActionSheet = () => {
        this.ActionSheet.show();
    }
    // 渲染
    render() {
        const {followType,followTypeList}=this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                <Title title={'添加跟进'} back onPressBack={() => this.props.navigation.goBack()}/>
                <Menu required style={{borderRadius:px2dp(10),marginTop:px2dp(26)}}title={'跟进类型'} detail={followType} onPress={() => {
                    this.setState({
                        bottomModalAndTitle: true,
                    });
                }}/>
                <View style={{marginTop:px2dp(26),marginHorizontal: px2dp(26),backgroundColor:'#fff',borderRadius:px2dp(10)}}>
                    <Textarea onChangeText={(followContent)=>{
                        this.setState({followContent});
                    }} rowSpan={5}  placeholder="跟进信息" style={{paddingTop:px2dp(15),paddingLeft:px2dp(30),color:'#333',fontSize:px2dp(28)}} />
                </View>
                <View style={{paddingHorizontal:px2dp(20),borderRadius:px2dp(10),marginTop:px2dp(26),marginHorizontal:px2dp(26),height: px2dp(260), justifyContent: 'center', backgroundColor: '#fff'}}>
                    <Text style={{
                        fontFamily: "PingFangSC-Medium",
                        fontSize: moderateScale(14),
                        color: "#333"
                    }}>上传图片</Text>
                    <View>
                        <TouchableOpacity activeOpacity={0.8} onPress={this._showActionSheet}>
                            <View style={{flexDirection: 'row',marginTop:px2dp(20)}}>
                                <Image source={this.state.imagePath} style={{width: px2dp(128), height: px2dp(128)}}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <Modal.BottomModal
                    visible={this.state.bottomModalAndTitle}
                    onTouchOutside={() => this.setState({bottomModalAndTitle: false})}
                    height={0.5}
                    width={1}
                    onSwipeOut={() => this.setState({bottomModalAndTitle: false})}
                    modalTitle={
                        <ModalTitle
                            title="跟进信息"
                            onCancel={this._cancel}
                            onConfirm={this._confirm}
                        />
                    }
                >
                    <ModalContent
                        style={{
                            flex: 1,
                            backgroundColor: 'fff',
                        }}
                    >
                            <ScrollView keyboardShouldPersistTaps={Platform.OS==='android'?'always':'never'}>
                                {followTypeList && followTypeList.map(item => {
                                    return (
                                        <TouchableOpacity onPress={() => this._selectFollowingType(item)}
                                                          activeOpacity={0.8}>
                                            <View style={{
                                                backgroundColor: item.checked ? '#2e93ff' : '#fff',
                                                height: px2dp(80),
                                                justifyContent: 'center',
                                                borderBottomColor: '#e0e0e0',
                                                borderBottomWidth: StyleSheet.hairlineWidth
                                            }}>
                                                <View style={{alignItems: 'center',}}>
                                                    <Text style={{
                                                        fontFamily: "PingFangSC-Medium",
                                                        fontSize: moderateScale(14),
                                                        color: item.checked ? "#fff" : '#999'
                                                    }}>
                                                        {item.itemValue}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })
                                }
                        </ScrollView>
                    </ModalContent>
                </Modal.BottomModal>

                <Modal
                    width={0.65}
                    visible={this.state.defaultAnimationModal}
                    rounded
                    actionsBordered
                    onTouchOutside={() => {
                        this.setState({ defaultAnimationModal: false });
                    }}
                    modalTitle={
                        <TouchableOpacity activeOpacity={0.8} onPress={this._cancel1}>
                            <View style={{flexDirection:'row',justifyContent:'flex-end',paddingTop:px2dp(12),paddingRight:px2dp(12)}}>
                                <Image source={Images.exclude} style={{width:px2dp(32),height:px2dp(32)}}/>
                            </View>
                        </TouchableOpacity>
                    }
                >
                    <ModalContent
                        style={{ backgroundColor: '#fff' }}
                    >
                        <View style={{alignItems:'center'}}>
                            <Image source={Images.success} resizeMode={'contain'} style={{width:px2dp(48),height:px2dp(48)}}/>
                            <Text style={{
                                textAlign:'center',
                                marginTop:px2dp(20),
                                marginLeft: moderateScale(22), fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(15),
                                color: "#666"
                            }}>内容已提交</Text>
                            <Text style={{
                                marginTop:px2dp(20),
                                marginLeft: moderateScale(22), fontFamily: "PingFangSC-Medium",
                                fontSize: moderateScale(14),
                                color: "#999"
                            }}>请刷新后查看。</Text>
                            <SmallButton name={'确认'} width={px2dp(420)} height={px2dp(90)} onPress={this._confirm1}/>
                        </View>
                    </ModalContent>
                </Modal>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'选择照片'}
                    options={['拍照', '从相册选取','取消']}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={2}
                    onPress={(index) => {
                        if (index ===0) {
                           this._getPicFromCapture();
                        } else if (index === 1) {
                            this._getPicFromGallery()
                        }
                    }
                    }
                />
                <View style={{justifyContent:'flex-end',flex:1,bottom:px2dp(30),alignItems:'center'}}>
                    <SmallButton name={'保存'} onPress={this._submit}/>
                </View>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
const Menu = (props) => {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={props.onPress}>
        <View style={[{marginHorizontal:px2dp(26),height: px2dp(100), justifyContent: 'center', backgroundColor: '#fff'},props.style]}>
            <View style={{flexDirection: 'row',paddingHorizontal:px2dp(30), alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{
                    fontFamily: "PingFangSC-Medium",
                    fontSize: moderateScale(14),
                    color: "#333"
                }}>{props.required?<Text style={{color:'red'}}>*</Text>:''} {props.title}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{
                            fontFamily: "PingFangSC-Medium",
                            fontSize: moderateScale(14),
                            color: "#999"
                        }}>{props.detail}</Text>
                        <Image source={Images.arrow} style={{width: px2dp(32), height: px2dp(32)}}/>
                    </View>

            </View>
        </View>
        </TouchableOpacity>
    );
}
