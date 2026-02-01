import { View } from 'react-native';
import { styles } from '../../Utils/Styles';
import { useContext, useState, useEffect } from 'react';
import { TrackingContext } from '../../Utils/Contexts/TrackingContext';
import DatePicker from 'react-native-date-picker';
import HeaderSection from './HeaderSection';
import ControlsSection from './ControlsSection';
import TrackLinesList from './TrackLinesList';
import ProductModal from './ProductModal';
import MealModal from './MealModal';

export default function MacroTracking() {
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openMealModal, setOpenMealModal] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const trackContext = useContext(TrackingContext);

  // Handle date change
  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    trackContext?.getTrackLinesForDate(newDate);
  };

  // Reset to today
  const handleReset = () => {
    const today = new Date();
    setDate(today);
    trackContext?.getTrackLinesForDate(today);
  };

  return (
    <View style={[styles.page, { padding: 0 }]}>
      {/* Header with macros */}
      <HeaderSection macros={trackContext?.macros} />

      {/* Controls section */}
      <ControlsSection
        onOpenProductModal={() => setOpenProductModal(true)}
        onOpenMealModal={() => setOpenMealModal(true)}
        onOpenDatePicker={() => setOpenDatePicker(!openDatePicker)}
        date={date}
        onReset={handleReset}
      />

      {/* Track lines list */}
      <TrackLinesList
        trackLines={trackContext?.trackLines || []}
        onEditTrackLine={line => {
          // You'll need to pass editing functionality to ProductModal
          setOpenProductModal(true);
        }}
      />

      {/* Product Modal */}
      <ProductModal
        open={openProductModal}
        onClose={() => setOpenProductModal(false)}
        date={date}
      />

      {/* Meal Modal */}
      <MealModal
        open={openMealModal}
        onClose={() => setOpenMealModal(false)}
        date={date}
      />

      {/* Date Picker */}
      <DatePicker
        theme="dark"
        modal
        mode="date"
        locale="en-GB"
        open={openDatePicker}
        date={date}
        onConfirm={handleDateChange}
        onCancel={() => setOpenDatePicker(false)}
      />
    </View>
  );
}
