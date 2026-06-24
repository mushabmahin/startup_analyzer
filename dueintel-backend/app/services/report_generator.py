from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet


def generate_report(
    analysis,
    opinions,
    output_path
):

    doc = SimpleDocTemplate(output_path)

    styles = getSampleStyleSheet()

    story = []

    story.append(
        Paragraph(
            "VentureLens AI Due Diligence Report",
            styles["Title"]
        )
    )

    story.append(Spacer(1, 12))

    story.append(
        Paragraph(
            f"Startup: {analysis['startup_name']}",
            styles["Heading2"]
        )
    )

    story.append(Spacer(1, 10))

    sections = [
        ("Problem", analysis["problem"]),
        ("Solution", analysis["solution"]),
        ("Target Market", analysis["target_market"]),
        ("Revenue Model", analysis["revenue_model"]),
    ]

    for title, content in sections:

        story.append(
            Paragraph(
                title,
                styles["Heading3"]
            )
        )

        story.append(
            Paragraph(
                str(content),
                styles["BodyText"]
            )
        )

        story.append(Spacer(1, 8))

    story.append(
        Paragraph(
            "Scores",
            styles["Heading2"]
        )
    )

    score_text = f"""
    Market Score: {analysis['market_score']}<br/>
    Financial Score: {analysis['financial_score']}<br/>
    Team Score: {analysis['team_score']}<br/>
    Traction Score: {analysis['traction_score']}<br/>
    Overall Score: {analysis['overall_score']}<br/>
    Recommendation: {analysis['recommendation']}<br/>
    Risk Level: {analysis['risk_level']}
    """

    story.append(
        Paragraph(
            score_text,
            styles["BodyText"]
        )
    )

    story.append(Spacer(1, 10))

    story.append(
        Paragraph(
            "Investor Committee Opinions",
            styles["Heading2"]
        )
    )

    for role, opinion in opinions.items():

        story.append(
            Paragraph(
                role.replace("_", " ").title(),
                styles["Heading3"]
            )
        )

        story.append(
            Paragraph(
                opinion,
                styles["BodyText"]
            )
        )

        story.append(Spacer(1, 6))

    doc.build(story)

    return output_path