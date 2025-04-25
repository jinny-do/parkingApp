// Cash.tsx

import React, {JSX, useState} from 'react';
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
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';

// 라우트 파라미터 타입 정의
type PaymentRouteParams = {
  currentBalance: number;
};

function Cash(): JSX.Element {
  console.log('-- Cash()');

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const route =
    useRoute<RouteProp<Record<string, PaymentRouteParams>, string>>();

  // 현재 잔액 가져오기
  const currentBalance = route.params?.currentBalance || 20000;

  const [amount, setAmount] = useState<string>('');
  const [name, setName] = useState<string>('');

  // 결제 금액 옵션
  const amountOptions = [10000, 30000, 50000, 100000];

  // 금액 옵션 선택 처리
  const handleAmountSelect = (option: number) => {
    setAmount(option.toString());
  };

  // 결제 처리 함수
  const handlePayment = () => {
    if (!amount || !name) {
      Alert.alert('알림', '모든 정보를 입력해주세요.');
      return;
    }

    // 결제 확인
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
          onPress: () => {
            // 결제 성공 처리
            const newBalance = currentBalance + parseInt(amount);

            Alert.alert(
              '결제 완료',
              `${parseInt(
                amount,
              ).toLocaleString()}원이 성공적으로 충전되었습니다.`,
            );

            // 메인 화면으로 돌아가기 (새로운 잔액 전달)
            navigation.navigate('Main', {newBalance});
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
