import React from 'react';
import { Provider } from 'react-redux';
import  store  from './redux/store';
import KanbanBoard from './components/KanbanBoard';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <KanbanBoard />
    </Provider>
  );
};

export default App;