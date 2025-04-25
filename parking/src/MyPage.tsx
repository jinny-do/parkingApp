import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function MyPage() {
  return (
    <View style={styles.container}>
      {/* 프로필 영역 */}
      <View style={styles.profileBox}>
        <Icon name="user-circle" size={100} color="#bbb" />
        <Text style={styles.name}>홍길동님</Text>
        <Text style={styles.email}>email: hong@example.com</Text>
        <Text style={styles.carNum}>차량 번호 : 123가 4567</Text>
      </View>

      {/* 로그아웃 버튼 */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
    backgroundColor: '#fff',
  },

  profileBox: {
    alignItems: 'center',
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },

  email: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },

  logoutButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
  },

  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  tabBarPlaceholder: {
    height: 60,
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },

  carNum: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
});
