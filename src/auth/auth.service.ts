import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { jwtConstants } from './constants';
import { SignUpDto } from './dtos/signUp.dto';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService,
        private jwtService: JwtService) { }

    async signIn(email: string, pass: string) {
        const user = await this.userService.findOneByEmailAndPassword(email, pass);
        if (user === null || user?.password != pass) {
            throw new UnauthorizedException();
        }
        const token = await this.createTokenFromUsernameAndId(user.user_id, user.username);
        return { token: token.accessToken, username: user.username, userId: user.user_id };
    }


    async createTokenFromUsernameAndId(user_id: string, username: string) {
        const payload = { username, user_id };
        return {
            accessToken: await this.jwtService.signAsync(payload, { secret: jwtConstants.secret, }),
        };
    }

    async signUp(signUpDto: SignUpDto) {
        const user = await this.userService.signUp(signUpDto.username, signUpDto.password, signUpDto.email);
        const token = await this.createTokenFromUsernameAndId(user.user_id, user.username);
        try {
            await axios.post(`http://127.0.0.1:4000/ethereum/create`, null, { headers: { Authorization: `Bearer ${token.accessToken}` } })
        }
        catch (err) {
            console.log(err);
        }
        return { token: token.accessToken, username: user.username, userId: user.user_id };
    }
}
