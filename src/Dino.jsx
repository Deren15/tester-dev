import React, { useEffect, useRef } from 'react';

const STATUS = {
  STOP: 'STOP',
  START: 'START',
  PAUSE: 'PAUSE',
  OVER: 'OVER'
};

const JUMP_DELTA = 20;
const JUMP_MAX_HEIGHT = 60;

const Dino = (props) => {
  const canvasRef = useRef(null);
  let imageLoadCount = 0;
  let jumpHeight = useRef(0);
  let jumpDelta = useRef(0);
  let obstaclesBase = useRef(1);
  let obstacles = useRef([]);
  let currentDistance = useRef(0);
  let playerStatus = useRef(0);
  let timer = useRef(null);
  let score = useRef(0);
  let highScore = useRef(window.localStorage ? window.localStorage['highScore'] || 0 : 0);
  const options = {
    fps: 60,
    skySpeed: 180,
    groundSpeed: 240,
    skyImage: null,
    groundImage: null,
    playerImage: [],
    obstacleImage: null,
    skyOffset: 0,
    groundOffset: 0,
    ...props.options
  };
  let status = useRef(STATUS.STOP);

  useEffect(() => {
    let onImageLoaded = () => {
      ++imageLoadCount;
      if (imageLoadCount === 3) {
        draw();
      }
    };

    options.skyImage = new Image();
    options.groundImage = new Image();
    options.playerImage = [
      new Image(),
      new Image(),
      new Image(),
      new Image()
    ];
    options.obstacleImage = new Image();

    options.skyImage.onload = onImageLoaded;
    options.groundImage.onload = onImageLoaded;
    options.playerImage.forEach((image) => {
      image.onload = onImageLoaded;
    });

    options.skyImage.src = require('./img/cloud-1.png');
    options.groundImage.src = require('./img/ground-1.png');
    options.playerImage[0].src = require('./img/farmer-1.png');
    options.playerImage[1].src = require('./img/farmer-1.png');
    options.playerImage[2].src = require('./img/farmer-1.png');
    options.playerImage[3].src = require('./img/farmer-1.png');
    options.obstacleImage.src = require('./img/cow.png');

    return () => {
      window.onblur = null;
      window.onfocus = null;
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 680) {
      canvasRef.current.width = 680;
    }

    const onSpacePress = () => {
      switch (status.current) {
        case STATUS.STOP:
          start();
          break;
        case STATUS.START:
          jump();
          break;
        case STATUS.OVER:
          restart();
          break;
      }
    };

    window.onkeypress = function (e) {
      if (e.key === ' ') {
        onSpacePress();
      }
    };
    canvasRef.current.parentNode.onclick = onSpacePress;

    window.onblur = pause;
    window.onfocus = goOn;

    return () => {
      window.onkeypress = null;
      canvasRef.current.parentNode.onclick = null;
    };
  }, []);

  const draw = () => {
    if (!canvasRef.current) {
      return;
    }

    let level = Math.min(200, Math.floor(score.current / 100));
    let groundSpeed = (options.groundSpeed + level) / options.fps;
    let skySpeed = options.skySpeed / options.fps;
    let obstacleWidth = options.obstacleImage.width;
    let playerWidth = options.playerImage[0].width;
    let playerHeight = options.playerImage[0].height;

    const ctx = canvasRef.current.getContext('2d');
    const { width, height } = canvasRef.current;

    ctx.clearRect(0, 0, width, height);
    ctx.save();

    // 云
    options.skyOffset = options.skyOffset < width
      ? (options.skyOffset + skySpeed)
      : (options.skyOffset - width);
    ctx.translate(-options.skyOffset, 0);
    ctx.drawImage(options.skyImage, 0, 0);
    ctx.drawImage(options.skyImage, options.skyImage.width, 0);

    // 地面
    options.groundOffset = options.groundOffset < width
      ? (options.groundOffset + groundSpeed)
      : (options.groundOffset - width);
    ctx.translate(options.skyOffset - options.groundOffset, 0);
    ctx.drawImage(options.groundImage, 0, 76);
    ctx.drawImage(options.groundImage, options.groundImage.width, 76);

    // 恐龙
    // 这里已经将坐标还原回左上角
    ctx.translate(options.groundOffset, 0);
    ctx.drawImage(options.playerImage[playerStatus.current], 80, 64 - jumpHeight.current);
    // 更新跳跃高度/速度
    jumpHeight.current = jumpHeight.current + jumpDelta.current;
    if (jumpHeight.current <= 1) {
      jumpHeight.current = 0;
      jumpDelta.current = 0;
    }
    else if (jumpHeight.current < JUMP_MAX_HEIGHT && jumpDelta.current > 0) {
      jumpDelta.current = (jumpHeight.current * jumpHeight.current) * 0.001033 - jumpHeight.current * 0.137 + 5;
    }
    else if (jumpHeight.current < JUMP_MAX_HEIGHT && jumpDelta.current < 0) {
      // jumpDelta.current = (jumpHeight.current * jumpHeight.current) * 0.00023 - jumpHeight.current * 0.03 - 4;
    }
    else if (jumpHeight.current >= JUMP_MAX_HEIGHT) {
      jumpDelta.current = -JUMP_DELTA / 2.7;
    }

    // 分数
    let scoreText = (status.current === STATUS.OVER ? 'GAME OVER  ' : '') + Math.floor(score.current);
    ctx.font = "Bold 18px Arial";
    ctx.textAlign = "right";
    ctx.fillStyle = "#595959";
    ctx.fillText(scoreText, width - 30, 23);
    if (status.current === STATUS.START) {
      score.current += 0.5;
      if (score.current > highScore.current) {
        highScore.current = score.current;
        window.localStorage['highScore'] = score.current;
      }
      currentDistance.current += groundSpeed;
      if (score.current % 4 === 0) {
        playerStatus.current = (playerStatus.current + 1) % 3;
      }
    }
    if (highScore.current) {
      ctx.textAlign = "left";
      ctx.fillText('HIGH  ' + Math.floor(highScore.current), 30, 23);
    }

    // 障碍
    let pop = 0;
    for (let i = 0; i < obstacles.current.length; ++i) {
      if (currentDistance.current >= obstacles.current[i].distance) {
        let offset = width - (currentDistance.current - obstacles.current[i].distance + groundSpeed);
        if (offset > 0) {
          ctx.drawImage(options.obstacleImage, offset, 84);
        }
        else {
          ++pop;
        }
      }
      else {
        break;
      }
    }
    for (let i = 0; i < pop; ++i) {
      obstacles.current.shift();
    }
    if (obstacles.current.length < 5) {
      obstacles.current = obstacles.current.concat(obstaclesGenerate());
    }

    // 碰撞检测
    let firstOffset = width - (currentDistance.current - obstacles.current[0].distance + groundSpeed);
    if (90 - obstacleWidth < firstOffset
      && firstOffset < 60 + playerWidth
      && 64 - jumpHeight.current + playerHeight > 84) {
      stop();
    }

    ctx.restore();
  };

  const obstaclesGenerate = () => {
    let res = [];
    for (let i = 0; i < 10; ++i) {
      let random = Math.floor(Math.random() * 100) % 60;
      random = (Math.random() * 10 % 2 === 0 ? 1 : -1) * random;
      res.push({
        distance: random + obstaclesBase.current * 200
      });
      ++obstaclesBase.current;
    }
    return res;
  };

  const setTimer = () => {
    timer.current = setInterval(() => draw(), 1000 / options.fps);
  };

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const clear = () => {
    score.current = 0;
    jumpHeight.current = 0;
    currentDistance.current = 0;
    obstacles.current = [];
    obstaclesBase.current = 1;
    playerStatus.current = 0;
  };

  const start = () => {
    if (status.current === STATUS.START) {
      return;
    }

    status.current = STATUS.START;
    setTimer();
    jump();
  };

  const pause = () => {
    if (status.current === STATUS.START) {
      status.current = STATUS.PAUSE;
      clearTimer();
    }
  };

  const goOn = () => {
    if (status.current === STATUS.PAUSE) {
      status.current = STATUS.START;
      setTimer();
    }
  };

  const stop = () => {
    if (status.current === STATUS.OVER) {
      return;
    }
    status.current = STATUS.OVER;
    playerStatus.current = 3;
    clearTimer();
    draw();
    clear();
  };

  const restart = () => {
    obstacles.current = obstaclesGenerate();
    start();
  };

  const jump = () => {
    if (jumpHeight.current > 2) {
      return;
    }
    jumpDelta.current = JUMP_DELTA;
    jumpHeight.current = JUMP_DELTA;
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
    }}>
      <canvas id="canvas" ref={canvasRef} height={160} width={340} />
    </div>
  );
};

export default Dino