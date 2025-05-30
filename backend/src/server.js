const express = require('express');
const cors = require('cors');
const thongKeRoutes = require('./routes/thongke');
const sanBongRoutes = require('./routes/sanbong');
const datSanRoutes = require('./routes/datsan');
const khachHangRoutes = require('./routes/khachhang');
const checkoutRoutes = require('./routes/checkout');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/thong-ke', thongKeRoutes);
app.use('/api/san-bong', sanBongRoutes);
app.use('/api/dat-san', datSanRoutes);
app.use('/api/khach-hang', khachHangRoutes);
app.use('/api/checkout', checkoutRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
