import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client.js'

// Supports FR-BKG-01 and FR-BKG-06
export default function SlotPicker() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [packageCode, setPackageCode] = useState('STANDARD')
  const [dateFrom, setDateFrom] = useState(today)
  const [slots, setSlots] = useState([])
  const [selectedSlotId, setSelectedSlotId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let ignore = false

    const loadSlots = async () => {
      setLoading(true)
      const response = await api.getSlots({ dateFrom, packageCode })
      if (!ignore) {
        setSlots(response.items ?? [])
        setSelectedSlotId((current) => (
          response.items?.some((slot) => slot.id === current) ? current : null
        ))
      }
      setLoading(false)
    }

    loadSlots()
    return () => {
      ignore = true
    }
  }, [dateFrom, packageCode])

  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-700">Booking</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">เลือกวันและช่วงเวลาตรวจ</h2>
        </div>
        <div className="flex gap-3">
          <label className="flex flex-col text-sm font-medium text-slate-700">
            แพ็กเกจ
            <select
              value={packageCode}
              onChange={(event) => setPackageCode(event.target.value)}
              className="mt-1 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-500"
            >
              <option value="STANDARD">Standard</option>
              <option value="PREMIUM">Premium</option>
            </select>
          </label>

          <label className="flex flex-col text-sm font-medium text-slate-700">
            วันที่
            <input
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
              className="mt-1 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-500"
            />
          </label>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">กำลังโหลดช่วงเวลาว่าง...</p>
      ) : slots.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          ไม่มีช่วงเวลาว่างสำหรับแพ็กเกจนี้ในวันที่เลือก
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {slots.map((slot) => {
            const isSelected = selectedSlotId === slot.id
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedSlotId(slot.id)}
                className={[
                  'rounded-2xl border p-4 text-left transition',
                  isSelected
                    ? 'border-teal-500 bg-teal-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300',
                ].join(' ')}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-slate-900">{slot.label}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                    {slot.remaining} ที่ว่าง
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{slot.dateLabel}</p>
              </button>
            )
          })}
        </div>
      )}

      {selectedSlotId !== null && (
        <div className="mt-6 rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
          ช่วงที่เลือก: {slots.find((slot) => slot.id === selectedSlotId)?.label ?? '—'}
        </div>
      )}
    </section>
  )
}
