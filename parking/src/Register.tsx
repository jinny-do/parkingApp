import {JSX, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {API_URL} from '@env';

function Register(): JSX.Element {
  const [user, setUser] = useState({
    name: '',
    email: '',
    passwd: '',
    carNum: '',
  });
  const [pwChk, setPwChk] = useState('');
  const [duplexChecked, setDuplexChecked] = useState(false); // 이메일 중복 확인

  const {name, email, passwd, carNum} = user;

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  //유효성 체크
  const isDisable = () => {
    return !(name && email && carNum && passwd && pwChk && passwd === pwChk);
  };

  const emailCheck = () => {
    isDuplicatedEmail();
  };
  //이메일 중복 확인
  const isDuplicatedEmail = async () => {
    try {
      const response = await axios.post(`${API_URL}/parking/register/duplex`, {
        email,
      });
      const data = response.data;

      if (data.result === 'ok') {
        //중복 되지 않음
        Alert.alert('사용 가능한 이메일입니다!', data.message);
        setDuplexChecked(true);
      } else {
        //이메일이 중복 될 경우
        Alert.alert('이미 사용중인 이메일입니다', data.message);
        setUser({...user, email: ''}); //이메일 칸 비워줌
        setDuplexChecked(false);
      }
    } catch (error) {
      Alert.alert('오류', '이메일 중복 체크 중 오류 발생');
      console.error('중복 체크 에러:', error);
    }
  };

  //onReset
  const resetForm = () => {
    setUser({
      name: '',
      email: '',
      passwd: '',
      carNum: '',
    });
    setPwChk('');
  };

  //회원가입
  const signUp = async () => {
    const {name, email, passwd, carNum} = user;

    if (!name || !email || !passwd || !pwChk || !carNum) {
      Alert.alert('입력 오류', '모든 항목을 입력해주세요.');
      return;
    }
    if (!duplexChecked) {
      Alert.alert('중복 확인 필요', '이메일 중복 확인을 먼저 해주세요!');
      return;
    }

    if (passwd !== pwChk) {
      Alert.alert('비밀번호 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/parking/register`, {
        name,
        email,
        passwd,
        car_num: carNum,
      });

      const {code, message} = response.data[0]; // ← 배열에서 꺼냄

      if (code === 0) {
        Alert.alert('회원가입 성공! 로그인 하세요 ', message, [
          {text: '확인', onPress: () => navigation.navigate('Login')},
        ]);
      } else {
        Alert.alert('회원가입 실패! 다시 시도하세요 ', message);
        resetForm(); // 리셋
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      Alert.alert('서버 오류', '회원가입 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <SafeAreaView style={styles.container}>
          <View style={[styles.container, {justifyContent: 'flex-end'}]}>
            <Icon
              name="car"
              size={80}
              color={'#3498db'}
              style={{marginTop: 40}}
            />
          </View>

          <View style={[styles.container, {flex: 2}]}>
            <View style={styles.inputRow}>
              <Text style={styles.label}>이름 :</Text>
              <TextInput
                style={styles.input}
                onChangeText={text => setUser({...user, name: text})}
                autoFocus={true}
              />
              <View style={styles.checkButton2} />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>e-mail :</Text>
              <TextInput
                style={styles.input}
                onChangeText={text => {
                  setUser({...user, email: text});
                  setDuplexChecked(false); // ← 이메일 바꾸면 다시 확인해야 함
                }}
                keyboardType="email-address"
              />
              <TouchableOpacity style={styles.checkButton} onPress={emailCheck}>
                <Text style={styles.checkText}>중복확인</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>차량번호 :</Text>
              <TextInput
                style={styles.input}
                onChangeText={text => setUser({...user, carNum: text})}
              />
              <View style={styles.checkButton2} />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>비밀번호 :</Text>
              <TextInput
                style={styles.input}
                onChangeText={text => setUser({...user, passwd: text})}
                secureTextEntry={true}
              />
              <View style={styles.checkButton2} />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>비밀번호{'\n'}확인 :</Text>
              <TextInput
                style={styles.input}
                onChangeText={setPwChk}
                secureTextEntry={true}
                value={pwChk}
              />
              <View style={styles.checkButton2} />
            </View>

            {passwd && pwChk && passwd !== pwChk && (
              <Text
                style={{
                  color: 'red',
                  fontSize: 12,
                  marginLeft: 25,
                  marginTop: -5,
                }}>
                비밀번호가 일치하지 않아요
              </Text>
            )}
          </View>

          <View
            style={[
              styles.container,
              {justifyContent: 'flex-end', marginBottom: 20},
            ]}>
            <TouchableOpacity
              disabled={isDisable()}
              style={isDisable() ? styles.buttonDisable : styles.button}
              onPress={signUp}>
              <Text style={styles.buttonText}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  buttonDisable: {
    width: '70%',
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    paddingHorizontal: 25,
    width: '100%',
  },

  label: {
    width: 60,
    fontSize: 13,
  },

  input: {
    flex: 1,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 8,
    marginRight: 8,
  },

  checkButton: {
    width: 70,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#3498db',
  },

  checkButton2: {
    width: 70,
    height: 30,
  },

  checkText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Register;
