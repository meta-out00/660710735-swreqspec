import SlotPicker from './pages/SlotPicker.jsx'

// Home page for booking flow
export default function App() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-teal-800">ระบบจองคิวตรวจสุขภาพ</h1>
          <p className="mt-2 text-slate-600">
            เลือกแพ็กเกจ วัน และช่วงเวลาที่ต้องการตรวจสุขภาพ
          </p>
        </header>

        <SlotPicker />
      </div>
    </main>
  )
}
