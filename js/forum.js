document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    const boxCreatePost = document.querySelector("#box-create-post");
    const loginWarning = document.querySelector("#login-warning");

    // Kiểm tra trạng thái hiển thị khung đăng bài
    if (currentUser) {
        if (boxCreatePost) boxCreatePost.style.display = "block";
        if (loginWarning) loginWarning.style.display = "none";
    }

    // Dữ liệu mẫu khởi tạo nếu chưa có bài viết nào trong localStorage
    if (!localStorage.getItem("club_posts")) {
        const now = Date.now();
        const samplePosts = [
            {
                id: now - 1200000,
                author: "Quản trị viên",
                role: "admin",
                title: "[THÔNG BÁO] Thay đổi lịch sinh hoạt tuần tới",
                content: "Tuần tới sân số 2 bảo trì hệ thống đèn, toàn bộ lịch đánh thứ 3 sẽ chuyển sang sân số 4 nhé các bạn!",
                createdAt: now - 1200000,
                isPinned: true,
                comments: [
                    { author: "Nguyễn Văn An", content: "Dạ em đã rõ, cảm ơn ban chủ nhiệm!", createdAt: now - 600000 }
                ]
            },
            {
                id: now - 7200000,
                author: "Trần Văn Bình",
                role: "user",
                title: "Tìm bạn đánh cặp đôi vào chiều thứ 5",
                content: "Nhóm mình đang thiếu 1 nam trình độ trung bình đánh giao lưu chiều thứ 5 tới, ai rảnh hú mình nha.",
                createdAt: now - 7200000,
                isPinned: false,
                comments: []
            }
        ];
        localStorage.setItem("club_posts", JSON.stringify(samplePosts));
    }

    // Hàm quy đổi thời gian thực (Time Ago)
    function timeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return "Vừa xong";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} phút trước`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} giờ trước`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days} ngày trước`;
        return new Date(timestamp).toLocaleDateString("vi-VN");
    }

    // Xử lý sự kiện đăng bài viết mới
    const formNewPost = document.querySelector("#form-new-post");
    if (formNewPost) {
        formNewPost.addEventListener("submit", (e) => {
            e.preventDefault();
            const title = document.querySelector("#post-title").value.trim();
            const content = document.querySelector("#post-content").value.trim();

            let posts = JSON.parse(localStorage.getItem("club_posts")) || [];

            const newPost = {
                id: Date.now(),
                author: currentUser.fullname,
                role: currentUser.role,
                title: title,
                content: content,
                createdAt: Date.now(),
                isPinned: false,
                comments: []
            };

            posts.unshift(newPost);
            localStorage.setItem("club_posts", JSON.stringify(posts));

            formNewPost.reset();
            renderPosts();
        });
    }

    // Hàm render danh sách bài viết ra giao diện
    window.renderPosts = function() {
        const feedContainer = document.querySelector("#forum-feed");
        if (!feedContainer) return;

        let posts = JSON.parse(localStorage.getItem("club_posts")) || [];
        feedContainer.innerHTML = "";

        // Sắp xếp: Bài ghim (isPinned = true) luôn được đẩy lên trên cùng
        posts.sort((a, b) => (b.isPinned === true) - (a.isPinned === true));

        posts.forEach((post) => {
            const postCard = document.createElement("div");
            postCard.className = `post-card ${post.isPinned ? 'pinned' : ''}`;

            let pinnedBadgeHtml = post.isPinned ? `<div class="pinned-badge" style="background: #ef4444; color: white; padding: 2px 8px; font-size: 0.75rem; border-radius: 4px; display: inline-block; margin-bottom: 8px; font-weight: bold;">📌 GHIM BỞI ADMIN</div>` : "";
            
            // Nếu là Admin, hiển thị thêm cụm nút chức năng Ghim/Bỏ ghim và Xóa bài
            let adminControls = "";
            if (currentUser && currentUser.role === "admin") {
                const pinText = post.isPinned ? "📍 Bỏ ghim" : "📌 Ghim tin";
                const pinClass = post.isPinned ? "btn-unpin" : "btn-pin";
                
                adminControls = `
                    <div style="margin-left: auto; display: flex; gap: 6px;">
                        <button onclick="togglePin(${post.id})" class="${pinClass}" style="background: #e2e8f0; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">${pinText}</button>
                        <button onclick="deletePost(${post.id})" style="background: #fee2e2; color: #dc2626; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; font-weight: bold;">🗑️ Xóa bài</button>
                    </div>
                `;
            }

            // Render danh sách bình luận kèm thời gian thực
            let commentsHtml = "";
            if (post.comments && post.comments.length > 0) {
                post.comments.forEach(c => {
                    const cTime = c.createdAt ? timeAgo(c.createdAt) : "";
                    commentsHtml += `<div class="comment-item" style="padding: 6px 0; border-bottom: 1px dashed #e2e8f0; font-size: 0.9rem;"><strong>${c.author}:</strong> ${c.content} <span style="font-size: 0.75rem; color: #94a3b8; float: right;">${cTime}</span></div>`;
                });
            }

            postCard.innerHTML = `
                ${pinnedBadgeHtml}
                <div class="post-header" style="display: flex; align-items: center; margin-bottom: 8px;">
                    <div>
                        <span class="post-author" style="font-weight: 600; color: #1a2e5a;">${post.author} ${post.role === 'admin' ? '👑' : ''}</span>
                        <span class="post-time" style="font-size: 0.85rem; color: #64748b; margin-left: 10px;">${timeAgo(post.createdAt)}</span>
                    </div>
                    ${adminControls}
                </div>
                <h3 style="color: #1a2e5a; font-size: 1.15rem; margin-bottom: 8px;">${post.title}</h3>
                <div class="post-content" style="color: #334155; line-height: 1.6; margin-bottom: 15px;">${post.content}</div>
                
                <div class="comment-section" style="border-top: 1px solid #e2e8f0; padding-top: 12px;">
                    <div class="comment-list" style="margin-bottom: 10px;">${commentsHtml || '<p style="color: #94a3b8; font-size: 0.85rem;">Chưa có bình luận nào.</p>'}</div>
                    ${currentUser ? `
                        <form class="comment-form" onsubmit="addComment(event, ${post.id})" style="display: flex; gap: 8px;">
                            <input type="text" placeholder="Viết bình luận của bạn..." required style="flex: 1; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 4px;">
                            <button type="submit" style="background: #1a2e5a; color: white; border: none; padding: 6px 14px; border-radius: 4px; cursor: pointer;">Gửi</button>
                        </form>
                    ` : '<p style="font-size: 0.85rem; color: #64748b; margin-top: 5px;">Đăng nhập để bình luận bài viết này.</p>'}
                </div>
            `;
            feedContainer.appendChild(postCard);
        });
    };

    // 🌟 1. Hàm xử lý Ghim / Bỏ ghim bài viết
    window.togglePin = function(postId) {
        let posts = JSON.parse(localStorage.getItem("club_posts")) || [];
        posts = posts.map(p => {
            if (p.id === postId) {
                p.isPinned = !p.isPinned; // Đổi trạng thái từ true thành false và ngược lại
            }
            return p;
        });
        localStorage.setItem("club_posts", JSON.stringify(posts));
        renderPosts();
    };

    // 🌟 2. Hàm xử lý Xóa bài viết rác / bài vi phạm (Chỉ Admin mới có quyền)
    window.deletePost = function(postId) {
        if (confirm("Bạn có chắc chắn muốn xóa vĩnh viễn bài đăng này không?")) {
            let posts = JSON.parse(localStorage.getItem("club_posts")) || [];
            // Lọc bỏ bài viết có id khớp
            posts = posts.filter(p => p.id !== postId);
            localStorage.setItem("club_posts", JSON.stringify(posts));
            renderPosts();
        }
    };

    // Hàm thêm bình luận
    window.addComment = function(e, postId) {
        e.preventDefault();
        const input = e.target.querySelector("input");
        const commentText = input.value.trim();
        if (!commentText) return;

        let posts = JSON.parse(localStorage.getItem("club_posts")) || [];
        posts = posts.map(p => {
            if (p.id === postId) {
                if (!p.comments) p.comments = [];
                p.comments.push({
                    author: currentUser.fullname,
                    content: commentText,
                    createdAt: Date.now()
                });
            }
            return p;
        });

        localStorage.setItem("club_posts", JSON.stringify(posts));
        renderPosts();
    };

    renderPosts();
});