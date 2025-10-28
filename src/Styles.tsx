import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  page: {
    backgroundColor: 'black',
    flex: 1,
    gap: 20,
  },
  container: {
    backgroundColor: '#1c1c1c',
    padding: 20,
    borderRadius: 10,
  },
  footer: {
    backgroundColor: '#1c1c1c',
    position: 'absolute',
    bottom: 34,
    left: 0,
    right: 0,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 50,
    borderColor: '#222222',
    borderWidth: 1,
    alignItems: 'center',
  },
  textxl: {
    color: 'white',
    fontSize: 21,
  },
  textl: {
    color: 'white',
    fontSize: 15,
  },
});
