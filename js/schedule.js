document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    
    // Bảo vệ trang: Chưa đăng nhập hoặc không phải user thì đá về trang login
    if (!currentUser || currentUser.role !== "user") {
        alert("Bạn cần đăng nhập bằng tài khoản thành viên để đặt lịch!");
        window.location.href = "login.html";
        return;
    }

    const userNameEl = document.querySelector("#user-name");
    if (userNameEl) {
        userNameEl.textContent = currentUser.fullname;
    }

    // Đăng xuất
    const logoutBtn = document.querySelector("#btn-logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            sessionStorage.removeItem("currentUser");
            window.location.href = "login.html";
        });
    }

    // Hiển thị lịch cá nhân của user
    function loadMySchedules() {
        const list = document.querySelector("#my-schedule-list");
        if (!list) return;
        
        list.innerHTML = "";
        let schedules = JSON.parse(localStorage.getItem("club_schedules")) || [];
        let mySchedules = schedules.filter(s => s.userEmail === currentUser.email);

        if (mySchedules.length === 0) {
            list.innerHTML = "<li>Chưa có lịch sân nào được đặt.</li>";
            return;
        }

        mySchedules.forEach(s => {
            const li = document.createElement("li");
            // Đồng bộ gọi thuộc tính timeSlot (hoặc s.timeSlot thay vì s.shift) kèm trạng thái duyệt
            const timeInfo = s.timeSlot || s.time || "Chưa có giờ";
            const statusText = s.status === "approved" ? "Đã duyệt" : (s.status === "rejected" ? "Đã hủy" : "Chờ duyệt");
            
            li.innerHTML = `Ngày: <strong>${s.date}</strong> | Khung giờ: <em>${timeInfo}</em> — Trạng thái: <span style="font-weight:bold;">${statusText}</span>`;
            list.appendChild(li);
        });
    }

    loadMySchedules();

    // --- XỬ LÝ ĐẶT SÂN CÁ NHÂN ---
    const scheduleForm = document.querySelector("#form-schedule"); // Form đặt lịch của user
    if (scheduleForm) {
        scheduleForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
            if (!currentUser) {
                alert("Vui lòng đăng nhập trước khi đặt lịch!");
                window.location.href = "login.html";
                return;
            }

            const date = document.querySelector("#schedule-date").value;
            const timeSlot = document.querySelector("#schedule-timeslot").value;

            if (!date || !timeSlot) {
                alert("Vui lòng điền đầy đủ ngày và khung giờ đánh sân!");
                return;
            }

            // Tạo đối tượng lịch đặt sân mới
            const newBooking = {
                id: Date.now(), // ID duy nhất cho từng lịch đặt
                userEmail: currentUser.email,
                date: date,
                timeSlot: timeSlot, // Đồng bộ khớp với trang admin.js
                status: "pending"   // Mặc định chờ duyệt
            };

            // Lưu vào localStorage
            let schedules = JSON.parse(localStorage.getItem("club_schedules")) || [];
            schedules.push(newBooking);
            localStorage.setItem("club_schedules", JSON.stringify(schedules));

            alert("Đăng ký lịch thành công! Vui lòng chờ Ban chủ nhiệm (Admin) phê duyệt.");
            scheduleForm.reset();
            
            // Tải lại danh sách lịch cá nhân ngay lập tức
            loadMySchedules();
        });
    }
});