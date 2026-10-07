# RTM: จองคิวตรวจสุขภาพ (Booking)
อ้างอิง: spec.md Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-10-07 08:40 | test: 8 ผ่าน 0 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-BKG-01 | ไม่มี AC | T-02 | backend/app/slots/router.py: get_slots; backend/app/slots/service.py: list_available_slots | ไม่มี | ช่องโหว่ |
| FR-BKG-02 | AC-BKG-02 | T-04 | ไม่มีการตรวจซ้ำวันเดียวกันใน backend/app/booking/service.py: create_booking | ไม่มี | ยังไม่ถึง |
| FR-BKG-03 | AC-BKG-03 | T-05, T-11, T-12 | ไม่มี | ไม่มี | ยังไม่ถึง |
| FR-BKG-04 | AC-BKG-01 | T-03, T-06 | backend/app/booking/router.py: create_booking; backend/app/booking/service.py: create_booking | backend/tests/test_AC_BKG_01.py (ผ่าน) | รอ Q-xx |
| FR-BKG-05 | AC-BKG-04 | T-07 | ไม่มีคิวส่งข้อความ และไม่มีการส่งซ้ำใน backend/app/ | ไม่มี | ยังไม่ถึง |
| FR-BKG-06 | ไม่มี AC | ไม่มี task | backend/app/slots/router.py: get_slots; backend/app/slots/service.py: list_available_slots | ไม่มี | ช่องโหว่ |
| NFR-PERF-01 | AC-BKG-05 | T-02 | backend/app/slots/router.py: get_slots; backend/app/slots/service.py: list_available_slots | backend/tests/test_AC_BKG_05.py (ผ่าน) | ครบ |
| NFR-SEC-01 | ไม่มี AC | ไม่มี task | ไม่มี | ไม่มี | ยังไม่ถึง |
| NFR-REL-02 | AC-BKG-04 | T-07 | ไม่มี | ไม่มี | ยังไม่ถึง |
| NFR-USE-01 | ไม่มี AC | ไม่มี task | ไม่มี | ไม่มี | ยังไม่ถึง |
| CON-TECH-01 | ไม่มี AC | T-01 | backend/app/config.py: DATABASE_URL; backend/app/db/session.py: engine | backend/tests/test_T01_schema.py (ผ่าน) | ครบ |
| DOM-PDPA-01 | AC-BKG-06 | T-08 | ไม่มี middleware หรือการบันทึก audit log ใน backend/app/ | ไม่มี | ยังไม่ถึง |
| IF-IDP-01 | AC-BKG-01 | T-03 | backend/app/auth/idp.py: get_verified_hn | backend/tests/test_AC_BKG_01.py (ผ่าน) | ครบ |
| IF-HIS-01 | ไม่มี AC | T-09 | ไม่มี HIS client หรือการค้น HN ใน backend/app/ | ไม่มี | ยังไม่ถึง |
| IF-NOT-01 | AC-BKG-04 | T-07 | ไม่มีคิวส่งข้อความและไม่มีระบบ retry ใน backend/app/ | ไม่มี | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| backend/app/slots/service.py: list_available_slots | FR-BKG-01, FR-BKG-06 | ไม่ | ใช้ `DAYS_AHEAD = 14` ซึ่งไม่ตรงกับ "ภายใน 30 วันข้างหน้า" และกรอง `remaining > 0` จึงไม่แสดง slot เต็ม แม้ spec ระบุให้แสดงจำนวนที่นั่งคงเหลือของแต่ละช่วงเวลา |
| backend/app/booking/service.py: create_booking | FR-BKG-04, FR-BKG-02 | บางส่วน | บันทึกและตัดที่นั่งทำได้ แต่ยังไม่มีการป้องกันการจองซ้ำวันเดียวกัน และยังไม่มีการกำหนดรูปแบบ queue_no จนกว่าจะได้ Q-02 |
| backend/app/auth/idp.py: get_verified_hn | IF-IDP-01 | ใช่ | ตรวจ token รูปแบบ "Bearer verified:<HN>" และปฏิเสธเมื่อยังไม่ได้ยืนยันตัวตน |
| backend/app/config.py: DATABASE_URL และ backend/app/db/session.py: engine | CON-TECH-01 | ใช่ | ใช้ DATABASE_URL สำหรับ PostgreSQL ในระบบจริง และ test ใช้ SQLite ในหน่วยความจำ แต่ไม่ใช่การละเมิด requirement |
| backend/app/booking/router.py: create_booking | FR-BKG-04 | บางส่วน | คืน 201/409 ตาม AC-BKG-01 แต่ยังไม่มีการตอบกลับและข้อความสำหรับช่วงเต็มตาม FR-BKG-03 |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา (พร้อมเหตุผล 1 บรรทัด)

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | ตัวเลขไม่ตรง spec | backend/app/slots/service.py: list_available_slots | FR-BKG-01 | โค้ดตั้ง `DAYS_AHEAD = 14` แต่ spec ระบุภายใน 30 วันข้างหน้า โดยไม่มีกำหนดว่าควรย่อให้สั้นลง |  |
| F-002 | FR ไม่มี AC | specs/001-booking/spec.md | FR-BKG-06 | ความต้องการการคำนวณช่วงเวลาที่ว่างตามแพ็กเกจมีอยู่ แต่ไม่มี AC ที่ตรวจเรื่องนี้ ทำให้ความครอบคลุมของ requirement ต่ำ |  |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
