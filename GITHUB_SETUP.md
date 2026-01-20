# Publishing to GitHub - Setup Guide

## Step 1: Install Git

1. Download Git for Windows from: https://git-scm.com/download/win
2. Run the installer and follow the setup wizard (use default settings)
3. Restart your terminal/command prompt after installation

## Step 2: Verify Git Installation

Open PowerShell or Command Prompt and run:
```bash
git --version
```

You should see the Git version number if it's installed correctly.

## Step 3: Configure Git (First Time Only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 4: Initialize Your Repository

1. Open PowerShell or Command Prompt in your project folder (`AzOrta`)
2. Run the following commands:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Make your first commit
git commit -m "Initial commit: Az Orta Restaurant website"
```

## Step 5: Create a GitHub Repository

1. Go to https://github.com and sign in (or create an account)
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name it: `az-orta-restaurant` (or any name you prefer)
5. **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 6: Connect and Push to GitHub

GitHub will show you commands, but here they are:

```bash
# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/az-orta-restaurant.git

# Rename main branch (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

You'll be prompted for your GitHub username and password (use a Personal Access Token, not your password - see below).

## Step 7: Enable GitHub Pages (Optional - to host your website)

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "main" branch and "/ (root)" folder
5. Click "Save"
6. Your site will be available at: `https://YOUR_USERNAME.github.io/az-orta-restaurant/`

## Authentication Note

GitHub no longer accepts passwords for Git operations. You'll need to use a **Personal Access Token**:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Az Orta Project"
4. Select scopes: check "repo" (which checks all repo permissions)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)
7. Use this token instead of your password when pushing to GitHub

## Future Updates

When you make changes to your website:

```bash
git add .
git commit -m "Description of changes"
git push
```

## Troubleshooting

- **If you get "git is not recognized"**: Git isn't installed or not in PATH. Reinstall Git.
- **If push fails**: Check that you're using a Personal Access Token, not your password.
- **If remote already exists**: Run `git remote remove origin` first, then add it again.
