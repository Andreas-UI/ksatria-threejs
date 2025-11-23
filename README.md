# Installation & Setup

## 📦 Installation

Make sure you have **Node.js** installed, then install dependencies:

```bash
npm install
```

## 🚀 Run in Development

Start the Vite development server:

```bash
npm run dev
```

The app will run at something like:

```
http://localhost:5173/
```

## 🏗️ Build for Production

Generate the production build:

```bash
npm run build
```

## 🔍 Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

---

## 🔐 Environment Variables

Create a **.env** file in the project root:

```env
VITE_CLIENT_ID=XXX
VITE_CLIENT_SECRET=XXX
```

> ⚠️ Variables MUST start with `VITE_` for Vite to expose them to your JavaScript.

Access them in your code:

```js
const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
```

---

## 🔑 Getting Google Client ID & Secret (Google Cloud Console)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. On the left sidebar, go to: **APIs & Services → OAuth consent screen**
   - Choose **External** or **Internal**
   - Fill in the required details
   - Save
4. Go to: **APIs & Services → Credentials**
5. Click **Create Credentials → OAuth 2.0 Client ID**
6. Choose **Web application**
7. Add your development redirect URIs, e.g.:
   ```
   http://localhost:5173
   http://localhost:5173/callback
   ```
8. After creating, Google will show:
   - **Client ID**
   - **Client Secret**

Copy them into your `.env`:

```env
VITE_CLIENT_ID=your_google_client_id
VITE_CLIENT_SECRET=your_google_client_secret
```

---

## 📝 Notes

- Never commit your `.env` file to version control
- Add `.env` to your `.gitignore` file
- For production, set environment variables in your hosting platform
