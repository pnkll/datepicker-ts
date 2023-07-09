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
    dateCells.push({ year: cellYear, month: cellMonth, date: i });
  }

  return dateCells;
}
