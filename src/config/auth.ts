import *  as passport from "passport";
import { Strategy as JWTstrategy, ExtractJwt } from 'passport-jwt';
import { User } from "../models/user.model";

export const initPassportJwt = () => {
    passport.use(new JWTstrategy({
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }, async (payload, done) => {
        try {
            const user = await User.findOne({ username: payload.username })
            if (!user) {
                return done(null, false, { message: 'invalid token' })
            }
            return done(null, user)
        } catch (err) {
            return done(err, false)
        }
    }))
    return passport.initialize();
}