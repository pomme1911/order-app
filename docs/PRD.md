# 커피 주문 앱

## 1. 프로젝트 개요

### 1.1 프로젝트 명
커피 주문 앱

### 1.2 프로젝트 목적
사용자가 커피 메뉴를 주문하고, 관리자가 주문을 관리할 수 있는 간단한 풀스택 웹 앱

### 1.3 개발 범위
- 주문하기 화면(메뉴 선택 및 장바구니 기능)
- 관리자 화면(재고 관리 및 주문 상태 관리)
- 데이터를 생성/조회/수정/삭제할 수 있는 기능

## 2. 기술 스택
- Frontend: HTML, CSS, JavaScript, React
- Backend: Node.js, Express
- Database: PostgreSQL

## 3. 기본 사항
- Frontend와 Backend를 따로 개발
- 기본적인 웹 기술만 사용
- 사용자 인증이나 결제 기능은 제외
- 메뉴는 커피 메뉴만 있음

---

## 4. 주문하기 화면 PRD

### 4.1 화면 개요
사용자가 커피 메뉴를 탐색하고, 옵션을 선택하며, 장바구니에 담아 주문을 완료하는 메인 화면

### 4.2 레이아웃 구조 (황금비율 적용)

#### 4.2.1 전체 화면 비율
- **화면 분할**: 황금비율(1:1.618)을 적용하여 메뉴 영역과 장바구니 영역을 분할
  - **메뉴 영역**: 61.8% (좌측)
  - **장바구니 영역**: 38.2% (우측)
- **모바일 반응형**: 768px 이하에서는 세로 스택 레이아웃으로 전환

#### 4.2.2 컴포넌트 계층 구조
```
주문하기 화면
├── 헤더 (Header)
│   ├── 로고/앱 이름
│   └── 네비게이션 (주문하기/관리자)
├── 메인 컨테이너 (Main Container)
│   ├── 메뉴 영역 (Menu Section - 61.8%)
│   │   ├── 카테고리 필터 (Category Filter)
│   │   └── 메뉴 그리드 (Menu Grid)
│   │       └── 메뉴 카드 (Menu Card) × N
│   │           ├── 메뉴 이미지
│   │           ├── 메뉴 이름
│   │           ├── 가격
│   │           ├── 재고 상태
│   │           └── 추가 버튼
│   └── 장바구니 영역 (Cart Section - 38.2%)
│       ├── 장바구니 헤더
│       ├── 장바구니 아이템 리스트
│       │   └── 장바구니 아이템 × N
│       │       ├── 메뉴 정보
│       │       ├── 옵션 정보
│       │       ├── 수량 조절 (+/-)
│       │       └── 삭제 버튼
│       ├── 합계 정보
│       └── 주문하기 버튼
└── 모달 (Modal - 조건부 렌더링)
    └── 옵션 선택 모달
        ├── 메뉴 정보
        ├── 사이즈 선택 (Small/Medium/Large)
        ├── 옵션 선택 (Hot/Iced)
        ├── 수량 선택
        └── 장바구니 담기 버튼
```

### 4.3 상세 컴포넌트 명세

#### 4.3.1 헤더 (Header)
**목적**: 브랜드 아이덴티티 표시 및 화면 전환 네비게이션

**구성 요소**:
- 로고/앱 이름: "☕ 커피 주문"
- 네비게이션 탭:
  - "주문하기" (활성 상태)
  - "관리자"

**스타일**:
- 높이: 60px
- 배경: 그라디언트 (커피 테마 - #6F4E37 → #8B4513)
- 텍스트: 흰색, 볼드
- 고정 위치 (sticky)

#### 4.3.2 메뉴 영역 (Menu Section)

##### 카테고리 필터
**목적**: 메뉴를 카테고리별로 필터링

**구성 요소**:
- 버튼 그룹: "전체", "에스프레소", "라떼", "프라페", "디카페인"
- 활성 카테고리 하이라이트

**인터랙션**:
- 클릭 시 해당 카테고리 메뉴만 표시
- 부드러운 전환 애니메이션

##### 메뉴 카드 (Menu Card)
**목적**: 개별 메뉴 정보 표시 및 선택

**구성 요소**:
- 메뉴 이미지: 정사각형 (1:1 비율), 200px × 200px
- 메뉴 이름: 16px, 볼드
- 가격: 14px, 세미볼드
- 재고 상태: 
  - 재고 있음: 초록색 뱃지 "재고 있음"
  - 재고 없음: 회색 뱃지 "품절", 카드 전체 50% 투명도
- 추가 버튼: "+ 담기" 버튼

**레이아웃**:
- 그리드: 3열 (데스크톱), 2열 (태블릿), 1열 (모바일)
- 간격: 20px
- 카드 비율: 황금비율 적용 (너비:높이 = 1:1.618)

**인터랙션**:
- 호버 시: 카드 상승 효과 (box-shadow 증가, transform: translateY(-5px))
- 클릭 시: 옵션 선택 모달 오픈 (재고 있는 경우만)
- 품절 시: 클릭 불가, 커서 not-allowed

#### 4.3.3 장바구니 영역 (Cart Section)

**목적**: 선택한 메뉴 확인 및 주문 관리

**구성 요소**:

##### 장바구니 헤더
- 제목: "🛒 장바구니"
- 아이템 개수 표시: "(N개)"

##### 장바구니 아이템
**구성**:
- 메뉴 이름 + 옵션 (예: "아메리카노 (Medium, Iced)")
- 단가 × 수량
- 수량 조절 버튼: [-] [수량] [+]
- 삭제 버튼: [×]

**레이아웃**:
- 리스트 형태, 스크롤 가능
- 최대 높이: calc(100vh - 300px)

##### 합계 정보
- 총 수량: "총 N개"
- 총 금액: "₩ XX,XXX원" (큰 폰트, 볼드)

##### 주문하기 버튼
- 전체 너비 버튼
- 높이: 50px
- 배경: 주요 액션 컬러 (#FF6B35)
- 텍스트: "주문하기 (₩ XX,XXX)"
- 장바구니 비어있을 때: 비활성화 (회색, 클릭 불가)

**인터랙션**:
- 수량 증가/감소: 즉시 반영, 0이 되면 자동 삭제
- 삭제 버튼: 확인 없이 즉시 삭제
- 주문하기 클릭: 주문 완료 처리 후 장바구니 초기화

#### 4.3.4 옵션 선택 모달 (Option Modal)

**목적**: 메뉴 옵션 선택 및 장바구니 추가

**구성 요소**:
- 모달 오버레이: 반투명 검정 배경
- 모달 컨텐츠: 중앙 정렬, 흰색 배경, 둥근 모서리
  - 닫기 버튼 (×): 우측 상단
  - 메뉴 이미지: 150px × 150px
  - 메뉴 이름: 20px, 볼드
  - 기본 가격: 18px
  - 사이즈 선택:
    - 라디오 버튼 그룹
    - Small (+0원), Medium (+500원), Large (+1,000원)
  - 온도 선택:
    - 라디오 버튼 그룹
    - Hot (+0원), Iced (+0원)
  - 수량 선택:
    - [-] [수량] [+] 버튼
    - 최소 1, 최대 99
  - 최종 가격 표시: "₩ XX,XXX원"
  - 장바구니 담기 버튼: 전체 너비, 주요 액션 컬러

**인터랙션**:
- 옵션 변경 시: 가격 실시간 업데이트
- 장바구니 담기: 모달 닫기 + 장바구니에 아이템 추가 + 토스트 알림
- 오버레이 클릭 또는 닫기 버튼: 모달 닫기

### 4.4 데이터 구조

#### 4.4.1 메뉴 아이템 (Menu Item)
```javascript
{
  id: number,
  name: string,
  category: string, // "espresso" | "latte" | "frappe" | "decaf"
  basePrice: number,
  imageUrl: string,
  stock: number, // 재고 수량
  isAvailable: boolean // 재고 > 0
}
```

#### 4.4.2 장바구니 아이템 (Cart Item)
```javascript
{
  id: string, // unique identifier
  menuId: number,
  menuName: string,
  size: string, // "small" | "medium" | "large"
  temperature: string, // "hot" | "iced"
  quantity: number,
  unitPrice: number, // 옵션 포함 단가
  totalPrice: number // unitPrice × quantity
}
```

#### 4.4.3 주문 (Order)
```javascript
{
  orderId: number,
  items: CartItem[],
  totalAmount: number,
  orderDate: timestamp,
  status: string // "pending" | "completed" | "cancelled"
}
```

### 4.5 사용자 플로우

1. **메뉴 탐색**
   - 사용자가 주문하기 화면 진입
   - 카테고리 필터로 원하는 메뉴 탐색
   - 메뉴 카드 확인 (이미지, 이름, 가격, 재고)

2. **메뉴 선택**
   - 메뉴 카드 클릭 → 옵션 선택 모달 오픈
   - 사이즈 선택 (Small/Medium/Large)
   - 온도 선택 (Hot/Iced)
   - 수량 선택 (1~99)
   - 최종 가격 확인

3. **장바구니 추가**
   - "장바구니 담기" 버튼 클릭
   - 모달 닫힘 + 토스트 알림 표시
   - 장바구니 영역에 아이템 추가됨

4. **장바구니 관리**
   - 수량 조절 (+/- 버튼)
   - 아이템 삭제 (× 버튼)
   - 총 금액 실시간 업데이트

5. **주문 완료**
   - "주문하기" 버튼 클릭
   - 주문 데이터 서버 전송
   - 성공 시: 장바구니 초기화 + 성공 알림
   - 실패 시: 에러 메시지 표시

### 4.6 UI/UX 디자인 가이드라인

#### 4.6.1 컬러 팔레트
- **Primary**: #6F4E37 (커피 브라운)
- **Secondary**: #8B4513 (밝은 브라운)
- **Accent**: #FF6B35 (오렌지 - 액션 버튼)
- **Success**: #4CAF50 (재고 있음)
- **Disabled**: #BDBDBD (품절/비활성)
- **Background**: #F5F5F5 (연한 회색)
- **Text Primary**: #212121
- **Text Secondary**: #757575

#### 4.6.2 타이포그래피
- **폰트**: 'Noto Sans KR', sans-serif
- **헤더**: 24px, 볼드
- **서브헤더**: 20px, 세미볼드
- **본문**: 16px, 레귤러
- **캡션**: 14px, 레귤러
- **가격**: 18px, 볼드

#### 4.6.3 간격 시스템 (8px 기준)
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px

#### 4.6.4 애니메이션
- **전환**: 0.3s ease-in-out
- **호버**: 0.2s ease
- **모달**: fade-in 0.3s

#### 4.6.5 반응형 브레이크포인트
- **Mobile**: < 768px
- **Tablet**: 768px ~ 1024px
- **Desktop**: > 1024px

### 4.7 기능 요구사항

#### 4.7.1 필수 기능
- ✅ 메뉴 목록 조회 (카테고리별 필터링)
- ✅ 메뉴 상세 정보 표시
- ✅ 재고 상태 실시간 반영
- ✅ 옵션 선택 (사이즈, 온도)
- ✅ 장바구니 추가/수정/삭제
- ✅ 주문 생성 및 전송
- ✅ 반응형 레이아웃

#### 4.7.2 부가 기능
- 🔄 메뉴 검색 기능
- 🔄 인기 메뉴 표시
- 🔄 주문 내역 확인
- 🔄 다크 모드 지원

### 4.8 성능 요구사항
- 초기 로딩 시간: < 2초
- 메뉴 필터링: < 100ms
- 장바구니 업데이트: 즉시 반영
- 이미지 최적화: WebP 포맷, lazy loading

### 4.9 접근성 요구사항
- 키보드 네비게이션 지원
- ARIA 레이블 적용
- 색상 대비 비율: 최소 4.5:1
- 스크린 리더 호환

---

## 5. 관리자 화면 PRD

### 5.1 화면 개요
관리자가 재고를 관리하고 주문 상태를 확인 및 처리하는 관리 화면

### 5.2 레이아웃 구조 (황금비율 적용)

#### 5.2.1 황금비율 와이어프레임

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          헤더 (Header - 60px)                            │
│  ☕ 커피 주문          [주문하기]  [관리자 ✓]                              │
└─────────────────────────────────────────────────────────────────────────┘
┌──────────────────┬──────────────────────────────────────────────────────┐
│                  │                                                      │
│   사이드바        │              메인 컨텐츠 영역 (61.8%)                 │
│   (38.2%)        │                                                      │
│                  │  ┌────────────────────────────────────────────────┐  │
│  ┌────────────┐  │  │     주문 관리 패널 (38.2%)                     │  │
│  │ 📦 재고관리 │  │  │                                                │  │
│  └────────────┘  │  │  주문 목록 테이블                               │  │
│                  │  │  ┌──┬────────┬──────┬────────┬────────┐       │  │
│  ┌────────────┐  │  │  │ID│ 메뉴   │ 수량 │ 금액   │ 상태   │       │  │
│  │ 📋 주문관리 │  │  │  ├──┼────────┼──────┼────────┼────────┤       │  │
│  │    (활성)   │  │  │  │1 │아메... │  2   │ 8,000원│[완료]  │       │  │
│  └────────────┘  │  │  │2 │라떼... │  1   │ 5,500원│[대기]  │       │  │
│                  │  │  └──┴────────┴──────┴────────┴────────┘       │  │
│  ┌────────────┐  │  └────────────────────────────────────────────────┘  │
│  │  통계 요약  │  │                                                      │
│  │            │  │  ┌────────────────────────────────────────────────┐  │
│  │ 오늘 주문  │  │  │     재고 관리 패널 (61.8%)                     │  │
│  │   15건     │  │  │                                                │  │
│  │            │  │  │  재고 그리드                                    │  │
│  │ 총 매출    │  │  │  ┌────────┐ ┌────────┐ ┌────────┐            │  │
│  │ ₩125,000  │  │  │  │ [IMG]  │ │ [IMG]  │ │ [IMG]  │            │  │
│  │            │  │  │  │아메리카노│ │카페라떼 │ │카푸치노 │            │  │
│  └────────────┘  │  │  │재고: 50 │ │재고: 30 │ │재고: 25 │            │  │
│                  │  │  │ [-][+] │ │ [-][+] │ │ [-][+] │            │  │
│                  │  │  └────────┘ └────────┘ └────────┘            │  │
│                  │  │  ┌────────┐ ┌────────┐ ┌────────┐            │  │
│                  │  │  │ [IMG]  │ │ [IMG]  │ │ [IMG]  │            │  │
│                  │  │  │바닐라... │ │카라멜... │ │모카...  │            │  │
│                  │  │  │재고: 15 │ │재고: 20 │ │재고: 0  │            │  │
│                  │  │  │ [-][+] │ │ [-][+] │ │ [-][+] │            │  │
│                  │  │  └────────┘ └────────┘ └────────┘            │  │
│                  │  └────────────────────────────────────────────────┘  │
│                  │                                                      │
└──────────────────┴──────────────────────────────────────────────────────┘

비율 설명:
- 사이드바: 38.2% (황금비율의 작은 부분)
- 메인 컨텐츠: 61.8% (황금비율의 큰 부분)
- 메인 컨텐츠 내부:
  - 주문 관리 패널: 38.2% (상단)
  - 재고 관리 패널: 61.8% (하단)
```

#### 5.2.2 전체 화면 비율
- **사이드바**: 38.2% (좌측) - 네비게이션 및 통계
- **메인 컨텐츠 영역**: 61.8% (우측) - 주문/재고 관리
- **메인 컨텐츠 내부 분할** (세로):
  - **주문 관리 패널**: 38.2% (상단)
  - **재고 관리 패널**: 61.8% (하단)
- **모바일 반응형**: 768px 이하에서는 사이드바가 상단으로 이동, 세로 스택 레이아웃

#### 5.2.3 컴포넌트 계층 구조
```
관리자 화면
├── 헤더 (Header)
│   ├── 로고/앱 이름
│   └── 네비게이션 (주문하기/관리자)
├── 메인 컨테이너 (Main Container)
│   ├── 사이드바 (Sidebar - 38.2%)
│   │   ├── 네비게이션 메뉴
│   │   │   ├── 재고 관리 탭
│   │   │   └── 주문 관리 탭
│   │   └── 통계 요약 카드
│   │       ├── 오늘 주문 건수
│   │       ├── 총 매출
│   │       └── 품절 상품 수
│   └── 메인 컨텐츠 영역 (Main Content - 61.8%)
│       ├── 주문 관리 패널 (Order Panel - 38.2%)
│       │   ├── 패널 헤더
│       │   ├── 필터/정렬 옵션
│       │   └── 주문 테이블
│       │       └── 주문 행 × N
│       │           ├── 주문 ID
│       │           ├── 주문 메뉴 목록
│       │           ├── 총 수량
│       │           ├── 총 금액
│       │           ├── 주문 시간
│       │           ├── 상태 뱃지
│       │           └── 액션 버튼
│       └── 재고 관리 패널 (Inventory Panel - 61.8%)
│           ├── 패널 헤더
│           ├── 검색/필터 바
│           └── 재고 그리드
│               └── 재고 카드 × N
│                   ├── 메뉴 이미지
│                   ├── 메뉴 이름
│                   ├── 현재 재고 수량
│                   ├── 재고 상태 표시
│                   └── 재고 조절 버튼 (+/-)
```

### 5.3 상세 컴포넌트 명세

#### 5.3.1 헤더 (Header)
**목적**: 브랜드 아이덴티티 및 화면 전환

**구성 요소**:
- 로고/앱 이름: "☕ 커피 주문"
- 네비게이션 탭:
  - "주문하기"
  - "관리자" (활성 상태)

**스타일**:
- 높이: 60px
- 배경: 그라디언트 (#6F4E37 → #8B4513)
- 텍스트: 흰색, 볼드
- 고정 위치 (sticky)

#### 5.3.2 사이드바 (Sidebar)

##### 네비게이션 메뉴
**목적**: 관리 기능 간 전환

**구성 요소**:
- 재고 관리 탭: 📦 아이콘 + "재고 관리"
- 주문 관리 탭: 📋 아이콘 + "주문 관리"

**스타일**:
- 버튼 형태, 전체 너비
- 활성 탭: 배경 강조 (#FF6B35), 흰색 텍스트
- 비활성 탭: 투명 배경, 어두운 텍스트
- 간격: 8px

**인터랙션**:
- 클릭 시: 해당 패널로 스크롤 또는 포커스 이동
- 호버 시: 배경 밝아짐

##### 통계 요약 카드
**목적**: 주요 지표 한눈에 확인

**구성 요소**:
- 오늘 주문 건수: 숫자 + "건"
- 총 매출: "₩ XXX,XXX"
- 품절 상품 수: 숫자 + "개"

**스타일**:
- 카드 형태, 흰색 배경
- 그림자: subtle box-shadow
- 패딩: 16px
- 간격: 16px
- 숫자: 24px, 볼드
- 레이블: 14px, 회색

**데이터 업데이트**:
- 실시간 또는 주기적 갱신 (30초마다)

#### 5.3.3 주문 관리 패널 (Order Management Panel)

##### 패널 헤더
**구성**:
- 제목: "📋 주문 관리"
- 새로고침 버튼: 🔄 아이콘

##### 필터/정렬 옵션
**구성**:
- 상태 필터: "전체", "대기중", "완료", "취소"
- 정렬: "최신순", "오래된순", "금액순"

**스타일**:
- 드롭다운 또는 버튼 그룹
- 인라인 배치

##### 주문 테이블
**목적**: 주문 목록 표시 및 관리

**컬럼 구성**:
1. **주문 ID**: 자동 증가 번호
2. **주문 메뉴**: 메뉴명 + 옵션 (예: "아메리카노(M,Iced) x2")
3. **총 수량**: 전체 아이템 수량 합계
4. **총 금액**: "₩ XX,XXX"
5. **주문 시간**: "HH:MM" 또는 "YYYY-MM-DD HH:MM"
6. **상태**: 뱃지 형태
   - 대기중: 노란색 "대기중"
   - 완료: 초록색 "완료"
   - 취소: 회색 "취소"
7. **액션**: 버튼 그룹
   - "완료" 버튼 (대기중 상태일 때만)
   - "취소" 버튼 (대기중 상태일 때만)
   - "상세" 버튼 (항상 표시)

**레이아웃**:
- 테이블 형태, 스크롤 가능
- 최대 높이: 설정된 패널 높이 내에서
- 행 호버 시: 배경 밝아짐
- 반응형: 모바일에서는 카드 형태로 전환

**인터랙션**:
- 완료 버튼 클릭: 상태를 "완료"로 변경, 재고 차감
- 취소 버튼 클릭: 확인 모달 → 상태를 "취소"로 변경
- 상세 버튼 클릭: 주문 상세 모달 오픈

#### 5.3.4 재고 관리 패널 (Inventory Management Panel)

##### 패널 헤더
**구성**:
- 제목: "📦 재고 관리"
- 전체 재고 추가 버튼: "+ 일괄 추가" (모든 메뉴에 N개씩 추가)

##### 검색/필터 바
**구성**:
- 검색 입력: 메뉴명 검색
- 카테고리 필터: "전체", "에스프레소", "라떼", "프라페", "디카페인"
- 재고 상태 필터: "전체", "재고 있음", "품절", "부족(10개 이하)"

##### 재고 카드 (Inventory Card)
**목적**: 개별 메뉴의 재고 표시 및 조절

**구성 요소**:
- 메뉴 이미지: 정사각형, 150px × 150px
- 메뉴 이름: 16px, 볼드
- 카테고리 뱃지: 작은 뱃지 (예: "라떼")
- 현재 재고 수량: 큰 숫자 + "개"
- 재고 상태 표시:
  - 재고 충분 (>10): 초록색 "재고 있음"
  - 재고 부족 (1-10): 주황색 "재고 부족"
  - 품절 (0): 빨간색 "품절"
- 재고 조절 버튼:
  - [-] 버튼: 재고 1개 감소 (최소 0)
  - 재고 수량 입력: 직접 입력 가능
  - [+] 버튼: 재고 1개 증가 (최대 999)
- 빠른 추가 버튼: "+10", "+50" (클릭 시 해당 수량 추가)

**레이아웃**:
- 그리드: 4열 (데스크톱), 3열 (태블릿), 2열 (모바일)
- 간격: 20px
- 카드 비율: 황금비율 적용 (너비:높이 = 1:1.618)

**스타일**:
- 카드 배경: 흰색
- 테두리: 1px solid #E0E0E0
- 둥근 모서리: 8px
- 그림자: subtle box-shadow
- 품절 시: 카드 전체 약간 어둡게 (opacity: 0.7)

**인터랙션**:
- [-] 버튼 클릭: 재고 1 감소, 즉시 서버 업데이트
- [+] 버튼 클릭: 재고 1 증가, 즉시 서버 업데이트
- 수량 직접 입력: blur 시 서버 업데이트
- 빠른 추가 버튼: 해당 수량만큼 증가
- 호버 시: 카드 약간 상승 효과

#### 5.3.5 주문 상세 모달 (Order Detail Modal)

**목적**: 주문의 전체 정보 확인

**구성 요소**:
- 모달 오버레이: 반투명 검정 배경
- 모달 컨텐츠: 중앙 정렬, 흰색 배경
  - 닫기 버튼 (×): 우측 상단
  - 주문 ID: "주문 #123"
  - 주문 시간: "2025-12-03 12:30:45"
  - 주문 상태: 뱃지
  - 주문 아이템 목록:
    - 각 아이템: 메뉴명 + 옵션 + 수량 + 단가 + 합계
  - 총 수량: "총 N개"
  - 총 금액: "₩ XX,XXX원" (큰 폰트)
  - 액션 버튼:
    - "주문 완료" (대기중일 때)
    - "주문 취소" (대기중일 때)
    - "닫기" (항상)

**인터랙션**:
- 오버레이 클릭: 모달 닫기
- 주문 완료/취소: 확인 후 처리, 모달 닫기

### 5.4 데이터 구조

#### 5.4.1 주문 (Order)
```javascript
{
  orderId: number,
  items: [
    {
      menuId: number,
      menuName: string,
      size: string,
      temperature: string,
      quantity: number,
      unitPrice: number,
      totalPrice: number
    }
  ],
  totalQuantity: number,
  totalAmount: number,
  orderDate: timestamp,
  status: string // "pending" | "completed" | "cancelled"
}
```

#### 5.4.2 재고 아이템 (Inventory Item)
```javascript
{
  menuId: number,
  menuName: string,
  category: string,
  imageUrl: string,
  currentStock: number,
  stockStatus: string, // "sufficient" | "low" | "out"
  lastUpdated: timestamp
}
```

#### 5.4.3 통계 데이터 (Statistics)
```javascript
{
  todayOrderCount: number,
  todayRevenue: number,
  outOfStockCount: number,
  lowStockCount: number,
  lastUpdated: timestamp
}
```

### 5.5 사용자 플로우

#### 5.5.1 주문 관리 플로우
1. **주문 목록 확인**
   - 관리자 화면 진입
   - 주문 관리 패널에서 주문 목록 확인
   - 필터/정렬로 원하는 주문 찾기

2. **주문 상태 변경**
   - 대기중 주문의 "완료" 버튼 클릭
   - 상태가 "완료"로 변경
   - 해당 메뉴의 재고 자동 차감
   - 통계 업데이트

3. **주문 취소**
   - 대기중 주문의 "취소" 버튼 클릭
   - 확인 모달 표시
   - 확인 시: 상태가 "취소"로 변경
   - 재고는 차감되지 않음

4. **주문 상세 확인**
   - "상세" 버튼 클릭
   - 주문 상세 모달 오픈
   - 전체 주문 정보 확인

#### 5.5.2 재고 관리 플로우
1. **재고 현황 확인**
   - 재고 관리 패널에서 전체 메뉴 재고 확인
   - 품절/부족 상품 필터링
   - 재고 상태 색상으로 한눈에 파악

2. **재고 조절**
   - 개별 메뉴의 [+]/[-] 버튼으로 재고 조절
   - 또는 수량 직접 입력
   - 변경 즉시 서버에 반영
   - 재고 상태 자동 업데이트

3. **대량 재고 추가**
   - "일괄 추가" 버튼 클릭
   - 추가할 수량 입력 모달
   - 확인 시: 모든 메뉴에 해당 수량 추가

4. **재고 검색**
   - 검색 바에 메뉴명 입력
   - 실시간 필터링으로 결과 표시

### 5.6 UI/UX 디자인 가이드라인

#### 5.6.1 컬러 팔레트
- **Primary**: #6F4E37 (커피 브라운)
- **Secondary**: #8B4513 (밝은 브라운)
- **Accent**: #FF6B35 (오렌지 - 액션 버튼)
- **Success**: #4CAF50 (재고 충분, 주문 완료)
- **Warning**: #FF9800 (재고 부족)
- **Error**: #F44336 (품절, 주문 취소)
- **Info**: #2196F3 (대기중)
- **Background**: #F5F5F5 (연한 회색)
- **Card Background**: #FFFFFF
- **Border**: #E0E0E0
- **Text Primary**: #212121
- **Text Secondary**: #757575

#### 5.6.2 타이포그래피
- **폰트**: 'Noto Sans KR', sans-serif
- **페이지 제목**: 28px, 볼드
- **패널 제목**: 20px, 볼드
- **테이블 헤더**: 14px, 세미볼드
- **테이블 내용**: 14px, 레귤러
- **카드 제목**: 16px, 볼드
- **통계 숫자**: 24px, 볼드
- **통계 레이블**: 14px, 레귤러

#### 5.6.3 간격 시스템 (8px 기준)
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px

#### 5.6.4 테이블 스타일
- **헤더 배경**: #F5F5F5
- **행 구분선**: 1px solid #E0E0E0
- **행 호버**: 배경 #FAFAFA
- **셀 패딩**: 12px 16px
- **폰트 크기**: 14px

#### 5.6.5 버튼 스타일
- **Primary 버튼**: 배경 #FF6B35, 텍스트 흰색
- **Success 버튼**: 배경 #4CAF50, 텍스트 흰색
- **Danger 버튼**: 배경 #F44336, 텍스트 흰색
- **Secondary 버튼**: 배경 투명, 테두리 1px, 텍스트 #757575
- **높이**: 36px (일반), 40px (큰 버튼)
- **패딩**: 8px 16px
- **둥근 모서리**: 4px

#### 5.6.6 애니메이션
- **전환**: 0.3s ease-in-out
- **호버**: 0.2s ease
- **모달**: fade-in 0.3s
- **테이블 행 호버**: 0.15s ease

#### 5.6.7 반응형 브레이크포인트
- **Mobile**: < 768px
  - 사이드바: 상단으로 이동, 가로 스크롤 탭
  - 테이블: 카드 형태로 전환
  - 재고 그리드: 2열
- **Tablet**: 768px ~ 1024px
  - 사이드바: 유지
  - 재고 그리드: 3열
- **Desktop**: > 1024px
  - 전체 레이아웃 유지
  - 재고 그리드: 4열

### 5.7 기능 요구사항

#### 5.7.1 필수 기능
- ✅ 주문 목록 조회 (실시간 업데이트)
- ✅ 주문 상태 변경 (대기중 → 완료/취소)
- ✅ 주문 상세 정보 확인
- ✅ 재고 목록 조회
- ✅ 재고 수량 조절 (증가/감소)
- ✅ 재고 직접 입력
- ✅ 재고 상태 자동 업데이트
- ✅ 통계 정보 표시
- ✅ 검색 및 필터링
- ✅ 반응형 레이아웃

#### 5.7.2 부가 기능
- 🔄 주문 알림 (새 주문 시 사운드/푸시)
- 🔄 재고 부족 알림 (임계값 이하 시)
- 🔄 주문 내역 엑셀 다운로드
- 🔄 재고 변경 이력 조회
- 🔄 일별/주별/월별 통계 차트
- 🔄 인기 메뉴 분석
- 🔄 메뉴 추가/수정/삭제 기능

### 5.8 비즈니스 로직

#### 5.8.1 주문 완료 처리
```
1. 관리자가 "완료" 버튼 클릭
2. 주문 상태를 "completed"로 변경
3. 주문에 포함된 각 메뉴의 재고 차감
   - 예: 아메리카노 2개 → 아메리카노 재고 -2
4. 재고가 0 이하가 되면 품절 상태로 변경
5. 통계 업데이트 (매출 증가)
6. 성공 메시지 표시
```

#### 5.8.2 재고 조절
```
1. 관리자가 [+] 또는 [-] 버튼 클릭
2. 재고 수량 변경 (최소 0, 최대 999)
3. 서버에 즉시 업데이트 요청
4. 재고 상태 자동 계산:
   - stock > 10: "sufficient"
   - 1 <= stock <= 10: "low"
   - stock = 0: "out"
5. 재고 상태에 따라 색상 변경
6. 품절 상품 수 통계 업데이트
```

#### 5.8.3 재고-주문 연동
```
- 주문하기 화면에서 주문 생성 시:
  → 주문 상태는 "pending"
  → 재고는 아직 차감되지 않음
  
- 관리자가 주문 완료 처리 시:
  → 주문 상태가 "completed"로 변경
  → 재고 차감 실행
  → 재고 부족 시 에러 메시지 (롤백)
  
- 관리자가 주문 취소 처리 시:
  → 주문 상태가 "cancelled"로 변경
  → 재고는 차감되지 않음
```

### 5.9 성능 요구사항
- 주문 목록 로딩: < 1초
- 재고 업데이트 반영: < 500ms
- 주문 상태 변경: < 1초
- 실시간 데이터 갱신: 30초마다 또는 WebSocket 사용
- 테이블 페이지네이션: 20개씩 표시

### 5.10 접근성 요구사항
- 키보드 네비게이션 지원 (Tab, Enter, Space)
- ARIA 레이블 적용 (테이블, 버튼, 입력 필드)
- 색상 대비 비율: 최소 4.5:1
- 스크린 리더 호환
- 포커스 표시 명확히

### 5.11 에러 처리

#### 5.11.1 재고 부족 에러
```
상황: 주문 완료 처리 시 재고가 부족한 경우
처리:
1. 에러 메시지 표시: "재고가 부족하여 주문을 완료할 수 없습니다."
2. 부족한 메뉴 목록 표시
3. 주문 상태는 변경되지 않음
4. 재고 관리 패널로 이동 제안
```

#### 5.11.2 네트워크 에러
```
상황: 서버 통신 실패
처리:
1. 에러 메시지 표시: "서버와 연결할 수 없습니다."
2. 재시도 버튼 제공
3. 변경 사항 롤백
```

#### 5.11.3 동시성 에러
```
상황: 여러 관리자가 동시에 같은 데이터 수정
처리:
1. 낙관적 잠금 (Optimistic Locking) 사용
2. 충돌 감지 시 최신 데이터 다시 로드
3. 사용자에게 알림 후 재시도 요청
```

### 5.12 보안 요구사항
- 관리자 인증 (추후 구현 시)
- CSRF 토큰 사용
- SQL Injection 방지 (Prepared Statements)
- XSS 방지 (입력 검증 및 이스케이핑)
- 재고 수량 입력 검증 (0-999 범위)

---

## 6. 백엔드 개발 PRD

### 6.1 개요
커피 주문 앱의 백엔드 시스템은 메뉴 관리, 옵션 관리, 주문 처리를 담당하며, RESTful API를 통해 프론트엔드와 통신합니다.

### 6.2 데이터 모델

#### 6.2.1 Menus (메뉴 테이블)
메뉴 정보를 저장하는 핵심 테이블

**필드 구조**:
```javascript
{
  id: number (PRIMARY KEY, AUTO_INCREMENT),
  name: string (NOT NULL), // 커피 이름 (예: "아메리카노")
  description: string, // 메뉴 설명 (예: "깊고 진한 에스프레소")
  price: number (NOT NULL), // 기본 가격 (원 단위)
  image_url: string, // 이미지 URL
  stock: number (NOT NULL, DEFAULT 0), // 재고 수량
  quantity: number (NOT NULL, DEFAULT 0), // 판매 가능 수량
  category: string, // 카테고리 (예: "espresso", "latte", "frappe")
  is_available: boolean (DEFAULT true), // 판매 가능 여부
  created_at: timestamp (DEFAULT CURRENT_TIMESTAMP),
  updated_at: timestamp (DEFAULT CURRENT_TIMESTAMP ON UPDATE)
}
```

**인덱스**:
- PRIMARY KEY: `id`
- INDEX: `category`
- INDEX: `is_available`

**비즈니스 규칙**:
- `stock`이 0이면 `is_available`을 자동으로 `false`로 설정
- `price`는 양수여야 함
- `name`은 중복 불가 (UNIQUE 제약)

#### 6.2.2 Options (옵션 테이블)
메뉴에 추가할 수 있는 옵션 정보

**필드 구조**:
```javascript
{
  id: number (PRIMARY KEY, AUTO_INCREMENT),
  menu_id: number (FOREIGN KEY → Menus.id), // 연결할 메뉴 ID
  option_name: string (NOT NULL), // 옵션 이름 (예: "Medium", "Iced")
  option_type: string (NOT NULL), // 옵션 타입 (예: "size", "temperature")
  option_price: number (NOT NULL, DEFAULT 0), // 옵션 추가 가격
  is_default: boolean (DEFAULT false), // 기본 옵션 여부
  created_at: timestamp (DEFAULT CURRENT_TIMESTAMP),
  updated_at: timestamp (DEFAULT CURRENT_TIMESTAMP ON UPDATE)
}
```

**인덱스**:
- PRIMARY KEY: `id`
- FOREIGN KEY: `menu_id` REFERENCES `Menus(id)` ON DELETE CASCADE
- INDEX: `menu_id, option_type`

**비즈니스 규칙**:
- `option_type`은 "size" 또는 "temperature"만 허용
- 같은 `menu_id`와 `option_type` 조합에서 하나의 옵션만 `is_default = true`
- `option_price`는 0 이상이어야 함

**기본 옵션 예시**:
```javascript
// 사이즈 옵션
{ option_name: "Small", option_type: "size", option_price: 0, is_default: true }
{ option_name: "Medium", option_type: "size", option_price: 500 }
{ option_name: "Large", option_type: "size", option_price: 1000 }

// 온도 옵션
{ option_name: "Hot", option_type: "temperature", option_price: 0, is_default: true }
{ option_name: "Iced", option_type: "temperature", option_price: 0 }
```

#### 6.2.3 Orders (주문 테이블)
고객의 주문 정보를 저장

**필드 구조**:
```javascript
{
  id: number (PRIMARY KEY, AUTO_INCREMENT),
  order_date: timestamp (NOT NULL, DEFAULT CURRENT_TIMESTAMP), // 주문 일시
  order_items: JSON (NOT NULL), // 주문 내용 (메뉴, 수량, 옵션, 금액)
  total_amount: number (NOT NULL), // 총 주문 금액
  total_quantity: number (NOT NULL), // 총 주문 수량
  status: string (NOT NULL, DEFAULT 'pending'), // 주문 상태
  created_at: timestamp (DEFAULT CURRENT_TIMESTAMP),
  updated_at: timestamp (DEFAULT CURRENT_TIMESTAMP ON UPDATE)
}
```

**order_items JSON 구조**:
```javascript
[
  {
    menu_id: number,
    menu_name: string,
    size: string, // 선택한 사이즈 옵션
    temperature: string, // 선택한 온도 옵션
    quantity: number,
    unit_price: number, // 옵션 포함 단가
    total_price: number // unit_price × quantity
  }
]
```

**인덱스**:
- PRIMARY KEY: `id`
- INDEX: `status`
- INDEX: `order_date`

**비즈니스 규칙**:
- `status`는 "pending" (주문 접수), "processing" (제조 중), "completed" (완료) 중 하나
- `total_amount`는 `order_items`의 모든 `total_price` 합계와 일치해야 함
- `total_quantity`는 `order_items`의 모든 `quantity` 합계와 일치해야 함

### 6.3 데이터베이스 스키마를 위한 사용자 흐름

#### 6.3.1 메뉴 표시 흐름
```
1. 사용자가 주문하기 화면 접속
   ↓
2. 프론트엔드가 GET /api/menus 요청
   ↓
3. 백엔드가 Menus 테이블에서 데이터 조회
   - SELECT * FROM Menus WHERE is_available = true
   ↓
4. 메뉴 목록을 브라우저 화면에 표시
   - 일반 사용자: 메뉴 이름, 설명, 가격, 이미지만 표시
   - 관리자 화면: 재고(stock), 수량(quantity) 정보도 표시
```

#### 6.3.2 메뉴 선택 및 장바구니 추가 흐름
```
1. 사용자가 앱 화면에서 커피 메뉴 선택
   ↓
2. 옵션 선택 모달 오픈
   ↓
3. 프론트엔드가 GET /api/menus/:menuId/options 요청
   ↓
4. 백엔드가 Options 테이블에서 해당 메뉴의 옵션 조회
   - SELECT * FROM Options WHERE menu_id = :menuId
   ↓
5. 사용자가 사이즈, 온도, 수량 선택
   ↓
6. 최종 가격 계산 (프론트엔드)
   - 최종 가격 = (메뉴 기본 가격 + 사이즈 옵션 가격 + 온도 옵션 가격) × 수량
   ↓
7. 장바구니에 아이템 추가 (로컬 상태 관리)
   - 선택 정보가 장바구니에 표시됨
```

#### 6.3.3 주문 생성 흐름
```
1. 사용자가 장바구니에서 '주문하기' 버튼 클릭
   ↓
2. 프론트엔드가 POST /api/orders 요청
   - Body: { items: [...], total_amount: number, total_quantity: number }
   ↓
3. 백엔드가 주문 정보를 Orders 테이블에 저장
   - INSERT INTO Orders (order_items, total_amount, total_quantity, status)
   - 기본 상태: 'pending' (주문 접수)
   ↓
4. 주문 ID 반환
   ↓
5. 프론트엔드가 장바구니 초기화 및 성공 메시지 표시
```

#### 6.3.4 주문 현황 표시 및 상태 변경 흐름
```
1. 관리자가 관리자 화면의 '주문 현황' 접속
   ↓
2. 프론트엔드가 GET /api/orders 요청
   ↓
3. 백엔드가 Orders 테이블에서 주문 목록 조회
   - SELECT * FROM Orders ORDER BY order_date DESC
   ↓
4. 주문 목록을 관리자 화면에 표시
   - 주문 시간, 주문 내용(메뉴, 수량, 옵션, 금액), 상태 표시
   ↓
5. 관리자가 주문 상태 변경
   a) '주문 접수' (pending) 클릭
      ↓
      PATCH /api/orders/:orderId
      Body: { status: 'processing' }
      ↓
      상태가 '제조 중'으로 변경
   
   b) '제조 중' (processing) 클릭
      ↓
      PATCH /api/orders/:orderId
      Body: { status: 'completed' }
      ↓
      상태가 '완료'로 변경
      ↓
      주문 완료 시 재고 차감 처리
      - 각 주문 아이템의 menu_id와 quantity를 기반으로
      - UPDATE Menus SET stock = stock - :quantity WHERE id = :menu_id
      - 재고가 0이 되면 is_available = false로 자동 설정
```

#### 6.3.5 재고 관리 흐름
```
1. 관리자가 재고 관리 화면 접속
   ↓
2. 프론트엔드가 GET /api/menus 요청
   ↓
3. 백엔드가 모든 메뉴의 재고 정보 반환
   ↓
4. 관리자가 재고 수량 조절 (+/- 버튼 또는 직접 입력)
   ↓
5. 프론트엔드가 PATCH /api/menus/:menuId 요청
   - Body: { stock: number }
   ↓
6. 백엔드가 Menus 테이블 업데이트
   - UPDATE Menus SET stock = :stock, is_available = :stock > 0 WHERE id = :menuId
   ↓
7. 업데이트된 메뉴 정보 반환
```

### 6.4 API 설계

#### 6.4.1 메뉴 관련 API

##### GET /api/menus
**목적**: 커피 메뉴 목록 조회

**요청**:
```http
GET /api/menus
Query Parameters:
  - category (optional): string - 카테고리 필터 (예: "espresso", "latte")
  - available (optional): boolean - 판매 가능 여부 필터
```

**응답 (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "아메리카노",
      "description": "깊고 진한 에스프레소",
      "price": 4000,
      "image_url": "https://example.com/images/americano.jpg",
      "stock": 50,
      "quantity": 50,
      "category": "espresso",
      "is_available": true,
      "created_at": "2025-12-01T10:00:00Z",
      "updated_at": "2025-12-04T14:30:00Z"
    }
  ]
}
```

**에러 응답**:
- `500 Internal Server Error`: 서버 오류

---

##### GET /api/menus/:menuId
**목적**: 특정 메뉴의 상세 정보 조회

**요청**:
```http
GET /api/menus/1
```

**응답 (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "아메리카노",
    "description": "깊고 진한 에스프레소",
    "price": 4000,
    "image_url": "https://example.com/images/americano.jpg",
    "stock": 50,
    "quantity": 50,
    "category": "espresso",
    "is_available": true
  }
}
```

**에러 응답**:
- `404 Not Found`: 메뉴를 찾을 수 없음

---

##### GET /api/menus/:menuId/options
**목적**: 특정 메뉴의 옵션 목록 조회

**요청**:
```http
GET /api/menus/1/options
```

**응답 (200 OK)**:
```json
{
  "success": true,
  "data": {
    "size": [
      {
        "id": 1,
        "option_name": "Small",
        "option_price": 0,
        "is_default": true
      },
      {
        "id": 2,
        "option_name": "Medium",
        "option_price": 500,
        "is_default": false
      },
      {
        "id": 3,
        "option_name": "Large",
        "option_price": 1000,
        "is_default": false
      }
    ],
    "temperature": [
      {
        "id": 4,
        "option_name": "Hot",
        "option_price": 0,
        "is_default": true
      },
      {
        "id": 5,
        "option_name": "Iced",
        "option_price": 0,
        "is_default": false
      }
    ]
  }
}
```

**에러 응답**:
- `404 Not Found`: 메뉴를 찾을 수 없음

---

##### PATCH /api/menus/:menuId
**목적**: 메뉴 재고 수정 (관리자 기능)

**요청**:
```http
PATCH /api/menus/1
Content-Type: application/json

{
  "stock": 30
}
```

**응답 (200 OK)**:
```json
{
  "success": true,
  "message": "재고가 업데이트되었습니다.",
  "data": {
    "id": 1,
    "name": "아메리카노",
    "stock": 30,
    "is_available": true
  }
}
```

**에러 응답**:
- `400 Bad Request`: 잘못된 재고 값 (음수 또는 999 초과)
- `404 Not Found`: 메뉴를 찾을 수 없음

---

#### 6.4.2 주문 관련 API

##### POST /api/orders
**목적**: 새로운 주문 생성

**요청**:
```http
POST /api/orders
Content-Type: application/json

{
  "items": [
    {
      "menu_id": 1,
      "menu_name": "아메리카노",
      "size": "Medium",
      "temperature": "Iced",
      "quantity": 2,
      "unit_price": 4500,
      "total_price": 9000
    },
    {
      "menu_id": 3,
      "menu_name": "카페라떼",
      "size": "Large",
      "temperature": "Hot",
      "quantity": 1,
      "unit_price": 6000,
      "total_price": 6000
    }
  ],
  "total_amount": 15000,
  "total_quantity": 3
}
```

**응답 (201 Created)**:
```json
{
  "success": true,
  "message": "주문이 생성되었습니다.",
  "data": {
    "order_id": 42,
    "order_date": "2025-12-04T14:48:49Z",
    "status": "pending",
    "total_amount": 15000,
    "total_quantity": 3
  }
}
```

**에러 응답**:
- `400 Bad Request`: 잘못된 주문 데이터 (필수 필드 누락, 금액 불일치 등)
- `500 Internal Server Error`: 주문 생성 실패

---

##### GET /api/orders
**목적**: 주문 목록 조회 (관리자 기능)

**요청**:
```http
GET /api/orders
Query Parameters:
  - status (optional): string - 상태 필터 ("pending", "processing", "completed")
  - limit (optional): number - 조회할 주문 수 (기본값: 20)
  - offset (optional): number - 페이지네이션 오프셋 (기본값: 0)
```

**응답 (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 42,
      "order_date": "2025-12-04T14:48:49Z",
      "order_items": [
        {
          "menu_id": 1,
          "menu_name": "아메리카노",
          "size": "Medium",
          "temperature": "Iced",
          "quantity": 2,
          "unit_price": 4500,
          "total_price": 9000
        }
      ],
      "total_amount": 15000,
      "total_quantity": 3,
      "status": "pending"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0
  }
}
```

**에러 응답**:
- `500 Internal Server Error`: 서버 오류

---

##### GET /api/orders/:orderId
**목적**: 특정 주문의 상세 정보 조회

**요청**:
```http
GET /api/orders/42
```

**응답 (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 42,
    "order_date": "2025-12-04T14:48:49Z",
    "order_items": [
      {
        "menu_id": 1,
        "menu_name": "아메리카노",
        "size": "Medium",
        "temperature": "Iced",
        "quantity": 2,
        "unit_price": 4500,
        "total_price": 9000
      },
      {
        "menu_id": 3,
        "menu_name": "카페라떼",
        "size": "Large",
        "temperature": "Hot",
        "quantity": 1,
        "unit_price": 6000,
        "total_price": 6000
      }
    ],
    "total_amount": 15000,
    "total_quantity": 3,
    "status": "pending",
    "created_at": "2025-12-04T14:48:49Z",
    "updated_at": "2025-12-04T14:48:49Z"
  }
}
```

**에러 응답**:
- `404 Not Found`: 주문을 찾을 수 없음

---

##### PATCH /api/orders/:orderId
**목적**: 주문 상태 변경 (관리자 기능)

**요청**:
```http
PATCH /api/orders/42
Content-Type: application/json

{
  "status": "processing"
}
```

**응답 (200 OK)**:
```json
{
  "success": true,
  "message": "주문 상태가 업데이트되었습니다.",
  "data": {
    "id": 42,
    "status": "processing",
    "updated_at": "2025-12-04T14:50:00Z"
  }
}
```

**특별 처리 - 주문 완료 시 재고 차감**:
```http
PATCH /api/orders/42
Content-Type: application/json

{
  "status": "completed"
}
```

**응답 (200 OK)**:
```json
{
  "success": true,
  "message": "주문이 완료되었습니다. 재고가 차감되었습니다.",
  "data": {
    "id": 42,
    "status": "completed",
    "updated_at": "2025-12-04T14:51:00Z",
    "stock_updated": [
      {
        "menu_id": 1,
        "menu_name": "아메리카노",
        "previous_stock": 50,
        "new_stock": 48
      },
      {
        "menu_id": 3,
        "menu_name": "카페라떼",
        "previous_stock": 30,
        "new_stock": 29
      }
    ]
  }
}
```

**에러 응답**:
- `400 Bad Request`: 잘못된 상태 값 또는 상태 전환 불가
- `404 Not Found`: 주문을 찾을 수 없음
- `409 Conflict`: 재고 부족으로 주문 완료 불가
  ```json
  {
    "success": false,
    "error": "재고가 부족하여 주문을 완료할 수 없습니다.",
    "insufficient_items": [
      {
        "menu_id": 1,
        "menu_name": "아메리카노",
        "required": 2,
        "available": 1
      }
    ]
  }
  ```

---

### 6.5 API 엔드포인트 요약

| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | `/api/menus` | 메뉴 목록 조회 | Public |
| GET | `/api/menus/:menuId` | 메뉴 상세 조회 | Public |
| GET | `/api/menus/:menuId/options` | 메뉴 옵션 조회 | Public |
| PATCH | `/api/menus/:menuId` | 메뉴 재고 수정 | Admin |
| POST | `/api/orders` | 주문 생성 | Public |
| GET | `/api/orders` | 주문 목록 조회 | Admin |
| GET | `/api/orders/:orderId` | 주문 상세 조회 | Admin |
| PATCH | `/api/orders/:orderId` | 주문 상태 변경 | Admin |

### 6.6 데이터베이스 트랜잭션 처리

#### 6.6.1 주문 완료 시 재고 차감 트랜잭션
```sql
BEGIN TRANSACTION;

-- 1. 주문 상태 업데이트
UPDATE Orders 
SET status = 'completed', updated_at = CURRENT_TIMESTAMP 
WHERE id = :orderId;

-- 2. 각 주문 아이템에 대해 재고 차감
UPDATE Menus 
SET stock = stock - :quantity,
    is_available = CASE WHEN (stock - :quantity) > 0 THEN true ELSE false END,
    updated_at = CURRENT_TIMESTAMP
WHERE id = :menuId AND stock >= :quantity;

-- 3. 재고 부족 체크
IF (affected_rows == 0) THEN
  ROLLBACK;
  RETURN ERROR "재고 부족";
END IF;

COMMIT;
```

#### 6.6.2 동시성 제어
- **낙관적 잠금 (Optimistic Locking)**: `updated_at` 타임스탬프를 사용하여 충돌 감지
- **비관적 잠금 (Pessimistic Locking)**: 재고 차감 시 `SELECT ... FOR UPDATE` 사용

### 6.7 성능 최적화

#### 6.7.1 인덱싱 전략
- `Menus.category`: 카테고리별 필터링 성능 향상
- `Menus.is_available`: 판매 가능 메뉴 조회 성능 향상
- `Orders.status`: 주문 상태별 필터링 성능 향상
- `Orders.order_date`: 주문 날짜 정렬 성능 향상

#### 6.7.2 캐싱 전략
- 메뉴 목록: Redis 캐싱 (TTL: 5분)
- 옵션 목록: Redis 캐싱 (TTL: 10분)
- 재고 업데이트 시 캐시 무효화

#### 6.7.3 페이지네이션
- 주문 목록: 기본 20개씩 조회
- Offset-based pagination 사용

### 6.8 에러 처리 및 검증

#### 6.8.1 입력 검증
- **메뉴 재고**: 0 ~ 999 범위
- **주문 수량**: 1 ~ 99 범위
- **주문 금액**: 계산된 금액과 일치 여부 검증
- **주문 상태**: "pending", "processing", "completed"만 허용

#### 6.8.2 에러 응답 형식
```json
{
  "success": false,
  "error": "에러 메시지",
  "details": {
    "field": "필드명",
    "message": "상세 에러 메시지"
  }
}
```

### 6.9 보안 요구사항

#### 6.9.1 SQL Injection 방지
- Prepared Statements 사용
- 모든 사용자 입력 파라미터화

#### 6.9.2 입력 검증
- 모든 API 요청에 대한 입력 검증
- JSON 스키마 검증 (예: Joi, Yup)

#### 6.9.3 CORS 설정
- 프론트엔드 도메인만 허용
- Credentials 포함 요청 허용

#### 6.9.4 Rate Limiting
- API 요청 제한: 100 requests/minute per IP

### 6.10 모니터링 및 로깅

#### 6.10.1 로깅
- 모든 API 요청/응답 로깅
- 에러 발생 시 상세 스택 트레이스 기록
- 주문 생성/상태 변경 이벤트 로깅

#### 6.10.2 모니터링 지표
- API 응답 시간
- 에러 발생 빈도
- 데이터베이스 쿼리 성능
- 재고 부족 발생 빈도
