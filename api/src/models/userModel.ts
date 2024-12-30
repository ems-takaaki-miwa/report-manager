import { PrismaClient, User } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

export interface RegisterParam {
	userId: string;
	password: string;
	name: string;
}

export interface LoginParam {
	userId: string;
	password: string;
}

const getHashedPassword = async (password: string): Promise<string> => {
	return await crypto.subtle
		.digest("SHA-256", new TextEncoder().encode(password))
		.then((hash) => {
			return Array.from(new Uint8Array(hash))
				.map((b) => b.toString(16).padStart(2, "0"))
				.join("");
		});
};

// ユーザー登録
export const createUser = async (
	D1: D1Database,
	userId: string,
	name: string,
	password: string,
): Promise<User> => {
	const adapter = new PrismaD1(D1);
	const prisma = new PrismaClient({ adapter });
	const hashedPassword: string = await getHashedPassword(password);

	try {
		// ユーザーを作成
		const user = await prisma.user.create({
			data: {
				userId: userId,
				name: name,
				hashedPassword: hashedPassword,
			},
		});

		return user;
	} catch (error) {
		console.error("Error creating user:", error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};

// ログイン時の取得
export const getUserByCredentials = async (
	D1: D1Database,
	userId: string,
	password: string,
): Promise<User | null> => {
	const adapter = new PrismaD1(D1);
	const prisma = new PrismaClient({ adapter });

	const hashedPassword: string = await getHashedPassword(password);

	try {
		// データベースからユーザーを取得
		const user = await prisma.user.findUnique({
			where: { userId: userId, hashedPassword: hashedPassword },
		});

		// ユーザーが存在しない場合はnullを返す
		if (!user) {
			return null;
		}

		return user;
	} catch (error) {
		console.error("Error retrieving user:", error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};
