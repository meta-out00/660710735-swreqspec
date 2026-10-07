# test ของ T-03: จองคิวสำเร็จ
# AC-BKG-01 (FR-BKG-04)
from app.db.models import Booking, Slot
from tests.conftest import AUTH


def test_AC_BKG_01(client, make_slot):
    """AC-BKG-01: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง จองแล้วต้องสำเร็จ"""
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201


def test_TC_BKG_01_1_booking_success(client, db, make_slot):
    # Given: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    # When: ยืนยันการจอง
    # Then: บันทึกสำเร็จ, แสดงหมายเลขคิว, และที่นั่งว่างของช่วงนั้นเป็น 0
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201
    body = res.json()
    assert body["slot_id"] == slot.id
    assert body["queue_no"]
    assert db.get(Slot, slot.id).remaining == 0
    assert db.query(Booking).count() == 1


def test_TC_BKG_01_2_booking_boundary_full_slot(client, db, make_slot):
    # Given: ยืนยันตัวตนแล้ว และช่วง 09.00 น. เหลือ 0 ที่ (มีคนจองเต็มแล้ว)
    # When: ยืนยันการจองช่วง 09.00 น.
    # Then: ปฏิเสธ, ไม่มีการจองใหม่, และที่นั่งว่างยังเป็น 0 ไม่ติดลบ
    slot = make_slot(start="09:00", remaining=0)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 409
    assert res.json()["detail"] == "ช่วงเวลาเต็ม"
    assert db.query(Booking).count() == 0
    assert db.get(Slot, slot.id).remaining == 0


def test_TC_BKG_01_3_booking_rejects_unverified_user(client, db, make_slot):
    # Given: ผู้รับบริการยังไม่ได้ยืนยันตัวตนหรือผลยืนยันตัวตนไม่ผ่าน และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    # When: พยายามยืนยันการจอง
    # Then: ระบบต้องปฏิเสธการจอง, ไม่บันทึกรายการใหม่, ไม่แสดงหมายเลขคิว, และ remaining ของช่วงนั้นยังคง 1
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id})

    assert res.status_code == 401
    assert res.json()["detail"] == "ยังไม่ได้ยืนยันตัวตน"
    assert db.query(Booking).count() == 0
    assert db.get(Slot, slot.id).remaining == 1
