# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Git과 GitHub 사용법을 가르치는 정적 슬라이드 기반 프레젠테이션 웹사이트입니다.
개발자와 관리자를 위한 Team Plan Edition (v2.0)으로, 28개 슬라이드로 구성되어 있습니다.

## Directory Structure

```
GitStartingGuide/
├── CLAUDE.md           # 프로젝트 가이드 (이 파일)
├── GitGuide.md         # 마스터 콘텐츠 문서 (마크다운)
├── html/               # HTML 프레젠테이션
│   ├── index.html      # 28개 슬라이드 정의
│   ├── style.css       # Glassmorphism 테마, 슬라이드 전환
│   ├── script.js       # 슬라이드 네비게이션 로직
│   └── images/         # GitHub UI 스크린샷
│       ├── new_repo.png
│       └── collaborators.png
└── .claude/            # Claude 세션 데이터
```

## File Specifications

### GitGuide.md (마스터 문서)
- **역할**: 모든 콘텐츠의 원본 소스
- **형식**: 마크다운
- **업데이트 워크플로**: GitGuide.md 수정 → html/index.html에 반영
- **섹션**: 23개 챕터 (목차 참조)

### html/index.html
- **역할**: 슬라이드 기반 프레젠테이션
- **슬라이드 수**: 28개
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
| **Git 기초** | 7개 | 개념, 설치, 설정, 명령어, 브랜치 |
| **Git 심화** | 3개 | 머지 전략, 충돌 해결, 되돌리기 |
| **GitHub 협업** | 6개 | 워크플로, CLI, PR, Issue |
| **DevOps** | 4개 | Actions, Release |
| **관리자** | 4개 | Team Plan, Organization, 보안 |
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

## Conversation

모든 대화는 한국어로 이루어져야 합니다.
