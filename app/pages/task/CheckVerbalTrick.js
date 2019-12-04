import React, {PureComponent} from 'react';
import {ScrollView,Dimensions,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,TextInput,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../../components/Title';
import Collapsible from 'react-native-collapsible';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';
import Loading from "../../components/Loading";
import {StringUtils} from "../../utils";
import HTML from 'react-native-render-html';
export default class CheckVerbalTrick extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state= {
            activeSections: [],
            collapsed: true,
            sections:[],
            visible:true,
        }
    }
    setSections = sections => {
        this.setState({
            activeSections: sections.includes(undefined) ? [] : sections,
        });
    };
    componentDidMount(): void {
        let url=Config.requestUrl+Config.checkVerbalTrick.checkVerbalTrickList;
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            console.log(333,responseText);
            this.setState({visible:false},()=>{
                if(responseText.success){
                    let sections=[];
                    let {list}=responseText.obj;
                    list.map(item=>{
                        sections.push({title:item.title,content:item.content});
                    });
                    this.setState({sections});
                }
            });

        }).catch(error=>{
            Toast.fail(error)
        })
    }

    renderHeader = (section, _, isActive) => {
        return (
            <Animatable.View
                duration={400}
                style={{backgroundColor:'#F8F8FA',height:verticalScale(40),justifyContent:'center',borderBottomColor:'#e6e6e6',borderBottomWidth:scale(1/2)}}
            >
                <View style={{marginLeft:moderateScale(23),marginRight:moderateScale(21),flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                    <Text style={{fontFamily: "PingFangSC-Regular",
                        fontSize: moderateScale(16),
                        color: "#333333"}}>{section.title}</Text>
                    <Image source={isActive?Images.up:Images.down} style={{width:scale(14),height:verticalScale(7)}}/>
                </View>
            </Animatable.View>
        );
    };
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
    renderContent=(section, _, isActive)=> {
        return (
            <Animatable.View
                duration={400}
                style={{justifyContent:'center',backgroundColor:'#fff'}}
            >
                <View style={{marginLeft:px2dp(30),marginRight: px2dp(40),marginTop:px2dp(30),marginBottom:px2dp(40)}}>
                    {this._renderHtml(unescape(section.content))}
                </View>
            </Animatable.View>
        );
    }
    // 渲染
    render() {
        const {activeSections,sections}=this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f2f2f2'}}>
                <Title title={'查看话术'} back onPressBack={() => this.props.navigation.goBack()}/>
                <Accordion
                    activeSections={activeSections}
                    sections={sections}
                    touchableComponent={TouchableOpacity}
                    expandMultiple={false}
                    renderHeader={this.renderHeader}
                    renderContent={this.renderContent}
                    duration={400}
                    onChange={this.setSections}
                />
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
