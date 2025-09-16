# AI Agent Frontend# AI Agent Frontend

A modern, responsive chat interface for your n8n AI agent, built with Next.js 15, TypeScript, and Tailwind CSS.This is a Next.js application that provides a chat interface for your n8n AI Agent.

## Features## Features

- 🎨 Modern gradient UI with smooth animations- 🤖 Real-time chat interface with your n8n AI agent

- 💬 Real-time chat interface with typing indicators- 📱 Responsive design that works on desktop and mobile

- 🔄 Session management for conversation continuity- 💾 Session-based conversations

- 📱 Fully responsive design- ⚡ Built with Next.js, TypeScript, and Tailwind CSS

- ⚡ Fast and optimized with Next.js 15 and Turbopack- 🔄 Real-time loading states and error handling

- 🎯 TypeScript for type safety

- 🎭 Tailwind CSS for modern styling## Setup

## Getting Started1. **Configure your n8n webhook URL**:

### Prerequisites - Copy `.env.local` and update the `NEXT_PUBLIC_N8N_WEBHOOK_URL` with your actual n8n webhook URL

- Your webhook URL should look like: `https://your-n8n-instance.com/webhook/757550cc-2e62-49d7-a186-aad220262236`

- Node.js 18.17 or later

- An n8n workflow with a webhook trigger configured2. **Install dependencies**:

### Installation ```bash

npm install

1. Clone the repository and navigate to the project directory ```

2. Install dependencies:3. **Run the development server**:

````bash

npm install   ```bash

```   npm run dev

````

3. Set up environment variables:

Create a `.env.local` file in the root directory:4. **Open your browser**:

```````env Navigate to [http://localhost:3000](http://localhost:3000)

NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook-test/

```## n8n Configuration



4. Run the development server:Make sure your n8n workflow is:

```bash

npm run dev1. **Active** - The workflow should be turned on

```2. **Accessible** - The webhook should be reachable from your frontend

3. **CORS enabled** - If running locally, you may need to configure CORS in n8n

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Expected n8n Response Format

## n8n Webhook Configuration

The frontend expects your n8n workflow to return a response in one of these formats:

Your n8n workflow should include:

```json

1. **Chat Trigger** node configured as a webhook{

2. **OpenAI Chat Model** or similar AI node for responses  "output": "AI response text here",

3. **Respond to Webhook** node with the following JSON response body:  "sessionId": "session-id"

```json}

{```

  "output": "{{ $('OpenAI Chat Model').output }}",

  "sessionId": "{{ $('Chat Trigger').output.headers['x-session-id'] }}"or

}

``````json

{

Make sure your webhook accepts GET requests and processes the `message` and `sessionId` query parameters.  "response": "AI response text here",

  "sessionId": "session-id"

## Production Deployment}

```````

### Vercel (Recommended)

## Deployment

1. Push your code to GitHub

2. Connect your repository to Vercel### Vercel (Recommended)

3. Add your environment variables in Vercel dashboard

4. Deploy automatically1. Push your code to a GitHub repository

5. Connect your repository to Vercel

### Other Platforms3. Set the environment variable `NEXT_PUBLIC_N8N_WEBHOOK_URL` in Vercel dashboard

4. Deploy!

This Next.js application can be deployed to any platform that supports Node.js applications:

- Netlify### Other Platforms

- Railway

- HerokuThis is a standard Next.js app and can be deployed to any platform that supports Node.js.

- AWS Amplify

- Digital Ocean App Platform## Project Structure

## Project Structure```

src/

````├── components/          # React components

src/│   ├── ChatContainer.tsx    # Main chat interface

├── app/│   ├── ChatInput.tsx        # Message input component

│   ├── globals.css      # Global styles│   └── MessageBubble.tsx    # Individual message display

│   ├── layout.tsx       # Root layout├── services/            # API services

│   └── page.tsx         # Home page│   └── chatService.ts       # n8n webhook communication

├── components/├── types/               # TypeScript type definitions

│   ├── ChatContainer.tsx    # Main chat interface│   └── chat.ts             # Chat-related types

│   ├── ChatInput.tsx        # Message input component└── app/                 # Next.js app router

│   └── MessageBubble.tsx    # Message display component    └── page.tsx            # Main page

├── services/```

│   └── chatService.ts       # API communication

└── types/## Troubleshooting

    └── chat.ts             # TypeScript interfaces

```1. **Connection Issues**: Check that your n8n workflow is active and the webhook URL is correct

2. **CORS Errors**: Configure CORS settings in your n8n instance

## Technologies Used3. **Response Format**: Ensure your n8n workflow returns the expected response format

4. **Environment Variables**: Make sure `.env.local` is not committed to version control and contains the correct webhook URL

- **Next.js 15.5.3** - React framework with App Router

- **TypeScript** - Type safety and better developer experience## License

- **Tailwind CSS** - Utility-first CSS framework

- **Axios** - HTTP client for API callsThis project is open source and available under the MIT License.

- **UUID** - Unique session ID generation

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
````

## Environment Variables

| Variable                      | Description                   | Required |
| ----------------------------- | ----------------------------- | -------- |
| `NEXT_PUBLIC_N8N_WEBHOOK_URL` | Your n8n webhook endpoint URL | Yes      |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
