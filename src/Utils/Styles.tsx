import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  page: {
    backgroundColor: 'black',
    flex: 1,
    gap: 20,
    padding: 10,
  },
  container: {
    backgroundColor: '#1c1c1c',
    padding: 20,
    borderRadius: 10,
  },
  footer: {
    backgroundColor: '#1c1c1c',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 50,
    borderColor: '#222222',
    borderWidth: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  textxl: {
    color: 'white',
    fontSize: 21,
  },
  textl: {
    color: 'white',
    fontSize: 15,
  },
  wrapper: {
    position: 'relative',
    zIndex: 50,
  },

  input: {
    borderBottomColor: '#ffffff80',
    borderBottomWidth: 0.5,
    color: 'white',
    paddingVertical: 8,
    fontSize: 15, // matches textl
  },

  dropdown: {
    position: 'absolute',
    top: 38,
    left: 0,
    right: 0,
    backgroundColor: '#1c1c1c', // same as container
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#222222',
    elevation: 6, // Android
    zIndex: 100,
  },

  option: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2a2a2a',
  },

  optionText: {
    color: 'white',
    fontSize: 15,
  },
  texts: {
    color: 'white',
    fontSize: 12,
  },

  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },

  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  macroColumn: {
    gap: 8,
  },

  macroLabel: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '500',
  },

  macroValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
  },

  controlsContainer: {
    backgroundColor: '#1c1c1c',
    padding: 16,
    borderRadius: 12,
  },

  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },

  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 8,
  },

  mealButton: {
    backgroundColor: '#4CAF50',
  },

  productButton: {
    backgroundColor: '#2196F3',
  },

  dateButton: {
    backgroundColor: '#FF9800',
  },

  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  resetContainer: {
    alignItems: 'center',
  },

  resetButton: {
    backgroundColor: '#666',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  trackListContainer: {
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    padding: 16,
    flex: 1,
  },

  listHeader: {
    marginBottom: 16,
  },

  listTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  emptyStateContainer: {
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  emptyStateTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyStateText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Modal styles
  modalContent: {
    maxHeight: 400,
  },

  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },

  macroInput: {
    flex: 1,
    minWidth: '45%',
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  quantityInput: {
    flex: 3,
  },

  unitSelector: {
    flex: 1,
  },

  unitInput: {
    textAlign: 'center',
  },

  // Meal Modal styles
  emptyMealsContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyMealsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyMealsText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  mealsList: {
    maxHeight: 300,
  },

  mealCard: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },

  mealCardSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#2a2a2a',
  },

  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },

  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  mealName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },

  mealItemCount: {
    color: '#aaa',
    fontSize: 14,
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  mealMacros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#3a3a3a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  macroItem: {
    alignItems: 'center',
  },

  productPreviewText: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 2,
  },

  moreProductsText: {
    color: '#888',
    fontSize: 12,
    fontStyle: 'italic',
  },

  productsPreview: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
  },

  confirmationSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },

  confirmationTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },

  confirmationButtons: {
    gap: 10,
  },

  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
  },

  cancelButton: {
    backgroundColor: '#666',
    paddingVertical: 14,
  },

  productCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3a3a3a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },

  productTitleContainer: {
    flex: 1,
    marginRight: 12,
  },

  productName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },

  productUnit: {
    color: '#aaa',
    fontSize: 12,
    backgroundColor: '#3a3a3a',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },

  productActions: {
    flexDirection: 'row',
    gap: 12,
  },

  editButton: {
    padding: 6,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderRadius: 6,
  },

  deleteButton: {
    padding: 6,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 6,
  },

  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  macroDivider: {
    width: 1,
    backgroundColor: '#3a3a3a',
    marginHorizontal: 16,
  },

  macroUnit: {
    color: '#888',
    fontSize: 11,
  },

  quickActions: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
  },

  quickActionButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  productCardCompact: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },

  productInfoCompact: {
    flex: 1,
    marginRight: 12,
  },

  productHeaderCompact: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
    gap: 8,
  },

  productNameCompact: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },

  productUnitCompact: {
    color: '#888',
    fontSize: 10,
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  macrosRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  macroItemCompact: {
    alignItems: 'center',
    minWidth: 40,
  },

  macroValueCompact: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 1,
  },

  macroLabelCompact: {
    color: '#aaa',
    fontSize: 10,
    textTransform: 'uppercase',
  },

  macroDividerCompact: {
    width: 1,
    height: 16,
    backgroundColor: '#444',
  },

  actionsCompact: {
    flexDirection: 'row',
    gap: 8,
  },

  actionButtonCompact: {
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 6,
  },
  homeContainer: {
    gap: 20,
    paddingBottom: 30,
  },

  headerSection: {
    backgroundColor: '#1c1c1c',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2196F3',
  },

  welcomeText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },

  userName: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },

  statsCard: {
    backgroundColor: '#1c1c1c',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5722',
  },

  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },

  statsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },

  statsContent: {
    alignItems: 'center',
    marginBottom: 12,
  },

  caloriesValue: {
    color: 'white',
    fontSize: 48,
    fontWeight: '700',
  },

  caloriesUnit: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '500',
    marginTop: -8,
  },

  statsFooter: {
    alignItems: 'center',
  },

  statsSubtitle: {
    color: '#aaa',
    fontSize: 14,
    fontStyle: 'italic',
  },

  sectionContainer: {
    backgroundColor: '#1c1c1c',
    borderRadius: 16,
    padding: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },

  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
  },

  tabButtonActive: {
    backgroundColor: '#2196F3',
  },

  tabButtonText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },

  tabButtonTextActive: {
    color: 'white',
  },

  chartContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },

  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  chartTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  averageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  averageLabel: {
    color: '#aaa',
    fontSize: 14,
  },

  averageValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  averageUnit: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: 'normal',
  },

  chartStyle: {
    marginVertical: 8,
    borderRadius: 12,
  },

  statsSummary: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },

  statLabel: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },

  statDivider: {
    width: 1,
    backgroundColor: '#3a3a3a',
  },
  chartWrapper: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    overflow: 'hidden', // Important: prevents overflow
  },
  dataSourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(79, 195, 247, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#4FC3F7',
  },

  dataSourceText: {
    color: '#aaa',
    fontSize: 13,
    flex: 1,
  },

  dataSourceLink: {
    color: '#4FC3F7',
    fontWeight: '600',
  },

  searchSection: {
    marginBottom: 20,
  },

  searchButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  searchButtonDisabled: {
    backgroundColor: '#666',
    opacity: 0.7,
  },

  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  resultsContainer: {
    minHeight: 200,
  },

  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  resultsCount: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '500',
  },

  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
  },

  clearButtonText: {
    color: '#aaa',
    fontSize: 13,
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },

  loadingText: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 12,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },

  initialState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },

  initialStateTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },

  initialStateText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  productsList: {
    gap: 12,
  },

  productMacros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#3a3a3a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  productHint: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  mealsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  mealsTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 2,
  },

  mealsSubtitle: {
    color: '#aaa',
    fontSize: 14,
  },

  addMealButton: {
    backgroundColor: '#4CAF50',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  mealsListContainer: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    borderRadius: 16,
  },

  emptyMealsState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  createFirstMealButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },

  createFirstMealText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  mealsGrid: {
    padding: 16,
    gap: 12,
  },

  mealFormContainer: {
    gap: 20,
  },

  productsSection: {
    gap: 16,
  },

  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 10,
  },

  removeProductButton: {
    padding: 6,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 6,
  },

  productInputs: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },

  productNameInput: {
    flex: 2,
  },

  addProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
    borderStyle: 'dashed',
  },

  addProductText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },

  mealSummary: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    gap: 4,
  },

  summaryTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },

  summaryText: {
    color: '#aaa',
    fontSize: 13,
    textAlign: 'center',
  },

  mealIconContainer: {
    justifyContent: 'center',
  },

  mealIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 152, 0, 0.3)',
  },

  mealInfo: {
    flex: 1,
    gap: 4,
  },

  mealDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  mealProductCount: {
    color: '#aaa',
    fontSize: 12,
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },

  mealProductPreview: {
    color: '#888',
    fontSize: 12,
  },

  mealActions: {
    flexDirection: 'row',
    gap: 12,
  },

  mealModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  mealModalSubtitle: {
    color: '#aaa',
    fontSize: 14,
  },

  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#333',
    borderRadius: 6,
  },

  closeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },

  mealsScrollContent: {
    paddingBottom: 20,
  },

  mealSelectionCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },

  mealCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },

  mealSelectionName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },

  mealCardContent: {
    gap: 12,
  },

  mealStatsRow: {
    flexDirection: 'row',
    gap: 20,
  },

  mealStat: {
    alignItems: 'center',
  },

  mealStatValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },

  mealStatLabel: {
    color: '#aaa',
    fontSize: 12,
    textTransform: 'uppercase',
  },

  quickMacros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#3a3a3a',
    padding: 12,
    borderRadius: 8,
  },

  quickMacro: {
    alignItems: 'center',
    minWidth: 50,
  },

  quickMacroValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },

  quickMacroLabel: {
    color: '#aaa',
    fontSize: 12,
    textTransform: 'uppercase',
  },

  mealCardFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
  },

  selectMealText: {
    color: '#4CAF50',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },

  closeEmptyButton: {
    backgroundColor: '#666',
    paddingVertical: 12,
    paddingHorizontal: 32,
  },

  // Confirmation Modal Styles
  confirmationContent: {
    gap: 20,
  },

  confirmationHeader: {
    alignItems: 'center',
    gap: 12,
  },

  confirmationMealName: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },

  confirmationDetails: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 16,
    gap: 12,
  },

  confirmationDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  confirmationDetailLabel: {
    color: '#aaa',
    fontSize: 14,
  },

  confirmationDetailValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  confirmationProducts: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 16,
  },

  confirmationProductsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  confirmationProductsList: {
    maxHeight: 150,
  },

  confirmationProductItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },

  confirmationProductName: {
    color: 'white',
    fontSize: 14,
    flex: 1,
  },

  confirmationProductQuantity: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
  },

  confirmationNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },

  confirmationNoteText: {
    color: '#aaa',
    fontSize: 13,
    flex: 1,
  },

  confirmationActions: {
    gap: 12,
  },

  confirmAddButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
  },

  confirmCancelButton: {
    backgroundColor: '#666',
    paddingVertical: 14,
  },
});
