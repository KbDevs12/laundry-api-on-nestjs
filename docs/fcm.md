# Firebase Cloud Messaging

FCM digunakan untuk mengirim push notification ke user.

## Device token

Setiap user yang login dapat mendaftarkan FCM token.

Endpoint:

```text
POST /me/device-tokens
```

Body :

```json
{
  "token": "fcm_token",
  "platform": "android"
}
```

## Event notifikasi

Notifikasi dikirim saat:

- order dibuat
- status order berubah
- pembayaran dibuat
- pembayaran dikonfirmasi
- pembayaran expired

## Target notifikasi

| Role       | Target                                 |
| ---------- | -------------------------------------- |
| USER       | Notifikasi transaksi miliknya          |
| ADMIN      | Notifikasi operasional jika diperlukan |
| SUPERADMIN | Notifikasi sistem jika diperlukan      |

## Aturan

- Token FCM bisa berubah, sehingga harus bisa di-update.
- Token invalid harus dinonaktifkan.
- Payload notifikasi tidak boleh berisi data sensitif.
