import express from 'express';

export const init = () => {
  const app = express();

  app.get('/', (_, res) => {
    res.status(200).send('bot is alive');
  });

  app.listen(10000, () => {
    console.log(`server started`);
  });
};
