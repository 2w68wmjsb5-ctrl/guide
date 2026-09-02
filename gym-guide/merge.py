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
l1 = PdfReader("light-1.pdf")
l2 = PdfReader("light-2.pdf")
l3 = PdfReader("light-3.pdf")
l4 = PdfReader("light-4.pdf")

sequence = []
sequence.append((dark, 0, True))    # cover
sequence.append((dark, 1, True))    # vorwort
for i in range(len(l1.pages)):
    sequence.append((l1, i, False))
sequence.append((dark, 2, True))    # vorbereitung divider
for i in range(len(l2.pages)):
    sequence.append((l2, i, False))
sequence.append((dark, 3, True))    # regionen divider
for i in range(len(l3.pages)):
    sequence.append((l3, i, False))
for i in range(len(l4.pages)):
    sequence.append((l4, i, False))
sequence.append((dark, 4, True))    # closing

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
    c.drawString(margin_x + brand_w + 4, bottom_y, "·  MUAY THAI GYM GUIDE")

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

with open("PATTO_Muay_Thai_Gym_Guide.pdf", "wb") as f:
    writer.write(f)

print("done ->  PATTO_Muay_Thai_Gym_Guide.pdf")
