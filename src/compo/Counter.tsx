import React, { useState } from 'react';
import styles from './counter.module.scss';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const getTime = (date: string) => dayjs.duration(dayjs().diff(dayjs(date))).$d;
export default () => {
  const DATE = '2017-04-10';

  const [cur, setCur] = useState(getTime(DATE));

  setInterval(() => {
    setCur(getTime(DATE));
  }, 1000);
  return (
    <div className={styles.count}>
      For <span>{cur.years}</span>y<span>{cur.months}</span>m
      <span>{cur.days}</span>d<span>{cur.hours}</span>h
      <span>{cur.minutes}</span>m<span>{cur.seconds}</span>s
    </div>
  );
};
