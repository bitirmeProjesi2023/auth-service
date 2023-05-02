import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthGuard } from './auth.guard';
import { User } from 'src/users/users.entity';


@Module({
    imports: [UsersModule, JwtModule.register(
        {
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' }
        }
    )],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService]

})
export class AuthModule { }
