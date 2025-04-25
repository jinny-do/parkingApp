//Login.tsx

import {JSX, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, ParamListBase} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {TextInput} from 'react-native-gesture-handler';

function Login(): JSX.Element {
  console.log('-- Login()');

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  //useState : 어떠한 변수를 만들어 놓고 그 변수의 값이 변하면 화면을 다시 그릴 수 있도록 만들어 줌
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [disable, setDisable] = useState(true); //비활성화

  const onIdChange = (newId: string) => {
    newId && userPw ? setDisable(false) : setDisable(true);
    setUserId(newId);

    //newId(아이디 입력값)와 userPw(비밀번호 입력값)가 모두 존재하면 setDisable(false) 실행
    //사용자가 입력한 newId 값을 userId 상태로 업데이트합니다....  변경된 값이 userId 상태로 저장됨.
  };

  const onPwChange = (newPw: string) => {
    newPw && userId ? setDisable(false) : setDisable(true);
    setUserPw(newPw);
  };

  const gotoRegister = () => {
    //회원가입 화면으로 넘어가는 네비게이션
    navigation.push('Register');
  };

  const gotoMain = () => {
    //메인화면으로 넘어가는 네비게이션
    navigation.push('Main');
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
        />

        <TextInput
          style={styles.input}
          placeholder={'패스워드'}
          secureTextEntry={true}
          onChangeText={onPwChange}
        />
        {/* ecureTextEntry={true} : 암호화 (입력시 ***로 표시) */}
      </View>

      <View style={styles.container}>
        <TouchableOpacity
          style={disable ? styles.buttonDisable : styles.button}
          disabled={disable}
          onPress={gotoMain}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {marginTop: 5}]}
          onPress={gotoRegister}>
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
