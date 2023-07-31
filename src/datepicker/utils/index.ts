export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const daysOfTheWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const sundayToMondayWeekDayMap: Record<number, number> = {
  0: 6,
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
};

const VISIBLE_CELLS_AMOUNT = 7 * 6;

export interface DateCell {
  year: number;
  month: number;
  date: number;
  type: 'next' | 'prev' | 'current';

  isToday?: boolean;
  isSelected?: boolean;
}

function getDayOfTheWeek(date: Date) {
  const day = date.getDay();

  return sundayToMondayWeekDayMap[day];
}

export function getDaysAmountInAMonth(year: number, month: number) {
  const nextMonthDate = new Date(year, month + 1, 1);
  nextMonthDate.setMinutes(-1);
  return nextMonthDate.getDate();
}

export function getCurrentMonthDateCells(year: number, month: number): DateCell[] {
  const dateCells: DateCell[] = [];

  const amountOfDays = getDaysAmountInAMonth(year, month);

  for (let i = 1; i <= amountOfDays; i++) {
    dateCells.push({
      year,
      month,
      date: i,
      type: 'current',
    });
  }

  return dateCells;
}
export function getPrevMonthDateCells(year: number, month: number): DateCell[] {
  const currentMonthFirstDay = new Date(year, month, 1);
  const prevMonthDateCellsAmount = getDayOfTheWeek(currentMonthFirstDay);

  const amountOfDaysInPrevMonth = getDaysAmountInAMonth(year, month - 1);

  const dateCells: DateCell[] = [];

  const [cellYear, cellMonth] = month === 0 ? [year - 1, 11] : [year, month - 1];

  for (let i = prevMonthDateCellsAmount - 1; i >= 0; i--) {
    dateCells.push({
      year: cellYear,
      month: cellMonth,
      date: amountOfDaysInPrevMonth - i,
      type: 'prev',
    });
  }

  return dateCells;
}

export function getNextMonthDateCells(year: number, month: number): DateCell[] {
  const currentMonthFirstDay = new Date(year, month, 1);
  const prevMonthDaysAmount = getDayOfTheWeek(currentMonthFirstDay);

  const daysAmount = getDaysAmountInAMonth(year, month);

  const dateCells: DateCell[] = [];

  const [cellYear, cellMonth] = month === 11 ? [year + 1, 0] : [year, month + 1];

  const nextMonthDaysAmount = VISIBLE_CELLS_AMOUNT - daysAmount - prevMonthDaysAmount;

  for (let i = 1; i <= nextMonthDaysAmount; i++) {
    dateCells.push({ year: cellYear, month: cellMonth, date: i, type: 'next' });
  }

  return dateCells;
}

const validValueRegex = /^\d{2}-\d{2}-\d{4}$/;

export function isValidDateString(value: string) {
  if (!validValueRegex.test(value)) return false;

  const [date, month, year] = value.split('-').map((v) => parseInt(v, 10));

  if (month < 1 || month > 12 || date < 1) return false;

  const maxDaysInAMonth = getDaysAmountInAMonth(year, month - 1);

  if (date > maxDaysInAMonth) return false;

  return true;
}

export function addLeadingZeroIfNeeded(value) {
  if (value > 9) return value;
  return `0${value}`;
}

export function getInputValueFromDate(value) {
  const year = value.getFullYear();
  const month = addLeadingZeroIfNeeded(value.getMonth() + 1);
  const date = addLeadingZeroIfNeeded(value.getDate());

  return `${date}-${month}-${year}`;
}

export function getDateFromInputValue(inputValue: string) {
  if (!isValidDateString(inputValue)) {
    return;
  }

  const [date, month, year] = inputValue.split('-').map((v) => parseInt(v, 10));

  const dateObj = new Date(year, month - 1, date);

  return dateObj;
}
