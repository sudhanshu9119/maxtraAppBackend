# Database Setup Guide

This project uses **MongoDB** for data persistence.

## Configuration

1.  Locate the `.env` file in the `backend/` directory.
2.  Update the `MONGO_URI` variable with your own MongoDB connection string.

```bash
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.yourcluster.mongodb.net/<databaseName>?retryWrites=true&w=majority
```

## Security Notice
- **NEVER** commit the `.env` file to version control.
- Ensure the `.gitignore` file includes `.env`.
