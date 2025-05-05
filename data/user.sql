-- user 테이블 생성
CREATE TABLE `user` (
    email VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(10) NOT NULL,
    region VARCHAR(5) NOT NULL,
    cat_or_dog ENUM('cat', 'dog'),
    profile_image_url VARCHAR(500)
);

-- 더미 데이터 삽입
INSERT INTO `user` (email, password, nickname, region, cat_or_dog, profile_image_url) VALUES
('alice@example.com', 'password123', '앨리스', '서울', 1, 'https://example.com/profiles/alice.jpg'),
('bob@example.com', 'qwerty456', '밥', '부산', 2, 'https://example.com/profiles/bob.jpg'),
('charlie@example.com', 'charlie789', '찰리', '대전', 1, 'https://example.com/profiles/charlie.jpg');
