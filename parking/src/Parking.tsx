//Parking.tsx

import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

// 임시 자리 데이터 (차가 있으면 occupied: true)
const initialSpaces = [
  {id: 1, occupied: false},
  {id: 2, occupied: true},
  {id: 3, occupied: false},
  {id: 4, occupied: true},
];

export default function Parking() {
  const [spaces, setSpaces] = useState(initialSpaces);

  type ParkingRouteParams = {
    newBalance?: number;
  };

  const route =
    useRoute<RouteProp<Record<string, ParkingRouteParams>, string>>();
  const balance = route.params?.newBalance ?? 1000;

  let color = '';
  let message = '';

  if (balance >= 10000) {
    color = '#66cc66';
    message = '충분합니다!';
  } else if (balance >= 3000) {
    color = '#ffcc00';
    message = '곧 충전하세요~';
  } else {
    color = '#ff6666';
    message = '충전이 필요합니다!';
  }

  const renderItem = ({item}: {item: {id: number; occupied: boolean}}) => (
    <View
      style={[
        styles.space,
        {backgroundColor: item.occupied ? '#F06C6C' : '#81C78F'},
      ]}>
      <Text style={styles.spaceText}>{item.id}</Text>
    </View>
  );

  const availableCount = spaces.filter(s => !s.occupied).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚗 주차장 실시간 현황</Text>

      <FlatList
        data={spaces}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2} // 2칸씩 두 줄로
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
      />
      <View>
        <Text style={styles.status}>✅ 남은 자리: {availableCount}개</Text>
      </View>
      <View style={styles.balanceIndicator}>
        <Icon name="coins" size={20} color={color} />
        <Text style={[styles.balanceText, {color}]}>
          {message} (₩{balance.toLocaleString()})
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.buttonOpen}>
          <Text style={styles.buttonText}>입차</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonClose}>
          <Text style={styles.buttonText}>출차</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f9f9f9',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  row: {
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  space: {
    width: 100,
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    margin: 2,
  },
  spaceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  status: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonOpen: {
    backgroundColor: '#5CBD54',
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
  },

  buttonClose: {
    backgroundColor: '#FF6262',
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
  },

  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ddd',
    paddingVertical: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },

  balanceIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 0,
  },
  balanceText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 40,
    marginTop: 70,
    gap: 16, // React Native 최신 버전이면 gap 가능 (아니면 margin 써도 됨)
  },
});
