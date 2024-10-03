import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from './users/users.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin',
      database: 'nestdb',
      entities: [ __dirname + '/**/*.entity{.ts,.js}' ],
      synchronize: true
    }), 
    UsersModule, PostModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
