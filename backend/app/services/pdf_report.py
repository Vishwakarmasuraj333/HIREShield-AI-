"""
PDF Assessment Report Generation Service for HireShield AI.
Uses ReportLab to construct professional, publication-grade risk dossiers.
"""
import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether
)

def generate_assessment_pdf(assessment_data: dict) -> bytes:
    """Generates an in-memory PDF binary stream for the given assessment data."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    CHARCOAL = colors.HexColor("#1A1D20")
    LIGHT_BG = colors.HexColor("#F8F9FA")
    BORDER_COLOR = colors.HexColor("#E5E7EB")
    
    # Severity Colors
    cat = assessment_data.get("risk_category", "LOW").upper()
    if cat == "CRITICAL":
        STATUS_COLOR = colors.HexColor("#DC2626")  # Red
        STATUS_BG = colors.HexColor("#FEE2E2")
    elif cat == "HIGH":
        STATUS_COLOR = colors.HexColor("#EA580C")  # Amber/Orange
        STATUS_BG = colors.HexColor("#FFEDD5")
    elif cat == "MODERATE":
        STATUS_COLOR = colors.HexColor("#D97706")  # Amber
        STATUS_BG = colors.HexColor("#FEF3C7")
    else:
        STATUS_COLOR = colors.HexColor("#059669")  # Emerald Green
        STATUS_BG = colors.HexColor("#D1FAE5")

    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=20,
        textColor=CHARCOAL,
        leading=24
    )
    
    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        textColor=colors.HexColor("#6B7280"),
        leading=14
    )

    h2_style = ParagraphStyle(
        "Heading2",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=13,
        textColor=CHARCOAL,
        leading=16,
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        textColor=CHARCOAL,
        leading=13
    )

    body_bold = ParagraphStyle(
        "BodyBold",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        textColor=CHARCOAL,
        leading=13
    )

    story = []

    # 1. Header Banner
    story.append(Paragraph("HIRESHIELD AI — RISK ASSESSMENT DOSSIER", title_style))
    story.append(Paragraph("Verify the opportunity. Understand the risk. Apply with confidence.", subtitle_style))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#10B981"), spaceBefore=2, spaceAfter=12))

    # 2. Executive Risk Summary Block
    risk_score = assessment_data.get("risk_score", 0.0)
    ml_prob = assessment_data.get("ml_probability", 0.0) * 100
    created_at = assessment_data.get("created_at", datetime.now().strftime("%Y-%m-%d %H:%M UTC"))

    summary_data = [
        [
            Paragraph(f"<b>Assessment ID:</b> {assessment_data.get('id', 'N/A')}", body_style),
            Paragraph(f"<b>Evaluated:</b> {str(created_at)[:19]}", body_style)
        ],
        [
            Paragraph(f"<b>Target Position:</b> {assessment_data.get('job_title', 'Untitled')}", body_style),
            Paragraph(f"<b>Company:</b> {assessment_data.get('company_name') or 'Undisclosed'}", body_style)
        ],
        [
            Paragraph(f"<b>Recruiter Contact:</b> {assessment_data.get('recruiter_email') or 'None Provided'}", body_style),
            Paragraph(f"<b>Model Engine:</b> {assessment_data.get('model_version', 'v1.0.0-emscad')}", body_style)
        ]
    ]
    summary_table = Table(summary_data, colWidths=[270, 270])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 12))

    # 3. Overall Risk Status Card
    risk_card_data = [
        [
            Paragraph(f"<font size='16'><b>RISK STATUS: {cat} RISK</b></font><br/><font size='10'>Calculated Severity Score: <b>{risk_score} / 100</b> | Calibrated ML Scam Probability: <b>{ml_prob:.1f}%</b></font>", ParagraphStyle("RiskBanner", parent=body_style, textColor=STATUS_COLOR, leading=18))
        ]
    ]
    risk_card_table = Table(risk_card_data, colWidths=[540])
    risk_card_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), STATUS_BG),
        ('BOX', (0, 0), (-1, -1), 1.5, STATUS_COLOR),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(risk_card_table)
    story.append(Spacer(1, 14))

    # 4. Detected Indicators Table
    story.append(Paragraph("Evidence-Based Risk Indicators", h2_style))
    indicators = assessment_data.get("indicators", [])
    if indicators:
        ind_table_data = [
            [
                Paragraph("<b>Severity</b>", body_bold),
                Paragraph("<b>Indicator & Finding</b>", body_bold),
                Paragraph("<b>Evidence Snippet</b>", body_bold)
            ]
        ]
        for ind in indicators:
            ind_sev = ind.get("severity", "LOW")
            ind_table_data.append([
                Paragraph(f"<b>{ind_sev}</b>", body_style),
                Paragraph(f"<b>{ind.get('title')}</b><br/>{ind.get('description')}", body_style),
                Paragraph(f"<i>{ind.get('evidence_snippet') or 'N/A'}</i>", body_style)
            ])
        ind_table = Table(ind_table_data, colWidths=[70, 270, 200])
        ind_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), LIGHT_BG),
            ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('VALIGN', (0, 0), (-1, -1), 'TOP')
        ]))
        story.append(ind_table)
    else:
        story.append(Paragraph("<i>No suspicious risk indicators detected.</i>", body_style))
    story.append(Spacer(1, 12))

    # 5. Reassuring / Positive Signals
    pos_signals = assessment_data.get("positive_signals", [])
    if pos_signals:
        story.append(Paragraph("Observed Positive / Reassuring Signals", h2_style))
        pos_items = [[Paragraph(f"✔  {sig}", body_style)] for sig in pos_signals]
        pos_table = Table(pos_items, colWidths=[540])
        pos_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F0FDF4")),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#BBF7D0")),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(pos_table)
        story.append(Spacer(1, 12))

    # 6. Recommended Verification Actions
    actions = assessment_data.get("recommended_actions", [])
    if actions:
        story.append(Paragraph("Recommended Verification Checklist", h2_style))
        action_items = [[Paragraph(f"•  {act}", body_style)] for act in actions]
        action_table = Table(action_items, colWidths=[540])
        action_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
            ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(action_table)
        story.append(Spacer(1, 14))

    # 7. Disclaimer
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceBefore=4, spaceAfter=8))
    story.append(Paragraph("<b>Academic Disclaimer:</b> " + assessment_data.get("disclaimer", ""), subtitle_style))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
