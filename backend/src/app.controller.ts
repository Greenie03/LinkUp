import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("me")
  getCurrentUser(): string {
    return "/me : Successful endpoint!";
  }

  @Get("me/connections")
  getCurrentUsersConnections(): string {
    return "/me/connections : Successful endpoint!";
  }
  
  @Get("users")
  getAllUsers(): string {
    return "/users : Successful endpoint!";
  }
  
  @Get("users/:id")
  getUser(@Param('id') id: string): string {
    return "/users/"+ id + " : Successful endpoint!";
  }
}
