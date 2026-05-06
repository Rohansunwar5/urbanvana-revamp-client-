import moment from 'moment';

export function getDateAsString(): string {
  return moment().format('Do MMMM YYYY');
}

export function convertDateAsString(date: string): string {
  return moment(date).format('Do MMMM YYYY');
}

export function isCurrentDateBeforeDate(givenDate: string): boolean {
  return new Date().setHours(0, 0, 0, 0) <= new Date(givenDate).setHours(0, 0, 0, 0);
}

export function getDate(defaultDate?: string): string {
  const dateObj = defaultDate ? new Date(defaultDate) : new Date();
  const year = dateObj.getFullYear().toString();
  let month = (dateObj.getMonth() + 1).toString();
  let date = dateObj.getDate().toString();
  if (month.length === 1) month = '0' + month;
  if (date.length === 1) date = '0' + date;
  return `${year}-${month}-${date}`;
}

export function getDateInDDMMYYYY(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = today.getMonth() + 1;
  const dd = today.getDate();
  const date = dd < 10 ? '0' + dd : dd.toString();
  const month = mm < 10 ? '0' + mm : mm.toString();
  return `${date}/${month}/${yyyy}`;
}
