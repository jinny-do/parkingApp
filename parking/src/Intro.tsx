//Intro.tsx

import React, {JSX} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useNavigation, ParamListBase} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useFocusEffect} from '@react-navigation/native'; //화면으로 포커스가 왔을 때 이벤트를 끌고 오는 것

function Intro(): JSX.Element {
  console.log('-- Intro()');

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  //사용자가 화면을 실행시켰을 때 설정한 시간이 지나면 다음으로 화면을 넘어가게 해보자 ->useFocusEffect hooking
  useFocusEffect(
    React.useCallback(() => {
      //이 앱에 포커스가 맞춰졌을 때 콜백이 실행이 되고 setTimeout을 통해 2초 후에 자동으로 안 쪽이 실행됨
      setTimeout(() => {
        let isAutoLogin = false;

        if (isAutoLogin) {
          //로그인 되어있는 상태라면 2초 뒤에 Main 화면으로 넘어감
          navigation.push('Main');
        } else {
          //로그인 되어있지 않은 상태라면 2초 뒤에 Login 화면으로 넘어감
          navigation.push('Login');
        }
      }, 2000);
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Icon name="car" size={100} color={'#3498db'} />
      <Text style={styles.text}>주차관리시스템</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export default Intro;
