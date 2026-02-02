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
import Meal, { MealProduct } from '../../DB/Models/Meal';
import { Q } from '@nozbe/watermelondb';

type TrackingContextType = {
  macros: MacroModel;
  products: Product[];
  trackLines: TrackLine[];
  todayLines: TrackLine[];
  thisWeekLines: TrackLine[];
  thisMonthLines: TrackLine[];
  selectedDateLines: TrackLine[];
  selectedDate: Date | null;
  meals: Meal[];
  setUpdateLines: Dispatch<SetStateAction<boolean>>;
  setSelectedDate: Dispatch<SetStateAction<Date | null>>;
  addProductToTracking: (_product: ProductType, _amount: number) => void;
  removeProductFromTracking: (_product: ProductType, _amount: number) => void;
  removeProduct: (_product: Product) => Promise<number>;
  removeTrackLine: (_trackLine: TrackLine) => void;
  getTrackLinesForDate: (_date: Date) => Promise<void>;
  refreshTrackLines: () => Promise<void>;
  resetToToday: () => void;
  // Meal functions
  addMealToTracking: (
    _meal: Meal,
    _date: Date,
    _quantity: number,
  ) => Promise<void>;
  getMeals: () => Promise<void>;
  removeMeal: (_meal: Meal) => Promise<void>;
  refreshMeals: () => Promise<void>;
  editMeal: (
    _meal: Meal,
    _data: { name: string; products: MealProduct[] },
  ) => Promise<void>;
  addMeal: (_meal: Meal) => void;
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

// Helper function for local date string
const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
  const [meals, setMeals] = useState<Meal[]>([]);

  // Use refs to track previous values and prevent infinite loops
  const isInitialMount = useRef(true);
  const prevSelectedDate = useRef<Date | null>(null);

  // =================== PRODUCT FUNCTIONS ===================
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

  // =================== TRACK LINE FUNCTIONS ===================
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

        // FIXED: Correct week calculation
        // Get start of week (Monday)
        const startOfWeek = new Date(now);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);

        // Get end of week (Sunday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const linesForThisWeek = normalizedAll.filter(line => {
          try {
            const lineDate = new Date(line.date);
            return lineDate >= startOfWeek && lineDate <= endOfWeek;
          } catch (error) {
            console.error('Error parsing line date:', line.date, error);
            return false;
          }
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
        console.error('Error in refreshTrackLines:', error);
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
  );

  const getTrackLinesForDate = useCallback(
    async (date: Date) => {
      try {
        const targetDate = new Date(date);
        setSelectedDate(targetDate);
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

  const removeTrackLine = useCallback(
    async (_trackLine: TrackLine) => {
      try {
        await database.write(async () => {
          await _trackLine.markAsDeleted();
          await refreshTrackLines();
        });
      } catch (error) {
        addNotification({ type: 'ERROR', message: `${error}` });
      }
    },
    [addNotification, refreshTrackLines],
  );

  // =================== MEAL FUNCTIONS ===================
  const getMeals = useCallback(async () => {
    try {
      const allMeals = await database.get<Meal>('meals').query().fetch();
      setMeals(allMeals || []);
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }, [addNotification]);

  // Alias for getMeals for consistency
  const refreshMeals = useCallback(async () => {
    await getMeals();
  }, [getMeals]);

  const addMealToTracking = useCallback(
    async (meal: Meal, selectedDate: Date, quantity: number) => {
      try {
        if (!meal.products || meal.products.length === 0) {
          addNotification({
            type: 'ERROR',
            message: 'Meal has no products',
          });
          return;
        }

        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFats = 0;
        let totalQuantity = 0;
        await database.write(async () => {
          for (const mealProduct of meal.products) {
            const product = await database
              .get<Product>('products')
              .query(Q.where('id', mealProduct.id), Q.take(1))
              .fetch();
            const data = product[0];

            if (data.id) {
              const factor = mealProduct.quantity / 100;
              totalQuantity += mealProduct.quantity;
              totalCalories += data.calories * factor;
              totalProtein += data.protein * factor;
              totalCarbs += data.carbs * factor;
              totalFats += data.fats * factor;
            }
          }

          await database.get<TrackLine>('track_lines').create(trackLine => {
            trackLine.date = getLocalDateString(selectedDate);
            trackLine.quantity = quantity;
            trackLine.unit = 'g';
            trackLine.name = meal.name;
            trackLine.calories = (totalCalories / totalQuantity) * quantity;
            trackLine.protein = (totalProtein / totalQuantity) * quantity;
            trackLine.carbs = (totalCarbs / totalQuantity) * quantity;
            trackLine.fats = (totalFats / totalQuantity) * quantity;
          });

          addNotification({
            type: 'SUCCESS',
            message: `Meal "${meal.name}" added`,
          });

          await refreshTrackLines();
        });
      } catch (error) {
        addNotification({ type: 'ERROR', message: `${error}` });
      }
    },
    [addNotification, refreshTrackLines],
  );

  const removeMeal = useCallback(
    async (meal: Meal) => {
      try {
        await database.write(async () => {
          await meal.markAsDeleted();
        });

        await getMeals();

        addNotification({
          type: 'SUCCESS',
          message: `Meal "${meal.name}" deleted`,
        });
      } catch (error) {
        addNotification({ type: 'ERROR', message: `${error}` });
      }
    },
    [addNotification, getMeals],
  );

  const editMeal = useCallback(
    async (meal: Meal, data: { name: string; products: MealProduct[] }) => {
      try {
        if (!data.name.trim()) {
          addNotification({
            type: 'ERROR',
            message: 'Please enter a meal name',
          });
          return;
        }

        if (data.products.length === 0) {
          addNotification({
            type: 'ERROR',
            message: 'Please add at least one product',
          });
          return;
        }

        await database.write(async () => {
          const mealRecord = await database.get<Meal>('meals').find(meal.id);
          await mealRecord.update(m => {
            m.name = data.name;
            m.products = data.products;
          });
        });

        await getMeals();

        addNotification({
          type: 'SUCCESS',
          message: `Meal "${data.name}" updated successfully`,
        });
      } catch (error) {
        addNotification({ type: 'ERROR', message: 'Failed to update meal' });
      }
    },
    [addNotification, getMeals],
  );

  // =================== INITIAL LOAD & EFFECTS ===================
  useEffect(() => {
    if (!updateLines) return;

    const setup = async () => {
      await getProducts();
      await getMeals();
      await refreshTrackLines();
      setUpdateLines(false);
    };

    setup();
  }, [updateLines, getProducts, getMeals, refreshTrackLines]);

  // Handle selectedDate changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const currentDateStr = selectedDate ? normalizeDate(selectedDate) : null;
    const prevDateStr = prevSelectedDate.current
      ? normalizeDate(prevSelectedDate.current)
      : null;

    if (currentDateStr !== prevDateStr) {
      refreshTrackLines();
    }

    prevSelectedDate.current = selectedDate;
  }, [selectedDate, refreshTrackLines]);

  async function addMeal(meal: Meal) {
    try {
      await database.write(async () => {
        await database.get<Meal>('meals').create(m => {
          m.name = meal.name;
          m.products = meal.products;
        });
        addNotification({
          type: 'SUCCESS',
          message: `Added meal ${meal.name}`,
        });
      });
      refreshMeals();
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

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
        meals,
        setUpdateLines,
        setSelectedDate,
        addProductToTracking,
        removeProductFromTracking,
        removeProduct,
        removeTrackLine,
        getTrackLinesForDate,
        refreshTrackLines,
        resetToToday,
        addMealToTracking,
        getMeals,
        removeMeal,
        refreshMeals,
        editMeal,
        addMeal,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
