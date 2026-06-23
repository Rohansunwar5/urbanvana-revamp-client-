import { NextRequest, NextResponse } from "next/server"
import { sha256 } from "@/lib/analytics/hash"

const PIXEL_ID = process.env.META_PIXEL_ID!
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN!
const META_API_URL = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`

export async function POST(req: NextRequest) {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return NextResponse.json({ error: "CAPI not configured" }, { status: 503 })
  }

  try {
    const body = await req.json()
    const {
      eventName, eventId, value, currency, orderId,
      contentIds, contentType, contentName, numItems,
      userEmail, userPhone, userFirstName, userLastName, userZip,
    } = body

    const cookieHeader = req.headers.get("cookie") || ""
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [k, ...v] = c.trim().split("=")
        return [k, v.join("=")]
      })
    )
    const fbp = cookies["_fbp"]
    const fbc = cookies["_fbc"]

    const [em, ph, fn, ln, zp] = await Promise.all([
      userEmail     ? sha256(userEmail)                           : undefined,
      userPhone     ? sha256(userPhone.replace(/\D/g, ""))        : undefined,
      userFirstName ? sha256(userFirstName.toLowerCase().trim())  : undefined,
      userLastName  ? sha256(userLastName.toLowerCase().trim())   : undefined,
      userZip       ? sha256(userZip.trim())                      : undefined,
    ])

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      undefined
    const userAgent = req.headers.get("user-agent") || undefined

    const payload = {
      data: [
        {
          event_name:       eventName,
          event_time:       Math.floor(Date.now() / 1000),
          event_id:         eventId,
          action_source:    "website",
          event_source_url: req.headers.get("referer") || undefined,
          user_data: {
            ...(em        && { em }),
            ...(ph        && { ph }),
            ...(fn        && { fn }),
            ...(ln        && { ln }),
            ...(zp        && { zp }),
            ...(fbp       && { fbp }),
            ...(fbc       && { fbc }),
            ...(clientIp  && { client_ip_address: clientIp }),
            ...(userAgent && { client_user_agent: userAgent }),
          },
          custom_data: {
            ...(value      != null && { value }),
            ...(currency          && { currency }),
            ...(orderId           && { order_id: orderId }),
            ...(contentIds        && { content_ids: contentIds }),
            ...(contentType       && { content_type: contentType }),
            ...(contentName       && { content_name: contentName }),
            ...(numItems   != null && { num_items: numItems }),
          },
        },
      ],
      // Uncomment during testing, remove before go-live:
      // test_event_code: "TEST12345",
    }

    const response = await fetch(`${META_API_URL}?access_token=${ACCESS_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error("[CAPI Error]", result)
      return NextResponse.json({ error: result }, { status: 400 })
    }

    return NextResponse.json({ success: true, result })
  } catch (err) {
    console.error("[CAPI Exception]", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
