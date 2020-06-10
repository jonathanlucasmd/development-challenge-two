import React, { useCallback, useState, useEffect } from 'react';
import {
  Container,
  FormGroup,
  FormLabel,
  TextField,
  Button,
  IconButton,
} from '@material-ui/core';
import { Link, useRouteMatch } from 'react-router-dom';
import { ArrowBack } from '@material-ui/icons';

import useStyles from './styles';
import api from '../../services/api';
import DropZoneModal from '../../components/DropZoneModal';
import DatePicker from '../../components/DatePicker';

interface PatientParams {
  id: string;
}

interface IInformations {
  date: string;
  doctor: string;
  description: number;
  annex: string | null;
}

interface IData {
  id: string;
  name: string;
  cpf: string;
  address: number;
  phone: string;
  informations: IInformations[];
}

const EditInformation: React.FC = () => {
  const { params } = useRouteMatch<PatientParams>();

  const classes = useStyles();
  const [cpf, setCpf] = useState('');
  const [name, setName] = useState('');
  const [doctor, setDoctor] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(Date.now()),
  );
  const [birthdate, setBirthdate] = useState<Date | null>(new Date(Date.now()));

  useEffect(() => {
    const storagedPatients = localStorage.getItem('@Medcloud:patients');
    if (storagedPatients) {
      const patients = JSON.parse(storagedPatients);
      if (patients) {
        const patient = patients.find(
          (storagedPatient: IData) => storagedPatient.id === params.id,
        );
        setName(patient.name);
        setCpf(patient.cpf);
        setAddress(patient.address);
        setPhone(patient.phone);
        setBirthdate(new Date(patient.birthdate));
      }
    }
  }, [params]);

  const handleCpf = useCallback((event) => {
    const onlyNums = event.target.value.replace(/[^0-9]/g, '');
    if (onlyNums.length < 12) {
      setCpf(onlyNums);
    }
  }, []);

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

  const handleSave = useCallback((uploadedFiles): void => {
    setFiles(uploadedFiles);
  }, []);

  const handleAddNewAnnex = useCallback(
    async (event) => {
      event.preventDefault();
      const formData = new FormData();
      formData.append('annex', files[0]);
      formData.append(
        'form',
        JSON.stringify({ doctor, date: selectedDate, description }),
      );

      await api.post(`/exam/${params.id}`, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });
      setFiles([]);
      setDoctor('');
      setDescription('');
    },
    [params, files, selectedDate, description, doctor],
  );

  const handleUpdate = useCallback(
    async (event) => {
      event.preventDefault();
      const response = await api.put(`/${params.id}`, {
        name,
        cpf,
        address,
        birthdate,
        phone,
      });
      if (response.status === 200) {
        const storagedPatients = localStorage.getItem('@Medcloud:patients');
        if (storagedPatients) {
          const patients = JSON.parse(storagedPatients);
          const index = patients.findIndex(
            (patient: IData) => patient.id === params.id,
          );
          patients[index].name = name;
          patients[index].cpf = cpf;
          patients[index].address = address;
          patients[index].phone = phone;
          patients[index].birthdate = birthdate;

          localStorage.setItem('@Medcloud:patients', JSON.stringify(patients));
        }
      }
    },
    [name, cpf, address, birthdate, phone, params],
  );

  return (
    <Container className={classes.container}>
      <Container className={classes.background}>
        <form className={classes.formControl}>
          <FormGroup>
            <FormLabel className={classes.formLabel}>Anexar Exame</FormLabel>
            <DatePicker
              initialDate={selectedDate}
              label="Data do exame"
              saveDate={setSelectedDate}
            />
            <TextField
              id="doctor"
              label="Médico"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              variant="outlined"
              className={classes.textField}
              inputProps={{ color: '#fff' }}
            />
            <TextField
              id="description"
              label="Descrição"
              value={description}
              multiline
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              className={classes.textField}
              inputProps={{ color: '#fff' }}
            />
            <TextField
              id="filename"
              disabled
              value={
                files[0]
                  ? files[0].name
                  : 'Você pode anexar arquivos png/jpg/jpeg'
              }
              label="Arquivo"
              className={classes.textField}
              inputProps={{ color: '#fff' }}
            />
            <DropZoneModal onSave={handleSave} />
            <Button
              type="submit"
              variant="contained"
              className={classes.buttonSave}
              onClick={handleAddNewAnnex}
            >
              Registrar
            </Button>
          </FormGroup>
        </form>
      </Container>
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
        <form className={classes.formControl}>
          <FormGroup>
            <FormLabel className={classes.formLabel}>Dados Básicos</FormLabel>
            <TextField
              id="name"
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              className={classes.textFieldAnnex}
            />
            <TextField
              id="cpf"
              label="CPF"
              value={cpf}
              onChange={handleCpf}
              variant="outlined"
              className={classes.textFieldAnnex}
              helperText="Apenas Números"
            />
            <TextField
              id="address"
              label="Endereço"
              multiline
              value={address}
              onChange={handleAddress}
              variant="outlined"
              className={classes.textFieldAnnex}
            />
            <TextField
              id="phone"
              label="Telefone"
              value={phone}
              onChange={handlePhone}
              variant="outlined"
              className={classes.textFieldAnnex}
              helperText="Apenas Números"
            />
            <DatePicker
              initialDate={birthdate}
              label="Data de nascimento"
              saveDate={setBirthdate}
            />
            <Button
              type="submit"
              variant="contained"
              className={classes.buttonStore}
              onClick={handleUpdate}
            >
              Salvar
            </Button>
          </FormGroup>
        </form>
      </Container>
    </Container>
  );
};
export default EditInformation;
