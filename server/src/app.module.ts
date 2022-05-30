import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SumModule } from './sum/sum.module';
import { AutoModule } from './auto/auto.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // so that we can pull in config
    AuthModule,
    SumModule,
    AutoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}