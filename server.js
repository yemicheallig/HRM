const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const router = require('./routes/router');
// Session middleware setup

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}))
app.use(express.static('public'))

app.use('/',router)

app.listen(PORT,()=>{
    console.log(`Server listening to port ${PORT}`)
})