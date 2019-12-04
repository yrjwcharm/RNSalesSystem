import React, {PureComponent} from 'react';
import {ScrollView,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../../components/Title'
import {Input} from "teaset";
import ListRow from "teaset/components/ListRow/ListRow";
import  ImagePicker from "react-native-image-crop-picker";
import ActionSheet from "react-native-actionsheet";
export default class Profile extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            avatarSource:Images.avatar
        }
    }
    _jumpToErWeiMaRouter=()=>{
        this.props.navigation.navigate('ErWeiMa');
    }
    _jumpToUserSettingsRouter=()=>{
            this.props.navigation.navigate('UserSettings')
    }
    _showActionSheet = () => {
        this.ActionSheet.show();
    }

    //拍照
    _getAvatarFromCapture = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            let source = {uri: image.path};
            this.setState({
                avatarSource: source,
            }, () => {
                this.uploadImage(image.path);
            });
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
            let source = {uri: image.path};
            this.setState({
                avatarSource: source,
            }, () => {
                this.uploadImage(image.path);
            });

        });
    }
    uploadImage = (uri) => {
        this.setState({
            visible: true
        })
    };
    // 渲染
    render() {
        const {avatarSource}=this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#eee'}}>
                    <Title title={'个人主页'}/>
                <View style={{justifyContent:'center',flexDirection:'row',marginTop:moderateScale(20),marginBottom:moderateScale(20)}}>
                    <TouchableOpacity activeOpacity={0.8} onPress={this._showActionSheet}>
                    <Image source={avatarSource}  style={{borderRadius:scale(64),width:scale(128),height:verticalScale(128)}}/>
                    </TouchableOpacity>
                </View>
                    <ListRow titleStyle={{fontFamily: "PingFangSC-Regular",
                        fontSize: moderateScale(14),
                        color: "#333333"}} detailStyle={{fontFamily: "PingFangSC-Regular",
                        fontSize: moderateScale(14),
                        color: "#333333"}} style={{height:verticalScale(50)}} title={'姓名'} detail={'yanrf'}/>
                    <ListRow titleStyle={{fontFamily: "PingFangSC-Regular",
                        fontSize: moderateScale(14),
                        color: "#333333"}} detailStyle={{fontFamily: "PingFangSC-Regular",
                        fontSize: moderateScale(14),
                        color: "#333333"}} style={{height:verticalScale(50)}} title={'职位'} detail={'销售经理'}/>
                    <ListRow  titleStyle={{fontFamily: "PingFangSC-Regular",
                        fontSize: moderateScale(14),
                        color: "#333333"}} detailStyle={{fontFamily: "PingFangSC-Regular",
                        fontSize: moderateScale(14),
                        color: "#333333"}} style={{height:verticalScale(50)}}title={'手机'} detail={'18311410379'}/>
                    <ListRow titleStyle={{fontFamily: "PingFangSC-Regular",
                        fontSize: moderateScale(14),
                        color: "#333333"}} detailStyle={{fontFamily: "PingFangSC-Regular",
                        fontSize: moderateScale(14),
                        color: "#333333"}} style={{height:verticalScale(50)}}title={'我的二维码名片'}   onPress={this._jumpToErWeiMaRouter}/>
                    <ListRow titleStyle={{fontFamily: "PingFangSC-Regular",
                        fontSize: moderateScale(14),
                        color: "#333333"}} detailStyle={{fontFamily: "PingFangSC-Regular",
                        fontSize: moderateScale(14),
                        color: "#333333"}} style={{height:verticalScale(50)}} title={'设置'} onPress={this._jumpToUserSettingsRouter}/>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'头像上传'}
                    options={['拍照', '从相册选取', '取消']}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={1}
                    onPress={(index) => {
                        if (index === 0) {
                            this._getAvatarFromCapture();
                        } else if (index === 1) {
                            this._getAvatarFromGallery();
                        } else if (index === 2) {
                        }
                        /* do something */
                    }
                    }
                />
            </SafeAreaView>
        );
    }

}
