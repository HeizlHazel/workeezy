-- CREATE DATABASE test
-- CHARACTER SET utf8mb4
-- COLLATE utf8mb4_general_ci;
-- 
-- use test;

-- SET FOREIGN_KEY_CHECKS = 0;
-- 
-- -- 의존성 있는 테이블 먼저
-- DROP TABLE IF EXISTS tb_chat_message;
-- DROP TABLE IF EXISTS tb_inquiry;
-- DROP TABLE IF EXISTS tb_review;
-- DROP TABLE IF EXISTS tb_payment_logs;
-- DROP TABLE IF EXISTS tb_refund;
-- DROP TABLE IF EXISTS tb_receipt_pdf;
-- DROP TABLE IF EXISTS tb_reservation_pdf;
-- DROP TABLE IF EXISTS tb_reservation_modify;
-- DROP TABLE IF EXISTS tb_payments;
-- DROP TABLE IF EXISTS tb_search;
-- DROP TABLE IF EXISTS tb_room;
-- DROP TABLE IF EXISTS tb_notification;
-- DROP TABLE IF EXISTS tb_chat_session;
-- DROP TABLE IF EXISTS tb_user_social_login;
-- DROP TABLE IF EXISTS tb_login_history;
-- DROP TABLE IF EXISTS tb_refresh_tokens;
-- DROP TABLE IF EXISTS tb_reservation;
-- DROP TABLE IF EXISTS tb_place;
-- DROP TABLE IF EXISTS tb_program;
-- DROP TABLE IF EXISTS tb_search_program;
-- 
-- -- 참조되지 않은 테이블 마지막에 드롭
-- DROP TABLE IF EXISTS tb_faq;
-- DROP TABLE IF EXISTS tb_users;
-- 
-- SET FOREIGN_KEY_CHECKS = 1;




# 사용자 테이블 생성
CREATE TABLE IF NOT EXISTS tb_users (
  user_id    BIGINT NOT NULL AUTO_INCREMENT COMMENT '사용자 고유 식별자',
  email      VARCHAR(100) NOT NULL              COMMENT '소속 회사 이메일(로그인 아이디)',
  user_pwd   VARCHAR(255) NOT NULL              COMMENT '암호화하여 저장',
  user_name  VARCHAR(100) NOT NULL              COMMENT '사용자 이름',
  phone      VARCHAR(20) NULL                   COMMENT '전화번호',
  birth      DATE NOT NULL                      COMMENT '생년월일',
  company    VARCHAR(30) NOT NULL               COMMENT '소속 회사',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '정보 수정 시각',
  user_role  ENUM('user','admin') NOT NULL DEFAULT 'user' COMMENT '사용자 권한',
  PRIMARY KEY (user_id),
  UNIQUE KEY uq_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='사용자 테이블';

# 프로그램 테이블 생성
CREATE TABLE IF NOT EXISTS tb_program (
  program_id     BIGINT NOT NULL AUTO_INCREMENT COMMENT '프로그램 고유 식별자',
  program_title  VARCHAR(100) NOT NULL              COMMENT '프로그램명',
  program_info   TEXT NOT NULL                      COMMENT '프로그램 정보',
  program_people INT NULL                           COMMENT '참여 인원수',
  program_price  INT NULL                           COMMENT '단위 금액',
  stay_id        BIGINT NULL                        COMMENT '숙소 ID',
  office_id      BIGINT NULL                        COMMENT '오피스 ID',
  attraction_id1 BIGINT NULL                        COMMENT '1번 추천 어트랙션 ID',
  attraction_id2 BIGINT NULL                        COMMENT '2번 추천 어트랙션 ID',
  attraction_id3 BIGINT NULL                        COMMENT '3번 추천 어트랙션 ID',
  PRIMARY KEY (program_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='프로그램 테이블';

# 예약 테이블 생성
CREATE TABLE IF NOT EXISTS tb_reservation (
    reservation_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '예약 고유 식별자 PK',
    user_id BIGINT NOT NULL COMMENT '사용자 FK',
    program_id BIGINT NOT NULL COMMENT '프로젝트 FK',
    reservation_no VARCHAR(20) NOT NULL COMMENT '예약번호(YYYYMMDD-000000010)',
    start_date TIMESTAMP NOT NULL COMMENT '예약 시작 날짜',
    end_date TIMESTAMP NOT NULL COMMENT '예약 종료 날짜',
    status ENUM('waiting', 'confirm', 'cancel') NOT NULL DEFAULT 'waiting' COMMENT '예약 상태(대기/확정/취소)',
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '예약 생성일',
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '예약 수정일',
    total_price BIGINT NOT NULL COMMENT '워케이션 총 금액',
    PRIMARY KEY (reservation_id),
    UNIQUE KEY uq_reservation_no (reservation_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='예약 테이블';

# 소셜 로그인 테이블 생성
CREATE TABLE IF NOT EXISTS tb_user_social_login (
    social_id        BIGINT NOT NULL AUTO_INCREMENT                COMMENT '소셜 로그인 고유 식별자',
    user_id          BIGINT NOT NULL                               COMMENT '사용자 FK',
    provider         ENUM('kakao', 'naver') NULL                   COMMENT '소셜 연동 플랫폼',
    provider_user_id VARCHAR(255) NULL                             COMMENT '소셜 연동 고유 ID',
    email            VARCHAR(100) NULL                             COMMENT '플랫폼에서 받은 이메일',
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT '연동 날짜',
    PRIMARY KEY (social_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='소셜 로그인 테이블';


# JWT 토큰 테이블 생성
CREATE TABLE IF NOT EXISTS tb_refresh_tokens (
    token_id       BIGINT NOT NULL AUTO_INCREMENT 				COMMENT '토큰 고유 식별자',
    user_id        BIGINT NOT NULL 								COMMENT '사용자 FK',
    refresh_token  VARCHAR(500) NOT NULL 						COMMENT '토큰 정보',
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '토큰 생성일자',
    expires_at     TIMESTAMP NOT NULL 							COMMENT '토큰 만료일자',
    PRIMARY KEY (token_id),
    UNIQUE KEY uq_token_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='JWT 테이블';

# 로그인 로그 테이블 생성
CREATE TABLE IF NOT EXISTS tb_login_history (
    history_id   BIGINT NOT NULL AUTO_INCREMENT 				COMMENT '로그인 기록 고유 식별자',
    user_id      BIGINT NOT NULL 								COMMENT '사용자 FK',
    login_ip     VARCHAR(45) NOT NULL 							COMMENT '로그인 IP',
    login_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 	COMMENT '로그인 시각',
    user_agent   VARCHAR(512) NOT NULL 							COMMENT '브라우저, OS, 디바이스 정보',
    login_status ENUM('success', 'failed', 'blocked') NOT NULL	COMMENT '로그인 상태',
    fail_reason  VARCHAR(100) NULL 								COMMENT '로그인 실패 사유',
    PRIMARY KEY (history_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='로그인 로그 테이블';

# 결제 테이블 생성
CREATE TABLE IF NOT EXISTS tb_payments (
    payment_id      BIGINT NOT NULL AUTO_INCREMENT							COMMENT '결제 고유 식별자',
    reservation_id  BIGINT NOT NULL 										COMMENT '예약 FK',
    order_id        VARCHAR(100) NULL										COMMENT '토스 API 주문 번호',
    payment_key     VARCHAR(200) NULL 										COMMENT '토스 API 고유 결제키',
    amount          INT NOT NULL 											COMMENT '결제 금액',
    payment_status  ENUM('ready', 'paid', 'cancelled', 'failed') NOT NULL	COMMENT '결제 상태',
    payment_method  VARCHAR(50) NOT NULL 									COMMENT '결제 방법',
    approved_at     TIMESTAMP NULL 											COMMENT '결제 승인시각',
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 			COMMENT '결제 시각',
    PRIMARY KEY (payment_id),
    UNIQUE KEY uq_payment_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='결제 테이블';

# 결제 취소 테이블 생성
CREATE TABLE IF NOT EXISTS tb_refund (
    refund_id       BIGINT NOT NULL AUTO_INCREMENT 										COMMENT '결제 취소 고유 식별자',
    payment_id      BIGINT NOT NULL 													COMMENT '결제 FK',
    refund_amount   INT NOT NULL 														COMMENT '취소 금액',
    refund_reason   VARCHAR(200) NULL 													COMMENT '취소 사유',
    cancel_key      VARCHAR(200) NULL 													COMMENT '토스 API 연관 컬럼',
    refund_status   ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending' 	COMMENT '취소 상태',
    requested_by    ENUM('user', 'admin') NULL DEFAULT 'user' 							COMMENT '취소 요청자',
    refunded_at     TIMESTAMP NULL 														COMMENT '취소 완료시각',
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 						COMMENT '취소 요청시각',
    PRIMARY KEY (refund_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='결제 취소 테이블';

# 결제 로그 테이블 생성
CREATE TABLE IF NOT EXISTS tb_payment_logs (
    paymentlog_id BIGINT NOT NULL AUTO_INCREMENT 							COMMENT '결제로그 고유 식별자',
    payment_id    BIGINT NOT NULL 											COMMENT '결제 FK',
    response_data JSON NULL 												COMMENT '토스 API 응답값',
    event_type    ENUM('request', 'response', 'callback', 'fail') NOT NULL	COMMENT '로그 분류',
    http_status   INT NULL 													COMMENT '상태 코드',
    logged_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 				COMMENT '로그 발생시각',
    PRIMARY KEY (paymentlog_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='결제 로그 테이블';

# 장소 테이블 생성
CREATE TABLE IF NOT EXISTS tb_place (
    place_id        BIGINT NOT NULL AUTO_INCREMENT				COMMENT '장소 고유 식별자',
    program_id      BIGINT NOT NULL								COMMENT '프로그램 FK',
    place_type      ENUM('stay', 'office', 'attraction') NULL 	COMMENT '장소 종류',
    place_name      VARCHAR(100) NOT NULL 						COMMENT '장소명',
    place_code      VARCHAR(100) NULL 							COMMENT '지역구분코드',
    place_address   VARCHAR(1000) NULL 							COMMENT '숙소 주소',
    place_phone     VARCHAR(15) NULL 							COMMENT '전화번호',
    place_equipment VARCHAR(100) NULL 							COMMENT '부대시설',
    place_photo1    VARCHAR(100) NULL 							COMMENT '썸네일',
    place_photo2    VARCHAR(100) NULL 							COMMENT '사진2',
    place_photo3    VARCHAR(100) NULL 							COMMENT '사진3',
    attraction_url  VARCHAR(100) NULL 							COMMENT '어트랙션사이트URL',
    PRIMARY KEY (place_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='장소 테이블';

# 추천 숙소(매핑) 테이블 생성
CREATE TABLE IF NOT EXISTS tb_search_program (
    search_pg_id BIGINT NOT NULL AUTO_INCREMENT 	COMMENT '추천숙소ID',
    search_id	BIGINT NOT NULL						COMMENT '검색어 FK',
    program_id	BIGINT NOT NULL						COMMENT '프로그램 FK',
    search_point INT NULL 						COMMENT '연관도점수',
    PRIMARY KEY (search_pg_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='추천 숙소 테이블';

# 객실 테이블 생성
CREATE TABLE IF NOT EXISTS tb_room (
    room_id      BIGINT NOT NULL AUTO_INCREMENT COMMENT '객실 고유 식별자',
    place_id     BIGINT NOT NULL 				COMMENT '장소 FK',
    room_no      INT NULL						COMMENT '객실 번호',
    room_people  INT NULL						COMMENT '수용 가능 인원수',
    room_service VARCHAR(1000) NULL				COMMENT '객실 시설',
    PRIMARY KEY (room_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='객실 테이블';

# 검색어 테이블
CREATE TABLE IF NOT EXISTS tb_search (
    search_id     BIGINT NOT NULL AUTO_INCREMENT 			COMMENT '검색어 고유 식별자',
    user_id       BIGINT NOT NULL 							COMMENT '사용자 FK',
    search_time   TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP 	COMMENT '검색일시',
    search_phrase VARCHAR(100) NULL 						COMMENT '검색어',
    PRIMARY KEY (search_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='검색 테이블';

# 리뷰 테이블 생성
CREATE TABLE IF NOT EXISTS tb_review (
    review_id      BIGINT NOT NULL AUTO_INCREMENT 			COMMENT '리뷰 고유 식별자',
    program_id     BIGINT NOT NULL 							COMMENT '프로그램 FK',
    user_id        BIGINT NOT NULL 							COMMENT '유저 FK',
    review_title   VARCHAR(100) NOT NULL 					COMMENT '제목',
    review_content TEXT NULL								COMMENT '내용',
    review_date    TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP	COMMENT '작성일',
    review_point   INT NULL DEFAULT 0 						COMMENT '별점',
    PRIMARY KEY (review_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='리뷰 테이블';

# 채팅 세션 테이블 생성
CREATE TABLE IF NOT EXISTS tb_chat_session (
    session_id  BIGINT NOT NULL AUTO_INCREMENT 											COMMENT '세션 ID',
    user_id     BIGINT NOT NULL 														COMMENT '사용자 FK',
    status      ENUM('open', 'closed', 'waiting', 'assigned') NOT NULL DEFAULT 'closed' COMMENT '세션 상태',
    is_ai_only  TINYINT(1) NOT NULL DEFAULT 1 											COMMENT '챗봇 세션 구분',
    create_time TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP 								COMMENT '생성 시간',
    closed_time TIMESTAMP NULL 															COMMENT '종료 시간',
    PRIMARY KEY (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='채팅 세션 테이블';

# 채팅 메시지 테이블 생성
CREATE TABLE IF NOT EXISTS tb_chat_message (
    chat_id     BIGINT NOT NULL AUTO_INCREMENT 				COMMENT '채팅 고유 식별자',
    session_id  BIGINT NOT NULL 							COMMENT '세션 FK',
    faq_id      BIGINT NOT NULL 							COMMENT 'FAQ FK',
    sender_role ENUM('user', 'admin', 'bot') NOT NULL 		COMMENT '보낸 주체',
    msg_text    TEXT NULL									COMMENT '메시지 내용',
    send_time   TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP 	COMMENT '보낸 시간',
    PRIMARY KEY (chat_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='채팅 메시지 테이블';

# 채팅 의도 파악 테이블 생성
CREATE TABLE IF NOT EXISTS tb_faq (
    faq_id          BIGINT NOT NULL AUTO_INCREMENT 				COMMENT '의도 파악 고유 식별자',
    intent_name     VARCHAR(100) NULL 							COMMENT '의도 종류',
    example_phrases TEXT NULL 									COMMENT '예시 문장',
    create_time     TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP 	COMMENT '생성 시간',
    PRIMARY KEY (faq_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='의도파악 테이블';

# 알림톡 테이블 생성
CREATE TABLE IF NOT EXISTS tb_notification (
    noti_id     BIGINT NOT NULL AUTO_INCREMENT 							COMMENT '알림톡 고유 식별자',
    user_id     BIGINT NOT NULL 										COMMENT '유저 FK',
    noti_title  VARCHAR(200) NULL										COMMENT '알림 제목',
    noti_msg    TEXT NULL												COMMENT '알림 내용',
    noti_type   ENUM('reservation', 'promotion', 'system', 'etc') NULL	COMMENT '알림 종류',
    sent_time   TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP 				COMMENT '발송 시각',
    status      ENUM('success', 'failed') NULL 							COMMENT '발송 결과',
    PRIMARY KEY (noti_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='알림톡 테이블';

# AI 상세 요청 테이블
CREATE TABLE IF NOT EXISTS tb_inquiry (
    inquiry_id     BIGINT NOT NULL AUTO_INCREMENT 								COMMENT 'AI 상세 요청 고유 식별자
    ',
    session_id     BIGINT NOT NULL 												COMMENT '세션 FK',
    category       ENUM('stay', 'region', 'subsidy', 'schedule', 'etc') NULL	COMMENT '카테고리',
    inquiry_detail TEXT NULL 													COMMENT '세부정보',
    inquiry_time   TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP						COMMENT '생성시간',
    PRIMARY KEY (inquiry_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI 상세 요청 테이블';

# 예약 수정 요청 테이블 생성
CREATE TABLE IF NOT EXISTS tb_reservation_modify (
    modify_request_id BIGINT NOT NULL AUTO_INCREMENT 										COMMENT '수정 요청 고유 식별자',
    reservation_id    BIGINT NOT NULL 														COMMENT '예약 고유 식별자',
    user_id           BIGINT NOT NULL 														COMMENT '사용자 고유 식별자',
    after_data        JSON NOT NULL 														COMMENT '수정 요청 데이터',
    status            ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'	COMMENT '승인 요청 상태',
    reject_reason     VARCHAR(225) NULL 													COMMENT '관리자 승인 거절 사유',
    request_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 							COMMENT '승인 요청 시각',
    processed_at      TIMESTAMP NULL 														COMMENT '승인 및 거절 처리 시각',
    PRIMARY KEY (modify_request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='예약 수정 요청 테이블';

# 예약 확정서 PDF 테이블 생성
CREATE TABLE IF NOT EXISTS tb_reservation_pdf (
    pdf_id            BIGINT NOT NULL AUTO_INCREMENT 				COMMENT 'pdf 생성 고유 식별자',
    reservation_id    BIGINT NOT NULL 								COMMENT '예약 고유 식별자',
    confirmation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 	COMMENT '예약 확정서 발행 일자',
    pdf_file_path     VARCHAR(500) NOT NULL 						COMMENT 'PDF 파일 저장 경로',
    confirm_number    VARCHAR(15) NOT NULL 							COMMENT '문서번호',
    PRIMARY KEY (pdf_id),
    UNIQUE KEY uq_pdf_confirmnumber (confirm_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='예약 확정서 PDF 테이블';

# 영수증 PDF 테이블 생성
CREATE TABLE IF NOT EXISTS tb_receipt_pdf (
    receipt_id      BIGINT NOT NULL AUTO_INCREMENT 	COMMENT '영수증 pdf 생성 고유 식별자',
    payment_id      BIGINT NOT NULL 				COMMENT '결제 FK',
    pdf_file_path   VARCHAR(500) NOT NULL 			COMMENT 'PDF 파일 저장 경로',
    confirm_number  VARCHAR(15) NOT NULL 			COMMENT '문서번호',
    PRIMARY KEY (receipt_id),
    UNIQUE KEY uq_receipt_confirmnumber (confirm_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='영수증 PDF 테이블';




# 로그인, 결제 FK 설정
ALTER TABLE tb_refresh_tokens
ADD CONSTRAINT fk_token_userid
		FOREIGN KEY (user_id)
		REFERENCES tb_users(user_id);
		
ALTER TABLE tb_user_social_login
ADD CONSTRAINT fk_login_userid
		FOREIGN KEY (user_id)
		REFERENCES tb_users(user_id);	

ALTER TABLE tb_login_history
ADD CONSTRAINT fk_history_userid
		FOREIGN KEY (user_id)
		REFERENCES tb_users(user_id);
	
ALTER TABLE tb_payments
ADD CONSTRAINT fk_payment_reservationid
		FOREIGN KEY (reservation_id)
		REFERENCES tb_reservation(reservation_id);

ALTER TABLE tb_refund
ADD CONSTRAINT fk_refund_paymentid
		FOREIGN KEY (payment_id)
		REFERENCES tb_payments(payment_id);
	
ALTER TABLE tb_payment_logs
ADD CONSTRAINT fk_log_payment
		FOREIGN KEY (payment_id)
		REFERENCES tb_payments(payment_id);

# 장소 FK 설정
ALTER TABLE tb_place
ADD CONSTRAINT fk_place_programid
		FOREIGN KEY (program_id)
		REFERENCES tb_program(program_id);
		    
# 객실 FK 설정
ALTER TABLE tb_room
ADD CONSTRAINT fk_room_placeid
  FOREIGN KEY (place_id)
  REFERENCES tb_place(place_id)
  ON DELETE CASCADE;
  
# 검색어 FK 설정
ALTER TABLE tb_search
ADD CONSTRAINT fk_search_userid
	FOREIGN KEY (user_id)
	REFERENCES tb_users(user_id)
  ON DELETE CASCADE;
  
# 추천숙소(매핑) FK 설정
ALTER TABLE tb_search_program
ADD CONSTRAINT fk_sp_searchid
 FOREIGN KEY (search_id)
 REFERENCES tb_search(search_id);

ALTER TABLE tb_search_program
ADD CONSTRAINT fk_sp_programid
	FOREIGN KEY (program_id)
	REFERENCES tb_program(program_id);
	
# 리뷰 FK 설정
ALTER TABLE tb_review
ADD CONSTRAINT fk_review_program
  FOREIGN KEY (program_id)
  REFERENCES tb_program(program_id);
    
ALTER TABLE tb_review
ADD CONSTRAINT fk_review_user
  FOREIGN KEY (user_id)
  REFERENCES tb_users(user_id);
  
# 알림톡 FK 설정
ALTER TABLE tb_notification
ADD CONSTRAINT fk_notification_userid
  FOREIGN KEY (user_id)
  REFERENCES tb_users(user_id)
  ON DELETE CASCADE;
  
# 채팅 세션 FK 설정
ALTER TABLE tb_chat_session
ADD CONSTRAINT fk_chatsession_userid
  FOREIGN KEY (user_id)
  REFERENCES tb_users(user_id);
    
# 챗봇 메시지 FK 설정
ALTER TABLE tb_chat_message
ADD CONSTRAINT fk_chatmsg_session
  FOREIGN KEY (session_id)
  REFERENCES tb_chat_session(session_id);

ALTER TABLE tb_chat_message
ADD CONSTRAINT fk_chatmsg_faq
  FOREIGN KEY (faq_id)
  REFERENCES tb_faq(faq_id);
  
# AI 상세 요청 FK 설정
ALTER TABLE tb_inquiry
ADD CONSTRAINT fk_inquiry_session
  FOREIGN KEY (session_id)
  REFERENCES tb_chat_session(session_id);

# 예약 FK 설정
ALTER TABLE tb_reservation
  ADD CONSTRAINT fk_reservation_userid
		FOREIGN KEY (user_id)
		REFERENCES tb_users(user_id);
		
ALTER TABLE tb_reservation
	ADD CONSTRAINT fk_reservation_programid
		FOREIGN KEY (program_id)
		REFERENCES tb_program(program_id);
		
# 예약 수정 요청 FK 설정
ALTER TABLE tb_reservation_modify
ADD CONSTRAINT fk_modify_reservationid
	FOREIGN KEY (reservation_id)
	REFERENCES tb_reservation(reservation_id);
	
ALTER TABLE tb_reservation_modify
ADD CONSTRAINT fk_modify_userid
	FOREIGN KEY (user_id)
	REFERENCES tb_users(user_id);
	
# 예약 확정서 PDF FK 설정
ALTER TABLE tb_reservation_pdf	
ADD CONSTRAINT fk_reservation_reservationid
	FOREIGN KEY (reservation_id)
	REFERENCES tb_reservation(reservation_id);
	
# 영수증 PDF FK 설정
ALTER TABLE tb_receipt_pdf
ADD CONSTRAINT fk_receipt_paymentid
	FOREIGN KEY (payment_id)
	REFERENCES tb_payments(payment_id);



# 사용자 샘플 데이터
INSERT INTO tb_users (email, user_pwd, user_name, phone, birth, company, user_role) VALUES
('hong@company.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', '홍길동', '010-1234-5678', '1990-05-15', '삼성전자', 'user'),
('kim@company.com', '$2a$10$bcdefghijklmnopqrstuvwxyz1234567890a', '김철수', '010-2345-6789', '1985-03-22', 'LG전자', 'user'),
('lee@company.com', '$2a$10$cdefghijklmnopqrstuvwxyz1234567890ab', '이영희', '010-3456-7890', '1992-08-10', '현대자동차', 'user'),
('park@company.com', '$2a$10$defghijklmnopqrstuvwxyz1234567890abc', '박민수', '010-4567-8901', '1988-11-30', '네이버', 'admin'),
('choi@company.com', '$2a$10$efghijklmnopqrstuvwxyz1234567890abcd', '최지은', '010-5678-9012', '1995-02-18', '카카오', 'user');

# 로그인 관련 샘플 데이터
INSERT INTO tb_user_social_login (user_id, provider, provider_user_id, email) VALUES
(1, 'kakao', '1234567890', 'hong@kakao.com'),
(2, 'naver', '9876543210', 'kim@naver.com'),
(3, 'kakao', '1122334455', 'lee@kakao.com'),
(4, 'naver', '5544332211', 'park@naver.com'),
(5, 'kakao', '6677889900', 'choi@kakao.com');

INSERT INTO tb_refresh_tokens (user_id, refresh_token, expires_at) VALUES
(1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxfQ.abcdef123456', '2025-12-25 23:59:59'),
(2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyfQ.bcdefg234567', '2025-12-26 23:59:59'),
(3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozfQ.cdefgh345678', '2025-12-27 23:59:59'),
(4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0fQ.defghi456789', '2025-12-28 23:59:59'),
(5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1fQ.efghij567890', '2025-12-29 23:59:59');

INSERT INTO tb_login_history (user_id, login_ip, user_agent, login_status, fail_reason) VALUES
(1, '192.168.0.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0', 'success', NULL),
(2, '192.168.0.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15', 'success', NULL),
(3, '192.168.0.103', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/604.1', 'failed', '비밀번호 불일치'),
(4, '192.168.0.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0', 'success', NULL),
(5, '192.168.0.105', 'Mozilla/5.0 (Linux; Android 14) Chrome/120.0.0.0 Mobile', 'blocked', '5회 로그인 실패');

# 프로그램 관련 샘플 데이터
INSERT INTO tb_program
(program_title, program_info, program_people, program_price,
stay_id, office_id, attraction_id1, attraction_id2, attraction_id3)
VALUES
('강릉 워케이션 패키지', '해변 리조트 + 워크센터 + 관광 포함', 10, 300000, 1, 3, 4, 5, NULL),
('가평 힐링 워케이션', '산속 펜션과 자연 관광', 8, 250000, 2, 3, 4, NULL, NULL),
('강릉 스페셜', '숙소와 오피스를 함께 제공하는 기본 패키지', 5, 200000, 1, 3, NULL, NULL, NULL),
('프리워커 패키지', '커피거리 중심의 자유 워케이션', 6, 180000, 1, 3, 5, NULL, NULL),
('자연 힐링 패키지', '휴식 중심의 워케이션', 4, 150000, 2, 3, NULL, NULL, NULL);

INSERT INTO tb_place
(program_id, place_type, place_name, place_code, place_address, place_phone,
 place_equipment, place_photo1, place_photo2, place_photo3, attraction_url)
VALUES
(1, 'stay', '강릉 해변 리조트', 'ST01', '강원도 강릉시 해변로 100', '033-111-2222',
 '수영장,조식,바다전망', 'stay1_1.jpg', 'stay1_2.jpg', 'stay1_3.jpg', NULL),
(2, 'stay', '가평 산속 힐링펜션', 'ST02', '경기도 가평군 힐링로 55', '031-222-3333',
 '바비큐장,스파,주차장', 'stay2_1.jpg', 'stay2_2.jpg', 'stay2_3.jpg', NULL),
(1, 'office', '강릉 워케이션 오피스', 'OF01', '강원도 강릉시 사무로 88', '033-444-5555',
 '회의실,화이트보드,TV모니터', 'office1_1.jpg', 'office1_2.jpg', 'office1_3.jpg', NULL),
(1, 'attraction', '경포대 해수욕장', 'AT01', '강릉시 해안로 145', NULL,
 NULL, 'attraction1_1.jpg', 'attraction1_2.jpg', 'attraction1_3.jpg', 
 'https://visitgangneung.kr'),
(4, 'attraction', '안목 커피거리', 'AT02', '강릉시 안목해변 일대', NULL,
 NULL, 'attraction2_1.jpg', 'attraction2_2.jpg', 'attraction2_3.jpg',
 'https://coffee-gangneung.kr');

INSERT INTO tb_review
(program_id, user_id, review_title, review_content, review_point)
VALUES
(1, 1, '완전 만족!', '숙소도 좋고 바다뷰가 최고였어요.', 5),
(1, 2, '만족스러운 워케이션', '오피스 환경이 깔끔해요.', 4),
(2, 3, '힐링 성공', '가평 자연이 너무 좋아요.', 5),
(3, 4, '무난합니다', '기본 패키지로 적당했습니다.', 3),
(4, 5, '좋았습니다', '커피거리 최고!', 5);

INSERT INTO tb_search
(user_id, search_phrase)
VALUES
(1, '가평'),
(2, '서울 워케이션'),
(3, '휴양할수 있는 곳'),
(4, '넓은 오피스'),
(5, '숙박 시설 좋은');

INSERT INTO tb_search_program
(search_id, program_id, search_point)
VALUES
(1, 2, 80),
(2, 4, 65),
(3, 5, 50),
(4, 3, 90),
(5, 1, 30);

INSERT INTO tb_room
(place_id, room_no, room_people, room_service)
VALUES
(1, 101, 2, '조식 포함, 오션뷰'),
(1, 102, 4, '가족룸, 테라스 포함'),
(2, 201, 2, '힐링룸, 숲 전망'),
(3, 103, 6, '회의실, TV모니터, 화이트보드'),
(3, 204, 1, '1인 집중 부스');

# 채팅 관련 샘플 데이터
INSERT INTO tb_chat_session
(user_id, status, is_ai_only, create_time, closed_time)
VALUES
(1, 'open', 1, NOW(), NULL),
(2, 'closed', 1, NOW(), NOW()),
(3, 'waiting', 0, NOW(), NULL),
(4, 'assigned', 0, NOW(), NULL),
(5, 'closed', 1, NOW(), NOW());

INSERT INTO tb_faq
(intent_name, example_phrases)
VALUES
('숙소추천', '가성비 좋은 숙소 추천해줘'),
('지원금문의', '워크숍 지원금 받을 수 있나요?'),
('교통편문의', '교통편은 어떻게 가나요?'),
('식당추천', '근처 맛집 추천해줘'),
('오피스문의', '오피스 이용시간 알려줘');

INSERT INTO tb_notification
(user_id, noti_title, noti_msg, noti_type, sent_time, status)
VALUES
(1, '예약 완료', '숙소 예약이 완료되었습니다.', 'reservation', NOW(), 'success'),
(2, '프로모션', '2월 워케이션 할인 이벤트!', 'promotion', NOW(), 'success'),
(3, '시스템 공지', '서버 점검 예정 안내', 'system', NOW(), 'success'),
(4, '예약 실패', '결제 오류로 예약이 실패했습니다.', 'reservation', NOW(), 'failed'),
(5, '기타 알림', '새로운 추천 프로그램이 있어요!', 'etc', NOW(), 'success');

INSERT INTO tb_chat_message
(session_id, faq_id, sender_role, msg_text)
VALUES
(1, 1, 'user', '숙소 추천해주세요!'),
(1, 1, 'bot', '어떤 지역을 원하시나요?'),
(2, 2, 'user', '지원금 신청은 어떻게 하나요?'),
(3, 4, 'bot', '맛집 리스트를 보내드릴게요!'),
(4, 5, 'admin', '오피스 운영시간은 오전 9시~18시입니다.');

INSERT INTO tb_inquiry
(session_id, category, inquiry_detail)
VALUES
(1, 'stay', '숙소 체크인 시간 알려주세요'),
(2, 'region', '강릉 교통편이 궁금합니다'),
(3, 'subsidy', '지원금 받을 수 있나요?'),
(4, 'schedule', '일정 변경 가능한가요?'),
(5, 'etc', '기타 문의드립니다');


# 예약 관련 샘플 데이터
INSERT INTO tb_reservation
(user_id, program_id, reservation_no, start_date, end_date, status, total_price)
VALUES
(1, 1, '20251123-000000001', '2025-12-01 15:00:00', '2025-12-05 11:00:00', 'waiting', 450000),
(2, 1, '20251123-000000002', '2025-12-10 14:00:00', '2025-12-13 11:00:00', 'confirm', 380000),
(3, 1, '20251123-000000003', '2025-11-30 13:00:00', '2025-12-02 11:00:00', 'cancel', 290000),
(4, 1, '20251123-000000004', '2025-12-20 16:00:00', '2025-12-25 10:00:00', 'waiting', 650000),
(5, 1, '20251123-000000005', '2025-12-03 12:00:00', '2025-12-07 10:00:00', 'confirm', 520000);

# 결제 관련 샘플 데이터
INSERT INTO tb_payments (reservation_id, order_id, payment_key, amount, payment_status, payment_method, approved_at, created_at)
VALUES 
(1, 'ORD20241124001', 'tgen_20241124_abc123xyz', 150000, 'paid', '카드', '2024-11-24 10:30:00', '2024-11-24 10:28:45'),
(2, 'ORD20241124002', 'tgen_20241124_def456uvw', 280000, 'paid', '카드', '2024-11-24 11:15:30', '2024-11-24 11:14:20'),
(3, 'ORD20241124003', 'tgen_20241124_ghi789rst', 95000, 'paid', '계좌이체', '2024-11-24 12:20:15', '2024-11-24 12:18:50'),
(4, 'ORD20241124004', 'tgen_20241124_jkl012opq', 180000, 'paid', '간편결제', '2024-11-24 13:45:22', '2024-11-24 13:44:10'),
(5, 'ORD20241124005', 'tgen_20241124_mno345lmn', 220000, 'paid', '카드', '2024-11-24 14:10:05', '2024-11-24 14:08:33');


INSERT INTO tb_reservation_pdf
(reservation_id, confirmation_date, pdf_file_path, confirm_number)
VALUES
(1, '2025-01-15 10:30:00', 's3://my-bucket/reservations/2025/RC-2025-0001.pdf', 'RC-2025-0001'),
(2, '2025-01-16 14:10:00', 's3://my-bucket/reservations/2025/RC-2025-0002.pdf', 'RC-2025-0002'),
(3, '2025-01-18 09:20:00', 's3://my-bucket/reservations/2025/RC-2025-0003.pdf', 'RC-2025-0003'),
(4, '2025-01-20 16:45:00', 's3://my-bucket/reservations/2025/RC-2025-0004.pdf', 'RC-2025-0004'),
(5, '2025-01-21 11:55:00', 's3://my-bucket/reservations/2025/RC-2025-0005.pdf', 'RC-2025-0005');

INSERT INTO tb_receipt_pdf
(payment_id, pdf_file_path, confirm_number)
VALUES
(1, 'https://s3.amazonaws.com/workation/receipt/PC-2025-0001.pdf', 'PC-2025-0001');

INSERT INTO tb_receipt_pdf
(payment_id, pdf_file_path, confirm_number)
VALUES
(2, 'https://s3.amazonaws.com/workation/receipt/PC-2025-0002.pdf', 'PC-2025-0002');

INSERT INTO tb_receipt_pdf
(payment_id, pdf_file_path, confirm_number)
VALUES
(3, 'https://s3.amazonaws.com/workation/receipt/PC-2025-0003.pdf', 'PC-2025-0003');

INSERT INTO tb_receipt_pdf
(payment_id, pdf_file_path, confirm_number)
VALUES
(4, 'https://s3.amazonaws.com/workation/receipt/PC-2025-0004.pdf', 'PC-2025-0004');

INSERT INTO tb_receipt_pdf
(payment_id, pdf_file_path, confirm_number)
VALUES
(5, 'https://s3.amazonaws.com/workation/receipt/PC-2025-0005.pdf', 'PC-2025-0005');

INSERT INTO tb_reservation_modify
(reservation_id, user_id, after_data, status, reject_reason, request_at)
VALUES
(1, 1, JSON_OBJECT('people_count', 1), 'rejected', '최소 인원 미달로 인해 변경 요청이 승인되지 않았습니다.', CURRENT_TIMESTAMP);

INSERT INTO tb_reservation_modify
(reservation_id, user_id, after_data, status, reject_reason, request_at)
VALUES
(2, 2, JSON_OBJECT('people_count', 12), 'rejected', '최대 인원 초과로 인해 변경 요청이 승인되지 않았습니다.', CURRENT_TIMESTAMP);

INSERT INTO tb_reservation_modify
(reservation_id, user_id, after_data, status, reject_reason, request_at, processed_at)
VALUES
(3, 2, JSON_OBJECT('people_count', 4), 'approved', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO tb_reservation_modify
(reservation_id, user_id, after_data, status, reject_reason, request_at)
VALUES
(4, 4, JSON_OBJECT('start_date', '2025-06-02 15:00:00'), 'rejected', '긴급 내부 공사로 해당 날짜는 예약 변경이 불가능합니다.', CURRENT_TIMESTAMP);

INSERT INTO tb_reservation_modify
(reservation_id, user_id, after_data, status, reject_reason, request_at, processed_at)
VALUES
(5, 1, JSON_OBJECT('start_date', '2025-07-15 15:00:00', 'end_date', '2025-07-18 11:00:00'), 'approved', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO tb_refund (payment_id, refund_amount, refund_reason, cancel_key, refund_status, requested_by, refunded_at) VALUES
(1, 150000, '개인 사정으로 취소', 'CANCEL_KEY_001', 'completed', 'user', '2025-11-20 14:30:00'),
(2, 200000, '일정 변경', 'CANCEL_KEY_002', 'completed', 'user', '2025-11-21 10:15:00'),
(3, 180000, '숙소 문제', 'CANCEL_KEY_003', 'pending', 'admin', NULL),
(4, 250000, '날씨 문제', 'CANCEL_KEY_004', 'completed', 'user', '2025-11-22 16:45:00'),
(5, 300000, '업무 변경', 'CANCEL_KEY_005', 'failed', 'user', NULL);

INSERT INTO tb_payment_logs (payment_id, response_data, event_type, http_status) VALUES
(1, '{"status": "paid", "orderName": "워케이션 예약", "totalAmount": 150000}', 'response', 200),
(2, '{"status": "paid", "orderName": "제주 워케이션", "totalAmount": 200000}', 'response', 200),
(3, '{"status": "ready", "orderName": "강릉 워케이션", "totalAmount": 180000}', 'request', 200),
(4, '{"status": "paid", "orderName": "부산 워케이션", "totalAmount": 250000}', 'callback', 200),
(5, '{"error": "timeout", "message": "결제 시간 초과"}', 'fail', 408);


commit;