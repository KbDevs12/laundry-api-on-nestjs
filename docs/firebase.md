# Firebase Auth

Authentication menggunakan Firebase Auth.

Backend tidak menangani:

- register email
- login email
- reset password
- verifikasi email

Semua dilakukan oleh Firebase Auth.

## Flow register

```text
Mobile register ke Firebase Auth
    -> Firebase membuat user
    -> mobile login
    -> mobile mendapat Firebase ID Token
    -> mobile call backend
    -> backend upsert profile
```

## Flow Login

```text
Mobile login ke Firebase Auth
    -> mobile mendapat Firebase ID Token
    -> mobile kirim token ke backend
    -> backend verifikasi token
    -> backend load profile
    -> backend return profile + role
```

## Firebase Admin

Backend menggunakan firebase-admin untuk:

- verify ID token
- kirim FCM

Konfigurasi Firebase Admin diambil dari environment variable:

```text
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

## Keamanan

- Service account hanya boleh ada di backend.
- Mobile tidak boleh mengakses service account.
- Password tidak disimpan di database aplikasi.
- Role user diambil dari database, bukan dari client.
