import React from 'react';
import Canvas from './components/canvas/canvas';
import styles from './index.module.sass';

function App() {
  return (
    <div className={styles.main}>
      <Canvas width={500} height={500} />
    </div>
  );
}

export default App;
