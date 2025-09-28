import React from 'react';
import { StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts (fallback to system fonts if custom fonts unavailable)
Font.register({
  family: 'Helvetica',
  src: 'https://fonts.gstatic.com/s/helvetica/v1/helvetica.ttf',
});

Font.register({
  family: 'Helvetica-Bold',
  src: 'https://fonts.gstatic.com/s/helvetica/v1/helvetica-bold.ttf',
});

// Base styles for ATS-safe PDF generation
export const baseStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 72, // 1" margins
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.25,
    color: '#000000',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  name: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    color: '#000000',
  },
  role: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    marginBottom: 8,
    color: '#333333',
  },
  contact: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#666666',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  contactItem: {
    marginHorizontal: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bulletList: {
    marginLeft: 0,
  },
  bulletItem: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    marginBottom: 3,
    lineHeight: 1.2,
    color: '#000000',
  },
  bullet: {
    marginRight: 4,
  },
  period: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#666666',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
    marginBottom: 3,
  },
});

// Helper function to render contact information
export function renderContact(contactLines: string[]) {
  if (contactLines.length === 0) return null;
  
  return (
    <div style={baseStyles.contact}>
      {contactLines.map((line, index) => (
        <span key={index} style={baseStyles.contactItem}>
          {line}
        </span>
      ))}
    </div>
  );
}

// Helper function to render bullet points
export function renderBullets(bullets: string[]) {
  return (
    <div style={baseStyles.bulletList}>
      {bullets.map((bullet, index) => (
        <div key={index} style={baseStyles.bulletItem}>
          <span style={baseStyles.bullet}>•</span>
          {bullet.split('\n').map((line, lineIndex) => (
            <span key={lineIndex}>
              {lineIndex > 0 && '\n'}
              {line}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

// Helper function to render section
export function renderSection(
  title: string,
  bullets: string[],
  period?: string,
  subtitle?: string
) {
  return (
    <div style={baseStyles.section}>
      <div style={baseStyles.sectionTitle}>{title}</div>
      {period && <div style={baseStyles.period}>{period}</div>}
      {subtitle && <div style={baseStyles.subtitle}>{subtitle}</div>}
      {renderBullets(bullets)}
    </div>
  );
}
