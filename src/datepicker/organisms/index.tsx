import { useMemo, useState } from 'react';
import s from './styles.module.scss';
interface DatepickerProps {
  value: Date;
  onChange: (value: Date) => void;
  min?: Date;
  max?: Date;
}

const months = [
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

interface DateCell {
  year: number;
  month: number;
  date: number;

  isToday?: boolean;
  isSelected?: boolean;
}

function getDaysAmountInAMonth(year: number, month: number) {
  const nextMonthDate = new Date(year, month + 1, 1);
  nextMonthDate.setMinutes(-1);
  return nextMonthDate.getDate();
}

function getCurrentMonthDateCells(year: number, month: number): DateCell[] {
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
function getPrevMonthDateCells(year: number, month: number): DateCell[] {
  const currentMonthFirstDay = new Date(year, month, 1);
  const dayOfTheWeek = currentMonthFirstDay.getDay();
  const prevMonthDateCellsAmount = dayOfTheWeek - 1;

  const amountOfDaysInPrevMonth = getDaysAmountInAMonth(year, month - 1);

  const dateCells: DateCell[] = [];

  const [cellYear, cellMonth] = month === 0 ? [year - 1, 11] : [year, month - 1];

  for (let i = 0; i < prevMonthDateCellsAmount; i++) {
    dateCells.push({
      year: cellYear,
      month: cellMonth,
      date: amountOfDaysInPrevMonth - i,
    });
  }

  return dateCells;
}
const VISIBLE_CELLS_AMOUNT = 7 * 6;
function getNextMonthDateCells(year: number, month: number): DateCell[] {
  //TODO - copy paste
  const currentMonthFirstDay = new Date(year, month, 1);
  const dayOfTheWeek = currentMonthFirstDay.getDay();
  const prevMonthDaysAmount = dayOfTheWeek - 1;
  //TODO - end copy paste

  const daysAmount = getDaysAmountInAMonth(year, month);

  const dateCells: DateCell[] = [];

  const [cellYear, cellMonth] = month === 11 ? [year + 1, 0] : [year, month + 1];

  const nextMonthDaysAmount = VISIBLE_CELLS_AMOUNT - daysAmount - prevMonthDaysAmount;

  for (let i = 1; i <= nextMonthDaysAmount; i++) {
    dateCells.push({ year: cellYear, month: cellMonth, date: i });
  }

  return dateCells;
}
export function Datepicker(props: DatepickerProps) {
  const { value, onChange, min, max } = props;

  const [panelYear] = useState(() => value.getFullYear());
  const [panelMonth] = useState(() => value.getMonth());

  const [year, month, day] = useMemo(() => {
    const currentYear = value.getFullYear();
    const currentDay = value.getDate();
    const currentMonth = months[value.getMonth()];

    return [currentYear, currentMonth, currentDay];
  }, [value]);

  const dateCells: DateCell[] = useMemo(() => {
    const prevMonthDateCells = getPrevMonthDateCells(panelYear, panelMonth);
    const currentMonthDateCells = getCurrentMonthDateCells(panelYear, panelMonth);
    const nextMonthDateCells = getNextMonthDateCells(panelYear, panelMonth);

    const cells = [
      ...prevMonthDateCells,
      ...currentMonthDateCells,
      ...nextMonthDateCells,
    ];

    return cells;
  }, [panelYear, panelMonth]);

  function nextYear() {}
  function nextMonth() {}

  function prevYear() {}
  function prevMonth() {}

  return (
    <>
      <div>
        <div>
          {year} {month} {day}
        </div>
        <div className={s['date-cells']}>
          {dateCells.map((cell) => (
            <div className={s['date-cells__item']}>{cell.date}</div>
          ))}
        </div>
      </div>
    </>
  );
}
