import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [CommonModule, FirebaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
