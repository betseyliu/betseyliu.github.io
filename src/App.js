import React from 'react';
import styles from './App.module.scss';
import { Map } from './compo/Map.jsx';

function App() {
  return (
    <div className="App">
      <header className={styles.header}>
        <a className={styles.logo} href="/">
          Betsey
        </a>
      </header>
      <Map className={styles.map} />
    </div>
  );
}

export default App;
