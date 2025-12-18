import { View } from 'react-native';
import { styles } from '../Utils/Styles';
import MacroTracking from '../Components/MacroTracking';
import TabSelect from '../Components/TabSelect';
import { useState } from 'react';

export default function Tracking() {
  const [page, setPage] = useState(1);
  function displayComponent() {
    switch (page) {
      case 1:
        return <MacroTracking />;
      case 2:
        return <View></View>;
      case 3:
        return <View></View>;
      default:
        return <MacroTracking />;
    }
  }
  return (
    <View style={styles.page}>
      <TabSelect
        options={['Macros', 'Water', 'Steps']}
        page={page}
        setPage={setPage}
      />
      {displayComponent()}
    </View>
  );
}
