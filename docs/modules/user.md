# User / Profile Module

## Deskripsi

Module user menangani profile user aplikasi laundry.

Authentication dilakukan oleh Firebase Auth.

Backend tidak menyimpan password.

## Sumber data

| Sumber        | Data                           |
| ------------- | ------------------------------ |
| Firebase Auth | uid, email, status login       |
| Supabase      | profile, role, fullName, phone |

## Role

- USER
- ADMIN
- SUPERADMIN

## Fitur

### Register

Register dilakukan melalui Firebase Auth.

Backend tidak menyediakan endpoint password register.

Flow:

```text
Mobile register ke Firebase Auth
    -> Firebase membuat user
    -> mobile login
    -> mobile kirim Firebase ID Token
    -> backend upsert profile
```

## Login

login dilakukan di Firebase Auth

```text
Mobile login ke Firebase Auth
    -> mobile mendapat Firebase ID Token
    -> backend verifikasi token
    -> backend load profile
    -> backend return profile + role
```

## Get profile (own)

Endpoint:

```text
GET /users/me
```

Role: `USER, ADMIN, SUPERADMIN`.

## Update profile

Endpoint:

```text
PATCH /users/me
```

Role: `USER, ADMIN, SUPERADMIN`.

Contoh Request Body:

```json
{
  "fullName": "Budi Santoso",
  "phone": "08123456789"
}
```

## List user

Endpoint:

```text
GET /admin/users
```

Role: `ADMIN, SUPERADMIN`.

## Update role user

Endpoint:

```text
PATCH /admin/users/:id/role
```

Role: `SUPERADMIN`.

Contoh Request Body:

```json
{
  "role": "ADMIN"
}
```

## Access Matrix

| Action                 | USER | ADMIN | SUPERADMIN |
| ---------------------- | ---- | ----- | ---------- |
| Register via Firebase  | yes  | yes   | yes        |
| Login via Firebase     | yes  | yes   | yes        |
| Get own profile        | yes  | yes   | yes        |
| Update own profile     | yes  | yes   | yes        |
| List all users         | no   | yes   | yes        |
| Update user role       | no   | no    | yes        |
| Register own FCM token | yes  | yes   | yes        |
