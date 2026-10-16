# Environment Variable

Semua environment variable wajib dicontohkan di `.env.example`.

File `.env` tidak boleh di-commit.

## App

| Variable   | Contoh      | Deskripsi            |
| ---------- | ----------- | -------------------- |
| NODE_ENV   | development | Environment aplikasi |
| PORT       | 3000        | Port API             |
| API_PREFIX | /api/v1     | Prefix endpoint      |

## Database Supabase

| Variable     | Deskripsi                       |
| ------------ | ------------------------------- |
| DATABASE_URL | Connection string utama Prisma  |
| DIRECT_URL   | Direct connection untuk migrate |

## Firebase Admin

| Variable              | Deskripsi                    |
| --------------------- | ---------------------------- |
| FIREBASE_PROJECT_ID   | Firebase project ID          |
| FIREBASE_CLIENT_EMAIL | Service account client email |
| FIREBASE_PRIVATE_KEY  | Service account private key  |

## FCM

| Variable              | Deskripsi                 |
| --------------------- | ------------------------- |
| FCM_DEFAULT_TITLE     | Judul default notifikasi  |
| FCM_DEFAULT_IMAGE_URL | Gambar default notifikasi |

## QRIS

| Variable               | Deskripsi                        |
| ---------------------- | -------------------------------- |
| QRIS_STATIC_STRING     | String QRIS statis dari merchant |
| QRIS_EXPIRE_IN_SECONDS | Durasi expiry QRIS/payment       |

## Contoh `.env.example`

```env
NODE_ENV=development
PORT=3000
API_PREFIX=/api/v1

DATABASE_URL="postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres?schema=public"
DIRECT_URL="postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres?schema=public"

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=path/to/service-account-file

FCM_DEFAULT_TITLE="Laundry App"
FCM_DEFAULT_IMAGE_URL=

QRIS_STATIC_STRING=
QRIS_EXPIRE_IN_SECONDS=3600
```
