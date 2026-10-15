import z from 'zod';

export class UserValidation {
  static readonly REGISTER = z.object({
    email: z
      .email()
      .min(1, { message: 'Email wajib diisi.' })
      .max(100, { message: 'Email maksimal 100 Karakter.' }),
    fullName: z
      .string()
      .min(1, { message: 'Nama lengkap wajib diisi.' })
      .max(100, { message: 'Nama lengkap maksimal 100 Karakter.' }),
    phone: z
      .string()
      .trim()
      .min(10, { message: 'Nomor HP minimal 10 angka' })
      .max(14, { message: 'Nomor HP maksimal 14 angka' })
      .regex(/^(?:\+62|62|0)8[1-9][0-9]{7,11}$/, {
        message:
          'Format nomor HP Indonesia tidak valid (harus diawali 08, 628, atau +628)',
      }),
    password: z
      .string()
      .min(8, { message: 'Password minimal 8 karakter' })
      .max(32, { message: 'Password maksimal 32 karakter' })
      .regex(/[a-z]/, {
        message: 'Password harus mengandung setidaknya satu huruf kecil',
      })
      .regex(/[A-Z]/, {
        message: 'Password harus mengandung setidaknya satu huruf besar',
      })
      .regex(/[0-9]/, {
        message: 'Password harus mengandung setidaknya satu angka',
      })
      .regex(/[^a-zA-Z0-9]/, {
        message:
          'Password harus mengandung setidaknya satu simbol (karakter spesial)',
      }),
  });

  static readonly LOGIN = z.object({
    idToken: z.string().min(1, { message: 'Token tidak boleh kosong.' }),
  });
}
