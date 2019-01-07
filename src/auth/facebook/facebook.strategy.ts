import {Injectable} from '@nestjs/common';
import {AuthService, Provider} from "../auth.service";
import {use} from 'passport';
import {PassportStrategy} from "@nestjs/passport";
import {Profile, Strategy, StrategyOptionWithRequest, VerifyFunctionWithRequest,} from 'passport-facebook-token';
import {facebookAPI} from "../../config/key/keyAuth";


@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy) {
    // Facebook strategy should be pretty much the same
    constructor(private authService: AuthService) {
        super(
            <StrategyOptionWithRequest>{
                clientID: facebookAPI.clientID,
                clientSecret: facebookAPI.clientSecret,
                callbackURL: 'http://localhost:3000/auth/facebook/callback',
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

                const jwt: string = await this.authService.validateOAuthLogin(profile.id, Provider.FACEBOOK);
                const user = {
                    jwt,
                };
                done(null, user);
            })
        );
    }
}
