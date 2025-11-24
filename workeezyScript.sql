CREATE DATABASE workeezy
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

use workeezy;

DROP TABLE IF EXISTS tb_users;
DROP TABLE IF EXISTS tb_user_social_login;
DROP TABLE IF EXISTS tb_refresh_tokens;
DROP TABLE IF EXISTS tb_login_history;
DROP TABLE IF EXISTS tb_payments;
DROP TABLE IF EXISTS tb_refund;
DROP TABLE IF EXISTS tb_payment_logs;
DROP TABLE IF EXISTS tb_reservation;
DROP TABLE IF EXISTS tb_reservation_pdf;
DROP TABLE IF EXISTS tb_tb_receipt_pdf;
DROP TABLE IF EXISTS tb_reservation_modify;
DROP TABLE IF EXISTS tb_chat_session;
DROP TABLE IF EXISTS tb_faq;
DROP TABLE IF EXISTS tb_notification;
DROP TABLE IF EXISTS tb_chat_message;
DROP TABLE IF EXISTS tb_program;
DROP TABLE IF EXISTS tb_place;
DROP TABLE IF EXISTS tb_review;
DROP TABLE IF EXISTS tb_search_program;
DROP TABLE IF EXISTS tb_inquiry;
DROP TABLE IF EXISTS tb_room;
DROP TABLE IF EXISTS tb_search;

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
  program_id     BIGINT NOT NULL AUTO_INCREMENT COMMENT '프로그램ID',
  searchPG_id    BIGINT NOT NULL                    COMMENT '추천숙소ID',
  program_title  VARCHAR(100) NOT NULL              COMMENT '프로그램명',
  program_info   TEXT NOT NULL                      COMMENT '프로그램정보',
  program_people INT NULL                           COMMENT '참여인원수',
  program_price  INT NULL                           COMMENT '단위금액',
  stay_id        BIGINT NULL                        COMMENT '숙소ID',
  office_id      BIGINT NULL                        COMMENT '오피스ID',
  attraction_id1 BIGINT NULL                        COMMENT '1번추천어트랙션ID',
  attraction_id2 BIGINT NULL                        COMMENT '2번추천어트랙션ID',
  attraction_id3 BIGINT NULL                        COMMENT '3번추천어트랙션ID',
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

SHOW VARIABLES LIKE 'character_set%';

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

# 추천 숙소 테이블 생성
CREATE TABLE IF NOT EXISTS tb_search_program (
    searchPG_id BIGINT NOT NULL COMMENT '추천숙소ID',
    searchPoint INT NULL 		COMMENT '연관도점수',
    PRIMARY KEY (searchPG_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='추천 숙소 테이블';

# 객실 테이블 생성
CREATE TABLE IF NOT EXISTS tb_room (
    room_id      BIGINT NOT NULL AUTO_INCREMENT COMMENT '객실ID',
    place_id     BIGINT NOT NULL 				COMMENT '장소ID',
    room_no      INT NULL						COMMENT '객실번호',
    room_people  INT NULL						COMMENT '수용가능인원수',
    room_service VARCHAR(1000) NULL				COMMENT '객실시설',
    PRIMARY KEY (room_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='객실 테이블';

# 검색 테이블
CREATE TABLE IF NOT EXISTS tb_search (
    search_id     BIGINT NOT NULL AUTO_INCREMENT 			COMMENT '검색어ID',
    user_id       BIGINT NOT NULL 							COMMENT '유저ID',
    searchPG_id   BIGINT NOT NULL 							COMMENT '추천숙소ID',
    search_time   TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP 	COMMENT '검색일시',
    search_phrase VARCHAR(100) NULL 						COMMENT '검색어',
    PRIMARY KEY (search_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='검색 테이블';

# 채팅 세션 테이블 생성
CREATE TABLE IF NOT EXISTS tb_chat_session (
    session_id  BIGINT NOT NULL AUTO_INCREMENT 											COMMENT '세션 ID',
    user_id     BIGINT NOT NULL 														COMMENT '사용자 FK',
    status      ENUM('open', 'closed', 'waiting', 'assigned') NOT NULL DEFAULT 'closed' COMMENT '세션 상태',
    is_ai_only  TINYINT(1) NOT NULL DEFAULT 1 											COMMENT '챗봇세션인지 구분',
    create_time TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP 								COMMENT '생성시간',
    closed_time TIMESTAMP NULL 															COMMENT '종료시간',
    PRIMARY KEY (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='채팅 세션 테이블';

# 채팅 메시지 테이블 생성
CREATE TABLE IF NOT EXISTS tb_chat_message (
    chat_id     BIGINT NOT NULL AUTO_INCREMENT 				COMMENT '채팅 ID',
    session_id  BIGINT NOT NULL 							COMMENT '세션 ID',
    user_id     BIGINT NOT NULL 							COMMENT '사용자 고유 식별자',
    faq_id      BIGINT NOT NULL 							COMMENT 'FAQ ID',
    sender_role ENUM('user', 'admin', 'bot') NOT NULL 		COMMENT '보낸 주체',
    msg_text    TEXT NULL									COMMENT '메시지 내용',
    send_time   TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP 	COMMENT '보낸 시간',
    PRIMARY KEY (chat_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='채팅 메시지 테이블';

# 채팅 의도 파악 테이블 생성
CREATE TABLE IF NOT EXISTS tb_faq (
    faq_id          BIGINT NOT NULL AUTO_INCREMENT 				COMMENT 'FAQ ID',
    intent_name     VARCHAR(100) NULL 							COMMENT '의도 종류',
    example_phrases TEXT NULL 									COMMENT '예시 문장',
    create_time     TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP 	COMMENT '생성 시간',
    PRIMARY KEY (faq_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='의도파악 테이블';

# 알림톡 테이블 생성
CREATE TABLE IF NOT EXISTS tb_notification (
    noti_id     BIGINT NOT NULL AUTO_INCREMENT 							COMMENT '알림톡 ID',
    user_id     BIGINT NOT NULL 										COMMENT '유저',
    noti_title  VARCHAR(200) NULL										COMMENT '알림 제목',
    noti_msg    TEXT NULL												COMMENT '알림 내용',
    noti_type   ENUM('reservation', 'promotion', 'system', 'etc') NULL	COMMENT '알림종류',
    sent_time   TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP 				COMMENT '발송시각',
    status      ENUM('success', 'failed') NULL 							COMMENT '발송 결과',
    PRIMARY KEY (noti_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='알림톡 테이블';

# AI 상세 요청 테이블
CREATE TABLE IF NOT EXISTS tb_inquiry (
    inquiry_id     BIGINT NOT NULL AUTO_INCREMENT 								COMMENT '세부ID',
    session_id     BIGINT NOT NULL 												COMMENT '세션ID',
    user_id        BIGINT NOT NULL 												COMMENT '유저ID',
    category       ENUM('stay', 'region', 'subsidy', 'schedule', 'etc') NULL	COMMENT '카테고리',
    inquiry_detail TEXT NULL 													COMMENT '세부정보',
    inquiry_time   TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP						COMMENT '생성시간',
    PRIMARY KEY (inquiry_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI 상세 요청 테이블';

# 리뷰 테이블 생성
CREATE TABLE IF NOT EXISTS tb_review (
    review_id      BIGINT NOT NULL AUTO_INCREMENT 			COMMENT '리뷰 ID',
    program_id     BIGINT NOT NULL 							COMMENT '프로그램ID',
    user_id        BIGINT NOT NULL 							COMMENT '유저ID',
    review_title   VARCHAR(100) NOT NULL 					COMMENT '제목',
    review_content TEXT NULL								COMMENT '내용',
    review_date    TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP	COMMENT '작성일',
    review_point   INT NULL DEFAULT 0 						COMMENT '별점',
    PRIMARY KEY (review_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='리뷰 테이블';

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
ADD CONSTRAINT fk_place_programd
		FOREIGN KEY (program_id)
		REFERENCES tb_program(program_id);
		
# 프로그램 FK 설정
-- stay_id FK
ALTER TABLE tb_program
ADD CONSTRAINT fk_program_stay
    FOREIGN KEY (stay_id)
    REFERENCES tb_place(place_id)
    ON DELETE SET NULL;

-- office_id FK
ALTER TABLE tb_program
ADD CONSTRAINT fk_program_office
    FOREIGN KEY (office_id)
    REFERENCES tb_place(place_id)
    ON DELETE SET NULL;

-- attraction_id1 FK
ALTER TABLE tb_program
ADD CONSTRAINT fk_program_attraction1
    FOREIGN KEY (attraction_id1)
    REFERENCES tb_place(place_id)
    ON DELETE SET NULL;

-- attraction_id2 FK
ALTER TABLE tb_program
ADD CONSTRAINT fk_program_attraction2
    FOREIGN KEY (attraction_id2)
    REFERENCES tb_place(place_id)
    ON DELETE SET NULL;

-- attraction_id3 FK
ALTER TABLE tb_program
ADD CONSTRAINT fk_program_attraction3
    FOREIGN KEY (attraction_id3)
    REFERENCES tb_place(place_id)
    ON DELETE SET NULL;

-- searchPG_id FK
ALTER TABLE tb_program
ADD CONSTRAINT fk_program_searchPG
    FOREIGN KEY (searchPG_id)
    REFERENCES tb_search_program(searchPG_id);
    
# 객실 FK 설정
ALTER TABLE tb_room
ADD CONSTRAINT fk_room_place
  FOREIGN KEY (place_id)
  REFERENCES tb_place(place_id)
  ON DELETE CASCADE;
  
  # 검색 FK 설정
ALTER TABLE tb_search
ADD CONSTRAINT fk_search_project
  FOREIGN KEY (searchPG_id)
  REFERENCES tb_search_program(searchPG_id);
    
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
  
# 리뷰 FK 설정
ALTER TABLE tb_review
ADD CONSTRAINT fk_review_program
  FOREIGN KEY (program_id)
  REFERENCES tb_program(program_id);

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

commit;
---------------------------------------------------------------------------------------------------------
CREATE TABLE tb_search_program (
   searchPG_id BIGINT NOT NULL AUTO_INCREMENT,
   search_id BIGINT NOT NULL,
   program_id BIGINT NOT NULL,
   searchPoint	INT	NULL	COMMENT '0~100',

   PRIMARY KEY(searchPG_id),

   CONSTRAINT fk_sp_search
     FOREIGN KEY (search_id) REFERENCES tb_search(search_id),

   CONSTRAINT fk_sp_program
     FOREIGN KEY (program_id) REFERENCES tb_program(program_id)
);


CREATE TABLE tb_program (
   `program_id`	BIGINT	NOT NULL,
	`program_title`	VARCHAR(100)	NOT NULL,
	`program_info`	TEXT	NOT NULL,
	`program_people`	INT	NULL,
	`program_price`	INT	NULL,
	`stay_id`	BIGINT	NULL,
	`office_id`	BIGINT	NULL,
	`attraction_id1`	BIGINT	NULL	COMMENT '첫번째추천',
	`attraction_id2`	BIGINT	NULL	COMMENT '두번째추천',
	`attraction_id3`	BIGINT	NULL	COMMENT '세번째추천',

    PRIMARY KEY (program_id),

    -- fk: program references place (SET NULL)
    CONSTRAINT fk_program_stay
        FOREIGN KEY (stay_id)
        REFERENCES tb_place(place_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_program_office
        FOREIGN KEY (office_id)
        REFERENCES tb_place(place_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_program_attraction1
        FOREIGN KEY (attraction_id1)
        REFERENCES tb_place(place_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_program_attraction2
        FOREIGN KEY (attraction_id2)
        REFERENCES tb_place(place_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_program_attraction3
        FOREIGN KEY (attraction_id3)
        REFERENCES tb_place(place_id)
        ON DELETE SET NULL,

);

CREATE TABLE tb_search (
    search_id      BIGINT NOT NULL AUTO_INCREMENT COMMENT '검색어ID',
    user_id        BIGINT NOT NULL COMMENT '유저ID',
    search_time    TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '검색일시',
    search_phrase  VARCHAR(100) NULL COMMENT '검색어',

    PRIMARY KEY (search_id),

);