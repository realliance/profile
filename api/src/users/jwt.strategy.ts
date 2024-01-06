import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ReallianceIdJwt } from './jwt';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { ConnectionsService } from 'src/connections/connections.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UsersService,
    private connectionService: ConnectionsService,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://id.realliance.net/application/o/community/jwks/',
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: 'LNXdUuOZUue5HPlw8Vyglo83sIYndFaGUCIdQrSZ',
      issuer: 'https://id.realliance.net/application/o/community/',
      algorithms: ['RS256'],
    });
  }

  validate(payload: unknown): unknown {
    const jwt = payload as ReallianceIdJwt;

    this.userService
      .findOneByJwt(jwt)
      .then((user) => {
        if (user) {
          console.log('Updating user against JWT');
          this.connectionService.saveForUser(user);
          this.userService.updateUser(user.id, {
            displayName: jwt.name,
            username: jwt.preferred_username,
            admin: User.fromJwt(jwt).admin,
          });
        } else {
          console.log('Bootstrapping new user');
          const user = User.fromJwt(jwt);
          this.connectionService.saveForUser(user);
          this.userService.create(user);
        }
      })
      .catch((e) => {
        console.error('Error on finding user', e);
      });

    return jwt as unknown;
  }
}
