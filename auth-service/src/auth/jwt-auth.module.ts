import { Module } from "@nestjs/common";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    PassportModule,
    NestJwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: "1d" },
      }),
    }),
  ],
  providers: [JwtStrategy],
  exports: [PassportModule, NestJwtModule],
})
export class JwtAuthModule {}
