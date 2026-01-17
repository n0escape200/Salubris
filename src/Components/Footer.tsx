import { Pressable, Text, View } from 'react-native';
import { styles } from '../Utils/Styles';
import { footerItems } from '../Utils/Constants';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useEffect, useState, useContext } from 'react';

// Import your page components
import Home from '../Pages/Home';
import Products from '../Pages/Products';
import Tracking from '../Pages/Tracking';
import User from '../Pages/User';
import { PagerContext } from '../Utils/Contexts/PageContext';

// Page mapping
const pageComponents = [Home, Products, Tracking, User];

export default function Footer() {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerContext = useContext(PagerContext);

  // Update page when context changes
  useEffect(() => {
    if (pagerContext?.currentPage !== undefined) {
      setCurrentPage(pagerContext.currentPage);
    }
  }, [pagerContext?.currentPage]);

  const handlePagePress = (index: number) => {
    // Update local state
    setCurrentPage(index);

    // Update pager context if available
    if (pagerContext?.setCurrentPage) {
      pagerContext.setCurrentPage(index);
    }
  };

  return (
    <View style={styles.footer}>
      {footerItems.map((item, index) => (
        <Pressable
          style={{
            backgroundColor: currentPage === index ? '#c9c9c9' : 'transparent',
            padding: 6,
            borderRadius: 5,
            width: 62,
          }}
          key={item.label}
          onPress={() => handlePagePress(index)}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesomeIcon
              color={currentPage === index ? '#1c1c1c' : 'white'}
              icon={item.icon}
              size={20}
            />
            <Text
              style={{
                color: currentPage === index ? '#1c1c1c' : 'white',
                fontSize: 10,
              }}
            >
              {item.label}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
