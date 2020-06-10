import React, { useCallback, useState } from 'react';
import {
  Container,
  FormGroup,
  FormLabel,
  TextField,
  Button,
  IconButton,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { ArrowBack } from '@material-ui/icons';

import api from '../../services/api';
import DatePicker from '../../components/DatePicker';
import useStyles from './styles';

const StorePatient: React.FC = () => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(Date.now()),
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        await api.post('/', {
          name,
          phone,
          address,
          birthdate: selectedDate,
          cpf,
        });
        setAddress('');
        setPhone('');
        setCpf('');
        setName('');
      } catch (err) {
        console.log(err);
      }
    },
    [name, phone, address, selectedDate, cpf],
  );

  const handleAddress = useCallback((event) => {
    setAddress(event.target.value);
  }, []);

  const handlePhone = useCallback((event) => {
    const onlyNums = event.target.value.replace(/[^0-9]/g, '');
    let formatedNumber;
    if (onlyNums.length < 12) {
      if (onlyNums.length === 10) {
        formatedNumber = onlyNums.replace(
          /(\d{2})(\d{4})(\d{4})/,
          '($1) $2-$3',
        );
      } else if (onlyNums.length === 11) {
        formatedNumber = onlyNums.replace(
          /(\d{2})(\d{5})(\d{4})/,
          '($1) $2-$3',
        );
      }
      setPhone(formatedNumber);
    }
  }, []);

  const handleCpf = useCallback((event) => {
    const onlyNums = event.target.value.replace(/[^0-9]/g, '');
    if (onlyNums.length < 12) {
      setCpf(onlyNums);
    }
  }, []);

  return (
    <Container className={classes.container}>
      <div className={classes.background} />
      <Container className={classes.formContainer}>
        <div>
          <Link to="/">
            <IconButton
              aria-label="arrow back"
              size="medium"
              style={{
                background: '#4024ffa4',
                marginTop: 16,
              }}
            >
              <ArrowBack />
            </IconButton>
          </Link>
        </div>
        <form className={classes.formControl} onSubmit={handleSubmit}>
          <FormGroup className={classes.formGroup}>
            <FormLabel className={classes.formLabel}>Novo Paciente</FormLabel>
            <TextField
              id="name"
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              className={classes.textField}
            />
            <TextField
              id="cpf"
              label="CPF"
              value={cpf}
              onChange={handleCpf}
              variant="outlined"
              className={classes.textField}
              helperText="Apenas Números"
            />
            <TextField
              id="address"
              label="Endereço"
              multiline
              value={address}
              onChange={handleAddress}
              variant="outlined"
              className={classes.textField}
            />
            <TextField
              id="phone"
              label="Telefone"
              value={phone}
              onChange={handlePhone}
              variant="outlined"
              className={classes.textField}
              helperText="Apenas Números"
            />
            <DatePicker
              initialDate={selectedDate}
              label="Data de nascimento"
              saveDate={setSelectedDate}
            />
            <Button
              type="submit"
              variant="contained"
              className={classes.buttonStore}
            >
              Cadastrar
            </Button>
          </FormGroup>
        </form>
      </Container>
    </Container>
  );
};

export default StorePatient;
