// data/places.mjs
import db from "./db.mjs";

// 여러 장소 저장
export async function insertManyPlaces(places) {
	const sql = `
		INSERT INTO places (name, category, address, description, image_url)
		VALUES ?
	`;
	const values = places.map((p) => [
		p.name,
		p.category,
		p.address,
		p.description,
		p.image_url,
	]);
	const [result] = await db.query(sql, [values]);
	return result;
}

// 전체 장소 조회
export async function getAllPlaces() {
	const [rows] = await db.query("SELECT * FROM places");
	return rows;
}
