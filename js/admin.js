document.addEventListener("DOMContentLoaded", function () {
    // 🛡️ 1. Kiểm tra bảo mật Admin qua sessionStorage
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") {
        alert("Cảnh báo: Bạn không có quyền truy cập trang quản trị!");
        window.location.href = "login.html";
        return;
    }

    // Xử lý đăng xuất
    const logoutBtn = document.querySelector("#btn-logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            sessionStorage.removeItem("currentUser");
            window.location.href = "login.html";
        });
    }

    // 2. Render danh sách tài khoản thành viên kèm mật khẩu
    function renderUsers() {
        const tbody = document.querySelector("#user-table-body");
        if (!tbody) return;
        const users = JSON.parse(localStorage.getItem("club_users")) || [];
        
        let html = `
            <tr>
                <td>Quản trị viên hệ thống</td>
                <td>admin@club.com</td>
                <td><code>admin123</code></td>
                <td><span class="badge" style="background: #e0e7ff; color: #3730a3;">Admin</span></td>
            </tr>
        `;

        users.forEach((u) => {
            html += `
                <tr>
                    <td>${u.fullname || "Thành viên"}</td>
                    <td>${u.email}</td>
                    <td><code>${u.password}</code></td>
                    <td><span class="badge" style="background: #f1f5f9; color: #475569;">User</span></td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }

    renderUsers();
});