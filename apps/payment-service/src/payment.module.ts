import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';
import { PaymentGrpcController } from './payment.grpc';
@Module({
  imports:[TypeOrmModule.forFeature([Payment])],
  providers:[PaymentService],
  controllers:[PaymentGrpcController]
})
export class PaymentModule {}
