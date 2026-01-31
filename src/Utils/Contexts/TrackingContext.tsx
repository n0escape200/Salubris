import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
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
  selectedDateLines: TrackLine[];
  selectedDate: Date | null;
  setUpdateLines: Dispatch<SetStateAction<boolean>>;
  setSelectedDate: Dispatch<SetStateAction<Date | null>>;
  addProductToTracking: (_product: ProductType, _amount: number) => void;
  removeProductFromTracking: (_product: ProductType, _amount: number) => void;
  removeProduct: (_product: Product) => Promise<number>;
  removeTrackLine: (_trackLine: TrackLine) => void;
  getTrackLinesForDate: (_date: Date) => Promise<void>;
  refreshTrackLines: () => Promise<void>;
  resetToToday: () => void;
};

export const TrackingContext = createContext<TrackingContextType | undefined>(
  undefined,
);

type TrackingProviderProps = {
  children: ReactNode;
};

// Helper function to normalize dates for comparison
const normalizeDate = (date: Date): string => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized.toISOString().split('T')[0]; // Get just YYYY-MM-DD
};

export const TrackingProvider = ({ children }: TrackingProviderProps) => {
  const { addNotification } = useNotification();
  const [macros, setMacros] = useState(new MacroModel());
  const [products, setProducts] = useState<Product[]>([]);
  const [trackLines, setTrackLines] = useState<TrackLine[]>([]);
  const [todayLines, setTodayLines] = useState<TrackLine[]>([]);
  const [thisMonthLines, setThisMonthLines] = useState<TrackLine[]>([]);
  const [thisWeekLines, setThisWeekLines] = useState<TrackLine[]>([]);
  const [selectedDateLines, setSelectedDateLines] = useState<TrackLine[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [updateLines, setUpdateLines] = useState(true);

  // Use refs to track previous values and prevent infinite loops
  const isInitialMount = useRef(true);
  const prevSelectedDate = useRef<Date | null>(null);

  const addProductToTracking = useCallback(
    (_product: ProductType, _amount: number) => {
      const factor = _amount / 100;
      setMacros(prev => ({
        calories: prev.calories + _product.calories * factor,
        protein: prev.protein + _product.protein * factor,
        carbs: prev.carbs + _product.carbs * factor,
        fats: prev.fats + _product.fats * factor,
      }));
    },
    [],
  );

  const removeProductFromTracking = useCallback(
    (_product: ProductType, _amount: number) => {
      const factor = _amount / 100;
      setMacros(prev => ({
        calories: prev.calories - _product.calories * factor,
        protein: prev.protein - _product.protein * factor,
        carbs: prev.carbs - _product.carbs * factor,
        fats: prev.fats - _product.fats * factor,
      }));
    },
    [],
  );

  const getProducts = useCallback(async () => {
    try {
      const allProducts = await database
        .get<Product>('products')
        .query()
        .fetch();
      setProducts(allProducts || []);
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }, [addNotification]);

  const refreshTrackLines = useCallback(
    async (forceToday: boolean = false) => {
      try {
        const allTrackLines = await database
          .get<TrackLine>('track_lines')
          .query()
          .fetch();
        const normalizedAll = Array.isArray(allTrackLines) ? allTrackLines : [];

        const now = new Date();
        const todayNormalized = normalizeDate(now);
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        // Calculate time-based filtered lines
        const linesForToday = normalizedAll.filter(
          line => normalizeDate(new Date(line.date)) === todayNormalized,
        );

        const linesForThisMonth = normalizedAll.filter(line => {
          const d = new Date(line.date);
          return (
            d.getFullYear() === currentYear && d.getMonth() === currentMonth
          );
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

        // Update time-based filtered lines
        setTodayLines(linesForToday);
        setThisWeekLines(linesForThisWeek);
        setThisMonthLines(linesForThisMonth);

        // If a date is selected and we're not forcing today view, update selected date
        if (selectedDate && !forceToday) {
          const targetDateNormalized = normalizeDate(selectedDate);
          const dateLines = normalizedAll.filter(
            line => normalizeDate(new Date(line.date)) === targetDateNormalized,
          );

          setSelectedDateLines(dateLines);
          setTrackLines(dateLines);

          // Calculate macros for selected date
          const dateMacros = dateLines.reduce<MacroModel>((acc, line) => {
            if (!line) return acc;
            const factor = line.quantity / 100;
            return {
              calories: acc.calories + (line.calories || 0) * factor,
              protein: acc.protein + (line.protein || 0) * factor,
              carbs: acc.carbs + (line.carbs || 0) * factor,
              fats: acc.fats + (line.fats || 0) * factor,
            };
          }, new MacroModel());

          setMacros(dateMacros);
        } else {
          // Show today's lines and calculate today's macros
          setTrackLines(linesForToday);

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
        }
      } catch (error) {
        addNotification({ type: 'ERROR', message: `${error}` });
        setTrackLines([]);
        setTodayLines([]);
        setThisMonthLines([]);
        setThisWeekLines([]);
        setSelectedDateLines([]);
        setMacros(new MacroModel());
      }
    },
    [addNotification, selectedDate],
  ); // Only depends on selectedDate

  const getTrackLinesForDate = useCallback(
    async (date: Date) => {
      try {
        const targetDate = new Date(date);
        setSelectedDate(targetDate);

        // We'll let refreshTrackLines handle the actual data fetching
        // to avoid duplicate logic and state updates
        await refreshTrackLines();
      } catch (error) {
        addNotification({ type: 'ERROR', message: `${error}` });
      }
    },
    [addNotification, refreshTrackLines],
  );

  const resetToToday = useCallback(() => {
    setSelectedDate(null);
    refreshTrackLines(true); // Force today view
  }, [refreshTrackLines]);

  const removeProduct = useCallback(
    async (_product: Product): Promise<number> => {
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
    },
    [],
  );

  const removeTrackLine = useCallback(
    async (_trackLine: TrackLine) => {
      try {
        await database.write(async () => {
          await _trackLine.markAsDeleted();

          // Refresh all data after deletion
          await refreshTrackLines();
        });
      } catch (error) {
        addNotification({ type: 'ERROR', message: `${error}` });
      }
    },
    [addNotification, refreshTrackLines],
  );

  // Initial load and when updateLines changes
  useEffect(() => {
    if (!updateLines) return;

    const setup = async () => {
      await getProducts();
      await refreshTrackLines();
      setUpdateLines(false);
    };

    setup();
  }, [updateLines, getProducts, refreshTrackLines]);

  // Handle selectedDate changes - refresh data when selectedDate changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only refresh if selectedDate actually changed
    const currentDateStr = selectedDate ? normalizeDate(selectedDate) : null;
    const prevDateStr = prevSelectedDate.current
      ? normalizeDate(prevSelectedDate.current)
      : null;

    if (currentDateStr !== prevDateStr) {
      refreshTrackLines();
    }

    prevSelectedDate.current = selectedDate;
  }, [selectedDate, refreshTrackLines]);

  return (
    <TrackingContext.Provider
      value={{
        macros,
        products,
        trackLines,
        todayLines,
        thisWeekLines,
        thisMonthLines,
        selectedDateLines,
        selectedDate,
        setUpdateLines,
        setSelectedDate,
        addProductToTracking,
        removeProductFromTracking,
        removeProduct,
        removeTrackLine,
        getTrackLinesForDate,
        refreshTrackLines,
        resetToToday,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
