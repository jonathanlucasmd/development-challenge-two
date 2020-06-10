import { makeStyles, fade } from '@material-ui/core/styles';
import placeholder from '../../assets/store.png';

const useStyles = makeStyles({
  background: {
    background: `url(${placeholder}) no-repeat left`,
    backgroundSize: 'cover',
    opacity: '0.98',
    flex: 1,
    margin: 0,
    padding: 0,
  },

  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'stretch',
    margin: 0,
    padding: 0,
    // background: '#FFF',
  },

  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '600px',
    background: 'inherit',
  },

  formControl: {
    margin: '80px',
    width: '340px',
    textAlign: 'center',
    background: 'inherit',
  },

  textField: {
    margin: '8px',

    '& label.Mui-focused': {
      color: 'black',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'black',
    },
    '& .MuiOutlinedInput-root': {
      color: 'black',
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: fade('#fff', 0.5),
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
        color: 'black',
      },
    },
  },

  formLabel: {
    margin: '32px',
    fontSize: '32px',
    fontWeight: 'bold',
    justifyContent: 'center',
    color: 'black',
  },

  textFieldAnnex: {
    margin: '8px',
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

  buttonSave: {
    padding: '8px',
    margin: '8px',
    background: '#f0f0f0',
    color: '#2B09AC',
    '&:hover': {
      background: fade('#f0f0f0', 0.6),
    },
  },
});

export default useStyles;
