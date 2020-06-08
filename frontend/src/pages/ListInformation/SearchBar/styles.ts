import {
  fade,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appbar: {
      background: '#3700B3',
      display: 'flex',
      alignItems: 'center',
      padding: '8px',
    },
    grow: {
      flexGrow: 1,
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      margin: '8px',
      display: 'flex',
      alignItems: 'center',
      minWidth: '100px',
      width: '450px',
    },
    searchIcon: {
      padding: '16px',
      height: '100%',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
      height: '90%',
      width: '100%',
    },
    inputInput: {
      height: '90%',
      width: '100%',
      fontSize: '16pt',
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
    },
  }),
);

export default useStyles;
