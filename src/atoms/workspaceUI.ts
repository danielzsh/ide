import { atom } from 'jotai';
import { JudgeSuccessResult } from '../types/judge';
import { ProblemData } from '../components/Workspace/Workspace';

import { judgePrefix } from '../components/JudgeInterface/JudgeInterface';

export const mobileActiveTabAtom = atom<'code' | 'io' | 'users'>('code');
export const showSidebarAtom = atom<boolean>(false);
export const judgeResultsAtom = atom<(JudgeSuccessResult | null)[]>([]);
export const inputTabAtom = atom<string>('input');
export const problemDataAtom = atom<ProblemData | null | undefined>(undefined);
export const tabsListAtom = atom(get => {
  const getSamplesList = (length: number) => {
    const res = [];
    if (length === 1) {
      res.push({ label: `Sample`, value: `Sample` });
    } else {
      // only number samples if >1
      for (let i = 1; i <= length; ++i)
        res.push({ label: `Sample ${i}`, value: `Sample ${i}` });
    }
    return res;
  };
  const problemData = get(problemDataAtom);
  return [
    { label: 'Input', value: 'input' },
    ...(problemData !== undefined
      ? [{ label: 'USACO Judge', value: 'judge' }]
      : []),
    ...(problemData?.samples
      ? getSamplesList(problemData?.samples.length)
      : []),
  ];
});
export const inputTabIndexAtom = atom(get => {
  const inputTab = get(inputTabAtom);
  const tabsList = get(tabsListAtom);
  let res = 0;
  while (res < tabsList.length && tabsList[res].value !== inputTab) ++res;
  return res;
});

// https://github.com/pmndrs/jotai#derived-async-atoms-
// https://docs.pmnd.rs/jotai/basics/async#suspense
export const allProblemDataAtom = atom(async get => {
  const response = await fetch(`${judgePrefix}/problems`);
  const json: Record<string, ProblemData> = await response.json();
  return json;
});
