import React, { useCallback, useState, useEffect } from 'react';
import { AppBar, Typography, Container, Button } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import Table from './ColapsedTable';
import api from '../../services/api';

const useStyles = makeStyles(() =>
  createStyles({
    appbar: {
      background: '#3700B3',
      display: 'flex',
      alignItems: 'center',
      padding: '8px',
    },
    gridContainer: {
      width: '100%',
      margin: 0,
      padding: 0,
      outline: 0,
      alignItems: 'center',
    },
    footerButtom: {
      bottom: 0,
      padding: '10px 0',
      position: 'fixed',
      marginLeft: '3%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ffffff',
    },
  }),
);

interface IData {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  address: string;
  birthdate: string;
  exams: IExam[];
}

interface IExam {
  id: string;
  date: string;
  doctor: string;
  description: number;
  annex: string | null;
}

const ListPatients: React.FC = () => {
  const classes = useStyles();

  const [patients, setPatients] = useState<IData[]>((): IData[] => {
    const storagedPatients = localStorage.getItem('@Medcloud:patients');

    if (storagedPatients) {
      return JSON.parse(storagedPatients);
    }
    return [] as IData[];
  });

  const handleDelete = useCallback(
    ({ id }) => {
      api.delete(`/${id}`);
      const index = patients.findIndex((patient) => patient.id === id);
      patients.splice(index, 1);
      setPatients([...patients]);
    },
    [patients],
  );
  const handleDeleteExam = useCallback(
    async ({ patientId, examId }) => {
      api.delete(`/exam/?patient=${patientId}&exam=${examId}`);

      const patientIndex = patients.findIndex(
        (patient) => patient.id === patientId,
      );
      const examIndex = patients[patientIndex].exams.findIndex(
        (exam) => exam.id === examId,
      );

      patients[patientIndex].exams.splice(examIndex, 1);
      setPatients([...patients]);
    },
    [patients],
  );

  useEffect((): void => {
    api.get('/').then((response) => {
      if (response.status === 200) {
        setPatients(response.data);
      }
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('@Medcloud:patients', JSON.stringify(patients));
  }, [patients]);

  return (
    <>
      <AppBar position="fixed" className={classes.appbar}>
        <Typography variant="h4">MedCloud Challenge</Typography>
      </AppBar>
      <Container
        style={{
          padding: 16,
          marginTop: '90px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Table
          handleDelete={handleDelete}
          handleDeleteExam={handleDeleteExam}
          patients={patients}
        />
      </Container>
      <Container className={classes.footerButtom}>
        <NavLink to="/newpatient">
          <Button variant="contained" color="primary" size="large">
            Adicionar
          </Button>
        </NavLink>
      </Container>
    </>
  );
};

export default ListPatients;
