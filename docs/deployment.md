# Deployment & Safe Migration Guide

This guide covers how to deploy your Next.js application with Prisma to Vercel or AWS Amplify, specifically focusing on handling database migrations safely.

## 1. Safety First: Best Practices for Migrations

When automating migrations during deployment, the biggest risk is **locking your database** or **breaking the application** for users currently on the site.

### The Golden Rule: Backward Compatibility

Always ensure your database changes are **backward compatible** with the version of the code _currently running_ in production.

- **Safe changes**: Adding a new column (nullable or with default), adding a new table.
- **Unsafe changes**: Renaming a column, deleting a column, changing a column type.

### Strategy: "Expand and Contract" Pattern

For breaking changes (e.g., renaming `firstName` to `first_name`), do not do it in one step.

1.  **Expand**: Add the new column `first_name`. Deploy.
2.  **Migrate Data**: Update code to write to _both_ `firstName` and `first_name`, but read from `firstName`. Backfill data. Deploy.
3.  **Switch**: Update code to read/write only to `first_name`. Deploy.
4.  **Contract**: Delete the old `firstName` column. Deploy.

---

## 2. Configuration for Automation

We have updated your `package.json` to handle this automatically given the trade-offs discussed.

### Scripts

- **`postinstall`**: `"prisma generate"`
  - Ensures the Prisma Client is generated whenever dependencies are installed (Vercel/Amplify do this automatically, but this ensures it).
- **`build`**: `"prisma migrate deploy && next build"`
  - This runs migrations _before_ the build starts.
  - **Benefit**: If migration fails, the deployment fails, and your live site remains untouched.
  - **Risk**: If migration succeeds but takes a long time, or if the new schema breaks the _current_ live app, users might experience errors during the build duration.

---

## 3. Platform Specific Setup

### Vercel

1.  **Environment Variables**:
    - Go to **Project Settings > Environment Variables**.
    - Add `DATABASE_URL` (Connection string to your production DB).
    - Add `DIRECT_URL` (If using Supabase/Neon with connection pooling, this is the direct connection for migrations).

2.  **Build Command**:
    - Vercel detects `package.json` scripts. It will run `npm run build` by default.
    - Since we modified the `build` script, **no extra configuration is needed**.

### AWS Amplify

1.  **Environment Variables**:
    - Go to **App Settings > Environment Variables**.
    - Add `DATABASE_URL`.

2.  **Build Settings (`amplify.yml`)**:
    - Amplify might override or ignore `postinstall`. Explicitly defining the build commands is safer.
    - Ensure your `amplify.yml` looks like this:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - yarn install
        - npx prisma generate
    build:
      commands:
        - npx prisma migrate deploy
        - yarn build
  artifacts:
    baseDirectory: .next
    files:
      - "**/*"
  cache:
    paths:
      - node_modules/**/*
```

## 4. Troubleshooting

**"Prisma Client not found"**:

- Ensure `prisma generate` is running in the install or pre-build phase.

**"Database connection error"**:

- Verify `DATABASE_URL` in the platform's environment variables.
- Ensure your database allows connections from external IPs (or configured for the specific platform regions).

**Migration Failed**:

- Check the build logs.
- Fix the migration locally.
- Push the fix. The next deployment will retry.
