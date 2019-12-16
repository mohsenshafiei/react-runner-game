import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "./useInterval";

import {
  CANVAS_SIZE,
  SCALE,
  SPEED,
  DIRECTIONS,
  RUNNER_START,
} from "./constants";

import style from './style.scss';

export const Runner = () => {
  const canvasRef = useRef();
  const [pause, setPause] = useState(false);
  const [isStarted, setStarted] = useState(false);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [runner, setRunner] = useState(RUNNER_START);
  const [dir, setDir] = useState([0, 0]);
  const [xMouse, setXMouse] = useState(0);
  const [yMouse, setYMouse] = useState(0);


  useInterval(() => gameLoop(), speed);

  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
    setStarted(false);
    setPause(false);
  };

  const pauseGame = () => {
    if (pause) {
      setPause(false)
      setSpeed(SPEED)
    } else {
      setPause(true);
      setSpeed(null)
    }
  }

  const moveRunner = ({ keyCode }) => keyCode === 32 ? pauseGame() : (keyCode > 36 && keyCode < 40 && setDir(DIRECTIONS[keyCode]));

  const gameLoop = () => {
    const newRunnerPlace = [runner[0] + dir[0], runner[1] + dir[1]];
    setRunner(newRunnerPlace);
    if (xMouse / SCALE - runner[0] > 1) {
      setDir(DIRECTIONS[39])
    } else if (runner[0] - xMouse / SCALE > 1) {
      setDir(DIRECTIONS[37])
    } else {
      setDir([0, 0]);
    }
  };

  const startGame = () => {
    setSpeed(SPEED);
    setGameOver(false);
    setStarted(true);
    setPause(false);
  };

  const handleMouse = (e) => {
    setXMouse(e.nativeEvent.offsetX)
    setYMouse(e.nativeEvent.offsetY);
  }

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "lightgreen";
    context.fillRect(0, 14, SCALE, 1);
    context.fillStyle = "lightblue";
    context.fillRect(runner[0], runner[1], 1, 1);
  }, [runner, gameOver]);

  return (
    <div
      role="button"
      tabIndex="0"
      onKeyDown={e => moveRunner(e)}
      className={style.container}
    >
      <canvas
        onMouseMove={(e) => handleMouse(e)}
        onClick={isStarted ? pauseGame :startGame}
        className={style.game}
        ref={canvasRef}
        width={`${CANVAS_SIZE[0]}px`}
        height={`${CANVAS_SIZE[1]}px`}
      />
      {gameOver && <div className={style.gameOver}>GAME OVER!</div>}
      {isStarted && pause && <div className={style.pauseGame}>PAUSED!</div>}
      <div className={style.controller}>
        <button className={style.start} onClick={startGame}>Start</button>
        <button className={style.pause} onClick={pauseGame}>Pause</button>
        <button className={style.end} onClick={endGame}>Quit</button>
      </div>
    </div>
  )
}
