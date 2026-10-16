# RDAC

RDAC digunakan untuk kontrol akses berbasis role.

## Role

| Role       | Deskripsi                   |
| ---------- | --------------------------- |
| USER       | Customer laundry            |
| ADMIN      | Operasional laundry         |
| SUPERADMIN | Owner atau pengelola sistem |

## Sumber role

Role user disimpan di table:

```text
profiles
```

Field `role`.

## Flow access control

```text
Firebase ID Token
    -> diverifikasi backend
    -> profile user diload
    -> role user diambil dari database
    -> RDAC guard mengecek akses endpoint
```

## Access matrix global

| Module               | USER | ADMIN   | SUPERADMIN |
| -------------------- | ---- | ------- | ---------- |
| Profile sendiri      | yes  | yes     | yes        |
| Manage user          | no   | limited | yes        |
| Address sendiri      | yes  | yes     | yes        |
| Read all addreesses  | no   | yes     | yes        |
| Read active services | yes  | yes     | yes        |
| Manage services      | no   | yes     | yes        |
| Create order         | yes  | yes     | yes        |
| Read own order       | yes  | yes     | yes        |
| Read all orders      | no   | yes     | yes        |
| Update order status  | no   | yes     | yes        |
| Create payment       | yes  | yes     | yes        |
| Confirm payment      | no   | yes     | yes        |
| Register FCM token   | yes  | yes     | yes        |

## Catatan

- Role tidak boleh dipercaya dari client.
- Role harus selalu diambil dari database.
- Perubahan role hanya boleh dilakukan oleh **SUPERADMIN**.
