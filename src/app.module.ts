import { AppController } from "@app/app.controller";
import { AppService } from "@app/app.service";
import { Candidate } from "@app/candidate.entity";
import { DatabaseModule } from "@app/database/database.module";
import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    ConfigModule.forRoot(),
    // DatabaseModule,
    // TypeOrmModule.forFeature([Candidate]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true }),
    },
  ],
})
export class AppModule {}
