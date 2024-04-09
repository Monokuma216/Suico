import React from 'react';
import { MainScene } from './babylon/scenes/MainScene';
import { Game } from './feature/game/Game';
import styles from './index.module.sass';

function App() {
  return (
    <div className={styles.main}>
      <Game
        onSceneReady={MainScene}
        adaptToDeviceRatio={false}
      />
    </div>
  );
}

export default App;
