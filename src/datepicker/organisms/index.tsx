import { useMemo, useState, useRef, useEffect, useLayoutEffect } from 'react';
import s from './styles.module.scss';
import classNames from 'classnames/bind';
import {
  DateCell,
  daysOfTheWeek,
  getCurrentMonthDateCells,
  getDaysAmountInAMonth,
  getNextMonthDateCells,
  getPrevMonthDateCells,
  months,
} from '../utils';
const cx = classNames.bind(s);

interface DatepickerProps {
  value: Date;
  onChange: (value: Date) => void;
  min?: Date;
  max?: Date;
}

const validValueRegex = /^\d{2}-\d{2}-\d{4}$/;

function isValidDateString(value: string) {
  if (!validValueRegex.test(value)) return false;

  const [date, month, year] = value.split('-').map((v) => parseInt(v, 10));

  if (month < 1 || month > 12 || date < 1) return false;

  const maxDaysInAMonth = getDaysAmountInAMonth(year, month - 1);

  if (date > maxDaysInAMonth) return false;

  return true;
}

export function Datepicker(props: DatepickerProps) {
  const { value, onChange, min, max } = props;

  const [showPopup, setShowPopup] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const elementRef = useRef<HTMLDivElement>(null);
  function onFocus() {
    setShowPopup(true);
  }

  function onBlur() {
    if (!isValidDateString(inputValue)) {
      // TODO - copy paste
      const year = value.getFullYear();
      const monthValue = value.getMonth() + 1;
      const month = monthValue < 10 ? `0${monthValue}` : monthValue;
      const dateValue = value.getDate();
      const date = dateValue < 10 ? `0${dateValue}` : dateValue;
      // TODO - end copy paste
      setInputValue(`${date}-${month}-${year}`);
      return;
    }

    const [date, month, year] = inputValue.split('-').map((v) => parseInt(v, 10));

    const dateObj = new Date(year, month - 1, date);

    onChange(dateObj);
  }

  function onInputChange(e) {
    setInputValue(e.target.value.trim());
  }

  useLayoutEffect(() => {
    const year = value.getFullYear();
    const monthValue = value.getMonth() + 1;
    const month = monthValue < 10 ? `0${monthValue}` : monthValue;
    const dateValue = value.getDate();
    const date = dateValue < 10 ? `0${dateValue}` : dateValue;

    setInputValue(`${date}-${month}-${year}`);
  }, [value]);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    function onDocumentClick(e: MouseEvent) {
      const target = e.target;
      if (!(target instanceof Node)) return;

      if (element.contains(target)) return;

      setShowPopup(false);
    }

    document.addEventListener('click', onDocumentClick);

    return () => document.removeEventListener('click', onDocumentClick);
  }, []);

  return (
    <>
      <div ref={elementRef} style={{ width: 'fit-content', position: 'relative' }}>
        <input
          type={'text'}
          onFocus={onFocus}
          value={inputValue}
          onChange={onInputChange}
          onBlur={onBlur}
        />
        <div style={{ position: 'absolute', left: 0, top: '100%' }}>
          {showPopup && (
            <DatepickerPopupContent
              value={value}
              onChange={onChange}
              min={min}
              max={max}
            />
          )}
        </div>
      </div>
    </>
  );
}

function DatepickerPopupContent(props: DatepickerProps) {
  const { value, onChange, min, max } = props;

  const [panelYear, setPanelYear] = useState(() => value.getFullYear());
  const [panelMonth, setPanelMonth] = useState(() => value.getMonth());

  const [year, month, date] = useMemo(() => {
    const currentYear = value.getFullYear();
    const currentDay = value.getDate();
    const currentMonth = value.getMonth();

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
            return (
              <div
                key={`${cell.year}-${cell.month}-${cell.date}`}
                className={cx(s['date-cells__item'], { selected: isSelectedDate })}
                onClick={() => onDateSelect(cell)}
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
