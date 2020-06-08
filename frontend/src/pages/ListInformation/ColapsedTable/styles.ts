import { makeStyles, fade } from '@material-ui/core/styles';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  deleteButton: {
    color: '#F9001D',
    '&:hover': {
      color: fade('#000', 0.5),
      background: fade('#F9001D', 0.25),
    },
  },
  editButton: {
    color: '#957CF1',
    '&:hover': {
      color: fade('#000', 0.5),
      background: fade('#957CF1', 0.25),
    },
  },
});

export default useRowStyles;
