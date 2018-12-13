import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy} from 'passport-google-oauth20';
import { AuthService, Provider } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor(private readonly authService: AuthService) {
        super({
            clientID: '652236810153-irmrjqchh7em0j609sfmthn804s42pce.apps.googleusercontent.com',
            clientSecret: 'gtdp5OLbsRv8vO-EF6Uc4ICK',
            callbackURL: 'http://localhost:3000/auth/google/callback',
            passReqToCallback: true,
            scope: ['profile'],
        });
    }

    async validate(request: any, accessToken: string, refreshToken: string, profile, done: Function) {
        try {
            console.log(profile);

            const jwt: string = await this.authService.validateOAuthLogin(profile.id, Provider.GOOGLE);
            const user = {
                jwt,
            };

            done(null, user);
        } catch (err) {
            done(err, false);
        }
    }
}
