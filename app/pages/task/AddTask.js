import React, {PureComponent} from 'react';
import {ScrollView,Dimensions,Linking,SafeAreaView,StyleSheet,DeviceEventEmitter,Image,FlatList,Platform,BackHandler,View,Text,Alert,ImageBackground,TouchableOpacity} from 'react-native'
import Title from '../../components/Title'
import {StringUtils} from "../../utils";
import {Input} from "teaset";
import SmallButton from "../../components/SmallButton";
import Modal, {ModalContent} from "react-native-modals";
import DatePicker from "../../components/DatePicker";
import Loading from "../../components/Loading";

const ModalTitle = (props) => {
    return (
        <View style={{height: px2dp(90), justifyContent: 'center'}}>
            <View style={{
                marginHorizontal: px2dp(26),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <TouchableOpacity activeOpacity={0.8} onPress={props.onCancel}>
                    <Text style={{
                        fontFamily: "PingFangSC-Medium",
                        fontSize: moderateScale(14),
                        color: "#2e93ff"
                    }}>取消</Text>
                </TouchableOpacity>
                <Text style={{
                    fontFamily: "PingFangSC-Medium",
                    fontSize: moderateScale(14),
                    color: "#333",
                    fontWeight: 'bold'
                }}>{props.title}</Text>
                <TouchableOpacity activeOpacity={0.8} onPress={props.onConfirm}>
                    <Text style={{
                        fontFamily: "PingFangSC-Medium",
                        fontSize: moderateScale(14),
                        color: "#2e93ff"
                    }}>确定</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default class AddTask extends PureComponent {
    // 默认属性
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            executeTypeName:'',//执行方式
            taskTypeName:'', //任务目的
            planCompleteTime:'', //计划时间
            taskDetail:'',  //任务要求
            customBackgroundModal: false,
            defaultAnimationModal: false,
            scaleAnimationModal: false,
            slideAnimationModal: false,
            bottomModalAndTitle: false,
            bottomModalAndTitle1:false,
            bottomModal: false,
            executeTypeList:[],
            executeTypeId:'',
            executeTypeItem:{},
            userInfo:null,
            taskGoalList:[],
            taskGoalItem:{},
            taskType:'',
            visible:true,
        }
    }
    componentDidMount(): void {
        store.get('userInfo').then(userInfo=>{
            this.setState({userInfo},()=>{
                this._getExecuteTypeList();
            });
        })

    }
    _showPlanTimePicker = () => {
        this.refs.datePicker.show({
            title: "请选择日期", //标题
            // years: 10, //展示总年数
            // lastYear: 2020, //展示最后一年，须同时传years
            selectedValue: this.state.date, //默认选择的日期，格式"yyyy-MM-dd"
            onPickerConfirm: (chooseDate) => { //确认回调，格式"yyyy-MM-dd"
                this.setState({
                    planCompleteTime: chooseDate,
                });
            },
        });
    };
    //获取执行方式
    _getExecuteTypeList=()=>{
        let url=Config.requestUrl+Config.dataDictionary.customerLabelList+`?onlyMark=renwuleixing`;
        fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
            if(responseText.code==='200'){
                let obj=eval(responseText.obj);
                obj.map(item => {
                    item.checked = false;
                })
                console.log("nb",obj);
                this.setState({executeTypeList: obj});
            }
            this._getTaskGoalList()
        }).catch(error=>{
            Toast.fail(error);
        })
    }
    //获取任务目的列表
    _getTaskGoalList = () => {
        let url = Config.requestUrl + Config.dataDictionary.customerLabelList + `?onlyMark=renwumudi`;
        console.log(4444, url);
        fetch(url, {method: 'POST'}).then(res => {
            console.log(333, res);
            return res.json()
        }).then(responseText => {
            console.log('renwumudi', responseText);
            this.setState({visible:false},()=>{
                if (responseText.code === '200') {
                    let obj = eval(responseText.obj);
                    console.log("nb",obj);
                    this.setState({taskGoalList: obj});
                }
            });

        }).catch(error => {
            Toast.fail(error)
        })
    }
    _confirm = () => {
        const {executeTypeItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(executeTypeItem).length === 0) {
            Toast.info('请选择执行方式');
            return;
        }
        this.setState({
            bottomModalAndTitle: false,
            executeTypeName: executeTypeItem.itemValue,
            executeTypeId:executeTypeItem.dicId,
        });

    }
    _cancel = () => {
        this.setState({
            bottomModalAndTitle: false,
            executeTypeItem: {}
        }, () => {
            this._getExecuteTypeList();
        });
    }
    _selectExecuteTypeLabel = (item) => {
        this.state.executeTypeList.map(item => {
            item.checked = false;
        });
        item.checked = true;
        this.setState({
            executeTypeList: [
                ...this.state.executeTypeList,
            ],
            executeTypeItem: item,
        });
        console.log(444, this.state.executeTypeList);
    }
    _confirm2 = () => {
        const {taskGoalItem} = this.state;
        //判断对象是否为空......
        if (Object.keys(taskGoalItem).length === 0) {
            Toast.info('请选择任务目的');
            return;
        }
        this.setState({
            bottomModalAndTitle1: false,
            taskTypeName: taskGoalItem.itemValue,
            taskType:taskGoalItem.dicId,
        });

    }
    _cancel2 = () => {
        this.setState({
            bottomModalAndTitle1: false,
            taskGoalItem: {}
        }, () => {
            this._getTaskGoalList()
        });
    }
    _selectTaskTypeNameLabel = (item) => {
        this.state.taskGoalList.map(item => {
            item.checked = false;
        });
        item.checked = true;
        this.setState({
            taskGoalList: [
                ...this.state.taskGoalList,
            ],
            taskGoalItem: item,
        });
        console.log(444, this.state.taskGoalList);
    }
    _addTask=()=>{
        // this.setState({
        //     defaultAnimationModal: true,
        // });
        const {taskId,userInfo:{userId},executeTypeId,taskType,planCompleteTime,taskDetail}=this.state;
        let taskTypeId;
        if(taskId===undefined){
            taskTypeId='';
        }else{
            taskTypeId=taskId;
        }
        if(StringUtils.isEmpty(executeTypeId)){
            Toast.info('请选择执行方式')
            return;
        }
        if(StringUtils.isEmpty(taskType)){
            Toast.info('请选择任务目的')
            return;
        }
        if(StringUtils.isEmpty(planCompleteTime)){
            Toast.info('请选择计划时间')
            return;
        }
        if(StringUtils.isEmpty(taskDetail)){
            Toast.info('请输入任务要求')
            return;
        }
        const  {params}=this.props.navigation.state;
        this.setState({visible:true},()=>{
            let url=Config.requestUrl+Config.addTaskPageInterface.addTask+`?purposeId=${params.intentionId}&userId=${userId}&recipientPersonId=${userId}&taskId=${taskTypeId}&executeTypeId=${executeTypeId}&taskType=${taskType}&planCompleteTime=${planCompleteTime}&taskDetail=${taskDetail}`;
            console.log(555,url);
            fetch(url,{method:'POST'}).then(res=>res.json()).then(responseText=>{
              this.setState({visible:false},()=>{
                  if(responseText.code==='200'){
                      this.setState({defaultAnimationModal:true});
                  }
              });
            }).catch(error=>{
                Toast.fail(error)
            })
        });

    }
    /*执行方式*/
    _confirm1=()=>{
        this.setState({
            defaultAnimationModal: false,
        },()=>{
            DeviceEventEmitter.emit('update_customer_archives_task',true);
            this.props.navigation.goBack();
        });

    }
    _cancel1=()=>{
        this.setState({
            defaultAnimationModal: false,
        });
    }
    // 渲染
    render() {
        const {executeTypeList,taskGoalList,executeTypeName,taskTypeName,planCompleteTime,taskDetail}=this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#f2f2f2'}}>
                <Title title={'添加任务'} back onPressBack={()=>this.props.navigation.goBack()}/>
                <View style={{marginTop:moderateScale(15),paddingHorizontal:moderateScale(13),flex:1}}>
                    <View style={{borderRadius: scale(5),
                        backgroundColor: "#fff",
                        shadowColor: "rgba(0, 0, 0, 0.06)",
                        shadowOffset: {
                            width: 0,
                            height: verticalScale(2)
                        },
                        shadowRadius: scale(10),
                        shadowOpacity: 1,}}>
                        <DefaultInput1
                            required
                            onPress={
                                ()=>{
                                    this.setState({bottomModalAndTitle:true});
                                }
                            } editable={false} placeholder={'请选择执行方式'} title={'执行方式'} value={executeTypeName} noBorder/>
                        <DefaultInput1
                            required
                            onPress={
                                ()=>{
                                    this.setState({bottomModalAndTitle1:true});
                                }
                            } editable={false} placeholder={'请选择任务目的'} title={'任务目的'} value={taskTypeName} noBorder/>
                        <DefaultInput1
                            required
                            onPress={
                           this._showPlanTimePicker
                        }  editable={false} title={'计划时间'}  placeholder={'请选择计划时间'} value={planCompleteTime} noBorder />
                        <DefaultInput required
                                      title={'任务要求'}  placeholder={'请输入任务要求'} value={taskDetail} noBorder onChangeText={(taskDetail)=>{
                            this.setState({taskDetail});
                        }}/>
                    </View>
                    {/*执行方式*/}
                    <Modal.BottomModal
                        visible={this.state.bottomModalAndTitle}
                        onTouchOutside={() => this.setState({bottomModalAndTitle: false})}
                        height={0.5}
                        width={1}
                        onSwipeOut={() => this.setState({bottomModalAndTitle: false})}
                        modalTitle={
                            <ModalTitle
                                title="执行方式"
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
                                    {executeTypeList && executeTypeList.map(item => {
                                        return (
                                            <TouchableOpacity onPress={() => this._selectExecuteTypeLabel(item)}
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
                    {/*任务目的*/}
                    <Modal.BottomModal
                        visible={this.state.bottomModalAndTitle1}
                        onTouchOutside={() => this.setState({bottomModalAndTitle1: false})}
                        height={0.5}
                        width={1}
                        onSwipeOut={() => this.setState({bottomModalAndTitle1: false})}
                        modalTitle={
                            <ModalTitle
                                title="任务目的"
                                onCancel={this._cancel2}
                                onConfirm={this._confirm2}
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
                                    {taskGoalList && taskGoalList.map(item => {
                                        return (
                                            <TouchableOpacity onPress={() => this._selectTaskTypeNameLabel(item)}
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
                                }}>任务已添加</Text>
                                <Text style={{
                                    marginTop:px2dp(20),
                                    marginLeft: moderateScale(22), fontFamily: "PingFangSC-Medium",
                                    fontSize: moderateScale(14),
                                    color: "#999"
                                }}>新任务已添加，请查看。</Text>
                                <SmallButton name={'确认'} width={px2dp(420)} height={px2dp(90)} onPress={this._confirm1}/>
                            </View>
                        </ModalContent>
                    </Modal>
                </View>
                <View style={{justifyContent:'flex-end',flex:1,bottom:px2dp(30),alignItems:'center'}}>
                    <SmallButton name={'保存'} onPress={this._addTask}/>
                </View>
                <DatePicker ref={"datePicker"} hide={true}/>
                <Loading visible={this.state.visible}/>
            </SafeAreaView>
        );
    }

}
const DefaultInput=(props)=>{
    return(
        <View style={{height:verticalScale(40),justifyContent:'center',backgroundColor: 'transparent',borderBottomWidth:props.noBorder?0:StyleSheet.hairlineWidth,borderBottomColor:'#e0e0e0'}}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Text style={{marginLeft:moderateScale(22),fontFamily: "PingFangSC-Medium",
                    fontSize: moderateScale(14),
                    color: "#333"}}>{props.required?<Text style={{color:'red'}}>*</Text>:''} {props.title}</Text>
                <Input  style={{borderWidth:0,flex:1,paddingLeft:px2dp(40),height:verticalScale(40),marginRight:moderateScale(10),fontSize:moderateScale(14),}}  onChangeText={props.onChangeText}
                        value={props.value} placeholder={props.placeholder}/>
            </View>
        </View>
    );
}
const DefaultInput1=(props)=>{
    return(
        <TouchableOpacity onPress={props.onPress} activieOpacity={0.8}>
            <View style={{height:verticalScale(40),justifyContent:'center',backgroundColor: 'transparent',borderBottomWidth:props.noBorder?0:StyleSheet.hairlineWidth,borderBottomColor:'#e0e0e0'}}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                    <Text style={{marginLeft:moderateScale(22),fontFamily: "PingFangSC-Medium",
                        fontSize: moderateScale(14),
                        color: "#333"}}>{props.required?<Text style={{color:'red'}}>*</Text>:''} {props.title}</Text>
                    <View style={{flexDirection:'row',alignItems:'center',flex:1,marginRight: px2dp(20)}}>
                        <Input  style={{borderWidth:0,flex:1,paddingLeft:px2dp(40),height:verticalScale(40),fontSize:moderateScale(14),}}  onChangeText={props.onChangeText}
                                value={props.value} editable={props.editable} placeholder={props.placeholder}/>
                        <TouchableOpacity activeOpacity={0.8} onPress={props.onPress}>
                            <Image source={Images.arrow} resizeMode={'contain'} style={{width:px2dp(32),height:px2dp(32)}}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
