# MontAuth

This is a simple JWT auth system made in TypeScript.
It's as simple as it gets, but it's a good starting point for a more complex system.

## How to use

1. Clone the repository into your project
2. Run `npm install`
3. Create a `.env` file in the root of the project with the following content:
```
JWT_SECRET="your_secret_key"
JWT_ACCESS_TOKEN_EXPIRES_IN=3600
JWT_REFRESH_TOKEN_EXPIRES_IN=86400
```

## Functions

- `montAuth.createSession(payload: object, options: Options): MontResponse` - Creates a new access and refresh token
- `montAuth.validate(token: string, options: Options): MontResponse` - Checks if an access token is valid
- `montAuth.refresh(token: string, options: Options): MontResponse` - Refreshes a refresh token
- `montAuth.auto(token: string, options: Options): MontResponse` - Automatically validates or refreshes a token