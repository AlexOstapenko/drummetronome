const express = require('express');
const app = express();
const port = 3001; // Вы можете изменить порт по своему усмотрению

// Указываем Express обслуживать статические файлы из папки 'public'
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});