const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { User } = require('./models');

const app = express();
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    function decodeJWT(token) {
        try {
            const decoded = jwt.verify(token, '');
            return decoded;
        } catch (err) {
            console.error('Error decoding JWT:', err);
            return null;
        }
    }

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send('Token not provided');
        }
        const decoded = decodeJWT(token);

        if (!decoded) {
            return res.status(400).json({ error: 'Invalid token' });
        }
        return res.send(`Hi, ${decoded.utype}`);  // يمكنك تعديل هذا الجزء حسب هيكل الحمولة داخل التوكن
    } catch (error) {
        console.error('Error decoding token:', error);
        return res.status(500).send('Internal Server Error');
    }
});



app.get('/users', (req, res) => {
    res.render('login');
});

// register endpoint
app.post('/register', async (req, res) => {
    const { uname, uemail, upass, utype } = req.body;
    try {
        // تحقق مما إذا كان البريد الإلكتروني موجودًا بالفعل في قاعدة البيانات
        const existingUser = await User.findOne({ where: { uemail } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // تشفير كلمة المرور قبل حفظها في قاعدة البيانات
        const hashedPassword = await bcrypt.hash(upass, 10);

        // إنشاء المستخدم في قاعدة البيانات مع كلمة المرور المشفرة
        const user = await User.create({ uname, uemail, upass: hashedPassword, utype });
        return res.redirect('/new-user')
        // لاحظ أننا أزلنا res.redirect('/login') لتجنب إرسال استجابة ثانية
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'An error occurred while registering user' });
    }
});

// login endpoint
app.post('/login', async (req, res) => {
    const { uemail, upass } = req.body;
    try {
        // البحث عن المستخدم باستخدام البريد الإلكتروني
        const user = await User.findOne({ where: { uemail } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // التحقق من كلمة المرور
        const validPassword = await bcrypt.compare(upass, user.upass);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // إنشاء رمز JWT
        const token = jwt.sign({ uid: user.uid, utype: user.utype }, '');

        // تعيين الرمز JWT في كوكيز المتصفح
        res.cookie('token', token, { httpOnly: true });

        // إرسال استجابة ناجحة
        return res.redirect('/')
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'An error occurred while logging in' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
