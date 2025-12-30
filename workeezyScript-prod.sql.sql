# 사용DB명 꼭 확인하고 스크립트 돌리기

# DBeaver 기준 메뉴바에 N/A 라고 된 부분 사용할 DB 선택 해야함!

# 제출했던 파일은 조장이 가지고 있습니다

# 12/11 업데이트 완

USE workeezy;

-- 1. 외래 키 체크 해제
SET FOREIGN_KEY_CHECKS = 0;

-- 2. 그룹 연결 길이 증가
SET group_concat_max_len = 100000;

-- 3. 삭제할 테이블 목록 가져오기
SELECT GROUP_CONCAT(CONCAT('`', table_name, '`')) INTO @tables
FROM information_schema.tables
WHERE table_schema = 'workeezy';

-- 4. 테이블이 존재할 때만 DROP 실행
SET @drop_query = IF(@tables IS NOT NULL, CONCAT('DROP TABLE IF EXISTS ', @tables), 'SELECT "No tables to drop"');

PREPARE stmt FROM @drop_query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 5. 외래 키 체크 다시 활성화
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
  user_role  VARCHAR(50) NOT NULL DEFAULT 'user' COMMENT '사용자 권한',
  PRIMARY KEY (user_id),
  UNIQUE KEY uq_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='사용자 테이블';

# 프로그램 테이블 생성
CREATE TABLE IF NOT EXISTS tb_program (
  program_id     BIGINT NOT NULL AUTO_INCREMENT COMMENT '프로그램 고유 식별자',
  program_title  VARCHAR(100) NOT NULL              COMMENT '프로그램명',
  program_info   VARCHAR(1000) NOT NULL                      COMMENT '프로그램 정보',
  program_people INT NOT NULL                           COMMENT '참여 인원수',
  program_price  BIGINT NOT NULL                           COMMENT '단위 금액',
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
	stay_id BIGINT NOT NULL COMMENT '숙소 FK',
	room_id BIGINT NOT NULL COMMENT '룸 FK',
	office_id BIGINT NULL COMMENT '오피스 FK(PLACE, 선택)',
    reservation_no VARCHAR(20) NOT NULL COMMENT '예약번호(YYYYMMDD-000000010)',
    start_date TIMESTAMP NOT NULL COMMENT '예약 시작 날짜',
    end_date TIMESTAMP NOT NULL COMMENT '예약 종료 날짜',
    status VARCHAR(50) NOT NULL DEFAULT 'waiting_payment' COMMENT '예약 상태(대기/확정/취소)',
    reject_reason VARCHAR(500) NULL COMMENT '관리자 거절 사유',
	confirm_pdf_key VARCHAR(255) NULL COMMENT '예약 확정서 PDF S3 key',
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '예약 생성일',
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '예약 수정일',
    total_price BIGINT NOT NULL COMMENT '워케이션 총 금액',
    PRIMARY KEY (reservation_id),
    UNIQUE KEY uq_reservation_no (reservation_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='예약 테이블';

ALTER TABLE tb_reservation ADD COLUMN people_count INT NOT NULL DEFAULT 1 COMMENT '예약 인원수';

# 소셜 로그인 테이블 생성
CREATE TABLE IF NOT EXISTS tb_social_login (
    social_id        BIGINT NOT NULL AUTO_INCREMENT                COMMENT '소셜 로그인 고유 식별자',
    user_id          BIGINT NOT NULL                               COMMENT '사용자 FK',
    provider         VARCHAR(50) NULL                   COMMENT '소셜 연동 플랫폼',
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
    login_status VARCHAR(50) NOT NULL	COMMENT '로그인 상태',
    fail_reason  VARCHAR(100) NULL 								COMMENT '로그인 실패 사유',
    PRIMARY KEY (history_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='로그인 로그 테이블';

# 결제 테이블 생성
CREATE TABLE IF NOT EXISTS tb_payments (
    payment_id      BIGINT NOT NULL AUTO_INCREMENT							COMMENT '결제 고유 식별자',
    reservation_id  BIGINT NOT NULL 										COMMENT '예약 FK',
    order_id        VARCHAR(100) NULL										COMMENT '토스 API 주문 번호',
    payment_key     VARCHAR(200) NULL 										COMMENT '토스 API 고유 결제키',
    amount          BIGINT NOT NULL 											COMMENT '결제 금액',
    payment_status  VARCHAR(50) NOT NULL	COMMENT '결제 상태',
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
    refund_status   VARCHAR(50) NOT NULL DEFAULT 'pending' 	COMMENT '취소 상태',
    requested_by    VARCHAR(50) NULL DEFAULT 'user' 							COMMENT '취소 요청자',
    refunded_at     TIMESTAMP NULL 														COMMENT '취소 완료시각',
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 						COMMENT '취소 요청시각',
    PRIMARY KEY (refund_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='결제 취소 테이블';

# 결제 로그 테이블 생성
CREATE TABLE IF NOT EXISTS tb_payment_logs (
    paymentlog_id BIGINT NOT NULL AUTO_INCREMENT 							COMMENT '결제로그 고유 식별자',
    payment_id    BIGINT NOT NULL 											COMMENT '결제 FK',
    response_data JSON NULL 												COMMENT '토스 API 응답값',
    event_type    VARCHAR(50) NOT NULL	COMMENT '로그 분류',
    http_status   INT NULL 													COMMENT '상태 코드',
    logged_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 				COMMENT '로그 발생시각',
    PRIMARY KEY (paymentlog_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='결제 로그 테이블';

# 장소 테이블 생성
CREATE TABLE IF NOT EXISTS tb_place (
    place_id        BIGINT NOT NULL AUTO_INCREMENT				COMMENT '장소 고유 식별자',
    program_id      BIGINT NOT NULL								COMMENT '프로그램 FK',
    place_type      VARCHAR(50) NULL 	COMMENT '장소 종류',
    place_name      VARCHAR(100) NOT NULL 						COMMENT '장소명',
    place_code      VARCHAR(20) NULL 							COMMENT '지역구분코드',
    place_address   VARCHAR(255) NULL 							COMMENT '숙소 주소',
    place_phone     VARCHAR(30) NULL 							COMMENT '전화번호',
    place_equipment VARCHAR(255) NULL 							COMMENT '부대시설',
    place_photo1    VARCHAR(255) NULL 							COMMENT '썸네일',
    place_photo2    VARCHAR(255) NULL 							COMMENT '사진2',
    place_photo3    VARCHAR(255) NULL 							COMMENT '사진3',
    attraction_url  VARCHAR(255) NULL 							COMMENT '어트랙션사이트URL',
    place_region    VARCHAR(50) NOT NULL COMMENT '지역',
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
    room_no      INT NOT NULL						COMMENT '객실 번호',
    room_people  INT NOT NULL						COMMENT '수용 가능 인원수',
    room_service VARCHAR(1000) NULL				COMMENT '객실 시설',
    room_type    VARCHAR(50) NOT NULL COMMENT '룸 타입',
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
    review_content TEXT NOT NULL								COMMENT '내용',
    review_point   INT NULL  						COMMENT '별점',
    review_date    TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP	COMMENT '작성일',
    PRIMARY KEY (review_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='리뷰 테이블';

# 채팅 세션 테이블 생성
CREATE TABLE IF NOT EXISTS tb_chat_session (
    session_id  BIGINT NOT NULL AUTO_INCREMENT 											COMMENT '세션 ID',
    user_id     BIGINT NOT NULL 														COMMENT '사용자 FK',
    status      VARCHAR(50) NOT NULL DEFAULT 'closed' COMMENT '세션 상태',
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
    sender_role VARCHAR(50) NOT NULL 		COMMENT '보낸 주체',
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
    noti_type   VARCHAR(50) NULL	COMMENT '알림 종류',
    sent_time   TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP 				COMMENT '발송 시각',
    status      VARCHAR(50) NULL 							COMMENT '발송 결과',
    PRIMARY KEY (noti_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='알림톡 테이블';

# AI 상세 요청 테이블
CREATE TABLE IF NOT EXISTS tb_inquiry (
    inquiry_id     BIGINT NOT NULL AUTO_INCREMENT 								COMMENT 'AI 상세 요청 고유 식별자',
    session_id     BIGINT NOT NULL 												COMMENT '세션 FK',
    category       VARCHAR(50) NULL	COMMENT '카테고리',
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
    status            VARCHAR(50) NOT NULL DEFAULT 'pending'	COMMENT '승인 요청 상태',
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
('hong@company.com', '$2a$10$xQkDv5ngqEMWHvY1Fwlcpu6uj5NFJ/F1LU65TXHBM/PeBF9PknU.K', '홍길동', '010-1234-5678', '1990-05-15', '삼성전자', 'user'),
('kim@company.com', '$2a$10$8zhPh9dvRvAmT0NAVXJEF.gUC7h0xVMsgrvHs3ivT.yhsylYm1y4u', '김철수', '010-2345-6789', '1985-03-22', 'LG전자', 'user'),
('lee@company.com', '$2a$10$FLW0u3ZFk56XYK7u62/ypu/WJDEk06O9qqz8yqK2sd3YmTeX0dR/a', '이영희', '010-3456-7890', '1992-08-10', '현대자동차', 'user'),
('park@company.com', '$2a$10$HzvtymtHnDLTLDVNm5cOveWlce8u88OCMy08NUIG9FE49ae7iA..2', '박민수', '010-4567-8901', '1988-11-30', '네이버', 'admin'),
('choi@company.com', '$2a$10$a6uC/cIItcY3OlqcMOKQX.qQtutB7dIa2TBD0bybaFdTSypfSp6Si', '최지은', '010-5678-9012', '1995-02-18', '카카오', 'user');

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
(1,  '부산 동구 워케이션',        '해변 리조트 + 워크센터 + 관광 포함',              10, 300000,  1,  2,  3,  4,  5),
(2,  '가평 힐링 워케이션',        '산속 숙소 + 자연속 업무 + 액티비티',               8, 250000,  6,  7,  8,  9, 10),
(3,  '강원 속초 워케이션',        '오션뷰 숙소 + 노마드 오피스 + 카페/바다',           5, 200000, 11, 12, 13, 14, 15),
(4,  '남해 지족 워케이션',        '바다 리조트 + 공유오피스 + 로컬 체험',              6, 180000, 16, 17, 18, 19, 20),
(5,  '인천 포내 워케이션',        '휴식 중심 숙소 + 회의/미팅 공간',                  4, 150000, 21, 22, 23, 24, 25),
(6,  '오키나와 워케이션',         '해외 워케이션(나하) + 코워킹 + 관광',               4, 220000, 26, 27, 28, 29, 30),
(7,  '서울 강남 워케이션',        '비즈니스 호텔 + 워크센터 + 카페거리',               8, 260000, 31, 32, 33, 34, 35),
(8,  '제주 바다 워케이션',        '리조트 + 워크센터 + 관광 패키지',                   6, 280000, 36, 37, 38, 39, 40),
(9,  '여수 오션 워케이션',        '오션뷰 호텔 + 코워킹 + 해양관광',                   6, 230000, 41, 42, 43, 44, 45),
(10, '경주 역사 워케이션',        '한옥 숙소 + 조용한 업무공간 + 유적지',              5, 200000, 46, 47, 48, 49, 50),
(11, '전주 감성 워케이션',        '한옥마을 + 코워킹 + 로컬 맛집/산책',                5, 190000, 51, 52, 53, 54, 55),
(12, '제천 숲속 워케이션',        '숲속 숙소 + 집중 오피스 + 호수/산책',               4, 175000, 56, 57, 58, 59, 60),
(13, '대전 도심 워케이션',        '도심 호텔 + 회의실 + 전시/공원',                    6, 210000, 61, 62, 63, 64, 65),
(14, '광주 문화 워케이션',        '시티 스테이 + 코워킹 + 문화투어',                   6, 205000, 66, 67, 68, 69, 70),
(15, '울산 바다산 워케이션',      '바다 근처 숙소 + 공유오피스 + 트레킹/관광',          6, 215000, 71, 72, 73, 74, 75);


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
-- =======================
-- Program 1 (부산)
-- =======================
(1,  1, 'stay',       '토요코인 부산역',            'P01-ST', '부산 동구 중앙대로196번길 12',        '051-111-2222', '조식,바다전망,와이파이', 'public/부산동구/부산동구1.png', 'public/부산동구/부산동구2.png', 'public/부산동구/부산동구3.png', NULL, '부산'),
(2,  1, 'office',     '부산 워케이션 오피스',        'P01-OF', '부산 동구 중앙대로214번길 7',         '051-444-5555', '회의실,화이트보드,TV모니터', 'public/부산동구/부산동구웤1.png', 'public/부산동구/부산동구웤2.png', 'public/부산동구/부산동구웤3.png.jpg', NULL, '부산'),
(3,  1, 'attraction', '부산역 광장',                 'P01-A1', '부산 동구 부산역 일대',               NULL, NULL, 'attraction_p01_1.jpg', 'attraction_p01_2.jpg', 'attraction_p01_3.jpg', 'https://example.com/busan1', '부산'),
(4,  1, 'attraction', '초량 이바구길',               'P01-A2', '부산 동구 초량동 일대',               NULL, NULL, 'attraction_p01_4.jpg', 'attraction_p01_5.jpg', 'attraction_p01_6.jpg', 'https://example.com/busan2', '부산'),
(5,  1, 'attraction', '흰여울문화마을',              'P01-A3', '부산 영도구 흰여울길 일대',           NULL, NULL, 'attraction_p01_7.jpg', 'attraction_p01_8.jpg', 'attraction_p01_9.jpg', 'https://example.com/busan3', '부산'),

-- =======================
-- Program 2 (가평)
-- =======================
(6,  2, 'stay',       '가평 산속 힐링펜션',           'P02-ST', '경기 가평군 힐링로 55',               '031-222-3333', '바비큐장,스파,주차장', 'public/가평/가평1.png', 'public/가평/가평2.png', 'public/가평/가평3.png', NULL, '경기'),
(7,  2, 'office',     '가평 자라섬 워케이션 센터',    'P02-OF', '경기 가평군 가평제방길 16',           '031-552-7890', '오픈라운지,회의실,폰부스', 'public/가평/가평웤1.png', 'public/가평/가평웤2.png', 'public/가평/가평웤3.png', NULL, '경기'),
(8,  2, 'attraction', '자라섬',                       'P02-A1', '경기 가평군 자라섬 일대',             NULL, NULL, 'attraction_p02_1.jpg', 'attraction_p02_2.jpg', 'attraction_p02_3.jpg', 'https://example.com/gp1', '경기'),
(9,  2, 'attraction', '아침고요수목원',               'P02-A2', '경기 가평군 상면 일대',               NULL, NULL, 'attraction_p02_4.jpg', 'attraction_p02_5.jpg', 'attraction_p02_6.jpg', 'https://example.com/gp2', '경기'),
(10, 2, 'attraction', '남이섬',                       'P02-A3', '강원 춘천시 남이섬로',                NULL, NULL, 'attraction_p02_7.jpg', 'attraction_p02_8.jpg', 'attraction_p02_9.jpg', 'https://example.com/gp3', '경기'),

-- =======================
-- Program 3 (속초/강원)
-- =======================
(11, 3, 'stay',       '강원 속초 워케이션 호텔',       'P03-ST', '강원 속초시 조양로 45',              '033-552-7890', '조식,와이파이,헬스장', 'public/강원속초/강원속초1.png', 'public/강원속초/강원속초2.png', 'public/강원속초/강원속초3.png', NULL, '강원'),
(12, 3, 'office',     '체스터톤스 속초 노마드오피스',   'P03-OF', '강원 속초시 엑스포로 109',           '033-552-7892', '좌석50,회의실,모니터', 'public/속초/속초웤1.png', 'public/속초/속초웤2.png', 'public/속초/속초웤3.png', NULL, '강원'),
(13, 3, 'attraction', '속초해수욕장',                  'P03-A1', '강원 속초시 해수욕장로',              NULL, NULL, 'attraction_p03_1.jpg', 'attraction_p03_2.jpg', 'attraction_p03_3.jpg', 'https://example.com/sc1', '강원'),
(14, 3, 'attraction', '영금정',                        'P03-A2', '강원 속초시 동명항길',                NULL, NULL, 'attraction_p03_4.jpg', 'attraction_p03_5.jpg', 'attraction_p03_6.jpg', 'https://example.com/sc2', '강원'),
(15, 3, 'attraction', '안목 커피거리',                  'P03-A3', '강원 강릉시 안목해변 일대',            NULL, NULL, 'attraction_p03_7.jpg', 'attraction_p03_8.jpg', 'attraction_p03_9.jpg', 'https://example.com/sc3', '강원'),

-- =======================
-- Program 4 (남해/경남)
-- =======================
(16, 4, 'stay',       '남해 지족 오션뷰 리조트',         'P04-ST', '경남 남해군 지족면 지족리 101-3',     '055-862-1234', '바다전망,조식,주차', 'public/남해지족/남해지족1.png', 'public/남해지족/남해지족2.png', 'public/남해지족/남해지족3.png', NULL, '경남'),
(17, 4, 'office',     '지족 어촌체험휴양마을 공유오피스','P04-OF', '경남 남해군 죽방로 24',               '055-862-5678', '회의실,라운지,프린터', 'public/남해지족/남해웤1.png', 'public/남해지족/남해웤2.png', 'public/남해지족/남해웤3.png', NULL, '경남'),
(18, 4, 'attraction', '독일마을',                        'P04-A1', '경남 남해군 삼동면',                   NULL, NULL, 'attraction_p04_1.jpg', 'attraction_p04_2.jpg', 'attraction_p04_3.jpg', 'https://example.com/nh1', '경남'),
(19, 4, 'attraction', '상주은모래비치',                  'P04-A2', '경남 남해군 상주면',                   NULL, NULL, 'attraction_p04_4.jpg', 'attraction_p04_5.jpg', 'attraction_p04_6.jpg', 'https://example.com/nh2', '경남'),
(20, 4, 'attraction', '다랭이마을',                      'P04-A3', '경남 남해군 남면',                     NULL, NULL, 'attraction_p04_7.jpg', 'attraction_p04_8.jpg', 'attraction_p04_9.jpg', 'https://example.com/nh3', '경남'),

-- =======================
-- Program 5 (인천)
-- =======================
(21, 5, 'stay',       '인천 포내 워케이션 호텔',         'P05-ST', '인천 강화군 길상면 포내리 230-8',     '032-441-9876', '업무책상,조식,미팅룸', 'public/인천포내/인천포내1.png', 'public/인천포내/인천포내2.png', 'public/인천포내/인천포내3.png', NULL, '인천'),
(22, 5, 'office',     '강화 코워킹 라운지',               'P05-OF', '인천 강화군 강화읍 중앙로',            '032-555-1212', '좌석30,회의실,모니터', 'public/인천포내/인천웤1.png', 'public/인천포내/인천웤2.png', 'public/인천포내/인천웤3.png', NULL, '인천'),
(23, 5, 'attraction', '강화도 루지',                      'P05-A1', '인천 강화군 길상면',                   NULL, NULL, 'attraction_p05_1.jpg', 'attraction_p05_2.jpg', 'attraction_p05_3.jpg', 'https://example.com/ic1', '인천'),
(24, 5, 'attraction', '전등사',                            'P05-A2', '인천 강화군 길상면',                   NULL, NULL, 'attraction_p05_4.jpg', 'attraction_p05_5.jpg', 'attraction_p05_6.jpg', 'https://example.com/ic2', '인천'),
(25, 5, 'attraction', '동막해변',                          'P05-A3', '인천 강화군 화도면',                   NULL, NULL, 'attraction_p05_7.jpg', 'attraction_p05_8.jpg', 'attraction_p05_9.jpg', 'https://example.com/ic3', '인천'),

-- =======================
-- Program 6 (오키나와/해외)
-- =======================
(26, 6, 'stay',       '오키나와 나하 비치 호텔',          'P06-ST', '일본 오키나와현 나하시 3-12-7',        '+81-98-123-4567', '수영장,레스토랑,와이파이', 'public/오키나와나하/나하1.png', 'public/오키나와나하/나하2.png', 'public/오키나와나하/나하3.png', NULL, '해외'),
(27, 6, 'office',     '나하 코워킹 스페이스',             'P06-OF', '일본 오키나와현 나하시 코쿠사이도리',  '+81-98-777-8888', '좌석40,회의실,폰부스', 'public/오키나와나하/나하웤1.png', 'public/오키나와나하/나하웤2.png', 'public/오키나와나하/나하웤3.png', NULL, '해외'),
(28, 6, 'attraction', '국제거리',                          'P06-A1', '일본 오키나와현 나하시 국제거리',       NULL, NULL, 'attraction_p06_1.jpg', 'attraction_p06_2.jpg', 'attraction_p06_3.jpg', 'https://example.com/ok1', '해외'),
(29, 6, 'attraction', '슈리성',                            'P06-A2', '일본 오키나와현 나하시',                NULL, NULL, 'attraction_p06_4.jpg', 'attraction_p06_5.jpg', 'attraction_p06_6.jpg', 'https://example.com/ok2', '해외'),
(30, 6, 'attraction', '만좌모',                            'P06-A3', '일본 오키나와현',                       NULL, NULL, 'attraction_p06_7.jpg', 'attraction_p06_8.jpg', 'attraction_p06_9.jpg', 'https://example.com/ok3', '해외'),

-- =======================
-- Program 7 (서울)
-- =======================
(31, 7, 'stay',       '서울 강남 비즈니스 호텔',          'P07-ST', '서울 강남구 테헤란로 311',              '02-123-4567', '조식,와이파이,업무책상', 'public/강남/강남1.png', 'public/강남/강남2.png', 'public/강남/강남3.png', NULL, '서울'),
(32, 7, 'office',     '강남 워크센터',                     'P07-OF', '서울 강남구 봉은사로 423',              '02-223-8899', '회의실,빔프로젝터,라운지', 'public/강남오피스/오피1.png', 'public/강남오피스/오피2.png', 'public/강남오피스/오피3.png', NULL, '서울'),
(33, 7, 'attraction', '청담 카페거리',                     'P07-A1', '서울 강남구 청담동 일대',               NULL, NULL, 'attraction10_1.jpg', 'attraction10_2.jpg', 'attraction10_3.jpg', 'https://example.com/se1', '서울'),
(34, 7, 'attraction', '코엑스',                             'P07-A2', '서울 강남구 영동대로',                  NULL, NULL, 'attraction_p07_4.jpg', 'attraction_p07_5.jpg', 'attraction_p07_6.jpg', 'https://example.com/se2', '서울'),
(35, 7, 'attraction', '선정릉',                             'P07-A3', '서울 강남구 선릉로',                    NULL, NULL, 'attraction_p07_7.jpg', 'attraction_p07_8.jpg', 'attraction_p07_9.jpg', 'https://example.com/se3', '서울'),

-- =======================
-- Program 8 (제주)
-- =======================
(36, 8, 'stay',       '제주 바다 전망 리조트',             'P08-ST', '제주 서귀포시 중문관광로 120',          '064-777-8888', '바다전망,수영장,스파', 'public/제주바다/제주1.png', 'public/제주바다/제주2.png', 'public/제주바다/제주3.png', NULL, '제주'),
(37, 8, 'office',     '제주 워케이션 센터',                'P08-OF', '제주 제주시 첨단로 33',                 '064-123-9090', '회의실,프린터,휴게실', 'public/제주바다/제주웤1.png', 'public/제주바다/제주웤2.png', 'public/제주바다/제주웤3.png', NULL, '제주'),
(38, 8, 'attraction', '용머리 해안',                       'P08-A1', '제주 서귀포시 안덕면',                  NULL, NULL, 'attraction11_1.jpg', 'attraction11_2.jpg', 'attraction11_3.jpg', 'https://example.com/jj1', '제주'),
(39, 8, 'attraction', '성산일출봉',                        'P08-A2', '제주 서귀포시 성산읍',                  NULL, NULL, 'attraction_p08_4.jpg', 'attraction_p08_5.jpg', 'attraction_p08_6.jpg', 'https://example.com/jj2', '제주'),
(40, 8, 'attraction', '협재해변',                          'P08-A3', '제주 제주시 한림읍',                    NULL, NULL, 'attraction_p08_7.jpg', 'attraction_p08_8.jpg', 'attraction_p08_9.jpg', 'https://example.com/jj3', '제주'),

-- =======================
-- Program 9 (여수/전남)
-- =======================
(41, 9, 'stay',       '여수 오션뷰 호텔',                  'P09-ST', '전남 여수시 바다로 77',                 '061-111-9898', '오션뷰,조식,와이파이', 'public/여수/여수1.png', 'public/여수/여수2.png', 'public/여수/여수3.png', NULL, '전남'),
(42, 9, 'office',     '여수 코워킹 오피스',                'P09-OF', '전남 여수시 중앙로 12',                 '061-222-9898', '좌석40,회의실,프린터', 'public/여수/여수웤1.png', 'public/여수/여수웤2.png', 'public/여수/여수웤3.png', NULL, '전남'),
(43, 9, 'attraction', '오동도',                            'P09-A1', '전남 여수시 오동도',                    NULL, NULL, 'attraction_p09_1.jpg', 'attraction_p09_2.jpg', 'attraction_p09_3.jpg', 'https://example.com/ys1', '전남'),
(44, 9, 'attraction', '여수 해상케이블카',                 'P09-A2', '전남 여수시 돌산',                      NULL, NULL, 'attraction_p09_4.jpg', 'attraction_p09_5.jpg', 'attraction_p09_6.jpg', 'https://example.com/ys2', '전남'),
(45, 9, 'attraction', '낭만포차거리',                      'P09-A3', '전남 여수시 종포해양공원',              NULL, NULL, 'attraction_p09_7.jpg', 'attraction_p09_8.jpg', 'attraction_p09_9.jpg', 'https://example.com/ys3', '전남'),

-- =======================
-- Program 10 (경주/경북)
-- =======================
(46, 10, 'stay',       '경주 한옥 스테이',                 'P10-ST', '경북 경주시 한옥길 10',                 '054-111-2222', '한옥,조식,정원', 'public/경주/경주1.png', 'public/경주/경주2.png', 'public/경주/경주3.png', NULL, '경북'),
(47, 10, 'office',     '경주 조용한 워크라운지',           'P10-OF', '경북 경주시 중앙로 88',                 '054-333-4444', '좌석25,회의실,모니터', 'public/경주/경주웤1.png', 'public/경주/경주웤2.png', 'public/경주/경주웤3.png', NULL, '경북'),
(48, 10, 'attraction', '불국사',                            'P10-A1', '경북 경주시 불국로',                    NULL, NULL, 'attraction_p10_1.jpg', 'attraction_p10_2.jpg', 'attraction_p10_3.jpg', 'https://example.com/gj1', '경북'),
(49, 10, 'attraction', '첨성대',                            'P10-A2', '경북 경주시 인왕동',                    NULL, NULL, 'attraction_p10_4.jpg', 'attraction_p10_5.jpg', 'attraction_p10_6.jpg', 'https://example.com/gj2', '경북'),
(50, 10, 'attraction', '황리단길',                          'P10-A3', '경북 경주시 황남동 일대',               NULL, NULL, 'attraction_p10_7.jpg', 'attraction_p10_8.jpg', 'attraction_p10_9.jpg', 'https://example.com/gj3', '경북'),

-- =======================
-- Program 11 (전주/전북)
-- =======================
(51, 11, 'stay',       '전주 한옥마을 스테이',             'P11-ST', '전북 전주시 완산구 한옥마을길',         '063-111-7777', '한옥,조식,정원', 'public/전주/전주1.png', 'public/전주/전주2.png', 'public/전주/전주3.png', NULL, '전북'),
(52, 11, 'office',     '전주 코워킹 스페이스',             'P11-OF', '전북 전주시 완산구 중앙로',             '063-222-7777', '좌석35,회의실,프린터', 'public/전주/전주웤1.png', 'public/전주/전주웤2.png', 'public/전주/전주웤3.png', NULL, '전북'),
(53, 11, 'attraction', '전주 한옥마을',                    'P11-A1', '전북 전주시 완산구',                    NULL, NULL, 'attraction_p11_1.jpg', 'attraction_p11_2.jpg', 'attraction_p11_3.jpg', 'https://example.com/jjz1', '전북'),
(54, 11, 'attraction', '전동성당',                          'P11-A2', '전북 전주시 완산구',                    NULL, NULL, 'attraction_p11_4.jpg', 'attraction_p11_5.jpg', 'attraction_p11_6.jpg', 'https://example.com/jjz2', '전북'),
(55, 11, 'attraction', '남부시장 야시장',                  'P11-A3', '전북 전주시 완산구',                    NULL, NULL, 'attraction_p11_7.jpg', 'attraction_p11_8.jpg', 'attraction_p11_9.jpg', 'https://example.com/jjz3', '전북'),

-- =======================
-- Program 12 (제천/충북)
-- =======================
(56, 12, 'stay',       '제천 숲속 로지',                    'P12-ST', '충북 제천시 숲길 21',                   '043-111-9090', '숲전망,조식,주차', 'public/제천/제천1.png', 'public/제천/제천2.png', 'public/제천/제천3.png', NULL, '충북'),
(57, 12, 'office',     '제천 집중 워크룸',                  'P12-OF', '충북 제천시 중앙로 55',                 '043-222-9090', '좌석20,폰부스,모니터', 'public/제천/제천웤1.png', 'public/제천/제천웤2.png', 'public/제천/제천웤3.png', NULL, '충북'),
(58, 12, 'attraction', '청풍호',                             'P12-A1', '충북 제천시 청풍면',                    NULL, NULL, 'attraction_p12_1.jpg', 'attraction_p12_2.jpg', 'attraction_p12_3.jpg', 'https://example.com/jc1', '충북'),
(59, 12, 'attraction', '의림지',                             'P12-A2', '충북 제천시 의림대로',                  NULL, NULL, 'attraction_p12_4.jpg', 'attraction_p12_5.jpg', 'attraction_p12_6.jpg', 'https://example.com/jc2', '충북'),
(60, 12, 'attraction', '월악산',                             'P12-A3', '충북 제천시 한수면',                    NULL, NULL, 'attraction_p12_7.jpg', 'attraction_p12_8.jpg', 'attraction_p12_9.jpg', 'https://example.com/jc3', '충북'),

-- =======================
-- Program 13 (대전/대전)
-- =======================
(61, 13, 'stay',       '대전 시티 호텔',                    'P13-ST', '대전 서구 둔산로 100',                  '042-111-3333', '조식,와이파이,헬스장', 'public/대전/대전1.png', 'public/대전/대전2.png', 'public/대전/대전3.png', NULL, '대전'),
(62, 13, 'office',     '대전 컨퍼런스 워크센터',            'P13-OF', '대전 서구 둔산중로 50',                 '042-222-3333', '회의실,빔프로젝터,라운지', 'public/대전/대전웤1.png', 'public/대전/대전웤2.png', 'public/대전/대전웤3.png', NULL, '대전'),
(63, 13, 'attraction', '한밭수목원',                         'P13-A1', '대전 서구 둔산대로',                    NULL, NULL, 'attraction_p13_1.jpg', 'attraction_p13_2.jpg', 'attraction_p13_3.jpg', 'https://example.com/dj1', '대전'),
(64, 13, 'attraction', '엑스포과학공원',                      'P13-A2', '대전 유성구',                           NULL, NULL, 'attraction_p13_4.jpg', 'attraction_p13_5.jpg', 'attraction_p13_6.jpg', 'https://example.com/dj2', '대전'),
(65, 13, 'attraction', '성심당',                              'P13-A3', '대전 중구',                             NULL, NULL, 'attraction_p13_7.jpg', 'attraction_p13_8.jpg', 'attraction_p13_9.jpg', 'https://example.com/dj3', '대전'),

-- =======================
-- Program 14 (광주/광주)
-- =======================
(66, 14, 'stay',       '광주 시티 스테이',                   'P14-ST', '광주 동구 문화로 88',                   '062-111-4444', '조식,와이파이,업무책상', 'public/광주/광주1.png', 'public/광주/광주2.png', 'public/광주/광주3.png', NULL, '광주'),
(67, 14, 'office',     '광주 코워킹 허브',                   'P14-OF', '광주 서구 상무대로 10',                 '062-222-4444', '좌석45,회의실,프린터', 'public/광주/광주웤1.png', 'public/광주/광주웤2.png', 'public/광주/광주웤3.png', NULL, '광주'),
(68, 14, 'attraction', '국립아시아문화전당',                 'P14-A1', '광주 동구 문화전당로',                  NULL, NULL, 'attraction_p14_1.jpg', 'attraction_p14_2.jpg', 'attraction_p14_3.jpg', 'https://example.com/gjz1', '광주'),
(69, 14, 'attraction', '양림동 펭귄마을',                    'P14-A2', '광주 남구 양림동',                      NULL, NULL, 'attraction_p14_4.jpg', 'attraction_p14_5.jpg', 'attraction_p14_6.jpg', 'https://example.com/gjz2', '광주'),
(70, 14, 'attraction', '무등산',                              'P14-A3', '광주 북구',                             NULL, NULL, 'attraction_p14_7.jpg', 'attraction_p14_8.jpg', 'attraction_p14_9.jpg', 'https://example.com/gjz3', '광주'),

-- =======================
-- Program 15 (울산/울산)
-- =======================
(71, 15, 'stay',       '울산 바다 근처 호텔',                'P15-ST', '울산 동구 바다로 12',                   '052-111-5555', '오션뷰,조식,와이파이', 'public/울산/울산1.png', 'public/울산/울산2.png', 'public/울산/울산3.png', NULL, '울산'),
(72, 15, 'office',     '울산 공유오피스 라운지',             'P15-OF', '울산 남구 삼산로 77',                   '052-222-5555', '좌석30,회의실,모니터', 'public/울산/울산웤1.png', 'public/울산/울산웤2.png', 'public/울산/울산웤3.png', NULL, '울산'),
(73, 15, 'attraction', '대왕암공원',                          'P15-A1', '울산 동구',                              NULL, NULL, 'attraction_p15_1.jpg', 'attraction_p15_2.jpg', 'attraction_p15_3.jpg', 'https://example.com/us1', '울산'),
(74, 15, 'attraction', '태화강 국가정원',                     'P15-A2', '울산 중구',                              NULL, NULL, 'attraction_p15_4.jpg', 'attraction_p15_5.jpg', 'attraction_p15_6.jpg', 'https://example.com/us2', '울산'),
(75, 15, 'attraction', '장생포 고래문화마을',                  'P15-A3', '울산 남구',                              NULL, NULL, 'attraction_p15_7.jpg', 'attraction_p15_8.jpg', 'attraction_p15_9.jpg', 'https://example.com/us3', '울산');


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

INSERT INTO tb_room (place_id, room_no, room_people, room_service, room_type)
VALUES
-- ===== Program 1 stay(1)
(1, 101, 2, '조식 포함, 오션뷰', 'economy'),
(1, 102, 2, '오션뷰, 업무책상', 'standard'),
(1, 201, 4, '가족룸, 테라스', 'superior'),
(1, 301, 6, '스위트, 라운지', 'superior'),


-- ===== Program 2 stay(6)
(6, 101, 2, '숲전망, 조식', 'economy'),
(6, 102, 2, '스파, 조식', 'standard'),
(6, 201, 4, '가족룸, 바비큐', 'superior'),
(6, 301, 6, '독채형, 거실 포함', 'superior'),


-- ===== Program 3 stay(11)
(11, 101, 2, '오션뷰, 조식', 'economy'),
(11, 102, 2, '오션뷰, 업무책상', 'standard'),
(11, 201, 4, '패밀리룸, 욕조', 'superior'),
(11, 301, 6, '스위트, 라운지', 'superior'),


-- ===== Program 4 stay(16)
(16, 101, 2, '바다전망, 조식', 'economy'),
(16, 102, 2, '테라스, 조식', 'standard'),
(16, 201, 4, '가족룸, 오션뷰', 'superior'),
(16, 301, 6, '스위트, 거실', 'superior'),


-- ===== Program 5 stay(21)
(21, 101, 2, '업무책상, 조식', 'economy'),
(21, 102, 2, '미팅룸 이용권', 'standard'),
(21, 201, 4, '패밀리룸', 'superior'),
(21, 301, 6, '스위트, 라운지', 'superior'),


-- ===== Program 6 stay(26)
(26, 101, 2, '오션뷰, 조식', 'economy'),
(26, 102, 2, '수영장 이용, 조식', 'standard'),
(26, 201, 4, '패밀리룸, 오션뷰', 'superior'),
(26, 301, 6, '스위트, 라운지', 'superior'),


-- ===== Program 7 stay(31)
(31, 101, 1, '싱글, 조식', 'economy'),
(31, 102, 2, '더블, 업무책상', 'standard'),
(31, 201, 4, '패밀리룸', 'superior'),
(31, 301, 6, '스위트, 라운지', 'superior'),


-- ===== Program 8 stay(36)
(36, 101, 2, '바다전망, 조식', 'economy'),
(36, 102, 2, '스파 이용, 조식', 'standard'),
(36, 201, 4, '패밀리룸, 오션뷰', 'superior'),
(36, 301, 6, '스위트, 라운지', 'superior'),


-- ===== Program 9 stay(41)
(41, 101, 2, '오션뷰, 조식', 'economy'),
(41, 102, 2, '오션뷰, 업무책상', 'standard'),
(41, 201, 4, '패밀리룸', 'superior'),
(41, 301, 6, '스위트', 'superior'),

-- ===== Program 10 stay(46)
(46, 101, 2, '한옥, 조식', 'economy'),
(46, 102, 2, '한옥, 마당뷰', 'standard'),
(46, 201, 4, '가족룸, 온돌', 'superior'),
(46, 301, 6, '독채형 한옥', 'superior'),


-- ===== Program 11 stay(51)
(51, 101, 2, '한옥, 조식', 'economy'),
(51, 102, 2, '한옥, 업무책상', 'standard'),
(51, 201, 4, '패밀리룸', 'superior'),
(51, 301, 6, '독채형', 'superior'),


-- ===== Program 12 stay(56)
(56, 101, 2, '숲전망, 조식', 'economy'),
(56, 102, 2, '숲전망, 업무책상', 'standard'),
(56, 201, 4, '패밀리룸', 'superior'),
(56, 301, 6, '스위트', 'superior'),

-- ===== Program 13 stay(61)
(61, 101, 1, '싱글, 조식', 'economy'),
(61, 102, 2, '더블, 업무책상', 'standard'),
(61, 201, 4, '패밀리룸', 'superior'),
(61, 301, 6, '스위트', 'superior'),

-- ===== Program 14 stay(66)
(66, 101, 1, '싱글, 조식', 'economy'),
(66, 102, 2, '더블, 업무책상', 'standard'),
(66, 201, 4, '패밀리룸', 'superior'),
(66, 301, 6, '스위트', 'superior'),


-- ===== Program 15 stay(71)
(71, 101, 2, '오션뷰, 조식', 'economy'),
(71, 102, 2, '오션뷰, 업무책상', 'standard'),
(71, 201, 4, '패밀리룸', 'superior'),
(71, 301, 6, '스위트', 'superior');



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