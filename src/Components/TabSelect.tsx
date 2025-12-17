import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Pressable, View } from 'react-native';

type TabSelectType{
    children: React.PropsWithChildren
}

export default function TabSelect({children}: TabSelectType) {
  return (
    <View style={{ alignSelf: 'flex-start' }}>
      <Pressable>
        <View
          style={{ backgroundColor: 'white', padding: 10, borderRadius: 15 }}
        >
          <FontAwesomeIcon icon={faBars} />
        </View>
      </Pressable>
    </View>
  );
}
