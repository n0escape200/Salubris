import { useState } from 'react';
import CustomModal from './CustomModal';
import Input from './Input';
import { useNotification } from '../Utils/Contexts/NotificationContext';
import axios from 'axios';
import { foodApiUrl, getApiUrl } from '../Utils/Constants';
import Config from 'react-native-config';
import { ScrollView, Text, View } from 'react-native';
import { styles } from '../Utils/Styles';

type ImportProductProps = {
  open: boolean;
  onClose: () => void;
};

export default function ImportProduct({ open, onClose }: ImportProductProps) {
  const { addNotification } = useNotification();
  const [product, setProduct] = useState('');
  const [data, setData] = useState([]);

  async function handleProductSearch() {
    try {
      await axios.get(getApiUrl(product)).then(data => {
        setData(data.data.foods);
      });
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }
  return (
    <CustomModal open={open} onClose={onClose}>
      <Input
        label="Product"
        validate
        type="number"
        value={product}
        onChange={value => {
          setProduct(value);
        }}
        onSubmit={handleProductSearch}
      />
      <ScrollView style={[styles.container, { marginTop: 20 }]}>
        {data.length > 0 && (
          <>
            {data.map((product: any, index) => {
              return (
                <View
                  key={index}
                  style={{
                    backgroundColor: '#727272ff',
                    marginBottom: 20,
                    padding: 5,
                  }}
                >
                  <Text>{product.description}</Text>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </CustomModal>
  );
}
