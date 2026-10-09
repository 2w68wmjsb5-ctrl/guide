import io
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

A4_W, A4_H = A4  # points

INK = (0x0B/255, 0x0C/255, 0x0E/255)
ACCENT = (0xE8/255, 0x79/255, 0x2F/255)
TEXT_MUTED_LIGHT_PAGE = (0x5A/255, 0x5C/255, 0x63/255)
TEXT_MUTED_DARK_PAGE = (0x9C/255, 0xA0/255, 0xA8/255)

pdfmetrics.registerFont(TTFont("BarlowCondensed-Bold", "fonts/BarlowCondensed-Bold.ttf"))
pdfmetrics.registerFont(TTFont("BarlowCondensed-SemiBold", "fonts/BarlowCondensed-SemiBold.ttf"))

dark = PdfReader("dark.pdf")
light = [PdfReader(f"light-{i}.pdf") for i in range(1, 8)]

def add_light(seq, reader):
    for i in range(len(reader.pages)):
        seq.append((reader, i, False))

# dark.pdf: 0 cover, 1 vorwort, 2..6 chapter dividers 01-05, 7 closing
# light-1 TOC, light-2..6 chapters 01-05, light-7 appendix
sequence = []
sequence.append((dark, 0, True))
sequence.append((dark, 1, True))
add_light(sequence, light[0])
for ch in range(5):
    sequence.append((dark, 2 + ch, True))
    add_light(sequence, light[1 + ch])
add_light(sequence, light[6])
sequence.append((dark, 7, True))

total = len(sequence)
print("Total pages:", total)

writer = PdfWriter()
for src, idx, is_dark in sequence:
    writer.add_page(src.pages[idx])

overlay_buf = io.BytesIO()
c = canvas.Canvas(overlay_buf, pagesize=A4)

margin_x = 18 * 2.83465  # 18mm in points
bottom_y = 12 * 2.83465  # 12mm in points

for page_num, (src, idx, is_dark) in enumerate(sequence, start=1):
    if is_dark:
        text_color = TEXT_MUTED_DARK_PAGE
        brand_color = (1, 1, 1)
    else:
        text_color = TEXT_MUTED_LIGHT_PAGE
        brand_color = INK

    c.setFont("BarlowCondensed-Bold", 9.5)
    c.setFillColorRGB(*brand_color)
    c.drawString(margin_x, bottom_y, "PATTO")
    brand_w = c.stringWidth("PATTO", "BarlowCondensed-Bold", 9.5)

    c.setFont("BarlowCondensed-SemiBold", 9.5)
    c.setFillColorRGB(*text_color)
    c.drawString(margin_x + brand_w + 4, bottom_y, "·  MUAY THAI STRENGTH & CONDITIONING")

    c.setFont("BarlowCondensed-SemiBold", 9.5)
    c.setFillColorRGB(*text_color)
    num_text = str(page_num).zfill(2)
    num_w = c.stringWidth(num_text, "BarlowCondensed-SemiBold", 9.5)
    c.drawString(A4_W - margin_x - num_w, bottom_y, num_text)

    c.showPage()

c.save()
overlay_buf.seek(0)
overlay_reader = PdfReader(overlay_buf)

for i, page in enumerate(writer.pages):
    page.merge_page(overlay_reader.pages[i])

with open("PATTO_Muay_Thai_Strength_Conditioning.pdf", "wb") as f:
    writer.write(f)

print("done ->  PATTO_Muay_Thai_Strength_Conditioning.pdf")
