# iPMS Frontend

This is the frontend application for the iPMS (Integrated Project Management System) built with [Next.js](https://nextjs.org) and bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ipms-dev
```

### 2. Navigate to Frontend Directory

```bash
cd frontend
```

### 3. Install Dependencies

Install all required packages:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 4. Run the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### 5. Access the Application

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

The page auto-updates as you edit the file - perfect for development!

## Development Workflow

### Making Changes

You can start editing the application by modifying files in the `app/` directory:

- `app/page.tsx` - Main page component
- `app/layout.tsx` - Root layout component
- `app/globals.css` - Global styles

### Testing Your Changes

Before creating a pull request, ensure your changes work properly:

```bash
# Build the application for production
npm run build

# Start the production server
npm run start
```

Both commands should complete successfully without errors.

### Project Structure

```
frontend/
├── app/                 # Next.js app directory
│   ├── page.tsx        # Home page
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles
├── public/             # Static assets
├── components/         # Reusable React components
├── lib/               # Utility functions
├── package.json       # Project dependencies
└── README.md          # This file
```

## Available Scripts

| Command         | Description                            |
| --------------- | -------------------------------------- |
| `npm run dev`   | Starts development server on port 3000 |
| `npm run build` | Builds the app for production          |
| `npm run start` | Starts production server               |
| `npm run lint`  | Runs ESLint for code quality           |

## Technology Stack

- **Framework**: [Next.js 14+](https://nextjs.org)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font Optimization**: [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) with [Geist](https://vercel.com/font)

## Contributing

1. Follow the main project's [collaboration guidelines](../README.md)
2. Create feature branches: `git checkout -b feature/your-feature-name`
3. Make your changes in the frontend directory
4. Test locally with `npm run dev`
5. Build and test production version with `npm run build && npm run start`
6. Commit and push your changes
7. Create a pull request

## Environment Setup

### Node.js Version

Ensure you have Node.js 18+ installed:

```bash
node --version  # Should be 18.0.0 or higher
```

### Package Manager

This project uses npm by default, but you can use your preferred package manager:

- **npm** (recommended)
- **yarn**
- **pnpm**
- **bun**

## Troubleshooting

### Common Issues

**Port 3000 already in use:**

```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

**Module not found errors:**

```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**

```bash
# Check for TypeScript errors
npm run build

# Check for linting issues
npm run lint
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Next.js GitHub Repository](https://github.com/vercel/next.js) - Feedback and contributions welcome

## Deployment

The application can be deployed on various platforms:

- **Vercel** (recommended): [Deploy with Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
- **Netlify**: Supports Next.js deployments
- **Docker**: Build and deploy with containers

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for detailed deployment guides.

## Support

For project-specific questions:

- Check the main project [README](../README.md)
- Create an issue in the repository
- Contact the project maintainers

For Next.js specific questions:

- Visit [Next.js Documentation](https://nextjs.org/docs)
- Join the [Next.js Discord Community](https://discord.gg/nextjs)
