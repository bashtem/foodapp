import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { UserService } from "./user.service";
@Controller()
export class UserGrpcController {
  
  constructor(private svc: UserService) {}

  @GrpcMethod("UserService", "CreateUser") create(d: any) {
    return this.svc.create(d);
  }
  @GrpcMethod("UserService", "GetUser") get(d: any) {
    return this.svc.get(d.id);
  }
  @GrpcMethod("UserService", "FindByEmail") find(d: any) {
    return this.svc.findByEmail(d.email);
  }
}
