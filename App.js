/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
    StatusBar,
    View,
    Platform,
} from 'react-native';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import GlobalFont from 'react-native-global-font'
import AppContainer from './app/RouterConfig';
import {Root} from 'native-base';
import * as reducers from './app/reducers';
import HotUpdate, { ImmediateCheckCodePush } from 'react-native-code-push-dialog';
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);
type Props = {};
if (!__DEV__) {
    global.console = {
        info: () => {},
        log: () => {},
        warn: () => {},
        debug: () => {},
        error: () => {},
    };
}
export  default class App extends Component<Props> {
  componentDidMount() {
      StatusBar.setBackgroundColor('#F8F8FA')
      StatusBar.setNetworkActivityIndicatorVisible(true);
      global.height = px2dp(88);
  }

  render() {
    return (
        <Root>
            <AppContainer/>
            <HotUpdate isActiveCheck={false}/>
        </Root>
    )
  }
}

