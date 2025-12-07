import {
  faCarrot,
  faHouse,
  faMap,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import Vocabulary from './Vocabulary';
import { faClipboard } from '@fortawesome/free-solid-svg-icons/faClipboard';

export const footerItems = [
  {
    label: Vocabulary.home,
    icon: faHouse,
  },
  {
    label: Vocabulary.tracking,
    icon: faClipboard,
  },
  {
    label: Vocabulary.products,
    icon: faCarrot,
  },
  // {
  //   label: Vocabulary.map,
  //   icon: faMap,
  // },
  {
    label: Vocabulary.user,
    icon: faUser,
  },
];

export const notificationTypes = ['ERROR', 'SUCCESS'] as const;

export const foodApiUrl = 'https://api.nal.usda.gov/fdc/v1';

export function getApiUrl(product: string): string {
  return `${foodApiUrl}/foods/search?api_key=Jowjo9bvwSDSSyFfVab8IuHna8SywQGuFbxAEkbL&query=${product.replaceAll(
    ' ',
    '%20',
  )}&dataType=Foundation`;
}
