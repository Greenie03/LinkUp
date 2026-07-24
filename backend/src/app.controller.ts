import { Controller, Get, Param, Query } from '@nestjs/common';
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
  async getCurrentUser(): Promise<User|undefined> {
    const user = await this.userService.getUserById('4:28e371ef-4377-4f2b-a2b3-b059cc1e974b:0');
    return user;
  }

  @Get("me/connections")
  getCurrentUsersConnections(): string {
    return "/me/connections : Successful endpoint!";
  }
  
  @Get("users")
  async getAllUsers(): Promise<User[]> {
    const users = await this.userService.getAllUsers();
    return users
  }
  
  @Get("users/:id")
  async getUser(@Param('id') id: string): Promise<User | undefined> {
    const user = await this.userService.getUserById(id)
    return user
  }

  @Get("search")
  async search(@Query('q') q: string): Promise<User[]> {
    const res = await this.userService.search(q)
    return res
  }
}
