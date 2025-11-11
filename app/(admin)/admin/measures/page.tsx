import MeasuresView from "@/components/admin/MeasuresView";
import type { MeasureDetail } from "@/types/measures";

const sampleMeasures: MeasureDetail[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    code: "GRAM",
    translations: [
      { locale: "en", measureName: "Gram", measureShortName: "g" },
      { locale: "ru", measureName: "Грамм", measureShortName: "г" }
    ]
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    code: "KILOGRAM",
    translations: [
      { locale: "en", measureName: "Kilogram", measureShortName: "kg" },
      { locale: "ru", measureName: "Килограмм", measureShortName: "кг" }
    ]
  }
];

const MeasuresPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-5xl flex-col gap-8 py-16 px-8 bg-white dark:bg-black">
        <MeasuresView
          measures={sampleMeasures}
          availableLocales={["en", "ru"]}
          defaultLocale="en"
        />
      </main>
    </div>
  );
};

export default MeasuresPage;


