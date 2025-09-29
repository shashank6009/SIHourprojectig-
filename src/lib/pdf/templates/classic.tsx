import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { baseStyles, renderContact, renderSection } from './base';
import { NormalizedPdfModel } from '../normalize';
import { PdfOptions } from '@/types/resume';

export function TemplateClassic({ 
  model, 
  options 
}: { 
  model: NormalizedPdfModel; 
  options: PdfOptions;
}) {
  const fontSize = options.fontSize || 11;
  const lineHeight = options.lineHeight || 1.25;
  const includeContact = options.includeContact !== false;

  return (
    <Document>
      <Page size="A4" style={[baseStyles.page, { fontSize, lineHeight }]}>
        {/* Header */}
        <View style={baseStyles.header}>
          <Text style={baseStyles.name}>{model.header.name}</Text>
          <Text style={baseStyles.role}>{model.header.role}</Text>
          {includeContact && renderContact(model.header.contactLines)}
        </View>

        {/* Sections */}
        {model.sections.map((section, index) => (
          <View key={index}>
            {renderSection(section.title, section.bullets, section.period, section.subtitle)}
          </View>
        ))}
      </Page>
    </Document>
  );
}
