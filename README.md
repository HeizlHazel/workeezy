<img width="1642" height="1024" alt="erd" src="https://github.com/user-attachments/assets/59928c9e-d0c7-46da-bb00-56561441787e" />

## ✨ 프로젝트 소개
### 워케이션 서포트 시스템 - Workeezy
_클라우드 연동 워케이션 서포트 시스템 개발_   
   
   

<br>

🌱 Work easy, grow 2gether


최근 기업 복지의 트렌드는 단순한 휴가 제공을 넘어, 업무와 휴식을 병행할 수 있는 ‘워케이션(Workation)’으로 확장되고 있다.
그러나 실제로는 기업과 직원 모두 복잡한 예약 절차, 제한적인 정보, 관리의 어려움 등으로 인해 워케이션을 체계적으로 운영하는 데 한계가 있다.



이에 팀 2gether는 기업과 직원이 함께 성장할 수 있는 워케이션 문화를 조성하기 위해, 업무 효율과 휴식을 동시에 지원하는 통합 플랫폼 "Workeezy(워크이지)”를 기획하였다.
Workeezy는 Work + Easy의 합성어로, ‘일은 더 쉽게, 성장은 함께(Work easy, grow 2gether)’라는 의미를 담고 있으며, 이를 통해 기업은 효율적인 복지 관리를, 직원은 유연한 근무와 휴식을 경험할 수 있다.


<br>

## 📆 개발 기간
- 2025-11-06(목) ~ 2025-11-10(월): 주제, 프로젝트명, 팀장 선정
- 2025-11-10(월) ~ 2025-11-13(목): 기획의도, 유사사이트 분석, 클라이언트 요구사항분석, UseCase Diagram 작성
- 2025-11-13(목) ~ 2025-11-19(수): 사이트맵, 화면설계 회의, 메인페이지 화면설계
- 2025-11-19(수) ~ 2025-11-26(수): 도메인 엔티티 설계, DB 테이블 설계, 샘플데이터, ERD 작성
- 2025-11-26(수) ~ 2025-11-28(금): 리액트로 화면 생성, 기능구현, JPA(Hibernate) 기반 MySQL 연동 후 CRUD 최소 1개
- 2025-11-28(금) ~ 2026-01-04(일): 프로젝트 구현 및 디버깅, AWS 클라우드 배포
- 2026-01-05(월) ~ 2026-01-08(목): 베타 테스트, 최종 발표자료 준비
- 2026-01-09(금): 프로젝트 발표


<br>
<br>

## 🐵 구성원 및 역할

### 🙈 조장 김혜지   
   
🔐 인증 · 사용자 관리

- Spring Security 기반 인증/인가 구조 설계
- JWT + Redis를 활용한 로그인 / 로그아웃 및 토큰 관리
   - 로그아웃 시 토큰 무효화(블랙리스트) 처리
- 아이디 저장 및 자동 로그인 기능 구현
- 개인정보 수정 시 비밀번호 재검증 로직 적용
- 연락처 수정 및 비밀번호 변경 기능 구현

<br>

💳 예약 · 결제 흐름

- 결제 완료 시 예약 상태 변경 처리 흐름 구현
- 결제 도메인과 예약 도메인 간 상태 동기화 로직 설계

<br>

🚀 배포 · 운영

- Docker 기반 애플리케이션 컨테이너화
- GitHub Actions를 활용한 CI/CD 파이프라인 구축
- 쉘 스크립트를 통한 자동 배포 환경 구성

<br>

### 🙊 조원 백가영
   
🔁 예약 흐름 관리

- 예약 변경, 취소 기능 구현
- 반려 사유 확인 후 재신청 가능한 예약 흐름 설계
- 예약 상태에 따른 분기 처리 로직 구현

<br>

🔒 예약 동시성 제어

- 비관적 락(Pessimistic Lock)을 활용한 예약 동시성 제어
- 중복 예약 방지 및 데이터 정합성 문제 해결

<br>

🗂 사용자 데이터 관리

- Redis를 활용한 사용자별 임시 저장 데이터 관리
- 예약 진행 중 이탈 시 데이터 유지 및 복구 처리

<br>

📜 조회 · 페이징

- 무한 스크롤 방식의 사용자별 예약 조회 기능 구현
- Cursor 기반 Pagination을 적용한 관리자 예약 조회 기능 구현

<br>

📑 문서 생성 · 파일 관리

- 예약 확정 시 PDF 문서 자동 생성(OpenPDF)
- 생성된 PDF 파일을 AWS S3에 업로드 및 관리

<br>

### 🙉 조원 조민준
   
🔍 프로그램 조회 · 검색

- 프로그램 상세 페이지 및 검색 결과 페이지 구현
- 조건 기반 검색 기능 구현
- 검색어 기반 추천 프로그램 노출 로직 적용

<br>

📝 리뷰

- 사용자 리뷰 등록 UI 및 비즈니스 로직 구현
- 리뷰 데이터 저장 및 조회 흐름 설계

<br>

💬 챗봇

- 카카오톡 API 연동 챗봇 기능 구현
- 사용자 질의에 따른 응답 처리 로직 구성
- Docker 기반 Flask 챗봇 서버 구축
- 메인 백엔드와 분리된 마이크로 서비스 형태로 운영

<br>

## ⚙ 개발 환경 (Environment / Tools)

- OS : Windows 10
- Developer Tools : IntelliJ IDEA, WebStorm, VS Code, DBeaver
- Test Tools : Postman, Apache JMeter
- VCS : Git, GitHub, SourceTree

<br>

## 🔧 기술 스택

### Backend

- Framework : Spring Boot, Flask
- Language : Java, Python
- Security : Spring Security, JWT (Access / Refresh Token)
- Data Access : JPA (Hibernate)
- Cache / Session Store : Redis
- Build Tool : Maven, Gradle
- Connection Pool : HikariCP
- API Architecture : RESTful API
- Transaction Management : Spring @Transactional  
   
### Frontend

- Framework : React
- Markup & Styling : HTML5, CSS3
- Runtime / Package Manager : Node.js
- Scripting : JavaScript (ES6+)
- HTTP Client : Axios

<br>

## 🗄 Database

- DBMS : MySQL
- Concurrency Control : Pessimistic Lock (JPA)

<br>

## 🚀 Server / Deployment
- Server : Apache Tomcat 9.0, Spring Boot Embedded Server
- Deployment / Environment :
   - AWS EC2, RDS, S3
   - Docker
   - GitHub Actions (CI/CD)

<br>

## 💡 API 연동 & 라이브러리
- Payment API : Toss payments
- Chatbot API : kakao chatbot
- PDF Generation : OpenPDF
- UI Alert Library : SweetAlert2

<br>

## 🏗️ 도메인 설계
<img width="1361" height="778" alt="도메인 다이어그램" src="https://github.com/user-attachments/assets/499bb1af-dc4c-421c-a5a2-52b6d157b999" />

<br>

## 🧭 엔티티 설계
<img width="1320" height="897" alt="엔티티 다이어그램" src="https://github.com/user-attachments/assets/38bb8bbf-2103-45de-a2df-3b888eb860b0" />

<br>

## 🧩 데이터 설계
<img width="2653" height="1452" alt="Workeezy ERD" src="https://github.com/user-attachments/assets/4d26bf9a-f8ad-477d-8e45-af77b4d6acd1" />

<br>

## 💻 프로젝트 구현
### 🙈 조장 김혜지
- 비회원 접근 제어
![route](https://github.com/user-attachments/assets/8b8e0494-d531-4bec-99fd-83e184b3ba41)

- 로그인
![login](https://github.com/user-attachments/assets/0b633894-c7a1-4541-9d56-7517b416da98)

- 로그아웃
![logout](https://github.com/user-attachments/assets/0fb5ccb7-5237-4692-8c2b-69991a41f528)

- 마이페이지 비밀번호 재검증
![mypage](https://github.com/user-attachments/assets/282a05d1-40f3-4e18-b172-0395645c65b6)

- 연락처 수정
![modifyPhone](https://github.com/user-attachments/assets/1096f9dc-d632-47fc-b4fd-29d0b7bfd0e9)

- 비밀번호 변경
![modifyPassword](https://github.com/user-attachments/assets/35296bf8-d0ce-4f02-bd7d-0d9ff70fb301)

- 결제 진입
![pay1](https://github.com/user-attachments/assets/655b3b40-b8b6-4182-96c1-f32da32ff865)

- 결제 진행 및 상태 변경
![pay2](https://github.com/user-attachments/assets/2278908c-7851-4e08-b272-92001cbdba33)


### 🙊 조원 백가영
- 예약 신청
![예약신청](https://github.com/user-attachments/assets/08a1ec49-5bf9-49ae-900f-faa24663d3b1)

- 예약 수정
![예약수정](https://github.com/user-attachments/assets/32d90996-243d-4955-a169-84ea49e1ca48)

- 예약 취소
![예약취소](https://github.com/user-attachments/assets/5a128aac-b04c-460a-88d0-4123dffc6a1c)

- 예약 중복 체크
![예약시룸중복예약체크](https://github.com/user-attachments/assets/cca11a48-8713-4627-92ea-2161e47711a6)

- 사용자 예약 조회 시 필터링 및 키워드 검색
![사용자예약조회상태필터및키워드](https://github.com/user-attachments/assets/381c3546-b3d2-4b01-b66d-39e6459d2517)

- 확정된 예약 pdf 생성 및 s3 버킷 url 다운로드
![예약확정서pdf](https://github.com/user-attachments/assets/de2fedc9-2228-48f0-aa81-e1b375bdbc49)

- 예약폼 임시 저장
![임시저장](https://github.com/user-attachments/assets/9e297713-4f27-4953-a170-7adc59bdc49e)

- 임시저장 불러오기 후 신청
![임시저장불러오기및신청](https://github.com/user-attachments/assets/2dc73a9a-c6e9-4afd-ae4f-e65ceb10957a)

- 임시저장 데이터 중복 체크
![예약폼_임시저장중복체크](https://github.com/user-attachments/assets/97deafd1-3872-48e9-aa35-898f5322836e)

- 계정별 임시저장 데이터 관리
![유저별임시저장데이터관리](https://github.com/user-attachments/assets/e597b23f-c036-4eb5-9423-305351d775bb)

- 커서 기반 관리자 페이지 탐색 및 동작
![관리자페이지탐색및동작](https://github.com/user-attachments/assets/d9c41cdc-2dda-4543-baf3-d4a31049ddb7)

- 관리자 페이지 날짜별 및 키워드 및 필터링 조회
![관리자페이지키워드및필터링](https://github.com/user-attachments/assets/82e0701e-51a4-4666-90c2-1f27e9af888c)


### 🙉 조원 조민준
- 조건 기반 검색·상세 페이지
![검색과카테고리](https://github.com/user-attachments/assets/8dcf0b3a-5fb3-43da-b099-0226c0991c21)

- 최근 검색어 기반 추천
![최근검색어추천](https://github.com/user-attachments/assets/5783c6e7-1af1-4366-acc4-cf11a2b9261b)

- 리뷰 등록
![리뷰등록](https://github.com/user-attachments/assets/4232ba75-2a7f-45ea-9503-75d97e1771a1)

- 카카오톡 챗봇
![챗봇](https://github.com/user-attachments/assets/cf61f38b-3de4-4d28-9053-497e789028b4)

<br>

## 📑 최종 보고서
[2조 Workeezy 최종 보고서.pdf](https://github.com/user-attachments/files/24520998/2.Workeezy.pdf)

