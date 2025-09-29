import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { baseStyles, renderContact, renderSection } from './base';
import { NormalizedPdfModel } from '../normalize';
import { PdfOptions } from '@/types/resume';

const compactStyles = StyleSheet.create({
  page: {
    ...baseStyles.page,
    padding: 60, // Tighter margins
  },
  header: {
    ...baseStyles.header,
    marginBottom: 16,
  },
  name: {
    ...baseStyles.name,
    fontSize: 16,
  },
  role: {
    ...baseStyles.role,
    fontSize: 11,
  },
  contact: {
    ...baseStyles.contact,
    fontSize: 9,
  },
  section: {
    ...baseStyles.section,
    marginBottom: 12,
  },
  sectionTitle: {
    ...baseStyles.sectionTitle,
    fontSize: 9,
    marginBottom: 4,
  },
  bulletItem: {
    ...baseStyles.bulletItem,
    fontSize: 9,
    marginBottom: 2,
  },
  period: {
    ...baseStyles.period,
    fontSize: 8,
  },
  subtitle: {
    ...baseStyles.subtitle,
    fontSize: 9,
  },
});

export function TemplateCompact({ 
  model, 
  options 
}: { 
  model: NormalizedPdfModel; 
  options: PdfOptions;
}) {
  const fontSize = options.fontSize || 10.5;
  const lineHeight = options.lineHeight || 1.2;
  const includeContact = options.includeContact !== false;

  return (
    <Document>
      <Page size="A4" style={[compactStyles.page, { fontSize, lineHeight }]}>
        {/* Header */}
        <View style={compactStyles.header}>
          <Text style={compactStyles.name}>{model.header.name}</Text>
          <Text style={compactStyles.role}>{model.header.role}</Text>
          {includeContact && (
            <View style={compactStyles.contact}>
              {model.header.contactLines.map((line, index) => (
                <Text key={index} style={{ marginHorizontal: 6 }}>
                  {line}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Sections */}
        {model.sections.map((section, index) => (
          <View key={index}>
            <View style={compactStyles.section}>
              <Text style={compactStyles.sectionTitle}>{section.title}</Text>
              {section.period && <Text style={compactStyles.period}>{section.period}</Text>}
              {section.subtitle && <Text style={compactStyles.subtitle}>{section.subtitle}</Text>}
              <View style={baseStyles.bulletList}>
                {section.bullets.map((bullet, bulletIndex) => (
                  <Text key={bulletIndex} style={compactStyles.bulletItem}>
                    • {bullet}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
}
