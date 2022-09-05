import express from 'express';

export const init = () => {
  const app = express();

  app.get('/', (_, res) => {
    res.status(200).send('bot is alive');
  });

  app.listen(process.env.PORT ?? 3001, () => {
    console.log(`server started`);
  });
};
