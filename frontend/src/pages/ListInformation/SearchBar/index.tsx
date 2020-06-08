import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Styles from './styles';

const SearchAppBar: React.FC = () => {
  const classes = Styles();

  return (
    <AppBar position="fixed" className={classes.appbar}>
      <div className={classes.search}>
        <InputBase
          placeholder="Buscar..."
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
        />
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
      </div>
    </AppBar>
  );
};
export default SearchAppBar;
