import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

interface FeatureItem {
  name: string;
  description: string;
  priority: string;
}

interface PRDPayload {
  projectName: string;
  author: string;
  status: string;
  problemDefinition: string;
  planningIntent: string;
  kpi: string;
  targetUser: string;
  userStory: string;
  features: FeatureItem[];
  policyNotes: string;
  wireframeLink: string;
  keyInteractions: string;
  emptyState: string;
  networkError: string;
  technicalConstraints: string;
}

export async function POST(request: Request) {
  const notionToken = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!notionToken || !databaseId) {
    return NextResponse.json(
      { error: "서버 환경변수가 설정되지 않았습니다. NOTION_API_KEY와 NOTION_DATABASE_ID를 확인해주세요." },
      { status: 500 }
    );
  }

  let body: PRDPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청 형식입니다." },
      { status: 400 }
    );
  }

  if (!body.projectName || !body.author || !body.problemDefinition || !body.planningIntent || !body.targetUser) {
    return NextResponse.json(
      { error: "필수 항목을 모두 입력해주세요. (프로젝트명, 작성자, 문제 정의, 기획 의도, 타겟 사용자)" },
      { status: 400 }
    );
  }

  const notion = new Client({ auth: notionToken });

  // 기능 리스트를 텍스트로 포맷
  const featuresText = body.features
    .filter((f) => f.name)
    .map(
      (f, i) =>
        `[${f.priority}] 기능 ${String.fromCharCode(65 + i)}: ${f.name}\n${f.description}`
    )
    .join("\n\n");

  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        "프로젝트명": {
          title: [{ text: { content: body.projectName } }],
        },
        "작성자": {
          rich_text: [{ text: { content: body.author } }],
        },
        "상태": {
          select: { name: body.status },
        },
        "작성일": {
          date: { start: new Date().toISOString().split("T")[0] },
        },
      },
      children: [
        heading2("배경 및 목적 (The Why)"),
        heading3("문제 정의"),
        paragraph(body.problemDefinition),
        heading3("기획 의도"),
        paragraph(body.planningIntent),
        ...(body.kpi
          ? [heading3("핵심 지표 (KPI)"), paragraph(body.kpi)]
          : []),

        divider(),
        heading2("사용자 및 시나리오 (The Who & How)"),
        heading3("타겟 사용자"),
        paragraph(body.targetUser),
        ...(body.userStory
          ? [heading3("사용자 스토리"), paragraph(body.userStory)]
          : []),

        divider(),
        heading2("요구사항 상세 (The What)"),
        heading3("핵심 기능 리스트"),
        paragraph(featuresText || "(미입력)"),
        ...(body.policyNotes
          ? [heading3("정책 사항"), paragraph(body.policyNotes)]
          : []),

        divider(),
        heading2("사용자 경험 (UX/UI)"),
        ...(body.wireframeLink
          ? [
              heading3("핵심 와이어프레임/플로우"),
              paragraph(body.wireframeLink),
            ]
          : []),
        ...(body.keyInteractions
          ? [heading3("주요 인터랙션"), paragraph(body.keyInteractions)]
          : []),

        divider(),
        heading2("예외 케이스 및 제약 사항"),
        ...(body.emptyState
          ? [heading3("Empty State 처리"), paragraph(body.emptyState)]
          : []),
        ...(body.networkError
          ? [heading3("네트워크 오류 처리"), paragraph(body.networkError)]
          : []),
        ...(body.technicalConstraints
          ? [
              heading3("기술적 제약 사항"),
              paragraph(body.technicalConstraints),
            ]
          : []),
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Notion API error:", error);
    const message =
      error instanceof Error ? error.message : "노션 API 호출 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// --- Notion block helpers ---

function heading2(text: string) {
  return {
    object: "block" as const,
    type: "heading_2" as const,
    heading_2: {
      rich_text: [{ type: "text" as const, text: { content: text } }],
    },
  };
}

function heading3(text: string) {
  return {
    object: "block" as const,
    type: "heading_3" as const,
    heading_3: {
      rich_text: [{ type: "text" as const, text: { content: text } }],
    },
  };
}

function paragraph(text: string) {
  // Notion API limits rich_text content to 2000 characters per chunk
  const chunks: { type: "text"; text: { content: string } }[] = [];
  for (let i = 0; i < text.length; i += 2000) {
    chunks.push({
      type: "text" as const,
      text: { content: text.slice(i, i + 2000) },
    });
  }
  if (chunks.length === 0) {
    chunks.push({ type: "text" as const, text: { content: "" } });
  }
  return {
    object: "block" as const,
    type: "paragraph" as const,
    paragraph: { rich_text: chunks },
  };
}

function divider() {
  return {
    object: "block" as const,
    type: "divider" as const,
    divider: {},
  };
}
