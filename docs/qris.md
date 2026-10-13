# QRIS

Pembayaran hanya menggunakan QRIS.

Flow yang dipakai adalah:

```text
QRIS statis -> QRIS dynamic -> manual confirmation
```

## Sumber QRIS

QRIS statis disimpan di environment variable:

```text
QRIS_STATIC_STRING
```

QRIS statis tidak disimpan di database.

## Dynamic QRIS

QRIS dynamic dibuat dengan cara:

- Hapus 4 karakter terakhir dari QRIS statis, yaitu CRC lama.
- Ubah indikator statis 010211 menjadi dinamis 010212.
- Sisipkan tag amount 54 sebelum country code 5802ID.
- Hitung ulang CRC16.
- Append CRC16 baru.

## CRC16

CRC16 yang digunakan:

```text
CRC-16/CCITT-FALSE
Polynomial: 0x1021
Initial: 0xFFFF
Output: 4 digit hex uppercase
```

## Penyimpanan

String `QRIS dynamic` tidak disimpan di database.
QRIS hanya dikirim sebagai response saat client mengambil detail payment.

## Konfirmasi pembayaran

Tidak ada webhook.
Konfirmasi pembayaran dilakukan manual oleh **ADMIN** atau **SUPERADMIN**.
Endpoint konfirmasi:

```text
POST /admin/payments/:id/confirm
```

## Expiry

Payment memiliki expiry.
Durasi default `3600 seconds` dapat diatur melalui `QRIS_EXPIRE_IN_SECONDS` di **.env**
