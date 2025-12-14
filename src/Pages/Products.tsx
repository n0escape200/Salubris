import {
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { styles } from '../Utils/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faBarcode,
  faFileImport,
  faPlus,
  faX,
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

export default function Products() {
  const camera = useRef<Camera>(null);
  const focusingRef = useRef(false);
  const autocompleteRef = useRef<any>(null);

  const { addNotification } = useNotification();
  const { hasPermission, requestPermission } = useCameraPermission();
  const trackingContext = useContext(TrackingContext);

  const [openImport, setOpenImport] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);

  const [productForm, setProductForm] = useState<ProductType>({
    id: undefined,
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  const [exportData, setExportData] = useState({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  const [products, setProducts] = useState<Array<Product>>([]);
  const [isScannig, setIsScanning] = useState(false);
  const device = useCameraDevice('back');
  const window = Dimensions.get('window');

  /* -------------------- Import autofill -------------------- */

  useEffect(() => {
    if (exportData.name && !openAdd) {
      setOpenAdd(true);
      setProductForm({ id: undefined, ...exportData });
    }
  }, [exportData]);

  useEffect(() => {
    if (trackingContext?.products) {
      setProducts(trackingContext?.products);
    }
  }, [trackingContext]);

  /* -------------------- Database -------------------- */

  async function addProduct() {
    try {
      await database.write(async () => {
        await database.get<Product>('products').create(p => {
          p.name = productForm.name;
          p.calories = productForm.calories;
          p.protein = productForm.protein;
          p.carbs = productForm.carbs;
          p.fats = productForm.fats;
        });
      });

      addNotification({
        type: 'SUCCESS',
        message: `${productForm.name} created successfully`,
      });

      trackingContext?.setUpdateLine(true);
      setOpenAdd(false);
    } catch (error) {
      addNotification({ type: 'ERROR', message: String(error) });
    }
  }

  /* -------------------- Camera -------------------- */

  async function handleOpenCamera() {
    if (!hasPermission) await requestPermission();
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

  /* -------------------- Render -------------------- */

  const resetData = () => {
    setOpenAdd(false);
    setIsScanning(false);
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
  };

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
        <Text style={styles.textxl}>Products:</Text>

        <Pressable
          onPress={() => setOpenAdd(true)}
          style={{ backgroundColor: '#3a3a3a', padding: 6, borderRadius: 50 }}
        >
          <FontAwesomeIcon icon={faPlus} color="white" />
        </Pressable>

        <Pressable
          onPress={() => setOpenImport(true)}
          style={{ backgroundColor: '#3a3a3a', padding: 8, borderRadius: 15 }}
        >
          <FontAwesomeIcon icon={faFileImport} color="white" />
        </Pressable>

        <Pressable
          onPress={handleOpenCamera}
          style={{ backgroundColor: '#3a3a3a', padding: 8, borderRadius: 15 }}
        >
          <FontAwesomeIcon icon={faBarcode} color="white" />
        </Pressable>
      </View>

      {/* Filters */}
      <View style={styles.container}>
        <Input
          label="Search"
          onChange={e => {
            if (e !== '') {
              const results = trackingContext?.products.filter(product =>
                product.name
                  .toLocaleLowerCase()
                  .includes(e.toLocaleLowerCase()),
              );
              setProducts(results || []);
            } else {
              setProducts(trackingContext?.products || []);
            }
          }}
        />
        {/* <Dropdown options={['test1', 'test2', 'test3', 'test4']} /> */}
      </View>

      {/* Product list */}
      <ScrollView style={[styles.container, { padding: 10 }]}>
        <View style={{ gap: 10 }}>
          {products.map((product, index) => (
            <ItemList key={index} product={product} />
          ))}
        </View>
      </ScrollView>

      {/* Import modal */}
      <ImportProduct
        open={openImport}
        onClose={() => setOpenImport(false)}
        setExportData={setExportData}
      />

      {/* Add product modal */}
      <CustomModal
        title="Add product"
        open={openAdd}
        childRef={autocompleteRef}
        onClose={resetData}
      >
        <Form onSubmit={addProduct} onCancel={resetData}>
          <Input
            label="Name"
            value={productForm.name}
            onChange={value => {
              setProductForm(prev => ({ ...prev, name: value }));
            }}
            validate
          />
          <Input
            label="Calories"
            value={`${productForm.calories}`}
            onChange={value => {
              setProductForm(prev => ({ ...prev, calories: +value }));
            }}
            type="number"
            validate
          />
          <Input
            label="Protein"
            value={`${productForm.protein}`}
            onChange={value => {
              setProductForm(prev => ({ ...prev, protein: +value }));
            }}
            type="number"
            validate
          />
          <Input
            label="Carbs"
            value={`${productForm.carbs}`}
            onChange={value => {
              setProductForm(prev => ({ ...prev, carbs: +value }));
            }}
            type="number"
            validate
          />
          <Input
            label="Fats"
            value={`${productForm.fats}`}
            onChange={value => {
              setProductForm(prev => ({ ...prev, fats: +value }));
            }}
            type="number"
            validate
          />
          <Text style={{ color: 'white', fontSize: 15 }}>
            The macros will be per 100g
          </Text>
        </Form>
        {isScannig && (
          <View
            style={{
              backgroundColor: '#3a3a3a',
              padding: 10,
              borderRadius: 10,
              marginTop: 20,
            }}
          >
            <Text style={{ color: 'yellow' }}>IMPORTANT</Text>
            <Text style={{ color: 'white' }}>
              The data retrieved by scanning a product is not allways 100%
              correct.
            </Text>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
              <Text style={{ color: 'white' }}>Data is imported from</Text>
              <Text
                style={{ color: '#2e7fe7ff' }}
                onPress={() => Linking.openURL('https://fdc.nal.usda.gov')}
              >
                Open Food facts
              </Text>
            </View>
          </View>
        )}
      </CustomModal>

      {/* Camera overlay */}
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

          {/* Close button */}
          <Pressable
            onPress={() => setOpenCamera(false)}
            style={{ position: 'absolute', top: 20, right: 20 }}
          >
            <FontAwesomeIcon
              icon={faX}
              color="white"
              style={{
                backgroundColor: 'rgba(53,53,53,0.9)',
                padding: 14,
                borderRadius: 14,
              }}
            />
          </Pressable>

          {/* Focus hint */}
          <View
            style={{
              position: 'absolute',
              bottom: 30,
              alignSelf: 'center',
              backgroundColor: 'rgba(53,53,53,0.9)',
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: 'white' }}>Press on the screen to focus</Text>
          </View>
        </View>
      )}
    </View>
  );
}
