# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Git과 GitHub 사용법을 가르치는 정적 슬라이드 기반 프레젠테이션 웹사이트입니다.
개발자와 관리자를 위한 Team Plan Edition (v2.1)으로, 33개 슬라이드로 구성되어 있습니다.

## Directory Structure

```
GitStartingGuide/
├── CLAUDE.md           # 프로젝트 가이드 (이 파일)
├── GitGuide.md         # 마스터 콘텐츠 문서 (마크다운)
├── html/               # HTML 프레젠테이션
│   ├── index.html      # 33개 슬라이드 정의
│   ├── style.css       # Glassmorphism 테마, 슬라이드 전환
│   ├── script.js       # 슬라이드 네비게이션 로직
│   └── images/         # GitHub UI 스크린샷
│       ├── new_repo.png
│       ├── collaborators.png
│       ├── merge.png
│       ├── rebase.png
│       └── squash.png
└── .claude/            # Claude 세션 데이터
```

## File Specifications

### GitGuide.md (마스터 문서)
- **역할**: 모든 콘텐츠의 원본 소스
- **형식**: 마크다운
- **업데이트 워크플로**: GitGuide.md 수정 → html/index.html에 반영
- **섹션**: 28개 챕터 (목차 참조)

### html/index.html
- **역할**: 슬라이드 기반 프레젠테이션
- **슬라이드 수**: 33개
- **구조**: `<div class="slide" data-id="...">`에 `.content-box.glass` 래퍼
- **상태 클래스**: `active`, `prev`, `next`

### html/style.css
- **테마**: Glassmorphism 디자인
- **CSS 변수**:
  - `--bg-color`, `--text-color`, `--accent-color` - 코어 테마
  - `--glass-bg`, `--glass-border` - 글래스모피즘 효과
  - `--gradient-1`, `--gradient-2` - 배경 글로브 애니메이션

### html/script.js
- **기능**: 슬라이드 네비게이션
- **컨트롤**: 화살표 키 (←/→), Space, 버튼
- **핵심 함수**: `showSlide(index)`

## Slide Categories

| 카테고리 | 슬라이드 수 | 내용 |
|---------|-----------|------|
| **Git 기초** | 10개 | 개념, 설치, 설정, 3-State, 명령어, 브랜치, Clone/Fork, fetch/pull |
| **Git 심화** | 4개 | 머지 전략, 충돌 해결, git log, 되돌리기 |
| **GitHub 협업** | 8개 | 워크플로, 웹 사용법, Star/Watch/Fork, PAT, CLI, PR, Issue |
| **DevOps** | 4개 | Actions, Release |
| **관리자** | 6개 | Team Plan, Organization, Branch Protection, 보안, 체크리스트 |
| **기타** | 1개 | 종료 슬라이드 |

## Development

빌드 도구나 패키지 매니저 없음 - 순수 HTML/CSS/JS.
브라우저에서 `html/index.html`을 직접 열어서 확인.

## Content Update Workflow

1. `GitGuide.md` 수정 (마스터 문서)
2. 해당 변경사항을 `html/index.html`에 반영
3. Playwright로 슬라이드 동작 검증

## 필수 규칙

### 1. 콘텐츠 동기화 (양방향)
- **GitGuide.md가 업데이트되면 html/index.html에도 반드시 반영해야 합니다**
- **html/index.html이 수정되면 GitGuide.md에도 반드시 반영해야 합니다**
- GitGuide.md는 마스터 문서이며, HTML은 이를 프레젠테이션 형태로 변환한 것
- 두 파일의 콘텐츠 불일치는 허용되지 않음

### 2. HTML 수정 후 테스트
- **html/ 디렉토리의 파일 수정 후에는 Playwright로 작동 테스트가 필수입니다**
- 테스트 항목:
  - 슬라이드 네비게이션 (←/→ 키, 버튼 클릭)
  - 슬라이드 전환 애니메이션
  - 콘텐츠 렌더링 확인

## Playwright MCP 팁

### 슬라이드 네비게이션
- `showSlide()` 함수는 전역 스코프가 아니므로 `page.evaluate()`로 직접 호출 불가
- **권장 방법**: `browser_run_code`로 키보드 이벤트 사용

```javascript
// 특정 슬라이드로 이동 (예: 11번째 슬라이드)
async (page) => {
  for (let i = 0; i < 10; i++) {  // 1페이지에서 시작하므로 n-1번 이동
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(80);
  }
}
```

### 슬라이드 ID로 인덱스 찾기
```javascript
async (page) => {
  const index = await page.evaluate(() => {
    const slides = document.querySelectorAll('.slide');
    for (let i = 0; i < slides.length; i++) {
      if (slides[i].dataset.id === 'target-slide-id') return i;
    }
    return -1;
  });
  return index;
}
```

### 현재 슬라이드 확인
```javascript
await page.evaluate(() => document.querySelector('.slide.active').dataset.id);
```

---

## HTML 슬라이드 템플릿 가이드

새 프로젝트에서 MD 콘텐츠를 HTML 슬라이드로 변환할 때 참고하세요.

### 1. 슬라이드 추가하기

#### 복사용 전체 슬라이드 블록 (Copy & Paste)

```html
<!-- ========== 새 슬라이드: [제목] ========== -->
<div class="slide" data-id="new-slide-id">
    <div class="content-box glass">
        <span class="badgem">Category</span>
        <h2>슬라이드 제목</h2>
        <p>슬라이드 설명 텍스트입니다.</p>

        <div class="grid-2">
            <div>
                <h3>📋 왼쪽 섹션</h3>
                <ul class="list-indented">
                    <li>항목 1</li>
                    <li>항목 2</li>
                    <li><code>코드 예시</code></li>
                </ul>
                <pre><code># 코드 블록
command --option value</code></pre>
            </div>
            <div>
                <h3>🔍 오른쪽 섹션</h3>
                <table>
                    <thead>
                        <tr><th>항목</th><th>설명</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>A</td><td>설명 A</td></tr>
                        <tr><td>B</td><td>설명 B</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 12px; margin-top: 1rem;">
            <p style="margin:0;">💡 <strong>팁:</strong> 강조하고 싶은 내용</p>
        </div>
    </div>
</div>
```

**사용법:**
1. 위 블록을 `index.html`의 원하는 위치에 붙여넣기
2. `data-id="new-slide-id"` → 고유 ID로 변경
3. `script.js`의 `slideTitles`에 `"new-slide-id": "목차 제목"` 추가
4. 불필요한 섹션 삭제 (grid-2, table 등)

#### 기본 슬라이드 구조
```html
<!-- data-id는 고유해야 함 (kebab-case 권장) -->
<div class="slide" data-id="unique-slide-id">
    <div class="content-box glass">
        <span class="badgem">카테고리</span>  <!-- 좌상단 뱃지 -->
        <h2>슬라이드 제목</h2>
        <p>설명 텍스트</p>
        <!-- 콘텐츠 -->
    </div>
</div>
```

#### 첫 번째 슬라이드 (인트로)
```html
<div class="slide active" data-id="intro">  <!-- active 클래스 필수 -->
    <div class="content-box glass">
        <h1>메인 제목 <span class="gradient-text">강조</span></h1>
        <p class="subtitle">부제목</p>
    </div>
</div>
```

#### 마지막 슬라이드 (엔딩)
```html
<div class="slide" data-id="end">
    <div class="content-box glass center">
        <h1>마무리 <span class="gradient-text">메시지</span></h1>
        <p>감사 인사</p>
    </div>
</div>
```

### 2. 콘텐츠 컴포넌트

#### 2열 그리드
```html
<div class="grid-2">
    <div>
        <h3>왼쪽 제목</h3>
        <p>왼쪽 내용</p>
    </div>
    <div>
        <h3>오른쪽 제목</h3>
        <p>오른쪽 내용</p>
    </div>
</div>
```

#### 테이블
```html
<table>
    <thead>
        <tr>
            <th>컬럼1</th>
            <th>컬럼2</th>
            <th>컬럼3</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>코드</code></td>
            <td>설명</td>
            <td>🟢 상태</td>
        </tr>
    </tbody>
</table>
```

#### 코드 블록
```html
<pre><code># 주석
git command --option
another command</code></pre>
```

#### 순서 없는 리스트
```html
<ul class="list-indented">
    <li>항목 1</li>
    <li>항목 2</li>
</ul>
```

#### 순서 있는 리스트
```html
<ol class="list-indented">
    <li><strong>Settings</strong> → <strong>Developer settings</strong></li>
    <li>다음 단계</li>
</ol>
```

#### 카드 스타일 박스
```html
<div class="step-card">
    <h3>📥 제목</h3>
    <p>설명</p>
    <pre><code>코드</code></pre>
</div>
```

#### 강조 박스
```html
<div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 12px; margin-top: 1rem;">
    <p style="margin:0; font-weight: 700; color: var(--accent-color);">
        "강조할 문구"
    </p>
</div>
```

#### 이미지 컨테이너
```html
<div class="img-container">
    <img src="images/example.png" alt="설명">
</div>
```

#### 플로우 스텝 (화살표 연결)
```html
<div class="flow-steps">
    <span>단계1</span>
    <span>단계2</span>
    <span>단계3</span>
</div>
```

### 3. 슬라이드 추가 시 script.js 수정

새 슬라이드 추가 후 **반드시** `script.js`의 `slideTitles` 객체에 등록:

```javascript
const slideTitles = {
    // ... 기존 항목들
    "new-slide-id": "목차에 표시될 제목",  // ← 추가
    // ...
};
```

### 4. CSS 커스터마이징

#### 테마 색상 변경 (style.css)
```css
:root {
    --bg-color: #0f172a;        /* 배경색 */
    --text-color: #f8fafc;      /* 텍스트 */
    --accent-color: #38bdf8;    /* 강조색 (링크, 하이라이트) */
    --glass-bg: rgba(30, 41, 59, 0.7);     /* 글래스 배경 */
    --glass-border: rgba(255, 255, 255, 0.1);  /* 글래스 테두리 */
    --gradient-1: #4f46e5;      /* 그라데이션 색상 1 */
    --gradient-2: #06b6d4;      /* 그라데이션 색상 2 */
}
```

#### 뱃지 색상 추가
```css
.badgem {
    background: linear-gradient(135deg, var(--gradient-1), var(--gradient-2));
    /* 기본 스타일 */
}

/* 특정 카테고리용 커스텀 뱃지 */
.badge-warning {
    background: linear-gradient(135deg, #f59e0b, #ef4444);
}
```

### 5. 프레젠테이션 제목 변경

#### HTML `<title>` 변경
```html
<head>
    <title>새 프로젝트 가이드</title>  <!-- 브라우저 탭 제목 -->
</head>
```

#### 인트로 슬라이드 제목
```html
<div class="slide active" data-id="intro">
    <div class="content-box glass">
        <h1>새 프로젝트 <span class="gradient-text">가이드</span></h1>
    </div>
</div>
```

#### TOC 제목 (script.js)
```javascript
const slideTitles = {
    "intro": "새 프로젝트 가이드",  // ← 첫 번째 항목
    // ...
};
```

### 6. MD → HTML 변환 규칙

| Markdown | HTML |
|----------|------|
| `## 제목` | `<h2>제목</h2>` + 새 슬라이드 |
| `### 소제목` | `<h3>소제목</h3>` |
| `**굵게**` | `<strong>굵게</strong>` |
| `` `코드` `` | `<code>코드</code>` |
| `> 인용` | 강조 박스 div |
| `- 항목` | `<ul class="list-indented">` |
| `1. 항목` | `<ol class="list-indented">` |
| 테이블 | `<table>` (위 템플릿 참조) |
| 코드블록 | `<pre><code>` |

### 7. 슬라이드 삭제

1. `html/index.html`에서 해당 `<div class="slide">` 블록 삭제
2. `html/script.js`의 `slideTitles`에서 해당 항목 삭제
3. GitGuide.md에서 해당 섹션 삭제 (동기화)

### 8. 슬라이드 순서 변경

`index.html`에서 `<div class="slide">` 블록의 순서를 변경하면 됨.
`script.js`의 `slideTitles` 순서는 **변경 불필요** (data-id 기반 매핑).

---

## Conversation

모든 대화는 한국어로 이루어져야 합니다.
