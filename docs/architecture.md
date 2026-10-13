# Arsitektur Sistem

## Gambaran umum

Aplikasi laundry terdiri dari:

1. Mobile app untuk customer dan admin.
2. Backend NestJS sebagai API.
3. Supabase PostgreSQL sebagai database utama.
4. Firebase Auth sebagai penyedia autentikasi.
5. Firebase Cloud Messaging sebagai penyedia push notification.

## Flow autentikasi

```text
Mobile app
    -> login/register via Firebase Auth
    -> mendapatkan Firebase ID Token
    -> kirim request ke backend dengan header Authorization Bearer
    -> backend verifikasi token menggunakan firebase-admin
    -> backend load profile user dari database
    -> backend cek role user melalui RDAC
```

## Flow Transaksi laundry

```text
User membuat order
    -> Admin memproses order
    -> Status order berubah
    -> sistem mengirim notifikasi FCM
```

## Flow Pembayaran QRIS

```text
User request pembayaran
  -> backend membuat Payment dengan status PENDING
  -> backend generate QRIS dynamic dari QRIS statis
  -> backend mengirim string QRIS ke mobile
  -> mobile menampilkan QR
  -> user membayar
  -> admin mengecek mutasi secara manual
  -> admin confirm payment
  -> payment menjadi PAID
  -> order paymentStatus menjadi PAID
```

## Catatan

- tidak ada webhook payment.
- QRIS dynamic digenerate on-the-fly.
- string QRIS tidak disimpan di database.
- konfirmasi pembayaran dilakukan manual oleh **ADMIN** atau **SUPERADMIN**
