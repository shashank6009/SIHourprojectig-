'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ReferralData {
  people: Array<{
    id: string;
    name: string;
    company?: string;
    role?: string;
    relationship?: string;
    strength: number;
  }>;
  companies: Array<{
    id: string;
    name: string;
    count: number;
  }>;
}

interface ReferralGraphProps {
  data: ReferralData;
  onNodeClick?: (node: any) => void;
}

export default function ReferralGraph({ data, onNodeClick }: ReferralGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.people.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // Create nodes
    const nodes = [
      ...data.people.map(person => ({
        id: person.id,
        name: person.name,
        company: person.company,
        type: 'person',
        strength: person.strength,
        relationship: person.relationship,
      })),
      ...data.companies.map(company => ({
        id: company.id,
        name: company.name,
        type: 'company',
        count: company.count,
      })),
    ];

    // Create links
    const links = data.people
      .filter(person => person.company)
      .map(person => ({
        source: person.id,
        target: data.companies.find(c => c.name === person.company)?.id || person.company,
      }))
      .filter(link => link.target);

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Create SVG
    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g');

    // Create links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2);

    // Create nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        if (onNodeClick) {
          onNodeClick(d);
        }
      });

    // Add circles for nodes
    node.append('circle')
      .attr('r', (d: any) => d.type === 'person' ? 8 + d.strength * 2 : 12)
      .attr('fill', (d: any) => d.type === 'person' ? '#3b82f6' : '#10b981')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add labels
    node.append('text')
      .attr('dx', 15)
      .attr('dy', 4)
      .attr('font-size', '12px')
      .attr('font-family', 'Arial, sans-serif')
      .text((d: any) => d.name)
      .style('pointer-events', 'none');

    // Add relationship indicators for people
    node.filter((d: any) => d.type === 'person' && d.relationship)
      .append('text')
      .attr('dx', 15)
      .attr('dy', 18)
      .attr('font-size', '10px')
      .attr('font-family', 'Arial, sans-serif')
      .attr('fill', '#666')
      .text((d: any) => d.relationship)
      .style('pointer-events', 'none');

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    return () => {
      simulation.stop();
    };
  }, [data, onNodeClick]);

  if (!data.people.length) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No referral data available. Import a CSV to get started.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>People ({data.people.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Companies ({data.companies.length})</span>
        </div>
      </div>
      <svg ref={svgRef} className="border rounded-lg bg-white"></svg>
    </div>
  );
}
