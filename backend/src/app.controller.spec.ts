import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('me', () => {
    it('should return "/me : Successful endpoint!"', () => {
      expect(appController.getCurrentUser()).toBe('/me : Successful endpoint!');
    });
  });
  describe('me/connections', () => {
    it('should return "/me/connections : Successful endpoint!"', () => {
      expect(appController.getCurrentUsersConnections).toBe('/me/connections : Successful endpoint!');
    });
  });

  describe('users', () => {
    it('should return "/users : Successful endpoint!"', () => {
      expect(appController.getAllUsers).toBe('/users : Successful endpoint!');
    });
  });

  describe('users/:id', () => {
    it('should return "/users/:id : Successful endpoint!" with :id being the parameter', (id: string) => {
      expect(appController.getUser(id)).toBe('/me' + id + ' : Successful endpoint!');
    });
  });
});
