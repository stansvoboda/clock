import { test } from 'vitest';
import assert from 'node:assert/strict';

import { label, taskText, diagnose, lessonFor } from './quiz.js';

test('tasks alternate between digits and Czech words', () => {
  assert.equal(label(0), '12:00');
  assert.equal(label(900), '15:00');
  assert.equal(taskText(465, false), '7:45');
  assert.equal(taskText(465, true), 'tři čtvrtě na osm');
  assert.equal(taskText(450, true), 'půl osmé');
});

test('diagnosis names the wrong hand in child terms', () => {
  assert.equal(diagnose(465, 465), null);
  assert.equal(
    diagnose(285, 465), // 4:45 vs 7:45
    'Dlouhá ručička je správně. Krátká ukazuje skoro na 5, má ukazovat skoro na 8.',
  );
  assert.equal(diagnose(420, 465), 'Krátká ručička je správně. Dlouhá ukazuje na 12, má ukazovat na 9.');
  assert.equal(diagnose(195, 450), 'Začni dlouhou ručičkou: ukazuje na 3, má ukazovat na 6.');
  assert.equal(diagnose(0, 210), 'Začni dlouhou ručičkou: ukazuje na 12, má ukazovat na 6.');
  assert.equal(diagnose(690, 30), 'Dlouhá ručička je správně. Krátká ukazuje mezi 11 a 12, má ukazovat mezi 12 a 1.');
});

test('each task points back to the lesson that explains it', () => {
  assert.equal(lessonFor(180), 2);
  assert.equal(lessonFor(450), 3);
  assert.equal(lessonFor(465), 4);
  assert.equal(lessonFor(200), 5);
});
