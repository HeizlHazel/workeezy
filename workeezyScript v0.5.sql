# 사용DB명 꼭 확인하고 스크립트 돌리기

# DBeaver 기준 메뉴바에 N/A 라고 된 부분 사용할 DB 선택 해야함!

# 제출했던 파일은 조장이 가지고 있습니다

# 12/11 업데이트 완

 USE 사용자이름;

-- 1. 외래 키 체크 해제
SET FOREIGN_KEY_CHECKS = 0;

SET group_concat_max_len = 100000;

SELECT GROUP_CONCAT(CONCAT('`', table_name, '`')) INTO @tables
FROM information_schema.tables
 WHERE table_schema = '사용자이름';

SET @drop_query = IF(@tables IS NOT NULL, CONCAT('DROP TABLE IF EXISTS ', @tables), 'SELECT "No tables to drop"');

PREPARE stmt FROM @drop_query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET FOREIGN_KEY_CHECKS = 1;



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
CREATE TABLE tb_program (
  program_id      BIGINT NOT NULL AUTO_INCREMENT COMMENT '프로그램 고유 식별자',
  program_title   VARCHAR(100) NOT NULL COMMENT '프로그램명',
  program_info    VARCHAR(1000) NOT NULL COMMENT '프로그램 설명',
  program_people  INT NOT NULL COMMENT '참여 인원',
  program_price   INT NOT NULL COMMENT '가격',

  stay_id         BIGINT NULL COMMENT '숙소 place_id',
  office_id       BIGINT NULL COMMENT '오피스 place_id',

  attraction_id1 BIGINT NULL COMMENT '관광지 place_id 1',
  attraction_id2 BIGINT NULL COMMENT '관광지 place_id 2',
  attraction_id3 BIGINT NULL COMMENT '관광지 place_id 3',

  PRIMARY KEY (program_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='워케이션 프로그램';



# 예약 테이블 생성
CREATE TABLE IF NOT EXISTS tb_reservation (
    reservation_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '예약 고유 식별자 PK',
    user_id BIGINT NOT NULL COMMENT '사용자 FK',
    program_id BIGINT NOT NULL COMMENT '프로젝트 FK',
	stay_id BIGINT NOT NULL COMMENT '숙소 FK',
	room_id BIGINT NOT NULL COMMENT '룸 FK',
	office_id BIGINT NULL COMMENT '오피스 FK(PLACE, 선택)',
    reservation_no VARCHAR(20) NOT NULL COMMENT '예약번호(YYYYMMDD-000000010)',
    start_date DATETIME(6) NOT NULL COMMENT '예약 시작 날짜',
    end_date   DATETIME(6) NOT NULL COMMENT '예약 종료 날짜',
    status ENUM('waiting_payment', 'approved', 'rejected', 'confirmed', 'cancel_requested', 'cancelled') NOT NULL DEFAULT 'waiting_payment' COMMENT '예약 상태(결제전/ 관리자승인/ 관리자거절 / 결제완료(확정)/ 취소요청/ 취소)',
    reject_reason VARCHAR(500) NULL COMMENT '관리자 거절 사유',
	confirm_pdf_key VARCHAR(255) NULL COMMENT '예약 확정서 PDF S3 key',
	created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '예약 생성일',
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '예약 수정일',
    total_price BIGINT NOT NULL COMMENT '워케이션 총 금액',
    PRIMARY KEY (reservation_id),
    UNIQUE KEY uq_reservation_no (reservation_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='예약 테이블';

-- 사용자별 예약 조회 성능 개선용 인덱스
CREATE INDEX idx_reservation_user_created
ON tb_reservation (user_id, created_date DESC);

ALTER TABLE tb_reservation ADD COLUMN people_count INT NOT NULL DEFAULT 1 COMMENT '예약 인원수';


# 소셜 로그인 테이블 생성
CREATE TABLE IF NOT EXISTS tb_social_login (
    social_id        BIGINT NOT NULL AUTO_INCREMENT                COMMENT '소셜 로그인 고유 식별자',
    user_id          BIGINT NOT NULL                               COMMENT '사용자 FK',
    provider         ENUM('kakao', 'naver') NULL                   COMMENT '소셜 연동 플랫폼',
    provider_user_id VARCHAR(255) NULL                             COMMENT '소셜 연동 고유 ID',
    email            VARCHAR(100) NULL                             COMMENT '플랫폼에서 받은 이메일',
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT '연동 날짜',
    PRIMARY KEY (social_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='소셜 로그인 테이블';


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
CREATE TABLE tb_place (
  place_id        BIGINT NOT NULL AUTO_INCREMENT COMMENT '장소 고유 식별자',
  program_id      BIGINT NOT NULL COMMENT '프로그램 ID',

  place_type      ENUM('stay','office','attraction') NOT NULL COMMENT '장소 타입',
  place_name      VARCHAR(100) NOT NULL COMMENT '장소명',
  place_code      VARCHAR(20) NULL COMMENT '장소 코드',
  place_address   VARCHAR(255) NOT NULL COMMENT '주소',
  place_phone     VARCHAR(30) NULL COMMENT '전화번호',
  place_equipment VARCHAR(255) NULL COMMENT '비품/시설',

  place_photo1    VARCHAR(255) NULL COMMENT '사진1',
  place_photo2    VARCHAR(255) NULL COMMENT '사진2',
  place_photo3    VARCHAR(255) NULL COMMENT '사진3',

  attraction_url  VARCHAR(255) NULL COMMENT '어트랙션 URL',
  place_region    VARCHAR(20) NOT NULL COMMENT '지역',

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
CREATE TABLE tb_room (
  room_id      BIGINT NOT NULL AUTO_INCREMENT COMMENT '룸 고유 식별자',
  place_id     BIGINT NOT NULL COMMENT '장소 ID',

  room_no      INT NOT NULL COMMENT '호실',
  room_people  INT NOT NULL COMMENT '수용 인원',
  room_service VARCHAR(255) NULL COMMENT '서비스 설명',

  room_type    ENUM('economy','standard','superior') NOT NULL COMMENT '룸 타입',

  PRIMARY KEY (room_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='룸 테이블';



# 검색어 테이블
CREATE TABLE IF NOT EXISTS tb_search (
    search_id     BIGINT NOT NULL AUTO_INCREMENT 			COMMENT '검색어 고유 식별자',
    user_id       BIGINT NOT NULL 							COMMENT '사용자 FK',
    search_time   TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP 	COMMENT '검색일시',
    search_phrase VARCHAR(100) NULL 						COMMENT '검색어',
    PRIMARY KEY (search_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='검색 테이블';

# 리뷰 테이블 생성
CREATE TABLE tb_review (
  review_id      BIGINT NOT NULL AUTO_INCREMENT COMMENT '리뷰 ID',
  program_id     BIGINT NOT NULL COMMENT '프로그램 ID',
  user_id        BIGINT NOT NULL COMMENT '작성자 ID',

  review_content TEXT NOT NULL COMMENT '리뷰 내용',
  review_point   INT NOT NULL COMMENT '별점',

  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '작성 시각',

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
		
ALTER TABLE tb_social_login
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

ALTER TABLE tb_reservation
	ADD CONSTRAINT fk_reservation_roomid
		FOREIGN KEY (room_id)
		REFERENCES tb_room(room_id);

ALTER TABLE tb_reservation
	ADD CONSTRAINT fk_reservation_office
		FOREIGN KEY (office_id)
		REFERENCES tb_place(place_id);

ALTER TABLE tb_reservation
	ADD CONSTRAINT fk_reservation_stay
		FOREIGN KEY (stay_id)
		REFERENCES tb_place(place_id);


		
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
INSERT INTO tb_social_login (user_id, provider, provider_user_id, email) VALUES
(1, 'kakao', '1234567890', 'hong@kakao.com'),
(2, 'naver', '9876543210', 'kim@naver.com'),
(3, 'kakao', '1122334455', 'lee@kakao.com'),
(4, 'naver', '5544332211', 'park@naver.com'),
(5, 'kakao', '6677889900', 'choi@kakao.com');

INSERT INTO tb_login_history (user_id, login_ip, user_agent, login_status, fail_reason) VALUES
(1, '192.168.0.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0', 'success', NULL),
(2, '192.168.0.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15', 'success', NULL),
(3, '192.168.0.103', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/604.1', 'failed', '비밀번호 불일치'),
(4, '192.168.0.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0', 'success', NULL),
(5, '192.168.0.105', 'Mozilla/5.0 (Linux; Android 14) Chrome/120.0.0.0 Mobile', 'blocked', '5회 로그인 실패');

# 프로그램 관련 샘플 데이터
INSERT INTO tb_program
(
  program_id,
  program_title,
  program_info,
  program_people,
  program_price,
  stay_id,
  office_id,
  attraction_id1,
  attraction_id2,
  attraction_id3
)
VALUES
(1,  '부산 동구 워케이션',      '해변 리조트 + 워크센터 + 관광 포함',            10, 300000, 1,  3,  NULL, NULL, NULL),
(2,  '가평 힐링 워케이션',      '산속 펜션과 자연 관광',                        8,  250000, 2,  3,  NULL, NULL, NULL),
(3,  '강원 속초 워케이션',      '숙소와 오피스를 함께 제공하는 기본 패키지',     5,  200000, 6,  3,  NULL, NULL, NULL),
(4,  '남해 지족 워케이션',      '커피거리 중심의 자유 워케이션',                6,  180000, 7,  NULL, NULL, NULL, NULL),
(5,  '인천 포내 워케이션',      '휴식 중심의 워케이션',                        4,  150000, 8,  3,  NULL, NULL, NULL),
(6,  '오키나와 워케이션',       '일본 여행과 워케이션을 함께 제공',              4,  220000, 9,  NULL, NULL, NULL, NULL),
(7,  '서울 강남 워케이션',      '비즈니스 호텔 + 워크센터 + 카페거리',           8,  260000, 10, 11, NULL, NULL, NULL),
(8,  '제주 바다 워케이션',      '리조트 + 워크센터 + 관광 패키지',               6,  280000, 13, 14, NULL, NULL, NULL),
(9,  '속초 힐링 워케이션',      '오션뷰 휴식 + 워케이션 오피스',                 4,  190000, 6,  3,  NULL, NULL, NULL),
(10, '부산 해운대 워케이션',    '해운대 숙소 + 카페형 오피스',                  4,  210000, 1,  3,  NULL, NULL, NULL),
(11, '경주 역사 워케이션',      '한옥 숙소 + 유적지 관광',                      5,  200000, 2,  3,  NULL, NULL, NULL),
(12, '여수 오션 워케이션',      '오션뷰 호텔 + 액티비티',                      6,  230000, 7,  NULL, NULL, NULL, NULL);


INSERT INTO tb_place
(
  place_id,
  program_id,
  place_type,
  place_name,
  place_code,
  place_address,
  place_phone,
  place_equipment,
  place_photo1,
  place_photo2,
  place_photo3,
  attraction_url,
  place_region
)
VALUES
(1,  1, 'stay',       '토요코인 부산역',                  'ST01', '부산 동구 중앙대로196번길 12 토요코인부산역',        '033-111-2222', '수영장,조식,바다전망',                 'public/부산동구/부산동구1.png',      'public/부산동구/부산동구2.png',      'public/부산동구/부산동구3.png',      NULL,                          '부산'),
(2,  2, 'stay',       '가평 산속 힐링펜션',                'ST02', '경기도 가평군 힐링로 55',                          '031-222-3333', '바비큐장,스파,주차장',                  'public/가평/가평1.png',            'public/가평/가평2.png',            'public/가평/가평3.png',            NULL,                          '경기'),
(3,  1, 'office',     '부산 워케이션 오피스',              'OF01', '부산 동구 중앙대로214번길 7',                        '033-444-5555', '회의실,화이트보드,TV모니터',             'public/부산동구/부산동구웤1.png',    'public/부산동구/부산동구웤2.png',    'public/부산동구/부산동구웤3.png.jpg', NULL,                         '부산'),
(4,  3, 'attraction', '경포대 해수욕장',                   'AT01', '강원도 강릉시 사무로 88',                            NULL,           NULL,                                  'attraction1_1.jpg',                'attraction1_2.jpg',                'attraction1_3.jpg',                'https://visitgangneung.kr',        '강원'),
(5,  3, 'attraction', '안목 커피거리',                     'AT02', '강원도 강릉시 안목해변 일대',                         NULL,           NULL,                                  'attraction2_1.jpg',                'attraction2_2.jpg',                'attraction2_3.jpg',                'https://coffee-gangneung.kr',      '강원'),
(6,  3, 'stay',       '강원 속초 워케이션 호텔',            'ST06', '강원도 속초시 조양로 45',                            '033-552-7890', '바다전망,조식,와이파이,헬스장',         'public/강원속초/강원속초1.png',      'public/강원속초/강원속초2.png',      'public/강원속초/강원속초3.png',      NULL,                          '강원'),
(7,  4, 'stay',       '남해 지족 오션뷰 리조트',            'ST07', '경상남도 남해군 지족면 지족리 101-3',                 '055-862-1234', '바다전망,조식,와이파이,주차장',         'public/남해지족/남해지족1.png',      'public/남해지족/남해지족2.png',      'public/남해지족/남해지족3.png',      NULL,                          '경남'),
(8,  5, 'stay',       '인천 포내 워케이션 호텔',            'ST08', '인천 강화군 길상면 포내리 230-8',                     '032-441-9876', '와이파이,업무책상,미팅룸,조식',          'public/인천포내/인천포내1.png',      'public/인천포내/인천포내2.png',      'public/인천포내/인천포내3.png',      NULL,                          '인천'),
(9,  6, 'stay',       '오키나와 나하 비치 호텔',            'ST09', '일본 오키나와현 나하시 3-12-7',                        '+81-98-123-4567', '바다전망,수영장,레스토랑,와이파이',    'public/오키나와나하/나하1.png',      'public/오키나와나하/나하2.png',      'public/오키나와나하/나하3.png',      'https://www.okinawastory.jp',      '해외'),
(10, 7, 'stay',       '서울 강남 비즈니스 호텔',            'ST10', '서울 강남구 테헤란로 311',                            '02-123-4567',  '조식, 와이파이, 업무책상',               'public/강남/강남1.png',             'public/강남/강남2.png',             'public/강남/강남3.png',             NULL,                          '서울'),
(11, 7, 'office',     '강남 워크센터',                      'OF02', '서울 강남구 봉은사로 423',                            '02-223-8899',  '회의실, 빔프로젝터, 라운지',             'public/강남오피스/오피1.png',         'public/강남오피스/오피2.png',         'public/강남오피스/오피3.png',         NULL,                         '서울'),
(12, 7, 'attraction', '청담 카페거리',                      'AT10', '서울 강남구 청담동 일대',                             NULL,           NULL,                                  'attraction10_1.jpg',               'attraction10_2.jpg',               'attraction10_3.jpg',               'https://seoulcafe.kr',             '서울'),
(13, 8, 'stay',       '제주 바다 전망 리조트',              'ST11', '제주 서귀포시 중문관광로 120',                        '064-777-8888', '바다전망, 수영장, 스파',                 'public/제주바다/제주1.png',          'public/제주바다/제주2.png',          'public/제주바다/제주3.png',          NULL,                         '제주'),
(14, 8, 'office',     '제주 워케이션 센터',                 'OF03', '제주 제주시 첨단로 33',                               '064-123-9090', '회의실, 프린터, 휴게실',                 'public/제주바다/제주웤1.png',         'public/제주바다/제주웤2.png',         'public/제주바다/제주웤3.png',         NULL,                         '제주'),
(15, 8, 'attraction', '용머리 해안',                        'AT11', '제주 서귀포시 안덕면',                                NULL,           NULL,                                  'attraction11_1.jpg',               'attraction11_2.jpg',               'attraction11_3.jpg',               'https://visitjeju.net',            '제주'),
(16, 2, 'office',     '가평 자라섬 워케이션 센터',           'OF04', '경기 가평군 가평제방길 16',                            '033-552-7890', '오픈라운지 30석, 회의실 8석, 폰부스 8석',  'public/가평/가평웤1.png',            'public/가평/가평웤2.png',            'public/가평/가평웤3.png',            NULL,                         '경기'),
(17, 3, 'office',     '체스터톤스 속초 노마드오피스',        'OF05', '강원 속초시 엑스포로 109',                             '033-552-7892', '좌석 50석',                               'public/속초/속초웤1.png',            'public/속초/속초웤2.png',            'public/속초/속초웤3.png',            NULL,                         '강원'),
(18, 4, 'office',     '지족 어촌체험휴양마을 공유오피스',     'OF06', '경남 남해군 죽방로 24',                                '033-552-7893', '좌석 50석',                               'public/남해지족/남해지족웤1.png',      'public/남해지족/남해지족웤2.png',      'public/남해지족/남해지족웤3.png',      NULL,                         '경남');


INSERT INTO tb_review
(program_id, user_id, review_content, review_point)
VALUES
(1, 1, '숙소도 좋고 바다뷰가 최고였어요.', 5),
(1, 2, '오피스 환경이 깔끔해요.', 4),
(2, 3, '가평 자연이 너무 좋아요.', 5),
(3, 4, '기본 패키지로 적당했습니다.', 3),
(4, 5, '커피거리 최고!', 5);

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
(user_id, program_id, stay_id, room_id, office_id, reservation_no, start_date, end_date, status, total_price, people_count)
VALUES
(1, 1, 1, 1, 3, '20251123-000000001', '2025-12-01 15:00:00', '2025-12-05 11:00:00', 'waiting_payment', 450000, 4),
(2, 1, 1, 2, 3, '20251123-000000002', '2025-12-10 14:00:00', '2025-12-13 11:00:00', 'confirmed', 380000, 6),
(3, 1, 1, 2, 3, '20251123-000000003', '2025-11-30 13:00:00', '2025-12-02 11:00:00', 'cancelled', 290000, 6),
(4, 1, 1, 1, NULL, '20251123-000000004', '2025-12-20 16:00:00', '2025-12-25 10:00:00', 'waiting_payment', 650000, 2),
(5, 1, 1, 2, NULL, '20251123-000000005', '2025-12-03 12:00:00', '2025-12-07 10:00:00', 'confirmed', 520000, 3);


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
