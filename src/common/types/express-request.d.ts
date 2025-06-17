// src/types/express-request.d.ts

declare namespace Express {
  interface User {
    // Trường chung cho cả User và Admin
    uuid: string; // Đây sẽ là user.uuid hoặc admin.uuid (phải thống nhất trong payload JWT)
    email: string; // user.emailUser hoặc admin.account
    role: number; // user.role (mặc định -1) hoặc admin.power (0, 1, 2...)

    // Các trường chỉ có ở User entity (và có thể không có khi là Admin)
    isVerified?: boolean; // Chỉ User có isVerified

    // Các trường chỉ có ở Admin entity (và có thể không có khi là User)
    nameAdmin?: string; // Tên của Admin
    isLogin?: boolean; // Trạng thái đăng nhập của Admin (tùy nếu cần dùng)
    cancelRole?: boolean; // Trạng thái hủy quyền của Admin (tùy nếu cần dùng)

    // Lưu ý: Các trường này là OPTIONAL (?) vì không phải lúc nào cũng có
    // (ví dụ: khi là một User bình thường thì không có nameAdmin, isLogin, cancelRole)
  }
  interface Request {
    user?: User;
  }
}