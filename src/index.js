const app = require('./app')
const hbs = require('hbs')
const path = require('path')
const webHandler = require('./webhandler/web')
//Setting view engine

const viewsPath = path.join(__dirname, './templates/views')
const partialsPath = path.join(__dirname, './templates/partials')
app.set('view engine', 'hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)
app.use(webHandler)


const port = process.env.PORT || 3000

app.listen(port, ()=>{
    console.log('Server is up on port '+ port)
})







