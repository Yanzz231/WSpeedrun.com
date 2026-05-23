// Module
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

// Service
import { PrismaService } from "../prisma/prisma.service";

// DTO
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

type JwtPayload = {
  sub: string;
  role: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    await this.prisma.users.create({
      data: {
        username: dto.username,
        email: dto.email,
        country: dto.country,
        password: hashedPassword,
      },
    });

    return { message: "User registered successfully" };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload: JwtPayload = { sub: user.user_id, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }
}
