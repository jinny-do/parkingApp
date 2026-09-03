# 🚗 Parking App

> 주차 공간 확인부터 캐시 충전, 사용자 관리까지 한곳에서 제공하는 React Native 기반 주차 관리 애플리케이션

Parking App은 사용자가 모바일 환경에서 주차 공간의 점유 상태와 남은 자리를 확인하고, 주차 서비스 이용을 위한 캐시를 관리할 수 있도록 만든 주차 관리 앱입니다.

React Native로 Android·iOS 클라이언트를 구성했으며, Express와 MySQL 기반 서버를 통해 회원가입과 이메일 중복 확인 기능을 제공합니다.

<!-- 대표 이미지나 시연 GIF가 있다면 아래 주석을 해제하고 경로를 수정하세요. -->
<!-- ![Parking App 시연](./docs/images/demo.gif) -->

## 🧩 주요 기능

| 기능 | 설명 | 구현 상태 |
| --- | --- | :---: |
| 🚘 주차 공간 현황 | 주차면별 점유 여부와 이용 가능한 자리 수 표시 | UI 구현 |
| 🔐 로그인 | 아이디와 비밀번호 입력 및 로그인 화면 전환 | UI 구현 |
| ✍️ 회원가입 | 이름, 이메일, 차량번호, 비밀번호를 입력해 사용자 등록 | API 연동 |
| 📧 이메일 중복 확인 | 회원가입 전 이메일 사용 가능 여부 확인 | API 연동 |
| 💰 캐시 충전 | 충전 금액 선택 또는 직접 입력, 결제 확인 및 잔액 계산 | 로컬 구현 |
| 👤 마이페이지 | 사용자 이름, 이메일, 차량번호와 로그아웃 버튼 표시 | UI 구현 |
| 🧭 화면 탐색 | Stack Navigator와 Bottom Tab Navigator 기반 화면 이동 | 구현 완료 |

> 현재 주차 공간, 캐시 결제, 마이페이지 데이터는 샘플 또는 앱 내부 상태를 사용합니다. 실제 주차 센서·결제 시스템·사용자 조회 API와의 연동은 후속 개발이 필요합니다.

## 📱 화면 구성

| 화면 | 설명 |
| --- | --- |
| Intro | 앱 로고를 표시한 뒤 로그인 화면으로 이동하는 스플래시 화면 |
| Login | 아이디와 비밀번호 입력, 회원가입 화면 이동 |
| Register | 사용자 정보 입력, 이메일 중복 확인, 회원가입 요청 |
| Parking | 주차면별 점유 상태, 남은 자리, 캐시 잔액 상태 표시 |
| Cash | 충전 금액 선택·직접 입력 및 결제 확인 |
| MyPage | 사용자 프로필과 차량 정보 표시 |

## 🛠 기술 스택

| 구분 | 기술 |
| --- | --- |
| Mobile | React Native 0.78, React 19, TypeScript |
| Navigation | React Navigation 7, Stack Navigator, Bottom Tabs |
| Networking | Axios |
| UI | React Native StyleSheet, React Native Vector Icons, Responsive Screen |
| Backend | Node.js, Express 4 |
| Database | MySQL, mysql2 |
| Configuration | dotenv, react-native-dotenv |
| Development | Metro, Jest, ESLint, Prettier |

## 🏗️ 서비스 구조

```text
┌──────────────────────────┐
│ React Native Mobile App  │
│ Android / iOS            │
└─────────────┬────────────┘
              │ Axios / HTTP
              ▼
┌──────────────────────────┐
│ Node.js + Express Server │
│ REST API                 │
└─────────────┬────────────┘
              │ mysql2
              ▼
┌──────────────────────────┐
│ MySQL Database           │
└──────────────────────────┘
```

## 📁 프로젝트 구조

```text
parkingApp/
├── parking/                       # React Native 애플리케이션
│   ├── android/                   # Android 네이티브 프로젝트
│   ├── ios/                       # iOS 네이티브 프로젝트
│   ├── src/
│   │   ├── ParkingApp.tsx         # 최상위 내비게이션
│   │   ├── Intro.tsx              # 스플래시 화면
│   │   ├── Login.tsx              # 로그인 화면
│   │   ├── Register.tsx           # 회원가입 화면
│   │   ├── Main.tsx               # 하단 탭 내비게이션
│   │   ├── Parking.tsx            # 주차 현황 화면
│   │   ├── Cash.tsx               # 캐시 충전 화면
│   │   ├── MyPage.tsx             # 마이페이지
│   │   └── Main_List.tsx          # 목록 UI 실험 화면
│   ├── index.js                   # 앱 진입점
│   └── package.json
└── parking-server/                # Express API 서버
    ├── bin/www                    # 서버 실행 진입점
    ├── database/db_connect.js     # MySQL 연결 설정
    ├── routes/index.js            # 회원 관련 API
    ├── app.js                     # Express 앱 설정
    └── package.json
```
