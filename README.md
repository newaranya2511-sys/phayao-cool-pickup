# Phayao Cool Pickup

ขอไอเดียทำแอฟขายเครื่องปรับอากาศ saijo denki รุ่น pm 2.5 ขนาด 12,000 btu มีฟอกอากาศในตัว ด้วยระบบไฟฟ้า ต้องขายส่งให้กับช่างแอร์พื้นที่จังหวัดพะเยา มีคลังหลักในพะเยาให้ช่างมารับสินค้าเอง และชำระด้วยการโอนหรือสแกนจ่ายครับ เริ่มสร้างเว็บแอป โดยทำหน้าสั่งซื้อและบัตร Pickup QR Pass สำหรับรับสินค้าที่คลังพะเยาเป็นส่วนแรก

## Locked
- Visual Direction: Clean Aero. Palette: mint-green (#2ec4a0, soft #e3f8f1), sky-blue (#38b6e8), deep-teal (#0b6e7f), ink (#123238), ground (#f4fbfa), border-line (#cdeee4). Typography: IBM Plex Sans Thai, sans-serif. Radius: --r-card: 24px, --r-inner: 16px.
- App Icon: Clean air flow symbol with electrostatic spark in mint green and sky blue.
- Header & Navigation Shell: Clean Aero mobile header with back button, screen title and subtitle. Tab navigation: หน้าหลัก (home), สั่งซื้อ (order), รับของ (pickup), บัญชี (profile) with pill indicators.
- Design Rules: "ใช้ทิศทาง Clean Aero ในโทนฟ้า-เขียวมิ้นต์ เน้นความโปร่งสบายตา และเน้นจุดขายฟอกอากาศไฟฟ้า PM 2.5 ให้โดดเด่นเพื่อใช้พรีเซนต์ลูกค้าหน้างาน"
- Screen 1: สั่งซื้อด่วน - Clean Aero (order-clean-aero) on mobile (393x764).
  - Status banner: "📍 คลังหลักพะเยา (อ.เมือง) • พร้อมส่ง 28 เครื่อง (รับของได้ทันที)" in soft mint pill.
  - Hero Product: Saijo Denki Turbo A.P.S Inverter 12,000 BTU, tags: "ประหยัดไฟเบอร์ 5 สูงสุด", "R32 Inverter".
  - Special Customer-Showcase Card: "✨ ระบบฟอกอากาศไฟฟ้าดักฝุ่น PM 2.5 ละเอียด 0.01 ไมครอน" with 3 key points:
    1. ระบบกรองสนามไฟฟ้า Electrostatic ดักควันไฟป่า ละอองฝุ่น และเชื้อโรค
    2. ถอดล้างทำความสะอาดได้ตลอดอายุการใช้งาน ไม่ต้องเสียเงินซื้อไส้กรองเปลี่ยน
    3. เหมาะสำหรับห้องนอนและห้องพักผ่อนขนาด 16–20 ตร.ม.
  - Pricing & Profit: "ราคาส่งช่าง: ฿11,500" (ราคาแนะนำหน้าร้าน ฿16,900) with bright mint badge "กำไรช่าง ฿5,400".
  - Quantity Stepper: [- 1 +], bulk discount note: "สั่ง 3 เครื่องขึ้นไป เหลือเครื่องละ ฿11,300".
  - Pickup selection: Radio "🚗 รับเองที่คลังพะเยา (ซอยร่องห้า อ.เมือง) • คลังจัดเตรียมของรอทันที".
  - Payment options: "⚡ สแกน QR PromptPay (ตัดยอดอัตโนมัติ 0 นาที)" / "โอนเงินแนบสลิป".
  - Sticky Footer: "ยอดรวม: ฿11,500 (1 เครื่อง)" + Mint button "สแกน QR จ่ายเพื่อรับรหัสรับของ".
- Screen 2: บัตรรับของดิจิทัล - คลังพะเยา (pickup-pass-screen) on mobile (393x764).
  - Status: "🟢 พร้อมรับสินค้าทันที • สินค้าถูกล็อกและแพ็กเรียบร้อย".
  - Main Pickup QR Pass Card: Large scannable QR Code with pickup code "#PY-88219" and note "แสดงหน้าจอนี้ให้เจ้าหน้าที่คลังยิงสแกนเพื่อจ่ายของ".
  - Order details: "Saijo Denki Turbo A.P.S Inverter 12,000 BTU • 2 ชุด (คอยล์เย็น 2 + คอยล์ร้อน 2 รวม 4 กล่อง)" with "ชำระเงินเรียบร้อยแล้ว".
  - Warehouse card: "คลังหลักพะเยา (ถ.พหลโยธิน ใกล้แยกแม่ต๋ำ อ.เมือง)" with buttons "📍 นำทาง Google Maps" and "📞 ติดต่อคลังสินค้า".
  - 3-Step Pickup Guide: 1. ขับรถเข้าจุดรับสินค้าหน้าร้านคลังพะเยา, 2. เปิด QR นี้ให้เจ้าหน้าที่สแกนจ่ายเครื่อง, 3. ตรวจสอบ Serial Number และยกของขึ้นกระบะ.
  - Action button: "📤 ส่งต่อบัตรรับของให้ลูกน้องหรือคนขับรถมารับแทน".

## Open
- Interactive Order-to-Pickup flow: Pressing pay on the order screen opens an interactive PromptPay QR modal / slip upload simulator with realistic timer, confirming payment automatically into the Pickup Pass screen.
- Active orders tab & order history: Technicians can switch tabs between 'สั่งซื้อ' and 'รับของ' to see active pickup passes and completed pickups.
- Simulated Warehouse Staff mode toggle (e.g. a small test switch or button to "จำลองเจ้าหน้าที่คลังสแกนจ่ายของ") so the user can test marking orders as picked up.
- Responsive layout adapting to both mobile phone and desktop displays.
- Persistent state using browser storage so mock orders and stock numbers stay consistent during testing.

build a real working app, not a clickable prototype; the screen and kit files show layout, content and look (a wireframe's, structure only) and are never code to copy. The screens are the moments the user designed, not the whole product. Before building, walk through each flow as its user would and design what the pictures leave out, as a product designer would for this product: the steps a flow needs to finish and how the app responds to what the user does, including the moments its users will actually run into, like waiting on something or finding nothing yet. Add nothing a user of this product would never meet, and keep an app the user wants simple, simple. Never leave a step the product's core flows need as "coming soon", unless the brief says the user chose to. Where such a step needs an outside service, build every part up to it and say in your reply what's left to connect. Fill product gaps only, never a look the design set: an added step reuses the UI kit's tokens, chrome and parts and the nearest designed screen's layout, with no new visual direction. Look at every screen's picture before writing code; design.md says which picture or sheet holds each screen. Open the UI kit's shells and parts HTML for the header, tab bar, composer and components, not only its tokens. Use each finished screen's copy exactly as design.md lists it; never invent copy for one. A wireframe under design.md's Wireframes gives structure only: build it in the design's look, as design.md says. The screens' photos are placeholders for the mockups only: replace every photo design.md lists with the user's own upload for it, else as design.md says (a photo without people re-composed with imagegen--edit_image from it as a reference, a photo of people generated from its brief and never from the photo), and ship no set photo or its URL. For a design that came with no design.md, every photo on assets.lovable.dev or images.unsplash.com is a set photo: replace it with the user's own upload for it, else a new image generated for its slot, any person in it one who doesn't exist, never from the photo or a picture showing it. Build and check each screen at the canvas it was drawn at: phone 393×764, tablet landscape 1133×744, tablet portrait 744×1133, desktop 1280×832. After building, screenshot the app at those sizes and states, compare each finished screen with its picture, and fix every visual difference you didn't choose; check a wireframe's screen against its structure, never its grey look. End your reply with "Changed from the mockups": each deliberate change and why, and "Added beyond the mockups": each step, state or interaction you built that no screen shows.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://phayao-cool-pickup.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/45eeec89-b351-4bd5-b535-3497d9f8328c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
