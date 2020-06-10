import React, { useCallback } from 'react';
import {
  Box,
  Button,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Collapse,
  IconButton,
  Table,
} from '@material-ui/core';

import { CloudDownload, Delete, Edit } from '@material-ui/icons';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import api from '../../../services/api';

import useRowStyles from './styles';

interface IExam {
  id: string;
  date: string;
  doctor: string;
  description: number;
  annex: string | null;
}

interface IData {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  address: string;
  birthdate: string;
  exams: IExam[];
}

interface IProps {
  handleDelete: VoidFunction;
  handleDeleteExam({
    patientId,
    examId,
  }: {
    patientId: string;
    examId: string;
  }): void;
  patient: IData;
}

const Row: React.FC<IProps> = ({
  handleDelete,
  handleDeleteExam,
  patient,
}: IProps) => {
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  const handleDownload = useCallback(async ({ filename }) => {
    const response = await api.get(`/annex/${filename}`);
    if (response.status === 200) {
      window.open(response.data.url, 'Download');
    }
  }, []);

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {patient.name}
        </TableCell>
        <TableCell>{patient.cpf}</TableCell>
        <TableCell>
          {format(Date.parse(patient.birthdate), 'dd/MM/yyyy')}
        </TableCell>
        <TableCell>{patient.phone}</TableCell>
        <TableCell align="right">
          <Link key={patient.id} to={`/edit/${patient.id}`}>
            <Button
              variant="outlined"
              className={classes.editButton}
              endIcon={<Edit />}
            >
              Editar
            </Button>
          </Link>
        </TableCell>
        <TableCell align="right">
          <Button
            variant="outlined"
            className={classes.deleteButton}
            endIcon={<Delete />}
            onClick={handleDelete}
          >
            Deletar
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Exames
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Medico</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell align="right">Baixar Exame</TableCell>
                    <TableCell align="right">Deletar Exame</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patient.exams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell component="th" scope="row">
                        {format(Date.parse(exam.date), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>{exam.doctor}</TableCell>
                      <TableCell>{exam.description}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          startIcon={<CloudDownload />}
                          disabled={!exam.annex}
                          onClick={(event) => {
                            event.preventDefault();
                            handleDownload({ filename: exam.annex });
                          }}
                        >
                          Exame
                        </Button>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          className={classes.deleteButton}
                          endIcon={<Delete />}
                          onClick={(event) => {
                            event.preventDefault();
                            handleDeleteExam({
                              patientId: patient.id,
                              examId: exam.id,
                            });
                          }}
                        >
                          Deletar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

interface IPropsTable {
  handleDelete({ id }: { id: string }): void;
  handleDeleteExam({
    patientId,
    examId,
  }: {
    patientId: string;
    examId: string;
  }): void;
  patients: IData[];
}

const CollapsibleTable: React.FC<IPropsTable> = ({
  handleDelete,
  handleDeleteExam,
  patients,
}: IPropsTable) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell>CPF</TableCell>
            <TableCell>Nascimento</TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell align="right" />
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <Row
              key={patient.id}
              handleDelete={() => {
                handleDelete({ id: patient.id });
              }}
              handleDeleteExam={handleDeleteExam}
              patient={patient}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CollapsibleTable;
