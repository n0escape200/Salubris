import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  page: {
    backgroundColor: 'black',
    flex: 1,
    gap: 20,
    padding: 10,
  },
  container: {
    backgroundColor: '#1c1c1c',
    padding: 20,
    borderRadius: 10,
  },
  footer: {
    backgroundColor: '#1c1c1c',
    position: 'absolute',
    bottom: 0,
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
  wrapper: {
    position: 'relative',
    zIndex: 50,
  },

  input: {
    borderBottomColor: '#ffffff80',
    borderBottomWidth: 0.5,
    color: 'white',
    paddingVertical: 8,
    fontSize: 15, // matches textl
  },

  dropdown: {
    position: 'absolute',
    top: 38,
    left: 0,
    right: 0,
    backgroundColor: '#1c1c1c', // same as container
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#222222',
    elevation: 6, // Android
    zIndex: 100,
  },

  option: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2a2a2a',
  },

  optionText: {
    color: 'white',
    fontSize: 15, // textl
  },
});
