import os

# ===== CONFIGURATION =====
DIRECTORY = "C:\Users\caval\Documents\GitHub_Rep\phoneme\Normalized\phoneme"
EXTENSIONS = {".wav"}  # adjust if needed

IPA_TO_SAMPA = {
    "tʃ": "tS",
    "dʒ": "dZ",
    "ʃ": "S",
    "ʒ": "Z",
    "θ": "T",
    "ð": "D",
    "ŋ": "N",
    "ɲ": "J",
    "ɹ": "r",
    "ɾ": "4",
    "ʔ": "?",
    "i": "i",
    "ɪ": "I",
    "e": "e",
    "ɛ": "E",
    "æ": "{",
    "ɑ": "A",
    "ɒ": "Q",
    "ɔ": "O",
    "o": "o",
    "ʊ": "U",
    "u": "u",
    "ʌ": "V",
    "ə": "@",
    "ɒ":"Q",
    }

# ===== SCRIPT =====

def ipa_to_sampa(text):
    # Replace longer IPA sequences first
    for ipa in sorted(IPA_TO_SAMPA, key=len, reverse=True):
        text = text.replace(ipa, IPA_TO_SAMPA[ipa])
    return text


for filename in os.listdir(DIRECTORY):
    base, ext = os.path.splitext(filename)

    if ext.lower() not in EXTENSIONS:
        continue

    new_base = ipa_to_sampa(base)
    new_filename = new_base + ext

    if new_filename == filename:
        continue

    old_path = os.path.join(DIRECTORY, filename)
    new_path = os.path.join(DIRECTORY, new_filename)

    if os.path.exists(new_path):
        print(f"⚠️ Skipping (already exists): {new_filename}")
        continue

    print(f"Renaming: {filename} → {new_filename}")
    print(f"WOULD RENAME: {filename} → {new_filename}")