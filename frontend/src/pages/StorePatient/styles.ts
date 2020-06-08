import { makeStyles, fade } from '@material-ui/core/styles';
import placeholder from '../../assets/placeholder.jpeg';

const useStyles = makeStyles({
  background: {
    background: `url(${placeholder}) no-repeat left`,
    backgroundSize: 'cover',
    flex: 1,
    margin: 0,
    padding: 0,
  },
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'stretch',
    margin: 0,
    padding: 0,
    background: '#FFF',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '700px',
  },
  formControl: {
    margin: '80px',
    width: '340px',
    textAlign: 'center',
  },
  textField: {
    margin: '8px',
  },
  formGroup: {
    justifyContent: 'around',
  },
  formLabel: {
    margin: '16px',
    justifyContent: 'center',
  },
  buttonStore: {
    padding: '8px',
    margin: '8px',
    color: '#f0f0f0',
    background: '#2B09AC',
    '&:hover': {
      background: fade('#2B09AC', 0.6),
    },
  },
});

export default useStyles;
