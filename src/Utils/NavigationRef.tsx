import { createNavigationContainerRef } from '@react-navigation/native';
export const navigationRef = createNavigationContainerRef();
export function getCurrentRouteName() {
  return navigationRef.getCurrentRoute()?.name;
}
