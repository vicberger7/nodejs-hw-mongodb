import { OAuth2Client } from 'google-auth-library';
import oauthConfig from '../../google-oauth.json';
import createHttpError from 'http-errors';
import { ENV_VARS, env } from './env';

const googleOAuthClient = new OAuth2Client({
  clientId: env(ENV_VARS.GOOGLE_AUTH_CLIENT_ID),
  clientSecret: env(ENV_VARS.GOOGLE_AUTH_CLIENT_SECRET),
  redirectUri: oauthConfig.web.redirect_uris[0],
});

export const generateAuthUrl = () =>
  googleOAuthClient.generateAuthUrl({
    scope: [
      '<https://www.googleapis.com/auth/userinfo.email>',
      '<https://www.googleapis.com/auth/userinfo.profile>',
    ],
  });

export const validateCode = async (code) => {
  const response = await googleOAuthClient.getToken(code);
  if (!response.tokens.id_token) throw createHttpError(401, 'Unauthorized');
  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });
  return ticket;
};

export const getFullNameFromGoogleTokenPayload = (payload) => {
  let fullName = 'Guest';
  if (payload.given_name && payload.family_name) {
    fullName = `${payload.given_name} ${payload.family_name}`;
  } else if (payload.given_name) {
    fullName = payload.given_name;
  }

  return fullName;
};