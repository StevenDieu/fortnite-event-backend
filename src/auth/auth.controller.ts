import {
    Profile,
    Strategy,
    StrategyOptionWithRequest,
    VerifyFunctionWithRequest,
} from 'passport-google-oauth20';
import {Controller, Get, Next, Param, Req, Res} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {NextFunction} from "connect";


@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) {}

    @Get(':provider(google|facebook)')
    async handleOauthRequest(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
        @Param('provider') provider: AuthProvider
    ) {
        const params = {
            session: false,
            scope: ['<specify scope base on provider>'],
            callbackURL: `<domain>/auth/${provider}/callback`,
        };
        authenticate(provider, params)(req, res, next);
    }

    @Get(':provider(google|facebook)/callback')
    async handleOauthCallback(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
        @Param('provider') provider: AuthProvider
    ) {
        const params = {
            session: false,
            state: req.query.state,
            callbackURL: `<domain>/auth/${provider}/callback`,
        };

        // We use callback here, but you can let passport do the redirect
        // http://www.passportjs.org/docs/downloads/html/#custom-callback
        authenticate(provider, params, (err, user) => {
            if (err) return next(err);
            if (!user) return next(new UnauthorizedException());

            // I generate the JWT token myself and redirect the user,
            // but you can make it more smart.
            this.generateTokenAndRedirect(req, res, user);
        })(req, res, next);
    }
}
