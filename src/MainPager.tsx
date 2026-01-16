import PagerView from 'react-native-pager-view';
import { useRef } from 'react';
import { View } from 'react-native';
import Home from './Pages/Home';
import Products from './Pages/Products';
import Tracking from './Pages/Tracking';
import User from './Pages/User';

export default function MainPager() {
  const pagerRef = useRef<PagerView>(null);

  return (
    <PagerView ref={pagerRef} style={{ flex: 1 }} initialPage={0}>
      <View key="1" style={{ flex: 1 }}>
        <Home />
      </View>
      <View key="2" style={{ flex: 1 }}>
        <Products />
      </View>
      <View key="3" style={{ flex: 1 }}>
        <Tracking />
      </View>
      <View key="4" style={{ flex: 1 }}>
        <User />
      </View>
    </PagerView>
  );
}
