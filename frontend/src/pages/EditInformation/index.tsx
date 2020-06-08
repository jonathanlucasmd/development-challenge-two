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
import { DropzoneDialog } from 'material-ui-dropzone';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import useStyles from './styles';
import api from '../../services/api';

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
  age: number;
  informations: IInformations[];
}

const EditInformation: React.FC = () => {
  const { params } = useRouteMatch<PatientParams>();

  const classes = useStyles();
  const [age, setAge] = useState('');
  const [name, setName] = useState('');
  const [doctor, setDoctor] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(Date.now()),
  );

  useEffect(() => {
    const storagedPatients = localStorage.getItem('@Medcloud:patients');
    if (storagedPatients) {
      const patients = JSON.parse(storagedPatients);
      if (patients) {
        const patient = patients.find(
          (storagedPatient: IData) => storagedPatient.id === params.id,
        );
        setName(patient.name);
        setAge(patient.age);
      }
    }
  }, [params]);

  const handleAge = useCallback((event) => {
    const onlyNums = event.target.value.replace(/[^0-9]/g, '');
    if (onlyNums.length < 10) {
      setAge(onlyNums);
    }
  }, []);

  const handleSave = useCallback(
    (uploadedFiles): void => {
      setOpen(!open);
      setFiles(uploadedFiles);
    },
    [open],
  );
  const handleModal = useCallback((): void => {
    setOpen(!open);
  }, [open]);

  const handleDateChange = useCallback((date: Date | null) => {
    setSelectedDate(date);
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

      const response = await api.post(`/exam/${params.id}`, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });
      setFiles([]);
      setDoctor('');
      setDescription('');

      console.log(response);
    },
    [params, files, selectedDate, description, doctor],
  );

  const handleUpdate = useCallback(
    async (event) => {
      event.preventDefault();
      const response = await api.put(`/${params.id}`, { name, age });
      console.log(response);
      if (response.status === 200) {
        const storagedPatients = localStorage.getItem('@Medcloud:patients');
        if (storagedPatients) {
          const patients = JSON.parse(storagedPatients);
          const index = patients.findIndex(
            (patient: IData) => patient.id === params.id,
          );
          patients[index].name = name;
          patients[index].age = age;
          localStorage.setItem('@Medcloud:patients', JSON.stringify(patients));
        }
      }
    },
    [name, age, params],
  );

  return (
    <Container className={classes.container}>
      <Container className={classes.background}>
        <form className={classes.formControl}>
          <FormGroup>
            <FormLabel className={classes.formLabel}>Dados Básicos</FormLabel>
            <TextField
              id="name"
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              className={classes.textField}
              inputProps={{ color: '#fff' }}
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
              className={classes.buttonSave}
              onClick={handleUpdate}
            >
              Salvar
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
              }}
            >
              <ArrowBack />
            </IconButton>
          </Link>
        </div>
        <form className={classes.formControl}>
          <FormGroup>
            <FormLabel>Anexar Exame</FormLabel>

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

            <TextField
              id="doctor"
              label="Médico"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              variant="outlined"
              className={classes.textFieldAnnex}
            />
            <TextField
              id="description"
              label="Descrição"
              value={description}
              multiline
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              className={classes.textFieldAnnex}
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
            />

            <div>
              <Button onClick={handleModal}>Anexar arquivo</Button>
              <DropzoneDialog
                fileObjects={[]}
                open={open}
                onSave={handleSave}
                acceptedFiles={[
                  // 'application/pdf',
                  'image/jpg',
                  'image/jpeg',
                  'image/png',
                ]}
                showPreviews
                maxFileSize={5000000}
                filesLimit={1}
                onClose={handleModal}
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              className={classes.buttonStore}
              onClick={handleAddNewAnnex}
            >
              Registrar
            </Button>
          </FormGroup>
        </form>
      </Container>
    </Container>
  );
};
export default EditInformation;
