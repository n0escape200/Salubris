import { useState, useContext, useEffect } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUtensils, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { TrackingContext } from '../../Utils/Contexts/TrackingContext';
import { useNotification } from '../../Utils/Contexts/NotificationContext';
import CustomModal from '../CustomModal';
import CustomButton from '../CustomButton';
import Meal from '../../DB/Models/Meal';
import { styles } from '../../Utils/Styles';

type MealModalProps = {
  open: boolean;
  onClose: () => void;
  date: Date;
};

export default function MealModal({ open, onClose, date }: MealModalProps) {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [productNamesMap, setProductNamesMap] = useState<Map<string, string>>(
    new Map(),
  );

  const trackContext = useContext(TrackingContext);
  const { addNotification } = useNotification();
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    if (trackContext?.products) {
      const map = new Map();
      trackContext.products.forEach(product => {
        map.set(product.id, product.name);
      });
      setProductNamesMap(map);
    }
  }, [trackContext?.products]);

  const calculateMealMacros = (meal: Meal) => {
    if (!meal.products?.length || !trackContext?.products) {
      return { calories: 0, protein: 0, carbs: 0, fats: 0 };
    }

    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fats = 0;

    const productMap = new Map();
    trackContext.products.forEach(p => productMap.set(p.id, p));

    meal.products.forEach(mealProduct => {
      const product = productMap.get(mealProduct.id);
      if (product) {
        const factor = mealProduct.quantity / 100;
        calories += product.calories * factor;
        protein += product.protein * factor;
        carbs += product.carbs * factor;
        fats += product.fats * factor;
      }
    });

    return { calories, protein, carbs, fats };
  };

  const handleMealSelect = (meal: Meal) => {
    setSelectedMeal(meal);
    setShowConfirmation(true);
  };

  const handleAddMeal = async () => {
    if (!selectedMeal || !trackContext?.addMealToTracking) {
      addNotification({ type: 'ERROR', message: 'No meal selected' });
      return;
    }

    try {
      await trackContext.addMealToTracking(selectedMeal, date);

      addNotification({
        type: 'SUCCESS',
        message: `Added "${selectedMeal.name}" to tracking`,
      });
    } catch (error) {
      addNotification({ type: 'ERROR', message: 'Failed to add meal' });
    }

    resetSelection();
    onClose();
  };

  const resetSelection = () => {
    setSelectedMeal(null);
    setShowConfirmation(false);
  };

  const handleClose = () => {
    resetSelection();
    onClose();
  };

  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Calculate total calories for a meal
  const getTotalCalories = (meal: Meal) => {
    const macros = calculateMealMacros(meal);
    return macros.calories;
  };

  return (
    <>
      {/* Main Modal - Meal Selection */}
      <CustomModal
        title="Select Meal"
        open={open}
        onClose={handleClose}
        customStyle={{ padding: 0 }}
      >
        <View>
          {trackContext?.meals?.length === 0 ? (
            <View style={styles.emptyMealsContainer}>
              <FontAwesomeIcon icon={faUtensils} size={64} color="#555" />
              <Text style={styles.emptyMealsTitle}>No Meals Created</Text>
              <Text style={styles.emptyMealsText}>
                Go to the Meals section to create your first meal
              </Text>
              <CustomButton
                label="Close"
                onPress={handleClose}
                customStyle={styles.closeEmptyButton}
              />
            </View>
          ) : (
            <>
              <View style={styles.mealModalHeader}>
                <Text style={styles.mealModalSubtitle}>
                  {trackContext?.meals.length} meals available
                </Text>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.mealsScrollContent}
                style={{ maxHeight: screenHeight * 0.68 }}
              >
                <View style={styles.mealsGrid}>
                  {trackContext?.meals.map(meal => {
                    const macros = calculateMealMacros(meal);
                    const totalCalories = getTotalCalories(meal);

                    return (
                      <Pressable
                        key={meal.id}
                        onPress={() => handleMealSelect(meal)}
                        style={styles.mealSelectionCard}
                      >
                        <View style={styles.mealCardHeader}>
                          <FontAwesomeIcon
                            icon={faUtensils}
                            size={20}
                            color="#FF9800"
                          />
                          <Text
                            style={styles.mealSelectionName}
                            numberOfLines={1}
                          >
                            {meal.name}
                          </Text>
                        </View>

                        <View style={styles.mealCardContent}>
                          <View style={styles.mealStatsRow}>
                            <View style={styles.mealStat}>
                              <Text style={styles.mealStatValue}>
                                {meal.products?.length || 0}
                              </Text>
                              <Text style={styles.mealStatLabel}>Items</Text>
                            </View>

                            <View style={styles.mealStat}>
                              <Text style={styles.mealStatValue}>
                                {totalCalories.toFixed(0)}
                              </Text>
                              <Text style={styles.mealStatLabel}>Calories</Text>
                            </View>
                          </View>

                          {/* Quick Macros Preview */}
                          <View style={styles.quickMacros}>
                            <View style={styles.quickMacro}>
                              <Text style={styles.quickMacroValue}>
                                {macros.protein.toFixed(1)}
                              </Text>
                              <Text style={styles.quickMacroLabel}>P</Text>
                            </View>
                            <View style={styles.quickMacro}>
                              <Text style={styles.quickMacroValue}>
                                {macros.carbs.toFixed(1)}
                              </Text>
                              <Text style={styles.quickMacroLabel}>C</Text>
                            </View>
                            <View style={styles.quickMacro}>
                              <Text style={styles.quickMacroValue}>
                                {macros.fats.toFixed(1)}
                              </Text>
                              <Text style={styles.quickMacroLabel}>F</Text>
                            </View>
                          </View>

                          {/* Product Preview */}
                          {meal.products && meal.products.length > 0 && (
                            <View style={styles.productsPreview}>
                              {meal.products.slice(0, 2).map((product, idx) => {
                                const productName =
                                  productNamesMap.get(product.id) ||
                                  `Product ${product.id}`;
                                return (
                                  <Text
                                    key={idx}
                                    style={styles.productPreviewText}
                                    numberOfLines={1}
                                  >
                                    • {productName}: {product.quantity}g
                                  </Text>
                                );
                              })}
                              {meal.products.length > 2 && (
                                <Text style={styles.moreProductsText}>
                                  +{meal.products.length - 2} more
                                </Text>
                              )}
                            </View>
                          )}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            </>
          )}
        </View>
      </CustomModal>

      {/* Confirmation Modal */}
      {selectedMeal && (
        <CustomModal
          title="Confirm Meal Addition"
          open={showConfirmation}
          onClose={resetSelection}
        >
          <View style={styles.confirmationContent}>
            <View style={styles.confirmationHeader}>
              <FontAwesomeIcon icon={faUtensils} size={32} color="#4CAF50" />
              <Text style={styles.confirmationMealName}>
                {selectedMeal.name}
              </Text>
            </View>

            <View style={styles.confirmationDetails}>
              <View style={styles.confirmationDetailRow}>
                <Text style={styles.confirmationDetailLabel}>Date:</Text>
                <Text style={styles.confirmationDetailValue}>
                  {formatDate(date)}
                </Text>
              </View>

              <View style={styles.confirmationDetailRow}>
                <Text style={styles.confirmationDetailLabel}>Items:</Text>
                <Text style={styles.confirmationDetailValue}>
                  {selectedMeal.products?.length || 0} products
                </Text>
              </View>

              <View style={styles.confirmationDetailRow}>
                <Text style={styles.confirmationDetailLabel}>
                  Total Calories:
                </Text>
                <Text style={styles.confirmationDetailValue}>
                  {getTotalCalories(selectedMeal).toFixed(0)} kcal
                </Text>
              </View>
            </View>

            {/* Products List */}
            {selectedMeal.products && selectedMeal.products.length > 0 && (
              <View style={styles.confirmationProducts}>
                <Text style={styles.confirmationProductsTitle}>
                  Products in this meal:
                </Text>
                <ScrollView
                  style={styles.confirmationProductsList}
                  showsVerticalScrollIndicator={false}
                >
                  {selectedMeal.products.map((product, idx) => {
                    const productName =
                      productNamesMap.get(product.id) ||
                      `Product ${product.id}`;
                    return (
                      <View key={idx} style={styles.confirmationProductItem}>
                        <Text style={styles.confirmationProductName}>
                          {productName}
                        </Text>
                        <Text style={styles.confirmationProductQuantity}>
                          {product.quantity}g
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            <View style={styles.confirmationActions}>
              <CustomButton
                label="Add to Tracking"
                onPress={handleAddMeal}
                customStyle={styles.confirmAddButton}
              />
              <CustomButton
                label="Cancel"
                onPress={resetSelection}
                customStyle={styles.confirmCancelButton}
              />
            </View>
          </View>
        </CustomModal>
      )}
    </>
  );
}
