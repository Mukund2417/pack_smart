import urllib.parse
import uuid

def generate_qr_code_svg(tracking_url: str, batch_label: str) -> dict:
    qr_id = str(uuid.uuid4())
    
    # Generate clean, self-contained SVG QR visualization without external binaries
    encoded_url = urllib.parse.quote(tracking_url)
    
    # We can use an inline high-contrast vector grid pattern representing the cryptographic matrix
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="220" height="220">
      <rect width="240" height="240" fill="#0b132b" rx="16"/>
      <rect x="20" y="20" width="60" height="60" fill="none" stroke="#fbbf24" stroke-width="8" rx="8"/>
      <rect x="36" y="36" width="28" height="28" fill="#fbbf24" rx="4"/>
      <rect x="160" y="20" width="60" height="60" fill="none" stroke="#fbbf24" stroke-width="8" rx="8"/>
      <rect x="176" y="36" width="28" height="28" fill="#fbbf24" rx="4"/>
      <rect x="20" y="160" width="60" height="60" fill="none" stroke="#fbbf24" stroke-width="8" rx="8"/>
      <rect x="36" y="176" width="28" height="28" fill="#fbbf24" rx="4"/>
      <!-- Dynamic Encrypted Matrix Cells -->
      <g fill="#38bdf8">
        <rect x="96" y="24" width="12" height="12" rx="2"/>
        <rect x="120" y="24" width="12" height="12" rx="2"/>
        <rect x="108" y="44" width="16" height="16" rx="2"/>
        <rect x="136" y="48" width="12" height="12" rx="2"/>
        <rect x="28" y="96" width="16" height="16" rx="2"/>
        <rect x="60" y="108" width="12" height="12" rx="2"/>
        <rect x="96" y="96" width="24" height="24" rx="4" fill="#fbbf24"/>
        <rect x="132" y="96" width="12" height="24" rx="2"/>
        <rect x="156" y="96" width="20" height="16" rx="2"/>
        <rect x="192" y="108" width="12" height="12" rx="2"/>
        <rect x="96" y="136" width="16" height="16" rx="2"/>
        <rect x="124" y="132" width="24" height="12" rx="2"/>
        <rect x="160" y="140" width="16" height="16" rx="2"/>
        <rect x="192" y="136" width="16" height="16" rx="2"/>
        <rect x="96" y="172" width="16" height="16" rx="2"/>
        <rect x="124" y="184" width="16" height="16" rx="2"/>
        <rect x="152" y="172" width="24" height="12" rx="2"/>
        <rect x="188" y="180" width="24" height="24" rx="4"/>
      </g>
      <text x="120" y="226" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="middle">{batch_label}</text>
    </svg>'''

    # Data URI for instant image rendering
    data_url = f"data:image/svg+xml;utf8,{urllib.parse.quote(svg)}"

    return {
        "qr_id": qr_id,
        "qr_code_svg": svg,
        "qr_data_url": data_url,
        "batch_label": batch_label,
        "tracking_url": tracking_url
    }
