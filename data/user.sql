DROP TABLE IF EXISTS `user`;

-- user 테이블 생성
CREATE TABLE `user` (
	email VARCHAR(50) PRIMARY KEY,
	password VARCHAR(255) NOT NULL,
	nickname VARCHAR(10) NOT NULL,
	region VARCHAR(20) NOT NULL, -- [수정] 지역 길이 확장 (5 → 20)
	cat_or_dog VARCHAR(50),		-- [수정] ENUM → VARCHAR(50), 다중 반려동물 허용
	profile_image_url VARCHAR(500)
);

-- 더미 데이터 삽입 (ENUM 대신 문자열로 변경됨)
INSERT INTO `user` (email, password, nickname, region, cat_or_dog, profile_image_url) VALUES
('alice@example.com', 'password123', '앨리스', '서울특별시', '고양이', 'https://example.com/profiles/alice.jpg'),
('bob@example.com', 'qwerty456', '밥', '부산광역시', '강아지', 'https://example.com/profiles/bob.jpg'),
('charlie@example.com', 'charlie789', '찰리', '대전광역시', '고양이,강아지', 'https://example.com/profiles/charlie.jpg');

select * from user;