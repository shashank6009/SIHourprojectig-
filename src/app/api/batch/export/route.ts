import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { trackEvent } from '@/lib/analytics';
import JSZip from 'jszip';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get('batchId');

    if (!batchId) {
      return NextResponse.json(
        { error: 'batchId parameter is required' },
        { status: 400 }
      );
    }

    // Verify batch exists and belongs to user
    const { data: batch, error: batchError } = await supabaseServer
      .from('resume_batches')
      .select('*')
      .eq('id', batchId)
      .single();

    if (batchError || !batch) {
      return NextResponse.json(
        { error: 'Batch not found' },
        { status: 404 }
      );
    }

    // Get completed batch items
    const { data: items, error: itemsError } = await supabaseServer
      .from('resume_batch_items')
      .select('*')
      .eq('batch_id', batchId)
      .eq('status', 'done')
      .order('created_at', { ascending: true });

    if (itemsError) {
      console.error('Error fetching batch items:', itemsError);
      return NextResponse.json(
        { error: 'Failed to fetch batch items' },
        { status: 500 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No completed items found in batch' },
        { status: 404 }
      );
    }

    // Create ZIP file
    const zip = new JSZip();
    const trackerData = [];

    // Process each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const company = item.company || 'Unknown';
      const role = item.role || 'Position';
      
      // Sanitize filenames
      const safeCompany = company.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
      const safeRole = role.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
      const folderName = `${i + 1}_${safeCompany}_${safeRole}`;

      // Add files to ZIP
      if (item.assets) {
        const assets = item.assets as Record<string, string>;

        // Add resume PDF
        if (assets.resumePdf) {
          try {
            const resumeResponse = await fetch(assets.resumePdf);
            if (resumeResponse.ok) {
              const resumeBuffer = await resumeResponse.arrayBuffer();
              zip.file(`${folderName}/resume.pdf`, resumeBuffer);
            }
          } catch (error) {
            console.warn(`Failed to fetch resume PDF for item ${item.id}:`, error);
          }
        }

        // Add cover letter PDF
        if (assets.coverPdf) {
          try {
            const coverResponse = await fetch(assets.coverPdf);
            if (coverResponse.ok) {
              const coverBuffer = await coverResponse.arrayBuffer();
              zip.file(`${folderName}/cover.pdf`, coverBuffer);
            }
          } catch (error) {
            console.warn(`Failed to fetch cover PDF for item ${item.id}:`, error);
          }
        }

        // Add email template
        if (assets.emailTxt) {
          zip.file(`${folderName}/email.txt`, assets.emailTxt);
        }

        // Add LinkedIn InMail template
        if (assets.inmailTxt) {
          zip.file(`${folderName}/inmail.txt`, assets.inmailTxt);
        }
      }

      // Add to tracker data
      trackerData.push({
        company: item.company || '',
        role: item.role || '',
        jd_url: item.jd_url || '',
        ats_score: item.ats_score || 0,
        resume_url: item.assets?.resumePdf || '',
        cover_url: item.assets?.coverPdf || '',
        email_path: `${folderName}/email.txt`,
        inmail_path: `${folderName}/inmail.txt`,
        status: item.status,
        outreach_status: item.assets?.trackerEvents?.slice(-1)[0]?.status || 'Not Started',
        updated_at: item.updated_at,
      });
    }

    // Create tracker CSV
    const csvHeaders = [
      'company',
      'role',
      'jd_url',
      'ats_score',
      'resume_url',
      'cover_url',
      'email_path',
      'inmail_path',
      'status',
      'outreach_status',
      'updated_at'
    ];

    const csvContent = [
      csvHeaders.join(','),
      ...trackerData.map(row => 
        csvHeaders.map(header => {
          const value = row[header as keyof typeof row] || '';
          // Escape CSV values
          return typeof value === 'string' && value.includes(',') 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    zip.file('tracker.csv', csvContent);

    // Generate ZIP buffer
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // Track batch export
    await trackEvent({
      userId: batch.user_id,
      event: 'BATCH_EXPORTED',
      metadata: {
        batchId: batch.id,
        itemCount: items.length,
        totalSize: zipBuffer.length,
      },
    });

    // Return ZIP file
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="batch_${batch.label.replace(/[^a-zA-Z0-9-]/g, '_')}_${new Date().toISOString().split('T')[0]}.zip"`,
        'Content-Length': zipBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error in batch export:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
