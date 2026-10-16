# Dokumentasi Laundry API

Dokumentasi ini adalah sumber kebenaran untuk pengembangan backend aplikasi Laundry.

### Stack

- Backend: NestJS
- Database: Supabase
- ORM: Prisma
- Auth: Firebase Auth
- Push Notification: Firebase Cloud Messaging
- Payment: QRIS Manual Confirmation
- Access Control: RDAC (User, Admin, Superadmin)

### Prinsip Utama

- Auth dilakukan oleh Firebase Auth.
- Backend tidak menyimpan password.
- Backend memverifikasi Firebase ID Token.
- Role user diambil dari database.
- Pembyaran QRIS bersifat Manual Confirmation.
- QRIS dynamic tidak disimpan di database.
- Setiap perubahan schema, endpoint, role access, atau flow wajib update docs.

## Daftar Dokumen

| Dokumen         | Deskripsi                        |
| --------------- | -------------------------------- |
| architecture.md | Arsitektur umum sistem           |
| database.md     | Ringkasan schema database        |
| env.md          | Environment variable             |
| git.md          | Aturan git dan commit            |
| firebase.md     | Auth Firebase dan Firebase Admin |
| fcm.md          | Push notification FCM            |
| supabase.md     | Konfigurasi database Supabase    |
| qris.md         | QRIS dynamic manual confirmation |
| rdac.md         | Role dan access control          |
| api.md          | Daftar endpoint API              |
| modules/*.md    | Dokumentasi tiap module/schema   |
