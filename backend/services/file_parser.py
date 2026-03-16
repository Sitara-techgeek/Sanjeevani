"""
AI-powered file parser using Ollama (local LLM).
Converts raw text files into structured hospital / blood bank JSON.
"""
import ollama
import json
import os
from dotenv import load_dotenv

load_dotenv()
MODEL = os.getenv("OLLAMA_MODEL", "mistral")

HOSPITAL_PROMPT = """
You are a medical data extraction assistant.
Extract hospital information from the text below and return ONLY a valid JSON array — no extra text, no markdown.

Each hospital object MUST include these exact keys:
  name (string),
  address (string or null),
  latitude (float or null),
  longitude (float or null),
  beds_available (int, default 0),
  icu_available (bool),
  emergency_status (string: "Active" or "Inactive"),
  phone (string or null),
  trauma_specialist (bool),
  has_general_surgeon (bool),
  has_cardiologist (bool),
  has_cardiothoracic_surgeon (bool),
  has_neurosurgeon (bool),
  has_gynaecologist (bool),
  has_burn_specialist (bool),
  has_orthopaedic_surgeon (bool),
  has_toxicologist (bool)

Set specialist booleans to true only if explicitly mentioned.
Set unknown fields to false or null.

Text:
{text}

Return ONLY the JSON array.
"""

BLOOD_BANK_PROMPT = """
You are a medical data extraction assistant.
Extract blood bank information from the text below and return ONLY a valid JSON array — no extra text, no markdown.

Each blood bank object MUST include these exact keys:
  name (string),
  address (string or null),
  latitude (float or null),
  longitude (float or null),
  phone (string or null),
  a_pos (int, units available),
  a_neg (int),
  b_pos (int),
  b_neg (int),
  ab_pos (int),
  ab_neg (int),
  o_pos (int),
  o_neg (int)

Set unknown blood group quantities to 0.

Text:
{text}

Return ONLY the JSON array.
"""


def _strip_fences(raw: str) -> str:
    """Strip markdown code fences if the LLM wraps output in them."""
    raw = raw.strip()
    if raw.startswith("```"):
        lines = raw.split("\n")
        # Remove first line (```json or ```) and last line (```)
        lines = lines[1:] if lines[0].startswith("```") else lines
        lines = lines[:-1] if lines and lines[-1].strip() == "```" else lines
        raw = "\n".join(lines).strip()
    return raw


def parse_file_with_ai(text: str, data_type: str) -> list:
    """
    Send file text to local Ollama LLM and parse the result into a list of dicts.
    data_type: "hospital" | "blood_bank"
    """
    if data_type == "hospital":
        prompt = HOSPITAL_PROMPT.format(text=text[:5000])
    else:
        prompt = BLOOD_BANK_PROMPT.format(text=text[:5000])

    response = ollama.chat(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = response["message"]["content"]
    raw = _strip_fences(raw)

    return json.loads(raw)