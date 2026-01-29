import PagerView from 'react-native-pager-view';
import { useRef, useContext, useEffect } from 'react';
import { View } from 'react-native';
import Home from './Pages/Home';
import Products from './Pages/Products';
import Tracking from './Pages/Tracking';
import User from './Pages/User';
import { PagerContext } from './Utils/Contexts/PageContext';
import Meals from './Pages/Meals';

export default function MainPager() {
  const pagerRef = useRef<PagerView>(null);
  const pagerContext = useContext(PagerContext);

  // Update pager when context changes
  useEffect(() => {
    if (pagerRef.current && pagerContext?.currentPage !== undefined) {
      pagerRef.current.setPage(pagerContext.currentPage);
    }
  }, [pagerContext?.currentPage]);

  // Handle page changes from pager swipe
  const handlePageSelected = (e: any) => {
    const selectedPage = e.nativeEvent.position;
    if (pagerContext?.setCurrentPage) {
      pagerContext.setCurrentPage(selectedPage);
    }
  };

  return (
    <PagerView
      ref={pagerRef}
      style={{ flex: 1 }}
      initialPage={0}
      onPageSelected={handlePageSelected}
    >
      <View key="1" style={{ flex: 1 }}>
        <Home />
      </View>
      <View key="2" style={{ flex: 1 }}>
        <Tracking />
      </View>
      <View key="3" style={{ flex: 1 }}>
        <Products />
      </View>
      <View key="4" style={{ flex: 1 }}>
        <Meals />
      </View>
      <View key="5" style={{ flex: 1 }}>
        <User />
      </View>
    </PagerView>
  );
}
