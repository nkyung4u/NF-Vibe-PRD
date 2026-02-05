"use client";

import { useState } from "react";

interface FeatureItem {
  name: string;
  description: string;
  priority: "🔴P0" | "🟡P1" | "🟢P2";
}

interface PRDForm {
  // 문서 개요
  projectName: string;
  author: string;
  status: "초안" | "검토 중" | "확정";

  // 배경 및 목적
  problemDefinition: string;
  planningIntent: string;
  kpi: string;

  // 사용자 및 시나리오
  targetUser: string;
  userStory: string;

  // 요구사항 상세
  features: FeatureItem[];
  policyNotes: string;

  // 사용자 경험
  wireframeLink: string;
  keyInteractions: string;

  // 예외 케이스 및 제약 사항
  emptyState: string;
  networkError: string;
  technicalConstraints: string;
}

const initialForm: PRDForm = {
  projectName: "",
  author: "",
  status: "초안",
  problemDefinition: "",
  planningIntent: "",
  kpi: "",
  targetUser: "",
  userStory: "",
  features: [{ name: "", description: "", priority: "P0" }],
  policyNotes: "",
  wireframeLink: "",
  keyInteractions: "",
  emptyState: "",
  networkError: "",
  technicalConstraints: "",
};

export default function Home() {
  const [form, setForm] = useState<PRDForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const updateField = <K extends keyof PRDForm>(
    key: K,
    value: PRDForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addFeature = () => {
    setForm((prev) => ({
      ...prev,
      features: [...prev.features, { name: "", description: "", priority: "P0" as const }],
    }));
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const updateFeature = (
    index: number,
    field: keyof FeatureItem,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.map((f, i) =>
        i === index ? { ...f, [field]: value } : f
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/submit-prd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({ success: true, message: "PRD가 노션에 성공적으로 저장되었습니다!" });
        setForm(initialForm);
      } else {
        setResult({
          success: false,
          message: data.error || "저장 중 오류가 발생했습니다.",
        });
      }
    } catch {
      setResult({
        success: false,
        message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="mx-auto max-w-[640px]">
        {/* 헤더 */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-toss-blue mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="white" fillOpacity="0.9"/>
              <path d="M14 2V8H20" fill="white" fillOpacity="0.5"/>
              <path d="M12 18V12M9 15H15" stroke="#0064FF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-[26px] font-bold text-toss-black tracking-tight">
            🌈 NF AIIT PRD 접수
          </h1>
          <p className="mt-1.5 text-[15px] text-toss-gray-500">
            양식을 작성하면 노션 데이터베이스에 자동으로 저장됩니다
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 문서 개요 */}
          <Section title="문서 개요" number={1}>
            <Field label="프로젝트명" required>
              <input
                type="text"
                required
                placeholder="예: AI 기반 챗봇 고객센터 고도화"
                value={form.projectName}
                onChange={(e) => updateField("projectName", e.target.value)}
                className="input-field"
              />
            </Field>
            <Field label="작성자/담당자" required>
              <input
                type="text"
                required
                placeholder="이름 입력"
                value={form.author}
                onChange={(e) => updateField("author", e.target.value)}
                className="input-field"
              />
            </Field>
            <Field label="현재 상태">
              <select
                value={form.status}
                onChange={(e) =>
                  updateField("status", e.target.value as PRDForm["status"])
                }
                className="input-field"
              >
                <option value="초안">초안</option>
                <option value="검토 중">검토 중</option>
                <option value="확정">확정</option>
              </select>
            </Field>
          </Section>

          {/* 배경 및 목적 */}
          <Section title="배경 및 목적" subtitle="The Why" number={2}>
            <Field label="문제 정의" required>
              <textarea
                required
                rows={3}
                placeholder="현재 사용자가 겪고 있는 불편함이나 비즈니스적 페인 포인트는 무엇인가?"
                value={form.problemDefinition}
                onChange={(e) =>
                  updateField("problemDefinition", e.target.value)
                }
                className="input-field"
              />
            </Field>
            <Field label="기획 의도" required>
              <textarea
                required
                rows={3}
                placeholder="이 기능을 통해 해결하려는 핵심 목표는 무엇인가?"
                value={form.planningIntent}
                onChange={(e) => updateField("planningIntent", e.target.value)}
                className="input-field"
              />
            </Field>
            <Field label="핵심 지표 (KPI)">
              <textarea
                rows={2}
                placeholder="예: 전환율 5% 상승, 문의 응대 시간 10분 단축 등"
                value={form.kpi}
                onChange={(e) => updateField("kpi", e.target.value)}
                className="input-field"
              />
            </Field>
          </Section>

          {/* 사용자 및 시나리오 */}
          <Section title="사용자 및 시나리오" subtitle="The Who & How" number={3}>
            <Field label="타겟 사용자" required>
              <textarea
                required
                rows={2}
                placeholder="이 기능을 주로 사용할 사람은 누구인가?"
                value={form.targetUser}
                onChange={(e) => updateField("targetUser", e.target.value)}
                className="input-field"
              />
            </Field>
            <Field label="사용자 스토리">
              <textarea
                rows={3}
                placeholder={`"사용자(Persona)는 [목표]를 위해 [기능]을 원한다."`}
                value={form.userStory}
                onChange={(e) => updateField("userStory", e.target.value)}
                className="input-field"
              />
            </Field>
          </Section>

          {/* 요구사항 상세 */}
          <Section title="요구사항 상세" subtitle="The What" number={4}>
            <div className="space-y-4">
              <label className="block text-[14px] font-semibold text-toss-gray-900">
                핵심 기능 리스트
              </label>
              {form.features.map((feature, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-toss-gray-200 bg-toss-gray-50 p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-toss-blue">
                      기능 {String.fromCharCode(65 + index)}
                    </span>
                    {form.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-[13px] text-toss-gray-400 hover:text-toss-red transition-colors"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="기능명"
                    value={feature.name}
                    onChange={(e) =>
                      updateFeature(index, "name", e.target.value)
                    }
                    className="input-field"
                  />
                  <textarea
                    rows={2}
                    placeholder="상세 설명 및 동작 방식"
                    value={feature.description}
                    onChange={(e) =>
                      updateFeature(index, "description", e.target.value)
                    }
                    className="input-field"
                  />
                  <select
                    value={feature.priority}
                    onChange={(e) =>
                      updateFeature(index, "priority", e.target.value)
                    }
                    className="input-field"
                  >
                    <option value="P0">P0: 필수</option>
                    <option value="P1">P1: 권장</option>
                    <option value="P2">P2: 추후 논의</option>
                  </select>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="w-full rounded-2xl border-2 border-dashed border-toss-gray-300 py-3.5 text-[14px] font-medium text-toss-gray-500 hover:border-toss-blue hover:text-toss-blue transition-colors"
              >
                + 기능 추가
              </button>
            </div>
            <Field label="정책 사항">
              <textarea
                rows={2}
                placeholder="예: 포인트 적립 예외 기준, 데이터 보관 주기 등"
                value={form.policyNotes}
                onChange={(e) => updateField("policyNotes", e.target.value)}
                className="input-field"
              />
            </Field>
          </Section>

          {/* 사용자 경험 */}
          <Section title="사용자 경험" subtitle="UX/UI" number={5}>
            <Field label="핵심 와이어프레임/플로우">
              <input
                type="text"
                placeholder="피그마 링크나 간단한 로직 다이어그램 URL"
                value={form.wireframeLink}
                onChange={(e) => updateField("wireframeLink", e.target.value)}
                className="input-field"
              />
            </Field>
            <Field label="주요 인터랙션">
              <textarea
                rows={3}
                placeholder="사용자가 버튼을 눌렀을 때 어떤 피드백이 있어야 하는가?"
                value={form.keyInteractions}
                onChange={(e) =>
                  updateField("keyInteractions", e.target.value)
                }
                className="input-field"
              />
            </Field>
          </Section>

          {/* 예외 케이스 및 제약 사항 */}
          <Section title="예외 케이스 및 제약 사항" number={6}>
            <Field label="Empty State 처리">
              <textarea
                rows={2}
                placeholder="데이터가 없을 때(Empty State) 노출 방식"
                value={form.emptyState}
                onChange={(e) => updateField("emptyState", e.target.value)}
                className="input-field"
              />
            </Field>
            <Field label="네트워크 오류 처리">
              <textarea
                rows={2}
                placeholder="네트워크 오류 시 처리 방법"
                value={form.networkError}
                onChange={(e) => updateField("networkError", e.target.value)}
                className="input-field"
              />
            </Field>
            <Field label="기술적 제약 사항">
              <textarea
                rows={2}
                placeholder="개발팀 확인 필요한 기술적 제약 사항"
                value={form.technicalConstraints}
                onChange={(e) =>
                  updateField("technicalConstraints", e.target.value)
                }
                className="input-field"
              />
            </Field>
          </Section>

          {/* 결과 메시지 */}
          {result && (
            <div
              className={`rounded-2xl p-4 text-[14px] font-medium ${
                result.success
                  ? "bg-toss-green-light text-toss-green"
                  : "bg-toss-red-light text-toss-red"
              }`}
            >
              {result.message}
            </div>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-toss-blue py-4 text-[16px] text-white font-bold hover:bg-toss-blue-hover active:scale-[0.98] disabled:bg-toss-gray-300 disabled:cursor-not-allowed transition-all duration-200"
          >
            {submitting ? "저장 중..." : "노션에 PRD 저장하기"}
          </button>
        </form>

        {/* 푸터 */}
        <p className="mt-8 mb-6 text-center text-[12px] text-toss-gray-400">
          Powered by Notion API
        </p>
      </div>
    </main>
  );
}

function Section({
  title,
  subtitle,
  number,
  children,
}: {
  title: string;
  subtitle?: string;
  number: number;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-toss-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-toss-gray-100">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-toss-blue text-white text-[13px] font-bold">
          {number}
        </span>
        <div>
          <h2 className="text-[17px] font-bold text-toss-black leading-tight">
            {title}
          </h2>
          {subtitle && (
            <span className="text-[12px] text-toss-gray-400 font-medium">
              {subtitle}
            </span>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[14px] font-semibold text-toss-gray-900">
        {label}
        {required && <span className="ml-1 text-toss-blue">*</span>}
      </label>
      {children}
    </div>
  );
}
