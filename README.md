# Check.Email

![checkemails vercel app_](https://github.com/louremipsum/checkemails/assets/72456774/871f8378-c62a-42ca-a91c-fce3430d33b9)

Check.Email is an application that classifies emails using AI. It leverages the power of Supabase for authentication services and Google's Gmail API for email interactions. It uses `Langchain/openai` for Classification.

## Prerequisites

Before you begin, ensure you have the following:

- A Supabase account
- A Google Cloud account

## Getting Supabase URL and Anon Key

1. Sign in to your Supabase account.
2. Create a new project.
3. From the project dashboard, you can find the URL and anon key. The URL is your Supabase project URL and the anon key is found under `Settings > API`.

## Getting Google API Key and Client Key

1. Go to the Google Cloud Console.
2. Create a new project.
3. Enable the Gmail API for your project.
4. Create credentials for the Gmail API. Choose `OAuth client ID` as the credential type.
5. Set up the OAuth consent screen. Under `Application type`, choose `Web application`.
6. Add your application's URIs under `Authorized JavaScript origins` and `Authorized redirect URIs`.
7. Setup restricted scope of gmail readonly in consent screen configuration.
8. After you've set up the consent screen, you'll be provided with your `Client ID` and `Client Secret`.

## Setting Up Environment Variables

- Copy the `setup.env` file to a new file named `.env`:

```sh
cp setup.env .env
```

- Open the `.env` file and fill in the environment variables with the keys obtained from Supabase and Google Cloud Console.

## Installing Dependencies and Running the App

1. Install all the dependencies:

```sh
npm install
```

- Run the application:

```sh
npm run dev
```

Now, you should be able to see the application running on your local server.
