const express = require('express');
const { sequelize } = require('./models');
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const { PORT } = require('./utils/util');
const { rootRouter } = require('./routers');
const app = express();
app.use(cors());
app.use(express.json());
// setup static file
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/api/v1', rootRouter);
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    res.send(`HELLO ${PORT}`)
})
app.listen(PORT, async () => {
    console.log(`http://localhost:${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})