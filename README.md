# RealWorld Monorepo

This is a monorepo implementation of the RealWorld application using Yarn workspaces. The project consists of three main packages:

- `client-expo-mobx`: React Native mobile application using MobX for state management
- `client-expo-remx`: React Native mobile application using Remx for state management
- `server`: Express.js backend server

> This project is based on [Kisilov-Vadim/realworld](https://github.com/Kisilov-Vadim/realworld) and [antonTykhomyrovWix/realworld](https://github.com/antonTykhomyrovWix/realworld), which provided the initial implementations. We've restructured it into a monorepo format and made some improvements to the architecture.

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/hitpopdimestop/realworld.git
cd realworld
```

2. Install dependencies:

```bash
yarn install
```

3. Run database migrations (Optional - only if using the local server):

```bash
yarn server:migrate
```

## Server

Start the server (Optional - only if using the local server):

```bash
yarn server
```

The server will be running at `http://localhost:3000`.

## Client

To run a client application, use the interactive start script:

```bash
yarn start
```

This script will first prompt you to select which API endpoint you want the client to use (local or remote), and then which client implementation (MobX or Remx) you want to run. Follow the on-screen instructions.

After selecting the API and client, the script will launch the Expo development server for the chosen client. Use the Expo Go app on your mobile device to scan the QR code, or press 'i' for iOS simulator or 'a' for Android emulator.

## Development

- Server API documentation is available at `http://localhost:3000/api`
- The server uses SQLite for local development
- The client is built with React Native and Expo

## Project Structure

```
realworld/
├── packages/
│   ├── client-expo-mobx/  # React Native mobile app with MobX
│   ├── client-expo-remx/  # React Native mobile app with Remx
│   └── server/           # Express.js backend
├── package.json          # Root package.json for workspace config
└── README.md            # This file
```

## Available Scripts

### Root

- `yarn install` - Install all dependencies for all packages
- `yarn start` - Interactive menu to choose which client to run (MobX or Remx)
- `yarn start:mobx` - Start the MobX-based Expo development server directly
- `yarn start:remx` - Start the Remx-based Expo development server directly
- `yarn server` - Start the server
- `yarn server:migrate` - Run database migrations and seed the database

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
