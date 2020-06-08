import React, { useCallback, useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const DatePickers: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(Date.now()),
  );

  const handleDateChange = useCallback((date: Date | null) => {
    setSelectedDate(date);
  }, []);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        margin="normal"
        format="dd/MM/yyyy"
        id="date-picker-inline"
        label="Data do exame"
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DatePickers;
