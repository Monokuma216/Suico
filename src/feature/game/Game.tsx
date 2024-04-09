import { Engine, type EngineOptions, Scene, type SceneOptions } from '@babylonjs/core';
import { useEffect, useRef } from 'react';
import style from './style.module.sass';

interface IProps {
  antialias?: boolean;
  engineOptions?: EngineOptions;
  adaptToDeviceRatio?: boolean;
  sceneOptions?: SceneOptions;
  onRender?: (scene: Scene) => void;
  onSceneReady: (scene: Scene) => void;
}

export const Game = (props: IProps) => {
  const { antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, ...rest }: IProps = props;
  const reactCanvas = useRef<HTMLCanvasElement>(null);

  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (canvas === null) return;

    const engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio);
    const scene = new Scene(engine, sceneOptions);
    if (scene.isReady()) {
      onSceneReady(scene);
    } else {
      scene.onReadyObservable.addOnce((scene) => {
        onSceneReady(scene);
      });
    }

    engine.runRenderLoop(() => {
      if (typeof onRender === 'function') onRender(scene);
      scene.render();
    });

    const resize = () => {
      scene.getEngine().resize();
    };

    window.addEventListener('resize', resize);
    return () => {
      scene.getEngine().dispose();
      window.removeEventListener('resize', resize);
    };
  }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady]);

  return <canvas className={style.canvas} ref={reactCanvas} {...rest} />;
};
