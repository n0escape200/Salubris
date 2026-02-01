import {
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faBarcode,
  faFileImport,
  faPlus,
  faX,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import Input from '../Components/Input';
import ItemList from '../Components/ItemList';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { TrackingContext } from '../Utils/Contexts/TrackingContext';
import ImportProduct from '../Components/ImportProduct';
import CustomModal from '../Components/CustomModal';
import Form from '../Components/Form';
import Product, { ProductType } from '../DB/Models/Product';
import { database } from '../DB/Database';
import { useNotification } from '../Utils/Contexts/NotificationContext';
import {
  Camera,
  Point,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import axios from 'axios';
import { getLatestMacros } from '../Utils/Functions';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { styles } from '../Utils/Styles';

export default function Products() {
  const camera = useRef<Camera>(null);
  const focusingRef = useRef(false);
  const { addNotification } = useNotification();
  const { hasPermission, requestPermission } = useCameraPermission();
  const trackingContext = useContext(TrackingContext);

  const [openImport, setOpenImport] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Array<Product>>([]);
  const [isScannig, setIsScanning] = useState(false);
  const [patchProduct, setPatchProduct] = useState<ProductType | null>(null);
  const [exportData, setExportData] = useState({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  const [productForm, setProductForm] = useState<ProductType>({
    id: undefined,
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  const device = useCameraDevice('back');
  const window = Dimensions.get('window');

  /* -------------------- Effects -------------------- */

  useEffect(() => {
    if (exportData.name && !openAdd) {
      setOpenAdd(true);
      setProductForm({ id: undefined, ...exportData });
    }
  }, [exportData]);

  useEffect(() => {
    if (trackingContext?.products) {
      setProducts(trackingContext.products);
    }
  }, [trackingContext]);

  useEffect(() => {
    if (patchProduct?.id !== undefined) {
      setProductForm({
        id: patchProduct.id,
        name: patchProduct.name,
        calories: patchProduct.calories,
        protein: patchProduct.protein,
        carbs: patchProduct.carbs,
        fats: patchProduct.fats,
      });
    }
  }, [patchProduct]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setProducts(trackingContext?.products || []);
    } else {
      const results = trackingContext?.products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setProducts(results || []);
    }
  }, [searchQuery, trackingContext?.products]);

  /* -------------------- Database -------------------- */

  async function addOrUpdateProduct() {
    try {
      await database.write(async () => {
        if (patchProduct?.id) {
          const product = await database
            .get<Product>('products')
            .find(patchProduct.id);

          await product.update(p => {
            p.name = productForm.name;
            p.calories = productForm.calories;
            p.protein = productForm.protein;
            p.carbs = productForm.carbs;
            p.fats = productForm.fats;
          });

          addNotification({
            type: 'SUCCESS',
            message: `${productForm.name} updated successfully`,
          });
        } else {
          await database.get<Product>('products').create(p => {
            p.name = productForm.name;
            p.calories = productForm.calories;
            p.protein = productForm.protein;
            p.carbs = productForm.carbs;
            p.fats = productForm.fats;
          });

          addNotification({
            type: 'SUCCESS',
            message: `${productForm.name} created successfully`,
          });
        }
      });

      trackingContext?.setUpdateLines(true);
      resetData();
    } catch (error) {
      addNotification({ type: 'ERROR', message: String(error) });
    }
  }

  /* -------------------- Camera -------------------- */

  async function handleOpenCamera() {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        addNotification({ type: 'ERROR', message: 'Camera permission denied' });
        return;
      }
    }

    if (!device) {
      addNotification({ type: 'ERROR', message: 'No camera detected' });
      return;
    }
    setOpenCamera(true);
  }

  /* -------------------- Barcode scanning -------------------- */

  let codesArray: string[] = [];

  const codeScanner = useCodeScanner({
    codeTypes: [
      'qr',
      'ean-8',
      'ean-13',
      'upc-e',
      'upc-a',
      'code-39',
      'code-93',
      'code-128',
      'pdf-417',
      'aztec',
      'itf',
      'codabar',
    ],
    onCodeScanned: async codes => {
      const value = codes[0]?.value;
      if (!value) return;

      codesArray.push(value);
      if (codesArray.length !== 10) return;

      const freq: Record<string, number> = {};
      let maxValue = '';
      let maxCount = 0;

      for (const c of codesArray) {
        freq[c] = (freq[c] || 0) + 1;
        if (freq[c] > maxCount) {
          maxCount = freq[c];
          maxValue = c;
        }
      }

      try {
        const res = await axios.get(
          `https://world.openfoodfacts.org/api/v2/product/${maxValue}`,
        );

        const data = getLatestMacros(res.data.product);
        if (!data) throw new Error('Invalid product data');

        setProductForm({
          id: undefined,
          name: data.name,
          calories: data.kj ? Math.floor(data.kj * 0.23900574) : 0,
          protein: data.proteins || 0,
          carbs: data.carbs || 0,
          fats: data.fat || 0,
        });

        setOpenAdd(true);
        setIsScanning(true);
      } catch {
        addNotification({
          type: 'ERROR',
          message: 'Product was not found',
        });
      } finally {
        codesArray = [];
        setOpenCamera(false);
      }
    },
  });

  /* -------------------- Tap to focus -------------------- */

  const focus = useCallback(
    async (point: Point) => {
      const cam = camera.current;
      if (!cam || focusingRef.current) return;

      focusingRef.current = true;
      try {
        await cam.focus({
          x: point.x / window.width,
          y: point.y / window.height,
        });
      } catch (e: any) {
        if (!String(e).includes('focused-canceled')) {
          console.warn('Focus error:', e);
        }
      } finally {
        focusingRef.current = false;
      }
    },
    [window],
  );

  const tapGesture = Gesture.Tap()
    .hitSlop(20)
    .onEnd(({ x, y }) => {
      runOnJS(focus)({ x, y });
    });

  /* -------------------- Helper Functions -------------------- */

  const resetData = () => {
    setOpenAdd(false);
    setIsScanning(false);
    setSearchQuery('');
    setExportData({
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    });
    setProductForm({
      id: undefined,
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    });
    setPatchProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setPatchProduct(product);
    setOpenAdd(true);
  };

  return (
    <View style={productStyles.page}>
      {/* Header */}
      <View style={productStyles.sectionHeader}>
        <Text style={productStyles.sectionTitle}>Products</Text>
        <Text style={productStyles.sectionSubtitle}>
          {products.length} items available
        </Text>
      </View>

      {/* Search Bar */}
      <View style={productStyles.searchContainer}>
        <View style={productStyles.searchInputContainer}>
          <FontAwesomeIcon
            icon={faSearch}
            size={18}
            color="#888"
            style={productStyles.searchIcon}
          />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={setSearchQuery}
            style={productStyles.searchInput}
            backgroundColor="#2a2a2a"
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={productStyles.actionButtonsContainer}>
        <Pressable
          onPress={() => setOpenAdd(true)}
          style={[productStyles.actionButton, productStyles.addButton]}
        >
          <FontAwesomeIcon icon={faPlus} size={20} color="#fff" />
          <Text style={productStyles.buttonText}>Add New</Text>
        </Pressable>

        <Pressable
          onPress={() => setOpenImport(true)}
          style={[productStyles.actionButton, productStyles.importButton]}
        >
          <FontAwesomeIcon icon={faFileImport} size={20} color="#fff" />
          <Text style={productStyles.buttonText}>Import</Text>
        </Pressable>

        <Pressable
          onPress={handleOpenCamera}
          style={[productStyles.actionButton, productStyles.scanButton]}
        >
          <FontAwesomeIcon icon={faBarcode} size={20} color="#fff" />
          <Text style={productStyles.buttonText}>Scan</Text>
        </Pressable>
      </View>

      {/* Product List */}
      <ScrollView
        style={productStyles.productsListContainer}
        showsVerticalScrollIndicator={false}
      >
        {products.length === 0 ? (
          <View style={productStyles.emptyState}>
            <Text style={productStyles.emptyStateTitle}>
              {searchQuery ? 'No products found' : 'No products yet'}
            </Text>
            <Text style={productStyles.emptyStateText}>
              {searchQuery
                ? 'Try a different search term'
                : 'Add your first product using the buttons above'}
            </Text>
          </View>
        ) : (
          <View style={productStyles.productsGrid}>
            {products.map(product => (
              <Pressable
                key={product.id}
                onPress={() => handleEditProduct(product)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <ItemList product={product} />
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Import Modal */}
      <ImportProduct
        open={openImport}
        onClose={() => setOpenImport(false)}
        setExportData={setExportData}
      />

      {/* Add/Edit Product Modal */}
      <CustomModal
        title={patchProduct?.id ? 'Edit Product' : 'Add New Product'}
        open={openAdd}
        onClose={resetData}
      >
        <Form onSubmit={addOrUpdateProduct} onCancel={resetData}>
          <View style={productStyles.formContainer}>
            <Input
              label="Product Name"
              value={productForm.name}
              onChange={value =>
                setProductForm(prev => ({ ...prev, name: value }))
              }
              validate
              placeholder="Enter product name"
              backgroundColor="black"
            />

            <View style={productStyles.macrosGrid}>
              <Input
                label="Calories"
                value={`${productForm.calories}`}
                onChange={value =>
                  setProductForm(prev => ({ ...prev, calories: +value }))
                }
                type="number"
                validate
                style={productStyles.macroInput}
                placeholder="kcal"
                backgroundColor="black"
              />
              <Input
                label="Protein"
                value={`${productForm.protein}`}
                onChange={value =>
                  setProductForm(prev => ({ ...prev, protein: +value }))
                }
                type="number"
                validate
                style={productStyles.macroInput}
                placeholder="g"
                backgroundColor="black"
              />
              <Input
                label="Carbs"
                value={`${productForm.carbs}`}
                onChange={value =>
                  setProductForm(prev => ({ ...prev, carbs: +value }))
                }
                type="number"
                validate
                style={productStyles.macroInput}
                placeholder="g"
                backgroundColor="black"
              />
              <Input
                label="Fats"
                value={`${productForm.fats}`}
                onChange={value =>
                  setProductForm(prev => ({ ...prev, fats: +value }))
                }
                type="number"
                validate
                style={productStyles.macroInput}
                placeholder="g"
                backgroundColor="black"
              />
            </View>

            <Text style={productStyles.macroNote}>
              All values are per 100g/100ml of product
            </Text>
          </View>
        </Form>

        {isScannig && (
          <View style={productStyles.scanWarning}>
            <Text style={productStyles.warningTitle}>
              ⚠️ Data Accuracy Notice
            </Text>
            <Text style={productStyles.warningText}>
              Product data retrieved by scanning may not always be 100%
              accurate. Please verify the information before saving.
            </Text>
            <View style={productStyles.dataSource}>
              <Text style={productStyles.dataSourceText}>
                Data imported from{' '}
              </Text>
              <Text
                style={productStyles.dataSourceLink}
                onPress={() =>
                  Linking.openURL('https://world.openfoodfacts.org')
                }
              >
                Open Food Facts
              </Text>
            </View>
          </View>
        )}
      </CustomModal>

      {/* Camera Overlay */}
      {device && openCamera && (
        <View style={StyleSheet.absoluteFill}>
          <GestureDetector gesture={tapGesture}>
            <Camera
              ref={camera}
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={openCamera}
              codeScanner={codeScanner}
            />
          </GestureDetector>

          {/* Scanner Frame */}
          <View style={productStyles.scannerFrame}>
            <View style={productStyles.scannerCornerTL} />
            <View style={productStyles.scannerCornerTR} />
            <View style={productStyles.scannerCornerBL} />
            <View style={productStyles.scannerCornerBR} />
          </View>

          {/* Instructions */}
          <View style={productStyles.scannerInstructions}>
            <Text style={productStyles.scannerInstructionText}>
              Align barcode within the frame
            </Text>
            <Text style={productStyles.scannerInstructionSubtext}>
              Tap to focus • Auto-scan in progress
            </Text>
          </View>

          {/* Close Button */}
          <Pressable
            onPress={() => setOpenCamera(false)}
            style={productStyles.closeCameraButton}
          >
            <FontAwesomeIcon icon={faX} size={24} color="white" />
          </Pressable>
        </View>
      )}
    </View>
  );
}

// Add these productStyles to your productStyles.ts file:
const productsStyles = StyleSheet.create({
  sectionHeader: {
    marginBottom: 16,
  },

  sectionTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },

  sectionSubtitle: {
    color: '#aaa',
    fontSize: 14,
  },

  searchContainer: {
    marginBottom: 16,
  },

  searchInputContainer: {
    position: 'relative',
  },

  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 14,
    zIndex: 1,
  },

  searchInput: {
    paddingLeft: 48,
    height: 48,
    borderRadius: 12,
    fontSize: 16,
  },

  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },

  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },

  addButton: {
    backgroundColor: '#2196F3',
  },

  importButton: {
    backgroundColor: '#9C27B0',
  },

  scanButton: {
    backgroundColor: '#FF9800',
  },

  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  productsListContainer: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
  },

  productsGrid: {
    padding: 16,
    gap: 12,
  },

  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyStateTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyStateText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  formContainer: {
    gap: 16,
  },

  macrosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  macroInput: {
    flex: 1,
    minWidth: '45%',
  },

  macroNote: {
    color: '#aaa',
    fontSize: 13,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },

  scanWarning: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },

  warningTitle: {
    color: '#FF9800',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },

  warningText: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },

  dataSource: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  dataSourceText: {
    color: '#aaa',
    fontSize: 13,
  },

  dataSourceLink: {
    color: '#4FC3F7',
    fontSize: 13,
    fontWeight: '500',
  },

  scannerFrame: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    height: 200,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scannerCornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#2196F3',
    borderTopLeftRadius: 12,
  },

  scannerCornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#2196F3',
    borderTopRightRadius: 12,
  },

  scannerCornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#2196F3',
    borderBottomLeftRadius: 12,
  },

  scannerCornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#2196F3',
    borderBottomRightRadius: 12,
  },

  scannerInstructions: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 12,
  },

  scannerInstructionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },

  scannerInstructionSubtext: {
    color: '#aaa',
    fontSize: 13,
    textAlign: 'center',
  },

  closeCameraButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Update your existing productStyles object
export const productStyles = {
  ...styles,
  ...productsStyles,
};
