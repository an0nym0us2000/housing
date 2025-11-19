import { Injectable } from '@nestjs/common';

// Temporary in-memory storage (will be replaced with Prisma)
interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: string;
  phone?: string;
  createdAt: Date;
}

@Injectable()
export class UsersService {
  private users: User[] = [];

  async create(data: Partial<User>): Promise<User> {
    const user: User = {
      id: Date.now().toString(),
      email: data.email!,
      name: data.name!,
      password: data.password!,
      role: data.role || 'buyer',
      phone: data.phone,
      createdAt: new Date(),
    };

    this.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }
}
