import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';
import ListInformation from '../pages/ListInformation';
import StorePatient from '../pages/StorePatient';
import EditInformation from '../pages/EditInformation';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={ListInformation} />
      <Route path="/newpatient" component={StorePatient} />
      <Route path="/edit/:id" component={EditInformation} />
    </Switch>
  );
};

export default Routes;
