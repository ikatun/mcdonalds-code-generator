import express from 'express';
import bodyParser from 'body-parser';
import withJson, { JsonErrorResponse } from 'express-with-json';
import { generateCoupon } from './generate-coupon';

const app = withJson(express());
app.use(bodyParser.json());

// 04sp-r6ft-a5x0
app.getJson('/code', async (req, res) => {
  const { code } = req.query;
  if (!code || typeof code !== 'string') {
    throw new JsonErrorResponse({ error: 'Missing code' }, { statusCode: 501 });
  }
  const url = await generateCoupon(code, true);
  res.redirect(url);
  return { url };
});

app.use(express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}!`));
