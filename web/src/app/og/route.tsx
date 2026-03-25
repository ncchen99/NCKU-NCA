import { ImageResponse } from "next/og";

export const runtime = "edge";

function shorten(text: string, max: number): string {
    return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const title = shorten(searchParams.get("title")?.trim() || "成功大學社團聯合會", 60);
    const subtitle = shorten(searchParams.get("subtitle")?.trim() || "NCKU NCA 官方平台", 36);
    const path = shorten(searchParams.get("path")?.trim() || "/", 42);

    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background:
                        "radial-gradient(1200px 600px at -10% -20%, #8a1b36 0%, transparent 50%), radial-gradient(900px 500px at 120% 130%, #2e0e16 10%, transparent 55%), linear-gradient(135deg, #510110 0%, #2a0008 100%)",
                    color: "#fff7f9",
                    padding: "68px 72px",
                    fontFamily:
                        "Inter, Noto Sans TC, PingFang TC, Microsoft JhengHei, sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        fontSize: 28,
                        letterSpacing: "0.08em",
                        opacity: 0.9,
                    }}
                >
                    <div
                        style={{
                            width: 56,
                            height: 2,
                            background: "#f6d7de",
                        }}
                    />
                    NCKU CLUB ASSOCIATION
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                    }}
                >
                    <div
                        style={{
                            fontSize: 74,
                            fontWeight: 800,
                            lineHeight: 1.1,
                            letterSpacing: "-0.03em",
                            maxWidth: "88%",
                        }}
                    >
                        {title}
                    </div>
                    <div
                        style={{
                            fontSize: 32,
                            opacity: 0.9,
                        }}
                    >
                        {subtitle}
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 26,
                        opacity: 0.88,
                    }}
                >
                    <div>nca.ncku.edu.tw</div>
                    <div>{path}</div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
