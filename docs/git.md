# Git Workflow

## Aturan utama

- Setiap perubahan wajib memiliki git commit yang jelas.
- Commit harus menggunakan conventional commit.
- Satu commit sebaiknya berisi satu perubahan kecil.
- Perubahan endpoint, schema, role access, atau flow wajib update docs.

## Format commit

```text
type(scope): description / type: description
```

| Type     | Deskripsi                       |
| -------- | ------------------------------- |
| feat     | fitur baru                      |
| fix      | perbaikan bug                   |
| docs     | perubahan dokumentasi           |
| chore    | maintenace/config               |
| refactor | refactor tanpa merubah behavior |
| test     | penambahan/perbaikan test       |
| perf     | perubahan performance           |

### Contoh Commit

```text
feat(auth): add firebase auth guard
feat(rdac): add role access control guard
feat(qris): add dynamic qris converter
docs(payment): update qris manual confirmation flow
fix(order): prevent cancel paid order
chore(env): add qris static string example
```

## Branch

| Branch      | Fungsi        |
| ----------- | ------------- |
| main        | Branch Utama  |
| feature/xxx | fitur baru    |
| fix/xxx     | perbaikan bug |
| docs/xxx    | dokumentasi   |

### Contoh

```text
git checkout -b feature/firebase-auth
git checkout -b feature/qris-payment
git checkout -b docs/payment-manual
```

## Aturan docs

jika ada perubahan:

- schema database
- endpoint
- role access
- flow pembayaran
- flow auth
- flow notifikasi

Maka docs terkait wajib ikut diubah dalam commit yang sama atau commit lanjutan dengan scope `docs`
