# 초간단 PRD 양식 서비스

팀원이 웹 페이지에서 간단하게 PRD를 작성하면 노션 데이터베이스에 자동으로 저장되는 서비스입니다.

## 기술 스택

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Notion API** (`@notionhq/client`)

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 노션 설정

#### Integration 생성
1. [Notion Integrations](https://www.notion.so/my-integrations) 접속
2. "New integration" 클릭 후 생성
3. 발급된 **Internal Integration Token** 복사

#### 데이터베이스 생성
노션에서 데이터베이스를 생성하고 아래 속성(property)을 추가합니다:

| 속성명 | 타입 |
|--------|------|
| 프로젝트명 | Title |
| 작성자 | Rich text |
| 상태 | Select (초안 / 검토 중 / 확정) |
| 작성일 | Date |

#### 데이터베이스에 Integration 연결
1. 데이터베이스 페이지 우측 상단 `...` 메뉴
2. "Connections" → 생성한 Integration 선택

#### Database ID 확인
데이터베이스 URL에서 ID를 추출합니다:
```
https://www.notion.so/<DATABASE_ID>?v=...
```

### 3. 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일에 값을 입력합니다:
```
NOTION_API_KEY=ntn_xxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속하여 PRD 양식을 작성합니다.

## 배포

```bash
npm run build
npm start
```

Vercel 등 Next.js 호스팅 서비스에 배포 시 환경변수를 설정해주세요.
