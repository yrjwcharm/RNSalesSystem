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
import {NavigationActions, StackActions} from "react-navigation";
import Loading from "../../components/Loading";
import {StringUtils} from "../../utils";

export default class Area extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            provinceName: props.navigation.state.params.provinceName,
            provinceCoding: props.navigation.state.params.provinceCoding,
            cityName: props.navigation.state.params.cityName,
            cityCoding: props.navigation.state.params.cityCoding,
            dataArray: [],
            visible:true,
        }
    }
    componentDidMount(): void {
        let url=Config.requestUrl+Config.province.provinceList+`?parentId=${this.state.cityCoding}`;
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            this.setState({visible:false},()=>{
                if(responseText.code==='200'){
                    let obj=eval(responseText.obj);
                    console.log(333,obj);
                    if(!StringUtils.isEmpty(obj[0])) {
                        if (obj[0].title === '市辖区') {
                            obj.shift();
                        }
                    }
                    this.setState({dataArray:obj});
                }
            });

        }).catch(error=>{
            Toast.fail(error)
        })
    }

    _back = (item) => {
        DeviceEventEmitter.emit('p_c_a_success', {
            provinceName: this.state.provinceName,
            provinceCoding: this.state.provinceCoding,
            cityName: this.state.cityName,
            cityCoding: this.state.cityCoding,
            areaName:item.title,
            areaCoding:item.id,
        });
        this.props.navigation.goBack('Main')

    }
    _keyExtractor = (item, index) => index;
    _renderItem = ({item}) => {
        return (
            <TouchableOpacity activeOapcity={0.8} onPress={() => this._back(item)}>
                <View style={{
                    height: px2dp(80),
                    backgroundColor: '#FFF',
                    justifyContent: 'center',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: '#e0e0e0'
                }}>
                    <Text style={{
                        marginLeft: px2dp(20),
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
        const {dataArray} = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                <Title title={'区'} back onPressBack={() => this.props.navigation.goBack()}/>
                <FlatList
                    data={dataArray}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    onEndReachedThreshold={0.1}
                />
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
