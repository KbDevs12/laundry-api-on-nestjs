import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import { FirebaseAdminService } from '../src/firebase/firebase-admin.service';

@Injectable()
export class TestService {
  constructor(
    private prismaService: PrismaService,
    private admin: FirebaseAdminService,
  ) {}

  async deleteUser(email: string) {
    await this.prismaService.profile.deleteMany({ where: { email } });

    try {
      const user = await this.admin.getAuth().getUserByEmail(email);
      await this.admin.getAuth().deleteUser(user.uid);
    } catch {}
  }

  async createUser(data: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
  }) {
    const { password, ...profile } = data;
    const user = await this.admin.getAuth().createUser({
      email: data.email,
      password,
      phoneNumber: data.phone,
    });
    await this.prismaService.profile.create({
      data: { id: user.uid, ...profile },
    });
    return user;
  }

  async getUser(email: string) {
    return this.prismaService.profile.findFirst({ where: { email } });
  }
}
