// src/types/express-request.d.ts
// Hoặc src/common/types/express-request.d.ts

// Để mở rộng interface Request từ 'express'
declare namespace Express {
  interface Request {
    // Định nghĩa thuộc tính 'user' mà Passport thêm vào
    // Kiểu của 'user' phải khớp với kiểu mà JwtStrategy của bạn trả về từ hàm validate()
    // Nếu JwtStrategy trả về User entity của bạn:
    user?: import('../entities/auth/user.entity').User; // <-- Đảm bảo đường dẫn này đúng
    // Hoặc nếu validate() trả về một payload đơn giản (ví dụ: { userId: string, email: string }):
    // user?: { userId: string; email: string };
    // Hoặc nếu bạn muốn một kiểu generic hơn:
    // user?: any; // Ít khuyến khích vì mất type safety
  }
}