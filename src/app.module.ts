import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { FirebaseModule } from './firebase/firebase.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [CommonModule, FirebaseModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
