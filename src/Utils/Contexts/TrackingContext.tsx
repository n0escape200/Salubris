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
      setProducts(allProducts || []);
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

      const normalizedAll = Array.isArray(allTrackLines) ? allTrackLines : [];

      // Use ISO date so split('T')[0] works predictably
      const todayString = new Date().toISOString().split('T')[0];

      const linesForToday = normalizedAll.filter(line => {
        try {
          // handle if line.date is Date or ISO string or other
          const lineDateIso = new Date((line as any).date)
            .toISOString()
            .split('T')[0];
          return lineDateIso === todayString;
        } catch (e) {
          // if parsing fails, exclude this line
          return false;
        }
      });

      // set both full list and today's filtered list
      setTrackLines(normalizedAll);
      setTodayLines(linesForToday);
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
      setTrackLines([]);
      setTodayLines([]);
    }
  }

  useEffect(() => {
    const initialSetup = async () => {
      await getProducts();
      await getTrackLines();
    };
    initialSetup();
    // run once on mount
  }, []);

  useEffect(() => {
    // re-fetch track lines when updateLines is toggled
    if (!updateLines) return;

    const setup = async () => {
      await getTrackLines();
      // reset the update trigger
      setUpdateLine(false);
    };

    setup();
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
