// const Deta = require('deta');
// const deta = Deta(process.env.DETA_PROJECT_KEY)
// const myBase = deta.Base('name-of-base')

// read deta fundamentals
// read deta reference base sdk

// разобраться с cookies или local storage или session storsge для хранения token'а аутентификации
// session storage обнуляется при закрытии вкладки

// для аутентификации библиотека json web token (jwt)
// .env - разобраться с файлом переменных окружения
// ENVIRONMENT_VARIABLE1=123
// ENVIRONMENT_VARIABLE2=hjdfkhjd

// .spaceignore    .gitignore:
// .env            .env
//                 Spacefile


// npm install dotenv

// require('dotenv')()
// process.env.ENVIRONMENT_VARIABLE

const express = require('express');
//const authRouter = require('')
const app = express();
const port = 3001; // Вы можете изменить порт по своему усмотрению

// Указываем Express обслуживать статические файлы из папки 'public'
app.use(express.static('public'));

//app.use('/auth', authRouter)

// router.get('/id')

/*app.get('/users/id', (req,res) => {
    res.send('Hello')
});*/

app.listen(port, () => {
    console.log(`RHYTHM CLUB SERVER STARTED AT PORT ${port}`);
});