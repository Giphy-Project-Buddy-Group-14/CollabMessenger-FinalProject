import moment from 'moment';
import { DEFAULT_TIME_ZONE } from '../../common/constants';

export const validateDate = (date) => {
  if (date === undefined || date === null) {
    throw new Error('Invalid date');
  }
};

export const formatDateAsMonthDayYear = (date) => {
  try {
    validateDate(date);
    return moment(date).tz(DEFAULT_TIME_ZONE).format('MMM Do YYYY, h:mm A');
  } catch (error) {
    console.log('Error formatting date:', error);
    return '';
  }
};
