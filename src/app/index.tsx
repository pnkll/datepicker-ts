import { Datepicker } from '../datepicker';
import { useState } from 'react';
export function App() {
  const [date, setDate] = useState(new Date());

  console.log({ date });

  return (
    <Datepicker
      value={date}
      onChange={setDate}
      min={new Date(2023, 5, 8)}
      max={new Date(2023, 9, 4)}
    />
  );
}
