import s from './styles.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(s);

import { useState, useMemo, useLayoutEffect } from 'react';

import {
  DateCell,
  daysOfTheWeek,
  getCurrentMonthDateCells,
  getDateFromCell,
  getNextMonthDateCells,
  getPrevMonthDateCells,
  isDateInRange,
  isTodayCell,
  months,
} from '../utils';

interface PopupContentProps {
  selectedValue: Date;
  inputValueDate: Date;
  min?: Date;
  max?: Date;
  onChange: (value: Date) => void;
}

export function Popup(props: PopupContentProps) {
  const { selectedValue, inputValueDate, onChange, min, max } = props;

  const [panelYear, setPanelYear] = useState(() => selectedValue.getFullYear());
  const [panelMonth, setPanelMonth] = useState(() => selectedValue.getMonth());

  useLayoutEffect(() => {
    if (!inputValueDate) return;

    const year = inputValueDate.getFullYear();
    const month = inputValueDate.getMonth();

    setPanelMonth(month);
    setPanelYear(year);
  }, [inputValueDate]);

  const [year, month, date] = useMemo(() => {
    const currentYear = selectedValue.getFullYear();
    const currentDay = selectedValue.getDate();
    const currentMonth = selectedValue.getMonth();

    return [currentYear, currentMonth, currentDay];
  }, [selectedValue]);

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

  function onDateSelect(cellValue: DateCell) {
    const value = new Date(cellValue.year, cellValue.month, cellValue.date);

    onChange(value);
  }

  function nextYear() {
    setPanelYear((year) => year + 1);
  }
  function nextMonth() {
    if (panelMonth === 11) {
      setPanelYear((year) => year + 1);
      setPanelMonth(0);
    } else {
      setPanelMonth((month) => month + 1);
    }
  }

  function prevYear() {
    setPanelYear((year) => year - 1);
  }
  function prevMonth() {
    if (panelMonth === 0) {
      setPanelMonth(11);
      setPanelYear((year) => year - 1);
    } else {
      setPanelMonth((month) => month - 1);
    }
  }

  return (
    <>
      <div>
        <div>
          {months[panelMonth]} {panelYear}
        </div>
        <div className={s['control-section']}>
          <button onClick={prevYear}>prevYear</button>
          <button onClick={prevMonth}>prevMonth</button>
          <button onClick={nextMonth}>nextMonth</button>
          <button onClick={nextYear}>nextYear</button>
        </div>
        <div className={s['date-cells']}>
          {daysOfTheWeek.map((weekDay) => (
            <div key={weekDay} className={s['date-cells__item']}>
              {weekDay}
            </div>
          ))}
          {dateCells.map((cell) => {
            const isSelectedDate =
              cell.year === year && cell.month === month && cell.date === date;
            const isTodayDate = isTodayCell(cell);
            const isInRange = isDateInRange(getDateFromCell(cell), min, max);

            return (
              <div
                key={`${cell.year}-${cell.month}-${cell.date}`}
                className={cx(s['date-cells__item'], {
                  date: true,
                  selected: isSelectedDate,
                  today: isTodayDate,
                  isNotInRange: !isInRange,
                  [cell.type]: !!cell.type,
                })}
                onClick={() => isInRange && onDateSelect(cell)}
              >
                {cell.date}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
