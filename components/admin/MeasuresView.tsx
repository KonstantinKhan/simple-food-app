"use client";

import React from "react";
import type { MeasureDetail, MeasureTranslation } from "../../types/measures";

type MeasuresViewProps = {
  measures: MeasureDetail[];
  availableLocales?: string[];
  defaultLocale?: string;
  onCreate?: () => void;
  onEdit?: (measure: MeasureDetail) => void;
  onDelete?: (measure: MeasureDetail) => void;
};

const findTranslationByLocale = (
  translations: MeasureTranslation[],
  locale?: string
): MeasureTranslation | undefined => {
  if (!locale) return undefined;
  return translations.find(t => t.locale === locale);
};

const measureMatchesSearch = (
  measure: MeasureDetail,
  query: string
): boolean => {
  if (!query) return true;
  const q = query.toLowerCase();
  if (measure.code.toLowerCase().includes(q)) return true;
  return measure.translations.some(
    t =>
      t.measureName.toLowerCase().includes(q) ||
      t.measureShortName.toLowerCase().includes(q) ||
      t.locale.toLowerCase().includes(q)
  );
};

const measureMatchesLocale = (
  measure: MeasureDetail,
  locale?: string
): boolean => {
  if (!locale) return true;
  return measure.translations.some(t => t.locale === locale);
};

export const MeasuresView: React.FC<MeasuresViewProps> = ({
  measures,
  availableLocales = [],
  defaultLocale,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const [search, setSearch] = React.useState<string>("");
  const [locale, setLocale] = React.useState<string | undefined>(defaultLocale);

  const filtered = React.useMemo(
    () =>
      measures
        .filter(m => measureMatchesLocale(m, locale))
        .filter(m => measureMatchesSearch(m, search))
        .sort((a, b) => a.code.localeCompare(b.code)),
    [measures, locale, search]
  );

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">Measures</h2>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by code, name, short name, locale"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-zinc-900 dark:text-gray-100"
          />
          <select
            value={locale ?? ""}
            onChange={e => setLocale(e.target.value || undefined)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-zinc-900 dark:text-gray-100"
          >
            <option value="">All locales</option>
            {availableLocales.map(loc => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onCreate}
            className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Create
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Translations
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Name (selected locale)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Short (selected locale)
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-black">
            {filtered.map(m => {
              const t = findTranslationByLocale(m.translations, locale);
              return (
                <tr key={m.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {m.code}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {m.translations.length}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {t?.measureName ?? <span className="text-gray-400">—</span>}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {t?.measureShortName ?? (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit?.(m)}
                        className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-zinc-900"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete?.(m)}
                        className="rounded-md border border-red-300 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                  colSpan={5}
                >
                  No measures found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeasuresView;
