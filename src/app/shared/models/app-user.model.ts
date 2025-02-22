export interface AppUser {
  uid: string;
  email: string | null;
  role: string; // 'client', 'admin', etc.
  // Можно добавить другие поля: fio, phone, address, ...
}
