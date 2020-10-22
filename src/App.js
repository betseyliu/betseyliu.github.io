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
      <div className={styles.content}>
        <div className={styles.banner}>
          <p className={styles.bannerHighlight}>COME</p>
          <p>And Get to Know Me</p>
        </div>
      </div>
      <Map className={styles.map} />
    </div>
  );
}

export default App;
