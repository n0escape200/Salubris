import { View } from 'react-native';
import { styles } from '../Utils/Styles';
import MacroTracking from '../Components/MacroTracking';
import TabSelect from '../Components/TabSelect';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faFire,
  faGlassWater,
  faPersonWalking,
} from '@fortawesome/free-solid-svg-icons';
import WaterTrackingPage from '../Components/WaterTracking';
import StepTrackingPage from '../Components/StepTrackingPage';

export default function Tracking() {
  const [page, setPage] = useState(1);
  function displayComponent() {
    switch (page) {
      case 1:
        return <MacroTracking />;
      case 2:
        return <WaterTrackingPage />;
      case 3:
        return <StepTrackingPage />;
      default:
        return <MacroTracking />;
    }
  }
  return (
    <View style={styles.page}>
      <TabSelect
        options={[
          { icon: <FontAwesomeIcon icon={faFire} />, label: 'Macros' },
          { icon: <FontAwesomeIcon icon={faGlassWater} />, label: 'Water' },
          { icon: <FontAwesomeIcon icon={faPersonWalking} />, label: 'Steps' },
        ]}
        page={page}
        setPage={setPage}
      />
      {displayComponent()}
    </View>
  );
}
