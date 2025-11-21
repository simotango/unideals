# Render Deployment Quick Checklist

Quick reference checklist for deploying UniDeals Backend to Render.

---

## ✅ Pre-Deployment

- [ ] Code pushed to GitHub repository
- [ ] Render account created
- [ ] Gmail App Password generated (for email)

---

## 🗄️ Step 1: PostgreSQL Database

- [ ] Create new PostgreSQL database on Render
- [ ] Note database name: `_________________`
- [ ] Note database host: `_________________`
- [ ] Note database user: `_________________`
- [ ] Note database password: `_________________` (save securely!)
- [ ] Database fully provisioned (green status)

---

## 🚀 Step 2: Web Service

- [ ] Connect GitHub repository to Render
- [ ] Create new Web Service
- [ ] Set Root Directory: `BACKEND`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `node server.js`
- [ ] Select same region as database

---

## 🔐 Step 3: Environment Variables

Add all these in Web Service → Environment:

- [ ] `DB_HOST` = `<database-host>`
- [ ] `DB_PORT` = `5432`
- [ ] `DB_NAME` = `<database-name>`
- [ ] `DB_USER` = `<database-user>`
- [ ] `DB_PASS` = `<database-password>`
- [ ] `JWT_SECRET` = `<strong-random-string>`
- [ ] `JWT_EXPIRES_IN` = `7d`
- [ ] `EMAIL_HOST` = `smtp.gmail.com`
- [ ] `EMAIL_PORT` = `587`
- [ ] `EMAIL_USER` = `<your-email@gmail.com>`
- [ ] `EMAIL_PASS` = `<gmail-app-password>`
- [ ] `PORT` = `10000`
- [ ] `NODE_ENV` = `production`

---

## 📊 Step 4: Database Schema

- [ ] Run `database/schema.sql` on Render database
- [ ] Run `migration_add_location_fields.sql`
- [ ] Run `migration_add_supplier_to_orders.sql`
- [ ] Run `fix_etage_size.sql`
- [ ] Verify tables created (clients, suppliers, products, etc.)

---

## ✅ Step 5: Verification

- [ ] Service builds successfully (check logs)
- [ ] Health endpoint works: `/health`
- [ ] Database connection successful (check logs)
- [ ] Test registration: `POST /api/client/register`
- [ ] Test supplier registration: `POST /api/supplier/register`
- [ ] Email verification works (or console logging works)

---

## 📝 Service Details

**Service URL**: `https://_________________.onrender.com`

**Database URL**: `postgresql://_________________`

**Deployment Date**: `_________________`

---

## 🔍 Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check Root Directory = `BACKEND` |
| DB connection fails | Verify all DB env vars correct |
| Service crashes | Check PORT = `10000`, check logs |
| Email not sending | Verify Gmail App Password |
| Schema not applied | Run SQL files manually |

---

## 📞 Quick Links

- [Render Dashboard](https://dashboard.render.com)
- [Full Deployment Guide](./RENDER_DEPLOYMENT_GUIDE.md)
- [API Reference](./API_REFERENCE.md)

---

*Print this checklist and check off items as you complete them!*




