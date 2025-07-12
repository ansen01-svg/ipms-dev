# iPMS - Integrated Project Management System

## Overview
Welcome to the iPMS project! This document outlines the collaboration guidelines and workflow for contributing to this project. Please read through this carefully to ensure smooth collaboration with the team.

## Project Structure
```
iPMS/
├── backend/          # Backend application code
├── frontend/         # Frontend application code
└── README.md        # This file
```

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ipms-dev
```

### 2. Choose Your Working Directory
Navigate to either the backend or frontend directory depending on what you're working on:

```bash
# For backend development
cd backend

# For frontend development  
cd frontend
```

## Collaboration Workflow

### Step 1: Create a Feature Branch
Always create a new branch for your feature or bug fix. Use conventional branch naming:

```bash
# Checkout to main branch first
git checkout main

# Pull latest changes
git pull origin main

# Create and switch to your feature branch
git checkout -b feature/your-feature-name

# Examples of good branch names:
# feature/user-authentication
# feature/dashboard-ui
# feature/api-integration
# bugfix/login-validation
# hotfix/security-patch
```

### Step 2: Make Your Changes
Work on your feature in the appropriate directory (backend or frontend). Make sure to:
- Write clean, readable code
- Follow project coding standards

### Step 3: Commit Your Changes
Make frequent, logical commits with descriptive messages:

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add user authentication middleware

- Implement JWT token validation
- Add password encryption using bcrypt
- Create login/logout endpoints
- Add error handling for invalid credentials"
```

### Step 4: Keep Your Branch Updated
Before pushing your changes, sync with the main branch to avoid conflicts:

```bash
# Switch to main branch
git checkout main

# Pull latest changes from remote
git pull origin main

# Switch back to your feature branch
git checkout feature/your-feature-name

# Merge main into your feature branch
git merge main
```

**Alternative using rebase (for cleaner history):**
```bash
# Switch to main and pull latest
git checkout main
git pull origin main

# Switch to feature branch and rebase
git checkout feature/your-feature-name
git rebase main
```

### Step 4.1: Frontend Testing Requirements
**For Frontend Contributors Only**: After merging the latest main branch code, you must build your application in both scenarios:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if package.json changed)
npm install

# Test 1: Build and run with your feature code
npm run build
npm run start
# Verify your feature works correctly

# Test 2: After merging main, build and run again
npm run build
npm run start
# Verify your feature still works with merged main code
# Ensure no conflicts or breaking changes occurred
```

**Important**: Both builds must be successful and the application must run without errors before proceeding to create a pull request. This ensures:
- Your feature code works in isolation
- Your feature integrates properly with the latest main branch
- No dependencies or configuration conflicts exist
- The application remains stable after integration

### Step 5: Push Your Branch
```bash
# Push your feature branch to remote
git push origin feature/your-feature-name

# If it's your first push for this branch
git push -u origin feature/your-feature-name
```

### Step 6: Create a Pull Request
1. Go to the repository on your git platform (GitHub, GitLab, etc.)
2. Click "New Pull Request" or "Create Merge Request"
3. Select your feature branch as the source and `main` as the target
4. Fill out the PR template with detailed information

## Pull Request Guidelines

### PR Title Format
Use conventional commit format for PR titles:
```
feat: add user dashboard component
fix: resolve login redirect issue  
docs: update API documentation
refactor: optimize database queries
```

### PR Description Template
```markdown
## Description
Brief description of what this PR does and why it's needed.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Changes Made
- List specific changes made
- Include any new dependencies added
- Mention any configuration changes

## Additional Notes
Any additional information, concerns, or considerations for reviewers.
```

## Commit Message Conventions

Follow conventional commit format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples:
```bash
git commit -m "feat(auth): implement password reset functionality"
git commit -m "fix(api): handle null response in user endpoint"
git commit -m "docs: update installation instructions"
```

## Code Review Process

1. **Self-Review**: Review your own code before creating the PR
2. **Peer Review**: At least one team member must review and approve

## Branch Protection Rules

- Direct pushes to `main` branch are not allowed
- All changes must go through pull requests
- Pull requests require at least one approval
- All status checks must pass before merging

## Best Practices

### Do's ✅
- Keep commits small and focused
- Write descriptive commit messages
- Pull latest changes before starting work
- **Frontend contributors**: Build and run application before creating PR (both with feature code and after merging main)
- Update documentation when needed
- Use meaningful branch names
- Resolve conflicts promptly

### Don'ts ❌
- Don't commit directly to main branch
- Don't push incomplete or broken code
- Don't use generic commit messages like "fix" or "update"
- Don't ignore merge conflicts
- Don't force push to shared branches
- Don't commit sensitive information (passwords, API keys)

## Useful Git Commands

### Checking Status and History
```bash
# Check current status
git status

# View commit history
git log --oneline

# View branch information
git branch -a

# Check differences
git diff
```

### Undoing Changes
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo changes in working directory
git checkout -- filename

# Undo all uncommitted changes
git reset --hard HEAD
```

### Resolving Conflicts
```bash
# During merge conflicts
git status                    # See conflicted files
# Edit files to resolve conflicts
git add resolved-file
git commit -m "resolve merge conflict"
```

## Getting Help

If you encounter any issues:
1. Check this documentation first
2. Ask team members for help
3. Create an issue in the repository
4. Consult git documentation: `git help <command>`

## Contact
For questions about the collaboration process, please reach out to the project maintainers.

---

**Remember**: Good collaboration starts with clear communication and following established workflows. When in doubt, ask questions!
