document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    const navAuthLink = document.querySelector("#nav-auth-link");

    if (currentUser && navAuthLink) {
        navAuthLink.textContent = `Xin chào, ${currentUser.fullname}`;
        navAuthLink.href = currentUser.role === 'admin' ? "admin.html" : "schedule.html";
    }
});