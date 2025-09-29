import { supabaseServer } from '@/lib/supabase-server';
import { format, subDays, parseISO } from 'date-fns';

export interface RollupResult {
  day: string;
  users: number;
  totalEvents: number;
  avgAtsScore: number;
  exportConversion: number;
}

/**
 * Roll up daily metrics from raw events
 * This function aggregates events into daily metrics for faster analytics queries
 */
export async function rollupMetricsForDay(dayISO?: string): Promise<RollupResult> {
  try {
    const targetDay = dayISO ? parseISO(dayISO) : subDays(new Date(), 1);
    const dayStr = format(targetDay, 'yyyy-MM-dd');
    const startOfDay = `${dayStr}T00:00:00.000Z`;
    const endOfDay = `${dayStr}T23:59:59.999Z`;

    console.log(`Rolling up metrics for ${dayStr}`);

    // Get all events for the day
    const { data: events, error: eventsError } = await supabaseServer
      .from('resume_events')
      .select('*')
      .gte('created_at', startOfDay)
      .lte('created_at', endOfDay);

    if (eventsError) {
      throw new Error(`Failed to fetch events: ${eventsError.message}`);
    }

    if (!events || events.length === 0) {
      console.log(`No events found for ${dayStr}`);
      return {
        day: dayStr,
        users: 0,
        totalEvents: 0,
        avgAtsScore: 0,
        exportConversion: 0,
      };
    }

    // Group events by user
    const userEvents = events.reduce((acc, event) => {
      if (!acc[event.user_hash]) {
        acc[event.user_hash] = [];
      }
      acc[event.user_hash].push(event);
      return acc;
    }, {} as Record<string, any[]>);

    const userIds = Object.keys(userEvents);
    const totalEvents = events.length;

    // Calculate metrics per user
    const userMetrics = userIds.map(userHash => {
      const userEventList = userEvents[userHash];
      
      // Count different event types
      const eventTypes = userEventList.reduce((acc, event) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Calculate ATS scores from events
      const atsScores = userEventList
        .filter(event => event.metadata?.atsScore)
        .map(event => event.metadata.atsScore);

      const avgAtsScore = atsScores.length > 0 
        ? atsScores.reduce((sum, score) => sum + score, 0) / atsScores.length 
        : null;

      // Calculate export conversion (exports / interview completions)
      const interviewCompletions = eventTypes.INTERVIEW_COMPLETED || 0;
      const pdfExports = eventTypes.PDF_EXPORTED || 0;
      const exportConversion = interviewCompletions > 0 ? pdfExports / interviewCompletions : 0;

      return {
        user_hash: userHash,
        resumes_created: eventTypes.INTERVIEW_COMPLETED || 0,
        versions_created: (eventTypes.INTERVIEW_COMPLETED || 0) + (eventTypes.JD_ALIGNED || 0),
        avg_ats_score: avgAtsScore,
        export_conversion: exportConversion,
        mentor_accept_rate: 0, // TODO: Calculate from mentor approval events
      };
    });

    // Calculate global averages
    const validAtsScores = userMetrics
      .map(m => m.avg_ats_score)
      .filter(score => score !== null) as number[];

    const globalAvgAts = validAtsScores.length > 0
      ? validAtsScores.reduce((sum, score) => sum + score, 0) / validAtsScores.length
      : 0;

    const globalExportConversion = userMetrics.length > 0
      ? userMetrics.reduce((sum, m) => sum + m.export_conversion, 0) / userMetrics.length
      : 0;

    // Upsert metrics for each user
    for (const userMetric of userMetrics) {
      const { error: upsertError } = await supabaseServer
        .from('resume_metrics_daily')
        .upsert({
          day: dayStr,
          user_hash: userMetric.user_hash,
          resumes_created: userMetric.resumes_created,
          versions_created: userMetric.versions_created,
          avg_ats_score: userMetric.avg_ats_score,
          export_conversion: userMetric.export_conversion,
          mentor_accept_rate: userMetric.mentor_accept_rate,
        }, {
          onConflict: 'day,user_hash'
        });

      if (upsertError) {
        console.error(`Failed to upsert metrics for user ${userMetric.user_hash}:`, upsertError);
      }
    }

    // Also create a global aggregate (user_hash = null)
    const { error: globalUpsertError } = await supabaseServer
      .from('resume_metrics_daily')
      .upsert({
        day: dayStr,
        user_hash: null,
        resumes_created: userMetrics.reduce((sum, m) => sum + m.resumes_created, 0),
        versions_created: userMetrics.reduce((sum, m) => sum + m.versions_created, 0),
        avg_ats_score: globalAvgAts,
        export_conversion: globalExportConversion,
        mentor_accept_rate: 0,
      }, {
        onConflict: 'day,user_hash'
      });

    if (globalUpsertError) {
      console.error('Failed to upsert global metrics:', globalUpsertError);
    }

    console.log(`Rollup completed for ${dayStr}: ${userIds.length} users, ${totalEvents} events`);

    return {
      day: dayStr,
      users: userIds.length,
      totalEvents,
      avgAtsScore: globalAvgAts,
      exportConversion: globalExportConversion,
    };

  } catch (error) {
    console.error('Metrics rollup error:', error);
    throw error;
  }
}

/**
 * Roll up metrics for multiple days
 */
export async function rollupMetricsForDateRange(startDate: string, endDate: string): Promise<RollupResult[]> {
  const results: RollupResult[] = [];
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  
  let current = start;
  while (current <= end) {
    try {
      const result = await rollupMetricsForDay(format(current, 'yyyy-MM-dd'));
      results.push(result);
    } catch (error) {
      console.error(`Failed to rollup metrics for ${format(current, 'yyyy-MM-dd')}:`, error);
    }
    current = new Date(current.getTime() + 24 * 60 * 60 * 1000); // Add 1 day
  }
  
  return results;
}
