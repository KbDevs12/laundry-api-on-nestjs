# Skema Database

Database menggunakan Supabase dan dikelola dengan Prisma.

Sumber Schema utama:

```text
prisma/schema.prisma
```

| Tabel                  | Deskripsi                      |
| ---------------------- | ------------------------------ |
| profiles               | Data user dan role             |
| addresses              | Alamat user                    |
| services               | Daftar layanan laundry         |
| orders                 | Transaksi laundry              |
| order_items            | Detail item dalam order        |
| order_status_histories | Riwayat perubahan status order |
| payments               | Pembayaran QRIS                |
| device_tokens          | Token FCM milik user           |

## Catatan

profiles.id menggunakan Firebase UID.
tipe:

```text
String
```

bukan UUID.

Rule:

```text
total = subtotal - discount
```

Pembayaran QRIS manual
Tabel payment hanya menyimpan:

```text
amount
method
status
expiresAt
paidAt
```

Tidak menyimpan:

```text
qrisPayload
webhookPayload
externalId
```

Snapshot data
Order item menyimpan snapshot:

```text
name
unit
unitPrice
```

Order menyimpan snapshot alamat:

```text
pickupAddressLine
deliveryAddressLine
```

Tujuannya agar histori transaksi tidak berubah ketika master service atau address diubah.
