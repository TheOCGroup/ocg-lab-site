import crypto from "crypto";
import fs from "fs";
import path from "path";

const BUCKET_NAME = "ocg-pipeline-reactor-assets";
const OBJECT_NAME = "os/canonical_state.json";

let cachedAccessToken = null;
let tokenExpiresAt = 0;

function decryptCredentials(founderKeyHex) {
  try {
    const encPath = path.join(process.cwd(), "api/os/gcs_adc.enc.json");
    let encRaw;
    if (fs.existsSync(encPath)) {
      encRaw = fs.readFileSync(encPath, "utf8");
    } else {
      // Fallback for different execution contexts
      encRaw = fs.readFileSync(path.resolve("./api/os/gcs_adc.enc.json"), "utf8");
    }
    const encObj = JSON.parse(encRaw);

    const key = Buffer.from(founderKeyHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(encObj.iv, "hex"));
    decipher.setAuthTag(Buffer.from(encObj.authTag, "hex"));
    let dec = decipher.update(encObj.encryptedData, "hex", "utf8");
    dec += decipher.final("utf8");
    return JSON.parse(dec);
  } catch (err) {
    return null;
  }
}

async function getGoogleAccessToken(creds) {
  if (cachedAccessToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedAccessToken;
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: creds.client_id,
      client_secret: creds.client_secret,
      refresh_token: creds.refresh_token,
      grant_type: "refresh_token"
    }).toString()
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google token refresh failed: ${res.status} - ${errText}`);
  }

  const data = await res.json();
  cachedAccessToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;
  return cachedAccessToken;
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-founder-key");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Phase 6 Security Gate: Founder Authentication Required
  const authHeader = req.headers["authorization"] || req.headers["x-founder-key"] || req.query?.key || "";
  const founderKey = String(authHeader).replace(/^Bearer\s+/i, "").trim();

  const creds = decryptCredentials(founderKey);
  if (!creds) {
    return res.status(401).json({
      error: "UNAUTHORIZED_FOUNDER_ACCESS",
      message: "Explicit Founder authentication key required to access OCG LAB OS cloud operational state."
    });
  }

  try {
    const accessToken = await getGoogleAccessToken(creds);

    // GET: Retrieve Canonical Cloud State from GCS
    if (req.method === "GET") {
      const url = `https://storage.googleapis.com/storage/v1/b/${BUCKET_NAME}/o/${encodeURIComponent(OBJECT_NAME)}?alt=media`;
      const gcsRes = await fetch(url, {
        headers: { "Authorization": `Bearer ${accessToken}` }
      });

      if (gcsRes.status === 404) {
        return res.status(404).json({ exists: false, message: "No cloud state found" });
      }

      if (!gcsRes.ok) {
        const errText = await gcsRes.text();
        return res.status(502).json({ error: "GCS_READ_FAILED", details: errText });
      }

      const state = await gcsRes.json();
      return res.status(200).json({
        ok: true,
        source: "google_cloud_storage",
        bucket: BUCKET_NAME,
        object: OBJECT_NAME,
        syncedAt: state.lastSyncedAt || new Date().toISOString(),
        version: state.version || "3.0.0",
        state
      });
    }

    // POST: Persist Canonical Cloud State to GCS
    if (req.method === "POST") {
      const body = req.body;
      if (!body || typeof body !== "object") {
        return res.status(400).json({ error: "INVALID_PAYLOAD", message: "JSON body required" });
      }

      const cloudState = {
        ...body,
        version: body.version || "3.0.0",
        lastSyncedAt: new Date().toISOString(),
        syncActor: "Genaro Ocasio (Founder)"
      };

      const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${BUCKET_NAME}/o?uploadType=media&name=${encodeURIComponent(OBJECT_NAME)}`;
      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cloudState)
      });

      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        return res.status(502).json({ error: "GCS_WRITE_FAILED", details: errText });
      }

      return res.status(200).json({
        ok: true,
        source: "google_cloud_storage",
        bucket: BUCKET_NAME,
        object: OBJECT_NAME,
        lastSyncedAt: cloudState.lastSyncedAt,
        version: cloudState.version
      });
    }

    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  } catch (err) {
    console.error("[api/os/sync] Internal Error:", err);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR", message: err.message });
  }
}
