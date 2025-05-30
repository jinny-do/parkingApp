import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Alert} from 'react-native';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import {API_URL} from '@env';

// 임시 자리 데이터 (차가 있으면 occupied: true)
const initialSpaces = [
  {id: 1, occupied: false},
  {id: 2, occupied: true},
  {id: 3, occupied: false},
  {id: 4, occupied: true},
];

type ParkingRouteParams = {
  newBalance?: number;
};

type Space = {
  id: number;
  occupied: boolean;
};

export default function Parking() {
  const route = useRoute<RouteProp<Record<string, ParkingRouteParams>, string>>();
  const navigation = useNavigation();

  // 잔액 상태 (초기값은 전달받은 newBalance 혹은 1000)
  const [balance, setBalance] = useState<number>(route.params?.newBalance ?? 1000);
  const [spaces, setSpaces] = useState<Space[]>(initialSpaces);

  // 잔액 변화 감지 및 화면 업데이트용 useEffect (필요시)
  useEffect(() => {
    if (route.params?.newBalance !== undefined) {
      setBalance(route.params.newBalance);
    }
  }, [route.params?.newBalance]);

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

  const renderItem = ({item}: {item: Space}) => (
    <View
      style={[
        styles.space,
        {backgroundColor: item.occupied ? '#F06C6C' : '#81C78F'},
      ]}>
      <Text style={styles.spaceText}>{item.id}</Text>
    </View>
  );

  const availableCount = spaces.filter(s => !s.occupied).length;

  const handleEntry = async () => {
    if (availableCount === 0) {
      Alert.alert('입차 불가', '남은 자리가 없습니다.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/parking/entry`, {
        car_num: '12가3456', // 추후 로그인 정보로 대체
        time: new Date().toISOString(),
      });

      Alert.alert('입차 성공', response.data.message);

      // 서버가 입차 처리 성공 시 남은 자리 상태 업데이트 (예: 첫 빈자리 occupied true로 변경)
      const firstEmptyIndex = spaces.findIndex(s => !s.occupied);
      if (firstEmptyIndex >= 0) {
        const updatedSpaces = [...spaces];
        updatedSpaces[firstEmptyIndex].occupied = true;
        setSpaces(updatedSpaces);
      }

      // 잔액 변경이 있을 경우, 예시로 잔액 갱신 (서버에서 받은 경우 반영)
      if (response.data.newBalance !== undefined) {
        setBalance(response.data.newBalance);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('입차 실패', '서버 오류가 발생했습니다.');
    }
  };

  const handleExit = async () => {
    try {
      const response = await axios.post(`${API_URL}/parking/exit`, {
        car_num: '12가3456', // 추후 로그인 정보로 대체
        time: new Date().toISOString(),
      });

      Alert.alert('출차 성공', `요금: ${response.data.fee}원`);

      // 서버가 출차 처리 성공 시 공간 상태 업데이트 (예: 출차된 자리 occupied false로 변경)
      // 여기서는 임시로 첫 occupied true인 자리 비우기 처리
      const firstOccupiedIndex = spaces.findIndex(s => s.occupied);
      if (firstOccupiedIndex >= 0) {
        const updatedSpaces = [...spaces];
        updatedSpaces[firstOccupiedIndex].occupied = false;
        setSpaces(updatedSpaces);
      }

      // 잔액 갱신 (서버에서 받은 경우 반영)
      if (response.data.newBalance !== undefined) {
        setBalance(response.data.newBalance);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('출차 실패', '서버 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚗 주차장 실시간 현황</Text>

      <FlatList
        data={spaces}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
      />

      <Text style={styles.status}>✅ 남은 자리: {availableCount}개</Text>

      <View style={styles.balanceIndicator}>
        <Icon name="coins" size={20} color={color} />
        <Text style={[styles.balanceText, {color}]}>
          {message} (₩{balance.toLocaleString()})
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.buttonOpen} onPress={handleEntry}>
          <Text style={styles.buttonText}>입차</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonClose} onPress={handleExit}>
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
    gap: 16,
  },
});
