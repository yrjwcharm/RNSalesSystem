import React, {Component} from "react";
import {
    View,
    Text,
    Dimensions,
    SectionList,
    Platform,
    StatusBar,
    FlatList,
    NativeModules,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from 'react-native'
import {
    Container,
    Content,
    StyleProvider,
} from 'native-base';
import pinyin from 'pinyin';
import Title from "../../components/Title1";
import Loading from "../../components/Loading";
const { StatusBarManager } = NativeModules;
let statusHeight =0;
const rowHeight = 40;
let itemNo=0;
export default class ContactPersonList extends Component {

    constructor() {
        super();
        this.state = {
            sections: [],       //section数组
            letterArr: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],      //首字母数组
            showIndex: -1,
            sortType:1,
            visible:true,
            taskList:[],
            // visible:true,
            totalPage:0,

            //上拉加载更多 下拉刷新
            page:1,
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
            showFoot:0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing:false,//下拉控制
        };
    }


    componentWillMount() {
        if(Platform.OS==='android'){
            statusHeight=StatusBar.currentHeight;
        }else{
                StatusBarManager.getHeight((statusBarHeight) => {
                    statusHeight=statusBarHeight
                })
        }
       this._queryList();
    }
    _queryList=()=>{
        let sections = [], letterArr = [];
        let url=Config.requestUrl+Config.contactDetailPageInterface.contactList;
        console.log(3333,url);
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            console.log(888,responseText);
            this.setState({visible:false},()=>{
                if(responseText.success){
                    const {list}=responseText.obj;
                    // 右侧字母栏数据处理
                    list.map((item, index) => {

                        letterArr.push(pinyin(item.linkName.substring(0, 1), {
                            style: pinyin.STYLE_FIRST_LETTER,
                        })[0][0].toUpperCase());

                        letterArr = [...new Set(letterArr)].sort();

                        this.setState({letterArr: letterArr})
                    });

                    // 分组数据处理
                    letterArr.map((item, index) => {
                        sections.push({
                            title: item,
                            data: []
                        })
                    });

                    list.map(item => {
                        let listItem = item;
                        sections.map(item => {
                            let first = listItem.linkName.substring(0, 1);
                            let test = pinyin(first, {style: pinyin.STYLE_FIRST_LETTER})[0][0].toUpperCase();

                            if (item.title === test) {
                                item.data.push({firstName: first, name: listItem.linkName});
                            }
                        })
                    });
                    this.setState({sections});
                    // let totalPage=Math.ceil(total/10);
                    // this._rebuildDataByPaging(sections,totalPage);

                }
            });

        }).catch(error=>{
            Toast.fail(error);
        })
    }
    _keyExtractor = (item, index) => index;
    // 字母关联分组跳转
    _onSectionSelect = (key) => {
        this.refs._sectionList.scrollToLocation({
            itemIndex: 0,
            sectionIndex: key,
            viewOffset: 20,
        })
    };
    // 分组列表的头部
    _renderSectionHeader=(sectionItem)=> {
        const {section} = sectionItem;
        return (
            <View style={{justifyContent:'center',height:px2dp(30),backgroundColor:'#f5f5f5'}}>
                <Text style={{marginLeft:px2dp(30),color:'#666',fontSize:moderateScale(13)}}>{section.title.toUpperCase()}</Text>
            </View>
        );
    }
    _relationOp=()=>{
        const {params}=this.props.navigation.state;
        // let url=Config.requestUrl+Config.contactDetailPageInterface.relationLinker+``;
    }

    // 分组列表的renderItem
    _renderItem=({item,index})=>{
        // const {showIndex} = this.state;
        console.log(3333,item);
        return (
            <TouchableOpacity
                activeOpacity={0.75}
                onPress={this._relationOp}
            >
                <View style={{justifyContent:'center',height:px2dp(80),backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#e0e0e0'}}>
                    <Text style={{marginLeft:px2dp(30),fontSize:moderateScale(15),color:'#333'}}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }
    /*每一项的高度(rowHeight)和其在父组件中的偏移量(offset)和位置(index)
    * length :  当前rowItem的高度
    * offset ： 当前rowItem在父组件中的偏移量（包括rowItem的高度 + 分割线的高度 + section的高度）
    * index  :  当前rowItem的位置
    *
    * 如果需要手动的跳转。则必须实现此方法
    * */
    _getItemLayout=(data, index)=> {
        return {length: rowHeight, offset: rowHeight * index, index};
    }

    render() {
        const {letterArr, sections} = this.state;
        // 偏移量
        // 偏移量
        const top_offset = (Dimensions.get('window').height - letterArr.length * moderateScale(13)) / 2;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f2f2f2'}}>
                <Title title={'关联联系人'} back   onPressBack={()=>this.props.navigation.goBack()} />
                    {/*<Content contentContainerStyle={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>*/}
                        <SectionList
                            ref="_sectionList"
                            renderItem={this._renderItem}
                            renderSectionHeader={this._renderSectionHeader}
                            getItemLayout={this._getItemLayout}
                            sections={sections}
                            // ItemSeparatorComponent={() => <View/>}
                            keyExtractor={this._keyExtractor}
                            // refreshing={false}
                            // ListFooterComponent={this._renderFooter}
                            onEndReached={this._onEndReached}
                            onEndReachedThreshold={0.2}
                            //为刷新设置颜色
                            // refreshControl={
                            //     <RefreshControl
                            //         refreshing={this.state.isRefreshing}
                            //         onRefresh={this.handleRefresh.bind(this)}//因为涉及到this.state
                            //         colors={['#ff0000', '#00ff00','#0000ff','#3ad564']}
                            //         progressBackgroundColor="#ffffff"
                            //     />
                            // }
                        />
                    {/*<View style={{position:'absolute',width:px2dp(52),right:0,top:top_offset}}>*/}
                    {/*    /!*<View style={{width:20,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#a3d0ee'}}>*!/*/}
                    {/*    <FlatList*/}
                    {/*        data= {letterArr}*/}
                    {/*        keyExtractor = {(item, index) => index.toString()}       //不重复的key*/}
                    {/*        renderItem={({item,index}) =>*/}
                    {/*            <TouchableOpacity style={{marginVertical:2,height:px2dp(36),flexDirection:'row',justifyContent:'center',alignItems:'center'}}*/}
                    {/*                              onPress={()=>{this._onSectionSelect(index)}}*/}
                    {/*            >*/}
                    {/*                <Text style={{fontSize:moderateScale(13)}}>{item.toUpperCase()}</Text>*/}
                    {/*            </TouchableOpacity>*/}
                    {/*        }*/}
                    {/*    />*/}
                    {/*    /!*</View>*!/*/}
                    {/*</View>*/}
                    {/*/!*</Content>*!/*/}
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        )
    }
}
