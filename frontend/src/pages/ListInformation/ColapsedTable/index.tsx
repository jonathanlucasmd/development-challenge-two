import React, { useState, useCallback, useEffect } from 'react';
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
import { Link } from 'react-router-dom';
import api from '../../../services/api';

import useRowStyles from './styles';

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

function Row(props: { handleDelete(): void; patient: IData }): any {
  const { patient, handleDelete } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  const handleDownload = useCallback(async (filename) => {
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
        <TableCell align="right">{patient.cpf}</TableCell>
        <TableCell align="right">{patient.age}</TableCell>
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
                    <TableCell align="right">Descrição</TableCell>
                    <TableCell align="right">Baixar Exame</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patient.informations.map((informationRow) => (
                    <TableRow key={informationRow.date}>
                      <TableCell component="th" scope="row">
                        {informationRow.date}
                      </TableCell>
                      <TableCell>{informationRow.doctor}</TableCell>
                      <TableCell align="right">
                        {informationRow.description}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          startIcon={<CloudDownload />}
                          disabled={!informationRow.annex}
                          onClick={(event) => {
                            event.preventDefault();
                            handleDownload(informationRow.annex);
                          }}
                        >
                          Exame
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
}

const CollapsibleTable: React.FC = () => {
  const [patients, setPatients] = useState<IData[]>((): IData[] => {
    const storagedPatients = localStorage.getItem('@Medcloud:patients');

    if (storagedPatients) {
      return JSON.parse(storagedPatients);
    }
    return [];
  });

  const handleDelete = useCallback(
    ({ id }) => {
      api.delete(`/${id}`);
      const index = patients.findIndex((patient) => patient.id === id);
      patients.splice(index);
      setPatients([...patients]);
    },
    [patients],
  );

  useEffect(() => {
    api.get('/').then((response) => {
      setPatients(response.data);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('@Medcloud:patients', JSON.stringify(patients));
  }, [patients]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell align="right">CPF</TableCell>
            <TableCell align="right">Idade</TableCell>
            <TableCell align="right" />
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <Row
              key={patient.cpf}
              handleDelete={() => {
                handleDelete({ id: patient.id });
              }}
              patient={patient}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CollapsibleTable;
