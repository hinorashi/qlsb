const express = require('express');
const cors = require('cors');
const thongKeRoutes = require('./routes/thongke');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/thong-ke', thongKeRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
