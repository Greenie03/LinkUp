import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { SignInDto } from "src/dto/sign-in.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post("signup")
  async signUp(@Body() body: SignInDto) {
      return this.authService.signup(body)
  }
}