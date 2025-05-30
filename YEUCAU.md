# Hệ thống quản lý cho thuê sân bóng mini

## Mô tả hệ thống

- **Sân bóng** có nhiều sân con mini cho thuê. Tùy yêu cầu khách hàng, có thể ghép 2 hoặc 4 sân bé liền nhau thành 1 sân lớn cho thuê.
- **Mỗi sân** có thể cho nhiều khách hàng (KH) thuê tại nhiều khung giờ khác nhau. Mỗi khách hàng có thể thuê nhiều sân khác nhau.
- **Khách hàng** có thể thuê sân theo buổi trong tuần hoặc thuê theo tháng (vào một hoặc một số buổi cố định trong tuần, trong vòng mấy tháng cụ thể).
- **Hợp đồng thuê sân**:
   - Dòng đầu: ngày làm hợp đồng, thông tin chủ sân, thông tin khách hàng.
   - Các dòng tiếp theo: mỗi dòng ghi một sân mini với đầy đủ thông tin về sân, giá thuê một buổi, khung giờ thuê trong tuần, ngày bắt đầu, ngày kết thúc đợt thuê, tổng tiền thuê dự kiến.
   - Dòng cuối: tổng số tiền thuê sân dự kiến.
- **Đặt cọc**: Khi đặt sân, khách hàng phải đặt cọc trước ít nhất 10% tổng tiền thuê dự kiến. Thông tin số tiền đặt cọc được ghi rõ trong phiếu đặt sân (đã thanh toán bao nhiêu tiền, vào ngày nào).
- **Dịch vụ bổ sung**: Khi khách hàng đến đá bóng, chủ sân có thể phục vụ nước uống giải khát và đồ ăn nhẹ. Mỗi buổi khách hàng dùng các loại mặt hàng nào, số lượng, tổng tiền đều được cập nhật vào hệ thống. Khách hàng sẽ thanh toán khoản chi phí phát sinh này vào cuối đợt thuê sân.
- **Thanh toán**: Khi thanh toán tiền thuê sân, khách hàng nhận được hóa đơn ghi chi tiết thông tin thuê sân và chi phí thuê sân giống như phiếu đặt sân. Có thể có thêm một số buổi phát sinh hoặc đổi lịch theo yêu cầu khách hàng. Phần dưới hóa đơn ghi rõ đồ ăn uống phát sinh theo từng buổi, mỗi buổi được liệt kê thành một bảng, trong đó mỗi dòng mô tả một mặt hàng: mã, tên, giá, số lượng dùng, thành tiền. Tổng số tiền từng buổi và tổng số tiền cho cả đợt đặt sân.
- **Quản lý mặt hàng**: Quản lý sân (QL) phải nhập các mặt hàng (MH) bán kèm từ nhiều nhà cung cấp (mã, tên, địa chỉ, email, điện thoại, mô tả) khác nhau. Mỗi lần nhập hàng có hóa đơn nhập ghi rõ thông tin nhà cung cấp và danh sách các mặt hàng, mỗi dòng: id, tên, đơn giá, số lượng, thành tiền. Dòng cuối là tổng tiền.

---
## Các chức năng của hệ thống

### 1. Modul "Quản lý thông tin sân bóng" (chỉ dành cho sinh viên quốc tế, nếu có)

QL thực hiện thêm, sửa, xóa thông tin sân bóng:
- QL chọn menu quản lý sân bóng → trang quản lý hiện ra.
- QL chọn chức năng sửa thông tin sân bóng → giao diện tìm sân bóng theo tên hiện ra.
- QL nhập tên sân bóng và click tìm kiếm → danh sách các sân bóng có tên chứa từ khóa hiện ra.
- QL chọn sửa một sân bóng → giao diện sửa sân bóng hiện ra với các thông tin của sân bóng đã chọn.
- QL nhập thông tin thay đổi và click cập nhật → hệ thống lưu thông tin vào CSDL và thông báo thành công.

### 2. Modul "Đặt sân"

- Khách hàng (KH) đến yêu cầu đặt sân → Nhân viên (NV) chọn chức năng đặt sân.
- Hệ thống hiện giao diện tìm sân trống theo khung giờ.
- NV nhập khung giờ + chọn loại sân theo yêu cầu KH + click tìm.
- Hệ thống hiện danh sách sân còn trống theo khung giờ đã chọn.
- NV chọn 1 sân → hệ thống hiện giao diện điền thông tin KH.
- NV nhập tên và tìm → hệ thống hiện danh sách các KH có tên vừa nhập.
- NV chọn tên KH đúng với KH hiện tại (nếu KH lần đầu đến đặt sân thì phải thêm mới).
- Hệ thống hiện giao diện nhập khoảng thời gian ngày bắt đầu, ngày kết thúc đợt đặt sân (ưu tiên đặt theo quý).
- NV chọn và xác nhận → hệ thống hiện phiếu đặt sân với đầy đủ thông tin KH, thông tin sân đặt, giá sân đặt, khung giờ đặt, tổng số buổi theo thời gian đã chọn, tổng số tiền ước tính và số tiền phải đặt cọc (10%).
- NV xác nhận → hệ thống in phiếu đặt sân và lưu.

### 3. Modul "Cập nhật các mặt hàng đã dùng của buổi thuê"

- Khi KH đến nhận sân đá xong và trả sân của buổi đó, NV chọn menu tìm phiếu đặt sân theo tên KH.
- Nhập tên KH + click tìm kiếm → hệ thống hiển thị danh sách các KH có tên vừa nhập.
- NV chọn tên KH đúng với thông tin KH hiện tại → hệ thống hiện danh sách các phiếu đặt mà KH đó đang đặt.
- NV chọn checkout buổi thuê 1 phiếu đặt sân → hệ thống hiện giao diện nhập giờ nhận sân, giờ trả sân, tiền thuê sân (trả sớm không được giảm tiền, trả muộn bị tính thêm tiền).
- Lặp các bước sau cho đến khi hết danh sách các sản phẩm ăn uống mà KH đã sử dụng trong suốt các buổi thuê sân:
   - Thêm mặt hàng dùng → giao diện tìm MH theo tên hiện ra.
   - NV nhập tên MH và tìm → giao diện danh sách các MH có tên chứa từ khóa vừa nhập hiện lên.
   - NV chọn 1 MH → giao diện nhập đơn giá và số lượng hiện ra.
   - NV nhập và xác nhận → thông tin MH sử dụng được thêm vào danh sách các MH đã dùng của buổi + dòng cuối là tổng số tiền các MH.
- NV xác nhận → hệ thống cập nhật vào CSDL (chưa cần thanh toán).

### 4. Modul "Khách hàng thanh toán"

- Khi KH đến yêu cầu thanh toán, NV chọn menu tìm phiếu đặt sân theo tên KH.
- Nhập tên KH + click tìm kiếm → hệ thống hiển thị danh sách các KH có tên vừa nhập.
- NV chọn tên KH đúng với thông tin KH hiện tại → hệ thống hiện danh sách các phiếu đặt mà KH đó đang đặt.
- NV chọn thanh toán cho 1 phiếu đặt sân → hệ thống hiện hóa đơn đầy đủ thông tin khách hàng + số tiền dư nợ cũ chưa thanh toán nếu có + 1 bảng danh sách các sản phẩm ăn uống mà KH đã sử dụng trong suốt các buổi thuê sân như mô tả trên + dòng cuối là tổng số tiền phải trả, số tiền thực KH trả, số tiền KH còn nợ hoặc còn nợ KH nếu KH trả nhiều hơn (KH có thể yêu cầu NV chỉnh sửa lại thông tin mặt hàng/số lượng đã dùng cho đúng thực tế nếu có sai lệch).
- NV xác nhận → hệ thống cập nhật vào CSDL và in hóa đơn thanh toán cho KH.

### 5. Modul "Thống kê doanh thu"

- QL chọn menu thống kê doanh thu theo thời gian (tháng, quý, năm).
- Hệ thống hiện ô chọn thống kê theo tháng, quý, hoặc năm.
- QL chọn theo tháng → hệ thống hiện thống kê doanh thu theo tháng dưới dạng bảng, mỗi dòng tương ứng với 1 tháng (tương ứng là quý, năm): tên tháng, tổng doanh thu. Sắp xếp theo chiều thời gian tháng (tương ứng là quý, năm) gần nhất đến tháng (tương ứng là quý, năm) cũ nhất.
- QL click vào 1 dòng của kết quả → hệ thống hiện chi tiết các hóa đơn của khách hàng trong thời gian của dòng click, mỗi hóa đơn trên 1 dòng: id, tên khách hàng, tên sân, ngày giờ, tổng tiền thanh toán.
