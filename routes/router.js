const express = require('express');
const router = express.Router()
const multer = require('multer')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const con = require('../models/users');
const { error } = require('console');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // Limit file size to 1MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('profile_pic');

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

router.use(express.urlencoded({ extended: false }))
router.use(express.json())

router.get('/signup', (req, res) => {
    res.render('signup', { mess: null })
})

router.post('/signedup', upload, async (req, res) => {
    const { first_name, last_name, email, pwd, pwd_repeat } = req.body
    if (!first_name || !last_name || !email || !pwd || !pwd_repeat || !req.file) {
        return res.render('signup', { mess: 'Please,Fill all the feilds' })
    }
    const hashedpwd = await bcrypt.hash(pwd, 10)

    con.query('SELECT email from users where email = ?', [email], async (err, result) => {
        if (err) {
            console.error('Error querying database:', err);
            return result.render('signup', { mess: 'An error occurred while processing your request' });
        }
    
        // Check if a user with the email already exists
        if (result.length > 0) {
            // User with the email already exists
             res.render('signup', { mess:`Email ${result[0].email} already exists,Please try another one` });
        } else {
            con.query('INSERT INTO users(first_name,last_name,email,pwd,profile_pic) values(?,?,?,?,?)', [first_name, last_name, email, hashedpwd, req.file.filename], async (error, results, fields) => {
                if (error) {
                    console.log("Error inserting user: ", error)
                    return res.render('signup', { mess: 'An error occurred while processing your request,Please Try Again' })
                }
                console.log('Successfully Inserted')
            })
        }
    });
    
    
})

process.on('exit', () => {
    connection.end();
});

module.exports = router