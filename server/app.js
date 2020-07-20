const express = require('express');
const conf = require('./conf');
const router = express.Router()
const path = require('path')
const app = express()
app.use('/', express.static(path.resolve(__dirname, './public')))
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views'))
router.get('/*', (req, res)=>{
	res.render('index.html');
})
app.use(router)
app.listen(conf.port, ()=>{
	console.log('The project is running');
})
