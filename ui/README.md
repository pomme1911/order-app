# 커피 주문 앱 - 프런트엔드

React + Vite를 사용한 커피 주문 앱의 프런트엔드 프로젝트입니다.

## 🚀 시작하기

### 개발 서버 실행
```bash
npm run dev
```
개발 서버가 `http://localhost:5173`에서 실행됩니다.

### 프로덕션 빌드
```bash
npm run build
```

### 빌드 미리보기
```bash
npm run preview
```

## 📁 프로젝트 구조

```
ui/
├── src/
│   ├── components/      # 재사용 가능한 컴포넌트
│   ├── pages/          # 페이지 컴포넌트 (주문하기, 관리자)
│   ├── styles/         # 추가 스타일 파일
│   ├── utils/          # 유틸리티 함수
│   ├── hooks/          # 커스텀 React 훅
│   ├── services/       # API 서비스
│   ├── assets/         # 이미지, 폰트 등
│   ├── App.jsx         # 메인 앱 컴포넌트
│   ├── App.css         # 앱 스타일
│   ├── main.jsx        # 엔트리 포인트
│   └── index.css       # 전역 스타일 및 CSS 변수
├── public/             # 정적 파일
├── index.html          # HTML 템플릿
├── vite.config.js      # Vite 설정
└── package.json        # 프로젝트 의존성
```

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: #6F4E37 (커피 브라운)
- **Secondary**: #8B4513 (밝은 브라운)
- **Accent**: #FF6B35 (오렌지)
- **Success**: #4CAF50
- **Warning**: #FF9800
- **Error**: #F44336

### 타이포그래피
- **폰트**: Noto Sans KR
- **크기**: 14px ~ 24px (반응형)

### 간격 시스템
8px 기준 (xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, xxl: 48px)

## 🏗️ 주요 기능

### 주문하기 화면
- 메뉴 목록 표시 (황금비율 레이아웃: 61.8% / 38.2%)
- 카테고리별 필터링
- 장바구니 기능
- 옵션 선택 (사이즈, 온도)
- 주문 생성

### 관리자 화면
- 주문 관리 (상태 변경, 취소)
- 재고 관리 (수량 조절)
- 통계 대시보드

## 🛠️ 기술 스택

- **React** 19.2.0 - UI 라이브러리
- **Vite** 7.2.4 - 빌드 도구
- **Vanilla JavaScript** - 추가 프레임워크 없이 순수 JS 사용
- **CSS3** - 스타일링 (CSS Variables, Flexbox, Grid)

## 📱 반응형 디자인

- **Mobile**: < 768px
- **Tablet**: 768px ~ 1024px
- **Desktop**: > 1024px

## 🔧 개발 가이드

### CSS 변수 사용
```css
.my-component {
  color: var(--color-primary);
  padding: var(--spacing-md);
  font-size: var(--font-size-body);
}
```

### 유틸리티 클래스
```jsx
<div className="card">
  <button className="btn btn-primary">주문하기</button>
</div>
```

## 📝 다음 단계

1. 주문하기 페이지 컴포넌트 개발
2. 관리자 페이지 컴포넌트 개발
3. API 서비스 연동
4. 상태 관리 구현
5. 테스트 작성
