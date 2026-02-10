import { useRef } from 'react'
import Button from '../ui/Button'

interface CertificateProps {
  courseName: string
  userName: string
  completionDate: string
  courseId: string
}

function generateCertificateNumber(courseId: string, date: string): string {
  const hash = `${courseId}-${date}`.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0)
  }, 0)
  return `CERT-${Math.abs(hash).toString(16).toUpperCase().slice(0, 8)}`
}

export default function Certificate({ courseName, userName, completionDate, courseId }: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null)
  const certNumber = generateCertificateNumber(courseId, completionDate)

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    window.print()
  }

  return (
    <div className="certificate-wrapper">
      <div ref={certificateRef} className="certificate-container">
        <div className="certificate-border">
          <svg className="border-decoration" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
            {/* Outer decorative border */}
            <rect x="20" y="20" width="760" height="560" fill="none" stroke="#29264c" strokeWidth="3" />
            <rect x="30" y="30" width="740" height="540" fill="none" stroke="#32c2a2" strokeWidth="2" />
            <rect x="35" y="35" width="730" height="530" fill="none" stroke="#29264c" strokeWidth="1" />

            {/* Corner decorations */}
            <circle cx="50" cy="50" r="8" fill="#32c2a2" />
            <circle cx="750" cy="50" r="8" fill="#32c2a2" />
            <circle cx="50" cy="550" r="8" fill="#32c2a2" />
            <circle cx="750" cy="550" r="8" fill="#32c2a2" />

            {/* Top decoration */}
            <path d="M 380 60 Q 400 40 420 60" stroke="#29264c" strokeWidth="2" fill="none" />
            <circle cx="400" cy="50" r="5" fill="#32c2a2" />

            {/* Bottom seal decoration */}
            <circle cx="400" cy="530" r="25" fill="none" stroke="#29264c" strokeWidth="2" />
            <circle cx="400" cy="530" r="20" fill="none" stroke="#32c2a2" strokeWidth="1" />
            <path d="M 400 510 L 400 550" stroke="#29264c" strokeWidth="2" />
            <path d="M 380 530 L 420 530" stroke="#29264c" strokeWidth="2" />
          </svg>

          <div className="certificate-content">
            {/* Header */}
            <div className="certificate-header">
              <h1 className="certificate-title">수료증</h1>
              <div className="certificate-subtitle">Certificate of Completion</div>
            </div>

            {/* Recipient */}
            <div className="certificate-recipient">
              <div className="recipient-label">본 증서는 다음과 같이 수여합니다</div>
              <div className="recipient-name">{userName}</div>
            </div>

            {/* Course information */}
            <div className="certificate-course">
              <div className="course-label">다음 과정을 성공적으로 이수하였음을 증명합니다</div>
              <div className="course-name">{courseName}</div>
            </div>

            {/* Date and organization */}
            <div className="certificate-footer">
              <div className="completion-date">
                <div className="date-label">수료일자</div>
                <div className="date-value">{completionDate}</div>
              </div>

              <div className="organization">
                <div className="org-name">AI 학습 플랫폼</div>
                <div className="org-signature">AI Learning Platform</div>
              </div>
            </div>

            {/* Certificate number */}
            <div className="certificate-number">
              증서 번호: {certNumber}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons - hidden on print */}
      <div className="certificate-actions no-print">
        <Button onClick={handlePrint} size="lg">
          인쇄하기
        </Button>
        <Button onClick={handleDownload} size="lg" variant="outline">
          다운로드 (PDF)
        </Button>
      </div>

      <style>{`
        .certificate-wrapper {
          min-height: 100vh;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
        }

        .certificate-container {
          width: 100%;
          max-width: 900px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .certificate-border {
          position: relative;
          padding: 3rem;
        }

        .border-decoration {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .certificate-content {
          position: relative;
          z-index: 1;
          padding: 2rem;
          text-align: center;
        }

        .certificate-header {
          margin-bottom: 3rem;
        }

        .certificate-title {
          font-size: 3rem;
          font-weight: 700;
          color: #29264c;
          margin-bottom: 0.5rem;
          font-family: serif;
          letter-spacing: 0.05em;
        }

        .certificate-subtitle {
          font-size: 1.125rem;
          color: #6c757d;
          font-style: italic;
        }

        .certificate-recipient {
          margin-bottom: 2.5rem;
        }

        .recipient-label {
          font-size: 0.95rem;
          color: #6c757d;
          margin-bottom: 1rem;
        }

        .recipient-name {
          font-size: 2.5rem;
          font-weight: 700;
          color: #29264c;
          border-bottom: 2px solid #32c2a2;
          display: inline-block;
          padding: 0.5rem 2rem;
          font-family: serif;
        }

        .certificate-course {
          margin-bottom: 3rem;
        }

        .course-label {
          font-size: 0.95rem;
          color: #6c757d;
          margin-bottom: 1rem;
        }

        .course-name {
          font-size: 1.75rem;
          font-weight: 600;
          color: #29264c;
          line-height: 1.4;
          max-width: 600px;
          margin: 0 auto;
        }

        .certificate-footer {
          display: flex;
          justify-content: space-around;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #e9ecef;
        }

        .completion-date {
          text-align: center;
        }

        .date-label {
          font-size: 0.875rem;
          color: #6c757d;
          margin-bottom: 0.5rem;
        }

        .date-value {
          font-size: 1.125rem;
          color: #29264c;
          font-weight: 600;
        }

        .organization {
          text-align: center;
        }

        .org-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #29264c;
          margin-bottom: 0.25rem;
        }

        .org-signature {
          font-size: 0.875rem;
          color: #6c757d;
          font-style: italic;
        }

        .certificate-number {
          margin-top: 2rem;
          font-size: 0.75rem;
          color: #adb5bd;
          text-align: center;
          font-family: monospace;
        }

        .certificate-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        /* Print styles */
        @media print {
          .certificate-wrapper {
            padding: 0;
            background: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .certificate-container {
            max-width: 100%;
            box-shadow: none;
            border-radius: 0;
            margin: 0;
            page-break-inside: avoid;
          }

          .no-print {
            display: none !important;
          }

          .certificate-border {
            padding: 2rem;
          }

          .certificate-title {
            font-size: 2.5rem;
          }

          .recipient-name {
            font-size: 2rem;
          }

          .course-name {
            font-size: 1.5rem;
          }

          @page {
            size: A4 landscape;
            margin: 1cm;
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .certificate-border {
            padding: 1.5rem;
          }

          .certificate-content {
            padding: 1rem;
          }

          .certificate-title {
            font-size: 2rem;
          }

          .recipient-name {
            font-size: 1.75rem;
          }

          .course-name {
            font-size: 1.25rem;
          }

          .certificate-footer {
            flex-direction: column;
            gap: 2rem;
          }
        }
      `}</style>
    </div>
  )
}
