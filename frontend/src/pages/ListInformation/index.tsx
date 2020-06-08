import React from 'react';
import { Container, Button } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import Bar from './SearchBar';
import Table from './ColapsedTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

const ListInformation: React.FC = () => {
  const classes = useStyles();

  return (
    <>
      <Bar />
      <Container
        style={{
          padding: 16,
          marginTop: '90px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Table />
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

export default ListInformation;
