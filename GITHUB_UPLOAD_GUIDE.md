# GitHub Upload Guide

Your backend code has been committed locally. Follow these steps to upload it to GitHub.

## ✅ What's Already Done

- ✅ Git repository initialized
- ✅ All files committed (57 files, 9348 lines)
- ✅ `.env` file excluded (in .gitignore - safe!)

## 📋 Next Steps

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `unideals-backend` (or your preferred name)
   - **Description**: "UniDeals Backend API - Node.js/Express/PostgreSQL"
   - **Visibility**: Choose Public or Private
   - **⚠️ DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

### Step 2: Connect and Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

**Option A: If you haven't created the repo yet (recommended)**
```bash
# Add the remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/unideals-backend.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Option B: If you already created the repo**
```bash
# Add the remote
git remote add origin https://github.com/YOUR_USERNAME/unideals-backend.git

# Push to GitHub
git push -u origin main
```

### Step 3: Verify Upload

1. Go to your GitHub repository page
2. You should see all your files
3. Verify that `.env` is NOT visible (it should be ignored)

## 🔐 Authentication

If you're asked for credentials:

**Option 1: Personal Access Token (Recommended)**
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Use the token as password when pushing

**Option 2: GitHub CLI**
```bash
# Install GitHub CLI, then:
gh auth login
git push -u origin main
```

**Option 3: SSH (Advanced)**
Set up SSH keys and use SSH URL instead of HTTPS.

## 📝 Quick Commands Reference

```bash
# Check current status
git status

# View remote (after adding)
git remote -v

# Push changes
git push

# Pull changes
git pull
```

## ✅ Verification Checklist

After pushing, verify:
- [ ] All files are visible on GitHub
- [ ] `.env` file is NOT visible (it's in .gitignore)
- [ ] `node_modules/` folder is NOT visible
- [ ] README.md is visible
- [ ] All source code files are present

## 🚀 Next Steps After Upload

1. **Add Repository Description** on GitHub
2. **Add Topics/Tags**: `nodejs`, `express`, `postgresql`, `api`, `backend`
3. **Update README** if needed
4. **Set up Render deployment** using `RENDER_DEPLOYMENT_GUIDE.md`

---

**Your repository is ready to be pushed to GitHub!** 🎉

