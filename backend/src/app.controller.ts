import { Body, Controller, Get, Post, Param, Query, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { User } from './entity/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly userService: UserService
  ) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  async getCurrentUser(@Request() req): Promise<User|undefined> {
    const user = await this.userService.getUserById(req.user.userId);
    return user;
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("me/connections")
  getCurrentUsersConnections(@Request() req): string {
    return "/me/connections : Successful endpoint!";
  }
  
  @UseGuards(AuthGuard("jwt"))
  @Get("users")
  async getAllUsers(): Promise<User[]> {
    const users = await this.userService.getAllUsers();
    return users
  }
  
  @UseGuards(AuthGuard("jwt"))
  @Get("users/:id")
  async getUser(@Param('id') id: string): Promise<User | undefined> {
    const user = await this.userService.getUserById(id)
    return user
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("search")
  async search(@Query('q') q: string): Promise<User[]> {
    const res = await this.userService.search(q)
    return res
  }

}
