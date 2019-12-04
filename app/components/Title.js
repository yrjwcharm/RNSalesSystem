/**
 * Created by Rabbit 下午6:40
 */

import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Platform, StatusBar
} from 'react-native';
import { NavigationBar,Slider } from 'beeshell';
const Title = (props) => {
    return (
        <NavigationBar
            title={props.title}
            titleStyle={{fontFamily: "PingFang-SC-Bold",
                fontSize: moderateScale(18),
                color: props.color?"#fff":"#333"
            }}
            style={{height:px2dp(88),backgroundColor: "#F8F8FA",
                shadowColor: "rgba(0, 0, 0, 0.08)",
                shadowOffset: {
                    width: 0,
                    height: px2dp(10)
                },
                shadowRadius: moderateScale(10),
                shadowOpacity: 1,borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:'#c6c6c6'}}
            backLabel={
                props.back? <View>
                    <TouchableOpacity onPress={props.onPressBack}>
                        <Image source={Images.back} resizeMode={'contain'} style={{paddingHorizontal:moderateScale(10),width:scale(7),height:verticalScale(14)}}/>
                    </TouchableOpacity>
                </View>:<View/>
            }
            forwardLabel={props.forward?
                <View>
                    <TouchableOpacity onPress={props.onPressForward}>
                        <Image source={props.source} resizeMode={'contain'} style={{width:scale(18),height:verticalScale(18)}}/>
                    </TouchableOpacity>
                </View>:<View/>

            }
         />
    )

};
export  default Title
