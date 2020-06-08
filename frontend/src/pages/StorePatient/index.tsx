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
import useStyles from './styles';

const StoreInformation: React.FC = () => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [cpf, setCpf] = useState('');

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        const response = await api.post('/', { name, age, cpf });
        setAge('');
        setCpf('');
        setName('');
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    },
    [age, cpf, name],
  );

  const handleAge = useCallback((event) => {
    const onlyNums = event.target.value.replace(/[^0-9]/g, '');
    if (onlyNums.length < 10) {
      setAge(onlyNums);
    }
  }, []);

  const handleCpf = useCallback((event) => {
    const onlyNums = event.target.value.replace(/[^0-9]/g, '');
    if (onlyNums.length < 10) {
      setCpf(onlyNums);
    } else if (onlyNums.length === 10) {
      const number = onlyNums.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      setCpf(number);
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
              id="age"
              label="Idade"
              value={age}
              onChange={handleAge}
              variant="outlined"
              className={classes.textField}
              helperText="Apenas Números"
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

export default StoreInformation;
