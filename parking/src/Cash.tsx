import React, { JSX, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import {
  useNavigation,
  ParamListBase,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';

const API_URL = 'http://220.69.240.196:3000'; // .env 대신 하드코딩 (환경변수 설정시 변경)

type PaymentRouteParams = {
  currentBalance: number;
  member_id: string; // member_id 추가
};

function Cash(): JSX.Element {
  console.log('-- Cash()');

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const route =
    useRoute<RouteProp<Record<string, PaymentRouteParams>, string>>();

  // 현재 잔액과 member_id 받아오기
  const currentBalance = route.params?.currentBalance || 20000;
  const member_id = route.params?.member_id || '';

  const [amount, setAmount] = useState<string>('');
  const [name, setName] = useState<string>('');

  const amountOptions = [10000, 30000, 50000, 100000];

  const handleAmountSelect = (option: number) => {
    setAmount(option.toString());
  };

  const handlePayment = async () => {
    if (!amount || !name) {
      Alert.alert('알림', '모든 정보를 입력해주세요.');
      return;
    }
    if (!member_id) {
      Alert.alert('알림', '로그인 정보가 없습니다.');
      return;
    }

    Alert.alert(
      '결제 확인',
      `${parseInt(amount).toLocaleString()}원을 결제하시겠습니까?`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/cash`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  member_id,
                  amount: parseInt(amount),
                }),
              });

              if (!response.ok) {
                const errorText = await response.text();
                console.log('Server response error:', errorText);
                Alert.alert('결제 실패', `서버 오류가 발생했습니다.\n${errorText}`);
                return;
              }

              const data = await response.json();
              console.log('Charge response:', data);

              Alert.alert(
                '결제 완료',
                `${parseInt(amount).toLocaleString()}원이 성공적으로 충전되었습니다.`,
              );

              // 서버에서 새 잔액을 받는다고 가정하는 경우:
              // const newBalance = data.newBalance || currentBalance + parseInt(amount);
              // 현재는 서버가 newBalance를 안 보내므로 계산해서 넘김
              const newBalance = currentBalance + parseInt(amount);

              navigation.navigate('Main', { newBalance });
            } catch (error) {
              console.log('Network error:', error);
              Alert.alert('결제 실패', '네트워크 오류가 발생했습니다.');
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>현재 보유 캐시</Text>
          <Text style={styles.balanceAmount}>
            {currentBalance.toLocaleString()} 원
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>충전 금액</Text>
          <View style={styles.amountOptions}>
            {amountOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.amountOption,
                  amount === option.toString() && styles.selectedAmountOption,
                ]}
                onPress={() => handleAmountSelect(option)}>
                <Text
                  style={[
                    styles.amountOptionText,
                    amount === option.toString() && styles.selectedAmountText,
                  ]}>
                  {option.toLocaleString()}원
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.customAmountContainer}>
            <Text style={styles.customAmountLabel}>직접 입력</Text>
            <TextInput
              style={styles.customAmountInput}
              placeholder="금액 입력"
              value={amount}
              onChangeText={text => setAmount(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
            />
            <Text style={styles.wonText}>원</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>결제자 정보</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>이름</Text>
            <TextInput
              style={styles.input}
              placeholder="이름을 입력하세요"
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            결제 진행 시, 서비스 이용약관 및 개인정보 처리방침에 동의하는 것으로
            간주됩니다.
          </Text>
        </View>

        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>
            {amount
              ? `${parseInt(amount).toLocaleString()}원 결제하기`
              : '결제하기'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    padding: 20,
  },
  balanceContainer: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  amountOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amountOption: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedAmountOption: {
    borderColor: '#3498db',
    backgroundColor: 'rgba(52, 152, 219, 0.05)',
  },
  amountOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedAmountText: {
    color: '#3498db',
    fontWeight: '600',
  },
  customAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  customAmountLabel: {
    fontSize: 16,
    color: '#333',
    width: 80,
  },
  customAmountInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  wonText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  payButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Cash;
