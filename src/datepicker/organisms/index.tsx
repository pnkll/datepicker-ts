import s from './styles.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(s);

import { useMemo, useState, useRef, useEffect, useLayoutEffect } from 'react';

import {
  getDateFromInputValue,
  getInputValueFromDate,
  isDateInRange,
} from '../utils';
import { Popup } from './popup';

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

/* TODO -
  set value by isinrange - [done]
  highlight input wrong value - [done]
  style -
 */

export function Datepicker(props: DatepickerProps) {
  const { value, onChange, min, max } = props;

  const [showPopup, setShowPopup] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const latestUpdateValueFromInput = useLatest(updateValueOnPopupCloseAction);

  const elementRef = useRef<HTMLDivElement>(null);

  function updateValueOnPopupCloseAction() {
    setShowPopup(false);
    const date = getDateFromInputValue(inputValue);
    if (!date) setInputValue(getInputValueFromDate(value));

    if (!isDateInRange(date, min, max)) return;

    onChange(date);
  }
  function onInputClick() {
    setShowPopup(true);
  }

  function handleChange(value: Date) {
    onChange(value);
    setShowPopup(false);
  }

  const [inputValueDate, isValidInputValue] = useMemo(() => {
    const date = getDateFromInputValue(inputValue);

    if (!date) return [undefined, false];

    return [date, isDateInRange(date, min, max)];
  }, [inputValue]);

  function onBlur(): void {}

  function onKeyDown(e) {
    if (e.key !== 'Enter') return;

    updateValueOnPopupCloseAction();
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

      latestUpdateValueFromInput.current();
    }

    document.addEventListener('click', onDocumentClick);

    return () => document.removeEventListener('click', onDocumentClick);
  }, [latestUpdateValueFromInput]);

  return (
    <>
      <div ref={elementRef} style={{ width: 'fit-content', position: 'relative' }}>
        <input
          className={cx(s.input, { unvalid: !isValidInputValue })}
          type={'text'}
          onClick={onInputClick}
          value={inputValue}
          onChange={onInputChange}
          // onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
        <div style={{ position: 'absolute', left: 0, top: '100%' }}>
          {showPopup && (
            <Popup
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
