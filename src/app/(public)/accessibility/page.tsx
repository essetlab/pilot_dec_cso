import { TrustPage } from "@/components/public/TrustPage";

export default function AccessibilityPage() {
  return (
    <TrustPage
      badge="Accessibility"
      title="Accessibility and low-bandwidth intent"
      description="The pilot aims to provide practical, mobile-friendly learning pages with clear text, visible actions, and lightweight access wherever possible."
      sections={[
        {
          title: "Mobile-friendly learning",
          body: "Public pages, course overviews, and learner surfaces are designed to work on narrow screens so learners can use common mobile devices.",
        },
        {
          title: "Keyboard and focus support",
          body: "Interactive links, buttons, and forms should remain reachable and visible with keyboard focus. Learners should be able to understand the current action before submitting a form.",
        },
        {
          title: "Text-first and optional media",
          body: "Where practical, learning surfaces prioritize readable text, clear instructions, downloadable resources, and optional media rather than requiring heavy media for every step.",
        },
        {
          title: "Requesting help",
          body: "If you cannot access a page, launch a course, read content, or use a form, use the support channel shared by the programme team and describe the page, device, and issue.",
        },
      ]}
    />
  );
}
