/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ToeflTest } from '../types/toefl.ts';

/**
 * Returns a test that has different information from currentTestId.
 * Prioritizes tests the user has never practiced, or the least recently practiced test.
 */
export function getNextUnrepeatedTest(
  currentTestId: string,
  availableTests: ToeflTest[],
  pastAttemptTestIds: string[] = [],
): ToeflTest {
  if (availableTests.length === 0) {
    throw new Error('No available tests in library');
  }
  if (availableTests.length === 1) {
    return availableTests[0];
  }

  // 1. Filter out current test
  const otherTests = availableTests.filter((t) => t.id !== currentTestId);

  // 2. Look for tests never attempted yet
  const unattemptedTests = otherTests.filter(
    (t) => !pastAttemptTestIds.includes(t.id),
  );

  if (unattemptedTests.length > 0) {
    // Pick first unattempted or random unattempted
    return unattemptedTests[0];
  }

  // 3. If all tests have been attempted, find the one attempted longest ago
  const reversedAttempts = [...pastAttemptTestIds].reverse();
  const sortedByOldest = [...otherTests].sort((a, b) => {
    const lastA = reversedAttempts.indexOf(a.id);
    const lastB = reversedAttempts.indexOf(b.id);
    // Bigger index means further in the past
    return lastB - lastA;
  });

  return sortedByOldest[0] || otherTests[0];
}

/**
 * Pick a random test different from currentTestId
 */
export function getRandomDifferentTest(
  currentTestId: string,
  availableTests: ToeflTest[],
): ToeflTest {
  const otherTests = availableTests.filter((t) => t.id !== currentTestId);
  if (otherTests.length === 0) return availableTests[0];
  const randIdx = Math.floor(Math.random() * otherTests.length);
  return otherTests[randIdx];
}
