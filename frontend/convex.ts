import { ConvexReactClient } from 'convex/react';
import { api } from './convex/_generated/api';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || ''; // Set a default value if the environment variable is undefined
const convex = new ConvexReactClient(convexUrl);

export { convex, api };