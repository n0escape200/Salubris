import { useState } from 'react';
import CustomModal from './CustomModal';
import Input from './Input';
import { useNotification } from '../Utils/Contexts/NotificationContext';
import axios from 'axios';
import { foodApiUrl } from '../Utils/Constants';

type ImportProductProps = {
  open: boolean;
  onClose: () => void;
};

export default function ImportProduct({ open, onClose }: ImportProductProps) {
  const { addNotification } = useNotification();
  const [product, setProduct] = useState('');

  function handleProductSearch() {
    try {
      axios.get(`${foodApiUrl}/foods/search?api_key=`);
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
    </CustomModal>
  );
}
