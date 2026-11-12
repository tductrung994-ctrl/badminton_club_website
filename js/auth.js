// --- XỬ LÝ ĐĂNG KÝ ---
const registerForm = document.querySelector("#form-register");
if (registerForm) {
    registerForm.addEventListener("submit", function(e) {
        e.preventDefault(); // Chặn reload trang mặc định[cite: 190]

        const fullname = document.querySelector("#fullname").value.trim();
        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value;

        // Lấy danh sách user từ localStorage (hoặc mảng trống nếu chưa có)
        let users = JSON.parse(localStorage.getItem("club_users")) || [];

        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            document.querySelector("#err-email").textContent = "Email này đã được đăng ký!";
            return;
        }

        // Tạo đối tượng user mới
        const newUser = {
            id: Date.now(),
            fullname: fullname,
            email: email,
            password: password,
            createdAt: new Date().toLocaleDateString()
        };

        // Lưu vào mảng và đẩy ngược lại localStorage
        users.push(newUser);
        localStorage.setItem("club_users", JSON.stringify(users));

        alert("Đăng ký thành công! Vui lòng tiến hành đăng nhập.");
        window.location.href = "login.html";
    });
}

// --- XỬ LÝ ĐĂNG NHẬP ---
const loginForm = document.querySelector("#form-login");
if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const email = document.querySelector("#login-email").value.trim();
        const password = document.querySelector("#login-password").value;

        // Tài khoản Admin cứng để kiểm tra nhanh (hoặc có thể cấu hình lưu sẵn vào localStorage)
        if (email === "admin@club.com" && password === "admin123") {
            const adminUser = { fullname: "Quản trị viên", email: email, role: "admin" };
            sessionStorage.setItem("currentUser", JSON.stringify(adminUser));
            alert("Đăng nhập quyền Quản trị thành công!");
            window.location.href = "admin.html";
            return;
        }

        // Kiểm tra với danh sách user trong localStorage
        let users = JSON.parse(localStorage.getItem("club_users")) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            document.querySelector("#err-login").textContent = "Sai email hoặc mật khẩu!";
            return;
        }

        // Lưu phiên làm việc hiện tại vào sessionStorage
        sessionStorage.setItem("currentUser", JSON.stringify({ ...user, role: "user" }));
        alert("Đăng nhập thành công!");
        window.location.href = "schedule.html"; // Chuyển đến trang đăng ký lịch đánh
    });
}