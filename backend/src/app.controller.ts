import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { User } from './entity/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly userService: UserService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("me")
  getCurrentUser(): User|undefined {
    const user = this.userService.getUserById('1');
    return user;
  }

  @Get("me/connections")
  getCurrentUsersConnections(): string {
    return "/me/connections : Successful endpoint!";
  }
  
  @Get("users")
  getAllUsers(): User[] {
    return this.userService.getAllUsers();
  }
  
  @Get("users/:id")
  getUser(@Param('id') id: string): string {
    return "/users/"+ id + " : Successful endpoint!";
  }
}
