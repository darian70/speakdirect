from typing import Optional


def build_update_script(
    *,
    shop_name: str,
    customer_name: str,
    vehicle_year: Optional[int] = None,
    vehicle_make: Optional[str] = None,
    vehicle_model: Optional[str] = None,
    status: Optional[str] = None,
    summary: Optional[str] = None,
    cost: Optional[float] = None,
    needs_approval: bool = False,
    locale: str = "en",
    include_recording_notice: bool = True,
) -> str:
    parts = []

    if include_recording_notice:
        parts.append(
            "This is an automated update call from {shop}. This call may be recorded for quality."
            .format(shop=shop_name)
        )
    else:
        parts.append("This is an automated update call from {shop}.".format(shop=shop_name))

    vehicle = ""
    if vehicle_year or vehicle_make or vehicle_model:
        vehicle = " about your {year} {make} {model}".format(
            year=vehicle_year or "",
            make=vehicle_make or "",
            model=vehicle_model or "",
        ).strip()

    if status:
        parts.append(f"We have an update{vehicle}: status is {status}.")

    if summary:
        parts.append(summary)

    if cost is not None:
        parts.append(f"The estimated cost is {cost:.2f} dollars.")

    if needs_approval:
        parts.append(
            "To approve this work now, press 1 during the call. To decline, press 2. To have a person call you back, press 3."
        )
    else:
        parts.append("No action is needed. We'll proceed and update you when ready.")

    parts.append("Thank you from {shop}.".format(shop=shop_name))

    # Keep the script short and natural
    text = " ".join([p.strip() for p in parts if p and p.strip()])
    return text


def build_appt_reminder_script(
    *,
    shop_name: str,
    customer_name: str,
    starts_at_text: str,
    location: Optional[str] = None,
    include_recording_notice: bool = True,
) -> str:
    parts = []

    if include_recording_notice:
        parts.append(
            "This is an automated appointment reminder from {shop}. This call may be recorded for quality."
            .format(shop=shop_name)
        )
    else:
        parts.append("This is an automated appointment reminder from {shop}.".format(shop=shop_name))

    loc = f" at {location}" if location else ""
    parts.append(f"Your appointment is scheduled for {starts_at_text}{loc}.")
    parts.append(
        "To confirm, press 1. To request a different time, press 2. To speak to a person, press 3."
    )
    parts.append("Thank you from {shop}.".format(shop=shop_name))

    return " ".join([p.strip() for p in parts if p and p.strip()])
