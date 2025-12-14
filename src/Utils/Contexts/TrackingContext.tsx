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
  setUpdateLine: Dispatch<SetStateAction<boolean>>;
  addProductToTracking: (_product: ProductType, _ammount: number) => void;
  removeProductFromTracking: (_product: ProductType, _ammount: number) => void;
  removeProduct: (_product: Product) => Promise<number>;
  removeTrackLine: (_trakcLine: TrackLine) => void;
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
  const [updateLines, setUpdateLine] = useState(true);

  function addProductToTracking(_product: ProductType, _ammount: number) {
    const factor = _ammount / 100;
    setMacros(prev => ({
      calories: prev.calories + _product.calories * factor,
      protein: prev.protein + _product.protein * factor,
      carbs: prev.carbs + _product.carbs * factor,
      fats: prev.fats + _product.fats * factor,
    }));
  }

  function removeProductFromTracking(_product: ProductType, _ammount: number) {
    const factor = _ammount / 100;
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

      // Filter lines
      const linesForToday = normalizedAll.filter(line => {
        const d = new Date(line.date);
        return d.toISOString().split('T')[0] === todayString;
      });

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

      setTrackLines(normalizedAll);
      setTodayLines(linesForToday);
      setThisWeekLines(linesForThisWeek);
      setThisMonthLines(linesForThisMonth);

      // Compute macros for today asynchronously
      const todayMacros = await linesForToday.reduce<Promise<MacroModel>>(
        async (accP, line) => {
          const acc = await accP;
          try {
            const product = await line.product_id.fetch(); // fetch related product
            const factor = line.quantity / 100;
            return {
              calories: acc.calories + product.calories * factor,
              protein: acc.protein + product.protein * factor,
              carbs: acc.carbs + product.carbs * factor,
              fats: acc.fats + product.fats * factor,
            };
          } catch {
            return acc;
          }
        },
        Promise.resolve({ calories: 0, protein: 0, carbs: 0, fats: 0 }),
      );

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
        const trackLinesCollection = database.get('track_lines');
        const relatedTrackLines = await trackLinesCollection
          .query(Q.where('product_id', _product.id))
          .fetch();

        if (relatedTrackLines.length > 0) return 2;

        const productCollection = database.get<Product>('products');
        const productRecord = await productCollection.find(_product.id);
        await productRecord.markAsDeleted();

        setProducts(prev => prev.filter(prod => prod.id !== _product.id));
        return 1;
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      return 0;
    }
  }

  async function removeTrackLine(_trackLine: TrackLine) {
    try {
      // Fetch product data safely OUTSIDE the write block
      const product = await _trackLine.product_id.fetch();
      const productData = {
        calories: product.calories,
        protein: product.protein,
        carbs: product.carbs,
        fats: product.fats,
      };

      await database.write(async () => {
        // Delete only the TrackLine
        await _trackLine.markAsDeleted();

        // Update all relevant states
        setTrackLines(prev => prev.filter(line => line.id !== _trackLine.id));
        setTodayLines(prev => prev.filter(line => line.id !== _trackLine.id));
        setThisWeekLines(prev =>
          prev.filter(line => line.id !== _trackLine.id),
        );
        setThisMonthLines(prev =>
          prev.filter(line => line.id !== _trackLine.id),
        );

        // Update macros for today
        setMacros(prev => {
          const factor = _trackLine.quantity / 100;
          return {
            calories: prev.calories - productData.calories * factor,
            protein: prev.protein - productData.protein * factor,
            carbs: prev.carbs - productData.carbs * factor,
            fats: prev.fats - productData.fats * factor,
          };
        });
      });
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
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
        removeProduct,
        removeTrackLine,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
