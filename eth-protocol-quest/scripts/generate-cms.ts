import fs from 'node:fs';
import path from 'node:path';
import { glossary } from '../src/data/glossary';
import { foundationChapters } from '../src/data/curriculum/foundations';
import { deepDiveChapters } from '../src/data/curriculum/deepdives';
import { chapterAssessments } from '../src/data/chapterAssessments';

const out = path.resolve('public/cms');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'glossary.json'), JSON.stringify(glossary, null, 2));
fs.writeFileSync(path.join(out, 'chapters.json'), JSON.stringify([...foundationChapters, ...deepDiveChapters], null, 2));
fs.writeFileSync(path.join(out, 'assessments.json'), JSON.stringify(chapterAssessments, null, 2));
console.log('cms generated');
