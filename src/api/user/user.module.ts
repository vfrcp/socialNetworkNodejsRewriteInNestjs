import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlockedUser, Subscriber, User } from "./user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, BlockedUser, Subscriber])],
  providers: [UserService],
  controllers: [UserController],
})

export class UsersModule {}