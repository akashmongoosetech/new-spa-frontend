import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { usePageMetadata } from './hooks/usePageMetadata';

function App() {
  usePageMetadata('home');

  return <AppRoutes />;
}

export default App;

