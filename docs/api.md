# API Endpoint

Semua endpoint menggunakan prefix:

```text
/api/v1
```

Semua endpoint private membutuhkan header:

```text
Authorization: Bearer <firebase_id_token>
```

## 1. Auth / User

| Method | Endpoint                | Role                    | Deskripsi              |
| ------ | ----------------------- | ----------------------- | ---------------------- |
| GET    | `/users/me`             | USER, ADMIN, SUPERADMIN | Ambil profile sendiri  |
| PATCH  | `/users/me`             | USER, ADMIN, SUPERADMIN | Update profile sendiri |
| GET    | `/admin/users`          | ADMIN, SUPERADMIN       | Daftar user            |
| PATCH  | `/admin/users/:id/role` | SUPERADMIN              | Ubah role user         |

## 2. Address

| Method | Endpoint                 | Role                    | Deskripsi              |
| ------ | ------------------------ | ----------------------- | ---------------------- |
| GET    | `/addresses`             | USER, ADMIN, SUPERADMIN | List address sendiri   |
| POST   | `/addresses`             | USER, ADMIN, SUPERADMIN | Create address sendiri |
| PATCH  | `/addresses/:id`         | USER, ADMIN, SUPERADMIN | Update address sendiri |
| DELETE | `/addresses/:id`         | USER, ADMIN, SUPERADMIN | Delete address sendiri |
| PATCH  | `/addresses/:id/default` | USER, ADMIN, SUPERADMIN | Set default address    |
| GET    | `/admin/addresses`       | ADMIN, SUPERADMIN       | List semua address     |

## 3. Laundry Service

| Method | Endpoint                      | Role                    | Deskripsi                  |
| ------ | ----------------------------- | ----------------------- | -------------------------- |
| GET    | `/laundry-services`           | USER, ADMIN, SUPERADMIN | List layanan aktif         |
| GET    | `/admin/laundry-services`     | ADMIN, SUPERADMIN       | List semua layanan         |
| POST   | `/admin/laundry-services`     | ADMIN, SUPERADMIN       | Create layanan             |
| PATCH  | `/admin/laundry-services/:id` | ADMIN, SUPERADMIN       | Update layanan             |
| DELETE | `/admin/laundry-services/:id` | SUPERADMIN              | Nonaktifkan/delete layanan |

## 4. Order

| Method | Endpoint                   | Role                    | Deskripsi           |
| ------ | -------------------------- | ----------------------- | ------------------- |
| POST   | `/orders`                  | USER, ADMIN, SUPERADMIN | Create order        |
| GET    | `/orders`                  | USER, ADMIN, SUPERADMIN | List order sendiri  |
| GET    | `/orders/:id`              | USER, ADMIN, SUPERADMIN | Detail order        |
| POST   | `/orders/:id/cancel`       | USER, ADMIN, SUPERADMIN | Cancel order        |
| GET    | `/admin/orders`            | ADMIN, SUPERADMIN       | List semua order    |
| PATCH  | `/admin/orders/:id/status` | ADMIN, SUPERADMIN       | Update status order |

## 5. Payment

| Method | Endpoint                      | Role                    | Deskripsi              |
| ------ | ----------------------------- | ----------------------- | ---------------------- |
| POST   | `/orders/:orderId/payments`   | USER, ADMIN, SUPERADMIN | Create payment         |
| GET    | `/payments/:id`               | USER, ADMIN, SUPERADMIN | Detail payment + QRIS  |
| GET    | `/orders/:orderId/payments`   | USER, ADMIN, SUPERADMIN | List payment order     |
| POST   | `/admin/payments/:id/confirm` | ADMIN, SUPERADMIN       | Confirm payment manual |

## 6. Device Token

| Method | Endpoint                   | Role                    | Deskripsi          |
| ------ | -------------------------- | ----------------------- | ------------------ |
| GET    | `/me/device-tokens`        | USER, ADMIN, SUPERADMIN | List token sendiri |
| POST   | `/me/device-tokens`        | USER, ADMIN, SUPERADMIN | Register FCM token |
| DELETE | `/me/device-tokens/:token` | USER, ADMIN, SUPERADMIN | Hapus FCM token    |

## 7. Notification

Notification tidak memiliki endpoint publik utama.

Notifikasi dikirim secara internal oleh backend ketika terjadi event berikut:

- Order dibuat.
- Status order berubah.
- Payment dibuat.
- Payment dikonfirmasi.
