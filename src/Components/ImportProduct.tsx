import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CustomModal from './CustomModal';
import Input from './Input';
import { useNotification } from '../Utils/Contexts/NotificationContext';
import axios from 'axios';
import { getApiUrl } from '../Utils/Constants';
import {
  Dimensions,
  Linking,
  ScrollView,
  Text,
  Pressable,
  View,
  ActivityIndicator,
} from 'react-native';
import { styles } from '../Utils/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faDatabase,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';

type ImportProductProps = {
  open: boolean;
  onClose: () => void;
  setExportData: Dispatch<SetStateAction<any>>;
};

export default function ImportProduct({
  open,
  onClose,
  setExportData,
}: ImportProductProps) {
  const { addNotification } = useNotification();
  const { height } = Dimensions.get('window');
  const [product, setProduct] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNoData, setIsNotData] = useState(false);
  const maxScrollHeight = height * 0.5;

  function getMacro(product: any, macro: string): number {
    const value = (product.foodNutrients as Array<any>).filter(value =>
      (value.nutrientName as string)
        .toLowerCase()
        .includes(macro.toLowerCase()),
    );
    if (value.length >= 1) {
      return value[0].value || 0;
    }
    return 0;
  }

  useEffect(() => {
    if (data.length > 0 && !isNoData) {
      setIsLoading(false);
    }
  }, [data]);

  async function handleProductSearch() {
    if (!product.trim()) {
      addNotification({
        type: 'ERROR',
        message: 'Please enter a product name',
      });
      return;
    }

    try {
      setIsLoading(true);
      setIsNotData(false);
      setData([]);

      const response = await axios.get(getApiUrl(product));

      if (response.data.foods?.length > 0) {
        setData(response.data.foods);
      } else {
        setIsNotData(true);
      }
    } catch (error) {
      addNotification({
        type: 'ERROR',
        message: 'Failed to fetch product data. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleExportData(productId: number) {
    const product = data.find((p: any) => p.fdcId === productId);
    if (!product) return;

    setExportData({
      name: product.description,
      calories: getMacro(product, 'Energy'),
      protein: getMacro(product, 'Protein'),
      carbs: getMacro(product, 'Carbohydrate'),
      fats: getMacro(product, 'Total lipid'),
    });

    resetState();
    onClose();
  }

  function resetState() {
    setData([]);
    setProduct('');
    setIsLoading(false);
    setIsNotData(false);
  }

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <CustomModal title="Import Product" open={open} onClose={handleClose}>
      {/* Data Source Info */}
      <View style={styles.dataSourceInfo}>
        <FontAwesomeIcon icon={faDatabase} size={16} color="#4FC3F7" />
        <Text style={styles.dataSourceText}>
          Data sourced from{' '}
          <Text
            style={styles.dataSourceLink}
            onPress={() => Linking.openURL('https://fdc.nal.usda.gov')}
          >
            U.S. Department of Agriculture
          </Text>
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <Input
          placeholder="Search products (e.g., 'apple', 'chicken breast')"
          value={product}
          onChange={setProduct}
          onSubmit={handleProductSearch}
          returnKeyType="search"
          blurOnSubmit={false}
        />

        <Pressable
          style={[
            styles.searchButton,
            (!product.trim() || isLoading) && styles.searchButtonDisabled,
          ]}
          onPress={handleProductSearch}
          disabled={!product.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.searchButtonText}>Search</Text>
          )}
        </Pressable>
      </View>

      {/* Results */}
      <View style={styles.resultsContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>Searching for products...</Text>
          </View>
        ) : isNoData ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No products found</Text>
            <Text style={styles.emptyStateText}>
              Try a different search term or check your spelling
            </Text>
          </View>
        ) : data.length > 0 ? (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                {data.length} product{data.length !== 1 ? 's' : ''} found
              </Text>
              <Pressable style={styles.clearButton} onPress={() => setData([])}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </Pressable>
            </View>

            <ScrollView
              style={{ maxHeight: maxScrollHeight }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.productsList}>
                {data.map((product: any, index) => {
                  const calories = getMacro(product, 'Energy');
                  const protein = getMacro(product, 'Protein');
                  const carbs = getMacro(product, 'Carbohydrate');
                  const fats = getMacro(product, 'Total lipid');

                  return (
                    <Pressable
                      key={product.fdcId}
                      style={styles.productCard}
                      onPress={() => handleExportData(product.fdcId)}
                    >
                      <View style={styles.productHeader}>
                        <Text style={styles.productName} numberOfLines={2}>
                          {product.description}
                        </Text>
                        <FontAwesomeIcon
                          icon={faExternalLinkAlt}
                          size={14}
                          color="#2196F3"
                        />
                      </View>

                      <View style={styles.productMacros}>
                        <View style={styles.macroItem}>
                          <Text style={styles.macroValue}>
                            {calories.toFixed(0)}
                          </Text>
                          <Text style={styles.macroLabel}>Calories</Text>
                        </View>

                        <View style={styles.macroDivider} />

                        <View style={styles.macroItem}>
                          <Text style={styles.macroValue}>
                            {protein.toFixed(1)}
                          </Text>
                          <Text style={styles.macroLabel}>Protein</Text>
                        </View>

                        <View style={styles.macroDivider} />

                        <View style={styles.macroItem}>
                          <Text style={styles.macroValue}>
                            {carbs.toFixed(1)}
                          </Text>
                          <Text style={styles.macroLabel}>Carbs</Text>
                        </View>

                        <View style={styles.macroDivider} />

                        <View style={styles.macroItem}>
                          <Text style={styles.macroValue}>
                            {fats.toFixed(1)}
                          </Text>
                          <Text style={styles.macroLabel}>Fats</Text>
                        </View>
                      </View>

                      <Text style={styles.productHint}>
                        Tap to import → per 100g
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </>
        ) : (
          <View style={styles.initialState}>
            <Text style={styles.initialStateTitle}>Search USDA Database</Text>
            <Text style={styles.initialStateText}>
              Enter a product name above to search the USDA FoodData Central
              database
            </Text>
          </View>
        )}
      </View>
    </CustomModal>
  );
}
