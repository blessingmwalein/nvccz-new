import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
  },
  header: {
    marginBottom: 25,
    borderBottomWidth: 2,
    borderBottomColor: "#10b981",
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1f2937",
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderRadius: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  label: {
    fontSize: 11,
    color: "#6b7280",
    width: "40%",
  },
  value: {
    fontSize: 11,
    color: "#1f2937",
    fontWeight: "bold",
    width: "60%",
    textAlign: "right",
  },
  textBlock: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.5,
    marginTop: 5,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: "31%",
    padding: 12,
    backgroundColor: "#f0fdf4",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10b981",
  },
  signatureSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: "#e5e7eb",
  },
  signatureGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    width: "48%",
    padding: 15,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  signatureTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 10,
  },
  signatureImage: {
    width: 150,
    height: 60,
    marginBottom: 8,
  },
  signatureDate: {
    fontSize: 9,
    color: "#6b7280",
  },
  signaturePlaceholder: {
    height: 60,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
    borderRadius: 4,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 9,
    color: "#9ca3af",
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 9,
    color: "#6b7280",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#10b981",
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "bold",
  },
})

interface TermSheetPDFProps {
  data: {
    id: string
    title: string
    version: string
    status: string
    investmentAmount: string
    equityPercentage: string
    valuation: string
    keyTerms: string
    conditions: string
    timeline: string
    isSigned: boolean
    signedAt: string | null
    createdAt: string
    applicantSignatureUrl?: string | null
    applicantSignedAt?: string | null
    investorSignatureUrl?: string | null
    investorSignedAt?: string | null
    application: {
      businessName: string
      applicantName: string
      applicantEmail: string
      requestedAmount: string
    }
    createdBy: {
      firstName: string
      lastName: string
      email: string
    }
  }
}

export default function TermSheetPDF({ data }: TermSheetPDFProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{data.title || "Term Sheet"}</Text>
          <Text style={styles.subtitle}>
            Version {data.version} • {data.application.businessName}
          </Text>
        </View>

        {/* Status Badge */}
        <View style={{ marginBottom: 20 }}>
          <View style={[styles.badge, { backgroundColor: data.isSigned ? "#10b981" : "#f59e0b" }]}>
            <Text style={styles.badgeText}>{data.isSigned ? "SIGNED" : data.status.toUpperCase()}</Text>
          </View>
        </View>

        {/* Key Investment Terms */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Investment Amount</Text>
            <Text style={styles.statValue}>{data.investmentAmount}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Equity Stake</Text>
            <Text style={styles.statValue}>{data.equityPercentage}%</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Valuation</Text>
            <Text style={styles.statValue}>{data.valuation}</Text>
          </View>
        </View>

        {/* Business Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Business Name</Text>
            <Text style={styles.value}>{data.application.businessName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Applicant</Text>
            <Text style={styles.value}>{data.application.applicantName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{data.application.applicantEmail}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Requested Amount</Text>
            <Text style={styles.value}>{data.application.requestedAmount}</Text>
          </View>
        </View>

        {/* Key Terms */}
        {data.keyTerms && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Terms</Text>
            <Text style={styles.textBlock}>{data.keyTerms}</Text>
          </View>
        )}

        {/* Conditions */}
        {data.conditions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conditions</Text>
            <Text style={styles.textBlock}>{data.conditions}</Text>
          </View>
        )}

        {/* Timeline */}
        {data.timeline && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Timeline</Text>
            <Text style={styles.textBlock}>{data.timeline}</Text>
          </View>
        )}

        {/* Signatures Section */}
        <View style={styles.signatureSection}>
          <Text style={[styles.sectionTitle, { marginBottom: 15 }]}>Signatures</Text>
          <View style={styles.signatureGrid}>
            {/* Applicant Signature */}
            <View style={styles.signatureBlock}>
              <Text style={styles.signatureTitle}>Applicant Signature</Text>
              {data.applicantSignatureUrl ? (
                <>
                  <Image src={data.applicantSignatureUrl || "/placeholder.svg"} style={styles.signatureImage} />
                  <Text style={styles.signatureDate}>Signed: {formatDateTime(data.applicantSignedAt)}</Text>
                </>
              ) : (
                <>
                  <View style={styles.signaturePlaceholder}>
                    <Text style={styles.placeholderText}>Not yet signed</Text>
                  </View>
                  <Text style={styles.signatureDate}>Awaiting signature</Text>
                </>
              )}
            </View>

            {/* Investor Signature */}
            <View style={styles.signatureBlock}>
              <Text style={styles.signatureTitle}>Investor Signature</Text>
              {data.investorSignatureUrl ? (
                <>
                  <Image src={data.investorSignatureUrl || "/placeholder.svg"} style={styles.signatureImage} />
                  <Text style={styles.signatureDate}>Signed: {formatDateTime(data.investorSignedAt)}</Text>
                </>
              ) : (
                <>
                  <View style={styles.signaturePlaceholder}>
                    <Text style={styles.placeholderText}>Not yet signed</Text>
                  </View>
                  <Text style={styles.signatureDate}>Awaiting signature</Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Generated on {formatDate(new Date().toISOString())}</Text>
          <Text style={styles.footerText}>
            Prepared by: {data.createdBy.firstName} {data.createdBy.lastName}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
