import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import type { Submission } from "@/lib/submissions";

const KIND_TITLE: Record<Submission["kind"], string> = {
  report: "Report ng problema sa tubig",
  connection: "Inquiry: bagong koneksyon",
  membership: "Inquiry: membership",
  loan: "Inquiry: loan",
  contact: "Mensahe mula sa website",
};

/** The email the cooperative's inbox receives for every form submission. */
export function SubmissionEmail({ submission }: { submission: Submission }) {
  const when = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    dateStyle: "full",
    timeStyle: "short",
  }).format(submission.submittedAt);

  return (
    <Html lang="fil">
      <Head />
      <Preview>{submission.subject}</Preview>
      <Body
        style={{
          backgroundColor: "#f4f6fc",
          fontFamily: "Arial, Helvetica, sans-serif",
          color: "#0f172a",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            margin: "24px auto",
            padding: "24px",
            maxWidth: "600px",
            borderTop: "6px solid #12309e",
          }}
        >
          <Heading
            as="h1"
            style={{ fontSize: "20px", color: "#12309e", margin: "0 0 4px" }}
          >
            {KIND_TITLE[submission.kind]}
          </Heading>
          <Text style={{ fontSize: "16px", margin: "0 0 16px" }}>
            Reference No.: <strong>{submission.reference}</strong>
          </Text>
          <Section>
            {submission.rows.map((row) => (
              <Row key={row.label} style={{ borderTop: "1px solid #d4daea" }}>
                <Column
                  style={{
                    width: "38%",
                    padding: "8px 8px 8px 0",
                    fontWeight: "bold",
                    verticalAlign: "top",
                    fontSize: "14px",
                  }}
                >
                  {row.label}
                </Column>
                <Column
                  style={{
                    padding: "8px 0",
                    verticalAlign: "top",
                    fontSize: "14px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {row.value || "—"}
                </Column>
              </Row>
            ))}
          </Section>
          <Hr style={{ borderColor: "#d4daea", margin: "16px 0" }} />
          <Text style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
            Ipinadala: {when} (oras sa Pilipinas)
            {submission.attachment ? " · May kalakip na larawan" : ""}
            <br />
            Mula sa form ng IWMPC website. Hindi ito naka-save sa website; ang
            email na ito ang tanging kopya.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
