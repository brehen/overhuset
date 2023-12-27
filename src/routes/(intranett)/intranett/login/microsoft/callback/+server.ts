// routes/login/microsoft/callback/+server.ts
import { overhuset } from '$lib/config/constellations.js';
import { auth, azureADAuth } from '$lib/server/lucia.js';
import { OAuthRequestError } from '@lucia-auth/oauth';
import type { RequestHandler } from '@sveltejs/kit';


export const GET: RequestHandler = async ({ url, cookies, locals }) => {
	const storedState = cookies.get('microsoft_oauth_state');
	const storedCodeVerifier = cookies.get('microsoft_oauth_codeVerifier');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');
	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response('Kunne ikke logge inn - feil tilstand', {
			status: 403
		});
	}
	try {
		const {getExistingUser, azureADUser, azureADTokens, createUser } = await azureADAuth.validateCallback(code, storedCodeVerifier);

		console.log(azureADUser)
		console.log(azureADTokens)
		const emailsignature = azureADUser.email?.match("(?<=@)[^.]+(?=\\.).*")[0];

		if (!emailsignature) {
			return new Response('Kunne ikke logge inn - epost mangler', {
				status: 403
			});
		}

		if (!overhuset.includes(emailsignature)) {
			return new Response('Kunne ikke logge inn - epost er ikke godkjent - ' + emailsignature, {
				status: 403
			});
		}

		const getUser = async () => {
			const existingUser = await getExistingUser();

			if (existingUser) return existingUser;
			const user = await createUser({
				attributes: {
					username: azureADUser.name
				}
			});
			return user;
		};

		const user = await getUser();
		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});

		locals.auth.setSession(session);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/intranett'
			}
		});
	} catch (e) {
		console.log(e);
		if (e instanceof OAuthRequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
};
