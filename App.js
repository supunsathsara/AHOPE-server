require('dotenv').config();
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Redirect requests to endpoint
app.use('/user', require('./routes/user.routes'));
app.use('/client', require('./routes/client.routes.js'));
app.use('/country', require('./routes/country.routes.js'));
app.use('/state', require('./routes/state.routes.js'));
app.use('/town', require('./routes/town.routes.js'));
app.use('/service', require('./routes/service.routes.js'));
app.use('/subservice', require('./routes/subservice.routes.js'));
app.use('/package', require('./routes/package.routes.js'));
app.use('/tag', require('./routes/tag.routes.js'));

// Global Error Handler. IMPORTANT function params MUST start with err
app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  res.status(500).json({
    message: 'Something went really wrong',
  });
});

// Listen on pc port
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

module.exports = app;
