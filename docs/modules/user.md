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

Endpoint:

```text
POST /api/users
```

Body Request :

```json
  {
    "email": "test@example.com"
    "fullName": "Budi Santoso"
    "phone": "08123456789"
  }
```

Response :

```json
{
  "data": {
    "status": "Ok",
    "message": "Akun berhasil dibuat"
  }
}
```

### Test case

| Case                | Request                                 | Expected                                             |
| ------------------- | --------------------------------------- | ---------------------------------------------------- |
| Request tidak valid | email, fullName, phone, password kosong | `400`, `errors` terisi                               |
| Register berhasil   | data valid                              | `201`, `data.status = "Ok"`, profile tersimpan di DB |
| Email sudah dipakai | email yang sama dengan test sebelumnya  | `400`, `errors` terisi                               |

## Login

login dilakukan di Firebase Auth

```text
Mobile login ke Firebase Auth
    -> mobile mendapat Firebase ID Token
    -> backend verifikasi token
    -> backend load profile
    -> backend return profile + role
```

Endpoint:

```text
POST /api/users/login
```

Body Request :

```json
{
  "idToken": "<Firebase IdToken>"
}
```

Response :

```json
{
  "data": {
    "status": "Ok",
    "message": "Login berhasil.",
    "profile": {
      "email": "test@example.com",
      "fullName": "Test User",
      "phone": "+6283847905954",
      "role": "USER"
    }
  }
}
```

### Test case

| Case                | Request                  | Expected                                                 |
| ------------------- | ------------------------ | -------------------------------------------------------- |
| idToken tidak valid | idToken: 'invalid-token' | `401`, `errors` terisi                                   |
| Login berhasil      | idToken dari firebase    | `200`, `data.status = "Ok"`, `data.profile.email` sesuai |

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
