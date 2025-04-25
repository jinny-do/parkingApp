//Main.tsx

import {JSX} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Parking from './Parking';
import Cash from './Cash';
import MyPage from './MyPage';

function Main(): JSX.Element {
  console.log('-- Main()');

  const BottomTab = createBottomTabNavigator();

  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        name="주차자리보기"
        component={Parking}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon name="car" size={size} color={color} />
          ),
        }}
      />

      <BottomTab.Screen
        name="캐시"
        component={Cash}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon name="coins" size={size} color={color} />
          ),
        }}
      />

      <BottomTab.Screen
        name="MyPage"
        component={MyPage}
        options={{
          headerShown: true,
          title: '마이페이지',
          tabBarIcon: ({color, size}) => (
            <Icon name="pen" size={size} color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

const styles = StyleSheet.create({
  textBlack: {
    fontSize: 18,
    color: 'black',
  },

  textBlue: {
    fontSize: 18,
    color: 'blue',
  },
});

export default Main;
