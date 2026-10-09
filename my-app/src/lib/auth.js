import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URL);
const db = client.db('Bazar-Dor-DB');

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },

    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_API_CLIENT_ID , 
            clientSecret: process.env.GOOGLE_API_CLIENT_SECRET , 
        }, 
        github: { 
            clientId: process.env.GITHUB_API_CLIENT_ID , 
            clientSecret: process.env.GITHUB_API_CLIENT_SECRET , 
        }, 
    },
    account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ["google", "github"], // Add your providers
		},
	},
    database: mongodbAdapter(db, {
        client,
    }),
});