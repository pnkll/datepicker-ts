import { Datepicker } from '../datepicker';
import { useState } from 'react';
export function App() {
  const [date, setDate] = useState(new Date());

  return <Datepicker value={date} onChange={setDate} />;
}
