import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [],
})
export class AppModule {}
