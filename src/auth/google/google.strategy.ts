import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {AuthService, Provider} from '../auth.service';
import {googleAPI} from "../../config/key/keyAuth";

import {Profile, Strategy, StrategyOptionWithRequest, VerifyFunctionWithRequest,} from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    // Facebook strategy should be pretty much the same
    constructor(private authService: AuthService) {
        super(
            <StrategyOptionWithRequest>{
                clientID: googleAPI.clientID,
                clientSecret: googleAPI.clientSecret,
                callbackURL: 'http://localhost:3000/auth/google/callback',
                passReqToCallback: true,
                scope: ['profile']
            },
            <VerifyFunctionWithRequest>(async (req,     // express request object
                                               access,  // access token from Google
                                               refresh, // refresh token from Google
                                               profile, // user profile, parsed by passport
                                               done) => {
                // transform the profile to your expected shape
                // const myProfile: AuthProfile

                const jwt: string = await this.authService.validateOAuthLogin(profile.id, Provider.GOOGLE);
                const user = {
                    jwt,
                };
                done(null, user);
            })
        );
    }
}
