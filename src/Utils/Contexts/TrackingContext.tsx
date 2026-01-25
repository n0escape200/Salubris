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
import { Q } from '@nozbe/watermelondb';

type TrackingContextType = {
  macros: MacroModel;
  products: Product[];
  trackLines: TrackLine[];
  todayLines: TrackLine[];
  thisWeekLines: TrackLine[];
  thisMonthLines: TrackLine[];
  setUpdateLines: Dispatch<SetStateAction<boolean>>;
  addProductToTracking: (_product: ProductType, _amount: number) => void;
  removeProductFromTracking: (_product: ProductType, _amount: number) => void;
  removeProduct: (_product: Product) => Promise<number>;
  removeTrackLine: (_trackLine: TrackLine) => void;
  getTrackLinesForDate: (_date: Date) => void;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [trackLines, setTrackLines] = useState<TrackLine[]>([]);
  const [todayLines, setTodayLines] = useState<TrackLine[]>([]);
  const [thisMonthLines, setThisMonthLines] = useState<TrackLine[]>([]);
  const [thisWeekLines, setThisWeekLines] = useState<TrackLine[]>([]);
  const [updateLines, setUpdateLines] = useState(true);

  function addProductToTracking(_product: ProductType, _amount: number) {
    const factor = _amount / 100;
    setMacros(prev => ({
      calories: prev.calories + _product.calories * factor,
      protein: prev.protein + _product.protein * factor,
      carbs: prev.carbs + _product.carbs * factor,
      fats: prev.fats + _product.fats * factor,
    }));
  }

  function removeProductFromTracking(_product: ProductType, _amount: number) {
    const factor = _amount / 100;
    setMacros(prev => ({
      calories: prev.calories - _product.calories * factor,
      protein: prev.protein - _product.protein * factor,
      carbs: prev.carbs - _product.carbs * factor,
      fats: prev.fats - _product.fats * factor,
    }));
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
      const currentMonth = now.getMonth();

      const linesForToday = normalizedAll.filter(
        line => line.date.split('T')[0] === todayString,
      );

      const linesForThisMonth = normalizedAll.filter(line => {
        const d = new Date(line.date);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      });

      const firstDayOfWeek = new Date(now);
      firstDayOfWeek.setHours(0, 0, 0, 0);
      firstDayOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

      const linesForThisWeek = normalizedAll.filter(line => {
        const d = new Date(line.date);
        return d >= firstDayOfWeek && d <= lastDayOfWeek;
      });

      setTrackLines(linesForToday);
      setTodayLines(linesForToday);
      setThisWeekLines(linesForThisWeek);
      setThisMonthLines(linesForThisMonth);

      // Compute today's macros
      const todayMacros = linesForToday.reduce<MacroModel>((acc, line) => {
        if (!line) return acc;
        const factor = line.quantity / 100;
        return {
          calories: acc.calories + (line.calories || 0) * factor,
          protein: acc.protein + (line.protein || 0) * factor,
          carbs: acc.carbs + (line.carbs || 0) * factor,
          fats: acc.fats + (line.fats || 0) * factor,
        };
      }, new MacroModel());

      setMacros(todayMacros);
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
      setTrackLines([]);
      setTodayLines([]);
      setThisMonthLines([]);
      setMacros(new MacroModel());
    }
  }

  async function removeProduct(_product: Product): Promise<number> {
    try {
      return await database.write(async () => {
        const productCollection = database.get<Product>('products');
        const productRecord = await productCollection.find(_product.id);
        await productRecord.markAsDeleted();

        setProducts(prev => prev.filter(prod => prod.id !== _product.id));
        return 1; // success
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      return 0; // failure
    }
  }

  async function removeTrackLine(_trackLine: TrackLine) {
    try {
      await database.write(async () => {
        await _trackLine.markAsDeleted();

        setTrackLines(prev => prev.filter(line => line.id !== _trackLine.id));
        setTodayLines(prev => prev.filter(line => line.id !== _trackLine.id));
        setThisWeekLines(prev =>
          prev.filter(line => line.id !== _trackLine.id),
        );
        setThisMonthLines(prev =>
          prev.filter(line => line.id !== _trackLine.id),
        );

        const factor = _trackLine.quantity / 100;
        setMacros(prev => ({
          calories: prev.calories - (_trackLine.calories || 0) * factor,
          protein: prev.protein - (_trackLine.protein || 0) * factor,
          carbs: prev.carbs - (_trackLine.carbs || 0) * factor,
          fats: prev.fats - (_trackLine.fats || 0) * factor,
        }));
      });
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  async function getTrackLinesForDate(date: Date) {
    try {
      const formatDate = date.toISOString().split('T')[0];

      const dateLines = await database
        .get<TrackLine>('track_lines')
        .query(Q.where('date', formatDate))
        .fetch();

      const macros = new MacroModel();

      for (const line of dateLines) {
        macros.calories += line.calories;
        macros.carbs += line.carbs;
        macros.fats += line.fats;
        macros.protein += line.protein;
      }

      setMacros(macros);
      setTrackLines(dateLines);
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  useEffect(() => {
    if (!updateLines) return;
    const setup = async () => {
      await getTrackLines();
      await getProducts();
      setUpdateLines(false);
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
        setUpdateLines,
        addProductToTracking,
        removeProductFromTracking,
        removeProduct,
        removeTrackLine,
        getTrackLinesForDate,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
