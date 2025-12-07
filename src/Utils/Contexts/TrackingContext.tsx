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
  thisWeekLines: TrackLine[];
  thisMonthLines: TrackLine[];
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
  const [thisMonthLines, setThisMonthLines] = useState<Array<TrackLine>>([]);
  const [thisWeekLines, setThisWeekLines] = useState<Array<TrackLine>>([]);
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

      const now = new Date();
      const todayString = now.toISOString().split('T')[0];
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth(); // 0-11

      const linesForToday = normalizedAll.filter(line => {
        try {
          const d = new Date((line as any).date);
          return d.toISOString().split('T')[0] === todayString;
        } catch {
          return false;
        }
      });

      const linesForThisMonth = normalizedAll.filter(line => {
        try {
          const d = new Date((line as any).date);
          return (
            d.getFullYear() === currentYear && d.getMonth() === currentMonth
          );
        } catch {
          return false;
        }
      });

      // Calculate Monday of current week
      const firstDayOfWeek = new Date(now);
      firstDayOfWeek.setHours(0, 0, 0, 0);
      firstDayOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7)); // Monday start

      // Calculate Sunday of current week
      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

      const linesForThisWeek = normalizedAll.filter(line => {
        try {
          const d = new Date((line as any).date);
          return d >= firstDayOfWeek && d <= lastDayOfWeek;
        } catch {
          return false;
        }
      });

      setTrackLines(normalizedAll);
      setTodayLines(linesForToday);
      setThisWeekLines(linesForThisWeek);
      setThisMonthLines(linesForThisMonth);
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
      setTrackLines([]);
      setTodayLines([]);
      setThisMonthLines([]);
    }
  }

  useEffect(() => {
    if (!updateLines) return;

    const setup = async () => {
      await getTrackLines();
      await getProducts();
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
        thisWeekLines,
        thisMonthLines,
        setUpdateLine,
        addProductToTracking,
        removeProductFromTracking,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
