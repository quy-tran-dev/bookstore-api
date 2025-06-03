export interface JwtPayload {
  userId: string;
  email: string;
  // Bạn có thể thêm các thông tin khác như vai trò (role) nếu cần
  role?: string;
}
