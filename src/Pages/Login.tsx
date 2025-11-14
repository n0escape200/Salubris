import { Pressable, Text, View } from 'react-native';
import Input from '../Components/Input';
import CustomButton from '../Components/CustomButton';
import Divider from '../Components/Divider';
import { styles } from '../Utils/Styles';

export function Login() {
  return (
    <View style={styles.page}>
      <View style={{ margin: 'auto', width: '100%' }}>
        <Input label="test" />
        <Input label="test" />
        <Pressable>
          <Text
            style={{
              color: 'white',
              marginLeft: 'auto',
              marginTop: 10,
              fontWeight: 600,
            }}
          >
            Forgot password?
          </Text>
        </Pressable>
        <CustomButton label="Login" color="orange" fontColor="white" />
        <Divider />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <CustomButton width={180} label="Google" />
          <CustomButton width={180} label="Google" />
        </View>
      </View>
    </View>
  );
}
