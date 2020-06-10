import React, { useCallback, useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

interface IProps {
  saveDate: React.Dispatch<React.SetStateAction<Date | null>>;
  label: string;
  initialDate: Date | null;
}

const DatePickers: React.FC<IProps> = ({
  saveDate,
  initialDate,
  ...rest
}: IProps) => {
  const handleDateChange = useCallback(
    (date: Date | null) => {
      saveDate(date);
    },
    [saveDate],
  );

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        margin="normal"
        format="dd/MM/yyyy"
        id="date-picker-inline"
        value={initialDate}
        {...rest}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DatePickers;
