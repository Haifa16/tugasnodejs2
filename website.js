    const express = require('express');
    const app = express();
    const expressMongoDb = require('express-mongo-db');
    const bodyParser = require('body-Parser')
    const methodOverride = require('method-override')
    const expressValidator = require('express-validator')
    const flash = require('express-flash')
    //const cookieParser = require('cookie-parser');
    const session = require('express-session');
    const config = require('./config')
    const users = require('./routes/users')

    app.use(expressMongoDb(config.database.url));
    app.set('view engine', 'ejs') //untuk mensetting view engine yang akan digunakan, yaitu EJS
    app.use(expressValidator())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    app.use(methodOverride(function(req,res){
        if(req.body && typeof req.body == 'object' && '_method' in req.body) {
            const method = req.body._method
            delete req.body._method
            return method
        }
    }))
    // app.use(cookieParser('keyboard cat'))
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 }
    }))
    app.use(flash())//untuk menampilkan pesan wrror/success
    app.use('/',users)
    app.use('/users',users)
    app.listen(3000,function(){
        console.log('Server running at port 3000: http://127.0.0.1:3000')
    })

    router.get('/',function(req,res){
        res.sendFile(path + 'index.html');
    });

    router.get('/about',function(req,res){
        res.sendFile(path + 'about.html');
    });

    router.get('/profile',function(req,res){
        res.sendFile(path + 'profile.html');
    });

    router.get('/gallery',function(req,res){
        res.sendFile(path + 'gallery.html');
    });

    app.use('*',function(req,res){
        res.send('Error 404: Not Found!');
    });

    app.listen(3000,function(){
        console.log("berhasil");
    });
