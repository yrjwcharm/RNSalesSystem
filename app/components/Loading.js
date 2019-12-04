import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';

const Loading = (props) => {
    return (
        <Spinner size="small"  visible={props.visible} textContent={props.content ? props.content : "请稍等..."}
                 textStyle={{color: '#FFF', fontSize: moderateScale(14)}}/>
    )
};
export default Loading;
