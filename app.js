const express = require('express');
const app = express();
const router = require('./router');

app.use(express.static('public'))
app.set('views','views')
app.set('view engine', 'ejs')

// Get body request
app.use(express.urlencoded({extended: false}))

app.use('/', router)

app.listen(3000)
