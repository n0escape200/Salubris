import { useEffect, useState } from 'react';
import CustomModal from './CustomModal';
import Input from './Input';
import { useNotification } from '../Utils/Contexts/NotificationContext';
import axios from 'axios';
import { getApiUrl } from '../Utils/Constants';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { styles } from '../Utils/Styles';

type ImportProductProps = {
  open: boolean;
  onClose: () => void;
};

export default function ImportProduct({ open, onClose }: ImportProductProps) {
  const { addNotification } = useNotification();
  const { height } = Dimensions.get('window');
  const [product, setProduct] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNoData, setIsNotData] = useState(false);

  const maxScrollHeight = height * 0.65;
  function getMacro(product: any, macro: string): number {
    const value = (product.foodNutrients as Array<any>).filter(value =>
      (value.nutrientName as string).includes(macro),
    );
    if (value.length >= 1) {
      return value[0].value;
    }
    return 0;
  }

  useEffect(() => {
    if (data.length > 0 && !isNoData) {
      setIsLoading(false);
    }
  }, [data]);

  async function handleProductSearch() {
    try {
      await axios.get(getApiUrl(product)).then(data => {
        console.log(data.data);
        if (data.data.foods.length > 0) {
          setData(data.data.foods);
        } else {
          setIsNotData(true);
          setIsLoading(false);
        }
      });
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }
  return (
    <CustomModal
      open={open}
      onClose={() => {
        onClose();
        setData([]);
        setProduct('');
        setIsLoading(false);
        setIsNotData(false);
      }}
    >
      <Input
        label="Product"
        validate
        type="number"
        value={product}
        onChange={value => {
          setProduct(value);
        }}
        onSubmit={() => {
          setData([]);
          handleProductSearch();
          setIsLoading(true);
          setIsNotData(false);
        }}
      />
      <ScrollView
        style={{
          ...styles.container,
          marginTop: 20,
          maxHeight: maxScrollHeight,
        }}
      >
        {isLoading && <Text style={{ color: 'white' }}>Loading...</Text>}
        {isNoData && <Text style={{ color: 'white' }}>No data</Text>}
        {data.length > 0 && (
          <>
            {data.map((product: any, index) => {
              return (
                <View
                  key={index}
                  style={{
                    backgroundColor: '#727272ff',
                    marginBottom: 20,
                    padding: 10,
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 15 }}>
                    {(product.description as string).length > 40
                      ? `${(product.description as string).slice(0, 40)}...`
                      : product.description}
                  </Text>
                  <View>
                    <Text>{`Kcal:${getMacro(product, 'Energy')}`}</Text>
                  </View>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </CustomModal>
  );
}
