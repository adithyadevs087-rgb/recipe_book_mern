# Recipe Book — MERN Stack

A responsive Recipe Book app built with MongoDB Atlas, Express, React, Node.js, and Mongoose.

## Requirements
- Node.js 18+ and npm
- A MongoDB Atlas connection string

## 1. Configure MongoDB
1. Create a free cluster at https://www.mongodb.com/atlas.
2. Create a database user and allow your development IP in Network Access.
3. Copy your connection string.
4. Copy `backend/.env.example` to `backend/.env` and set `MONGO_URI`.
   - Never commit the real `.env` file or share your database password publicly.

## 2. Run the backend
Open a terminal in `backend`:

```bash
npm install
npm run dev
```

The API runs at `http://localhost:5000`. Check `http://localhost:5000/api/health`.

## 3. Run the frontend
Open a second terminal in `frontend`:

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## Features
- Create recipes with name, category, ingredients, preparation steps, and cooking time
- List all recipes
- View full recipe details
- Edit existing recipes
- Delete recipes with confirmation
- Validation and success/error feedback
- Responsive layout for mobile and desktop

## API endpoints
- `GET /api/recipes` — list recipes
- `GET /api/recipes/:id` — get one recipe
- `POST /api/recipes` — create recipe
- `PUT /api/recipes/:id` — update recipe
- `DELETE /api/recipes/:id` — delete recipe

## Submission checklist
- [ ] Set `MONGO_URI` in your local `backend/.env`
- [ ] Test add, view, details, edit, and delete
- [ ] Confirm recipes remain after refreshing
- [ ] Push both `frontend` and `backend` folders to GitHub
- [ ] Do not commit `.env` or `node_modules`
