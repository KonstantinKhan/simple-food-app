import MeasuresPageClient from "@/components/admin/MeasuresPageClient";
import measuresService from "@/lib/services/measures-service";
import { ApiError } from "@/lib/api-client";
import type { MeasureDetail } from "@/types/measures";

const MeasuresPage = async () => {
  let measures: MeasureDetail[];
  let error: string | null = null;

  try {
    measures = await measuresService.getMeasures();
  } catch (err) {
    error = err instanceof ApiError
      ? err.message
      : 'Failed to load measures. Please check your North API connection.';
    measures = [];
  }

  // Extract unique locales from all measures
  const availableLocales = Array.from(
    new Set(
      measures.flatMap((measure) =>
        measure.translations.map((t) => t.locale)
      )
    )
  );

  // Default locale or fallback to first available
  const defaultLocale = availableLocales.includes('en')
    ? 'en'
    : availableLocales[0] || 'en';

  return (
    <main className="min-h-screen w-full bg-white dark:bg-black">
      <div className="p-8">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-200 mb-6">
            <p className="font-semibold">Error loading measures</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}
        <MeasuresPageClient
          measures={measures}
          availableLocales={availableLocales}
          defaultLocale={defaultLocale}
        />
      </div>
    </main>
  );
};

export default MeasuresPage;


