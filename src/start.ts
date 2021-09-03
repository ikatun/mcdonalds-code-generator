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
    res.redirect('/error.html');
    return { error: 'Invalid code' };
  }
  try {
    const url = await generateCoupon(code, true);
    console.log('url', url);
    res.redirect(url);
    return { url };
  } catch (e) {
    res.redirect('/error.html');
    console.error(e);
  }
});

app.use(express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}!`));
