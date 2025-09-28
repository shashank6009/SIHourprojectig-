import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { baseStyles, renderContact, renderSection } from './base';
import { NormalizedPdfModel } from '../normalize';
import { PdfOptions } from '@/types/resume';

const modernStyles = StyleSheet.create({
  page: {
    ...baseStyles.page,
    padding: 72,
  },
  header: {
    ...baseStyles.header,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 16,
  },
  name: {
    ...baseStyles.name,
    fontSize: 20,
    marginBottom: 6,
  },
  role: {
    ...baseStyles.role,
    fontSize: 13,
    marginBottom: 10,
  },
  contact: {
    ...baseStyles.contact,
    fontSize: 10,
  },
  section: {
    ...baseStyles.section,
    marginBottom: 18,
  },
  sectionTitle: {
    ...baseStyles.sectionTitle,
    fontSize: 11,
    marginBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#CCCCCC',
    paddingBottom: 2,
  },
  bulletItem: {
    ...baseStyles.bulletItem,
    fontSize: 10,
    marginBottom: 4,
  },
  period: {
    ...baseStyles.period,
    fontSize: 9,
  },
  subtitle: {
    ...baseStyles.subtitle,
    fontSize: 10,
  },
});

export function TemplateModern({ 
  model, 
  options 
}: { 
  model: NormalizedPdfModel; 
  options: PdfOptions;
}) {
  const fontSize = options.fontSize || 12;
  const lineHeight = options.lineHeight || 1.3;
  const includeContact = options.includeContact !== false;

  return (
    <Document>
      <Page size="A4" style={[modernStyles.page, { fontSize, lineHeight }]}>
        {/* Header */}
        <View style={modernStyles.header}>
          <Text style={modernStyles.name}>{model.header.name}</Text>
          <Text style={modernStyles.role}>{model.header.role}</Text>
          {includeContact && (
            <View style={modernStyles.contact}>
              {model.header.contactLines.map((line, index) => (
                <Text key={index} style={{ marginHorizontal: 10 }}>
                  {line}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Sections */}
        {model.sections.map((section, index) => (
          <View key={index}>
            <View style={modernStyles.section}>
              <Text style={modernStyles.sectionTitle}>{section.title}</Text>
              {section.period && <Text style={modernStyles.period}>{section.period}</Text>}
              {section.subtitle && <Text style={modernStyles.subtitle}>{section.subtitle}</Text>}
              <View style={baseStyles.bulletList}>
                {section.bullets.map((bullet, bulletIndex) => (
                  <Text key={bulletIndex} style={modernStyles.bulletItem}>
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
