// Login.tsx

import { JSX, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useNavigation, ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TextInput } from 'react-native-gesture-handler';

function Login(): JSX.Element {
  console.log('-- Login()');

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [disable, setDisable] = useState(true); //비활성화

  const onIdChange = (newId: string) => {
    newId && userPw ? setDisable(false) : setDisable(true);
    setUserId(newId);
  };

  const onPwChange = (newPw: string) => {
    newPw && userId ? setDisable(false) : setDisable(true);
    setUserPw(newPw);
  };

  const gotoRegister = () => {
    // 회원가입 화면으로 이동
    navigation.push('Register');
  };

  const handleLogin = async () => {
    if (disable) return;

    try {
      const response = await fetch('http://220.69.240.196:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_id: userId,
          password: userPw,
        }),
      });

      if (!response.ok) {
        Alert.alert('로그인 실패', '아이디 또는 비밀번호를 확인하세요.');
        return;
      }

      const data = await response.json();

      // 예: data = { member_id: 'someId', balance: 10000 }
      navigation.navigate('Cash', {
        member_id: data.member_id || userId,
        currentBalance: data.balance || 0,
      });
    } catch (error) {
      Alert.alert('네트워크 오류', '서버에 연결할 수 없습니다.');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Icon name="car" size={80} color={'#3498db'} />
      </View>

      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder={'아이디'}
          onChangeText={onIdChange}
          value={userId}
        />

        <TextInput
          style={styles.input}
          placeholder={'패스워드'}
          secureTextEntry={true}
          onChangeText={onPwChange}
          value={userPw}
        />
      </View>

      <View style={styles.container}>
        <TouchableOpacity
          style={disable ? styles.buttonDisable : styles.button}
          disabled={disable}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { marginTop: 5 }]}
          onPress={gotoRegister}
        >
          <Text style={styles.buttonText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  button: {
    width: '70%',
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },

  input: {
    width: '70%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginVertical: 10,
    padding: 10,
  },

  buttonDisable: {
    width: '70%',
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default Login;
