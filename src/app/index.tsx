import { Datepicker } from '../datepicker';
import { useState } from 'react';
export function App() {
  const [date, setDate] = useState(new Date());

  console.log({ date });

  return <Datepicker value={date} onChange={setDate} />;
}
