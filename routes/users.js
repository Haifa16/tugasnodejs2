const express = require('express')
const app = exprress()
const ObjectId = require('mongodb').ObjectId

app.get('/', function (req, res, next) {
    //render to views/index.ejs template file
    res.render('./index', {
        title: 'XIR6'
    })
})

//tampilkan Data
app.get('/tampil', function (req, res, next) {
    //mengambil data dari database secara descending
    req.db.collection('coba').find().sort({
        "_id": -1
    }).toArray(function (err, result) {

        if (err) {
            req.flash('error', err)
            res.render('user/list', {
                title: 'DaftarSiswa',
                data: ''
            })
        } else {
            //menampilkan views list.ejs
            res.render('user/list', {
                title: 'Daftar Siswa',
                data: result
            })
        }
    })
})

//tampilkan form input
app.get('/add', function (req, res, next) {
    //tampilkanviews add.ejs
    res.render('user/add', {
        title: 'TAMBAH DATA',
        nama: '',
        jurusan: '',
        email: '',
        no: ''
    })
})

//Proses input data
app.post('add', function (req, res, next) {
    req.assert('nama', 'Nama is required').noEmpty()
    req.assert('jurusan', 'jurusan is reruired').noEmpty()
    req.assert('email', 'A valid email is required').isEmail()
    req.assert('no', 'no telephon is numeric').isNumeric()

    var errors = req.validationErrors()

    if (!errors) {
        var user = {
            nama: req.sanitize('nama').escape().trim(),
            jurusan: req.sanitize('jurusan').escape().trim(),
            email: req.sanitize('email').escape().trim(),
            no: req.sanitize('no').escape().trim()
        }

        req.db.collection('coba').insert(user, function (err, result) {
            if (err) {
                req.flash('error', err)

                //render to vews/user/add.ejs
                res.render('user/add', {
                    title: 'TAMBAH DATA',
                    nama: user.nama,
                    jurusan: user.jurusan,
                    email: user.email,
                    no: user.no
                })
            } else {
                req.flash('Berhasil', 'Data berhasil ditambah!')

                //redirect to user list page
                res.redirect('/tampil')
            }
        })
    }
    else{ //Display errors to  user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error_msg')

        res.render('user/add',{
            title: 'TAMBAH DATA',
            nama: req.body.nama,
            jurusan: req.body.jurusan,
            email: req.body.email,
            no : req.body.no
        })
    }
})

//SHOW EDIT USER FORM
app.get('/edit/(:id)',function(req,res,next){
    var o_id = new ObjectId(req.params.id)
    req.db.collection('coba').find({"_id": o_id}).toArray(function(err,result) {
        if(err) return console.log(err)

        //jika tidak ada data
        if(!result){
            req.flash('error', 'User not found wiht id = ' + req.params.id)
            res.redirect('/users')
        }else{//jika data ada
            //tampilkan views/user/edit.ejs
            res.render('user/edit',{
                title: 'EDIT DATA',
                //data: rows[0]
                id: result[0]._id,
                nama: result[0].nama,
                jurusan: result[0].jurusan,
                email: result[0].email,
                no: result[0].no
            })
        }
    })
})

//EDIT USER POST ACTION
app.put('/edit/(:id)',function(req,res,next){
    req.assert('nama', 'Nama is require').notEmpty()    //form validation
    req.assert('jurusan', 'Jurusan is require').notEmpty()
    req.assert('email', 'A valid email is require').isEmail()
    req.assert('no', 'No telephon is require').isNumeric()

    var errors = req.validationErrors()

    if (!errors) { //jiika form validation benar
        var user = {
            nama: req.sanitize('nama').escape().trim(),
            jurusan: req.sanitize('jurusan').escape().trim(),
            email: req.sanitize('email').escape().trim(),
            no: req.sanitize('no').escape().trim()
        }

        var o_id = new ObjectId(req.params.id)
        req.db.collection('coba').update({"_id":o_id},user,function(err,result){
            if(err){
                req.flash('error',err)

                //render to views/user/edit.ejs
                res.render('user/edit', {
                    title: 'EDIT DATA',
                    id: req.params.id,
                    nama: req.body.nama,
                    jurusan: req.body.jurusan,
                    email: req.body.email,
                    no: req.body.no
                })
            }else{
                req.flash('Berhasil','Data berhasil diupdate')
                res.redirect('/tampil')
            }
        })
    }else{ //Displayerrors to user
        var error_msg = ''
        errors.forEach(function(error){
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        req.render('user?edit', {
            title: 'EDIT DATA',
            id: req.params.id,
            nama: req.body.nama,
            jurusan: req.body.jurusan,
            email: req.body.email,
            no: req.body.no
        })
    }
})

// DELETE USER
app.delete('/delete/(:id)', function(req,res,next){
    var o_id = new ObjectId(req.params.id)
    req.db.collection('coba').remove({"_id": o_id}, function(err, result){
        if (err) {
            req.flash('error', err)
            //redirect Halaman tampil data
            res.redirect('/users')
        } else {
            req.flash ('berhasil', 'Data berhasil dihapus')
            //redirect Halaman tampil data
            res.redirec('/tampil')
        }
    })
})

module.exports = app