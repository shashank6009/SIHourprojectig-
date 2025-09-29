import React from 'react';
import { Document, Page, Text, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts (fallback to system fonts if custom fonts unavailable)
Font.register({
  family: 'Helvetica',
  src: 'https://fonts.gstatic.com/s/helvetica/v1/helvetica.ttf',
});

Font.register({
  family: 'Helvetica-Bold',
  src: 'https://fonts.gstatic.com/s/helvetica/v1/helvetica-bold.ttf',
});

// Styles for cover letter PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 72, // 1" margins
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.4,
    color: '#000000',
  },
  header: {
    marginBottom: 20,
  },
  date: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#666666',
    marginBottom: 20,
    textAlign: 'right',
  },
  recipient: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#000000',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#000000',
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#000000',
    marginBottom: 15,
    lineHeight: 1.4,
    textAlign: 'justify',
  },
  closing: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#000000',
    marginTop: 20,
    marginBottom: 5,
  },
  signature: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#000000',
    marginBottom: 5,
  },
  contact: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#666666',
  },
});

interface CoverLetterProps {
  text: string;
  meta?: {
    name?: string;
    contact?: {
      email?: string;
      phone?: string;
      linkedin?: string;
    };
  };
}

export function TemplateCoverLetter({ text, meta }: CoverLetterProps) {
  // Parse the cover letter text into paragraphs
  const paragraphs = text
    .split('\n\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  // Extract greeting and closing if present
  const greeting = paragraphs.find(p => 
    p.toLowerCase().includes('dear') || 
    p.toLowerCase().includes('hi ') ||
    p.toLowerCase().includes('hello')
  );
  
  const closing = paragraphs.find(p => 
    p.toLowerCase().includes('sincerely') || 
    p.toLowerCase().includes('best regards') ||
    p.toLowerCase().includes('thank you')
  );

  // Filter out greeting and closing from main paragraphs
  const mainParagraphs = paragraphs.filter(p => 
    p !== greeting && p !== closing
  );

  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Date */}
        <Text style={styles.date}>{currentDate}</Text>

        {/* Recipient placeholder */}
        <Text style={styles.recipient}>
          Hiring Manager{'\n'}
          [Company Name]{'\n'}
          [Company Address]
        </Text>

        {/* Greeting */}
        {greeting && (
          <Text style={styles.greeting}>{greeting}</Text>
        )}

        {/* Main paragraphs */}
        {mainParagraphs.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}

        {/* Closing */}
        {closing && (
          <>
            <Text style={styles.closing}>{closing}</Text>
            <Text style={styles.signature}>
              {meta?.name || '[Your Name]'}
            </Text>
            {meta?.contact && (
              <Text style={styles.contact}>
                {meta.contact.email && `${meta.contact.email} | `}
                {meta.contact.phone && `${meta.contact.phone} | `}
                {meta.contact.linkedin && meta.contact.linkedin}
              </Text>
            )}
          </>
        )}
      </Page>
    </Document>
  );
}

// Alternative simple template for basic cover letters
export function SimpleCoverLetter({ text, meta }: CoverLetterProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.date}>{currentDate}</Text>
        
        <Text style={styles.recipient}>
          Hiring Manager{'\n'}
          [Company Name]
        </Text>

        <Text style={styles.greeting}>Dear Hiring Manager,</Text>

        <Text style={styles.paragraph}>{text}</Text>

        <Text style={styles.closing}>Sincerely,</Text>
        <Text style={styles.signature}>
          {meta?.name || '[Your Name]'}
        </Text>
        {meta?.contact && (
          <Text style={styles.contact}>
            {meta.contact.email && `${meta.contact.email} | `}
            {meta.contact.phone && `${meta.contact.phone}`}
          </Text>
        )}
      </Page>
    </Document>
  );
}
