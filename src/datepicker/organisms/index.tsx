import { useMemo, useState, useRef, useEffect, useLayoutEffect } from 'react';
import s from './styles.module.scss';
import classNames from 'classnames/bind';
import {
  addLeadingZeroIfNeeded,
  DateCell,
  daysOfTheWeek,
  getCurrentMonthDateCells,
  getDateFromInputValue,
  getDaysAmountInAMonth,
  getInputValueFromDate,
  getNextMonthDateCells,
  getPrevMonthDateCells,
  isValidDateString,
  months,
} from '../utils';
const cx = classNames.bind(s);

interface DatepickerProps {
  value: Date;
  onChange: (value: Date) => void;
  min?: Date;
  max?: Date;
}

function useLatest<T>(value: T) {
  const valueRef = useRef(value);

  useLayoutEffect(() => {
    valueRef.current = value;
  }, [value]);
  return valueRef;
}

function isToday(cell: DateCell) {
  const today = new Date();
  const isTodayDate =
    today.getMonth() === cell.month &&
    today.getFullYear() === cell.year &&
    today.getDate() === cell.date;
  return isTodayDate;
}

export function Datepicker(props: DatepickerProps) {
  const { value, onChange, min, max } = props;

  const [showPopup, setShowPopup] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const latestInputValue = useLatest(inputValue);
  const latestValue = useLatest(value);

  const elementRef = useRef<HTMLDivElement>(null);
  function onInputClick() {
    setShowPopup(true);
  }

  function handleChange(value: Date) {
    onChange(value);
    setShowPopup(false);
  }

  const inputValueDate = useMemo(() => {
    return getDateFromInputValue(inputValue);
  }, [inputValue]);

  function onBlur(): void {}

  function onKeyDown(e) {
    if (e.key !== 'Enter') return;
    const date = getDateFromInputValue(inputValue);

    if (!date) {
      setInputValue(getInputValueFromDate(value));
    } else {
      handleChange(date);
    }
    setShowPopup(false);
  }

  function onInputChange(e) {
    setInputValue(e.target.value.trim());
  }

  useLayoutEffect(() => {
    const inputValue = getInputValueFromDate(value);
    setInputValue(inputValue);
  }, [value]);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    function onDocumentClick(e: MouseEvent) {
      const target = e.target;
      if (!(target instanceof Node)) return;

      if (element.contains(target)) return;

      const dateFromInputValue = getDateFromInputValue(latestInputValue.current);
      if (dateFromInputValue) {
        onChange(dateFromInputValue);
      } else {
        setInputValue(getInputValueFromDate(latestValue.current));
      }
      setShowPopup(false);
    }

    document.addEventListener('click', onDocumentClick);

    return () => document.removeEventListener('click', onDocumentClick);
  }, [latestInputValue, latestValue]);

  return (
    <>
      <div ref={elementRef} style={{ width: 'fit-content', position: 'relative' }}>
        <input
          type={'text'}
          onClick={onInputClick}
          value={inputValue}
          onChange={onInputChange}
          // onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
        <div style={{ position: 'absolute', left: 0, top: '100%' }}>
          {showPopup && (
            <DatepickerPopupContent
              selectedValue={value}
              inputValueDate={inputValueDate}
              onChange={handleChange}
              min={min}
              max={max}
            />
          )}
        </div>
      </div>
    </>
  );
}

interface DatePickerPopupContentProps {
  selectedValue: Date;
  inputValueDate: Date;
  min?: Date;
  max?: Date;
  onChange: (value: Date) => void;
}

function DatepickerPopupContent(props: DatePickerPopupContentProps) {
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
            const isTodayDate = isToday(cell);
            return (
              <div
                key={`${cell.year}-${cell.month}-${cell.date}`}
                className={cx(s['date-cells__item'], {
                  date: true,
                  selected: isSelectedDate,
                  today: isTodayDate,
                  [cell.type]: !!cell.type,
                })}
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
