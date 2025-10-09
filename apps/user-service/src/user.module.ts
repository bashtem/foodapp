import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";
import { UserGrpcController } from "./user.grpc";
import { KYC } from "./entities/kyc.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, KYC])],
  providers: [UserService],
  controllers: [UserGrpcController],
})

export class UserModule {}
