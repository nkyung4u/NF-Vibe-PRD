"use client";

import { useState } from "react";

interface FeatureItem {
  name: string;
  description: string;
  priority: "P0" | "P1" | "P2";
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
    <main className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            초간단 PRD 양식
          </h1>
          <p className="mt-2 text-gray-500">Lean PRD Template</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 문서 개요 */}
          <Section title="문서 개요">
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
          <Section title="배경 및 목적 (The Why)">
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
          <Section title="사용자 및 시나리오 (The Who & How)">
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
          <Section title="요구사항 상세 (The What)">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                핵심 기능 리스트
              </label>
              {form.features.map((feature, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-white p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      기능 {String.fromCharCode(65 + index)}
                    </span>
                    {form.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-sm text-red-500 hover:text-red-700"
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
                className="w-full rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
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
          <Section title="사용자 경험 (UX/UI)">
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
          <Section title="예외 케이스 및 제약 사항">
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
              className={`rounded-lg p-4 text-sm ${
                result.success
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {result.message}
            </div>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "저장 중..." : "노션에 PRD 저장하기"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
      <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">
        {title}
      </h2>
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
      <label className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
