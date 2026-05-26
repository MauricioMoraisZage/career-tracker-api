import { AppError } from "../errors/app-error.js";
import { UserRepository } from "../repositories/user.repository.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { signAccessToken } from "../utils/jwt.js";
import type { LoginInput, RegisterInput } from "../validations/auth.schema.js";

const userRepository = new UserRepository();

export class AuthService {
  async register(data: RegisterInput) {
    const userAlreadyExists = await userRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new AppError("Email is already in use", 409);
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return user;
  }

  async login(data: LoginInput) {
    const user = await userRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const passwordMatches = await comparePassword(data.password, user.password);

    if (!passwordMatches) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = signAccessToken({
      sub: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}