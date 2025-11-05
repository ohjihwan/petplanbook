# 🐾 PetPlenBook 웹 애플리케이션

> PetPlenBook은 반려동물과 함께하는 여행 정보를 제공하는 웹 애플리케이션입니다. Express.js와 MySQL을 활용한 풀스택 웹 애플리케이션으로, 반려동물 친화적 여행지 검색, 커뮤니티, 루트 관리 등 다양한 기능을 제공합니다.

---

## 📚 프로젝트 개요

이 프로젝트는 반려동물과 함께하는 여행을 계획하고 정보를 공유할 수 있는 플랫폼입니다. Express.js 기반의 백엔드 서버와 MySQL 데이터베이스를 사용하며, 공공데이터 API를 활용한 여행지 정보 제공, 지도 기반 장소 검색, 커뮤니티 게시판, 루트 관리 등 다양한 기능을 구현했습니다.

---

## 📘 주요 기능

### 1. 사용자 인증 (Authentication)
- **회원가입**: 이메일, 비밀번호, 닉네임, 지역, 반려동물 종류(강아지/고양이) 입력
- **로그인**: 이메일과 비밀번호 기반 인증 시스템
- **프로필 관리**: 프로필 이미지 업로드, 닉네임, 지역, 반려동물 정보 수정
- **이메일 중복 체크**: 회원가입 시 이메일 중복 확인
- **세션 관리**: Express Session을 활용한 로그인 유지

### 2. 장소 찾기 (Place Search)
- **반려동물 친화적 여행지 검색**: 공공데이터 API를 활용한 여행지 정보 제공
- **카테고리별 검색**: 숙박, 식당/카페, 놀거리 등 카테고리별 장소 검색
- **지도 기반 검색**: 지도를 활용한 장소 위치 확인 및 검색
- **추천 장소**: 추천 목적지 정보 제공
- **장소 상세 정보**: 장소별 상세 정보 및 이미지 조회

### 3. 커뮤니티 (Community)
- **추천 루트**: 다른 사용자들이 추천한 여행 루트 조회
- **게시글 작성**: 여행 후기 및 추천 루트 게시글 작성
- **게시글 조회**: 게시글 목록 및 상세 보기
- **추천 기능**: 게시글 추천 기능
- **월간 이벤트**: 이벤트 정보 제공

### 4. 마이페이지 (My Page)
- **루트 꾸미기**: 나만의 여행 루트 생성 및 관리
- **마이 장소**: 저장한 장소 목록 관리
- **마이 루트**: 저장한 루트 목록 관리
- **내 글 보기**: 작성한 게시글 목록 조회
- **마이 프로필**: 프로필 정보 수정 및 관리

### 5. 루트 관리 (Route Management)
- **루트 생성**: 여러 장소를 연결한 여행 루트 생성
- **루트 저장**: 생성한 루트를 데이터베이스에 저장
- **루트 조회**: 저장된 루트 목록 및 상세 정보 조회
- **루트 삭제**: 저장된 루트 삭제 기능

### 6. 파일 업로드 (File Upload)
- **프로필 이미지**: 사용자 프로필 이미지 업로드
- **Multer 활용**: 파일 업로드 처리
- **이미지 관리**: 프로필 이미지 수정 및 삭제

---

## 📁 프로젝트 구조

```
08. PetPlenBook/
├── app.mjs                    # Express 애플리케이션 진입점
├── server.js                  # 서버 실행 파일 (선택적)
├── package.json               # 프로젝트 의존성 및 스크립트
│
├── api/                       # API 라우터
│   └── pet_travel.mjs         # 반려동물 여행지 API
│
├── assets/                    # 정적 리소스
│   ├── css/                   # 스타일시트
│   │   ├── common-ui.css
│   │   ├── dev.css
│   │   ├── MY022.css
│   │   ├── style.css
│   │   └── swiper.css
│   ├── js/                    # JavaScript 파일
│   │   ├── API.js
│   │   ├── dev.js
│   │   ├── map.js
│   │   └── style.js
│   ├── imgs/                  # 이미지 파일
│   │   ├── ico/               # 아이콘
│   │   └── img/               # 이미지
│   └── libs/                  # 외부 라이브러리
│       ├── jquery/            # jQuery 라이브러리
│       ├── jquery-ui/         # jQuery UI
│       └── swiper/            # Swiper 슬라이더
│
├── data/                      # 데이터 레이어
│   ├── api.mjs                # API 데이터 처리
│   ├── db.mjs                 # 데이터베이스 연결
│   ├── places.mjs             # 장소 데이터 처리
│   ├── schema.sql              # 데이터베이스 스키마
│   └── user.sql                # 사용자 테이블 스키마
│
├── router/                    # 라우터
│   ├── delete.mjs             # 삭제 관련 라우터
│   ├── places.mjs             # 장소 관련 라우터
│   ├── post.mjs               # 게시글 관련 라우터
│   ├── posts.mjs              # 게시글 목록 라우터
│   ├── route.mjs              # 루트 관련 라우터
│   ├── save.mjs               # 저장 관련 라우터
│   ├── saveroute.mjs          # 루트 저장 라우터
│   └── user.mjs               # 사용자 인증 라우터
│
├── public/                    # 정적 HTML 페이지
│   ├── CO/                    # 커뮤니티 페이지
│   │   ├── CO010.html
│   │   ├── CO020.html
│   │   ├── CO030.html
│   │   ├── CO040.html
│   │   └── CO050.html
│   ├── ETC/                   # 기타 페이지
│   │   ├── ETC030.html
│   │   ├── footer.html
│   │   ├── header.html
│   │   └── login.html
│   ├── HM/                    # 홈 메인 페이지
│   │   └── HM010.html
│   ├── MY/                    # 마이페이지
│   │   ├── MY010.html         # 루트 꾸미기
│   │   ├── MY020.html
│   │   ├── MY021.html
│   │   ├── MY022.html         # 마이 장소
│   │   ├── MY030.html         # 마이 루트
│   │   └── MY040.html         # 마이 프로필
│   └── PL/                    # 장소 찾기 페이지
│       └── PL010.html
│
└── worklist3/                 # 워크리스트 관리 도구
    ├── assets/
    └── ...
```

---

## ⚙️ 실행 환경 설정

### 1️⃣ 필수 요구사항

- **Node.js**: v18 이상
- **MySQL**: MySQL 8.0 이상
- **npm**: Node.js 패키지 관리자

### 2️⃣ 프로젝트 클론 및 의존성 설치

```bash
# 프로젝트 디렉토리로 이동
cd "08. PetPlenBook"

# 의존성 패키지 설치
npm install
```

### 3️⃣ 환경 변수 설정

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 환경 변수를 설정합니다:

```env
# 서버 포트 설정
PORT=8081
HOST=localhost

# MySQL 데이터베이스 설정
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=database

# 공공데이터 API 설정
API_SERVICE_KEY=your-public-data-api-service-key
```

#### 환경 변수 설명

- **PORT**: Express 서버가 실행될 포트 번호 (기본값: 8081)
- **HOST**: 서버 호스트 주소 (기본값: localhost)
- **DB_HOST**: MySQL 서버 호스트 주소
- **DB_PORT**: MySQL 서버 포트 번호 (기본값: 3306)
- **DB_USER**: MySQL 데이터베이스 사용자 이름
- **DB_PASSWORD**: MySQL 데이터베이스 비밀번호
- **DB_DATABASE**: 사용할 데이터베이스 이름
- **API_SERVICE_KEY**: 공공데이터포털 API 서비스 키 (반려동물 여행지 API 사용 시 필요)

### 4️⃣ MySQL 데이터베이스 설정

#### 로컬 MySQL 사용

1. MySQL 서버 실행
2. 데이터베이스 생성:

```sql
CREATE DATABASE database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. SQL 스크립트 실행:

```bash
# 데이터베이스 스키마 실행
mysql -u root -p database < data/schema.sql

# 사용자 테이블 스키마 실행 (선택사항)
mysql -u root -p database < data/user.sql
```

#### 데이터베이스 스키마

주요 테이블:
- **user**: 사용자 정보 (이메일, 비밀번호, 닉네임, 지역, 반려동물 종류 등)
- **places**: 저장된 장소 정보
- **saved_route**: 저장된 여행 루트 정보
- **post**: 게시글 정보

### 5️⃣ 애플리케이션 실행

#### 개발 모드

```bash
npm start
```

또는

```bash
node app.mjs
```

#### 서버 접속 확인

서버가 정상적으로 실행되면 다음 메시지가 출력됩니다:

```
서버 실행 중, 메인으로 가기: http://localhost:8081/HM/HM010.html
```

브라우저에서 다음 주소로 접속하여 확인할 수 있습니다:

- **메인 페이지**: http://localhost:8081/HM/HM010.html
- **장소 찾기**: http://localhost:8081/PL/PL010.html
- **커뮤니티**: http://localhost:8081/CO/CO010.html
- **마이페이지**: http://localhost:8081/MY/MY010.html

---

## 📦 주요 패키지

### 백엔드 프레임워크
- **express**: 웹 애플리케이션 프레임워크
- **express-session**: 세션 관리 미들웨어

### 데이터베이스
- **mysql2**: MySQL 공식 드라이버

### 파일 처리
- **multer**: 파일 업로드 처리

### HTTP 통신
- **axios**: HTTP 클라이언트
- **node-fetch**: Fetch API 구현
- **request**: HTTP 요청 라이브러리

### 보안 및 유틸리티
- **bcrypt**: 비밀번호 해싱 및 암호화
- **cors**: Cross-Origin Resource Sharing 처리
- **dotenv**: 환경 변수 관리

---

## 💡 핵심 개념

### Express.js
Node.js 기반의 웹 애플리케이션 프레임워크로, 간단하고 빠른 API 서버 구축을 가능하게 합니다.

### MySQL
관계형 데이터베이스로, 사용자 정보, 장소 정보, 루트 정보 등을 저장하고 관리합니다.

### 공공데이터 API
한국관광공사에서 제공하는 반려동물 여행지 정보 API를 활용하여 여행지 데이터를 제공합니다.

### 세션 관리
Express Session을 활용하여 사용자 로그인 상태를 관리하고, 세션 기반 인증을 제공합니다.

### RESTful API
HTTP 메서드(GET, POST, PUT, DELETE)를 사용하여 리소스를 관리하는 API 설계 방식입니다.

### Multer
파일 업로드를 처리하는 미들웨어로, 프로필 이미지 업로드에 활용됩니다.

---

## 🔗 주요 API 엔드포인트

### 인증 (Authentication)
- `POST /api/user/login` - 로그인
- `POST /api/user/signup` - 회원가입
- `POST /api/user/check-email` - 이메일 중복 체크
- `PUT /api/user/edit` - 사용자 정보 수정
- `POST /api/user/update-profile` - 프로필 이미지 업로드 및 수정
- `POST /api/user/delete-profile-image` - 프로필 이미지 삭제
- `POST /api/user/logout` - 로그아웃

### 여행지 (Place)
- `GET /api/pet-travel/list` - 반려동물 여행지 목록 조회
- `POST /api/save` - 장소 저장
- `GET /api/places` - 저장된 장소 목록 조회
- `DELETE /api/delete` - 장소 삭제

### 루트 (Route)
- `POST /api/save-route` - 루트 저장
- `GET /api/routes` - 저장된 루트 목록 조회
- `DELETE /api/delete-route` - 루트 삭제

### 게시판 (Post)
- `GET /api/posts` - 게시글 목록 조회
- `POST /api/post` - 게시글 작성
- `GET /api/post/:id` - 게시글 상세 조회

---

## 🔗 참고 자료

### Express.js
- [Express 공식 문서](https://expressjs.com/)
- [Express 가이드](https://expressjs.com/en/guide/routing.html)

### MySQL
- [MySQL 공식 문서](https://dev.mysql.com/doc/)
- [mysql2 npm 패키지](https://www.npmjs.com/package/mysql2)

### 공공데이터 API
- [공공데이터포털](https://www.data.go.kr/)
- [한국관광공사 반려동물 여행지 API](https://www.data.go.kr/)

### 기타
- [Node.js 공식 문서](https://nodejs.org/)
- [Multer npm 패키지](https://www.npmjs.com/package/multer)
- [bcrypt npm 패키지](https://www.npmjs.com/package/bcrypt)

---

## 📝 라이선스

이 프로젝트는 학습 목적으로 작성되었습니다.

---

## 👤 프로젝트 참여자
**오지환**
- **프론트엔드, 기획**: 프로젝트의 프론트엔드 개발과 서비스 기획을 담당했습니다.
- **디자인**: 지인에게 디자인 지원을 요청하여 UI/UX 디자인을 완성했습니다.
- **백엔드 지원**: 백엔드 개발에도 참여하여 API 서버 구축 및 데이터베이스 설계를 지원했습니다.

---

## ⚠️ 주의사항

1. **환경 변수 보안**: `.env` 파일은 절대 Git에 커밋하지 마세요. `.gitignore`에 추가되어 있는지 확인하세요.
2. **MySQL 연결**: MySQL 서버가 실행 중인지 확인하세요.
3. **포트 충돌**: 다른 애플리케이션이 8081 포트를 사용 중이면 `.env` 파일에서 `PORT`를 변경하세요.
4. **공공데이터 API**: 반려동물 여행지 API를 사용하려면 공공데이터포털에서 API 키 발급이 필요합니다.
5. **파일 업로드 경로**: `uploads/temp` 디렉토리가 존재하는지 확인하세요. 없으면 자동으로 생성됩니다.

---

## 🚀 빠른 시작 가이드

1. **프로젝트 클론**
   ```bash
   git clone [repository-url]
   cd "08. PetPlenBook"
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **데이터베이스 설정**
   - MySQL 서버 실행
   - 데이터베이스 생성 및 스키마 실행

4. **환경 변수 설정**
   - `.env` 파일 생성 및 설정

5. **서버 실행**
   ```bash
   npm start
   ```

6. **브라우저에서 접속**
   - 메인 페이지: http://localhost:8081/HM/HM010.html

---

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해 주세요.
