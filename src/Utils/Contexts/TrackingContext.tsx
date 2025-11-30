import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import Product, { ProductType } from '../../DB/Models/Product';
import { MacroModel } from '../Models';
import { useNotification } from './NotificationContext';
import { database } from '../../DB/Database';
import TrackLine from '../../DB/Models/TrackLine';

type TrackingContextType = {
  macros: MacroModel;
  products: Product[];
  trackLines: TrackLine[];
  todayLines: TrackLine[];
  setUpdateLine: Dispatch<SetStateAction<boolean>>;
  addProductToTracking: (_product: ProductType, _ammount: number) => void;
  removeProductFromTracking: (_product: ProductType, _ammount: number) => void;
};

export const TrackingContext = createContext<TrackingContextType | undefined>(
  undefined,
);

type TrackingProviderProps = {
  children: ReactNode;
};

export const TrackingProvider = ({ children }: TrackingProviderProps) => {
  const { addNotification } = useNotification();
  const [macros, setMacros] = useState(new MacroModel());
  const [products, setProducts] = useState<Array<Product>>([]);
  const [trackLines, setTrackLines] = useState<Array<TrackLine>>([]);
  const [todayLines, setTodayLines] = useState<Array<TrackLine>>([]);
  const [updateLines, setUpdateLine] = useState(true);

  function addProductToTracking(_product: ProductType, _ammount: number) {
    try {
      const factor = _ammount / 100;
      setMacros(prev => ({
        calories: prev.calories + _product.calories * factor,
        protein: prev.protein + _product.protein * factor,
        carbs: prev.carbs + _product.carbs * factor,
        fats: prev.fats + _product.fats * factor,
      }));
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  function removeProductFromTracking(_product: ProductType, _ammount: number) {
    try {
      const factor = _ammount / 100;
      setMacros(prev => ({
        calories: prev.calories - _product.calories * factor,
        protein: prev.protein - _product.protein * factor,
        carbs: prev.carbs - _product.carbs * factor,
        fats: prev.fats - _product.fats * factor,
      }));
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  async function getProducts() {
    try {
      const allProducts = await database
        .get<Product>('products')
        .query()
        .fetch();
      setProducts(allProducts);
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  async function getTrackLines() {
    try {
      const allTrackLines = await database
        .get<TrackLine>('track_lines')
        .query()
        .fetch();
      setTrackLines(allTrackLines);
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  function getTodayLines() {
    try {
      if (trackLines.length > 0) {
        const todayString = new Date().toString();

        const lines = trackLines.filter(line => line.date === todayString);

        setTodayLines(lines);
      }
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  useEffect(() => {
    const initialSetup = async () => {
      await getProducts();
    };
    initialSetup();
  }, []);

  useEffect(() => {
    const initialSetup = async () => {
      await getTrackLines();
      getTodayLines();
    };
    if (updateLines) {
      initialSetup();
      setUpdateLine(false);
    }
  }, [updateLines]);

  return (
    <TrackingContext.Provider
      value={{
        macros,
        products,
        trackLines,
        todayLines,
        setUpdateLine,
        addProductToTracking,
        removeProductFromTracking,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
