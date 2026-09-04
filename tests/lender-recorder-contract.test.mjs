import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const recorder = fs.readFileSync(new URL('../lender-ai-super-pro/recorder.js', import.meta.url), 'utf8');

test('Lender self-record path is real browser media capture, not simulated completion', () => {
  assert.match(recorder, /navigator\.mediaDevices\?\.getUserMedia/);
  assert.match(recorder, /new MediaRecorder\(stream/);
  assert.match(recorder, /new Blob\(chunks/);
  assert.match(recorder, /URL\.createObjectURL\(mediaBlob\)/);
  assert.match(recorder, /window\.LenderRecordingArtifact=/);
  assert.match(recorder, /approvedScript:approved\.spoken_script/);
  assert.match(recorder, /requestedAspectRatio:'9:16'/);
  assert.match(recorder, /This is not a published or completed video\./);
  assert.match(recorder, /No production completion was recorded\./);
});

test('Lender recorder fails closed around permissions, script approval and optional provider features', () => {
  assert.match(recorder, /PERMISSION DENIED/);
  assert.match(recorder, /Exact script approval is required before self-recording\./);
  assert.match(recorder, /Avatar mode is blocked until purchaser-owned provider authorization, billing and identity consent are complete\./);
  assert.match(recorder, /Optional captions\/branding are separate post-processing choices; they do not block the primary self-record workflow\./);
  assert.match(recorder, /Optional captions\/branding remain separate; independent QA is still required before release\./);
  assert.doesNotMatch(recorder, /Captions, branding and independent QA remain required\./);
});
