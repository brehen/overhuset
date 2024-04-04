import type { AuthUser } from "$lib/types";
import {createPool} from "@vercel/postgres";

const fetchAuthUser = async (id: string) => {
	const db = createPool();
	const result = await db.query(`SELECT email, admin FROM auth_user WHERE id = '${id}'`);
	const user: AuthUser[] = result.rows.map(u => ({email: u.email, admin: !!u.admin}));
	return user[0];
}

const fetchAllCompanies = async () => {
	const db = createPool();
	const result = await db.query('SELECT * FROM company ORDER BY name ASC');
	return result.rows.map(c => ({
		id: c.id,
		name: c.name,
		nameShort: c.name_short,
		logoRef: c.logo_ref,
		url: c.url,
		description: c.description,
		createdBy: c.created_by,
		createdAt: c.created_at,
		partner: c.partner,
		active: c.active
	}));
}

export async function load({ locals }) {
	const session = await locals.auth.validate();
	const user  = session?.user;
	const authUser = user?.userId ? await fetchAuthUser(user.userId) : undefined;
	const companyList = fetchAllCompanies();
	return { companyList, authUser};
}