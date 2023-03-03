import { Controller, Get, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRegisterDto } from "./user.dto";

@Controller("/user")
export class UserController {
  constructor(
    private userService: UserService
    ) {}
  @Post("/register") 
  register(@Body() dto: UserRegisterDto) {
    return this.userService.register(dto)
  }
}