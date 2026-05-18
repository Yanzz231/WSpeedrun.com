import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ description: "User registered successfully." })
  @ApiBadRequestResponse({ description: "Validation failed or email exists." })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  @ApiOperation({ summary: "Login and receive JWT token" })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: "JWT access token returned." })
  @ApiUnauthorizedResponse({ description: "Invalid credentials." })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
